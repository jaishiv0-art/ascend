// ==============================================================================
// ASCEND - ACHIEVEMENTS CLAIM REWARD API (Server-Authoritative Validation)
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { STATIC_ACHIEVEMENTS } from '@/lib/progression/achievements';
import { calculateLevelFromXP } from '@/lib/progression/levels';
import { Profile } from '@/types/rpg';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: 'Achievement code is required' }, { status: 400 });
    }

    const achievement = STATIC_ACHIEVEMENTS.find((a) => a.code === code);
    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    // 1. Fetch user achievement status from database
    const { data: userAch } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', user.id)
      .eq('achievement_id', achievement.id)
      .maybeSingle();

    // 2. Prevent claiming already claimed achievements
    if (userAch?.is_claimed) {
      return NextResponse.json({ error: 'Reward for this achievement has already been claimed' }, { status: 400 });
    }

    // 3. Verify user actually unlocked the achievement (either record exists or check server metrics)
    if (!userAch) {
      // Check server stats to verify if user genuinely qualified
      const [profileRes, streakRes, completionsCountRes, inventoryRes, attrRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('streaks').select('*').eq('user_id', user.id).single(),
        supabase.from('quest_completions').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('inventory').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('attributes').select('*').eq('user_id', user.id).single(),
      ]);

      let qualifiedMetric = 0;
      switch (achievement.target_metric) {
        case 'quests_completed':
          qualifiedMetric = completionsCountRes.count || 0;
          break;
        case 'level_reached':
          qualifiedMetric = profileRes.data?.level || 1;
          break;
        case 'streak_days':
          qualifiedMetric = Math.max(streakRes.data?.current_streak || 0, streakRes.data?.longest_streak || 0);
          break;
        case 'gold_earned':
          qualifiedMetric = profileRes.data?.gold || 0;
          break;
        case 'items_purchased':
          qualifiedMetric = inventoryRes.count || 0;
          break;
        case 'attribute_points':
          qualifiedMetric = (attrRes.data?.intellect_xp || 0) + (attrRes.data?.strength_xp || 0);
          break;
      }

      if (qualifiedMetric < achievement.threshold) {
        return NextResponse.json({ error: 'Achievement criteria not yet fulfilled' }, { status: 403 });
      }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const currentXp = profile?.xp || 0;
    const currentGold = profile?.gold || 0;
    const currentLevel = profile?.level || 1;

    const newXp = currentXp + achievement.reward_xp;
    const newGold = currentGold + achievement.reward_gold;
    const newLevel = calculateLevelFromXP(newXp);
    const leveledUp = newLevel > currentLevel;

    const nowIso = new Date().toISOString();

    // Mark user achievement as claimed atomically
    await supabase.from('user_achievements').upsert({
      user_id: user.id,
      achievement_id: achievement.id,
      is_claimed: true,
      unlocked_at: userAch?.unlocked_at || nowIso,
      claimed_at: nowIso,
    });

    // Update profile
    await supabase
      .from('profiles')
      .update({
        xp: newXp,
        level: newLevel,
        gold: newGold,
        updated_at: nowIso,
      })
      .eq('user_id', user.id);

    // Log transaction
    await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'achievement_claim',
      amount: achievement.reward_gold,
      currency: 'gold',
      description: `Claimed reward for achievement: ${achievement.title}`,
      created_at: nowIso,
    });

    return NextResponse.json({
      success: true,
      achievement,
      rewardXp: achievement.reward_xp,
      rewardGold: achievement.reward_gold,
      newXp,
      newGold,
      newLevel,
      leveledUp,
      message: `Claimed +${achievement.reward_xp} XP and +${achievement.reward_gold} Gold!`,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

