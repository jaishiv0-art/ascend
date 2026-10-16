// ==============================================================================
// ASCEND - ARCHETYPE DEFINITIONS & STARTER QUESTS
// Simple, Friendly, Action-Oriented Language with Character Roster Progression
// ==============================================================================

import { ArchetypeDetails, Profile, Streak, Quest, InventoryItem } from '@/types/rpg';
import { calculateLevelProgress } from '@/lib/progression/levels';

export const ARCHETYPES: Record<string, ArchetypeDetails> = {
  'Cyber Mage': {
    id: 'Cyber Mage',
    name: 'Cyber Mage',
    title: 'Focus & Knowledge Specialist',
    role: 'Intellect & Focus',
    description: 'Master of deep work, problem solving, learning, and coding. Converts high mental concentration into fast progress.',
    primaryAttribute: 'Intellect',
    secondaryAttribute: 'Discipline',
    avatar: '/avatars/mage.png',
    color: '#06B6D4', // Cyan
    accentGlow: 'rgba(6, 182, 212, 0.4)',
    lore: 'Master of deep concentration and technical learning, conquering intellectual challenges with razor-sharp focus.',
    perk: '+15% bonus Intellect XP on Work & Learning quests.',
    unlock_type: 'free',
    unlock_value: 0,
    is_starter: true,
    starterQuests: [
      {
        title: '90-Min Focused Deep Work',
        description: 'Complete 90 minutes of undistracted coding, writing, or focused deep work.',
        category: 'Work',
        difficulty: 'Hard',
        attribute: 'Intellect',
      },
      {
        title: 'Read 20 Pages of a Book',
        description: 'Read 20 pages of technical documentation, a non-fiction book, or study material.',
        category: 'Learning',
        difficulty: 'Medium',
        attribute: 'Intellect',
      },
      {
        title: 'Plan Today\'s 3 Priorities',
        description: 'List and review your top 3 daily goals before opening social media.',
        category: 'Habit',
        difficulty: 'Easy',
        attribute: 'Discipline',
      },
    ],
  },
  'Iron Titan': {
    id: 'Iron Titan',
    name: 'Iron Titan',
    title: 'Fitness & Strength Specialist',
    role: 'Strength & Vitality',
    description: 'Master of physical discipline, workouts, and high stamina. Builds unstoppable energy through daily body movement.',
    primaryAttribute: 'Strength',
    secondaryAttribute: 'Vitality',
    avatar: '/avatars/titan.png',
    color: '#EF4444', // Crimson
    accentGlow: 'rgba(239, 68, 68, 0.4)',
    lore: 'Relentless in training and endurance, building unbreakable physical energy every single day.',
    perk: '+15% bonus Strength & Vitality XP on Fitness & Health quests.',
    unlock_type: 'gold',
    unlock_value: 250,
    starterQuests: [
      {
        title: 'Heavy Workout (45+ Mins)',
        description: 'Complete 45+ minutes of gym lifting, bodyweight training, or intense cardio.',
        category: 'Fitness',
        difficulty: 'Hard',
        attribute: 'Strength',
      },
      {
        title: 'Drink 3.5 Liters of Water',
        description: 'Keep your body hydrated and energized with 3.5L of water throughout the day.',
        category: 'Habit',
        difficulty: 'Easy',
        attribute: 'Vitality',
      },
      {
        title: 'Walk 10,000 Steps',
        description: 'Hit 10,000 steps today to keep your daily activity and aerobic stamina high.',
        category: 'Fitness',
        difficulty: 'Medium',
        attribute: 'Vitality',
      },
    ],
  },
  'Shadow Rogue': {
    id: 'Shadow Rogue',
    name: 'Shadow Rogue',
    title: 'Speed & Task Execution Ninja',
    role: 'Speed & Creativity',
    description: 'Master of lightning-fast execution, clearing backlogs, and finishing difficult tasks with creative ease.',
    primaryAttribute: 'Creativity',
    secondaryAttribute: 'Intellect',
    avatar: '/avatars/rogue.png',
    color: '#A855F7', // Purple
    accentGlow: 'rgba(168, 85, 247, 0.4)',
    lore: 'Quick and efficient, knocking out huge to-do lists and complex tasks without procrastinating.',
    perk: '+15% bonus Gold on all Medium & Hard quests.',
    unlock_type: 'gold',
    unlock_value: 600,
    starterQuests: [
      {
        title: 'Clear Inbox to Zero',
        description: 'Clear out all pending emails, messages, and unread notifications to zero.',
        category: 'Work',
        difficulty: 'Medium',
        attribute: 'Discipline',
      },
      {
        title: '60-Min Creative Sprint',
        description: 'Draft, prototype, or build a new creative concept or user interface in 60 minutes.',
        category: 'Creative',
        difficulty: 'Hard',
        attribute: 'Creativity',
      },
      {
        title: 'Knock Out 3 Quick To-Dos',
        description: 'Finish 3 quick pending items on your checklist right now without putting them off.',
        category: 'Habit',
        difficulty: 'Medium',
        attribute: 'Discipline',
      },
    ],
  },
  'Bio Hacker': {
    id: 'Bio Hacker',
    name: 'Bio Hacker',
    title: 'Health & Energy Optimizer',
    role: 'Health & Energy',
    description: 'Master of daily wellness, clean nutrition, restorative sleep, and peak morning routines.',
    primaryAttribute: 'Vitality',
    secondaryAttribute: 'Discipline',
    avatar: '/avatars/hacker.png',
    color: '#10B981', // Emerald
    accentGlow: 'rgba(16, 185, 129, 0.4)',
    lore: 'Optimizing daily health, clean eating, cold showers, and restful sleep for all-day energy.',
    perk: '+20% longer Streak protection window & Vitality bonus.',
    unlock_type: 'goal',
    unlock_value: 7,
    unlock_goal_metric: 'streak',
    unlock_goal_description: 'Reach a 7-day streak',
    starterQuests: [
      {
        title: '15-Min Morning Sunlight',
        description: 'Get 15 minutes of direct natural sunlight within 30 minutes of waking up.',
        category: 'Habit',
        difficulty: 'Easy',
        attribute: 'Vitality',
      },
      {
        title: 'Eat Clean Whole Meals Today',
        description: 'Zero processed sugar and eat 3 healthy, balanced nutrient-dense meals.',
        category: 'Fitness',
        difficulty: 'Medium',
        attribute: 'Vitality',
      },
      {
        title: 'No Screens 45m Before Sleep',
        description: 'Shut down all phone and laptop screens 45 minutes before bed + get 8 hours of sleep.',
        category: 'Habit',
        difficulty: 'Medium',
        attribute: 'Discipline',
      },
    ],
  },
  'Astral Sage': {
    id: 'Astral Sage',
    name: 'Astral Sage',
    title: 'Creativity & Mindfulness Guide',
    role: 'Creativity & Social',
    description: 'Master of expressive art, writing, mindfulness meditation, and bringing big ideas to life.',
    primaryAttribute: 'Creativity',
    secondaryAttribute: 'Charisma',
    avatar: '/avatars/sage.png',
    color: '#F59E0B', // Amber
    accentGlow: 'rgba(245, 158, 11, 0.4)',
    lore: 'Channeling inspiration and mindfulness into creative art, writing, and thoughtful connection.',
    perk: '+20% bonus XP on Creative & Social quests.',
    unlock_type: 'goal',
    unlock_value: 10,
    unlock_goal_metric: 'level',
    unlock_goal_description: 'Reach Level 10',
    starterQuests: [
      {
        title: 'Daily Creative Writing or Art',
        description: 'Write 500 words of an article/essay or design a new creative artwork.',
        category: 'Creative',
        difficulty: 'Hard',
        attribute: 'Creativity',
      },
      {
        title: '15-Min Daily Meditation',
        description: 'Complete 15 minutes of calm breathing and mindfulness meditation.',
        category: 'Habit',
        difficulty: 'Easy',
        attribute: 'Discipline',
      },
      {
        title: 'Send a Kind & Helpful Note',
        description: 'Send a thoughtful, encouraging message or help out a friend or colleague.',
        category: 'Social',
        difficulty: 'Medium',
        attribute: 'Charisma',
      },
    ],
  },
  'Nova Paladin': {
    id: 'Nova Paladin',
    name: 'Nova Paladin',
    title: 'Leadership & Community Champion',
    role: 'Leadership & Social',
    description: 'Master of communication, team leadership, confidence, and uplifting others to achieve more.',
    primaryAttribute: 'Charisma',
    secondaryAttribute: 'Strength',
    avatar: '/avatars/paladin.png',
    color: '#3B82F6', // Blue
    accentGlow: 'rgba(59, 130, 246, 0.4)',
    lore: 'Leading with positive presence and courage, inspiring teammates to win together.',
    perk: '+25% bonus Charisma XP on networking and leadership quests.',
    unlock_type: 'goal',
    unlock_value: 50,
    unlock_goal_metric: 'quests_completed',
    unlock_goal_description: 'Complete 50 total quests',
    starterQuests: [
      {
        title: 'Lead a Meeting or Presentation',
        description: 'Lead a team sync, client presentation, or public speaking talk with confidence.',
        category: 'Social',
        difficulty: 'Epic',
        attribute: 'Charisma',
      },
      {
        title: 'Help & Mentor a Teammate',
        description: 'Proactively help 2 teammates solve a problem or guide a friend.',
        category: 'Work',
        difficulty: 'Medium',
        attribute: 'Charisma',
      },
      {
        title: '5-Min Morning Stretch & Posture',
        description: '5 minutes of upright posture alignment, deep breathing, and voice exercises.',
        category: 'Habit',
        difficulty: 'Easy',
        attribute: 'Charisma',
      },
    ],
  },
};

