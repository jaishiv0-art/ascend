'use client';

// ==============================================================================
// ASCEND - CREATE & EDIT QUEST MODAL
// Apple Bright Premium Quest Creation: Calendar, Schedule, Focus Timer & Rewards
// ==============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/context/game-context';
import {
  Quest,
  QuestCategory,
  QuestDifficulty,
  AttributeType,
  QuestPriority,
  Weekday,
} from '@/types/rpg';
import { ATTRIBUTE_LIST, getDefaultAttributeForCategory } from '@/lib/progression/attributes';
import { calculateAuthoritativeRewards } from '@/lib/progression/rewards';
import { WeeklyScheduleSelector } from '@/components/quests/WeeklyScheduleSelector';
import { QuestCalendarPicker } from '@/components/quests/QuestCalendarPicker';
import {
  X,
  Zap,
  Coins,
  Sparkles,
  RotateCw,
  AlertCircle,
  Bell,
  Calendar,
  Clock,
  Layers,
} from 'lucide-react';

interface CreateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDueDate?: string;
  editQuest?: Quest | null;
}

interface CreateQuestModalDialogProps {
  onClose: () => void;
  defaultDueDate?: string;
  editQuest?: Quest | null;
}

const CreateQuestModalDialog: React.FC<CreateQuestModalDialogProps> = ({
  onClose,
  defaultDueDate,
  editQuest,
}) => {
  const { createQuest, updateQuest, profile, streak } = useGame();

  const [title, setTitle] = useState(editQuest?.title || '');
  const [description, setDescription] = useState(editQuest?.description || '');
  const [category, setCategory] = useState<QuestCategory>(editQuest?.category || 'Work');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>(editQuest?.difficulty || 'Medium');
  const [attribute, setAttribute] = useState<AttributeType>(editQuest?.attribute || 'Intellect');

  // Schedule & Calendar State
  const [scheduleType, setScheduleType] = useState<'calendar' | 'recurring'>(
    editQuest?.is_recurring ? 'recurring' : 'calendar'
  );
  const [dueDate, setDueDate] = useState<string>(() => {
    if (editQuest?.due_date) {
      return editQuest.due_date.includes('T') ? editQuest.due_date.split('T')[0] : editQuest.due_date;
    }
    return defaultDueDate || '';
  });
  const [recurringDays, setRecurringDays] = useState<Weekday[]>(() => {
    if (editQuest?.recurring_days && Array.isArray(editQuest.recurring_days) && editQuest.recurring_days.length > 0) {
      return editQuest.recurring_days as Weekday[];
    }
    return ['mon', 'tue', 'wed', 'thu', 'fri'];
  });

  // Focus Timer & Alarm State
  const [timerMinutes, setTimerMinutes] = useState<number | null>(() => {
    if (editQuest) return editQuest.timer_minutes || null;
    return 25;
  });
  const [isCustomTimer, setIsCustomTimer] = useState<boolean>(() => {
    if (editQuest?.timer_minutes) {
      return ![15, 25, 45, 60].includes(editQuest.timer_minutes);
    }
    return false;
  });
  const [customTimerValue, setCustomTimerValue] = useState<string>(() => {
    if (editQuest?.timer_minutes) {
      return String(editQuest.timer_minutes);
    }
    return '30';
  });
  const [isAlarmEnabled, setIsAlarmEnabled] = useState<boolean>(
    Boolean(editQuest?.reminder_enabled || editQuest?.reminder_time)
  );
  const [reminderTime, setReminderTime] = useState<string>(
    editQuest?.reminder_time || '08:00'
  );

  const priority: QuestPriority = editQuest?.priority || 'Medium';
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCategoryChange = (newCat: QuestCategory) => {
    setCategory(newCat);
    setAttribute(getDefaultAttributeForCategory(newCat));
  };

  const handleTimerPresetSelect = (mins: number | null) => {
    setIsCustomTimer(false);
    setTimerMinutes(mins);
  };

  const handleCustomTimerSelect = () => {
    setIsCustomTimer(true);
    const parsed = parseInt(customTimerValue, 10);
    setTimerMinutes(isNaN(parsed) || parsed <= 0 ? 30 : parsed);
  };

  // Preview estimated rewards
  const rewardsPreview = calculateAuthoritativeRewards({
    category,
    difficulty,
    attribute,
    archetype: profile.archetype,
    currentStreak: streak.current_streak,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim()) {
      setValidationError('Please enter a quest title.');
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const isRecurring = scheduleType === 'recurring';
      const resolvedDueDate = isRecurring ? null : dueDate ? dueDate : null;
      const resolvedRecurrenceInterval = isRecurring
        ? recurringDays.length === 7
          ? 'Daily'
          : 'Weekly'
        : 'None';
      const resolvedRecurringDays = isRecurring ? recurringDays : null;

      let resolvedTimerMinutes: number | null = null;
      if (isCustomTimer) {
        const parsed = parseInt(customTimerValue, 10);
        resolvedTimerMinutes = isNaN(parsed) || parsed <= 0 ? null : parsed;
      } else {
        resolvedTimerMinutes = timerMinutes && timerMinutes > 0 ? timerMinutes : null;
      }

      if (editQuest) {
        // Edit existing quest
        await updateQuest(editQuest.id, {
          title: title.trim(),
          description: description.trim(),
          category,
          difficulty,
          attribute,
          due_date: resolvedDueDate,
          is_recurring: isRecurring,
          recurrence_interval: resolvedRecurrenceInterval,
          recurring_days: resolvedRecurringDays,
          priority,
          reminder_time: isAlarmEnabled ? reminderTime : null,
          reminder_enabled: isAlarmEnabled,
          timer_minutes: resolvedTimerMinutes,
        });
      } else {
        // Create new quest
        await createQuest({
          title: title.trim(),
          description: description.trim(),
          category,
          difficulty,
          attribute,
          due_date: resolvedDueDate,
          is_recurring: isRecurring,
          recurrence_interval: isRecurring ? resolvedRecurrenceInterval : undefined,
          recurring_days: resolvedRecurringDays,
          priority,
          reminder_time: isAlarmEnabled ? reminderTime : null,
          reminder_enabled: isAlarmEnabled,
          timer_minutes: resolvedTimerMinutes,
        });
      }

      setValidationError(null);
      onClose();
    } catch (err: unknown) {
      setValidationError((err as Error).message || 'Failed to save quest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: QuestCategory[] = ['Work', 'Fitness', 'Learning', 'Habit', 'Creative', 'Social'];
  const difficulties: QuestDifficulty[] = ['Easy', 'Medium', 'Hard', 'Epic', 'Legendary'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg apple-card p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E5E5EA]">
          <div>
            <h3 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">
              {editQuest ? 'Edit Quest' : 'Create New Quest'}
            </h3>
            <p className="text-xs text-[#6E6E73] mt-0.5">
              {editQuest
                ? 'Update your quest details, calendar schedule, timer, or reminders.'
                : 'Add your daily tasks, workouts, or habits to earn XP and level up.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#8E8E93] hover:text-[#1D1D1F] transition-colors p-1.5 rounded-full hover:bg-[#F5F5F7] cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {validationError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Quick Navigation Bar (Calendar & Schedule before Timer) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#FAF9F5] rounded-xl border border-[#E5E5EA] overflow-x-auto text-[11px] font-semibold mt-3">
          <span className="text-[10px] text-[#8E8E93] uppercase font-bold px-1.5 flex items-center gap-1 shrink-0">
            <Layers className="w-3 h-3 text-[#7C3AED]" />
            <span>Quick Nav:</span>
          </span>
          <button
            type="button"
            onClick={() => document.getElementById('quest-section-details')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
            className="px-2 py-1 rounded-lg text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white transition-all cursor-pointer whitespace-nowrap"
          >
            Details
          </button>
          <span className="text-[#C7C7CC]">•</span>
          <button
            type="button"
            onClick={() => document.getElementById('quest-section-calendar')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
            className="px-2.5 py-1 rounded-lg text-purple-700 bg-white shadow-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 border border-purple-200"
          >
            <Calendar className="w-3 h-3 text-purple-600" />
            <span>Calendar & Schedule</span>
          </button>
          <span className="text-[#C7C7CC]">•</span>
          <button
            type="button"
            onClick={() => document.getElementById('quest-section-timer')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
            className="px-2 py-1 rounded-lg text-[#6E6E73] hover:text-purple-700 hover:bg-white transition-all cursor-pointer whitespace-nowrap flex items-center gap-1"
          >
            <Clock className="w-3 h-3 text-purple-600" />
            <span>Timer & Alarm</span>
          </button>
          <span className="text-[#C7C7CC]">•</span>
          <button
            type="button"
            onClick={() => document.getElementById('quest-section-rewards')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
            className="px-2 py-1 rounded-lg text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white transition-all cursor-pointer whitespace-nowrap"
          >
            Rewards
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* ============================================================ */}
          {/* 1. CORE QUEST DETAILS */}
          {/* ============================================================ */}
          <div id="quest-section-details" className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-1.5">
                Quest Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="e.g., Read for 20 minutes, Morning Workout, or Complete Project"
                required
                className="w-full px-4 py-3 bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl text-[#1D1D1F] placeholder-[#8E8E93] text-sm focus:outline-none focus:border-purple-500 font-medium transition-colors"
              />
            </div>

            {/* Notes / Description */}
            <div>
              <label className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-1.5">
                Notes (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add checklist notes or details..."
                rows={2}
                className="w-full px-4 py-2.5 bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl text-[#1D1D1F] placeholder-[#8E8E93] text-sm focus:outline-none focus:border-purple-500 font-medium resize-none transition-colors"
              />
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl transition-all border cursor-pointer ${
                      category === cat
                        ? 'btn-primary-gradient text-white border-transparent shadow-sm'
                        : 'bg-white text-[#6E6E73] border-[#E5E5EA] hover:border-[#C7C7CC] hover:text-[#1D1D1F]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Skill Boosted & Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-1.5">
                  Skill Boosted
                </label>
                <select
                  value={attribute}
                  onChange={(e) => setAttribute(e.target.value as AttributeType)}
                  className="w-full px-3 py-2.5 bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl text-[#1D1D1F] text-xs font-semibold focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  {ATTRIBUTE_LIST.map((attr) => (
                    <option key={attr.type} value={attr.type}>
                      {attr.name} (+{attr.primaryCategories.join(', ')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-1.5">
                  Difficulty
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {difficulties.map((diff) => (
                    <button
                      type="button"
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`py-2 px-1 text-[11px] font-semibold rounded-xl transition-all border text-center cursor-pointer ${
                        difficulty === diff
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-white text-[#6E6E73] border-[#E5E5EA] hover:border-[#C7C7CC] hover:text-[#1D1D1F]'
                      }`}
                    >
                      {diff.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 2. CALENDAR AND SCHEDULE FEATURE (BEFORE TIMER)               */}
          {/* ============================================================ */}
          <div id="quest-section-calendar" className="p-4 bg-[#FAF9F5] rounded-2xl border border-[#E5E5EA] space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <div>
                  <h4 className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider">
                    Calendar & Schedule
                  </h4>
                  <p className="text-[11px] text-[#6E6E73]">
                    Set a calendar target date or repeating weekly schedule
                  </p>
                </div>
              </div>
            </div>

            {/* Schedule Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#E5E5EA]/60 rounded-xl">
              <button
                type="button"
                onClick={() => setScheduleType('calendar')}
                className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  scheduleType === 'calendar'
                    ? 'bg-white text-[#1D1D1F] shadow-xs'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-purple-600" />
                <span>Calendar Date</span>
              </button>

              <button
                type="button"
                onClick={() => setScheduleType('recurring')}
                className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  scheduleType === 'recurring'
                    ? 'bg-white text-[#1D1D1F] shadow-xs'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5 text-purple-600" />
                <span>Weekly Schedule</span>
              </button>
            </div>

            {/* Calendar Date Picker View */}
            {scheduleType === 'calendar' ? (
              <QuestCalendarPicker
                selectedDate={dueDate}
                onChange={(date) => setDueDate(date)}
              />
            ) : (
              /* Weekly Routine Schedule View */
              <WeeklyScheduleSelector
                selectedDays={recurringDays}
                onChange={(days) => {
                  setRecurringDays(days);
                }}
              />
            )}
          </div>

          {/* ============================================================ */}
          {/* 3. FOCUS TIMER & ALARM REMINDER FEATURE (AFTER CALENDAR)     */}
          {/* ============================================================ */}
          <div id="quest-section-timer" className="p-4 bg-[#F5F5F7] rounded-2xl border border-[#E5E5EA] space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <div>
                  <h4 className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider">
                    Focus Timer & Alarm
                  </h4>
                  <p className="text-[11px] text-[#6E6E73]">
                    Planned focus session duration and scheduled sound alarm chime
                  </p>
                </div>
              </div>
            </div>

            {/* Focus Timer Duration Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1D1D1F]">
                  Planned Focus Duration
                </span>
                {timerMinutes && (
                  <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                    {timerMinutes} min session
                  </span>
                )}
              </div>

              <div className="grid grid-cols-6 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleTimerPresetSelect(null)}
                  className={`py-1.5 px-1 text-xs font-medium rounded-xl border transition-all text-center cursor-pointer ${
                    timerMinutes === null && !isCustomTimer
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs font-bold'
                      : 'bg-white text-[#6E6E73] border-[#E5E5EA] hover:border-purple-300 hover:text-[#1D1D1F]'
                  }`}
                >
                  Off
                </button>

                {[15, 25, 45, 60].map((mins) => {
                  const isSelected = timerMinutes === mins && !isCustomTimer;
                  return (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => handleTimerPresetSelect(mins)}
                      className={`py-1.5 px-1 text-xs font-medium rounded-xl border transition-all text-center cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs font-bold'
                          : 'bg-white text-[#6E6E73] border-[#E5E5EA] hover:border-purple-300 hover:text-[#1D1D1F]'
                      }`}
                    >
                      {mins}m
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={handleCustomTimerSelect}
                  className={`py-1.5 px-1 text-xs font-medium rounded-xl border transition-all text-center cursor-pointer ${
                    isCustomTimer
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs font-bold'
                      : 'bg-white text-[#6E6E73] border-[#E5E5EA] hover:border-purple-300 hover:text-[#1D1D1F]'
                  }`}
                >
                  Custom
                </button>
              </div>

              {/* Custom Minutes Input */}
              {isCustomTimer && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="number"
                    min={1}
                    max={240}
                    value={customTimerValue}
                    onChange={(e) => {
                      setCustomTimerValue(e.target.value);
                      const p = parseInt(e.target.value, 10);
                      if (!isNaN(p) && p > 0) {
                        setTimerMinutes(p);
                      }
                    }}
                    placeholder="Minutes"
                    className="w-24 px-3 py-1.5 bg-white border border-[#E5E5EA] rounded-xl text-xs font-mono font-bold text-[#1D1D1F] focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-xs text-[#6E6E73]">minutes target session</span>
                </div>
              )}
            </div>

            {/* Scheduled Alarm Reminder */}
            <div className="pt-3 border-t border-[#E5E5EA] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Bell className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-xs font-bold text-[#1D1D1F]">Scheduled Alarm Chime</div>
                    <div className="text-[11px] text-[#6E6E73]">Rings an audio alarm chime at task time</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isAlarmEnabled}
                  onChange={(e) => setIsAlarmEnabled(e.target.checked)}
                  className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              {isAlarmEnabled && (
                <div className="pt-2 border-t border-[#E5E5EA]/70 flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full sm:w-auto px-3 py-1.5 bg-white border border-[#E5E5EA] rounded-xl text-xs font-mono font-bold text-[#1D1D1F] focus:outline-none focus:border-purple-500 cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 w-full sm:w-auto flex-wrap">
                    {[
                      { label: '🌅 08:00 AM', time: '08:00' },
                      { label: '☀️ 02:00 PM', time: '14:00' },
                      { label: '🌙 08:00 PM', time: '20:00' },
                    ].map((preset) => (
                      <button
                        key={preset.time}
                        type="button"
                        onClick={() => setReminderTime(preset.time)}
                        className={`px-2 py-1 text-[11px] font-mono rounded-lg border transition-all cursor-pointer ${
                          reminderTime === preset.time
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-white text-[#6E6E73] border-[#E5E5EA] hover:border-purple-300'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* 4. REWARDS PREVIEW & ACTIONS                                 */}
          {/* ============================================================ */}
          <div id="quest-section-rewards" className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-200/60">
            <div className="text-[11px] font-mono font-bold uppercase text-purple-900 tracking-wider flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Rewards You&apos;ll Earn</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-purple-700 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> +{rewardsPreview.xpEarned} XP
              </span>
              <span className="text-amber-700 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-500" /> +{rewardsPreview.goldEarned} Gold
              </span>
              <span className="text-[#1D1D1F] flex items-center gap-1">
                +{rewardsPreview.attributeXpEarned} {attribute}
              </span>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center space-x-3 pt-3 border-t border-[#E5E5EA]">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 border border-[#E5E5EA] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="w-2/3 py-2.5 btn-primary-gradient text-white rounded-xl font-semibold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? editQuest
                  ? 'Saving Changes...'
                  : 'Creating Quest...'
                : editQuest
                ? 'Save Changes'
                : 'Create Quest'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export const CreateQuestModal: React.FC<CreateQuestModalProps> = ({
  isOpen,
  onClose,
  defaultDueDate,
  editQuest,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <CreateQuestModalDialog
        key={editQuest ? `edit-${editQuest.id}` : `new-${defaultDueDate || 'default'}`}
        onClose={onClose}
        defaultDueDate={defaultDueDate}
        editQuest={editQuest}
      />
    </AnimatePresence>
  );
};
