'use client';

// ==============================================================================
// ASCEND - COMMAND TELEMETRY & HERO CHARACTER HUD
// Apple-Inspired Bright Premium Character HUD Card
// ==============================================================================

import React from 'react';
import { useGame } from '@/lib/context/game-context';
import { calculateLevelProgress } from '@/lib/progression/levels';
import { ARCHETYPES } from '@/lib/progression/archetypes';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { ArchetypeAvatar } from './ArchetypeAvatar';
import { Shield, Flame, Coins, Trophy, Zap, ArrowUpRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const CharacterHUD: React.FC = () => {
  const { profile, streak, quests } = useGame();
  const progress = calculateLevelProgress(profile.xp);
  const archetypeInfo = ARCHETYPES[profile.archetype] || ARCHETYPES['Cyber Mage'];

  const completedQuestsCount = quests.filter((q) => q.status === 'Completed').length;

  return (
    <div className="apple-card p-6 sm:p-8 relative overflow-hidden my-6">
      <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8 relative z-10">
        
        {/* Archetype Avatar Badge */}
        <div className="relative group shrink-0 text-center">
          <ArchetypeAvatar archetype={profile.archetype} size="xl" showGlow={true} />
          
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#1D1D1F] text-white px-3.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border border-white/20 shadow-sm z-20">
            Level <AnimatedCounter value={progress.currentLevel} />
          </div>
        </div>

        {/* Profile Info & XP Bar */}
        <div className="flex-1 w-full text-center lg:text-left pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E5EA] pb-4">
            <div>
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] tracking-tight">
                  {profile.username}
                </h2>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F2F2F7] text-[#7C3AED]">
                  {profile.title}
                </span>
              </div>
              
              <div className="text-xs text-[#6E6E73] flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="font-semibold text-[#1D1D1F]">{profile.archetype}</span>
                <span>•</span>
                <span className="text-[#7C3AED] font-medium">
                  {progress.rankTitle} ({progress.tier})
                </span>
                <span>•</span>
                <span className="italic">{archetypeInfo.role}</span>
              </div>
            </div>

            <Link
              href="/character"
              className="inline-flex items-center justify-center space-x-1 text-xs font-semibold text-[#1D1D1F] hover:text-[#7C3AED] transition-colors border border-[#E5E5EA] hover:border-[#D1D1D6] px-4 py-2 rounded-full bg-[#FAF9F5]"
            >
              <span>Inspect Sheet</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-4 max-w-2xl mx-auto lg:mx-0">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-[#6E6E73]">
              <div className="flex items-center space-x-1.5 uppercase font-semibold">
                <Zap className="w-3.5 h-3.5 text-[#7C3AED]" /> 
                <span>XP Progress</span>
              </div>
              <div className="font-semibold text-[#1D1D1F]">
                <AnimatedCounter value={progress.xpIntoCurrentLevel} /> / {progress.xpNeededForLevel} XP{' '}
                <span className="text-[#7C3AED]">({progress.progressPercent}%)</span>
              </div>
            </div>

            <div className="w-full h-3 bg-[#E5E5EA] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full btn-primary-gradient rounded-full transition-all duration-700"
                style={{ width: `${progress.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Telemetry Stat Blocks */}
        <div className="w-full lg:w-44 shrink-0 flex flex-row lg:flex-col justify-between gap-3 pt-2 lg:pt-0">
          <div className="flex-1 bg-[#FAF9F5] border border-[#E5E5EA] p-3 rounded-2xl flex flex-col items-center lg:items-end">
            <div className="text-[#C9A227] text-lg font-bold flex items-center space-x-1">
              <Coins className="w-4 h-4" />
              <AnimatedCounter value={profile.gold} />
            </div>
            <div className="text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wider">Treasury</div>
          </div>
          
          <div className="flex-1 bg-[#FAF9F5] border border-[#E5E5EA] p-3 rounded-2xl flex flex-col items-center lg:items-end">
            <div className="text-[#7C3AED] text-lg font-bold flex items-center space-x-1">
              <Flame className="w-4 h-4" />
              <span>{streak.current_streak}d</span>
            </div>
            <div className="text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wider">Streak</div>
          </div>
          
          <div className="flex-1 bg-[#FAF9F5] border border-[#E5E5EA] p-3 rounded-2xl flex flex-col items-center lg:items-end">
            <div className="text-[#1D1D1F] text-lg font-bold flex items-center space-x-1">
              <Trophy className="w-4 h-4 text-[#7C3AED]" />
              <span>{completedQuestsCount}</span>
            </div>
            <div className="text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wider">Quests</div>
          </div>
        </div>
      </div>
      
      {/* Class Perk Footer */}
      <div className="mt-6 pt-3 border-t border-[#E5E5EA] flex items-center justify-between text-xs text-[#6E6E73]">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span className="font-semibold text-[#1D1D1F] uppercase">CLASS PERK:</span>
          <span className="italic text-[#6E6E73]">{archetypeInfo.perk}</span>
        </div>
        <div className="hidden sm:block text-[11px] text-[#8E8E93]">
          ASCEND PROTOCOL
        </div>
      </div>
    </div>
  );
};
