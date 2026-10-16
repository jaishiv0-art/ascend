'use client';

// ==============================================================================
// ASCEND - ATTRIBUTE PROGRESSION BARS & MASTERY BREAKDOWN
// Apple-Inspired Bright Premium Attribute List
// ==============================================================================

import React from 'react';
import { useGame } from '@/lib/context/game-context';
import { ATTRIBUTE_LIST, calculateAttributeLevel, getAttributeMasteryTitle } from '@/lib/progression/attributes';

export const AttributeBarList: React.FC = () => {
  const { attributes } = useGame();

  return (
    <div className="space-y-3.5 text-sm">
      {ATTRIBUTE_LIST.map((attr) => {
        const attrKey = `${attr.type.toLowerCase()}_xp` as keyof typeof attributes;
        const currentXP = (attributes[attrKey] as number) || 0;
        const level = calculateAttributeLevel(currentXP);
        const mastery = getAttributeMasteryTitle(level);

        const xpInCurrentLevel = currentXP % 150;
        const percent = Math.min(100, Math.floor((xpInCurrentLevel / 150) * 100));

        return (
          <div key={attr.type} className="group p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E5EA] transition-all">
            <div className="flex justify-between items-end mb-1.5">
              <div>
                <span className="font-bold uppercase text-xs tracking-wider mr-2" style={{ color: attr.color }}>{attr.name}</span>
                <span className="text-[#6E6E73] text-xs">Level {level} — {mastery}</span>
              </div>
              <div className="text-right">
                <span className="text-[#1D1D1F] text-xs font-semibold">{xpInCurrentLevel}/150 XP</span>
              </div>
            </div>

            {/* Progress Bar Track */}
            <div className="w-full bg-[#E5E5EA] h-2 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percent}%`,
                  backgroundColor: attr.color,
                }}
              />
            </div>
            
            <div className="text-[11px] text-[#8E8E93] italic mt-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              {attr.buffBenefit}
            </div>
          </div>
        );
      })}
    </div>
  );
};
