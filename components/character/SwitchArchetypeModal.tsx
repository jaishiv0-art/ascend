'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archetype, ArchetypeDetails } from '@/types/rpg';
import { ARCHETYPE_LIST, getArchetypeUnlockProgress } from '@/lib/progression/archetypes';
import { useGame } from '@/lib/context/game-context';
import { ArchetypeAvatar } from '@/components/character/ArchetypeAvatar';
import { X, Check, Lock, Sparkles, Coins, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface SwitchArchetypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SwitchArchetypeModal: React.FC<SwitchArchetypeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { profile, streak, quests, inventory, switchArchetype } = useGame();
  const [selectedArchId, setSelectedArchId] = useState<Archetype>(profile.archetype);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSwitch = async (archId: Archetype) => {
    const res = await switchArchetype(archId);
    if (res.success) {
      setFeedback(`Switched to ${archId}!`);
      setTimeout(() => {
        setFeedback(null);
        onClose();
      }, 900);
    } else {
      setFeedback(res.message);
      setTimeout(() => setFeedback(null), 2500);
    }
  };

  const selectedArch = ARCHETYPE_LIST.find((a) => a.id === selectedArchId) || ARCHETYPE_LIST[0];
  const selectedProgress = getArchetypeUnlockProgress(selectedArch, profile, streak, quests, inventory);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="apple-card p-6 sm:p-8 max-w-3xl w-full bg-white shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E5EA] shrink-0">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] text-[11px] font-mono font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Character Roster</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] tracking-tight">
                Switch Character Class
              </h2>
              <p className="text-xs text-[#6E6E73] mt-0.5">
                Choose an unlocked character class to change your active role, avatar, and bonus perks.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-[#F2F2F7] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Feedback message banner */}
          {feedback && (
            <div className="my-2 p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-center text-xs font-semibold text-purple-800 animate-fade-in">
              {feedback}
            </div>
          )}

          {/* Content Body: Grid of Characters + Details Panel */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 overflow-y-auto pr-1">
            {/* LEFT: Character Selector Cards (7 cols) */}
            <div className="md:col-span-7 grid grid-cols-2 gap-3">
              {ARCHETYPE_LIST.map((arch) => {
                const info = getArchetypeUnlockProgress(arch, profile, streak, quests, inventory);
                const isCurrent = profile.archetype === arch.id;
                const isSelected = selectedArchId === arch.id;

                return (
                  <button
                    key={arch.id}
                    onClick={() => setSelectedArchId(arch.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#7C3AED] bg-purple-50/40 ring-2 ring-[#7C3AED]/30 shadow-xs'
                        : info.isUnlocked
                        ? 'border-[#E5E5EA] bg-white hover:border-[#D1D1D6] hover:bg-[#FAF9F5]'
                        : 'border-[#E5E5EA] bg-[#F5F5F7] opacity-80 hover:opacity-100'
                    }`}
                  >
                    {/* Top Row: Avatar & Badges */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <ArchetypeAvatar archetype={arch.id} size="md" showGlow={isSelected} />
                      <div className="flex flex-col items-end gap-1">
                        {isCurrent && (
                          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                        {!info.isUnlocked && (
                          <span className="text-[10px] font-mono font-bold bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            {arch.unlock_type === 'gold' ? `${arch.unlock_value}G` : 'Goal'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="font-bold text-xs text-[#1D1D1F] line-clamp-1">{arch.name}</div>
                      <div className="text-[11px] text-[#6E6E73] line-clamp-1">{arch.role}</div>
                    </div>

                    {/* Mini condition / status footer */}
                    <div className="mt-2 pt-2 border-t border-[#E5E5EA] text-[10px] font-medium flex items-center justify-between">
                      {info.isUnlocked ? (
                        <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                          <Check className="w-3 h-3" /> Unlocked
                        </span>
                      ) : (
                        <span className="text-[#8E8E93] line-clamp-1">{info.conditionLabel}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT: Selected Character Deep Dossier (5 cols) */}
            <div className="md:col-span-5 apple-card p-4 sm:p-5 bg-[#FAF9F5] border border-[#E5E5EA] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <ArchetypeAvatar archetype={selectedArch.id} size="lg" showGlow={true} />
                  <div>
                    <h3 className="font-extrabold text-base text-[#1D1D1F]">{selectedArch.name}</h3>
                    <p className="text-xs font-mono text-purple-600 font-semibold">{selectedArch.title}</p>
                  </div>
                </div>

                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  {selectedArch.description}
                </p>

                {/* Attributes */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2 rounded-xl bg-white border border-[#E5E5EA]">
                    <span className="text-[10px] font-mono text-[#8E8E93] block uppercase">Primary</span>
                    <span className="font-bold text-[#1D1D1F]">{selectedArch.primaryAttribute}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#E5E5EA]">
                    <span className="text-[10px] font-mono text-[#8E8E93] block uppercase">Secondary</span>
                    <span className="font-bold text-[#1D1D1F]">{selectedArch.secondaryAttribute}</span>
                  </div>
                </div>

                {/* Perk Box */}
                <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-purple-800 uppercase font-mono">
                    <Sparkles className="w-3.5 h-3.5" /> Bonus Perk
                  </div>
                  <p className="text-xs text-purple-950 mt-1 font-medium leading-normal">
                    {selectedArch.perk}
                  </p>
                </div>

                {/* Unlock Status / Progress */}
                {!selectedProgress.isUnlocked && (
                  <div className="p-3 rounded-xl bg-white border border-[#E5E5EA] text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-[#6E6E73] flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-[#8E8E93]" />
                        {selectedArch.unlock_type === 'gold' ? 'Gold Purchase' : 'Goal Requirement'}
                      </span>
                      <span className="text-[#1D1D1F] font-mono text-[11px] font-bold">
                        {selectedProgress.progressLabel}
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-[#E5E5EA] rounded-full overflow-hidden">
                      <div
                        className="h-full btn-primary-gradient rounded-full transition-all duration-300"
                        style={{ width: `${selectedProgress.progressPercent}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-[#8E8E93]">{selectedProgress.conditionLabel}</p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {profile.archetype === selectedArch.id ? (
                  <div className="w-full py-2.5 text-center text-xs font-bold font-mono text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                    Currently Selected
                  </div>
                ) : selectedProgress.isUnlocked ? (
                  <button
                    onClick={() => handleSwitch(selectedArch.id)}
                    className="w-full py-2.5 btn-primary-gradient text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <span>Select {selectedArch.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : selectedArch.unlock_type === 'gold' ? (
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center"
                  >
                    <Coins className="w-4 h-4" />
                    <span>Unlock in Shop ({selectedArch.unlock_value} G)</span>
                  </Link>
                ) : (
                  <div className="w-full py-2.5 text-center text-xs font-medium text-[#8E8E93] bg-[#E5E5EA] rounded-xl">
                    Auto-unlocks when goal is reached
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SwitchArchetypeModal;
