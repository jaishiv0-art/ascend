'use client';

// ==============================================================================
// ASCEND - ACHIEVEMENT UNLOCK PRESTIGE BANNER
// Apple Bright Premium Achievement Toast
// ==============================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/context/game-context';
import { Trophy, X, Sparkles, Coins, Zap } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

export const AchievementUnlockBanner: React.FC = () => {
  const { unlockedAchievementNotification, closeAchievementNotification } = useGame();

  if (!unlockedAchievementNotification) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="apple-card p-5 relative overflow-hidden bg-white/95 backdrop-blur-md border-amber-300 shadow-xl"
        >
          {/* Close button */}
          <button
            onClick={closeAchievementNotification}
            className="absolute top-3 right-3 text-[#8E8E93] hover:text-[#1D1D1F] p-1.5 rounded-full hover:bg-[#F5F5F7] transition-colors z-20 cursor-pointer"
            aria-label="Close Notification"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="flex items-start space-x-4 relative z-10">
            {/* Flat Crest */}
            <motion.div
              initial={{ rotate: -15, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 shrink-0 flex items-center justify-center shadow-sm"
            >
              <Trophy className="w-7 h-7" />
            </motion.div>

            {/* Content */}
            <div className="flex-1 pr-4">
              <div className="flex items-center space-x-1.5 font-mono text-[11px] font-bold uppercase text-amber-700 tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Trophy Unlocked</span>
              </div>

              <h3 className="font-mono text-lg font-bold text-[#1D1D1F] mt-0.5 uppercase leading-tight">
                {unlockedAchievementNotification.title}
              </h3>

              <p className="text-xs text-[#6E6E73] mt-1 font-sans leading-relaxed">
                {unlockedAchievementNotification.description}
              </p>

              {/* Reward Pills */}
              <div className="flex items-center space-x-3 mt-3 pt-3 border-t border-[#E5E5EA]">
                <span className="font-mono text-xs font-bold text-purple-600 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> +
                  <AnimatedCounter value={unlockedAchievementNotification.reward_xp} /> XP
                </span>
                <span className="font-mono text-xs font-bold text-amber-600 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-500" /> +
                  <AnimatedCounter value={unlockedAchievementNotification.reward_gold} /> G
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

