'use client';

// ==============================================================================
// ASCEND - 21-DAY HABIT TRANSFORMATION & NEURAL REWIRING CARD
// High-Impact Flashy Motivational Progression Milestone Component
// ==============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/context/game-context';
import {
  Flame,
  Sparkles,
  Crown,
  Brain,
  Zap,
  Award,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HabitTransformationCard: React.FC = () => {
  const { streak, profile } = useGame();
  const [hasCelebrated, setHasCelebrated] = useState(false);

  const currentStreak = streak.current_streak || 0;
  const completedCycles = Math.floor(currentStreak / 21);
  const isMilestoneActive = currentStreak > 0 && currentStreak % 21 === 0;
  
  // Current 21-day cycle (Cycle 1: 1-21, Cycle 2: 22-42, etc.)
  const currentCycleNumber = isMilestoneActive ? completedCycles : completedCycles + 1;
  const daysInCurrentCycle = isMilestoneActive ? 21 : (currentStreak % 21);
  const daysRemaining = 21 - daysInCurrentCycle;
  const progressPercent = Math.min(100, Math.round((daysInCurrentCycle / 21) * 100));

  // 21-Day Transformation Tiers
  const habitTiers = [
    {
      days: 21,
      title: 'Synaptic Awakening',
      tier: 'Bronze Crest',
      desc: 'Overcame initial neurological resistance. Baseline habit formed.',
      color: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      days: 42,
      title: 'Neural Architect',
      tier: 'Silver Crest',
      desc: 'Subconscious automaticity achieved. Friction reduced by 80%.',
      color: 'from-slate-400 to-cyan-500',
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    },
    {
      days: 63,
      title: 'Discipline Singularity',
      tier: 'Gold Crest',
      desc: 'Identity transformation locked in. The habit is now who you are.',
      color: 'from-purple-500 to-pink-500',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      days: 84,
      title: 'Eternal Ascendant',
      tier: 'Diamond Crest',
      desc: 'Unbreakable mastery. Supreme life momentum achieved.',
      color: 'from-indigo-600 via-purple-600 to-sky-400',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
  ];

  const currentTierInfo =
    habitTiers[Math.min(habitTiers.length - 1, completedCycles)] || habitTiers[0];

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7C3AED', '#38BDF8', '#F59E0B', '#EC4899'],
    });
    setHasCelebrated(true);
    setTimeout(() => setHasCelebrated(false), 3000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-[2px] bg-gradient-to-r from-[#7C3AED] via-[#FF5E3A] to-[#38BDF8] shadow-lg shadow-purple-500/10 transition-all">
      <div className="rounded-[22px] bg-white p-6 sm:p-8 relative overflow-hidden">
        {/* Background Ambient Glow & Neural Circuit Pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 via-sky-100/30 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
        
        {/* TOP HEADER & TITLE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5EA]">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#38BDF8] flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>21-DAY NEUROPLASTICITY ENGINE</span>
                </span>
                {completedCycles > 0 && (
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-500" />
                    <span>{completedCycles}x Transformed</span>
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
                21-Day Habit Transformation
              </h2>
              <p className="text-xs sm:text-sm font-sans text-[#6E6E73] mt-0.5">
                Scientifically proven habit rewiring cycle. Complete 21 consecutive days to permanently solidify routines into subconscious muscle memory.
              </p>
            </div>
          </div>

          {/* Action / Celebration Button */}
          <button
            onClick={handleCelebrate}
            className="px-5 py-2.5 btn-primary-gradient text-white font-semibold text-xs rounded-full shadow-sm hover:opacity-95 transition-all flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer self-start sm:self-center"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isMilestoneActive ? 'Claim 21d Transformation!' : 'Surge Motivation'}</span>
          </button>
        </div>

        {/* 2. PROGRESS DISPLAY & 21-NODE MATRIX */}
        <div className="py-6 border-b border-[#E5E5EA] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono font-bold">
            <div className="flex items-center space-x-2">
              <span className="text-purple-700 uppercase">Cycle {currentCycleNumber} Protocol:</span>
              <span className="text-[#1D1D1F] text-sm">
                Day {daysInCurrentCycle} / 21
              </span>
            </div>
            <div className="text-[#6E6E73]">
              {isMilestoneActive ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> 21-Day Milestone Cleared!
                </span>
              ) : (
                <span>{daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} until next transformation lock</span>
              )}
            </div>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full bg-[#F5F5F7] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#E5E5EA]">
            <div
              className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#38BDF8]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 21 SEGMENTED DAY NODES */}
          <div className="pt-2">
            <div className="text-[11px] font-mono text-[#8E8E93] uppercase mb-2 flex items-center justify-between">
              <span>21-Day Micro-Node Sequence</span>
              <span>{progressPercent}% Rewired</span>
            </div>
            <div className="grid grid-cols-7 sm:grid-cols-21 gap-1.5">
              {Array.from({ length: 21 }).map((_, index) => {
                const dayNumber = index + 1;
                const isPassed = dayNumber <= daysInCurrentCycle;
                const isCurrent = dayNumber === daysInCurrentCycle;

                return (
                  <div
                    key={dayNumber}
                    title={`Day ${dayNumber} of 21-day cycle`}
                    className={`h-7 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                      isPassed
                        ? 'bg-gradient-to-tr from-[#7C3AED] to-[#38BDF8] text-white shadow-xs'
                        : 'bg-[#F5F5F7] border border-[#E5E5EA] text-[#8E8E93]'
                    } ${isCurrent ? 'ring-2 ring-purple-500 ring-offset-1 scale-105' : ''}`}
                  >
                    {isPassed ? '✓' : dayNumber}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. TRANSFORMATION MILESTONE CRESTS GRID */}
        <div className="pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#6E6E73]">
              21-Day Mastery Crests & Rewards
            </h3>
            <span className="text-xs font-mono text-purple-600 font-semibold">
              Current Rank: {currentTierInfo.title}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {habitTiers.map((tier) => {
              const isUnlocked = currentStreak >= tier.days;
              const isCurrent = currentStreak < tier.days && currentStreak >= (tier.days - 21);

              return (
                <div
                  key={tier.days}
                  className={`p-4 rounded-2xl border transition-all ${
                    isUnlocked
                      ? 'bg-gradient-to-b from-purple-50/60 to-white border-purple-200 shadow-sm'
                      : isCurrent
                      ? 'bg-white border-purple-300 ring-1 ring-purple-300 shadow-xs'
                      : 'bg-[#FAF9F5] border-[#E5E5EA] opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#1D1D1F]">
                      {tier.days} Days
                    </span>
                    {isUnlocked ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-semibold text-[#8E8E93]">
                        {tier.days - currentStreak}d left
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-extrabold text-[#1D1D1F] tracking-tight">
                    {tier.title}
                  </div>
                  <div className="text-[11px] font-mono text-purple-600 font-semibold mt-0.5">
                    {tier.tier}
                  </div>

                  <p className="text-[11px] font-sans text-[#6E6E73] mt-2 leading-relaxed">
                    {tier.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
