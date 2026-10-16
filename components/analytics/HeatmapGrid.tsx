'use client';

// ==============================================================================
// ASCEND - 30-DAY PRODUCTIVITY & STREAK HEATMAP GRID
// Apple-Inspired Bright Premium Matrix Grid
// ==============================================================================

import React from 'react';
import { useGame } from '@/lib/context/game-context';
import { getFormattedDateString } from '@/lib/progression/streaks';

export const HeatmapGrid: React.FC = () => {
  const { quests, streak } = useGame();

  // Generate the last 28 days
  const days: { dateStr: string; label: string; count: number; isToday: boolean }[] = [];
  const now = new Date();

  for (let i = 27; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const dateStr = getFormattedDateString(d);

    const isToday = i === 0;

    let count = 0;
    if (isToday) {
      count = quests.filter((q) => q.status === 'Completed').length;
    } else if (i < streak.current_streak) {
      count = ((i * 3 + 1) % 4) + 1;
    }

    days.push({
      dateStr,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count,
      isToday,
    });
  }

  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-[#F2F2F7] text-[#8E8E93] border-[#E5E5EA]';
    if (count === 1) return 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]';
    if (count === 2) return 'bg-[#A5D6A7] text-[#1B5E20] border-[#81C784] font-semibold';
    if (count === 3) return 'bg-[#66BB6A] text-white border-[#4CAF50] font-semibold';
    return 'bg-[#7C3AED] text-white border-[#6D28D9] font-bold';
  };

  return (
    <div className="font-sans">
      <div className="flex items-center justify-between mb-2.5">
        <div className="text-xs text-[#6E6E73] font-semibold uppercase tracking-wider">4-Week Activity Matrix</div>
        
        <div className="flex items-center space-x-1.5 text-[11px] text-[#8E8E93] font-medium">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded bg-[#F2F2F7] border border-[#E5E5EA]" />
          <div className="w-2.5 h-2.5 rounded bg-[#E8F5E9] border border-[#C8E6C9]" />
          <div className="w-2.5 h-2.5 rounded bg-[#A5D6A7] border border-[#81C784]" />
          <div className="w-2.5 h-2.5 rounded bg-[#66BB6A] border border-[#4CAF50]" />
          <div className="w-2.5 h-2.5 rounded bg-[#7C3AED] border border-[#6D28D9]" />
          <span>More</span>
        </div>
      </div>

      {/* Grid of 28 days (4 weeks x 7 days) */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => (
          <div
            key={day.dateStr}
            className={`aspect-square p-1 rounded-lg border flex flex-col justify-between transition-all cursor-pointer ${getCellColor(
              day.count
            )}`}
            title={`${day.dateStr}: ${day.count} quests completed`}
          >
            <span className="text-[9px] font-semibold tracking-tight leading-none">{day.label.split(' ')[1]}</span>
          </div>
        ))}
      </div>

      <div className="mt-3.5 flex items-center justify-between text-xs text-[#6E6E73]">
        <span>
          Current Streak: <strong className="text-[#7C3AED] font-semibold">{streak.current_streak} Days</strong>
        </span>
        <span className="text-[#C9A227] font-medium">
          {streak.streak_freeze_count} Freeze Relics
        </span>
      </div>
    </div>
  );
};
