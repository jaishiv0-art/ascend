// ==============================================================================
// ASCEND - REWARD CALCULATION & ARCHETYPE BONUS ENGINE
// ==============================================================================

import { Archetype, AttributeType, QuestCategory, QuestDifficulty } from '@/types/rpg';

export interface BaseReward {
  xp: number;
  gold: number;
  attributeXp: number;
}

export const DIFFICULTY_REWARDS: Record<QuestDifficulty, BaseReward> = {
  Easy: { xp: 30, gold: 15, attributeXp: 30 },
  Medium: { xp: 60, gold: 30, attributeXp: 60 },
  Hard: { xp: 120, gold: 60, attributeXp: 120 },
  Epic: { xp: 250, gold: 120, attributeXp: 250 },
  Legendary: { xp: 500, gold: 250, attributeXp: 500 },
};

/**
 * Calculate authoritative server rewards for a completed quest
 */
export function calculateAuthoritativeRewards(params: {
  category: QuestCategory;
  difficulty: QuestDifficulty;
  attribute: AttributeType;
  archetype: Archetype;
  currentStreak: number;
  hasXpPotion?: boolean;
}): {
  xpEarned: number;
  goldEarned: number;
  attributeXpEarned: number;
  streakBonusPercent: number;
  archetypeBonusDescription?: string;
} {
  const { category, difficulty, attribute, archetype, currentStreak, hasXpPotion } = params;
  const base = DIFFICULTY_REWARDS[difficulty] || DIFFICULTY_REWARDS.Medium;

  let xpMultiplier = 1.0;
  let goldMultiplier = 1.0;
  let attributeMultiplier = 1.0;
  let archetypeBonusDescription: string | undefined;

  // Streak Multiplier: +2% XP per day, capped at +50% (25 days)
  const streakBonusPercent = Math.min(50, Math.max(0, currentStreak * 2));
  xpMultiplier += streakBonusPercent / 100;

  // Archetype specific bonuses
  switch (archetype) {
    case 'Cyber Mage':
      if (category === 'Work' || category === 'Learning' || attribute === 'Intellect') {
        attributeMultiplier += 0.15;
        xpMultiplier += 0.1;
        archetypeBonusDescription = 'Cyber Mage Perk: +15% Intellect Mastery & +10% Focus XP';
      }
      break;
    case 'Iron Titan':
      if (category === 'Fitness' || attribute === 'Strength' || attribute === 'Vitality') {
        attributeMultiplier += 0.15;
        xpMultiplier += 0.1;
        archetypeBonusDescription = 'Iron Titan Perk: +15% Physical Attribute Growth';
      }
      break;
    case 'Shadow Rogue':
      if (difficulty === 'Medium' || difficulty === 'Hard' || difficulty === 'Epic') {
        goldMultiplier += 0.2;
        archetypeBonusDescription = 'Shadow Rogue Perk: +20% Gold Loot Bonus';
      }
      break;
    case 'Bio Hacker':
      if (category === 'Habit' || attribute === 'Vitality') {
        attributeMultiplier += 0.2;
        archetypeBonusDescription = 'Bio Hacker Perk: +20% Vitality & Recovery XP';
      }
      break;
    case 'Astral Sage':
      if (category === 'Creative' || category === 'Social') {
        xpMultiplier += 0.2;
        archetypeBonusDescription = 'Astral Sage Perk: +20% Creative & Social XP';
      }
      break;
    case 'Nova Paladin':
      if (category === 'Social' || attribute === 'Charisma') {
        attributeMultiplier += 0.25;
        archetypeBonusDescription = 'Nova Paladin Perk: +25% Charisma Growth';
      }
      break;
  }

  // Active XP Potion (2x)
  if (hasXpPotion) {
    xpMultiplier *= 2;
  }

  const xpEarned = Math.round(base.xp * xpMultiplier);
  const goldEarned = Math.round(base.gold * goldMultiplier);
  const attributeXpEarned = Math.round(base.attributeXp * attributeMultiplier);

  return {
    xpEarned,
    goldEarned,
    attributeXpEarned,
    streakBonusPercent,
    archetypeBonusDescription,
  };
}
