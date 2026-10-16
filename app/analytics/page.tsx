'use client';

// ==============================================================================
// ASCEND - ANALYTICS & TELEMETRY COMMAND MATRIX
// Apple Bright Premium Analytics Dashboard
// ==============================================================================

import React, { useState } from 'react';
import { useGame } from '@/lib/context/game-context';
import { HeatmapGrid } from '@/components/analytics/HeatmapGrid';
import { ATTRIBUTE_LIST, getTotalAttributeXP } from '@/lib/progression/attributes';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { PageMascot } from '@/components/PageMascot';
import {
  Activity,
  TrendingUp,
  Flame,
  Zap,
  Coins,
  CheckCircle2,
  Layers,
  Clock,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { quests, profile, streak, attributes } = useGame();
  const [activeTimeframe, setActiveTimeframe] = useState<'30d' | 'all'>('30d');
  const [todayFocusSeconds, setTodayFocusSeconds] = useState<number>(0);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const todayKey = `ascend_focus_screentime_${new Date().toISOString().split('T')[0]}`;
    const saved = localStorage.getItem(todayKey);
    if (saved) {
      setTodayFocusSeconds(parseInt(saved, 10) || 0);
    }
  }, []);

  const completedQuests = quests.filter((q) => q.status === 'Completed');
  const activeQuests = quests.filter((q) => q.status === 'Active');

  const completionRate = quests.length > 0 ? Math.round((completedQuests.length / quests.length) * 100) : 0;

  // Category distribution
  const categories = ['Work', 'Fitness', 'Learning', 'Habit', 'Creative', 'Social'] as const;
  const categoryStats = categories.map((cat) => {
    const total = quests.filter((q) => q.category === cat).length;
    const completed = quests.filter((q) => q.category === cat && q.status === 'Completed').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { name: cat, total, completed, rate };
  });

  const totalAttrXP = getTotalAttributeXP(attributes);

  return (
    <div className="space-y-10 pb-16 pt-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* 1. TELEMETRY HEADER HUD */}
      <div className="apple-card p-6 sm:p-8 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#E5E5EA]">
          <div className="flex items-center space-x-5 text-center md:text-left">
            <PageMascot
              animationType="studying"
              size={88}
              showBadge={true}
              badgeText="Deep Tracking"
              className="shrink-0"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] tracking-tight">
                Activity & Stats
              </h1>
              <p className="text-xs sm:text-sm text-[#6E6E73] mt-0.5 max-w-xl">
                Track your daily consistency, completed quests, and skill progress over time.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#F5F5F7] p-1 rounded-2xl border border-[#E5E5EA]">
            <button
              onClick={() => setActiveTimeframe('30d')}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTimeframe === '30d'
                  ? 'btn-primary-gradient text-white shadow-sm'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              30-Day
            </button>
            <button
              onClick={() => setActiveTimeframe('all')}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTimeframe === 'all'
                  ? 'btn-primary-gradient text-white shadow-sm'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              All-Time
            </button>
          </div>
        </div>

        {/* Velocity Metric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
          <div className="p-5 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA]">
            <div className="flex items-center justify-between text-[#6E6E73] mb-1.5">
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider">Total XP</span>
              <Zap className="w-4 h-4 text-purple-600" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#1D1D1F]">
              <AnimatedCounter value={profile.xp} />
            </div>
            <div className="text-[11px] font-mono text-purple-600 font-semibold mt-1">Progression curve</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA]">
            <div className="flex items-center justify-between text-[#6E6E73] mb-1.5">
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider">Treasury Gold</span>
              <Coins className="w-4 h-4 text-amber-500" />
            </div>
            <div className="font-mono text-2xl font-bold text-amber-600">
              <AnimatedCounter value={profile.gold} /> G
            </div>
            <div className="text-[11px] font-mono text-[#6E6E73] font-medium mt-1">Available balance</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA]">
            <div className="flex items-center justify-between text-[#6E6E73] mb-1.5">
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider">Active Streak</span>
              <Flame className="w-4 h-4 text-orange-600" />
            </div>
            <div className="font-mono text-2xl font-bold text-orange-600">
              {streak.current_streak} Days
            </div>
            <div className="text-[11px] font-mono text-[#6E6E73] font-medium mt-1">Peak: {streak.longest_streak}d</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA]">
            <div className="flex items-center justify-between text-[#6E6E73] mb-1.5">
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider">Completion Rate</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#1D1D1F]">
              {completionRate}%
            </div>
            <div className="text-[11px] font-mono text-[#6E6E73] font-medium mt-1">{completedQuests.length} of {quests.length} cleared</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA]">
            <div className="flex items-center justify-between text-[#6E6E73] mb-1.5">
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider">Screen Time</span>
              <Clock className="w-4 h-4 text-sky-600" />
            </div>
            <div className="font-mono text-2xl font-bold text-sky-600">
              {Math.floor(todayFocusSeconds / 3600) > 0 ? `${Math.floor(todayFocusSeconds / 3600)}h ` : ''}{Math.floor((todayFocusSeconds % 3600) / 60)}m
            </div>
            <div className="text-[11px] font-mono text-[#6E6E73] font-medium mt-1">Today&apos;s focus timer</div>
          </div>
        </div>
      </div>

      {/* 2. ACTIVITY HEAT-DENSITY GRID */}
      <HeatmapGrid />

      {/* 3. DUAL COLUMN BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Matrix */}
        <div className="apple-card p-6 sm:p-8">
          <div className="flex items-center space-x-3 pb-4 mb-5 border-b border-[#E5E5EA]">
            <Layers className="w-5 h-5 text-purple-600" />
            <div>
              <h2 className="text-lg font-bold text-[#1D1D1F]">
                Category Performance
              </h2>
              <p className="text-xs text-[#6E6E73] mt-0.5">Task completion velocity per domain</p>
            </div>
          </div>

          <div className="space-y-4">
            {categoryStats.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono font-medium">
                  <span className="text-[#1D1D1F] font-bold">{cat.name}</span>
                  <span className="text-[#6E6E73]">
                    {cat.completed} / {cat.total} cleared ({cat.rate}%)
                  </span>
                </div>
                <div className="w-full bg-[#E5E5EA] rounded-full h-2.5 overflow-hidden">
                  <div
                    className="btn-primary-gradient h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attribute Mastery Share */}
        <div className="apple-card p-6 sm:p-8">
          <div className="flex items-center space-x-3 pb-4 mb-5 border-b border-[#E5E5EA]">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <div>
              <h2 className="text-lg font-bold text-[#1D1D1F]">
                Attribute Distribution
              </h2>
              <p className="text-xs text-[#6E6E73] mt-0.5">Share of cumulative attribute points</p>
            </div>
          </div>

          <div className="space-y-4">
            {ATTRIBUTE_LIST.map((attr) => {
              const attrKey = `${attr.type.toLowerCase()}_xp` as keyof typeof attributes;
              const currentXP = (attributes[attrKey] as number) || 0;
              const sharePercent = totalAttrXP > 0 ? Math.round((currentXP / totalAttrXP) * 100) : 0;

              return (
                <div key={attr.type} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono font-medium">
                    <span className="text-[#1D1D1F] font-bold">
                      {attr.name} ({attr.shortName})
                    </span>
                    <span className="text-[#6E6E73]">
                      {currentXP} XP ({sharePercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#E5E5EA] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${sharePercent}%`,
                        backgroundColor: attr.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

