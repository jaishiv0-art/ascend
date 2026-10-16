'use client';

// ==============================================================================
// ASCEND - LEVEL UP CELEBRATION MODAL
// Apple Bright Premium Celebration Modal with Prestige Badges
// ==============================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/context/game-context';
import { Trophy, ArrowRight, Zap, Sparkles, Crown } from 'lucide-react';
import { ARCHETYPES } from '@/lib/progression/archetypes';
import { getRankTier } from '@/lib/progression/levels';

export const LevelUpModal: React.FC = () => {
  const { levelUpModal, closeLevelUpModal } = useGame();

  if (!levelUpModal.isOpen) return null;

  const archetypeInfo = ARCHETYPES[levelUpModal.archetype] || ARCHETYPES['Cyber Mage'];
  const rankInfo = getRankTier(levelUpModal.newLevel);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Novice':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Apprentice':
        return 'text-sky-700 bg-sky-50 border-sky-200';
      case 'Adept':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Master':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Grandmaster':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Ascendant':
        return 'text-violet-700 bg-violet-50 border-violet-200';
      default:
        return 'text-purple-700 bg-purple-50 border-purple-200';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          className="relative w-full max-w-md apple-card p-6 sm:p-8 text-center"
        >
          {/* Top Trophy Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 shadow-sm"
          >
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Level Up Title */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] tracking-tight">
              Level Up!
            </h2>

            {/* Level Progression Indicator */}
            <div className="flex items-center justify-center space-x-4 my-4">
              <span className="text-xl sm:text-2xl font-mono font-bold text-[#8E8E93]">LVL {levelUpModal.oldLevel}</span>
              <ArrowRight className="w-5 h-5 text-purple-600" />
              <span className="text-3xl sm:text-4xl font-mono font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-sky-500">
                LVL {levelUpModal.newLevel}
              </span>
            </div>

            {/* PRESTIGE RANK TITLE BADGE */}
            <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-purple-50/80 via-white to-sky-50/80 border border-purple-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-center gap-3.5">
                <div className="w-11 h-11 rounded-xl btn-primary-gradient flex items-center justify-center text-white shadow-sm shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E6E73]">
                      Prestige Title Unlocked
                    </span>
                    <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${getTierColor(rankInfo.tier)}`}>
                      {rankInfo.tier}
                    </span>
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-[#1D1D1F] tracking-tight mt-0.5">
                    {levelUpModal.rankTitle || rankInfo.title}
                  </div>
                </div>
              </div>
            </div>

            {/* UNLOCKED BADGES & PERKS GRID */}
            <div className="grid grid-cols-2 gap-2.5 my-4 text-left">
              {/* Archetype Badge */}
              <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E5EA] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-[#8E8E93] font-semibold uppercase">Class Perk</div>
                  <div className="text-xs font-bold text-[#1D1D1F] truncate">{archetypeInfo.name}</div>
                </div>
              </div>

              {/* Stat Capacity Badge */}
              <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E5EA] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-[#8E8E93] font-semibold uppercase">Energy Boost</div>
                  <div className="text-xs font-bold text-amber-700 truncate">+100 Capacity</div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={closeLevelUpModal}
              className="w-full py-3.5 mt-2 btn-primary-gradient text-white rounded-xl font-bold text-sm shadow-sm hover:opacity-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Claim Rank & Continue</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

