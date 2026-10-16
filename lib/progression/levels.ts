// ==============================================================================
// ASCEND - NON-LINEAR LEVELING & PROGRESSION ENGINE
// ==============================================================================

import { LevelProgress } from '@/types/rpg';

/**
 * Base XP constant used in the power formula.
 * xpForLevel(n) = BASE * n^1.5
 */
export const BASE_XP = 100;

/**
 * Calculate the XP needed to step from (level - 1) to level.
 * Delta XP for level n = Math.floor(BASE_XP * Math.pow(n, 1.5))
 */
export function getDeltaXPForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(BASE_XP * Math.pow(level, 1.5));
}

/**
 * Calculate the total cumulative XP required to reach a specific level.
 * Level 1 = 0 XP
 * Level 2 = getDeltaXPForLevel(2)
 * Level 3 = Level 2 + getDeltaXPForLevel(3)...
 */
export function calculateXPForLevel(level: number): number {
  if (level <= 1) return 0;
  let total = 0;
  for (let i = 2; i <= level; i++) {
    total += Math.floor(BASE_XP * Math.pow(i, 1.5));
  }
  return total;
}

/**
 * Calculate the authoritative level given a total XP number.
 * Ensures strict progression matching cumulative thresholds.
 */
export function calculateLevelFromXP(totalXP: number): number {
  if (totalXP <= 0) return 1;
  let level = 1;
  let accumulatedXP = 0;
  
  while (true) {
    const nextDelta = Math.floor(BASE_XP * Math.pow(level + 1, 1.5));
    if (accumulatedXP + nextDelta > totalXP) {
      break;
    }
    accumulatedXP += nextDelta;
    level++;
    // Safety cap for astronomical XP
    if (level >= 999) break;
  }

  return level;
}

/**
 * Calculate remaining XP required to hit the next level.
 */
export function calculateXPToNextLevel(totalXP: number): number {
  const currentLevel = calculateLevelFromXP(totalXP);
  const nextLevelTotalXP = calculateXPForLevel(currentLevel + 1);
  return Math.max(0, nextLevelTotalXP - totalXP);
}

/**
 * Get Rank Title & Tier based on character level
 */
export function getRankTier(level: number): {
  tier: 'Novice' | 'Apprentice' | 'Adept' | 'Master' | 'Grandmaster' | 'Ascendant';
  title: string;
} {
  if (level < 5) {
    return { tier: 'Novice', title: 'Initiate Seeker' };
  } else if (level < 10) {
    return { tier: 'Apprentice', title: 'Cyber Vanguard' };
  } else if (level < 20) {
    return { tier: 'Adept', title: 'Neural Adept' };
  } else if (level < 35) {
    return { tier: 'Master', title: 'Grid Overseer' };
  } else if (level < 50) {
    return { tier: 'Grandmaster', title: 'Singularity Grandmaster' };
  } else {
    return { tier: 'Ascendant', title: 'Eternal Ascendant' };
  }
}

/**
 * Full level progress snapshot for HUDs and progress bars.
 */
export function calculateLevelProgress(totalXP: number): LevelProgress {
  const safeXP = Math.max(0, totalXP);
  const currentLevel = calculateLevelFromXP(safeXP);
  const xpForCurrentLevel = calculateXPForLevel(currentLevel);
  const xpForNextLevel = calculateXPForLevel(currentLevel + 1);
  
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
  const xpIntoCurrentLevel = safeXP - xpForCurrentLevel;
  
  const progressPercent =
    xpNeededForLevel > 0
      ? Math.min(100, Math.max(0, Math.floor((xpIntoCurrentLevel / xpNeededForLevel) * 100)))
      : 100;

  const { tier, title: rankTitle } = getRankTier(currentLevel);

  return {
    currentLevel,
    currentXP: safeXP,
    xpForCurrentLevel,
    xpForNextLevel,
    xpIntoCurrentLevel,
    xpNeededForLevel,
    progressPercent,
    rankTitle,
    tier,
  };
}
