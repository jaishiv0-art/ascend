// ==============================================================================
// ASCEND - ACHIEVEMENTS ENGINE & EVALUATOR
// ==============================================================================

import { Achievement, Attributes } from '@/types/rpg';

export const STATIC_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-quest',
    code: 'FIRST_QUEST',
    title: 'The Awakening',
    description: 'Complete your very first quest in ASCEND.',
    category: 'General',
    icon: 'Zap',
    reward_xp: 100,
    reward_gold: 50,
    target_metric: 'quests_completed',
    threshold: 1,
  },
  {
    id: 'ach-level-5',
    code: 'LEVEL_5',
    title: 'Rising Seeker',
    description: 'Reach Character Level 5 through disciplined effort.',
    category: 'General',
    icon: 'TrendingUp',
    reward_xp: 200,
    reward_gold: 100,
    target_metric: 'level_reached',
    threshold: 5,
  },
  {
    id: 'ach-level-10',
    code: 'LEVEL_10',
    title: 'Adept Ascendant',
    description: 'Reach Character Level 10 and unlock Adept status.',
    category: 'General',
    icon: 'Award',
    reward_xp: 500,
    reward_gold: 250,
    target_metric: 'level_reached',
    threshold: 10,
  },
  {
    id: 'ach-level-25',
    code: 'LEVEL_25',
    title: 'Grand Paragon',
    description: 'Reach Character Level 25 and attain Grandmaster rank.',
    category: 'General',
    icon: 'Crown',
    reward_xp: 1500,
    reward_gold: 750,
    target_metric: 'level_reached',
    threshold: 25,
  },
  {
    id: 'ach-quests-10',
    code: 'QUESTS_10',
    title: 'Quest Apprentice',
    description: 'Complete 10 quests across any life categories.',
    category: 'Quests',
    icon: 'CheckCircle2',
    reward_xp: 250,
    reward_gold: 100,
    target_metric: 'quests_completed',
    threshold: 10,
  },
  {
    id: 'ach-quests-50',
    code: 'QUESTS_50',
    title: 'Task Eradicator',
    description: 'Complete 50 life quests with precision.',
    category: 'Quests',
    icon: 'Swords',
    reward_xp: 800,
    reward_gold: 400,
    target_metric: 'quests_completed',
    threshold: 50,
  },
  {
    id: 'ach-quests-100',
    code: 'QUESTS_100',
    title: 'Centurion of Action',
    description: 'Complete 100 quests in your ASCEND journey.',
    category: 'Quests',
    icon: 'Flame',
    reward_xp: 2000,
    reward_gold: 1000,
    target_metric: 'quests_completed',
    threshold: 100,
  },
  {
    id: 'ach-streak-3',
    code: 'STREAK_3',
    title: 'Momentum Spark',
    description: 'Maintain a 3-day quest completion streak.',
    category: 'Streaks',
    icon: 'Flame',
    reward_xp: 150,
    reward_gold: 75,
    target_metric: 'streak_days',
    threshold: 3,
  },
  {
    id: 'ach-streak-7',
    code: 'STREAK_7',
    title: 'Unbroken Week',
    description: 'Sustain a perfect 7-day daily execution streak.',
    category: 'Streaks',
    icon: 'Sparkles',
    reward_xp: 400,
    reward_gold: 200,
    target_metric: 'streak_days',
    threshold: 7,
  },
  {
    id: 'ach-streak-30',
    code: 'STREAK_30',
    title: 'Habit Titan',
    description: 'Achieve a legendary 30-day streak of relentless consistency.',
    category: 'Streaks',
    icon: 'Trophy',
    reward_xp: 1500,
    reward_gold: 800,
    target_metric: 'streak_days',
    threshold: 30,
  },
  {
    id: 'ach-intellect-100',
    code: 'INTELLECT_100',
    title: 'Neural Mastery',
    description: 'Accumulate 300+ Intellect XP from deep work and learning.',
    category: 'Attributes',
    icon: 'Brain',
    reward_xp: 300,
    reward_gold: 150,
    target_metric: 'attribute_intellect',
    threshold: 300,
  },
  {
    id: 'ach-strength-100',
    code: 'STRENGTH_100',
    title: 'Titan Physiology',
    description: 'Accumulate 300+ Strength or Vitality XP from health and workouts.',
    category: 'Attributes',
    icon: 'Activity',
    reward_xp: 300,
    reward_gold: 150,
    target_metric: 'attribute_physical',
    threshold: 300,
  },
  {
    id: 'ach-gold-1000',
    code: 'GOLD_1000',
    title: 'Guild Merchant',
    description: 'Accumulate 500+ Gold in your treasury balance.',
    category: 'Economy',
    icon: 'Coins',
    reward_xp: 500,
    reward_gold: 250,
    target_metric: 'gold_balance',
    threshold: 500,
  },
  {
    id: 'ach-shop-patron',
    code: 'SHOP_PATRON',
    title: 'Grid Shopper',
    description: 'Acquire your first item or cosmetic from the Guild Shop.',
    category: 'Economy',
    icon: 'ShoppingBag',
    reward_xp: 200,
    reward_gold: 100,
    target_metric: 'items_purchased',
    threshold: 1,
  },
];

export interface AchievementEvaluationParams {
  questsCompletedCount: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  goldBalance: number;
  attributes: Attributes;
  itemsPurchasedCount: number;
  unlockedAchievementCodes: string[];
}

/**
 * Evaluates state and returns any new achievements that were unlocked
 */
export function evaluateNewAchievements(params: AchievementEvaluationParams): Achievement[] {
  const {
    questsCompletedCount,
    currentStreak,
    longestStreak,
    level,
    goldBalance,
    attributes,
    itemsPurchasedCount,
    unlockedAchievementCodes,
  } = params;

  const unlockedSet = new Set(unlockedAchievementCodes);
  const newlyUnlocked: Achievement[] = [];

  for (const ach of STATIC_ACHIEVEMENTS) {
    if (unlockedSet.has(ach.code)) continue;

    let satisfied = false;

    switch (ach.target_metric) {
      case 'quests_completed':
        satisfied = questsCompletedCount >= ach.threshold;
        break;
      case 'level_reached':
        satisfied = level >= ach.threshold;
        break;
      case 'streak_days':
        satisfied = Math.max(currentStreak, longestStreak) >= ach.threshold;
        break;
      case 'attribute_intellect':
        satisfied = (attributes.intellect_xp || 0) >= ach.threshold;
        break;
      case 'attribute_physical':
        satisfied = ((attributes.strength_xp || 0) + (attributes.vitality_xp || 0)) >= ach.threshold;
        break;
      case 'gold_balance':
        satisfied = goldBalance >= ach.threshold;
        break;
      case 'items_purchased':
        satisfied = itemsPurchasedCount >= ach.threshold;
        break;
    }

    if (satisfied) {
      newlyUnlocked.push(ach);
    }
  }

  return newlyUnlocked;
}
