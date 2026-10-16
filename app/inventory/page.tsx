'use client';

// ==============================================================================
// ASCEND - TACTICAL LOADOUT & INVENTORY
// Apple Bright Premium Loadout & Inventory
// ==============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useGame } from '@/lib/context/game-context';
import { PageMascot } from '@/components/PageMascot';
import {
  Package,
  ShoppingBag,
  Check,
  Palette,
  Tag,
  ShieldAlert,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function InventoryPage() {
  const { inventory, equipItem, profile, streak } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Theme', 'Badge', 'Title', 'Frame', 'Consumable'];

  const filteredInventory = inventory.filter((inv) => {
    if (selectedCategory === 'All') return true;
    return inv.item?.category === selectedCategory;
  });

  return (
    <div className="space-y-10 pb-16 pt-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* 1. TACTICAL LOADOUT DOCK */}
      <div className="apple-card p-6 sm:p-8 relative">
        <div className="absolute -top-3 right-8 hidden sm:block">
          <PageMascot animationType="hanging" size={88} position="top-edge" />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#E5E5EA]">
          <div className="flex items-center space-x-5 text-center md:text-left">
            <div className="w-14 h-14 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-center text-purple-600 shrink-0 shadow-sm">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#1D1D1F] tracking-tight">
                Inventory & Items
              </h1>
              <p className="text-xs sm:text-sm font-sans text-[#6E6E73] mt-1 max-w-xl">
                Manage your equipped themes, badges, titles, and items.
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="px-6 py-3 btn-primary-gradient text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Visit Rewards Shop</span>
          </Link>
        </div>

        {/* 3 EQUIPPED GEAR SLOTS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E5EA] flex items-center justify-center text-purple-600 shrink-0 shadow-sm">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-[#6E6E73] uppercase font-medium">Active Theme</div>
              <div className="font-mono text-base font-bold text-[#1D1D1F] uppercase mt-0.5">{profile.theme}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E5EA] flex items-center justify-center text-sky-600 shrink-0 shadow-sm">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-[#6E6E73] uppercase font-medium">Active Title</div>
              <div className="font-mono text-base font-bold text-[#1D1D1F] uppercase mt-0.5">{profile.title}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E5EA] flex items-center justify-center text-amber-600 shrink-0 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-[#6E6E73] uppercase font-medium">Streak Freeze Vault</div>
              <div className="font-mono text-base font-bold text-amber-600 uppercase mt-0.5">
                {streak.streak_freeze_count} / 3 Ready
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY TABS */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-[#E5E5EA]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shrink-0 border cursor-pointer ${
              selectedCategory === cat
                ? 'btn-primary-gradient text-white shadow-sm'
                : 'bg-white text-[#6E6E73] border-[#E5E5EA] hover:border-[#C7C7CC] hover:text-[#1D1D1F]'
            }`}
          >
            {cat}s
          </button>
        ))}
      </div>

      {/* 3. INVENTORY ITEMS GRID */}
      {filteredInventory.length === 0 ? (
        <div className="py-20 text-center apple-card">
          <Package className="w-12 h-12 text-[#8E8E93] mx-auto mb-4" />
          <h3 className="font-mono text-base font-bold text-[#1D1D1F] uppercase">No items yet</h3>
          <p className="text-xs font-sans text-[#6E6E73] mt-2 max-w-md mx-auto">
            Complete quests to earn gold, then unlock themes, badges, and titles in the Rewards Shop.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center space-x-2 px-6 py-3 btn-primary-gradient text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Visit Rewards Shop</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInventory.map((inv) => {
            if (!inv.item) return null;
            const item = inv.item;
            const isEquipped = inv.is_equipped || (item.category === 'Theme' && profile.theme === item.effect_value);

            return (
              <div
                key={inv.id}
                className="apple-card p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full border border-purple-200 bg-purple-50 text-purple-700">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono text-[#6E6E73] uppercase font-medium">
                      Acquired {formatDate(inv.acquired_at)}
                    </span>
                  </div>

                  <h3 className="font-mono text-base font-bold text-[#1D1D1F] uppercase leading-tight">{item.name}</h3>
                  <p className="text-xs font-sans text-[#6E6E73] mt-2 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-4 border-t border-[#E5E5EA] mt-6">
                  {item.category !== 'Consumable' ? (
                    <button
                      onClick={() => equipItem(inv.id)}
                      className={`w-full py-2.5 font-mono text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 transition-all border cursor-pointer ${
                        isEquipped
                          ? 'btn-primary-gradient text-white border-transparent shadow-sm'
                          : 'bg-white text-[#1D1D1F] border-[#E5E5EA] hover:border-[#C7C7CC]'
                      }`}
                    >
                      {isEquipped ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Equipped</span>
                        </>
                      ) : (
                        <span>Equip Item</span>
                      )}
                    </button>
                  ) : (
                    <div className="text-center font-mono text-xs font-bold uppercase text-amber-800 bg-amber-50 py-2.5 rounded-xl border border-amber-200">
                      Active In Vault ({inv.quantity || 1}x)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

