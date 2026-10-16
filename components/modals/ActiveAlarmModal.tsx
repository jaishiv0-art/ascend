'use client';

// ==============================================================================
// ASCEND - ACTIVE TASK ALARM TRIGGER MODAL
// Pulsing Screen Alert with WebAudio Chime & Quick Execution Triggers
// ==============================================================================

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quest } from '@/types/rpg';
import { alarmSynth } from '@/lib/sound/alarm-synth';
import { useGame } from '@/lib/context/game-context';
import {
  Bell,
  Clock,
  CheckCircle2,
  Play,
  X,
  Zap,
} from 'lucide-react';

interface ActiveAlarmModalProps {
  quest: Quest | null;
  isOpen: boolean;
  onDismiss: () => void;
  onSnooze: (questId: string) => void;
  onStartFocus: (quest: Quest) => void;
}

export const ActiveAlarmModal: React.FC<ActiveAlarmModalProps> = ({
  quest,
  isOpen,
  onDismiss,
  onSnooze,
  onStartFocus,
}) => {
  const { completeQuest } = useGame();

  // Start audio ringing when modal opens, stop when closed
  useEffect(() => {
    if (isOpen && quest) {
      alarmSynth.startRinging();
    } else {
      alarmSynth.stopRinging();
    }

    return () => {
      alarmSynth.stopRinging();
    };
  }, [isOpen, quest]);

  if (!isOpen || !quest) return null;

  const handleDismiss = () => {
    alarmSynth.stopRinging();
    onDismiss();
  };

  const handleSnooze = () => {
    alarmSynth.stopRinging();
    onSnooze(quest.id);
  };

  const handleStartTimer = () => {
    alarmSynth.stopRinging();
    onStartFocus(quest);
  };

  const handleComplete = async () => {
    alarmSynth.stopRinging();
    try {
      await completeQuest(quest.id);
    } catch {
      // Handled
    }
    onDismiss();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white border-2 border-purple-400 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-center"
        >
          {/* Pulsing Background Wave Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl pointer-events-none -z-10 animate-pulse" />

          {/* Animated Alarm Icon */}
          <div className="relative inline-flex items-center justify-center mb-4">
            <motion.div
              animate={{ rotate: [-15, 15, -15] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-3xl btn-primary-gradient text-white flex items-center justify-center shadow-lg relative"
            >
              <Bell className="w-10 h-10 stroke-[2.5]" />
            </motion.div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500" />
            </span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-mono font-bold uppercase tracking-wider rounded-full mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Scheduled Quest Alarm</span>
          </div>

          <h3 className="text-2xl font-extrabold text-[#1D1D1F] tracking-tight mb-2">
            Time for Your Quest!
          </h3>

          <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] mb-6 text-left">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-purple-600 uppercase font-mono">
                {quest.category} • {quest.difficulty}
              </span>
              <span className="text-[#6E6E73] font-mono flex items-center gap-1">
                <Zap className="w-3 h-3 text-purple-600" /> +{quest.xp_reward} XP
              </span>
            </div>
            <h4 className="text-base font-bold text-[#1D1D1F] leading-snug">{quest.title}</h4>
            {quest.description && (
              <p className="text-xs text-[#6E6E73] mt-1 line-clamp-2">{quest.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            {/* 1. Start Focus Timer */}
            <button
              onClick={handleStartTimer}
              className="w-full py-3.5 btn-primary-gradient text-white font-bold text-sm uppercase font-mono tracking-wider rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Focus Timer</span>
            </button>

            {/* 2. Complete Task */}
            <button
              onClick={handleComplete}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase font-mono tracking-wider rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Complete & Claim Rewards</span>
            </button>

            {/* 3. Snooze & Dismiss Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleSnooze}
                className="py-2.5 px-3 bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] border border-[#E5E5EA] font-semibold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                <span>Snooze (5m)</span>
              </button>
              <button
                onClick={handleDismiss}
                className="py-2.5 px-3 bg-white hover:bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] border border-[#E5E5EA] font-semibold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Dismiss</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
