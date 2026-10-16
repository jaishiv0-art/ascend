// ==============================================================================
// ASCEND - SERVER-AUTHORITATIVE QUEST COMPLETION ENGINE
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { calculateAuthoritativeRewards } from '@/lib/progression/rewards';
import { calculateLevelFromXP } from '@/lib/progression/levels';
import { evaluateStreakOnCompletion, getFormattedDateString } from '@/lib/progression/streaks';
import { evaluateNewAchievements } from '@/lib/progression/achievements';
import { Profile, Attributes, Streak, Quest, QuestCompletionResult } from '@/types/rpg';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questId } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch Quest & verify ownership
    const { data: quest, error: questError } = await supabase
      .from('quests')
      .select('*')
      .eq('id', questId)
      .eq('user_id', user.id)
      .single();

    if (questError || !quest) {
      return NextResponse.json({ error: 'Quest not found or not owned by user' }, { status: 404 });
    }

    // 2. Prevent double-completion
    if (!quest.is_recurring && quest.status === 'Completed') {
      return NextResponse.json({ error: 'Quest has already been completed' }, { status: 400 });
    }

    const todayDateStr = getFormattedDateString();

    // Check if recurring quest was already completed today
    if (quest.is_recurring) {
      const { data: alreadyDoneToday } = await supabase
        .from('quest_completions')
        .select('id')
        .eq('quest_id', quest.id)
        .eq('user_id', user.id)
        .eq('completion_date', todayDateStr)
        .maybeSingle();

      if (alreadyDoneToday) {
        return NextResponse.json({ error: 'This recurring quest has already been completed today.' }, { status: 400 });
      }
    }

    // 3. Fetch User Profile, Attributes, Streaks, Inventory (for XP potions), Achievements
    const [profileRes, attributesRes, streakRes, userAchRes, completionsCountRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('attributes').select('*').eq('user_id', user.id).single(),
      supabase.from('streaks').select('*').eq('user_id', user.id).single(),
      supabase.from('user_achievements').select('achievement_id, achievements(code)').eq('user_id', user.id),
      supabase.from('quest_completions').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
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

    const attributes: Attributes = attributesRes.data || {
      id: user.id,
      user_id: user.id,
      intellect_xp: 0,
      strength_xp: 0,
      vitality_xp: 0,
      discipline_xp: 0,
      creativity_xp: 0,
      charisma_xp: 0,
      updated_at: new Date().toISOString(),
    };

    const streakRecord: Streak = streakRes.data || {
      id: user.id,
      user_id: user.id,
      current_streak: 0,
      longest_streak: 0,
      last_completed_date: null,
      streak_freeze_count: 0,
      updated_at: new Date().toISOString(),
    };

    // 4. Server-Authoritative Reward Calculation (Client payload is completely ignored)
    const rewardCalculation = calculateAuthoritativeRewards({
      category: quest.category,
      difficulty: quest.difficulty,
      attribute: quest.attribute,
      archetype: profile.archetype,
      currentStreak: streakRecord.current_streak,
    });

    const { xpEarned, goldEarned, attributeXpEarned, archetypeBonusDescription } = rewardCalculation;

    // 5. Server-Authoritative Streak Calculation
    const streakResult = evaluateStreakOnCompletion(streakRecord, todayDateStr);

    // 6. Server-Authoritative Level Calculation
    const previousXP = profile.xp;
    const previousLevel = profile.level;
    const newXP = previousXP + xpEarned;
    const newGold = profile.gold + goldEarned;
    const newLevel = calculateLevelFromXP(newXP);
    const leveledUp = newLevel > previousLevel;

    // 7. Update Attribute XP
    const updatedAttributes = { ...attributes };
    const attrKey = `${quest.attribute.toLowerCase()}_xp` as keyof Attributes;
    if (attrKey in updatedAttributes) {
      (updatedAttributes[attrKey] as number) = ((updatedAttributes[attrKey] as number) || 0) + attributeXpEarned;
    }

    // 8. Achievements Evaluation
    const questsCompletedCount = (completionsCountRes.count || 0) + 1;
    const unlockedCodes: string[] = ((userAchRes.data || []) as unknown as Array<{ achievements?: { code?: string } | { code?: string }[] }>)
      .map((ua) => {
        if (!ua.achievements) return undefined;
        if (Array.isArray(ua.achievements)) {
          return ua.achievements[0]?.code;
        }
        return ua.achievements.code;
      })
      .filter((code): code is string => Boolean(code));

    const newlyUnlockedAchievements = evaluateNewAchievements({
      questsCompletedCount,
      currentStreak: streakResult.currentStreak,
      longestStreak: streakResult.longestStreak,
      level: newLevel,
      goldBalance: newGold,
      attributes: updatedAttributes,
      itemsPurchasedCount: 0,
      unlockedAchievementCodes: unlockedCodes,
    });

    // 9. Persist all updates to Database
    const nowIso = new Date().toISOString();

    // Mark quest completed (with atomic status check to prevent race condition)
    if (quest.is_recurring) {
      await supabase
        .from('quests')
        .update({
          updated_at: nowIso,
          completed_at: nowIso,
        })
        .eq('id', quest.id)
        .eq('user_id', user.id);
    } else {
      const { data: updatedRows, error: updateErr } = await supabase
        .from('quests')
        .update({
          status: 'Completed',
          completed_at: nowIso,
          updated_at: nowIso,
        })
        .eq('id', quest.id)
        .eq('user_id', user.id)
        .eq('status', 'Active')
        .select();

      if (updateErr || !updatedRows || updatedRows.length === 0) {
        return NextResponse.json({ error: 'Quest already completed or concurrent update conflict' }, { status: 409 });
      }
    }

    // Insert quest completion record
    await supabase.from('quest_completions').insert({
      user_id: user.id,
      quest_id: quest.id,
      xp_earned: xpEarned,
      gold_earned: goldEarned,
      attribute_earned: quest.attribute,
      attribute_xp_earned: attributeXpEarned,
      completion_date: todayDateStr,
      completed_at: nowIso,
    });

    // Update profile
    await supabase
      .from('profiles')
      .update({
        xp: newXP,
        level: newLevel,
        gold: newGold,
        updated_at: nowIso,
      })
      .eq('user_id', user.id);

    // Update attributes
    await supabase
      .from('attributes')
      .update({
        intellect_xp: updatedAttributes.intellect_xp,
        strength_xp: updatedAttributes.strength_xp,
        vitality_xp: updatedAttributes.vitality_xp,
        discipline_xp: updatedAttributes.discipline_xp,
        creativity_xp: updatedAttributes.creativity_xp,
        charisma_xp: updatedAttributes.charisma_xp,
        updated_at: nowIso,
      })
      .eq('user_id', user.id);

    // Update streaks
    await supabase
      .from('streaks')
      .update({
        current_streak: streakResult.currentStreak,
        longest_streak: streakResult.longestStreak,
        last_completed_date: streakResult.lastCompletedDate,
        updated_at: nowIso,
      })
      .eq('user_id', user.id);

    // Log transaction
    await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'quest_reward',
      amount: goldEarned,
      currency: 'gold',
      description: `Completed quest: ${quest.title}`,
      created_at: nowIso,
    });

    const completedQuest: Quest = {
      ...quest,
      status: quest.is_recurring ? 'Active' : 'Completed',
      completed_at: nowIso,
    };

    const responsePayload: QuestCompletionResult = {
      success: true,
      quest: completedQuest,
      xpEarned,
      goldEarned,
      attributeEarned: quest.attribute,
      attributeXpEarned,
      leveledUp,
      previousLevel,
      newLevel,
      previousXP,
      newXP,
      newGold,
      streakUpdated: streakResult.streakUpdated,
      currentStreak: streakResult.currentStreak,
      longestStreak: streakResult.longestStreak,
      unlockedAchievements: newlyUnlockedAchievements,
      message: archetypeBonusDescription
        ? `Quest completed! ${archetypeBonusDescription}`
        : 'Quest completed successfully!',
    };

    return NextResponse.json(responsePayload);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

