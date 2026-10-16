'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArchetypeDetails } from '@/types/rpg';
import { ArchetypeAvatar } from '@/components/character/ArchetypeAvatar';
import { Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface CharacterUnlockBannerProps {
  archetype: ArchetypeDetails | null;
  onClose: () => void;
  onSelectArchetype?: (id: ArchetypeDetails['id']) => void;
}

export const CharacterUnlockBanner: React.FC<CharacterUnlockBannerProps> = ({
  archetype,
  onClose,
  onSelectArchetype,
}) => {
  if (!archetype) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="apple-card p-6 sm:p-8 max-w-md w-full bg-white shadow-2xl relative overflow-hidden border border-[#E5E5EA]"
        >
          {/* Ambient Glow */}
          <div
            className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: archetype.color }}
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-[#F2F2F7] transition-all cursor-pointer z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-4 relative z-10">
            {/* Header Badge */}
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#7C3AED] text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Character Unlocked!</span>
            </div>

            {/* Character Avatar */}
            <div className="flex justify-center py-2">
              <ArchetypeAvatar archetype={archetype.id} size="xl" showGlow={true} />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-[#1D1D1F] tracking-tight">
                {archetype.name}
              </h2>
              <p className="text-xs font-mono font-semibold text-purple-600 mt-0.5 uppercase tracking-wider">
                {archetype.title}
              </p>
            </div>

            {/* Perk Description */}
            <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E5E5EA] text-left text-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-[#1D1D1F]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Class Bonus Perk</span>
              </div>
              <p className="text-[#6E6E73] font-medium leading-relaxed">
                {archetype.perk}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              {onSelectArchetype && (
                <button
                  onClick={() => {
                    onSelectArchetype(archetype.id);
                    onClose();
                  }}
                  className="flex-1 py-3 btn-primary-gradient text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <span>Play as {archetype.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="py-3 px-5 bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1D1D1F] font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                Keep Current
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CharacterUnlockBanner;
