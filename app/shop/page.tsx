'use client';

// ==============================================================================
// ASCEND - GUILD SHOP MARKETPLACE
// Apple Bright Premium Guild Shop
// ==============================================================================

import React, { useState } from 'react';
import { useGame } from '@/lib/context/game-context';
import { ShopCard } from '@/components/shop/ShopCard';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { PageMascot } from '@/components/PageMascot';
import {
  ShoppingBag,
  Coins,
  Crown,
  Sparkles,
} from 'lucide-react';

export default function ShopPage() {
  const { shopItems, profile, purchaseItem, inventory } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Characters', 'Theme', 'Badge', 'Title', 'Frame', 'Consumable'];

  const filteredItems = shopItems.filter((item) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Characters') return item.category === 'Character';
    return item.category === selectedCategory;
  });

  // Featured Item Spotlight
  const featuredItem = shopItems.find((i) => i.rarity === 'Legendary' || i.rarity === 'Epic') || shopItems[0];
  const isFeaturedOwned = inventory.some((inv) => inv.item_id === featuredItem.id);

  return (
    <div className="space-y-10 pb-16 pt-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* 1. TOP TREASURY HUD */}
      <div className="apple-card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative">
        <div className="absolute -top-3 right-8 hidden sm:block">
          <PageMascot animationType="hanging" size={88} position="top-edge" />
        </div>
        <div className="flex items-center space-x-5 text-center md:text-left">
          <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600 shrink-0 shadow-sm">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1D1D1F] tracking-tight">
              Rewards Shop
            </h1>
            <p className="text-xs sm:text-sm font-sans text-[#6E6E73] mt-1 max-w-xl">
              Spend your earned gold on new themes, titles, streak freezes, and cosmetic badges.
            </p>
          </div>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] flex items-center space-x-4 shrink-0">
          <Coins className="w-6 h-6 text-amber-500" />
          <div>
            <div className="text-[11px] font-mono text-[#6E6E73] uppercase font-medium">Gold Balance</div>
            <div className="font-mono text-xl font-bold text-[#1D1D1F] mt-0.5">
              <AnimatedCounter value={profile.gold} /> G
            </div>
          </div>
        </div>
      </div>

      {/* 2. FEATURED ITEM HERO BANNER */}
      {featuredItem && (
        <div className="apple-card p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-amber-50/50 via-white to-purple-50/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-100/80 border border-amber-200 rounded-full text-amber-800 font-mono text-xs font-bold uppercase">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>Featured Reward</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight">{featuredItem.name}</h2>
              <p className="text-xs sm:text-sm font-sans text-[#6E6E73] max-w-xl leading-relaxed">
                {featuredItem.description}
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end space-y-3 shrink-0">
              <div className="text-center md:text-right">
                <div className="text-[11px] font-mono text-[#6E6E73] uppercase font-medium">Price</div>
                <div className="font-mono text-2xl font-bold text-amber-600 flex items-center justify-center md:justify-end gap-1.5 mt-0.5">
                  <Coins className="w-5 h-5 text-amber-500" />
                  <span>{featuredItem.price} G</span>
                </div>
              </div>

              {!isFeaturedOwned && (
                <button
                  onClick={() => purchaseItem(featuredItem.id)}
                  disabled={profile.gold < featuredItem.price}
                  className="px-6 py-3 btn-primary-gradient text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Item
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. CATEGORY TABS */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-[#E5E5EA]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer shrink-0 ${
              selectedCategory === cat
                ? 'btn-primary-gradient text-white shadow-sm'
                : 'bg-white text-[#6E6E73] border-[#E5E5EA] hover:border-[#C7C7CC] hover:text-[#1D1D1F]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4. SHOP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <ShopCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
