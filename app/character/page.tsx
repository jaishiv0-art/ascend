'use client';

// ==============================================================================
// ASCEND - CHARACTER DOSSIER & RPG ASCENSION SHEET
// Apple Bright Premium Character Overview & Progression
// ==============================================================================

import React, { useState } from 'react';
import { useGame } from '@/lib/context/game-context';
import { calculateLevelProgress, calculateXPForLevel } from '@/lib/progression/levels';
import { ARCHETYPES } from '@/lib/progression/archetypes';
import { ATTRIBUTE_LIST, calculateAttributeLevel, getAttributeMasteryTitle } from '@/lib/progression/attributes';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { HabitTransformationCard } from '@/components/character/HabitTransformationCard';
import { ArchetypeAvatar } from '@/components/character/ArchetypeAvatar';
import { SwitchArchetypeModal } from '@/components/character/SwitchArchetypeModal';
import { PageMascot } from '@/components/PageMascot';
import {
  Sparkles,
  CheckCircle2,
  Lock,
  Zap,
  Shield,
  Coins,
  Flame,
  Trophy,
  Users,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function CharacterPage() {
  const { profile, streak, quests, attributes } = useGame();
  const progress = calculateLevelProgress(profile.xp);
  const archetypeInfo = ARCHETYPES[profile.archetype] || ARCHETYPES['Cyber Mage'];

  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [previewFormulaLevel, setPreviewFormulaLevel] = useState(progress.currentLevel + 1);

  const rankMilestones = [
    { name: 'Initiate Seeker', tier: 'Novice', level: 1, perk: 'Unlocked basic quest bounty system' },
    { name: 'Cyber Vanguard', tier: 'Apprentice', level: 5, perk: '+5% bonus XP on daily recurring habits' },
    { name: 'Neural Adept', tier: 'Adept', level: 10, perk: 'Unlocks Epic quest tier difficulty' },
    { name: 'Grid Overseer', tier: 'Master', level: 20, perk: 'Unlocks exclusive Guild Shop discounts' },
    { name: 'Singularity Grandmaster', tier: 'Grandmaster', level: 35, perk: 'Legendary quest tier & Aura glow' },
    { name: 'Eternal Ascendant', tier: 'Ascendant', level: 50, perk: 'Max prestige title & Mythic cosmetics' },
  ];

  const previewXpRequired = calculateXPForLevel(previewFormulaLevel);

  return (
    <div className="space-y-10 pb-16 pt-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* 1. DOSSIER HEADER */}
      <div className="apple-card p-6 sm:p-8 relative">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 pb-8 border-b border-[#E5E5EA]">
          {/* Avatar Emblem Frame */}
          <div className="relative group shrink-0 text-center">
            <ArchetypeAvatar archetype={profile.archetype} size="2xl" showGlow={true} />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 btn-primary-gradient text-white px-4 py-1 rounded-full font-mono text-xs font-bold tracking-widest shadow-md z-20">
              LVL <AnimatedCounter value={progress.currentLevel} />
            </div>
          </div>

          <div className="flex-1 w-full text-center lg:text-left pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] tracking-tight">
                  {profile.username}
                </h1>
                <div className="flex items-center justify-center lg:justify-start gap-3 mt-1 mb-4 flex-wrap">
                  <span className="text-xs font-mono tracking-wider text-purple-600 uppercase font-semibold">
                    {profile.title} • {profile.archetype}
                  </span>
                  <button
                    onClick={() => setIsSwitchModalOpen(true)}
                    className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase bg-purple-50 text-[#7C3AED] border border-purple-200 hover:bg-purple-100 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Switch Archetype</span>
                  </button>
                </div>
              </div>
              <PageMascot
                animationType="gym"
                size={88}
                showBadge={true}
                badgeText="Strength & Power"
                className="shrink-0 self-center sm:self-start"
              />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-[#E5E5EA]">
              <div>
                <div className="text-[11px] font-mono text-[#6E6E73] uppercase tracking-wider">Total XP</div>
                <div className="font-mono text-xl font-bold text-[#1D1D1F] mt-0.5"><AnimatedCounter value={profile.xp} /></div>
              </div>
              <div>
                <div className="text-[11px] font-mono text-[#6E6E73] uppercase tracking-wider">Gold Coins</div>
                <div className="font-mono text-xl font-bold text-amber-600 mt-0.5"><AnimatedCounter value={profile.gold} /></div>
              </div>
              <div>
                <div className="text-[11px] font-mono text-[#6E6E73] uppercase tracking-wider">Active Streak</div>
                <div className="font-mono text-xl font-bold text-orange-600 mt-0.5">{streak.current_streak} Days</div>
              </div>
              <div>
                <div className="text-[11px] font-mono text-[#6E6E73] uppercase tracking-wider">Quests Completed</div>
                <div className="font-mono text-xl font-bold text-purple-600 mt-0.5">{quests.filter((q) => q.status === 'Completed').length}</div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-3 text-xs font-sans">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              <div>
                <span className="font-bold text-purple-600 uppercase mr-2 font-mono">BONUS PERK:</span>
                <span className="text-[#6E6E73] font-medium">{archetypeInfo.perk}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. LEVEL PROGRESS CALCULATOR */}
        <div className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#1D1D1F]">Level Calculator</h2>
              <p className="text-xs text-[#6E6E73] mt-0.5">See how much XP is needed to reach any future level.</p>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs text-[#6E6E73] uppercase font-semibold">Check Level:</span>
              <input
                type="number"
                min={1}
                max={100}
                value={previewFormulaLevel}
                onChange={(e) => setPreviewFormulaLevel(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-3 py-1.5 bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl font-mono text-sm font-bold text-[#1D1D1F] text-center focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA]">
              <div className="text-[11px] font-mono text-[#6E6E73] uppercase font-medium">Current Rank</div>
              <div className="font-mono text-2xl font-bold text-[#1D1D1F] mt-1">Level {progress.currentLevel}</div>
              <div className="text-xs font-mono text-[#6E6E73] mt-1">{formatNumber(progress.xpForCurrentLevel)} XP Total</div>
            </div>
            
            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200">
              <div className="text-[11px] font-mono text-purple-700 uppercase font-medium">Next Target</div>
              <div className="font-mono text-2xl font-bold text-purple-900 mt-1">Level {progress.currentLevel + 1}</div>
              <div className="text-xs font-mono text-purple-700 mt-1">{formatNumber(progress.xpForNextLevel - profile.xp)} XP Needed</div>
            </div>
            
            <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-dashed border-[#C7C7CC]">
              <div className="text-[11px] font-mono text-[#6E6E73] uppercase font-medium">Inspected Level {previewFormulaLevel}</div>
              <div className="font-mono text-2xl font-bold text-[#1D1D1F] mt-1">{formatNumber(previewXpRequired)} XP</div>
              <div className="text-xs font-mono text-[#6E6E73] mt-1">Total Requirement</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 21-DAY HABIT MOTIVATION CARD */}
      <HabitTransformationCard />

      {/* 3. RANK ROADMAP */}
      <div className="apple-card p-6 sm:p-8">
        <div className="mb-6 pb-3 border-b border-[#E5E5EA]">
          <h2 className="text-xl font-bold text-[#1D1D1F]">Rank Milestones</h2>
          <p className="text-sm text-[#6E6E73] mt-0.5">Unlock perks as you level up your daily productivity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rankMilestones.map((milestone) => {
            const isUnlocked = profile.level >= milestone.level;
            const isCurrent = progress.tier === milestone.tier;

            return (
              <div
                key={milestone.tier}
                className={`p-5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-purple-300 bg-purple-50/40 shadow-sm'
                    : isUnlocked
                    ? 'border-[#E5E5EA] bg-white'
                    : 'border-[#E5E5EA] bg-[#F5F5F7] opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-mono text-xs font-bold uppercase ${isCurrent ? 'text-purple-600' : 'text-[#6E6E73]'}`}>
                    Level {milestone.level}+
                  </span>
                  {isUnlocked ? (
                    <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-purple-600' : 'text-emerald-600'}`} />
                  ) : (
                    <Lock className="w-4 h-4 text-[#8E8E93]" />
                  )}
                </div>

                <h3 className="font-mono text-base font-bold text-[#1D1D1F] uppercase">{milestone.name}</h3>
                <div className="text-xs font-mono text-purple-600 mt-0.5 font-semibold">{milestone.tier} Tier</div>

                <p className="text-xs font-sans text-[#6E6E73] mt-3 pt-3 border-t border-[#E5E5EA]">
                  {milestone.perk}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. ATTRIBUTE SPECIALIZATIONS */}
      <div className="apple-card p-6 sm:p-8">
        <div className="mb-6 pb-3 border-b border-[#E5E5EA]">
          <h2 className="text-xl font-bold text-[#1D1D1F]">Your Skills & Attributes</h2>
          <p className="text-sm text-[#6E6E73] mt-0.5">Focus on specific areas of daily growth to unlock passive perks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ATTRIBUTE_LIST.map((attr) => {
            const attrKey = `${attr.type.toLowerCase()}_xp` as keyof typeof attributes;
            const currentXP = (attributes[attrKey] as number) || 0;
            const level = calculateAttributeLevel(currentXP);
            const masteryTitle = getAttributeMasteryTitle(level);
            
            const xpInCurrentLevel = currentXP % 150;
            const percent = Math.min(100, Math.floor((xpInCurrentLevel / 150) * 100));

            return (
              <div key={attr.type} className="p-5 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-mono text-lg font-bold uppercase text-[#1D1D1F]">{attr.name}</h4>
                    <span className="font-mono text-xs font-bold text-[#1D1D1F] bg-white px-2 py-0.5 rounded-md border border-[#E5E5EA]">LVL {level}</span>
                  </div>
                  <div className="text-xs font-mono text-purple-600 font-semibold uppercase mb-3">{masteryTitle} Tier</div>
                  
                  <p className="text-xs font-sans text-[#6E6E73] leading-relaxed mb-4">
                    {attr.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#6E6E73] mb-1.5">
                    <span className="font-medium">PROGRESS</span>
                    <span className="font-bold text-[#1D1D1F]">{xpInCurrentLevel}/150 XP</span>
                  </div>

                  <div className="w-full bg-[#E5E5EA] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 btn-primary-gradient"
                      style={{
                        width: `${percent}%`,
                      }}
                    />
                  </div>

                  <div className="text-[11px] font-sans text-[#6E6E73] mt-2 flex items-center gap-1 font-medium">
                    <Zap className="w-3 h-3 text-purple-600 shrink-0" /> {attr.buffBenefit}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SwitchArchetypeModal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
      />
    </div>
  );
}

