'use client';

// ==============================================================================
// ASCEND - SIMPLIFIED DASHBOARD
// Clean, calm daily quest board and progress summary
// ==============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useGame } from '@/lib/context/game-context';
import { CharacterHUD } from '@/components/character/CharacterHUD';
import { QuestCard } from '@/components/quests/QuestCard';
import { CreateQuestModal } from '@/components/modals/CreateQuestModal';
import { PageMascot } from '@/components/PageMascot';
import {
  Plus,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Trophy,
  Calendar,
  Layers,
  ArrowRight,
  Brain,
  BarChart3,
} from 'lucide-react';
import { isQuestScheduledForDate, isQuestCompletedOnDate, getTodayDateString } from '@/lib/progression/schedule';
import { AmbientBackground } from '@/components/ui/AmbientBackground';

export default function DashboardPage() {
  const { quests, streak, profile } = useGame();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'Active' | 'Daily' | 'All' | 'Completed'>('All');

  const todayIso = getTodayDateString();

  // Quests relevant to today:
  // 1. Recurring quests scheduled for today's weekday
  // 2. One-off quests with today's due date OR unscheduled active/completed today
  const todayQuests = quests.filter((q) => {
    if (q.is_recurring) {
      return isQuestScheduledForDate(q, todayIso);
    }
    if (q.due_date) {
      const due = q.due_date.includes('T') ? q.due_date.split('T')[0] : q.due_date;
      return due === todayIso;
    }
    return q.status === 'Active' || isQuestCompletedOnDate(q, todayIso);
  });

  // "Active" tab shows all quests for today (pending + completed recurring habits)
  // so completed quests stay visible and don't disappear after refresh
  const activeToday = todayQuests.filter((q) => !isQuestCompletedOnDate(q, todayIso) || q.is_recurring);
  const completedToday = todayQuests.filter((q) => isQuestCompletedOnDate(q, todayIso));
  const dailyQuests = todayQuests.filter((q) => q.is_recurring);

  let displayedQuests = activeToday;
  if (filterType === 'All') displayedQuests = todayQuests;
  if (filterType === 'Daily') displayedQuests = dailyQuests;
  if (filterType === 'Completed') displayedQuests = completedToday;

  return (
    <div className="space-y-8 pb-16">
      {/* 1. CHARACTER PROGRESS BAR & HUD */}
      <CharacterHUD />

      {/* 2. MAIN FOCUSED WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: TODAY'S QUESTS (8 COLS) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between border-b border-[#E5E5EA] pb-3">
            <div>
              <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">
                Today&apos;s Quests
              </h2>
              <p className="text-xs text-[#6E6E73] mt-0.5">
                Complete tasks to earn XP, gold coins, and maintain your streak.
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 btn-primary-gradient font-semibold text-xs rounded-full flex items-center space-x-1.5 cursor-pointer shadow-sm hover:shadow-md transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>New Quest</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center space-x-2 py-1 overflow-x-auto">
            {(['Active', 'Daily', 'All', 'Completed'] as const).map((type) => {
              const label = type === 'Daily' ? 'Daily Habits' : type;
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                    filterType === type
                      ? 'bg-[#F2F2F7] text-[#7C3AED] border-[#7C3AED]/40'
                      : 'bg-white text-[#6E6E73] border-[#E5E5EA] hover:text-[#1D1D1F]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Quest Cards List */}
          <div className="space-y-3">
            {displayedQuests.length === 0 ? (
              <div className="py-16 text-center text-[#6E6E73] apple-card bg-white relative overflow-hidden">
                <AmbientBackground variant="card" />
                <p className="font-semibold text-base text-[#1D1D1F] relative z-10">No {filterType.toLowerCase()} quests</p>
                <p className="text-xs mt-1 text-[#8E8E93] relative z-10">Click &quot;+ New Quest&quot; to add your first task.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayedQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    isCompletedOverride={isQuestCompletedOnDate(quest, todayIso)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: TODAY'S SUMMARY & QUICK SHORTCUTS (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Today's Goals Summary */}
          <div className="apple-card p-6 space-y-4 relative">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#6E6E73] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                <span>Today&apos;s Summary</span>
              </h3>
              <PageMascot animationType="running" size={80} showBadge={true} badgeText="Momentum" />
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E5E5EA] flex justify-between items-center">
                <div>
                  <div className="font-semibold text-[#1D1D1F]">Daily Habits</div>
                  <div className="text-[11px] text-[#6E6E73] mt-0.5">Recurring routine today</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#7C3AED] text-sm">
                    {dailyQuests.filter((q) => isQuestCompletedOnDate(q, todayIso)).length} / {dailyQuests.length}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E5E5EA] flex justify-between items-center">
                <div>
                  <div className="font-semibold text-[#1D1D1F]">Today&apos;s Progress</div>
                  <div className="text-[11px] text-[#6E6E73] mt-0.5">Tasks cleared today</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#2E7D32] text-sm">
                    {completedToday.length} / {todayQuests.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="apple-card p-6 space-y-3">
            <h3 className="text-xs font-bold text-[#6E6E73] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#7C3AED]" />
              <span>Quick Navigation</span>
            </h3>
            <div className="grid grid-cols-1 gap-2 pt-1">
              <Link
                href="/calendar"
                className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E5EA] hover:border-[#D1D1D6] text-[#1D1D1F] font-semibold text-xs transition-all flex items-center justify-between group"
              >
                <span className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#38BDF8]" />
                  <span>Calendar & Schedule</span>
                </span>
                <span className="text-[#8E8E93] group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
              <Link
                href="/character"
                className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E5EA] hover:border-[#D1D1D6] text-[#1D1D1F] font-semibold text-xs transition-all flex items-center justify-between group"
              >
                <span className="flex items-center gap-2.5">
                  <Brain className="w-4 h-4 text-[#7C3AED]" />
                  <span>Character Skills & Perks</span>
                </span>
                <span className="text-[#8E8E93] group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
              <Link
                href="/shop"
                className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E5EA] hover:border-[#D1D1D6] text-[#1D1D1F] font-semibold text-xs transition-all flex items-center justify-between group"
              >
                <span className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-[#C9A227]" />
                  <span>Rewards Shop</span>
                </span>
                <span className="text-[#8E8E93] group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
              <Link
                href="/analytics"
                className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E5EA] hover:border-[#D1D1D6] text-[#1D1D1F] font-semibold text-xs transition-all flex items-center justify-between group"
              >
                <span className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 text-[#2E7D32]" />
                  <span>Activity & Analytics</span>
                </span>
                <span className="text-[#8E8E93] group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CreateQuestModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}
