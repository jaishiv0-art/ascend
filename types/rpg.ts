// ==============================================================================
// ASCEND - CORE RPG & GAME DOMAIN TYPES
// ==============================================================================

export type Archetype =
  | 'Cyber Mage'
  | 'Iron Titan'
  | 'Shadow Rogue'
  | 'Bio Hacker'
  | 'Astral Sage'
  | 'Nova Paladin';

export type AttributeType =
  | 'Intellect'
  | 'Strength'
  | 'Vitality'
  | 'Discipline'
  | 'Creativity'
  | 'Charisma';

export type QuestCategory =
  | 'Work'
  | 'Fitness'
  | 'Learning'
  | 'Habit'
  | 'Creative'
  | 'Social';

export type QuestDifficulty =
  | 'Easy'
  | 'Medium'
  | 'Hard'
  | 'Epic'
  | 'Legendary';

export type QuestStatus = 'Active' | 'Completed' | 'Failed' | 'Archived';

export type QuestPriority = 'Low' | 'Medium' | 'High';

export type ItemRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export type ItemCategory = 'Theme' | 'Badge' | 'Title' | 'Frame' | 'Consumable' | 'Character';

export type ThemeId =
  | 'cyberpunk'
  | 'theme-void'
  | 'theme-solar'
  | 'theme-matrix'
  | 'theme-crimson';

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  archetype: Archetype;
  avatar_url: string;
  level: number;
  xp: number;
  gold: number;
  title: string;
  theme: ThemeId | string;
  sound_enabled: boolean;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Attributes {
  id: string;
  user_id: string;
  intellect_xp: number;
  strength_xp: number;
  vitality_xp: number;
  discipline_xp: number;
  creativity_xp: number;
  charisma_xp: number;
  updated_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
  streak_freeze_count: number;
  updated_at: string;
}

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface Quest {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  attribute: AttributeType;
  xp_reward: number;
  gold_reward: number;
  status: QuestStatus;
  is_recurring: boolean;
  recurrence_interval?: 'Daily' | 'Weekly' | 'None';
  recurring_days?: Weekday[] | string[] | null;
  due_date?: string | null;
  priority?: QuestPriority;
  reminder_time?: string | null; // e.g. "08:30" (24h format HH:MM)
  reminder_enabled?: boolean;
  timer_minutes?: number | null;
  created_at: string;
  completed_at?: string | null;
  updated_at?: string;
}

export interface QuestCompletion {
  id: string;
  user_id: string;
  quest_id: string;
  xp_earned: number;
  gold_earned: number;
  attribute_earned: AttributeType;
  attribute_xp_earned: number;
  completion_date: string;
  completed_at: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  price: number;
  icon: string;
  rarity: ItemRarity;
  effect_type?: string;
  effect_value?: string;
  created_at?: string;
}

export interface InventoryItem {
  id: string;
  user_id: string;
  item_id: string;
  is_equipped: boolean;
  quantity: number;
  acquired_at: string;
  item?: ShopItem;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  reward_xp: number;
  reward_gold: number;
  target_metric: string;
  threshold: number;
  created_at?: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  is_claimed: boolean;
  unlocked_at: string;
  claimed_at?: string | null;
  achievement?: Achievement;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'quest_reward' | 'shop_purchase' | 'achievement_claim' | 'bonus' | 'streak_freeze_used';
  amount: number;
  currency: 'gold' | 'xp';
  description: string;
  created_at: string;
}

export type ArchetypeUnlockType = 'free' | 'gold' | 'goal';
export type ArchetypeGoalMetric = 'streak' | 'level' | 'quests_completed';

export interface ArchetypeDetails {
  id: Archetype;
  name: string;
  title: string;
  role: string;
  description: string;
  primaryAttribute: AttributeType;
  secondaryAttribute: AttributeType;
  avatar: string;
  color: string;
  accentGlow: string;
  lore: string;
  perk: string;
  unlock_type: ArchetypeUnlockType;
  unlock_value: number; // gold cost or goal count
  unlock_goal_metric?: ArchetypeGoalMetric;
  unlock_goal_description?: string;
  is_starter?: boolean;
  starterQuests: {
    title: string;
    description: string;
    category: QuestCategory;
    difficulty: QuestDifficulty;
    attribute: AttributeType;
  }[];
}

export interface LevelProgress {
  currentLevel: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpIntoCurrentLevel: number;
  xpNeededForLevel: number;
  progressPercent: number;
  rankTitle: string;
  tier: 'Novice' | 'Apprentice' | 'Adept' | 'Master' | 'Grandmaster' | 'Ascendant';
}

export interface QuestCompletionResult {
  success: boolean;
  quest: Quest;
  xpEarned: number;
  goldEarned: number;
  attributeEarned: AttributeType;
  attributeXpEarned: number;
  leveledUp: boolean;
  previousLevel: number;
  newLevel: number;
  previousXP: number;
  newXP: number;
  newGold: number;
  streakUpdated: boolean;
  currentStreak: number;
  longestStreak: number;
  unlockedAchievements: Achievement[];
  message: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  archetype: Archetype;
  avatar_url?: string;
  level: number;
  total_xp: number;
  title: string;
  achievement_count: number;
  is_current_user?: boolean;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  currentUserEntry?: LeaderboardEntry | null;
  totalParticipants: number;
}
