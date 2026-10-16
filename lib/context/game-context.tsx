'use client';

// ==============================================================================
// ASCEND - GLOBAL LIFE RPG STATE & SYNCHRONIZATION CONTEXT
// ==============================================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Profile,
  Attributes,
  Streak,
  Quest,
  InventoryItem,
  ShopItem,
  Achievement,
  UserAchievement,
  QuestCategory,
  QuestDifficulty,
  AttributeType,
  QuestCompletionResult,
  Archetype,
  Weekday,
  ArchetypeDetails,
} from '@/types/rpg';
import {
  ARCHETYPES,
  ARCHETYPE_LIST,
  isArchetypeUnlocked,
  evaluateNewlyUnlockedArchetypes,
} from '@/lib/progression/archetypes';
import { calculateLevelFromXP, calculateLevelProgress } from '@/lib/progression/levels';
import { calculateAuthoritativeRewards } from '@/lib/progression/rewards';
import { evaluateStreakOnCompletion, getFormattedDateString } from '@/lib/progression/streaks';
import { STATIC_ACHIEVEMENTS, evaluateNewAchievements } from '@/lib/progression/achievements';
import { STATIC_SHOP_ITEMS, validatePurchase } from '@/lib/progression/economy';
import { soundManager } from '@/lib/sound/sfx';
import confetti from 'canvas-confetti';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client';

export interface LevelUpModalData {
  isOpen: boolean;
  oldLevel: number;
  newLevel: number;
  rankTitle: string;
  archetype: Archetype;
}

interface GameContextType {
  isLoaded: boolean;
  isDemoUser: boolean;
  isConfigured: boolean;
  profile: Profile;
  attributes: Attributes;
  streak: Streak;
  quests: Quest[];
  inventory: InventoryItem[];
  achievements: UserAchievement[];
  availableAchievements: Achievement[];
  shopItems: ShopItem[];
  levelUpModal: LevelUpModalData;
  unlockedAchievementNotification: Achievement | null;
  unlockedCharacterNotification: ArchetypeDetails | null;
  
  // Actions
  createQuest: (questData: {
    title: string;
    description?: string;
    category: QuestCategory;
    difficulty: QuestDifficulty;
    attribute?: AttributeType;
    is_recurring?: boolean;
    recurrence_interval?: 'Daily' | 'Weekly' | 'None';
    recurring_days?: Weekday[] | string[] | null;
    due_date?: string | null;
    priority?: 'Low' | 'Medium' | 'High';
    reminder_time?: string | null;
    reminder_enabled?: boolean;
    timer_minutes?: number | null;
  }) => Promise<Quest>;
  updateQuest: (id: string, updates: Partial<Quest>) => Promise<Quest | null>;
  deleteQuest: (id: string) => Promise<boolean>;
  completeQuest: (id: string) => Promise<QuestCompletionResult>;
  purchaseItem: (itemId: string) => Promise<{ success: boolean; message: string }>;
  equipItem: (inventoryItemId: string) => Promise<boolean>;
  switchArchetype: (archetypeId: Archetype) => Promise<{ success: boolean; message: string }>;
  isArchetypeUnlockedStatus: (archetypeId: Archetype) => boolean;
  claimAchievementReward: (code: string) => Promise<boolean>;
  updateUserProfile: (updates: Partial<Profile>) => Promise<void>;
  closeLevelUpModal: () => void;
  closeAchievementNotification: () => void;
  closeCharacterNotification: () => void;
  toggleSound: (enabled: boolean) => void;
  setTheme: (themeId: string) => void;
  loginAsDemoUser: (archetype?: Archetype) => void;
  resetAllGameData: () => void;
  logout: () => Promise<void>;
}

