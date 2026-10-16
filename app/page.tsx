'use client';

// ==============================================================================
// ASCEND - LANDING PAGE
// Apple-Inspired Bright Premium Product Design
// ==============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Coins,
  Brain,
  CheckCircle2,
  Shield,
  Target,
  Flame,
  Award,
  Terminal,
  Layers,
  Crown,
} from 'lucide-react';
import { ARCHETYPE_LIST } from '@/lib/progression/archetypes';
import HeroCharacter from '@/components/HeroCharacter';
import { PageMascot, PageMascotType } from '@/components/PageMascot';
import { AmbientBackground } from '@/components/ui/AmbientBackground';

export default function LandingPage() {
  const [demoQuestCompleted, setDemoQuestCompleted] = useState(false);
  const [activeArchetypeTab, setActiveArchetypeTab] = useState(ARCHETYPE_LIST[0].id);
  const [heroMascotMode, setHeroMascotMode] = useState<'avatar' | PageMascotType>('avatar');

  const selectedArch = ARCHETYPE_LIST.find((a) => a.id === activeArchetypeTab) || ARCHETYPE_LIST[0];

  return (
    <div className="space-y-16 pb-20 relative">
      {/* Dynamic Ambient Background Motion */}
      <AmbientBackground variant="section" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* LEFT: VALUE PROPOSITION (7 COLS) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#FAF9F5] border border-[#E5E5EA] rounded-full text-xs font-semibold text-[#1D1D1F] shadow-xs">
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              <span>Real-Life RPG Habit & Task Gamification</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1D1D1F] tracking-tight leading-[1.08]">
              Upgrade your real life like an <span className="bg-gradient-to-r from-[#7C3AED] via-[#FF5E3A] to-[#C9A227] bg-clip-text text-transparent">RPG hero</span>.
            </h1>

            <p className="text-lg sm:text-xl text-[#6E6E73] max-w-2xl font-normal leading-relaxed">
              Turn your everyday tasks, workouts, study sessions, and habits into fun quests. Earn XP, level up your character, build streaks, and stay motivated every day.
            </p>

            {/* Verb-led Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-start gap-4">
              <Link
                href="/auth/signup"
                className="px-8 py-4 btn-primary-gradient font-semibold text-base rounded-full inline-flex items-center justify-center space-x-2 group cursor-pointer shadow-md hover:shadow-lg transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Quick Feature Pills */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#E5E5EA]">
              <div className="p-3 bg-white rounded-2xl border border-[#E5E5EA] shadow-sm">
                <div className="text-xs text-[#8E8E93] font-medium">Growth</div>
                <div className="text-sm font-semibold text-[#1D1D1F] mt-0.5">6 Life Skills</div>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-[#E5E5EA] shadow-sm">
                <div className="text-xs text-[#8E8E93] font-medium">Consistency</div>
                <div className="text-sm font-semibold text-[#7C3AED] mt-0.5">Daily Streaks</div>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-[#E5E5EA] shadow-sm">
                <div className="text-xs text-[#8E8E93] font-medium">Rewards</div>
                <div className="text-sm font-semibold text-[#C9A227] mt-0.5">Shop & Badges</div>
              </div>
            </div>
          </div>

          {/* RIGHT: DEDICATED CHARACTER & MASCOT FRAME (5 COLS) */}
          <div className="lg:col-span-5 relative">
            <div className="apple-card p-6 sm:p-8 relative overflow-hidden group">
              {/* Header with Mascot Activity Switcher */}
              <div className="flex flex-col gap-2 border-b border-[#E5E5EA] pb-3 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-pulse" />
                    <span className="text-xs font-semibold text-[#1D1D1F] tracking-wide">
                      {heroMascotMode === 'avatar' ? 'Cyber Mage • Level 14' : `Mascot • ${heroMascotMode.toUpperCase()}`}
                    </span>
                  </div>
                  <span className="text-xs font-semibold bg-[#F2F2F7] px-2.5 py-0.5 rounded-full text-[#6E6E73]">
                    Interactive Preview
                  </span>
                </div>

                {/* Mode Selector Tabs */}
                <div className="flex items-center space-x-1 overflow-x-auto py-1">
                  {(['avatar', 'hanging', 'running', 'cycling', 'gym', 'studying'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setHeroMascotMode(mode)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all capitalize cursor-pointer border ${
                        heroMascotMode === mode
                          ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-xs'
                          : 'bg-[#FAF9F5] text-[#6E6E73] border-[#E5E5EA] hover:text-[#1D1D1F]'
                      }`}
                    >
                      {mode === 'avatar' ? 'Avatar' : mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Illustration / Lottie Animation Canvas */}
              <div className="relative h-72 sm:h-80 w-full flex items-center justify-center my-2">
                {heroMascotMode === 'avatar' ? (
                  <HeroCharacter className="w-full h-full" />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <PageMascot
                      animationType={heroMascotMode}
                      size={200}
                      showBadge={true}
                    />
                  </div>
                )}
              </div>

              {/* Telemetry Bar */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5 text-[#6E6E73]">
                    <span>XP PROGRESSION</span>
                    <span className="text-[#7C3AED]">1,840 / 2,500 XP</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#E5E5EA] rounded-full overflow-hidden">
                    <div className="h-full btn-primary-gradient w-[73%] rounded-full" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-medium pt-1">
                  <div className="bg-[#FAF9F5] p-2.5 rounded-xl border border-[#E5E5EA] flex justify-between items-center">
                    <span className="text-[#6E6E73]">Intellect</span>
                    <span className="text-[#7C3AED] font-semibold">Lvl 18</span>
                  </div>
                  <div className="bg-[#FAF9F5] p-2.5 rounded-xl border border-[#E5E5EA] flex justify-between items-center">
                    <span className="text-[#6E6E73]">Discipline</span>
                    <span className="text-[#38BDF8] font-semibold">Lvl 15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. LIVE INTERACTIVE QUEST DEMO WIDGET */}
      <section className="max-w-3xl mx-auto px-4">
        <div className="apple-card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4 border-b border-[#E5E5EA] pb-3">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              <span className="text-xs font-semibold text-[#1D1D1F] tracking-wide uppercase">
                Try a Sample Quest
              </span>
            </div>
            <span className="text-xs text-[#8E8E93]">Click the checkbox to try it</span>
          </div>

          <div
            onClick={() => setDemoQuestCompleted(!demoQuestCompleted)}
            className={`p-4.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              demoQuestCompleted
                ? 'bg-[#F2F2F7] border-[#7C3AED]'
                : 'bg-white border-[#E5E5EA] hover:border-[#D1D1D6]'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                  demoQuestCompleted
                    ? 'btn-primary-gradient border-transparent text-white'
                    : 'border-[#C7C7CC] text-transparent bg-white'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className={`text-base font-semibold ${demoQuestCompleted ? 'line-through text-[#8E8E93]' : 'text-[#1D1D1F]'}`}>
                  Complete 25-minute deep focus session
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-[#7C3AED] bg-[#F2F2F7] px-2.5 py-0.5 rounded-full">
                    Medium
                  </span>
                  <span className="text-xs font-semibold text-[#38BDF8] bg-[#F2F2F7] px-2.5 py-0.5 rounded-full">
                    +60 Intellect XP
                  </span>
                </div>
              </div>
            </div>

            <span className="text-sm font-semibold text-[#C9A227] flex items-center gap-1.5 bg-[#FAF9F5] px-3.5 py-1.5 rounded-full border border-[#E5E5EA]">
              <Coins className="w-4 h-4 text-[#C9A227]" /> +30 Gold
            </span>
          </div>

          {demoQuestCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3.5 rounded-xl border border-[#7C3AED]/30 bg-[#F2F2F7] text-xs font-medium text-[#7C3AED] flex items-center justify-between"
            >
              <span className="flex items-center gap-2 font-semibold">
                <Zap className="w-4 h-4 text-[#7C3AED] fill-[#7C3AED]" />
                <span>Quest Completed! +60 XP added to Intellect</span>
              </span>
              <span className="text-[#1D1D1F] font-bold flex items-center gap-1">
                <Flame className="w-4 h-4 text-[#7C3AED]" /> 1 Day Streak
              </span>
            </motion.div>
          )}
        </div>
      </section>

      {/* 3. CORE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1D1D1F] tracking-tight font-sans">
            How ASCEND Works
          </h2>
          <p className="text-[#6E6E73] text-base max-w-2xl mx-auto">
            Simple habit mechanics designed to build momentum, consistency, and daily focus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="apple-card apple-card-hover p-8">
            <div className="w-12 h-12 rounded-2xl bg-[#F2F2F7] flex items-center justify-center text-[#7C3AED] mb-6">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-[#1D1D1F] mb-3">6 Life Skills</h3>
            <p className="text-sm text-[#6E6E73] leading-relaxed">
              Tag tasks to Intellect, Strength, Vitality, Discipline, Creativity, or Social to level up your real-life skills.
            </p>
          </div>

          <div className="apple-card apple-card-hover p-8">
            <div className="w-12 h-12 rounded-2xl bg-[#F2F2F7] flex items-center justify-center text-[#38BDF8] mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-[#1D1D1F] mb-3">Level Up</h3>
            <p className="text-sm text-[#6E6E73] leading-relaxed">
              Earn XP as you complete daily goals. Watch your level grow from Initiate to Master.
            </p>
          </div>

          <div className="apple-card apple-card-hover p-8">
            <div className="w-12 h-12 rounded-2xl bg-[#F2F2F7] flex items-center justify-center text-[#C9A227] mb-6">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-[#1D1D1F] mb-3">Rewards Shop</h3>
            <p className="text-sm text-[#6E6E73] leading-relaxed">
              Earn gold coins to unlock fun visual themes, profile badges, custom titles, and streak protection items.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CONTEXTUAL ACTIVITY MASCOT SYSTEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#F2F2F7] border border-[#E5E5EA] rounded-full text-[#7C3AED] text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Animated Activity System</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1D1D1F] tracking-tight font-sans">
            Real-Life Activities Become Quests
          </h2>
          <p className="text-[#6E6E73] text-base max-w-2xl mx-auto">
            Dynamic vector mascots reinforce your real-world habit momentum across every page in ASCEND.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dashboard" className="apple-card apple-card-hover p-6 text-center group cursor-pointer block">
            <div className="h-36 flex items-center justify-center mb-3">
              <PageMascot animationType="running" size={110} showBadge={false} />
            </div>
            <h3 className="text-base font-bold text-[#1D1D1F] group-hover:text-[#7C3AED] transition-colors">
              Running / Momentum
            </h3>
            <p className="text-xs text-[#6E6E73] mt-1">
              Drives the <strong>Dashboard</strong> with daily habit tracking & streak energy.
            </p>
            <span className="inline-block mt-3 text-[11px] font-mono font-bold text-[#7C3AED] bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
              Dashboard →
            </span>
          </Link>

          <Link href="/quests" className="apple-card apple-card-hover p-6 text-center group cursor-pointer block">
            <div className="h-36 flex items-center justify-center mb-3">
              <PageMascot animationType="cycling" size={110} showBadge={false} />
            </div>
            <h3 className="text-base font-bold text-[#1D1D1F] group-hover:text-[#7C3AED] transition-colors">
              Cycling / Pacing
            </h3>
            <p className="text-xs text-[#6E6E73] mt-1">
              Powers the <strong>Quests Page</strong> to keep tasks and routines in continuous motion.
            </p>
            <span className="inline-block mt-3 text-[11px] font-mono font-bold text-[#38BDF8] bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
              Quests Board →
            </span>
          </Link>

          <Link href="/character" className="apple-card apple-card-hover p-6 text-center group cursor-pointer block">
            <div className="h-36 flex items-center justify-center mb-3">
              <PageMascot animationType="gym" size={110} showBadge={false} />
            </div>
            <h3 className="text-base font-bold text-[#1D1D1F] group-hover:text-[#7C3AED] transition-colors">
              Gym / Strength Workout
            </h3>
            <p className="text-xs text-[#6E6E73] mt-1">
              Anchors the <strong>Character Page</strong> for strength, fitness, and RPG level progression.
            </p>
            <span className="inline-block mt-3 text-[11px] font-mono font-bold text-[#7C3AED] bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
              Character Dossier →
            </span>
          </Link>

          <Link href="/analytics" className="apple-card apple-card-hover p-6 text-center group cursor-pointer block">
            <div className="h-36 flex items-center justify-center mb-3">
              <PageMascot animationType="studying" size={110} showBadge={false} />
            </div>
            <h3 className="text-base font-bold text-[#1D1D1F] group-hover:text-[#7C3AED] transition-colors">
              Studying / Deep Focus
            </h3>
            <p className="text-xs text-[#6E6E73] mt-1">
              Elevates the <strong>Analytics Page</strong> for telemetry, consistency, and reflection.
            </p>
            <span className="inline-block mt-3 text-[11px] font-mono font-bold text-[#2E7D32] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Telemetry & Stats →
            </span>
          </Link>
        </div>
      </section>

      {/* 5. ARCHETYPE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1D1D1F] tracking-tight font-sans">
            Choose Your Character Class
          </h2>
          <p className="text-[#6E6E73] text-base max-w-2xl mx-auto">
            Every archetype comes with tailored starter quests and passive XP bonuses.
          </p>
        </div>

        {/* Archetype Selector Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 mb-8">
          {ARCHETYPE_LIST.map((arch) => (
            <button
              key={arch.id}
              onClick={() => setActiveArchetypeTab(arch.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeArchetypeTab === arch.id
                  ? 'btn-primary-gradient'
                  : 'bg-white text-[#6E6E73] border border-[#E5E5EA] hover:text-[#1D1D1F]'
              }`}
            >
              {arch.name}
            </button>
          ))}
        </div>

        {/* Archetype Card */}
        <div className="apple-card p-8 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="inline-block text-xs font-semibold text-[#7C3AED] bg-[#F2F2F7] px-3 py-1 rounded-full">
                {selectedArch.role}
              </span>
              <h3 className="text-3xl font-bold text-[#1D1D1F]">{selectedArch.name}</h3>
              <p className="text-sm text-[#7C3AED] font-semibold">{selectedArch.title}</p>
              <p className="text-[#6E6E73] text-sm leading-relaxed">{selectedArch.lore}</p>

              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E5EA] space-y-1">
                <div className="text-xs font-semibold text-[#8E8E93] uppercase">Class Perk</div>
                <div className="text-sm font-semibold text-[#1D1D1F]">{selectedArch.perk}</div>
              </div>

              <Link
                href="/auth/signup"
                className="inline-flex items-center space-x-2 px-6 py-3.5 btn-primary-gradient font-semibold text-xs rounded-full cursor-pointer"
              >
                <span>Start as {selectedArch.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Starter Quests Preview */}
            <div className="space-y-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E5EA] p-6">
              <div className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider mb-2 border-b border-[#E5E5EA] pb-3 flex items-center justify-between">
                <span>Starter Quests</span>
                <Target className="w-4 h-4 text-[#7C3AED]" />
              </div>
              {selectedArch.starterQuests.map((sq, i) => {
                const reward = sq.difficulty === 'Easy' ? { xp: 30, gold: 15 } : sq.difficulty === 'Hard' ? { xp: 120, gold: 60 } : { xp: 60, gold: 30 };
                return (
                  <div key={i} className="p-3.5 rounded-xl bg-white border border-[#E5E5EA] flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-[#1D1D1F]">{sq.title}</div>
                      <div className="text-[11px] text-[#7C3AED] font-medium">+{reward.xp} {sq.attribute} XP</div>
                    </div>
                    <span className="text-xs font-semibold text-[#C9A227]">+{reward.gold} Gold</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 pb-2 border-t border-[#E5E5EA] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8E8E93]">
        <p>© {new Date().getFullYear()} ASCEND. All rights reserved.</p>
        <div className="mt-4 sm:mt-0 space-x-6">
          <Link href="/privacy" className="hover:text-[#1D1D1F] transition-colors">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}
