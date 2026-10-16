// ==============================================================================
// ASCEND - CALENDAR STREAK ENGINE
// ==============================================================================

import { Streak } from '@/types/rpg';

export interface StreakEvaluationResult {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string;
  streakUpdated: boolean;
  streakFrozen: boolean;
  streakBroken: boolean;
  message: string;
}

/**
 * Get date string formatted as YYYY-MM-DD in user/system timezone
 */
export function getFormattedDateString(date: Date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate difference in calendar days between two YYYY-MM-DD date strings
 */
export function getDaysDifference(dateString1: string, dateString2: string): number {
  const d1 = new Date(`${dateString1}T00:00:00Z`);
  const d2 = new Date(`${dateString2}T00:00:00Z`);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Authoritative Server Streak Evaluator
 * Ensures:
 * 1. Only 1 increment per calendar day
 * 2. Yesterday -> +1
 * 3. Missed day -> reset to 1 (or consumed freeze)
 * 4. Updates longest_streak if current exceeds it
 */
export function evaluateStreakOnCompletion(
  streakRecord: Streak,
  currentDateString: string = getFormattedDateString()
): StreakEvaluationResult {
  const { current_streak, longest_streak, last_completed_date, streak_freeze_count } = streakRecord;

  // Case 1: First ever quest completed
  if (!last_completed_date) {
    const newStreak = 1;
    const newLongest = Math.max(longest_streak, newStreak);
    return {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastCompletedDate: currentDateString,
      streakUpdated: true,
      streakFrozen: false,
      streakBroken: false,
      message: 'First quest completed! Streak ignition: 1 day!',
    };
  }

  const daysDiff = getDaysDifference(last_completed_date, currentDateString);

  // Case 2: Already completed a quest earlier today
  if (daysDiff === 0) {
    return {
      currentStreak: current_streak,
      longestStreak: longest_streak,
      lastCompletedDate: currentDateString,
      streakUpdated: false,
      streakFrozen: false,
      streakBroken: false,
      message: `Streak maintained at ${current_streak} days. Already credited for today.`,
    };
  }

  // Case 3: Completed yesterday (Consecutive day!)
  if (daysDiff === 1) {
    const newStreak = current_streak + 1;
    const newLongest = Math.max(longest_streak, newStreak);
    return {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastCompletedDate: currentDateString,
      streakUpdated: true,
      streakFrozen: false,
      streakBroken: false,
      message: `Daily combo increased! Streak is now ${newStreak} days! 🔥`,
    };
  }

  // Case 4: Missed at least 1 day (daysDiff > 1)
  // Check if Streak Freeze protects the combo
  if (daysDiff === 2 && streak_freeze_count > 0) {
    const newStreak = current_streak + 1;
    const newLongest = Math.max(longest_streak, newStreak);
    return {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastCompletedDate: currentDateString,
      streakUpdated: true,
      streakFrozen: true,
      streakBroken: false,
      message: `Streak Freeze Relic activated! Saved your ${current_streak}-day streak. Now at ${newStreak} days! 🛡️`,
    };
  }

  // Streak broken, restarts at 1
  const newStreak = 1;
  return {
    currentStreak: newStreak,
    longestStreak: Math.max(longest_streak, newStreak),
    lastCompletedDate: currentDateString,
    streakUpdated: true,
    streakFrozen: false,
    streakBroken: true,
    message: `Streak reset after missed days. New streak ignited at 1 day!`,
  };
}