const DEFAULT_PROFILE: Profile = {
  id: 'ascendant-hero',
  user_id: 'ascendant-hero',
  username: 'Kaelen Vance',
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

const DEFAULT_ATTRIBUTES: Attributes = {
  id: 'attr-hero',
  user_id: 'ascendant-hero',
  intellect_xp: 0,
  strength_xp: 0,
  vitality_xp: 0,
  discipline_xp: 0,
  creativity_xp: 0,
  charisma_xp: 0,
  updated_at: new Date().toISOString(),
};

const DEFAULT_STREAK: Streak = {
  id: 'streak-hero',
  user_id: 'ascendant-hero',
  current_streak: 1,
  longest_streak: 1,
  last_completed_date: getFormattedDateString(),
  streak_freeze_count: 1,
  updated_at: new Date().toISOString(),
};

const DEFAULT_QUESTS: Quest[] = [
  {
    id: 'quest-starter-1',
    user_id: 'ascendant-hero',
    title: 'Deep Focus Sprint (45 mins)',
    description: 'Execute uninterrupted focus on primary technical or learning milestone.',
    category: 'Work',
    difficulty: 'Hard',
    attribute: 'Intellect',
    xp_reward: 120,
    gold_reward: 60,
    status: 'Active',
    is_recurring: true,
    recurrence_interval: 'Daily',
    recurring_days: ['mon', 'tue', 'wed', 'thu', 'fri'],
    due_date: null,
    priority: 'High',
    created_at: new Date().toISOString(),
  },
  {
    id: 'quest-starter-2',
    user_id: 'ascendant-hero',
    title: 'Physical Forge & High-Intensity Cardio',
    description: 'Complete 30 minutes of high-intensity athletic conditioning or strength training.',
    category: 'Fitness',
    difficulty: 'Medium',
    attribute: 'Strength',
    xp_reward: 60,
    gold_reward: 30,
    status: 'Active',
    is_recurring: true,
    recurrence_interval: 'Daily',
    recurring_days: ['mon', 'wed', 'fri', 'sat'],
    due_date: null,
    priority: 'Medium',
    created_at: new Date().toISOString(),
  },
  {
    id: 'quest-starter-3',
    user_id: 'ascendant-hero',
    title: 'Cognitive Reset & 3.0L Hydration',
    description: 'Drink 3 liters of water and practice 10 mins of breathwork/mindfulness.',
    category: 'Habit',
    difficulty: 'Easy',
    attribute: 'Vitality',
    xp_reward: 30,
    gold_reward: 15,
    status: 'Active',
    is_recurring: true,
    recurrence_interval: 'Daily',
    recurring_days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    due_date: null,
    priority: 'Low',
    created_at: new Date().toISOString(),
  },
  {
    id: 'quest-starter-4',
    user_id: 'ascendant-hero',
    title: 'Design Cyberpunk System Architecture',
    description: 'Map out the full component graph and user flow for next sprint feature.',
    category: 'Creative',
    difficulty: 'Epic',
    attribute: 'Creativity',
    xp_reward: 250,
    gold_reward: 120,
    status: 'Active',
    is_recurring: false,
    recurrence_interval: 'None',
    recurring_days: null,
    due_date: null,
    priority: 'High',
    created_at: new Date().toISOString(),
  },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDemoUser, setIsDemoUser] = useState(true);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [attributes, setAttributes] = useState<Attributes>(DEFAULT_ATTRIBUTES);
  const [streak, setStreak] = useState<Streak>(DEFAULT_STREAK);
  const [quests, setQuests] = useState<Quest[]>(DEFAULT_QUESTS);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [availableAchievements] = useState<Achievement[]>(STATIC_ACHIEVEMENTS);
  const [shopItems] = useState<ShopItem[]>(STATIC_SHOP_ITEMS);

  const [levelUpModal, setLevelUpModal] = useState<LevelUpModalData>({
    isOpen: false,
    oldLevel: 1,
    newLevel: 1,
    rankTitle: 'Initiate Seeker',
    archetype: 'Cyber Mage',
  });

  const [unlockedAchievementNotification, setUnlockedAchievementNotification] = useState<Achievement | null>(null);
  const [unlockedCharacterNotification, setUnlockedCharacterNotification] = useState<ArchetypeDetails | null>(null);

  const closeCharacterNotification = useCallback(() => {
    setUnlockedCharacterNotification(null);
  }, []);

  // Apply theme class to document element
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('theme-cyberpunk', 'theme-void', 'theme-solar', 'theme-matrix', 'theme-crimson');
      document.documentElement.classList.add(profile.theme || 'theme-cyberpunk');
    }
  }, [profile.theme]);

  // Sound sync
  useEffect(() => {
    soundManager.setEnabled(profile.sound_enabled);
  }, [profile.sound_enabled]);

  // Load initial data from Supabase or LocalStorage
  const loadState = useCallback(async () => {
    try {
      if (typeof window === 'undefined') return;

      const configured = isSupabaseConfigured();

      if (configured) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setIsDemoUser(false);
          const [profRes, attrRes, streakRes, questRes, invRes, achRes] = await Promise.all([
            supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
            supabase.from('attributes').select('*').eq('user_id', user.id).maybeSingle(),
            supabase.from('streaks').select('*').eq('user_id', user.id).maybeSingle(),
            supabase.from('quests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
            supabase.from('inventory').select('*').eq('user_id', user.id),
            supabase.from('user_achievements').select('*').eq('user_id', user.id),
          ]);

          if (profRes.data) {
            setProfile(profRes.data);
          } else {
            // No profile found - user must complete onboarding
            if (window.location.pathname !== '/onboarding') {
              window.location.href = '/onboarding';
              return;
            }
            setProfile({ ...DEFAULT_PROFILE, id: user.id, user_id: user.id, username: '' });
          }

          if (attrRes.data) setAttributes(attrRes.data);
          if (streakRes.data) setStreak(streakRes.data);

          // ── CRITICAL FIX: Merge Supabase quests with local saved quests
          // so no completed or newly created quest is lost on refresh
          if (questRes.data && questRes.data.length > 0) {
            const savedQuests = localStorage.getItem('ascend_quests');
            if (savedQuests) {
              try {
                const parsed = JSON.parse(savedQuests) as Quest[];
                const sbMap = new Map(questRes.data.map((q) => [q.id, q]));
                for (const localQ of parsed) {
                  if (!sbMap.has(localQ.id)) {
                    sbMap.set(localQ.id, localQ);
                  } else {
                    const sbQ = sbMap.get(localQ.id)!;
                    if (localQ.completed_at && !sbQ.completed_at) {
                      sbMap.set(localQ.id, { ...sbQ, completed_at: localQ.completed_at, status: localQ.status });
                    }
                  }
                }
                setQuests(Array.from(sbMap.values()));
              } catch {
                setQuests(questRes.data);
              }
            } else {
              setQuests(questRes.data);
            }
          } else {
            const savedQuests = localStorage.getItem('ascend_quests');
            if (savedQuests) {
              try {
                const parsed = JSON.parse(savedQuests) as Quest[];
                // Only restore quests that belong to this user
                const userQuests = parsed.filter(
                  (q) => q.user_id === user.id || q.user_id === 'ascendant-hero'
                );
                if (userQuests.length > 0) {
                  setQuests(userQuests);
                  // Background-sync recovered quests to Supabase
                  const questsToSync = userQuests.filter((q) => q.user_id === user.id);
                  for (const q of questsToSync) {
                    supabase.from('quests').upsert({
                      id: q.id,
                      user_id: user.id,
                      title: q.title,
                      description: q.description || '',
                      category: q.category,
                      difficulty: q.difficulty,
                      attribute: q.attribute,
                      xp_reward: q.xp_reward,
                      gold_reward: q.gold_reward,
                      status: q.status,
                      is_recurring: q.is_recurring,
                      recurrence_interval: q.recurrence_interval || null,
                      recurring_days: q.recurring_days || null,
                      due_date: q.due_date || null,
                      priority: q.priority || 'Medium',
                      reminder_time: q.reminder_time || null,
                      reminder_enabled: q.reminder_enabled || false,
                      timer_minutes: q.timer_minutes || null,
                      completed_at: q.completed_at || null,
                      created_at: q.created_at,
                    }, { onConflict: 'id' }).then(({ error }) => {
                      if (error) console.warn('Quest sync error:', error.message);
                    });
                  }
                }
              } catch {
                // localStorage parse error — ignore
              }
            }
          }

          if (invRes.data && invRes.data.length > 0) setInventory(invRes.data);
          if (achRes.data && achRes.data.length > 0) setAchievements(achRes.data);

          setIsLoaded(true);
          return;
        }
      }

      // Offline / LocalStorage fallback (unauthenticated or Supabase not configured)
      const savedProfile = localStorage.getItem('ascend_profile');
      const savedAttributes = localStorage.getItem('ascend_attributes');
      const savedStreak = localStorage.getItem('ascend_streak');
      const savedQuests = localStorage.getItem('ascend_quests');
      const savedInventory = localStorage.getItem('ascend_inventory');
      const savedAchievements = localStorage.getItem('ascend_achievements');

      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (savedAttributes) setAttributes(JSON.parse(savedAttributes));
      if (savedStreak) setStreak(JSON.parse(savedStreak));
      if (savedQuests) setQuests(JSON.parse(savedQuests));
      if (savedInventory) setInventory(JSON.parse(savedInventory));
      if (savedAchievements) setAchievements(JSON.parse(savedAchievements));

      setIsLoaded(true);
    } catch {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadState();

    if (typeof window !== 'undefined' && isSupabaseConfigured()) {
      const supabase = createClient();
      const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
        loadState();
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [loadState]);

  // Sync to LocalStorage for persistence across reloads
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('ascend_profile', JSON.stringify(profile));
      localStorage.setItem('ascend_attributes', JSON.stringify(attributes));
      localStorage.setItem('ascend_streak', JSON.stringify(streak));
      localStorage.setItem('ascend_quests', JSON.stringify(quests));
      localStorage.setItem('ascend_inventory', JSON.stringify(inventory));
      localStorage.setItem('ascend_achievements', JSON.stringify(achievements));
    }
  }, [isLoaded, profile, attributes, streak, quests, inventory, achievements]);

  // Create Quest
  const createQuest = async (questData: {
    title: string;
    description?: string;
    category: QuestCategory;
    difficulty: QuestDifficulty;
    attribute?: AttributeType;
    is_recurring?: boolean;
    recurrence_interval?: 'Daily' | 'Weekly' | 'None';
    recurring_days?: Weekday[] | string[] | null;
    due_date?: string | null;
    priority?: 'Low' | 'Medium' | 'High';
    reminder_time?: string | null;
    reminder_enabled?: boolean;
    timer_minutes?: number | null;
  }): Promise<Quest> => {
    soundManager.playClick();

    if (!isDemoUser && isSupabaseConfigured()) {
      try {
        const res = await fetch('/api/quests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(questData),
        });
        if (res.ok) {
          const { quest } = await res.json();
          setQuests((prev) => [quest, ...prev]);
          return quest;
        } else {
          // Log API error so it's visible during debugging
          const errBody = await res.json().catch(() => ({}));
          console.error('createQuest API error:', res.status, errBody);
        }
      } catch (err) {
        console.error('createQuest network error:', err);
      }

      // ── EMERGENCY FALLBACK: try direct Supabase client insert ─────────────
      try {
        const { DIFFICULTY_REWARDS: DR } = await import('@/lib/progression/rewards');
        const { getDefaultAttributeForCategory: gda } = await import('@/lib/progression/attributes');
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const attr = (questData.attribute || gda(questData.category));
          const rewards = DR[questData.difficulty] || DR.Medium;
          const { data: quest, error } = await supabase
            .from('quests')
            .insert({
              user_id: user.id,
              title: questData.title,
              description: questData.description || '',
              category: questData.category,
              difficulty: questData.difficulty,
              attribute: attr,
              xp_reward: rewards.xp,
              gold_reward: rewards.gold,
              status: 'Active',
              is_recurring: Boolean(questData.is_recurring),
              recurrence_interval: questData.is_recurring ? (questData.recurrence_interval || 'Daily') : null,
              recurring_days: questData.is_recurring ? (questData.recurring_days || null) : null,
              due_date: questData.due_date || null,
              priority: questData.priority || 'Medium',
              reminder_time: questData.reminder_time || null,
              reminder_enabled: questData.reminder_enabled ?? Boolean(questData.reminder_time),
              timer_minutes: questData.timer_minutes || null,
            })
            .select()
            .single();

          if (!error && quest) {
            setQuests((prev) => [quest, ...prev]);
            return quest;
          }
          if (error) console.error('Direct Supabase insert error:', error.message);
        }
      } catch (err) {
        console.error('Direct Supabase fallback error:', err);
      }
    }

    // Final local-only fallback (offline / demo mode)
    const { DIFFICULTY_REWARDS } = await import('@/lib/progression/rewards');
    const { getDefaultAttributeForCategory } = await import('@/lib/progression/attributes');

    const attr = questData.attribute || getDefaultAttributeForCategory(questData.category);
    const rewards = DIFFICULTY_REWARDS[questData.difficulty] || DIFFICULTY_REWARDS.Medium;

    const newQuest: Quest = {
      id: `quest-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      user_id: profile.user_id,
      title: questData.title,
      description: questData.description || '',
      category: questData.category,
      difficulty: questData.difficulty,
      attribute: attr,
      xp_reward: rewards.xp,
      gold_reward: rewards.gold,
      status: 'Active',
      is_recurring: Boolean(questData.is_recurring),
      recurrence_interval: questData.recurrence_interval || 'Daily',
      recurring_days: questData.recurring_days || null,
      due_date: questData.due_date || null,
      priority: questData.priority || 'Medium',
      reminder_time: questData.reminder_time || null,
      reminder_enabled: questData.reminder_enabled ?? Boolean(questData.reminder_time),
      timer_minutes: questData.timer_minutes || null,
      created_at: new Date().toISOString(),
    };

    setQuests((prev) => [newQuest, ...prev]);
    return newQuest;
  };

  // Update Quest
  const updateQuest = async (id: string, updates: Partial<Quest>): Promise<Quest | null> => {
    soundManager.playClick();

    if (!isDemoUser && isSupabaseConfigured()) {
      const res = await fetch(`/api/quests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) return null;
      const { quest } = await res.json();
      setQuests((prev) => prev.map((q) => (q.id === id ? quest : q)));
      return quest;
    }

    let updated: Quest | null = null;
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          updated = { ...q, ...updates, updated_at: new Date().toISOString() };
          return updated;
        }
        return q;
      })
    );
    return updated;
  };

  // Delete Quest
  const deleteQuest = async (id: string): Promise<boolean> => {
    soundManager.playClick();

    if (!isDemoUser && isSupabaseConfigured()) {
      const res = await fetch(`/api/quests/${id}`, { method: 'DELETE' });
      if (!res.ok) return false;
    }

    setQuests((prev) => prev.filter((q) => q.id !== id));
    return true;
  };

  // Complete Quest (Server-Authoritative Progression)
  const completeQuest = async (questId: string): Promise<QuestCompletionResult> => {
    const targetQuest = quests.find((q) => q.id === questId);
    if (!targetQuest) throw new Error('Quest not found');

    // Instant tactile feedback — fires before any API call
    soundManager.playClick();

    if (!isDemoUser && isSupabaseConfigured()) {
      try {
        const res = await fetch(`/api/quests/${questId}/complete`, {
          method: 'POST',
        });
        if (res.ok) {
          const result: QuestCompletionResult = await res.json();

          // Audio & Confetti triggers
          soundManager.playQuestComplete();
          setTimeout(() => soundManager.playGoldClink(), 300);

          // Update State
          setQuests((prev) =>
            prev.map((q) => (q.id === questId ? result.quest : q))
          );
          setProfile((prev) => ({
            ...prev,
            xp: result.newXP,
            level: result.newLevel,
            gold: result.newGold,
          }));
          setStreak((prev) => ({
            ...prev,
            current_streak: result.currentStreak,
            longest_streak: result.longestStreak,
          }));

          // Attribute update
          const attrKey = `${result.attributeEarned.toLowerCase()}_xp` as keyof Attributes;
          setAttributes((prev) => ({
            ...prev,
            [attrKey]: ((prev[attrKey] as number) || 0) + result.attributeXpEarned,
          }));

          // Handle Level Up
          if (result.leveledUp) {
            soundManager.playLevelUp();
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#06B6D4', '#A855F7', '#F59E0B', '#10B981'],
            });
            const progress = calculateLevelProgress(result.newXP);
            setLevelUpModal({
              isOpen: true,
              oldLevel: result.previousLevel,
              newLevel: result.newLevel,
              rankTitle: progress.rankTitle,
              archetype: profile.archetype,
            });
          }

          // Handle Achievements
          if (result.unlockedAchievements && result.unlockedAchievements.length > 0) {
            const newlyUnlocked = result.unlockedAchievements[0];
            soundManager.playAchievementUnlocked();
            setUnlockedAchievementNotification(newlyUnlocked);
            setAchievements((prev) => [
              ...prev,
              {
                id: `ua-${Date.now()}`,
                user_id: profile.user_id,
                achievement_id: newlyUnlocked.id,
                is_claimed: false,
                unlocked_at: new Date().toISOString(),
                achievement: newlyUnlocked,
              },
            ]);
          }

          return result;
        } else {
          console.warn('API completion non-200, executing local completion fallback.');
        }
      } catch (err) {
        console.warn('API completion network error, executing local completion fallback:', err);
      }
    }

    // Local authoritative calculation (Demo / Offline mode)
    const rewards = calculateAuthoritativeRewards({
      category: targetQuest.category,
      difficulty: targetQuest.difficulty,
      attribute: targetQuest.attribute,
      archetype: profile.archetype,
      currentStreak: streak.current_streak,
    });

    const streakResult = evaluateStreakOnCompletion(streak, getFormattedDateString());

    const previousXP = profile.xp;
    const previousLevel = profile.level;
    const newXP = previousXP + rewards.xpEarned;
    const newGold = profile.gold + rewards.goldEarned;
    const newLevel = calculateLevelFromXP(newXP);
    const leveledUp = newLevel > previousLevel;

    // Attributes update
    const updatedAttributes = { ...attributes };
    const attrKey = `${targetQuest.attribute.toLowerCase()}_xp` as keyof Attributes;
    (updatedAttributes[attrKey] as number) = ((updatedAttributes[attrKey] as number) || 0) + rewards.attributeXpEarned;

    // Quest update
    const completedQuest: Quest = {
      ...targetQuest,
      status: targetQuest.is_recurring ? 'Active' : 'Completed',
      completed_at: new Date().toISOString(),
    };

    // Achievements check
    const unlockedCodes = achievements.map((a) => a.achievement?.code || '').filter(Boolean);
    const completedCount = quests.filter((q) => q.status === 'Completed').length + 1;

    const newAchievements = evaluateNewAchievements({
      questsCompletedCount: completedCount,
      currentStreak: streakResult.currentStreak,
      longestStreak: streakResult.longestStreak,
      level: newLevel,
      goldBalance: newGold,
      attributes: updatedAttributes,
      itemsPurchasedCount: inventory.length,
      unlockedAchievementCodes: unlockedCodes,
    });

    // Sound and visual triggers
    soundManager.playQuestComplete();
    setTimeout(() => soundManager.playGoldClink(), 250);

    // Update state
    setQuests((prev) =>
      targetQuest.is_recurring
        ? prev.map((q) => (q.id === questId ? completedQuest : q))
        : prev.map((q) => (q.id === questId ? completedQuest : q))
    );
    setProfile((prev) => ({
      ...prev,
      xp: newXP,
      level: newLevel,
      gold: newGold,
    }));
    setAttributes(updatedAttributes);
    setStreak((prev) => ({
      ...prev,
      current_streak: streakResult.currentStreak,
      longest_streak: streakResult.longestStreak,
      last_completed_date: streakResult.lastCompletedDate,
    }));

    if (leveledUp) {
      setTimeout(() => soundManager.playLevelUp(), 300);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#06B6D4', '#A855F7', '#F59E0B', '#10B981'],
      });
      const progress = calculateLevelProgress(newXP);
      setLevelUpModal({
        isOpen: true,
        oldLevel: previousLevel,
        newLevel: newLevel,
        rankTitle: progress.rankTitle,
        archetype: profile.archetype,
      });
    }

    if (newAchievements.length > 0) {
      setTimeout(() => soundManager.playAchievementUnlocked(), 500);
      setUnlockedAchievementNotification(newAchievements[0]);
      setAchievements((prev) => [
        ...prev,
        ...newAchievements.map((ach) => ({
          id: `ua-${Date.now()}-${ach.code}`,
          user_id: profile.user_id,
          achievement_id: ach.id,
          is_claimed: false,
          unlocked_at: new Date().toISOString(),
          achievement: ach,
        })),
      ]);
    }

    // Goal-based character unlock check (e.g. 7-day streak for Bio Hacker, Level 10 for Astral Sage, 50 quests for Nova Paladin)
    const prevUnlockedArchetypeIds = ARCHETYPE_LIST.filter((a) =>
      isArchetypeUnlocked(a.id, profile, streak, quests, inventory)
    ).map((a) => a.id);

    const newlyUnlockedChars = evaluateNewlyUnlockedArchetypes(
      { ...profile, xp: newXP, level: newLevel, gold: newGold },
      { ...streak, current_streak: streakResult.currentStreak, longest_streak: streakResult.longestStreak },
      targetQuest.is_recurring ? quests : [...quests.filter((q) => q.id !== questId), completedQuest],
      inventory,
      prevUnlockedArchetypeIds
    );

    if (newlyUnlockedChars.length > 0) {
      const topUnlockedChar = newlyUnlockedChars[0];
      setTimeout(() => {
        soundManager.playAchievementUnlocked();
        confetti({
          particleCount: 120,
          spread: 75,
          origin: { y: 0.5 },
          colors: ['#7C3AED', '#38BDF8', '#C9A227', '#10B981'],
        });
        setUnlockedCharacterNotification(topUnlockedChar);
      }, 700);

      // Add character unlock record to inventory
      const charShopItem = STATIC_SHOP_ITEMS.find(
        (i) => i.effect_type === 'archetype_unlock' && i.effect_value === topUnlockedChar.id
      );
      if (charShopItem) {
        const charInvItem: InventoryItem = {
          id: `inv-char-${Date.now()}-${topUnlockedChar.id}`,
          user_id: profile.user_id,
          item_id: charShopItem.id,
          is_equipped: false,
          quantity: 1,
          acquired_at: new Date().toISOString(),
          item: charShopItem,
        };
        setInventory((prev) =>
          prev.some((inv) => inv.item_id === charShopItem.id) ? prev : [...prev, charInvItem]
        );
      }
    }

    return {
      success: true,
      quest: completedQuest,
      xpEarned: rewards.xpEarned,
      goldEarned: rewards.goldEarned,
      attributeEarned: targetQuest.attribute,
      attributeXpEarned: rewards.attributeXpEarned,
      leveledUp,
      previousLevel,
      newLevel,
      previousXP,
      newXP,
      newGold,
      streakUpdated: streakResult.streakUpdated,
      currentStreak: streakResult.currentStreak,
      longestStreak: streakResult.longestStreak,
      unlockedAchievements: newAchievements,
      message: rewards.archetypeBonusDescription
        ? `Quest completed! ${rewards.archetypeBonusDescription}`
        : 'Quest completed successfully!',
    };
  };

  // Is Archetype Unlocked Helper
  const isArchetypeUnlockedStatus = useCallback(
    (archetypeId: Archetype): boolean => {
      return isArchetypeUnlocked(archetypeId, profile, streak, quests, inventory);
    },
    [profile, streak, quests, inventory]
  );

  // Switch Archetype / Select Character Class
  const switchArchetype = async (
    archetypeId: Archetype
  ): Promise<{ success: boolean; message: string }> => {
    soundManager.playClick();
    const unlocked = isArchetypeUnlockedStatus(archetypeId);

    if (!unlocked) {
      return {
        success: false,
        message: `${archetypeId} is locked. Meet its unlock condition or purchase it in the Shop!`,
      };
    }

    const archInfo = ARCHETYPES[archetypeId];
    if (!archInfo) {
      return { success: false, message: 'Character class not found.' };
    }

    soundManager.playEquip();
    await updateUserProfile({
      archetype: archetypeId,
      avatar_url: archInfo.avatar,
    });

    return { success: true, message: `Switched character class to ${archetypeId}!` };
  };

  // Purchase Shop Item
  const purchaseItem = async (itemId: string): Promise<{ success: boolean; message: string }> => {
    soundManager.playClick();

    if (!isDemoUser && isSupabaseConfigured()) {
      const res = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Purchase failed' };
      }

      soundManager.playGoldClink();
      setProfile((prev) => ({ ...prev, gold: data.newGold }));
      setInventory((prev) => [...prev, data.inventoryItem]);

      const boughtItem = data.inventoryItem?.item;
      if (boughtItem?.effect_type === 'archetype_unlock' && boughtItem.effect_value) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#7C3AED', '#38BDF8', '#C9A227'],
        });
      }

      return { success: true, message: data.message };
    }

    // Local Purchase logic
    const validation = validatePurchase({
      itemId,
      currentGold: profile.gold,
      userInventory: inventory,
    });

    if (!validation.valid || !validation.item) {
      return { success: false, message: validation.errorMessage || 'Invalid purchase' };
    }

    const item = validation.item;
    soundManager.playGoldClink();

    setProfile((prev) => ({
      ...prev,
      gold: validation.newGoldBalance,
    }));

    if (item.effect_type === 'streak_freeze') {
      setStreak((prev) => ({
        ...prev,
        streak_freeze_count: Math.min(3, prev.streak_freeze_count + 1),
      }));
    }

    if (item.effect_type === 'archetype_unlock' && item.effect_value) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#7C3AED', '#38BDF8', '#C9A227'],
      });
    }

    const newInvItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      user_id: profile.user_id,
      item_id: item.id,
      is_equipped: false,
      quantity: 1,
      acquired_at: new Date().toISOString(),
      item,
    };

    setInventory((prev) => [...prev, newInvItem]);
    return { success: true, message: `Acquired ${item.name}!` };
  };

  // Equip Item
  const equipItem = async (inventoryItemId: string): Promise<boolean> => {
    soundManager.playEquip();
    const target = inventory.find((i) => i.id === inventoryItemId);
    if (!target || !target.item) return false;

    const item = target.item;

    if (item.category === 'Theme' && item.effect_value) {
      setProfile((prev) => ({ ...prev, theme: item.effect_value! }));
    } else if (item.category === 'Title' && item.effect_value) {
      setProfile((prev) => ({ ...prev, title: item.effect_value! }));
    } else if (item.category === 'Character' && item.effect_value) {
      await switchArchetype(item.effect_value as Archetype);
    }

    setInventory((prev) =>
      prev.map((inv) =>
        inv.id === inventoryItemId
          ? { ...inv, is_equipped: true }
          : inv.item?.category === item.category
          ? { ...inv, is_equipped: false }
          : inv
      )
    );

    return true;
  };

  // Claim Achievement Reward
  const claimAchievementReward = async (code: string): Promise<boolean> => {
    soundManager.playClick();
    const ach = availableAchievements.find((a) => a.code === code);
    if (!ach) return false;

    if (!isDemoUser && isSupabaseConfigured()) {
      const res = await fetch('/api/achievements/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      setProfile((prev) => ({
        ...prev,
        xp: data.newXp,
        gold: data.newGold,
        level: data.newLevel,
      }));
    } else {
      const newXp = profile.xp + ach.reward_xp;
      const newGold = profile.gold + ach.reward_gold;
      const newLevel = calculateLevelFromXP(newXp);
      setProfile((prev) => ({
        ...prev,
        xp: newXp,
        gold: newGold,
        level: newLevel,
      }));
    }

    soundManager.playGoldClink();
    setAchievements((prev) =>
      prev.map((ua) =>
        ua.achievement?.code === code || ua.achievement_id === ach.id
          ? { ...ua, is_claimed: true, claimed_at: new Date().toISOString() }
          : ua
      )
    );

    return true;
  };

  // Update Profile
  const updateUserProfile = async (updates: Partial<Profile>) => {
    soundManager.playClick();

    if (!isDemoUser && isSupabaseConfigured()) {
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    }

    setProfile((prev) => ({ ...prev, ...updates }));
  };

  // Sound toggle
  const toggleSound = (enabled: boolean) => {
    soundManager.setEnabled(enabled);
    updateUserProfile({ sound_enabled: enabled });
  };

  // Theme set
  const setTheme = (themeId: string) => {
    soundManager.playClick();
    updateUserProfile({ theme: themeId });
  };

  // Modal controls
  const closeLevelUpModal = () => {
    soundManager.playClick();
    setLevelUpModal((prev) => ({ ...prev, isOpen: false }));
  };

  const closeAchievementNotification = () => {
    soundManager.playClick();
    setUnlockedAchievementNotification(null);
  };

  // Login as Demo
  const loginAsDemoUser = (archetypeName: Archetype = 'Cyber Mage') => {
    soundManager.playClick();
    const archetypeData = ARCHETYPES[archetypeName] || ARCHETYPES['Cyber Mage'];

    const newProfile: Profile = {
      ...DEFAULT_PROFILE,
      archetype: archetypeName,
      avatar_url: archetypeData.avatar,
    };

    const starterQuests: Quest[] = archetypeData.starterQuests.map((sq, idx) => ({
      id: `starter-${Date.now()}-${idx}`,
      user_id: newProfile.user_id,
      title: sq.title,
      description: sq.description,
      category: sq.category,
      difficulty: sq.difficulty,
      attribute: sq.attribute,
      xp_reward: 50,
      gold_reward: 25,
      status: 'Active',
      is_recurring: true,
      recurrence_interval: 'Daily',
      due_date: null,
      priority: 'Medium',
      created_at: new Date().toISOString(),
    }));

    setProfile(newProfile);
    setQuests(starterQuests);
    setAttributes(DEFAULT_ATTRIBUTES);
    setStreak(DEFAULT_STREAK);
    setInventory([]);
    setAchievements([]);
    setIsDemoUser(true);
  };

  // Reset Game Data
  const resetAllGameData = () => {
    soundManager.playClick();
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    setProfile(DEFAULT_PROFILE);
    setAttributes(DEFAULT_ATTRIBUTES);
    setStreak(DEFAULT_STREAK);
    setQuests(DEFAULT_QUESTS);
    setInventory([]);
    setAchievements([]);
  };

  // Logout
  const logout = async () => {
    soundManager.playClick();
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    // Clear cached data so sign-in page shows fresh state
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ascend_profile');
      localStorage.removeItem('ascend_attributes');
      localStorage.removeItem('ascend_streak');
      localStorage.removeItem('ascend_quests');
      localStorage.removeItem('ascend_inventory');
      localStorage.removeItem('ascend_achievements');
    }
    setIsDemoUser(true);
    setProfile(DEFAULT_PROFILE);
    setAttributes(DEFAULT_ATTRIBUTES);
    setStreak(DEFAULT_STREAK);
    setQuests(DEFAULT_QUESTS);
    setInventory([]);
    setAchievements([]);
  };

  return (
    <GameContext.Provider
      value={{
        isLoaded,
        isDemoUser,
        isConfigured: isSupabaseConfigured(),
        profile,
        attributes,
        streak,
        quests,
        inventory,
        achievements,
        availableAchievements,
        shopItems,
        levelUpModal,
        unlockedAchievementNotification,
        unlockedCharacterNotification,
        createQuest,
        updateQuest,
        deleteQuest,
        completeQuest,
        purchaseItem,
        equipItem,
        switchArchetype,
        isArchetypeUnlockedStatus,
        claimAchievementReward,
        updateUserProfile,
        closeLevelUpModal,
        closeAchievementNotification,
        closeCharacterNotification,
        toggleSound,
        setTheme,
        loginAsDemoUser,
        resetAllGameData,
        logout,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
