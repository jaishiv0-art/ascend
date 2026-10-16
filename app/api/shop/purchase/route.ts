// ==============================================================================
// ASCEND - GUILD SHOP PURCHASE API (Server-Authoritative Validation)
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { validatePurchase, STATIC_SHOP_ITEMS } from '@/lib/progression/economy';
import { evaluateNewAchievements } from '@/lib/progression/achievements';
import { InventoryItem, Profile, Attributes, Streak } from '@/types/rpg';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    // 1. Fetch current profile & inventory
    const [profileRes, inventoryRes, streakRes, attrRes, userAchRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('inventory').select('*').eq('user_id', user.id),
      supabase.from('streaks').select('*').eq('user_id', user.id).single(),
      supabase.from('attributes').select('*').eq('user_id', user.id).single(),
      supabase.from('user_achievements').select('achievement_id, achievements(code)').eq('user_id', user.id),
    ]);

    const profile: Profile = profileRes.data || {
      id: user.id,
      user_id: user.id,
      username: 'Ascendant',
      archetype: 'Cyber Mage',
      avatar_url: '/avatars/mage.png',
      level: 1,
      xp: 0,
      gold: 150,
      title: 'Novice Seeker',
      theme: 'cyberpunk',
      sound_enabled: true,
      timezone: 'UTC',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const userInventory: InventoryItem[] = inventoryRes.data || [];

    // 2. Server-Authoritative Purchase Validation
    const validation = validatePurchase({
      itemId,
      currentGold: profile.gold,
      userInventory,
    });

    if (!validation.valid || !validation.item) {
      return NextResponse.json({ error: validation.errorMessage || 'Purchase invalid' }, { status: 400 });
    }

    const item = validation.item;
    const newGold = validation.newGoldBalance;
    const nowIso = new Date().toISOString();

    // 3. Process item effect
    if (item.effect_type === 'streak_freeze') {
      const streakRecord: Streak = streakRes.data || {
        id: user.id,
        user_id: user.id,
        current_streak: 0,
        longest_streak: 0,
        last_completed_date: null,
        streak_freeze_count: 0,
        updated_at: nowIso,
      };
      await supabase
        .from('streaks')
        .update({
          streak_freeze_count: Math.min(3, streakRecord.streak_freeze_count + 1),
          updated_at: nowIso,
        })
        .eq('user_id', user.id);
    }

    // 4. Update Profile Gold
    await supabase
      .from('profiles')
      .update({
        gold: newGold,
        updated_at: nowIso,
      })
      .eq('user_id', user.id);

    // 5. Add to Inventory
    let inventoryRecord: InventoryItem;
    const existingIndex = userInventory.findIndex((i) => i.item_id === item.id);

    if (existingIndex >= 0 && item.category === 'Consumable') {
      const newQty = (userInventory[existingIndex].quantity || 1) + 1;
      const { data } = await supabase
        .from('inventory')
        .update({ quantity: newQty })
        .eq('user_id', user.id)
        .eq('item_id', item.id)
        .select()
        .single();
      inventoryRecord = data || {
        id: userInventory[existingIndex].id,
        user_id: user.id,
        item_id: item.id,
        is_equipped: false,
        quantity: newQty,
        acquired_at: nowIso,
        item,
      };
    } else {
      const { data } = await supabase
        .from('inventory')
        .insert({
          user_id: user.id,
          item_id: item.id,
          is_equipped: false,
          quantity: 1,
          acquired_at: nowIso,
        })
        .select()
        .single();
      inventoryRecord = data || {
        id: `inv-${Date.now()}`,
        user_id: user.id,
        item_id: item.id,
        is_equipped: false,
        quantity: 1,
        acquired_at: nowIso,
        item,
      };
    }

    // 6. Log transaction
    await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'shop_purchase',
      amount: -item.price,
      currency: 'gold',
      description: `Purchased: ${item.name}`,
      created_at: nowIso,
    });

    // 7. Check Shop Patron Achievement
    const unlockedCodes: string[] = ((userAchRes.data || []) as unknown as Array<{ achievements?: { code?: string } | { code?: string }[] }>)
      .map((ua) => {
        if (!ua.achievements) return undefined;
        if (Array.isArray(ua.achievements)) {
          return ua.achievements[0]?.code;
        }
        return ua.achievements.code;
      })
      .filter((code): code is string => Boolean(code));

    const newlyUnlocked = evaluateNewAchievements({
      questsCompletedCount: 0,
      currentStreak: streakRes.data?.current_streak || 0,
      longestStreak: streakRes.data?.longest_streak || 0,
      level: profile.level,
      goldBalance: newGold,
      attributes: attrRes.data || {
        id: user.id,
        user_id: user.id,
        intellect_xp: 0,
        strength_xp: 0,
        vitality_xp: 0,
        discipline_xp: 0,
        creativity_xp: 0,
        charisma_xp: 0,
        updated_at: nowIso,
      },
      itemsPurchasedCount: userInventory.length + 1,
      unlockedAchievementCodes: unlockedCodes,
    });

    return NextResponse.json({
      success: true,
      item,
      inventoryItem: inventoryRecord,
      newGold,
      unlockedAchievements: newlyUnlocked,
      message: `Successfully acquired ${item.name}!`,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
