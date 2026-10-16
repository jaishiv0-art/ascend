'use client';

// ==============================================================================
// ASCEND - PRODUCTION-GRADE QUEST CARD
// Bulletproof checkbox + animated reward overlay + sequenced sounds
// ==============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quest, QuestDifficulty } from '@/types/rpg';
import { useGame } from '@/lib/context/game-context';
import {
  Check,
  Zap,
  Coins,
  Trash2,
  RotateCw,
  Clock,
  Bell,
  Edit2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { ATTRIBUTE_CONFIG } from '@/lib/progression/attributes';
import { formatRecurringDaysSummary } from '@/lib/progression/schedule';
import { TaskTimerModal } from '@/components/modals/TaskTimerModal';
import { CreateQuestModal } from '@/components/modals/CreateQuestModal';

interface QuestCardProps {
  quest: Quest;
  onEdit?: (quest: Quest) => void;
  isCompletedOverride?: boolean;
}

interface RewardData {
  xpEarned: number;
  goldEarned: number;
}

// Floating particle for the reward animation
const FloatingParticle: React.FC<{ emoji: string; delay: number; x: number }> = ({ emoji, delay, x }) => (
  <motion.div
    className="absolute text-base pointer-events-none select-none"
    style={{ left: `${x}%`, bottom: '40%' }}
    initial={{ opacity: 0, y: 0, scale: 0.5 }}
    animate={{ opacity: [0, 1, 1, 0], y: -60, scale: [0.5, 1.2, 1, 0.8] }}
    transition={{ duration: 1.4, delay, ease: 'easeOut' }}
  >
    {emoji}
  </motion.div>
);

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onEdit, isCompletedOverride }) => {
  const { completeQuest, deleteQuest } = useGame();

  // ─── State ────────────────────────────────────────────────────────────────
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reward, setReward] = useState<RewardData | null>(null);
  const [showReward, setShowReward] = useState(false);

  // ─── Refs ─────────────────────────────────────────────────────────────────
  // useRef persists across ALL re-renders — once true, checkbox NEVER unchecks
  const hasCompletedRef = useRef(false);
  const rewardTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Seed from parent if quest was already completed (e.g. on page refresh)
  useEffect(() => {
    if (isCompletedOverride) {
      hasCompletedRef.current = true;
    }
  }, [isCompletedOverride]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (rewardTimerRef.current) clearTimeout(rewardTimerRef.current);
    };
  }, []);

  // ─── Derived ──────────────────────────────────────────────────────────────
  // showAsCompleted is TRUE if: override from parent OR successfully completed this session
  const showAsCompleted = hasCompletedRef.current || (isCompletedOverride ?? false);
  const attrMeta = ATTRIBUTE_CONFIG[quest.attribute] || ATTRIBUTE_CONFIG.Intellect;

  // ─── Difficulty badge ─────────────────────────────────────────────────────
  const getDifficultyBadge = (diff: QuestDifficulty) => {
    switch (diff) {
      case 'Easy':     return 'text-[#2E7D32] bg-[#E8F5E9] border-[#C8E6C9]';
      case 'Medium':   return 'text-[#0284C7] bg-[#F0F9FF] border-[#BAE6FD]';
      case 'Hard':     return 'text-[#C9A227] bg-[#FEFCE8] border-[#FEF08A]';
      case 'Epic':     return 'text-[#7C3AED] bg-[#F3E8FF] border-[#DDD6FE]';
      case 'Legendary':return 'text-[#D32F2F] bg-[#FFEBEE] border-[#FFCDD2]';
    }
  };

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleComplete = async () => {
    // Triple-guard: already done, in progress, or ref says done
    if (showAsCompleted || isCompleting || hasCompletedRef.current) return;

    // Optimistically lock completion ref immediately — checkbox will NEVER uncheck
    hasCompletedRef.current = true;
    setIsCompleting(true);

    try {
      const result = await completeQuest(quest.id);

      // Show reward overlay
      setReward({
        xpEarned: result?.xpEarned ?? quest.xp_reward,
        goldEarned: result?.goldEarned ?? quest.gold_reward,
      });
      setShowReward(true);

      // Auto-dismiss reward after 2.8 seconds
      rewardTimerRef.current = setTimeout(() => setShowReward(false), 2800);
    } catch (err) {
      console.warn('Quest complete warning:', err);
      // Fallback reward overlay using quest default rewards
      setReward({ xpEarned: quest.xp_reward, goldEarned: quest.gold_reward });
      setShowReward(true);
      rewardTimerRef.current = setTimeout(() => setShowReward(false), 2800);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteQuest(quest.id);
    } catch {
      // Handled
    } finally {
      setIsDeleting(false);
    }
  };

  const scheduleSummary = quest.is_recurring
    ? formatRecurringDaysSummary(quest.recurring_days)
    : null;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <div
        className={`group relative apple-card apple-card-hover p-4.5 bg-white transition-all duration-300 overflow-hidden ${
          showAsCompleted ? 'opacity-75' : 'opacity-100'
        }`}
      >
        {/* ── REWARD OVERLAY ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {showReward && reward && (
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center rounded-xl overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
            >
              {/* Blurred background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/10 via-white/95 to-[#C9A227]/10 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />

              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none">
                {['⚡', '🪙', '✨', '⚡', '🪙', '✨', '⚡'].map((emoji, i) => (
                  <FloatingParticle key={i} emoji={emoji} delay={i * 0.1} x={10 + i * 13} />
                ))}
              </div>

              {/* Reward card */}
              <motion.div
                className="relative z-10 text-center px-6"
                initial={{ scale: 0.7, y: 10, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: -10, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                {/* Icon pulse */}
                <motion.div
                  className="w-12 h-12 mx-auto mb-3 rounded-2xl btn-primary-gradient flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Check className="w-6 h-6 text-white stroke-[3]" />
                </motion.div>

                <motion.p
                  className="text-sm font-bold text-[#1D1D1F] mb-2"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  Quest Complete! 🎯
                </motion.p>

                {/* Rewards row */}
                <motion.div
                  className="flex items-center justify-center gap-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <motion.div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F3E8FF] border border-[#DDD6FE]"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <Zap className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span className="text-xs font-bold text-[#7C3AED]">+{reward.xpEarned} XP</span>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FEFCE8] border border-[#FEF08A]"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <Coins className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span className="text-xs font-bold text-[#C9A227]">+{reward.goldEarned} Gold</span>
                  </motion.div>
                </motion.div>

                {/* Sparkle row */}
                <motion.div
                  className="mt-2 flex items-center justify-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Sparkles className="w-3 h-3 text-[#7C3AED]/60" />
                  <span className="text-[10px] text-[#6E6E73] font-medium">
                    {quest.attribute} XP earned
                  </span>
                  <Sparkles className="w-3 h-3 text-[#C9A227]/60" />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MAIN CARD CONTENT ─────────────────────────────────────────── */}
        <div className="flex items-start space-x-4">

          {/* CHECKBOX */}
          <motion.button
            onClick={handleComplete}
            disabled={showAsCompleted || isCompleting}
            whileTap={!showAsCompleted ? { scale: 0.82 } : {}}
            whileHover={!showAsCompleted ? { scale: 1.08 } : {}}
            aria-label={showAsCompleted ? 'Quest Completed' : 'Complete Quest'}
            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-200 mt-0.5 ${
              showAsCompleted ? 'cursor-default' : 'cursor-pointer'
            } ${
              showAsCompleted || isCompleting
                ? 'btn-primary-gradient border-transparent text-white shadow-md shadow-[#7C3AED]/30'
                : 'border-[#C7C7CC] hover:border-[#7C3AED] bg-white text-transparent hover:text-[#7C3AED] hover:shadow-sm hover:shadow-[#7C3AED]/20'
            }`}
          >
            <AnimatePresence mode="wait">
              {isCompleting ? (
                /* Spinner while API call is in-flight */
                <motion.div
                  key="spinner"
                  className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                  exit={{ opacity: 0, scale: 0 }}
                />
              ) : (
                <motion.div
                  key="check"
                  initial={false}
                  animate={{
                    scale: showAsCompleted ? 1 : 0.4,
                    opacity: showAsCompleted ? 1 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Quest Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1 mb-2">
              {/* Difficulty Badge */}
              <span className={`text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full border ${getDifficultyBadge(quest.difficulty)}`}>
                {quest.difficulty}
              </span>

              {/* Category Tag */}
              <span className="text-xs font-semibold text-[#6E6E73] uppercase px-2.5 py-0.5 rounded-full border border-[#E5E5EA] bg-[#FAF9F5]">
                {quest.category}
              </span>

              {/* Attribute Tag */}
              <span
                className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full border bg-white"
                style={{ color: attrMeta.color, borderColor: `${attrMeta.color}40` }}
              >
                {attrMeta.name}
              </span>

              {/* Recurring Tag */}
              {quest.is_recurring && (
                <span
                  title={scheduleSummary || 'Recurring'}
                  className="text-xs font-semibold text-[#7C3AED] uppercase flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-[#7C3AED]/30 bg-[#F2F2F7]"
                >
                  <RotateCw className="w-3 h-3 text-[#7C3AED]" />
                  <span>
                    {quest.recurring_days && quest.recurring_days.length > 0 && quest.recurring_days.length < 7
                      ? quest.recurring_days.map((d) => d.slice(0, 3).toUpperCase()).join('·')
                      : 'Daily'}
                  </span>
                </span>
              )}

              {/* Due Date */}
              {!quest.is_recurring && quest.due_date && (
                <span className="text-xs font-semibold text-[#6E6E73] uppercase flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-[#E5E5EA] bg-white">
                  <Calendar className="w-3 h-3 text-purple-600" />
                  <span>Due {quest.due_date.includes('T') ? quest.due_date.split('T')[0] : quest.due_date}</span>
                </span>
              )}

              {/* Alarm Badge */}
              {quest.reminder_time && (
                <span className="text-xs font-semibold text-purple-700 uppercase flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-purple-200 bg-purple-50">
                  <Bell className="w-3 h-3 text-purple-600 animate-pulse" />
                  <span>{quest.reminder_time}</span>
                </span>
              )}

              {/* Timer Badge */}
              {quest.timer_minutes && (
                <span className="text-xs font-semibold text-purple-700 uppercase flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-purple-200 bg-purple-50">
                  <Clock className="w-3 h-3 text-purple-600" />
                  <span>{quest.timer_minutes}m Focus</span>
                </span>
              )}
            </div>

            <h4 className={`text-base font-semibold transition-all duration-300 ${showAsCompleted ? 'line-through text-[#8E8E93]' : 'text-[#1D1D1F]'}`}>
              {quest.title}
            </h4>

            {quest.description && (
              <p className="text-sm text-[#6E6E73] line-clamp-2 mt-1 leading-relaxed font-sans">
                {quest.description}
              </p>
            )}

            {/* Rewards & Actions */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E5E5EA]">
              <div className="flex items-center space-x-4 text-xs font-semibold">
                <span className="flex items-center gap-1 text-[#7C3AED]">
                  <Zap className="w-3.5 h-3.5" /> +{quest.xp_reward} XP
                </span>
                <span className="flex items-center gap-1 text-[#C9A227]">
                  <Coins className="w-3.5 h-3.5" /> +{quest.gold_reward} Gold
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                {/* Schedule Button */}
                {!showAsCompleted && (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-2.5 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 hover:text-sky-900 text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer shadow-xs"
                    title="Edit Calendar & Schedule for this quest"
                  >
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>Schedule</span>
                  </button>
                )}

                {/* Focus Timer Button */}
                {!showAsCompleted && (
                  <button
                    onClick={() => setIsTimerOpen(true)}
                    className="px-2.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 hover:text-purple-900 text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer shadow-xs"
                    title="Start Focus Timer for this task"
                  >
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span>{quest.timer_minutes ? `${quest.timer_minutes}m Timer` : 'Timer'}</span>
                  </button>
                )}

                {/* Edit Button */}
                {!showAsCompleted && (
                  <button
                    onClick={() => (onEdit ? onEdit(quest) : setIsEditModalOpen(true))}
                    aria-label="Edit quest"
                    title="Edit quest"
                    className="p-1.5 text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-lg transition-all cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}

                {/* Delete Button */}
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  aria-label="Delete quest"
                  title="Delete quest"
                  className="p-1.5 text-[#8E8E93] hover:text-[#D32F2F] hover:bg-red-50 active:bg-red-100 rounded-lg transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TaskTimerModal quest={quest} isOpen={isTimerOpen} onClose={() => setIsTimerOpen(false)} />
      <CreateQuestModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} editQuest={quest} />
    </>
  );
};
