'use client';

// ==============================================================================
// ASCEND - GUILD SHOP ITEM CARD COMPONENT
// Apple Bright Premium Shop Card with Character Roster Support
// ==============================================================================

import React, { useState } from 'react';
import { ShopItem, ItemRarity, Archetype } from '@/types/rpg';
import { useGame } from '@/lib/context/game-context';
import { ARCHETYPES, getArchetypeUnlockProgress } from '@/lib/progression/archetypes';
import { ArchetypeAvatar } from '@/components/character/ArchetypeAvatar';
import {
  Coins,
  Palette,
  Sun,
  Terminal,
  Flame,
  ShieldCheck,
  BrainCircuit,
  Dumbbell,
  Crown,
  Infinity as InfinityIcon,
  Tag,
  Zap,
  EyeOff,
  Award,
  Hexagon,
  CircleDot,
  Sparkles,
  ShieldAlert,
  FlaskConical,
  Check,
  Lock,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const ICON_MAP: Record<string, React.ElementType> = {
  Palette,
  Sun,
  Terminal,
  Flame,
  ShieldCheck,
  BrainCircuit,
  Dumbbell,
  Crown,
  Infinity: InfinityIcon,
  Tag,
  Zap,
  EyeOff,
  Award,
  Hexagon,
  CircleDot,
  Sparkles,
  ShieldAlert,
  FlaskConical,
  Activity,
};

interface ShopCardProps {
  item: ShopItem;
}

export const ShopCard: React.FC<ShopCardProps> = ({ item }) => {
  const { profile, streak, quests, inventory, purchaseItem, equipItem, switchArchetype } = useGame();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const isCharacter = item.category === 'Character';
  const archId = isCharacter ? (item.effect_value as Archetype) : null;
  const archData = archId ? ARCHETYPES[archId] : null;
  const archProgress = archData
    ? getArchetypeUnlockProgress(archData, profile, streak, quests, inventory)
    : null;

  const IconComponent = ICON_MAP[item.icon] || Sparkles;

  const ownedItem = inventory.find((inv) => inv.item_id === item.id);
  const isOwned = Boolean(ownedItem) || (isCharacter && Boolean(archProgress?.isUnlocked));
  const isEquipped = isCharacter
    ? profile.archetype === archId
    : Boolean(ownedItem?.is_equipped);
  const canAfford = profile.gold >= item.price;

  const getRarityBadge = (rarity: ItemRarity) => {
    switch (rarity) {
      case 'Common':
        return 'text-[#6E6E73] border-[#E5E5EA] bg-[#F5F5F7]';
      case 'Rare':
        return 'text-sky-700 border-sky-200 bg-sky-50';
      case 'Epic':
        return 'text-purple-700 border-purple-200 bg-purple-50';
      case 'Legendary':
        return 'text-amber-800 border-amber-300 bg-amber-50 font-bold';
      case 'Mythic':
        return 'text-rose-700 border-rose-200 bg-rose-50 font-bold';
    }
  };

  const handlePurchase = async () => {
    if (isPurchasing || (!canAfford && !isOwned)) return;
    setIsPurchasing(true);
    setFeedback(null);
    try {
      const res = await purchaseItem(item.id);
      setFeedback(res.message);
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback('Purchase error');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleEquipOrSwitch = async () => {
    if (isCharacter && archId) {
      const res = await switchArchetype(archId);
      setFeedback(res.message);
      setTimeout(() => setFeedback(null), 2500);
      return;
    }

    if (ownedItem) {
      await equipItem(ownedItem.id);
    }
  };

  return (
    <div className="apple-card p-6 flex flex-col justify-between group relative overflow-hidden">
      <div>
        {/* Top Tag Bar */}
        <div className="flex items-center justify-between mb-4">
          <span className={`font-mono text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${getRarityBadge(item.rarity)}`}>
            {item.rarity}
          </span>
          <span className="text-[11px] font-mono text-[#6E6E73] uppercase font-medium flex items-center gap-1">
            {isCharacter && <Sparkles className="w-3 h-3 text-purple-600" />}
            <span>{item.category}</span>
          </span>
        </div>

        {/* Icon & Details */}
        <div className="flex items-start space-x-4 mb-4">
          {isCharacter && archId ? (
            <div className="shrink-0 group-hover:scale-105 transition-transform">
              <ArchetypeAvatar archetype={archId} size="lg" showGlow={isEquipped} />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] flex items-center justify-center text-purple-600 shrink-0 group-hover:scale-105 transition-transform shadow-sm">
              <IconComponent className="w-6 h-6" />
            </div>
          )}

          <div className="flex-1">
            <h3 className="font-mono text-base font-bold text-[#1D1D1F] uppercase leading-tight">
              {item.name}
            </h3>
            {isCharacter && archData && (
              <p className="text-[11px] font-mono text-purple-600 font-semibold mt-0.5">
                {archData.role}
              </p>
            )}
            <p className="text-xs font-sans text-[#6E6E73] mt-1 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>

        {/* Character Bonus Perk Highlight */}
        {isCharacter && archData && (
          <div className="mb-4 p-2.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs">
            <div className="text-[10px] font-bold text-purple-800 uppercase font-mono">
              Class Bonus Perk
            </div>
            <p className="text-[11px] text-purple-950 font-medium mt-0.5 leading-snug">
              {archData.perk}
            </p>
          </div>
        )}
      </div>

      {/* Price & Action Button / Condition */}
      <div className="pt-4 border-t border-[#E5E5EA] mt-2 space-y-3">
        {/* Character Goal Unlock Status */}
        {isCharacter && archData?.unlock_type === 'goal' && !isOwned && archProgress && (
          <div className="space-y-1.5 bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E5EA]">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#6E6E73] flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#8E8E93]" />
                <span>Goal Unlock</span>
              </span>
              <span className="font-mono text-purple-700 font-bold text-[11px]">
                {archProgress.progressLabel}
              </span>
            </div>
            <div className="h-2 w-full bg-[#E5E5EA] rounded-full overflow-hidden">
              <div
                className="h-full btn-primary-gradient rounded-full transition-all duration-300"
                style={{ width: `${archProgress.progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-[#8E8E93] leading-tight">
              {archProgress.conditionLabel}
            </p>
          </div>
        )}

        {/* Standard Gold Price Bar */}
        {(!isCharacter || archData?.unlock_type === 'gold' || item.price > 0) && (
          <div className="flex items-center justify-between font-mono">
            <span className="text-xs text-[#6E6E73] uppercase font-medium">Price</span>
            <span className="text-base font-bold text-amber-600 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-500" />
              <AnimatedCounter value={item.price} /> G
            </span>
          </div>
        )}

        {feedback && (
          <div className="text-[11px] text-purple-700 font-mono font-bold uppercase text-center bg-purple-50 p-2 rounded-xl border border-purple-200">
            {feedback}
          </div>
        )}

        {/* Action Button: Equip / Active / Buy / Goal info */}
        {isOwned ? (
          <button
            onClick={handleEquipOrSwitch}
            className={`w-full py-2.5 font-mono text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 transition-all border cursor-pointer ${
              isEquipped
                ? 'btn-primary-gradient text-white border-transparent shadow-sm'
                : 'bg-white text-[#1D1D1F] border-[#E5E5EA] hover:border-[#C7C7CC] hover:bg-[#FAF9F5]'
            }`}
          >
            {isEquipped ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{isCharacter ? 'Active Character' : 'Currently Active'}</span>
              </>
            ) : (
              <>
                <span>{isCharacter ? 'Select Character' : 'Equip Item'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        ) : isCharacter && archData?.unlock_type === 'goal' ? (
          <div className="w-full py-2.5 text-center text-xs font-semibold text-[#8E8E93] bg-[#F2F2F7] rounded-xl border border-[#E5E5EA]">
            Auto-unlocks when goal is met
          </div>
        ) : (
          <button
            onClick={handlePurchase}
            disabled={!canAfford || isPurchasing}
            className={`w-full py-2.5 font-mono text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 transition-all border ${
              canAfford
                ? 'btn-primary-gradient text-white shadow-sm cursor-pointer hover:shadow-md'
                : 'bg-[#F5F5F7] text-[#8E8E93] border-[#E5E5EA] cursor-not-allowed'
            }`}
          >
            {isPurchasing ? (
              <span>Unlocking...</span>
            ) : canAfford ? (
              <>
                <Coins className="w-4 h-4" />
                <span>{isCharacter ? `Unlock ${item.name}` : 'Buy Item'}</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Need {item.price - profile.gold} more Gold</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ShopCard;