export const ARCHETYPE_LIST = Object.values(ARCHETYPES);

// ─── Character Unlock Evaluation Helpers ─────────────────────────────────────

export function isArchetypeUnlocked(
  archetypeId: string,
  profile: Profile,
  streak: Streak,
  quests: Quest[],
  inventory: InventoryItem[]
): boolean {
  // Cyber Mage is free starter and always unlocked
  if (archetypeId === 'Cyber Mage') return true;

  // Active archetype is always treated as unlocked for the active session
  if (profile.archetype === archetypeId) return true;

  // Check inventory for explicit unlock item
  const hasUnlockItem = inventory.some(
    (inv) =>
      inv.item?.effect_type === 'archetype_unlock' &&
      inv.item?.effect_value === archetypeId
  );
  if (hasUnlockItem) return true;

  const details = ARCHETYPES[archetypeId];
  if (!details) return false;

  // Goal-based unlocks
  if (details.unlock_type === 'goal') {
    if (details.unlock_goal_metric === 'streak') {
      const bestStreak = Math.max(streak?.current_streak || 0, streak?.longest_streak || 0);
      return bestStreak >= details.unlock_value;
    }
    if (details.unlock_goal_metric === 'level') {
      const currentLevel = Math.max(profile?.level || 1, calculateLevelProgress(profile?.xp || 0).currentLevel);
      return currentLevel >= details.unlock_value;
    }
    if (details.unlock_goal_metric === 'quests_completed') {
      const completedCount = quests.filter((q) => q.status === 'Completed').length;
      return completedCount >= details.unlock_value;
    }
  }

  return false;
}

