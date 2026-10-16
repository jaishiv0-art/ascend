// ==============================================================================
// ASCEND - RPG ATTRIBUTES ENGINE
// ==============================================================================

import { AttributeType, QuestCategory, Attributes } from '@/types/rpg';

export interface AttributeMeta {
  type: AttributeType;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  accentBg: string;
  description: string;
  primaryCategories: QuestCategory[];
  buffBenefit: string;
}

export const ATTRIBUTE_CONFIG: Record<AttributeType, AttributeMeta> = {
  Intellect: {
    type: 'Intellect',
    name: 'Intellect',
    shortName: 'INT',
    icon: 'Brain',
    color: '#06B6D4', // Cyan
    accentBg: 'rgba(6, 182, 212, 0.15)',
    description: 'Mental focus, analytical thinking, technical skills, and deep intellectual work.',
    primaryCategories: ['Work', 'Learning'],
    buffBenefit: '+XP gain rate on coding, reading, and problem-solving quests.',
  },
  Strength: {
    type: 'Strength',
    name: 'Strength',
    shortName: 'STR',
    icon: 'Dumbbell',
    color: '#EF4444', // Red
    accentBg: 'rgba(239, 68, 68, 0.15)',
    description: 'Physical power, muscular endurance, heavy lifting, and athletic resilience.',
    primaryCategories: ['Fitness'],
    buffBenefit: '+Gold rewards on heavy physical exertion workouts.',
  },
  Vitality: {
    type: 'Vitality',
    name: 'Vitality',
    shortName: 'VIT',
    icon: 'Heart',
    color: '#10B981', // Emerald
    accentBg: 'rgba(16, 185, 129, 0.15)',
    description: 'Energy reserves, recovery, sleep hygiene, hydration, and cardiovascular stamina.',
    primaryCategories: ['Fitness', 'Habit'],
    buffBenefit: 'Extends streak preservation buffer and boosts overall character HP/Stamina.',
  },
  Discipline: {
    type: 'Discipline',
    name: 'Discipline',
    shortName: 'DIS',
    icon: 'Target',
    color: '#F59E0B', // Amber
    accentBg: 'rgba(245, 158, 11, 0.15)',
    description: 'Relentless consistency, impulse control, habit formation, and resisting procrastination.',
    primaryCategories: ['Habit', 'Work'],
    buffBenefit: 'Increases Streak XP multiplier bonuses.',
  },
  Creativity: {
    type: 'Creativity',
    name: 'Creativity',
    shortName: 'CRT',
    icon: 'Sparkles',
    color: '#A855F7', // Purple
    accentBg: 'rgba(168, 85, 247, 0.15)',
    description: 'Original ideation, design, writing, art, storytelling, and divergent problem-solving.',
    primaryCategories: ['Creative', 'Learning'],
    buffBenefit: 'Chance to discover rare bonus loot and extra gold from quest completions.',
  },
  Charisma: {
    type: 'Charisma',
    name: 'Charisma',
    shortName: 'CHA',
    icon: 'Users',
    color: '#3B82F6', // Blue
    accentBg: 'rgba(59, 130, 246, 0.15)',
    description: 'Communication, public speaking, leadership, networking, empathy, and social impact.',
    primaryCategories: ['Social', 'Work'],
    buffBenefit: 'Unlocks exclusive Guild Shop discounts and community titles.',
  },
};

export const ATTRIBUTE_LIST = Object.values(ATTRIBUTE_CONFIG);

/**
 * Maps quest category to default attribute
 */
export function getDefaultAttributeForCategory(category: QuestCategory): AttributeType {
  switch (category) {
    case 'Work':
      return 'Intellect';
    case 'Fitness':
      return 'Strength';
    case 'Learning':
      return 'Intellect';
    case 'Habit':
      return 'Discipline';
    case 'Creative':
      return 'Creativity';
    case 'Social':
      return 'Charisma';
    default:
      return 'Discipline';
  }
}

/**
 * Calculate attribute level from attribute XP
 * Every 150 attribute XP = +1 Attribute Level (starts at 1)
 */
export function calculateAttributeLevel(attributeXP: number): number {
  return 1 + Math.floor(Math.max(0, attributeXP) / 150);
}

/**
 * Get attribute mastery rank
 */
export function getAttributeMasteryTitle(attributeLevel: number): string {
  if (attributeLevel < 3) return 'Novice';
  if (attributeLevel < 6) return 'Apprentice';
  if (attributeLevel < 10) return 'Adept';
  if (attributeLevel < 15) return 'Master';
  return 'Paragon';
}

/**
 * Extract total attribute points from attributes record
 */
export function getTotalAttributeXP(attributes: Attributes): number {
  return (
    (attributes.intellect_xp || 0) +
    (attributes.strength_xp || 0) +
    (attributes.vitality_xp || 0) +
    (attributes.discipline_xp || 0) +
    (attributes.creativity_xp || 0) +
    (attributes.charisma_xp || 0)
  );
}
