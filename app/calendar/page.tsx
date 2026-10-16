'use client';

// ==============================================================================
// ASCEND - SIMPLIFIED QUEST CALENDAR
// Clean, calm calendar with full due-date scheduling & direct quest completion
// ==============================================================================

import React, { useState } from 'react';
import { useGame } from '@/lib/context/game-context';
import { Quest, QuestCategory, QuestDifficulty, AttributeType } from '@/types/rpg';
import { soundManager } from '@/lib/sound/sfx';
import confetti from 'canvas-confetti';
import { CreateQuestModal } from '@/components/modals/CreateQuestModal';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Check,
  Zap,
  Coins,
  RotateCw,
  Sparkles,
  Dumbbell,
  Brain,
  Layers,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { isQuestScheduledForDate, isQuestCompletedOnDate } from '@/lib/progression/schedule';
import { PageMascot } from '@/components/PageMascot';

export default function CalendarPage() {
  const { quests, completeQuest, createQuest } = useGame();
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);
  const [selectedDateIso, setSelectedDateIso] = useState<string>(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deployingPreset, setDeployingPreset] = useState<'gym' | 'code' | 'habit' | null>(null);
  const [deployedSuccess, setDeployedSuccess] = useState<string | null>(null);

  // Date Formatter (YYYY-MM-DD) avoiding timezone offsets
  const formatDateIso = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayIso = formatDateIso(new Date());

  // Match quests for a specific date using recurring weekday & due date schedule logic
  const getQuestsForDate = (dateStr: string) => {
    return quests.filter((q) => isQuestScheduledForDate(q, dateStr));
  };

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const resetToToday = () => {
    setCurrentDate(new Date());
    setCurrentWeekOffset(0);
    setSelectedDateIso(todayIso);
  };

  // Compute month days (standard 7 columns Mon-Sun)
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Monday is 1, Sunday is 0 -> shift Sunday to 7
    let startDayOfWeek = firstDayOfMonth.getDay();
    if (startDayOfWeek === 0) startDayOfWeek = 7;

    const days = [];

    // Preceding days from previous month
    for (let i = startDayOfWeek - 1; i > 0; i--) {
      const d = new Date(year, month, 1 - i);
      days.push({ date: d, isCurrentMonth: false });
    }

    // Days of current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, isCurrentMonth: true });
    }

    // Trailing days to fill out the last week (multiple of 7)
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remaining = totalCells - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, isCurrentMonth: false });
    }

    return days;
  };

  // Compute Week Days (Mon - Sun)
  const getWeekDates = (offsetWeeks: number = 0) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const distanceToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + distanceToMon + offsetWeeks * 7);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeekOffset);
  const monthDays = getMonthDays();
  const selectedDayQuests = getQuestsForDate(selectedDateIso);

  // Quick Routine Presets
  const handleDeployPreset = async (presetType: 'gym' | 'code' | 'habit') => {
    if (deployingPreset) return;
    setDeployingPreset(presetType);
    setDeployedSuccess(null);

    const today = new Date();

    try {
      if (presetType === 'gym') {
        const gymPlan = [
          { dayOffset: 0, title: 'Upper Body Workout', category: 'Fitness' as QuestCategory, difficulty: 'Hard' as QuestDifficulty, attribute: 'Strength' as AttributeType },
          { dayOffset: 2, title: 'Lower Body & Core', category: 'Fitness' as QuestCategory, difficulty: 'Hard' as QuestDifficulty, attribute: 'Vitality' as AttributeType },
          { dayOffset: 4, title: 'Cardio & Stamina', category: 'Fitness' as QuestCategory, difficulty: 'Medium' as QuestDifficulty, attribute: 'Vitality' as AttributeType },
          { dayOffset: 6, title: 'Recovery & Stretching', category: 'Fitness' as QuestCategory, difficulty: 'Easy' as QuestDifficulty, attribute: 'Discipline' as AttributeType },
        ];
        for (const p of gymPlan) {
          const targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + p.dayOffset);
          await createQuest({
            title: p.title,
            category: p.category,
            difficulty: p.difficulty,
            attribute: p.attribute,
            due_date: formatDateIso(targetDate),
            is_recurring: false,
          });
        }
        setDeployedSuccess('Workout routine scheduled for this week!');
      } else if (presetType === 'code') {
        const codePlan = [
          { dayOffset: 0, title: 'System Design & Planning', category: 'Work' as QuestCategory, difficulty: 'Hard' as QuestDifficulty, attribute: 'Intellect' as AttributeType },
          { dayOffset: 1, title: 'Feature Development & Tests', category: 'Work' as QuestCategory, difficulty: 'Epic' as QuestDifficulty, attribute: 'Intellect' as AttributeType },
          { dayOffset: 3, title: 'UI Polish & Mobile Layout', category: 'Work' as QuestCategory, difficulty: 'Medium' as QuestDifficulty, attribute: 'Creativity' as AttributeType },
          { dayOffset: 5, title: 'Deployment & Review', category: 'Work' as QuestCategory, difficulty: 'Hard' as QuestDifficulty, attribute: 'Discipline' as AttributeType },
        ];
        for (const p of codePlan) {
          const targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + p.dayOffset);
          await createQuest({
            title: p.title,
            category: p.category,
            difficulty: p.difficulty,
            attribute: p.attribute,
            due_date: formatDateIso(targetDate),
            is_recurring: false,
          });
        }
        setDeployedSuccess('Study & coding sprint scheduled for this week!');
      } else if (presetType === 'habit') {
        const habitPlan = [
          { dayOffset: 0, title: 'Morning Reading (20 mins)', category: 'Habit' as QuestCategory, difficulty: 'Easy' as QuestDifficulty, attribute: 'Discipline' as AttributeType },
          { dayOffset: 0, title: 'Drink 2L Water Daily', category: 'Habit' as QuestCategory, difficulty: 'Easy' as QuestDifficulty, attribute: 'Vitality' as AttributeType },
          { dayOffset: 0, title: 'Deep Work Focus Block (60 mins)', category: 'Work' as QuestCategory, difficulty: 'Hard' as QuestDifficulty, attribute: 'Intellect' as AttributeType },
        ];
        for (const p of habitPlan) {
          const targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + p.dayOffset);
          await createQuest({
            title: p.title,
            category: p.category,
            difficulty: p.difficulty,
            attribute: p.attribute,
            due_date: formatDateIso(targetDate),
            is_recurring: true,
          });
        }
        setDeployedSuccess('Daily habits scheduled into your routine!');
      }

      soundManager.playGoldClink();
      if (typeof window !== 'undefined') {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#7C3AED', '#38BDF8', '#10B981'],
        });
      }

      setTimeout(() => setDeployedSuccess(null), 5000);
    } catch {
      // Handled
    } finally {
      setDeployingPreset(null);
    }
  };

  const handleOpenScheduleForDate = (dateStr: string) => {
    setSelectedDateIso(dateStr);
    setIsCreateModalOpen(true);
  };

  const formattedSelectedDate = new Date(selectedDateIso + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 pb-16 pt-2 max-w-6xl mx-auto">
      {/* 1. TOP HEADER & CONTROLS */}
      <div className="apple-card p-6 sm:p-8 relative">
        <div className="absolute -top-3 right-8 hidden sm:block">
          <PageMascot animationType="hanging" size={88} position="top-edge" />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#E5E5EA]">
          <div className="flex items-center space-x-4 text-center md:text-left">
            <div className="w-12 h-12 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-center text-purple-600 shrink-0 shadow-sm">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] tracking-tight">
                Quest Calendar
              </h1>
              <p className="text-xs sm:text-sm text-[#6E6E73] mt-0.5">
                Plan, view, and complete your quests and daily habits by due date.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleOpenScheduleForDate(selectedDateIso)}
              className="px-5 py-2.5 btn-primary-gradient font-semibold text-xs rounded-full flex items-center space-x-1.5 cursor-pointer shadow-sm hover:shadow-md transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Schedule Quest</span>
            </button>
          </div>
        </div>

        {/* View Switcher & Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5">
          {/* Navigation Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={viewMode === 'month' ? prevMonth : () => setCurrentWeekOffset((p) => p - 1)}
              className="p-2 rounded-full bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1D1D1F] transition-colors cursor-pointer"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-base font-bold text-[#1D1D1F] min-w-[160px] text-center">
              {viewMode === 'month'
                ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : `Week of ${weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            </span>

            <button
              onClick={viewMode === 'month' ? nextMonth : () => setCurrentWeekOffset((p) => p + 1)}
              className="p-2 rounded-full bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1D1D1F] transition-colors cursor-pointer"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={resetToToday}
              className="px-3 py-1 text-xs font-semibold rounded-full bg-[#F2F2F7] text-purple-700 hover:bg-[#E5E5EA] transition-colors cursor-pointer"
            >
              Today
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-[#F2F2F7] p-1 rounded-full border border-[#E5E5EA]">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'month' ? 'btn-primary-gradient text-white shadow-xs' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'week' ? 'btn-primary-gradient text-white shadow-xs' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Week View
            </button>
          </div>
        </div>
      </div>

      {/* Routine Deployment Success Alert */}
      <AnimatePresence>
        {deployedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs"
          >
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{deployedSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CALENDAR VIEW (MONTH / WEEK) */}
      {viewMode === 'month' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* MONTH GRID (7 COLS) */}
          <div className="lg:col-span-8 apple-card p-6">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#6E6E73] uppercase mb-2">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>

            {/* Month Day Cells */}
            <div className="grid grid-cols-7 gap-1.5">
              {monthDays.map(({ date, isCurrentMonth }) => {
                const dateIso = formatDateIso(date);
                const isSelected = dateIso === selectedDateIso;
                const isToday = dateIso === todayIso;
                const dayQuests = getQuestsForDate(dateIso);
                const hasQuests = dayQuests.length > 0;
                const completedCount = dayQuests.filter((q) => isQuestCompletedOnDate(q, dateIso)).length;
                const isAllDone = hasQuests && completedCount === dayQuests.length;

                return (
                  <div
                    key={dateIso}
                    onClick={() => setSelectedDateIso(dateIso)}
                    className={`min-h-[72px] sm:min-h-[84px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50/60 ring-2 ring-purple-500/20 shadow-xs'
                        : isToday
                        ? 'bg-[#FAF9F5] border-purple-300 font-bold'
                        : isCurrentMonth
                        ? 'bg-white border-[#E5E5EA] hover:border-[#D1D1D6]'
                        : 'bg-[#FAF9F5] border-transparent text-[#AEAEB2]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs sm:text-sm font-semibold ${
                          isSelected
                            ? 'text-purple-700 font-bold'
                            : isToday
                            ? 'text-purple-600 font-bold'
                            : isCurrentMonth
                            ? 'text-[#1D1D1F]'
                            : 'text-[#AEAEB2]'
                        }`}
                      >
                        {date.getDate()}
                      </span>

                      {isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600" title="Today" />
                      )}
                    </div>

                    {/* Quest Dots / Badges */}
                    {hasQuests && (
                      <div className="mt-1 flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            isAllDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {dayQuests.length} {dayQuests.length === 1 ? 'quest' : 'quests'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: SELECTED DAY'S QUEST LIST (4 COLS) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="apple-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EA]">
                <div>
                  <h3 className="text-base font-bold text-[#1D1D1F]">
                    {selectedDateIso === todayIso ? "Today's Quests" : 'Scheduled Quests'}
                  </h3>
                  <p className="text-xs text-[#6E6E73] mt-0.5">{formattedSelectedDate}</p>
                </div>

                <button
                  onClick={() => handleOpenScheduleForDate(selectedDateIso)}
                  className="p-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer"
                  title="Add quest for this date"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {/* List of Quests on Selected Date */}
              <div className="space-y-2.5">
                {selectedDayQuests.length === 0 ? (
                  <div className="py-10 text-center text-[#8E8E93] space-y-2">
                    <p className="text-xs">No quests scheduled for this day.</p>
                    <button
                      onClick={() => handleOpenScheduleForDate(selectedDateIso)}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1D1D1F] transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add a Quest</span>
                    </button>
                  </div>
                ) : (
                  selectedDayQuests.map((quest) => {
                    const isCompleted = isQuestCompletedOnDate(quest, selectedDateIso);

                    return (
                      <div
                        key={quest.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          isCompleted
                            ? 'bg-[#FAF9F5] border-[#E5E5EA] opacity-70'
                            : 'bg-white border-[#E5E5EA] hover:border-purple-200 shadow-xs'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <button
                            onClick={() => !isCompleted && completeQuest(quest.id)}
                            disabled={isCompleted}
                            className={`w-5 h-5 rounded-md mt-0.5 border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                              isCompleted
                                ? 'btn-primary-gradient border-transparent text-white'
                                : 'border-[#C7C7CC] hover:border-purple-600 text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </button>

                          <div className="flex-1 min-w-0">
                            <h4
                              className={`text-xs font-semibold leading-tight truncate ${
                                isCompleted ? 'line-through text-[#8E8E93]' : 'text-[#1D1D1F]'
                              }`}
                            >
                              {quest.title}
                            </h4>

                            <div className="flex items-center gap-2 mt-1 text-[10px]">
                              <span className="text-purple-700 font-semibold flex items-center gap-0.5">
                                <Zap className="w-3 h-3" /> +{quest.xp_reward} XP
                              </span>
                              <span className="text-amber-700 font-semibold flex items-center gap-0.5">
                                <Coins className="w-3 h-3" /> +{quest.gold_reward} Gold
                              </span>
                              {quest.is_recurring && (
                                <span className="text-[#6E6E73] flex items-center gap-0.5">
                                  <RotateCw className="w-2.5 h-2.5" /> Daily
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* WEEK VIEW (7 COLUMNS) */
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDates.map((dateObj) => {
            const dateIso = formatDateIso(dateObj);
            const isToday = dateIso === todayIso;
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = dateObj.getDate();
            const dayQuests = getQuestsForDate(dateIso);

            return (
              <div
                key={dateIso}
                className={`p-4 rounded-3xl border flex flex-col justify-between min-h-[340px] transition-all apple-card ${
                  isToday
                    ? 'bg-white border-purple-500 ring-2 ring-purple-500/20 shadow-xs'
                    : 'bg-white border-[#E5E5EA]'
                }`}
              >
                <div>
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E5EA]">
                    <div>
                      <div className={`text-xs font-semibold uppercase ${isToday ? 'text-purple-600' : 'text-[#6E6E73]'}`}>
                        {dayName}
                      </div>
                      <div className="text-xl font-bold text-[#1D1D1F] mt-0.5">
                        {dayNum}
                      </div>
                    </div>
                    {isToday && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Day's Quests */}
                  <div className="space-y-2">
                    {dayQuests.length === 0 ? (
                      <div className="py-8 text-center text-[#8E8E93]">
                        <p className="text-xs italic">No quests</p>
                      </div>
                    ) : (
                      dayQuests.map((q) => {
                        const isCompleted = isQuestCompletedOnDate(q, dateIso);
                        return (
                          <div
                            key={q.id}
                            className={`p-2 rounded-xl border transition-all ${
                              isCompleted
                                ? 'bg-[#FAF9F5] border-[#E5E5EA] opacity-60'
                                : 'bg-white border-[#E5E5EA] hover:border-[#D1D1D6]'
                            }`}
                          >
                            <div className="flex items-start space-x-2">
                              <button
                                onClick={() => !isCompleted && completeQuest(q.id)}
                                disabled={isCompleted}
                                className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                                  isCompleted
                                    ? 'btn-primary-gradient border-transparent text-white'
                                    : 'border-[#C7C7CC] hover:border-purple-600 bg-white text-transparent'
                                }`}
                              >
                                <Check className="w-3 h-3 stroke-[3]" />
                              </button>
                              <div className="flex-1 min-w-0">
                                <div
                                  className={`text-xs font-semibold leading-tight truncate ${
                                    isCompleted ? 'line-through text-[#8E8E93]' : 'text-[#1D1D1F]'
                                  }`}
                                >
                                  {q.title}
                                </div>
                                <div className="text-[10px] text-purple-700 font-semibold mt-0.5">
                                  +{q.xp_reward} XP
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Add Quest for this day */}
                <button
                  onClick={() => handleOpenScheduleForDate(dateIso)}
                  className="mt-3 w-full py-1.5 bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1D1D1F] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Quest</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. QUICK ROUTINE PRESETS */}
      <div className="apple-card p-6 sm:p-8">
        <div className="pb-3 mb-5 border-b border-[#E5E5EA]">
          <h2 className="text-lg font-bold text-[#1D1D1F]">
            Quick Starter Routines
          </h2>
          <p className="text-xs text-[#6E6E73] mt-0.5">
            Add pre-configured weekly habits directly into your schedule with one click.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E5EA] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-[#1D1D1F]">Workout Week (4 Days)</h3>
              </div>
              <p className="text-xs text-[#6E6E73]">
                Upper body, core training, cardio, and recovery sessions scheduled across the week.
              </p>
            </div>
            <button
              onClick={() => handleDeployPreset('gym')}
              disabled={deployingPreset !== null}
              className="mt-4 w-full py-2 bg-white hover:bg-purple-50 text-[#1D1D1F] border border-[#E5E5EA] hover:border-purple-300 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {deployingPreset === 'gym' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>Add Workout Routine</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E5EA] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-bold text-[#1D1D1F]">Study & Work Sprint (4 Days)</h3>
              </div>
              <p className="text-xs text-[#6E6E73]">
                Planning, focus blocks, review, and milestone tasks scheduled across the week.
              </p>
            </div>
            <button
              onClick={() => handleDeployPreset('code')}
              disabled={deployingPreset !== null}
              className="mt-4 w-full py-2 bg-white hover:bg-sky-50 text-[#1D1D1F] border border-[#E5E5EA] hover:border-sky-300 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {deployingPreset === 'code' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>Add Study Routine</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E5EA] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-[#1D1D1F]">Daily Habits Starter (3 Habits)</h3>
              </div>
              <p className="text-xs text-[#6E6E73]">
                Daily reading, hydration, and deep work recurring habits to build your streak.
              </p>
            </div>
            <button
              onClick={() => handleDeployPreset('habit')}
              disabled={deployingPreset !== null}
              className="mt-4 w-full py-2 bg-white hover:bg-amber-50 text-[#1D1D1F] border border-[#E5E5EA] hover:border-amber-300 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {deployingPreset === 'habit' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>Add Daily Habits</span>
            </button>
          </div>
        </div>
      </div>

      {/* CREATE / SCHEDULE QUEST MODAL */}
      <CreateQuestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultDueDate={selectedDateIso}
      />
    </div>
  );
}
