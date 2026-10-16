'use client';

// ==============================================================================
// ASCEND - QUEST MANAGEMENT BOARD
// Apple-Inspired Bright Premium Quest Manager
// ==============================================================================

import React, { useState } from 'react';
import { useGame } from '@/lib/context/game-context';
import { QuestCard } from '@/components/quests/QuestCard';
import { CreateQuestModal } from '@/components/modals/CreateQuestModal';
import { PageMascot } from '@/components/PageMascot';
import { Search, Plus, Filter, Flame, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { isQuestCompletedOnDate, getTodayDateString } from '@/lib/progression/schedule';
import { AmbientBackground } from '@/components/ui/AmbientBackground';

export default function QuestsPage() {
  const { quests } = useGame();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Active' | 'Completed'>('Active');
  const [sortBy, setSortBy] = useState<'newest' | 'xp' | 'gold'>('newest');

  const todayIso = getTodayDateString();

  const filteredQuests = quests
    .filter((q) => {
      const isDone = isQuestCompletedOnDate(q, todayIso);
      if (selectedStatus === 'Active' && isDone) return false;
      if (selectedStatus === 'Completed' && !isDone) return false;
      if (selectedCategory !== 'All' && q.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          q.title.toLowerCase().includes(query) ||
          (q.description && q.description.toLowerCase().includes(query)) ||
          q.attribute.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'xp') return b.xp_reward - a.xp_reward;
      if (sortBy === 'gold') return b.gold_reward - a.gold_reward;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const totalCompleted = quests.filter((q) => q.status === 'Completed').length;
  const completionRate = quests.length > 0 ? Math.round((totalCompleted / quests.length) * 100) : 0;

  const categories = ['All', 'Work', 'Fitness', 'Learning', 'Habit', 'Creative', 'Social'];

  return (
    <div className="space-y-8 pb-16 pt-2">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5EA] pb-5">
        <div className="flex items-center gap-4">
          <PageMascot
            animationType="cycling"
            size={84}
            showBadge={true}
            badgeText="Quests in Motion"
            className="shrink-0"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] tracking-tight">
              Your Quests
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6E73] mt-0.5">
              Track and complete your daily habits, projects, and goals.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 btn-primary-gradient font-semibold text-xs rounded-full flex items-center space-x-1.5 cursor-pointer shadow-sm hover:shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Quest</span>
        </button>
      </div>

      {/* 2. TOP STATS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="apple-card p-6 text-center sm:text-left">
          <div className="text-3xl font-bold text-[#1D1D1F]">{quests.length}</div>
          <div className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider mt-1">Total Quests</div>
        </div>
        <div className="apple-card p-6 text-center sm:text-left">
          <div className="text-3xl font-bold text-[#C9A227]">
            {quests.filter((q) => q.status === 'Active').length}
          </div>
          <div className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider mt-1">Active Quests</div>
        </div>
        <div className="apple-card p-6 text-center sm:text-left">
          <div className="text-3xl font-bold text-[#7C3AED]">{totalCompleted}</div>
          <div className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider mt-1">Completed</div>
        </div>
        <div className="apple-card p-6 text-center sm:text-left">
          <div className="text-3xl font-bold text-[#2E7D32]">{completionRate}%</div>
          <div className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider mt-1">Completion Rate</div>
        </div>
      </div>

      {/* 2. SEARCH & CONTROLS */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#E5E5EA] pb-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#8E8E93] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quests or attributes..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#E5E5EA] rounded-full text-[#1D1D1F] placeholder-[#8E8E93] text-sm focus:outline-none focus:border-[#7C3AED] shadow-sm"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center space-x-2">
              {(['Active', 'Completed', 'All'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                    selectedStatus === st
                      ? 'bg-[#F2F2F7] text-[#7C3AED] border-[#7C3AED]/40'
                      : 'bg-white text-[#6E6E73] border-[#E5E5EA] hover:text-[#1D1D1F]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 btn-primary-gradient font-semibold text-xs rounded-full flex items-center space-x-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>New Quest</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                selectedCategory === cat
                  ? 'btn-primary-gradient border-transparent'
                  : 'bg-white text-[#6E6E73] border-[#E5E5EA] hover:border-[#D1D1D6] hover:text-[#1D1D1F]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. QUEST LIST */}
      <div className="space-y-3">
        {filteredQuests.length === 0 ? (
          <div className="py-20 text-center text-[#6E6E73] apple-card bg-white relative overflow-hidden">
            <AmbientBackground variant="card" />
            <p className="font-semibold text-base text-[#1D1D1F] relative z-10">No quests found</p>
            <p className="text-xs mt-1 text-[#8E8E93] relative z-10">Adjust your filters or create a new quest to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isCompletedOverride={isQuestCompletedOnDate(quest, todayIso)}
              />
            ))}
          </div>
        )}
      </div>

      <CreateQuestModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}
