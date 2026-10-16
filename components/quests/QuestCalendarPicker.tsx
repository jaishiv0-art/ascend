'use client';

// ==============================================================================
// ASCEND - INTERACTIVE QUEST CALENDAR DATE PICKER
// Apple-Style Compact Mini Calendar with Quick Presets & Month Navigation
// ==============================================================================

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';

interface QuestCalendarPickerProps {
  selectedDate: string; // 'YYYY-MM-DD' or ''
  onChange: (date: string) => void;
  className?: string;
}

export const QuestCalendarPicker: React.FC<QuestCalendarPickerProps> = ({
  selectedDate,
  onChange,
  className = '',
}) => {
  const [viewDate, setViewDate] = useState<Date>(() => {
    if (selectedDate && selectedDate.length === 10) {
      const [y, m, d] = selectedDate.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date();
  });

  const [showManualInput, setShowManualInput] = useState(false);

  // Helper to format Date to 'YYYY-MM-DD'
  const formatDateIso = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayIso = useMemo(() => formatDateIso(new Date()), []);

  // Quick preset dates
  const presets = useMemo(() => {
    const now = new Date();

    // Today
    const todayStr = formatDateIso(now);

    // Tomorrow
    const tom = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const tomorrowStr = formatDateIso(tom);

    // This Weekend (Saturday)
    const dayOfWeek = now.getDay(); // 0 is Sun, 6 is Sat
    const daysUntilSat = dayOfWeek === 6 ? 0 : dayOfWeek === 0 ? 6 : 6 - dayOfWeek;
    const sat = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSat);
    const weekendStr = formatDateIso(sat);

    // Next Monday
    const daysUntilNextMon = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    const nextMon = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilNextMon);
    const nextMonStr = formatDateIso(nextMon);

    return [
      { label: 'Today', date: todayStr },
      { label: 'Tomorrow', date: tomorrowStr },
      { label: 'This Weekend', date: weekendStr },
      { label: 'Next Week', date: nextMonStr },
    ];
  }, []);

  // Compute month cells
  const monthDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Mon = 1 ... Sun = 7
    let startDayOfWeek = firstDay.getDay();
    if (startDayOfWeek === 0) startDayOfWeek = 7;

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean; isPast: boolean }[] = [];

    // Preceding month padding
    for (let i = startDayOfWeek - 1; i > 0; i--) {
      const d = new Date(year, month, 1 - i);
      const iso = formatDateIso(d);
      days.push({
        dateStr: iso,
        dayNum: d.getDate(),
        isCurrentMonth: false,
        isPast: iso < todayIso,
      });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      const iso = formatDateIso(d);
      days.push({
        dateStr: iso,
        dayNum: i,
        isCurrentMonth: true,
        isPast: iso < todayIso,
      });
    }

    // Trailing padding to make full weeks
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remaining = totalCells - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const iso = formatDateIso(d);
      days.push({
        dateStr: iso,
        dayNum: d.getDate(),
        isCurrentMonth: false,
        isPast: iso < todayIso,
      });
    }

    return days;
  }, [viewDate, todayIso]);

  const monthLabel = viewDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const formattedSelectedLabel = useMemo(() => {
    if (!selectedDate) return 'No due date chosen (Flexible)';
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    if (isNaN(dateObj.getTime())) return selectedDate;
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [selectedDate]);

  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleResetToToday = () => {
    const now = new Date();
    setViewDate(now);
    onChange(formatDateIso(now));
  };

  return (
    <div className={`p-3.5 sm:p-4 bg-white rounded-2xl border border-[#E5E5EA] shadow-xs space-y-3 ${className}`}>
      {/* Header with Quick Presets */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider">
            Select Calendar Due Date
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-[11px] text-purple-600 hover:text-purple-800 font-medium transition-colors cursor-pointer"
        >
          {showManualInput ? 'Show Mini Calendar' : 'Type Date Directly'}
        </button>
      </div>

      {/* Quick Date Preset Chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {presets.map((preset) => {
          const isSelected = selectedDate === preset.date;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                onChange(preset.date);
                const [y, m, d] = preset.date.split('-').map(Number);
                setViewDate(new Date(y, m - 1, d));
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-[#F5F5F7] text-[#6E6E73] border-[#E5E5EA] hover:border-purple-300 hover:text-[#1D1D1F]'
              }`}
            >
              {preset.label}
            </button>
          );
        })}

        {selectedDate && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="px-2 py-1 text-xs text-[#8E8E93] hover:text-rose-600 font-medium rounded-lg hover:bg-rose-50 transition-colors cursor-pointer ml-auto"
            title="Clear due date"
          >
            Clear
          </button>
        )}
      </div>

      {/* Manual Date Input Mode */}
      {showManualInput ? (
        <div className="pt-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              onChange(e.target.value);
              if (e.target.value) {
                const [y, m, d] = e.target.value.split('-').map(Number);
                setViewDate(new Date(y, m - 1, d));
              }
            }}
            className="w-full px-3 py-2 bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl text-[#1D1D1F] text-xs font-medium focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      ) : (
        /* Interactive Mini Calendar Grid */
        <div className="pt-1 border-t border-[#F2F2F7] space-y-2">
          {/* Month Navigation */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#1D1D1F]">{monthLabel}</span>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handleResetToToday}
                className="text-[11px] text-[#6E6E73] hover:text-purple-700 font-medium px-1.5 py-0.5 rounded hover:bg-[#F5F5F7] transition-colors cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous Month"
                className="p-1 text-[#8E8E93] hover:text-[#1D1D1F] rounded-lg hover:bg-[#F5F5F7] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next Month"
                className="p-1 text-[#8E8E93] hover:text-[#1D1D1F] rounded-lg hover:bg-[#F5F5F7] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Weekday Labels (Mon - Sun) */}
          <div className="grid grid-cols-7 text-center">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
              <span key={day} className="text-[10px] font-bold text-[#8E8E93] py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map(({ dateStr, dayNum, isCurrentMonth, isPast }) => {
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === todayIso;

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => onChange(dateStr)}
                  className={`h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer relative ${
                    isSelected
                      ? 'btn-primary-gradient text-white shadow-xs font-bold'
                      : !isCurrentMonth
                      ? 'text-[#C7C7CC] hover:bg-[#F5F5F7] hover:text-[#8E8E93]'
                      : isPast
                      ? 'text-[#8E8E93] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]'
                      : 'text-[#1D1D1F] hover:bg-purple-50 hover:text-purple-700'
                  } ${isToday && !isSelected ? 'border border-purple-500/50 font-bold' : ''}`}
                >
                  <span>{dayNum}</span>
                  {isToday && (
                    <span
                      className={`absolute bottom-0.5 w-1 h-1 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-purple-600'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Formatted Date Banner */}
      <div className="pt-2 border-t border-[#F2F2F7] flex items-center justify-between text-xs">
        <span className="text-[#6E6E73]">Scheduled For:</span>
        <span className="font-semibold text-purple-700 font-mono">
          {formattedSelectedLabel}
        </span>
      </div>
    </div>
  );
};
