'use client';

// ==============================================================================
// ASCEND - 7-DAY RECURRING WEEKLY SCHEDULE BUILDER
// Intuitive Mon-Sun day toggles with live summary and quick presets
// ==============================================================================

import React from 'react';
import { Weekday } from '@/types/rpg';
import { WEEKDAYS, formatRecurringDaysSummary } from '@/lib/progression/schedule';
import { RotateCw, Sparkles } from 'lucide-react';

interface WeeklyScheduleSelectorProps {
  selectedDays: Weekday[];
  onChange: (days: Weekday[]) => void;
  className?: string;
}

export const WeeklyScheduleSelector: React.FC<WeeklyScheduleSelectorProps> = ({
  selectedDays = [],
  onChange,
  className = '',
}) => {
  const toggleDay = (day: Weekday) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d) => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  const selectAll = () => {
    onChange(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
  };

  const selectWeekdays = () => {
    onChange(['mon', 'tue', 'wed', 'thu', 'fri']);
  };

  const selectWeekends = () => {
    onChange(['sat', 'sun']);
  };

  const clearAll = () => {
    onChange([]);
  };

  const summaryText = formatRecurringDaysSummary(selectedDays);

  return (
    <div className={`p-4 bg-[#F5F5F7] rounded-2xl border border-[#E5E5EA] space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <RotateCw className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider">
            Repeat on Days
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={selectAll}
            className="text-[11px] text-[#6E6E73] hover:text-purple-700 font-medium px-1.5 py-0.5 rounded hover:bg-white transition-colors cursor-pointer"
          >
            Every Day
          </button>
          <span className="text-[#C7C7CC] text-xs">•</span>
          <button
            type="button"
            onClick={selectWeekdays}
            className="text-[11px] text-[#6E6E73] hover:text-purple-700 font-medium px-1.5 py-0.5 rounded hover:bg-white transition-colors cursor-pointer"
          >
            Weekdays
          </button>
          <span className="text-[#C7C7CC] text-xs">•</span>
          <button
            type="button"
            onClick={selectWeekends}
            className="text-[11px] text-[#6E6E73] hover:text-purple-700 font-medium px-1.5 py-0.5 rounded hover:bg-white transition-colors cursor-pointer"
          >
            Weekends
          </button>
        </div>
      </div>

      {/* 7-DAY ROW TOGGLES */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {WEEKDAYS.map(({ id, short, label }) => {
          const isSelected = selectedDays.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleDay(id)}
              title={label}
              className={`py-2.5 rounded-xl font-mono text-xs font-bold tracking-tight transition-all duration-150 flex flex-col items-center justify-center border cursor-pointer ${
                isSelected
                  ? 'btn-primary-gradient text-white border-transparent shadow-sm scale-[1.02]'
                  : 'bg-white text-[#6E6E73] border-[#E5E5EA] hover:border-purple-300 hover:text-[#1D1D1F]'
              }`}
            >
              <span>{short}</span>
              {isSelected && <span className="w-1 h-1 rounded-full bg-white mt-0.5" />}
            </button>
          );
        })}
      </div>

      {/* LIVE HUMAN-READABLE SUMMARY */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center space-x-1.5 text-purple-700 font-medium font-sans">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span className="truncate">{summaryText}</span>
        </div>
        {selectedDays.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] text-[#8E8E93] hover:text-rose-600 transition-colors cursor-pointer ml-2 shrink-0"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