export function getArchetypeUnlockProgress(
  archetype: ArchetypeDetails,
  profile: Profile,
  streak: Streak,
  quests: Quest[],
  inventory: InventoryItem[]
): {
  isUnlocked: boolean;
  currentValue: number;
  targetValue: number;
  progressPercent: number;
  progressLabel: string;
  conditionLabel: string;
} {
  const unlocked = isArchetypeUnlocked(archetype.id, profile, streak, quests, inventory);

  if (archetype.unlock_type === 'free' || unlocked) {
    return {
      isUnlocked: true,
      currentValue: archetype.unlock_value,
      targetValue: archetype.unlock_value,
      progressPercent: 100,
      progressLabel: 'Unlocked',
      conditionLabel: 'Free Starter Class',
    };
  }

  if (archetype.unlock_type === 'gold') {
    const gold = profile.gold || 0;
    const target = archetype.unlock_value;
    const percent = Math.min(100, Math.round((gold / target) * 100));
    return {
      isUnlocked: false,
      currentValue: gold,
      targetValue: target,
      progressPercent: percent,
      progressLabel: `${gold} / ${target} Gold`,
      conditionLabel: `${target} Gold`,
    };
  }

  // Goal-based
  let current = 0;
  let label = '';
  if (archetype.unlock_goal_metric === 'streak') {
    current = Math.max(streak?.current_streak || 0, streak?.longest_streak || 0);
    label = `${current} / ${archetype.unlock_value} Days`;
  } else if (archetype.unlock_goal_metric === 'level') {
    current = Math.max(profile?.level || 1, calculateLevelProgress(profile?.xp || 0).currentLevel);
    label = `Level ${current} / ${archetype.unlock_value}`;
  } else if (archetype.unlock_goal_metric === 'quests_completed') {
    current = quests.filter((q) => q.status === 'Completed').length;
    label = `${current} / ${archetype.unlock_value} Quests`;
  }

  const percent = Math.min(100, Math.round((current / archetype.unlock_value) * 100));
  return {
    isUnlocked: current >= archetype.unlock_value,
    currentValue: current,
    targetValue: archetype.unlock_value,
    progressPercent: percent,
    progressLabel: label,
    conditionLabel: archetype.unlock_goal_description || `Reach ${archetype.unlock_value}`,
  };
}

export function evaluateNewlyUnlockedArchetypes(
  profile: Profile,
  streak: Streak,
  quests: Quest[],
  inventory: InventoryItem[],
  previouslyUnlockedIds: string[] = []
): ArchetypeDetails[] {
  const newlyUnlocked: ArchetypeDetails[] = [];

  for (const arch of ARCHETYPE_LIST) {
    if (arch.unlock_type === 'goal') {
      const isNowUnlocked = isArchetypeUnlocked(arch.id, profile, streak, quests, inventory);
      if (isNowUnlocked && !previouslyUnlockedIds.includes(arch.id)) {
        newlyUnlocked.push(arch);
      }
    }
  }

  return newlyUnlocked;
}
