'use client';

// ==============================================================================
// ASCEND - GLOBAL LEADERBOARD & HALL OF ASCENSION
// Apple Bright Premium Global Leaderboard
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/context/game-context';
import { LeaderboardEntry } from '@/types/rpg';
import { ARCHETYPES } from '@/lib/progression/archetypes';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import {
  Trophy,
  Crown,
  Medal,
  Search,
  Users,
  Database,
  WifiOff,
} from 'lucide-react';

import { PageMascot } from '@/components/PageMascot';

// ─── Rank badge renderer ────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-300 border border-amber-400 text-amber-950 flex items-center justify-center font-mono font-bold text-sm shadow-sm">
        <Crown className="w-4 h-4 text-amber-950 fill-amber-950" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 flex items-center justify-center font-mono font-bold text-sm shadow-sm">
        <Medal className="w-4 h-4 text-slate-700" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-mono font-bold text-sm shadow-sm">
        <Medal className="w-4 h-4 text-amber-800" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-[#6E6E73] flex items-center justify-center font-mono font-bold text-xs">
      #{rank}
    </div>
  );
}

// ─── Leaderboard row ────────────────────────────────────────────────────────
function LeaderboardRow({
  entry,
  index,
  isTop3Initial,
}: {
  entry: LeaderboardEntry;
  index: number;
  isTop3Initial: boolean;
}) {
  const archMeta = ARCHETYPES[entry.archetype] || ARCHETYPES['Cyber Mage'];

  return (
    <motion.div
      layout
      layoutId={`lb-row-${entry.user_id}`}
      initial={isTop3Initial ? { opacity: 0, y: 18 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={
        isTop3Initial
          ? { delay: index * 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] }
          : { type: 'spring', stiffness: 400, damping: 35 }
      }
      className={`hover:bg-purple-50/30 transition-colors border-b border-[#E5E5EA] ${
        entry.rank === 1 ? 'bg-amber-50/20' : ''
      }`}
    >
      {/* ── Desktop layout (≥640px): grid row ── */}
      <div className="hidden sm:grid grid-cols-12 gap-3 px-6 py-4 items-center font-mono">
        {/* Rank */}
        <div className="col-span-1 flex justify-center">
          <RankBadge rank={entry.rank} />
        </div>

        {/* Identity */}
        <div className="col-span-5 flex items-center space-x-4 min-w-0">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-base font-mono font-extrabold text-white shrink-0 shadow-sm"
            style={{
              backgroundColor: archMeta.color || '#7C3AED',
            }}
          >
            {entry.username.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <span className="font-sans text-base font-bold text-[#1D1D1F] truncate block">
              {entry.username}
            </span>
            <span className="text-[11px] text-purple-600 font-mono font-medium uppercase truncate block mt-0.5">
              {entry.title}
            </span>
          </div>
        </div>

        {/* Archetype */}
        <div className="col-span-3 flex items-center">
          <span className="text-[11px] font-mono font-semibold uppercase px-3 py-1 rounded-full border border-[#E5E5EA] bg-[#F5F5F7] text-[#1D1D1F]">
            {entry.archetype}
          </span>
        </div>

        {/* Level */}
        <div className="col-span-1 text-center">
          <span className="font-mono text-lg font-bold text-purple-600">
            {entry.level}
          </span>
        </div>

        {/* XP + Trophies */}
        <div className="col-span-2 text-right">
          <div className="font-mono text-base font-bold text-[#1D1D1F]">
            <AnimatedCounter value={entry.total_xp} /> XP
          </div>
          <div className="text-[11px] text-amber-600 font-mono uppercase font-semibold flex items-center justify-end gap-1 mt-0.5">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>{entry.achievement_count} Trophies</span>
          </div>
        </div>
      </div>

      {/* ── Mobile layout (<640px): stacked card ── */}
      <div className="sm:hidden px-4 py-4 flex items-center gap-4 font-mono">
        <RankBadge rank={entry.rank} />
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-base font-mono font-bold text-white shrink-0 shadow-sm"
          style={{
            backgroundColor: archMeta.color || '#7C3AED',
          }}
        >
          {entry.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-sans text-sm font-bold text-[#1D1D1F] truncate">
              {entry.username}
            </span>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border border-[#E5E5EA] bg-[#F5F5F7] text-purple-600 shrink-0">
              {entry.archetype.split(' ')[1] || entry.archetype}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="text-purple-600 font-bold">LVL {entry.level}</span>
            <span className="text-[#6E6E73]">
              <AnimatedCounter value={entry.total_xp} /> XP
            </span>
            <span className="text-amber-600 flex items-center gap-0.5 font-bold">
              <Trophy className="w-3 h-3" /> {entry.achievement_count}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main page component ────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const { profile, achievements, isConfigured } = useGame();

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [currentUserStanding, setCurrentUserStanding] = useState<LeaderboardEntry | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArchetype, setSelectedArchetype] = useState<string>('All');
  const [isInitialMount, setIsInitialMount] = useState<boolean>(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setIsLoading(true);
      try {
        if (isConfigured) {
          const res = await fetch('/api/leaderboard?limit=50');
          if (res.ok) {
            const data = await res.json();
            setLeaderboardData(data.leaderboard || []);
            setCurrentUserStanding(data.currentUserEntry || null);
            setTotalCount(data.totalParticipants || (data.leaderboard ? data.leaderboard.length : 0));
          } else {
            setLeaderboardData([]);
            setTotalCount(0);
          }
        } else {
          // Supabase unconfigured or local demo mode — display ONLY current user profile if available, zero fake names
          if (profile && profile.username) {
            const userEntry: LeaderboardEntry = {
              rank: 1,
              user_id: profile.user_id || 'demo-user',
              username: profile.username,
              title: profile.title || 'Initiate Seeker',
              archetype: profile.archetype,
              level: profile.level || 1,
              total_xp: profile.xp || 0,
              achievement_count: achievements.length,
              is_current_user: true,
            };
            setLeaderboardData([userEntry]);
            setCurrentUserStanding(userEntry);
            setTotalCount(1);
          } else {
            setLeaderboardData([]);
            setTotalCount(0);
          }
        }
      } catch {
        setLeaderboardData([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
        setIsInitialMount(false);
      }
    }

    fetchLeaderboard();
  }, [isConfigured, profile, achievements]);

  const filteredData = leaderboardData.filter((entry) => {
    if (selectedArchetype !== 'All' && entry.archetype !== selectedArchetype) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        entry.username.toLowerCase().includes(q) ||
        entry.title.toLowerCase().includes(q) ||
        entry.archetype.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories = ['All', 'Cyber Mage', 'Iron Titan', 'Shadow Rogue', 'Bio Hacker', 'Quantum Monk'];

  return (
    <div className="space-y-10 pb-16 pt-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* HEADER HUD */}
      <div className="apple-card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative">
        <div className="absolute -top-3 right-6 hidden sm:block">
          <PageMascot animationType="hanging" size={88} position="top-edge" />
        </div>
        <div className="flex items-center space-x-5 text-center md:text-left">
          <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600 shrink-0 shadow-sm">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-700">
              <Crown className="w-3.5 h-3.5" />
              <span>Top Rankings</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
              Community Leaderboard
            </h1>
            <p className="text-xs sm:text-sm font-sans text-[#6E6E73] mt-1 max-w-xl">
              See rankings, compare progress, and celebrate milestones with other players.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 font-mono text-xs text-[#6E6E73]">
          <div className="px-4 py-2 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] flex items-center space-x-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="font-semibold text-[#1D1D1F]">{totalCount} Active Players</span>
          </div>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#E5E5EA] pb-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search player, title..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E5EA] rounded-2xl text-[#1D1D1F] placeholder-[#8E8E93] font-mono text-xs focus:outline-none focus:border-purple-500 shadow-sm transition-colors"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedArchetype(cat)}
                className={`px-4 py-1.5 rounded-full font-mono text-xs font-semibold uppercase tracking-wider transition-all border shrink-0 cursor-pointer ${
                  selectedArchetype === cat
                    ? 'btn-primary-gradient text-white shadow-sm'
                    : 'bg-white text-[#6E6E73] border-[#E5E5EA] hover:border-[#C7C7CC] hover:text-[#1D1D1F]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="apple-card overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 gap-3 px-6 py-3.5 bg-[#F5F5F7] border-b border-[#E5E5EA] font-mono text-xs font-bold text-[#6E6E73] uppercase tracking-wider">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-5">Player</div>
          <div className="col-span-3">Archetype</div>
          <div className="col-span-1 text-center">Level</div>
          <div className="col-span-2 text-right">Total XP</div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-[#6E6E73] font-mono text-xs">
            Loading global rankings...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-20 text-center text-[#6E6E73] font-mono text-xs">
            {leaderboardData.length === 0
              ? 'No players ranked yet. Complete quests to claim rank #1!'
              : 'No players match the search criteria.'}
          </div>
        ) : (
          <div>
            {filteredData.map((entry, index) => (
              <LeaderboardRow
                key={entry.user_id}
                entry={entry}
                index={index}
                isTop3Initial={isInitialMount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
