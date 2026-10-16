'use client';

// ==============================================================================
// ASCEND - ACHIEVEMENTS & TROPHY HALL
// Apple Bright Premium Achievements Page
// ==============================================================================

import React, { useState } from 'react';
import { useGame } from '@/lib/context/game-context';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { PageMascot } from '@/components/PageMascot';
import {
  Trophy,
  Crown,
} from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

export default function AchievementsPage() {
  const { availableAchievements, achievements } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'General', 'Quests', 'Streaks', 'Attributes', 'Economy'];

  const unlockedCount = achievements.length;
  const totalCount = availableAchievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = availableAchievements.filter((ach) => {
    if (selectedCategory === 'All') return true;
    return ach.category === selectedCategory;
  });

  return (
    <div className="space-y-10 pb-16 pt-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* 1. TOP STATS HERO */}
      <div className="apple-card p-6 sm:p-8 relative">
        <div className="absolute -top-3 right-8 hidden sm:block">
          <PageMascot animationType="hanging" size={88} position="top-edge" />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#E5E5EA]">
          <div className="flex items-center space-x-5 text-center md:text-left">
            <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600 shrink-0 shadow-sm">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#1D1D1F] tracking-tight">
                Achievements & Trophies
              </h1>
              <p className="text-xs sm:text-sm font-sans text-[#6E6E73] mt-1 max-w-lg">
                Track your achievements, streaks, and milestone badges.
              </p>
            </div>
          </div>

          <div className="px-5 py-3 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] flex items-center space-x-4 shrink-0">
            <Crown className="w-6 h-6 text-amber-500" />
            <div>
              <div className="text-[11px] font-mono text-[#6E6E73] uppercase font-medium">Unlocked Badges</div>
              <div className="font-mono text-xl font-bold text-[#1D1D1F] mt-0.5">
                <AnimatedCounter value={unlockedCount} /> / {totalCount} ({progressPercent}%)
              </div>
            </div>
          </div>
        </div>

        {/* Global Trophy Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-mono text-[#6E6E73] uppercase font-medium mb-2">
            <span>Overall Progress</span>
            <span className="text-amber-600 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#E5E5EA] rounded-full h-3 overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. CATEGORY TABS */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-[#E5E5EA]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shrink-0 border cursor-pointer ${
              selectedCategory === cat
                ? 'btn-primary-gradient text-white shadow-sm'
                : 'bg-white text-[#6E6E73] border-[#E5E5EA] hover:border-[#C7C7CC] hover:text-[#1D1D1F]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. ACHIEVEMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAchievements.map((ach) => {
          const userAch = achievements.find(
            (ua) => ua.achievement_id === ach.id || ua.achievement?.code === ach.code
          );
          return (
            <AchievementCard key={ach.id} achievement={ach} userAchievement={userAch} />
          );
        })}
      </div>
    </div>
  );
}

