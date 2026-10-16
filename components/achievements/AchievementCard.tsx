'use client';

// ==============================================================================
// ASCEND - TROPHY & ACHIEVEMENT CARD COMPONENT
// Apple Bright Premium Achievement Tile
// ==============================================================================

import React, { useState } from 'react';
import { Achievement, UserAchievement } from '@/types/rpg';
import { useGame } from '@/lib/context/game-context';
import {
  Zap,
  TrendingUp,
  Award,
  Crown,
  CheckCircle2,
  Swords,
  Flame,
  Sparkles,
  Trophy,
  Brain,
  Activity,
  Coins,
  ShoppingBag,
  Infinity as InfinityIcon,
  Check,
  Lock,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

const ICON_MAP: Record<string, React.ElementType> = {
  Zap,
  TrendingUp,
  Award,
  Crown,
  CheckCircle2,
  Swords,
  Flame,
  Sparkles,
  Trophy,
  Brain,
  Activity,
  Coins,
  ShoppingBag,
  Infinity: InfinityIcon,
};

interface AchievementCardProps {
  achievement: Achievement;
  userAchievement?: UserAchievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, userAchievement }) => {
  const { claimAchievementReward, quests, streak, profile, attributes, inventory } = useGame();
  const [isClaiming, setIsClaiming] = useState(false);

  const isUnlocked = Boolean(userAchievement);
  const isClaimed = Boolean(userAchievement?.is_claimed);

  const IconComponent = ICON_MAP[achievement.icon] || Trophy;

  let currentMetricValue = 0;
  switch (achievement.target_metric) {
    case 'quests_completed':
      currentMetricValue = quests.filter((q) => q.status === 'Completed').length;
      break;
    case 'level_reached':
      currentMetricValue = profile.level;
      break;
    case 'streak_days':
      currentMetricValue = Math.max(streak.current_streak, streak.longest_streak);
      break;
    case 'attribute_intellect':
      currentMetricValue = attributes.intellect_xp || 0;
      break;
    case 'attribute_physical':
      currentMetricValue = (attributes.strength_xp || 0) + (attributes.vitality_xp || 0);
      break;
    case 'gold_balance':
      currentMetricValue = profile.gold;
      break;
    case 'items_purchased':
      currentMetricValue = inventory.length;
      break;
  }

  const progressPercent = Math.min(100, Math.floor((currentMetricValue / achievement.threshold) * 100));

  const handleClaim = async () => {
    if (isClaiming || isClaimed || !isUnlocked) return;
    setIsClaiming(true);
    try {
      await claimAchievementReward(achievement.code);
    } catch {
      // Handled
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div
      className={`apple-card p-6 flex flex-col justify-between transition-all ${
        isUnlocked
          ? isClaimed
            ? 'bg-white'
            : 'bg-gradient-to-br from-amber-50/40 via-white to-purple-50/30 border-amber-300'
          : 'bg-[#F5F5F7] opacity-60'
      }`}
    >
      <div>
        {/* Category & Status Bar */}
        <div className="flex items-center justify-between mb-4 font-mono text-xs">
          <span className="font-semibold uppercase px-2.5 py-0.5 rounded-full border border-[#E5E5EA] bg-[#F5F5F7] text-[#1D1D1F]">
            {achievement.category}
          </span>
          {isUnlocked ? (
            <span className="font-bold uppercase text-amber-800 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-amber-200 bg-amber-50">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Unlocked {formatDate(userAchievement?.unlocked_at)}</span>
            </span>
          ) : (
            <span className="font-semibold uppercase text-[#8E8E93] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Locked</span>
            </span>
          )}
        </div>

        {/* Icon & Details */}
        <div className="flex items-start space-x-4 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
              isUnlocked
                ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-sm'
                : 'bg-[#E5E5EA] border-transparent text-[#8E8E93]'
            }`}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          <div>
            <h3 className="font-mono text-base font-bold text-[#1D1D1F] uppercase leading-tight">
              {achievement.title}
            </h3>
            <p className="text-xs font-sans text-[#6E6E73] mt-1 leading-relaxed">
              {achievement.description}
            </p>
          </div>
        </div>

        {/* Progress bar if locked */}
        {!isUnlocked && (
          <div className="my-4 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] text-[#6E6E73] uppercase font-medium mb-1.5">
              <span>Goal Progress</span>
              <span className="font-bold text-[#1D1D1F]">
                {currentMetricValue} / {achievement.threshold} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-[#E5E5EA] rounded-full h-2 overflow-hidden">
              <div
                className="btn-primary-gradient h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Rewards & Claim Action */}
      <div className="pt-4 border-t border-[#E5E5EA] flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-4">
        <div className="flex items-center space-x-4 font-mono text-xs font-bold">
          <span className="text-purple-600 flex items-center gap-1.5">
            <Zap className="w-4 h-4" /> +{achievement.reward_xp} XP
          </span>
          <span className="text-amber-600 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-500" /> +{achievement.reward_gold} G
          </span>
        </div>

        {isUnlocked && (
          <div className="shrink-0">
            {isClaimed ? (
              <span className="font-mono text-xs font-bold uppercase text-[#6E6E73] flex items-center gap-1.5">
                <Check className="w-4 h-4 stroke-[3] text-emerald-600" /> Claimed
              </span>
            ) : (
              <button
                onClick={handleClaim}
                disabled={isClaiming}
                className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer w-full sm:w-auto"
              >
                {isClaiming ? 'Claiming...' : 'Claim Reward'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

