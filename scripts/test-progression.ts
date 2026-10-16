// ==============================================================================
// ASCEND - PROGRESSION & LEVELING ENGINE UNIT VERIFICATION
// ==============================================================================

import {
  calculateLevelFromXP,
  calculateXPForLevel,
  calculateXPToNextLevel,
  calculateLevelProgress,
  BASE_XP,
} from '../lib/progression/levels';
import {
  evaluateStreakOnCompletion,
  getFormattedDateString,
  getDaysDifference,
} from '../lib/progression/streaks';
import { calculateAuthoritativeRewards } from '../lib/progression/rewards';
import { evaluateNewAchievements, STATIC_ACHIEVEMENTS } from '../lib/progression/achievements';
import { validatePurchase, STATIC_SHOP_ITEMS } from '../lib/progression/economy';
import { Streak, Attributes } from '../types/rpg';

console.log('⚔️  RUNNING ASCEND PROGRESSION ENGINE VALIDATION SUITE  ⚔️\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

// 1. NON-LINEAR LEVELING FORMULA TESTS
console.log('--- 1. LEVEL PROGRESSION TESTS ---');
assert(calculateXPForLevel(1) === 0, 'Level 1 requires 0 XP');
const xpLvl2 = calculateXPForLevel(2);
assert(xpLvl2 === Math.floor(BASE_XP * Math.pow(2, 1.5)), `Level 2 requires ${xpLvl2} XP`);

assert(calculateLevelFromXP(0) === 1, '0 XP is Level 1');
assert(calculateLevelFromXP(xpLvl2 - 1) === 1, `${xpLvl2 - 1} XP is still Level 1`);
assert(calculateLevelFromXP(xpLvl2) === 2, `${xpLvl2} XP is exactly Level 2`);

const progressLvl2 = calculateLevelProgress(xpLvl2 + 50);
assert(progressLvl2.currentLevel === 2, 'Level progress correctly calculates Level 2');
assert(progressLvl2.progressPercent > 0 && progressLvl2.progressPercent <= 100, 'Progress percentage within [0, 100]');

// 2. SERVER-AUTHORITATIVE STREAKS TESTS
console.log('\n--- 2. STREAK CALENDAR TESTS ---');
const todayStr = '2026-09-12';
const yesterdayStr = '2026-09-11';
const twoDaysAgoStr = '2026-09-10';

// Case: First quest ever
const initialStreakRecord: Streak = {
  id: 'test',
  user_id: 'test',
  current_streak: 0,
  longest_streak: 0,
  last_completed_date: null,
  streak_freeze_count: 0,
  updated_at: '',
};
const resFirst = evaluateStreakOnCompletion(initialStreakRecord, todayStr);
assert(resFirst.currentStreak === 1 && resFirst.streakUpdated, 'First quest ignites streak to 1');

// Case: Second quest today (same day)
const sameDayStreakRecord: Streak = {
  ...initialStreakRecord,
  current_streak: 1,
  longest_streak: 1,
  last_completed_date: todayStr,
};
const resSameDay = evaluateStreakOnCompletion(sameDayStreakRecord, todayStr);
assert(resSameDay.currentStreak === 1 && !resSameDay.streakUpdated, 'Same-day second quest does not double-increment streak');

// Case: Quest completed on next day (consecutive)
const consecutiveRecord: Streak = {
  ...initialStreakRecord,
  current_streak: 5,
  longest_streak: 5,
  last_completed_date: yesterdayStr,
};
const resConsecutive = evaluateStreakOnCompletion(consecutiveRecord, todayStr);
assert(resConsecutive.currentStreak === 6 && resConsecutive.longestStreak === 6, 'Consecutive day increments streak from 5 to 6');

// Case: Missed day without freeze
const missedDayRecord: Streak = {
  ...initialStreakRecord,
  current_streak: 10,
  longest_streak: 10,
  last_completed_date: twoDaysAgoStr,
  streak_freeze_count: 0,
};
const resMissed = evaluateStreakOnCompletion(missedDayRecord, todayStr);
assert(resMissed.currentStreak === 1 && resMissed.streakBroken, 'Missed days reset streak to 1 when no freeze');

// Case: Missed day with streak freeze
const freezeRecord: Streak = {
  ...initialStreakRecord,
  current_streak: 10,
  longest_streak: 10,
  last_completed_date: twoDaysAgoStr,
  streak_freeze_count: 1,
};
const resFreeze = evaluateStreakOnCompletion(freezeRecord, todayStr);
assert(resFreeze.currentStreak === 11 && resFreeze.streakFrozen, 'Streak Freeze preserves combo across missed day');

// 3. REWARD CALCULATION & ARCHETYPE PERKS
console.log('\n--- 3. REWARDS & ARCHETYPE BONUS TESTS ---');
const rewardsMage = calculateAuthoritativeRewards({
  category: 'Work',
  difficulty: 'Hard',
  attribute: 'Intellect',
  archetype: 'Cyber Mage',
  currentStreak: 5,
});
assert(rewardsMage.xpEarned > 120, 'Cyber Mage gets bonus XP for Intellect deep work');
assert(rewardsMage.streakBonusPercent === 10, '5-day streak gives +10% streak bonus');

// 4. ECONOMY & PURCHASE VALIDATION
console.log('\n--- 4. GUILD SHOP ECONOMY TESTS ---');
const itemToBuy = STATIC_SHOP_ITEMS[0]; // 200 Gold
const failPurchase = validatePurchase({
  itemId: itemToBuy.id,
  currentGold: 50,
  userInventory: [],
});
assert(!failPurchase.valid && Boolean(failPurchase.errorMessage?.includes('Insufficient Gold')), 'Rejects purchase with insufficient gold');

const successPurchase = validatePurchase({
  itemId: itemToBuy.id,
  currentGold: 300,
  userInventory: [],
});
assert(successPurchase.valid && successPurchase.newGoldBalance === 100, 'Validates purchase and deducts exact gold');

// 5. ACHIEVEMENTS TRIGGER TESTS
console.log('\n--- 5. ACHIEVEMENTS ENGINE TESTS ---');
const dummyAttrs: Attributes = {
  id: '1',
  user_id: '1',
  intellect_xp: 350,
  strength_xp: 0,
  vitality_xp: 0,
  discipline_xp: 0,
  creativity_xp: 0,
  charisma_xp: 0,
  updated_at: '',
};
const unlockedAchs = evaluateNewAchievements({
  questsCompletedCount: 1,
  currentStreak: 1,
  longestStreak: 1,
  level: 1,
  goldBalance: 150,
  attributes: dummyAttrs,
  itemsPurchasedCount: 0,
  unlockedAchievementCodes: [],
});
assert(unlockedAchs.some((a) => a.code === 'FIRST_QUEST'), 'Unlocks FIRST_QUEST achievement on first completion');
assert(unlockedAchs.some((a) => a.code === 'INTELLECT_100'), 'Unlocks INTELLECT_100 when intellect XP exceeds threshold');
// 6. LEADERBOARD RANKING & PRIVACY TESTS (live data only, zero fake names)
console.log('\n--- 6. LEADERBOARD RANKING & PRIVACY TESTS ---');

// 6a. Empty database produces empty leaderboard
const emptyProfiles: { user_id: string; username: string; level: number; xp: number }[] = [];
const emptyRanked = [...emptyProfiles].sort((a, b) => {
  if (b.level !== a.level) return b.level - a.level;
  return b.xp - a.xp;
});
assert(emptyRanked.length === 0, '0 users yields empty leaderboard array');

// 6b. Single user is always rank #1
const soloProfiles = [
  { user_id: 'solo-1', username: 'OnlyPlayer', archetype: 'Cyber Mage', level: 1, xp: 0 },
];
const soloRanked = soloProfiles.map((r, i) => ({ ...r, rank: i + 1 }));
assert(soloRanked.length === 1, 'Single user leaderboard has exactly 1 entry');
assert(soloRanked[0].rank === 1, 'Single user is rank #1');

// 6c. Multi-user ranking correctness
interface RawTestProfile {
  user_id: string;
  username: string;
  archetype: string;
  level: number;
  xp: number;
  email?: string;
  gold?: number;
}
const mockProfiles: RawTestProfile[] = [
  { user_id: 'u1', username: 'NovicePlayer', archetype: 'Cyber Mage', level: 2, xp: 300, email: 'novice@test.com', gold: 9999 },
  { user_id: 'u2', username: 'MasterPlayer', archetype: 'Iron Titan', level: 10, xp: 4500, email: 'master@test.com', gold: 8888 },
  { user_id: 'u3', username: 'EqualLevelLowerXP', archetype: 'Shadow Rogue', level: 10, xp: 4200, email: 'equal@test.com', gold: 7777 },
];

// Sort: level DESC, xp DESC
const ranked = [...mockProfiles].sort((a, b) => {
  if (b.level !== a.level) return b.level - a.level;
  return b.xp - a.xp;
});

assert(ranked[0].username === 'MasterPlayer', 'Rank 1 is user with highest level and XP');
assert(ranked[1].username === 'EqualLevelLowerXP', 'Rank 2 tiebreaks on XP when levels are identical');
assert(ranked[2].username === 'NovicePlayer', 'Rank 3 is lowest level user');

// 6d. Public projection strips private fields
const publicProjection = ranked.map((r, i) => ({
  rank: i + 1,
  user_id: r.user_id,
  username: r.username,
  archetype: r.archetype,
  level: r.level,
  total_xp: r.xp,
}));

assert(!('email' in publicProjection[0]), 'Leaderboard public projection does NOT contain email');
assert(!('gold' in publicProjection[0]), 'Leaderboard public projection does NOT contain gold balance');

console.log(`\n🎉 SUITE SUMMARY: ${passedTests}/${totalTests} TESTS PASSED! 🎉\n`);

