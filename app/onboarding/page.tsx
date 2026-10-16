'use client';

// ==============================================================================
// ASCEND - ONBOARDING & ARCHETYPE SELECTION SCREEN
// Apple Bright Premium Onboarding with Interactive Avatars, Simple Language & Auto-Scroll
// ==============================================================================

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ARCHETYPE_LIST } from '@/lib/progression/archetypes';
import { useGame } from '@/lib/context/game-context';
import { Archetype } from '@/types/rpg';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Zap,
  Check,
  ChevronDown,
  User,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { ArchetypeAvatar } from '@/components/character/ArchetypeAvatar';
import { PageMascot } from '@/components/PageMascot';

import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export default function OnboardingPage() {
  const router = useRouter();
  const { loginAsDemoUser, updateUserProfile } = useGame();

  const [username, setUsername] = useState('');
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype>('Cyber Mage');
  const [isInitializing, setIsInitializing] = useState(false);

  // Prepopulate username from authenticated user if available
  React.useEffect(() => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          const defaultName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.user_metadata?.username ||
            user.email?.split('@')[0];
          if (defaultName) {
            setUsername(defaultName);
          }
        }
      });
    }
  }, []);

  const archetypesRef = useRef<HTMLDivElement>(null);
  const initializeRef = useRef<HTMLDivElement>(null);

  const activeArch = ARCHETYPE_LIST.find((a) => a.id === selectedArchetype) || ARCHETYPE_LIST[0];

  // Smooth scroll handler for moving to archetype selection
  const scrollToArchetypes = () => {
    archetypesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Smooth scroll handler for moving to initialize action
  const scrollToInitialize = () => {
    setTimeout(() => {
      initializeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  };

  const handleSelectArchetype = (archId: Archetype) => {
    setSelectedArchetype(archId);
    scrollToInitialize();
  };

  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      scrollToArchetypes();
    }
  };

  const handleInitialize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || isInitializing) return;

    setIsInitializing(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          await supabase.auth.updateUser({
            data: {
              username: username.trim(),
              archetype: selectedArchetype,
            },
          });

          // Using upsert instead of update to handle new users without DB triggers
          await supabase
            .from('profiles')
            .upsert({
              user_id: user.id,
              username: username.trim(),
              archetype: selectedArchetype,
              avatar_url: ARCHETYPE_LIST.find(a => a.id === selectedArchetype)?.avatar || '/avatars/mage.png',
              level: 1,
              xp: 0,
              gold: 150,
              title: 'Novice Seeker'
            }, { onConflict: 'user_id' });

          await supabase.from('attributes').upsert({ user_id: user.id }, { onConflict: 'user_id' });
          await supabase.from('streaks').upsert({ user_id: user.id }, { onConflict: 'user_id' });
        }
      }

      loginAsDemoUser(selectedArchetype);
      await updateUserProfile({
        username: username.trim(),
        archetype: selectedArchetype,
      });
      window.location.href = '/dashboard';
    } catch {
      setIsInitializing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-10 px-4 sm:px-6">
      {/* Top Navigation Bar with Back Button */}
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && window.history.length > 1) {
              router.back();
            } else {
              router.push('/');
            }
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white border border-[#E5E5EA] text-[#1D1D1F] hover:bg-[#F5F5F7] hover:border-purple-300 text-xs font-mono font-bold shadow-sm transition-all cursor-pointer group"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-4 h-4 text-purple-600 group-hover:-translate-x-1 transition-transform" />
          <span>BACK</span>
        </button>

        <Link href="/" className="inline-flex hover:opacity-90 transition-opacity">
          <Logo size="lg" />
        </Link>

        {/* Spacer to keep logo perfectly centered */}
        <div className="w-20 hidden sm:block" />
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 relative">
        <div className="absolute -top-6 right-0 hidden sm:block">
          <PageMascot animationType="hanging" size={88} position="top-edge" />
        </div>
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-mono font-bold uppercase tracking-wider rounded-full mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Quick Setup</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] tracking-tight mb-3">
          Choose Your Character Style
        </h1>
        <p className="text-sm text-[#6E6E73] font-sans leading-relaxed">
          Pick a playstyle that matches your daily habits and goals. Each class gives you bonus XP and 3 starter habits to help you succeed.
        </p>
      </div>

      <form onSubmit={handleInitialize} className="space-y-10">
        {/* Username input Section */}
        <div className="max-w-md mx-auto text-center">
          <label className="block text-xs font-mono font-bold text-[#1D1D1F] uppercase tracking-wider mb-2 text-center flex items-center justify-center gap-1.5">
            <User className="w-3.5 h-3.5 text-purple-600" />
            <span>Choose Your Username / Hero Name</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleUsernameKeyDown}
              required
              className="w-full text-center px-4 py-3.5 bg-white border border-[#E5E5EA] text-[#1D1D1F] rounded-2xl font-bold text-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 shadow-sm transition-all"
              placeholder="e.g., Kaelen Vance"
            />
          </div>

          {/* Interactive Guidance Banner */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/80 rounded-full cursor-pointer hover:border-purple-400 transition-all shadow-sm group"
            onClick={scrollToArchetypes}
          >
            <span className="text-xs font-medium text-purple-700 group-hover:text-purple-900 transition-colors">
              👇 Choose your character class below to get started
            </span>
            <ChevronDown className="w-4 h-4 text-purple-600 group-hover:translate-y-0.5 transition-transform" />
          </motion.div>
        </div>

        {/* Archetype Cards Grid */}
        <div ref={archetypesRef} id="archetypes-section" className="pt-2 scroll-mt-6">
          <div className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1D1D1F]">
                Select Your Class ({ARCHETYPE_LIST.length} Available)
              </h2>
            </div>
            <span className="text-xs text-[#6E6E73] font-medium hidden sm:inline-block">
              Tap any card to select
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARCHETYPE_LIST.map((arch) => {
              const isSelected = selectedArchetype === arch.id;

              return (
                <motion.div
                  key={arch.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectArchetype(arch.id)}
                  className={`cursor-pointer p-6 rounded-3xl border transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'apple-card border-purple-500 ring-2 ring-purple-500/30 bg-gradient-to-b from-white to-purple-50/30 shadow-lg'
                      : 'bg-white border-[#E5E5EA] hover:border-purple-200 hover:shadow-md'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full btn-primary-gradient text-white flex items-center justify-center font-bold shadow-md ring-4 ring-white z-20">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}

                  <div>
                    {/* Header: Role Tag + Character Avatar Portrait */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#E5E5EA] mb-2 bg-[#F5F5F7] text-[#1D1D1F]">
                          {arch.role}
                        </div>
                        <h3 className="text-xl font-extrabold text-[#1D1D1F] tracking-tight">{arch.name}</h3>
                        <p className="text-[11px] text-purple-600 font-mono font-bold uppercase tracking-wide">
                          {arch.title}
                        </p>
                      </div>

                      {/* Prominent High-Fidelity Character Avatar Visual */}
                      <div className="shrink-0">
                        <ArchetypeAvatar
                          archetype={arch.id}
                          size="lg"
                          showGlow={isSelected}
                          animate={isSelected}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-[#6E6E73] leading-relaxed mb-5 font-sans min-h-[48px]">
                      {arch.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E5E5EA] space-y-2">
                    <div className="text-xs text-[#1D1D1F] font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>{arch.perk}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] font-mono text-[#6E6E73]">
                      <span>
                        Primary: <strong className="text-[#1D1D1F]">{arch.primaryAttribute}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Secondary: <strong className="text-[#1D1D1F]">{arch.secondaryAttribute}</strong>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Selected Archetype Starter Quests Preview */}
        <div className="apple-card p-6 sm:p-8 max-w-3xl mx-auto relative overflow-hidden border border-purple-100 shadow-md">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#E5E5EA]">
            <div className="flex items-center space-x-3">
              <ArchetypeAvatar archetype={selectedArchetype} size="md" showGlow={true} />
              <div>
                <h4 className="text-base font-bold text-[#1D1D1F] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span>Starter Habits: {activeArch.name}</span>
                </h4>
                <p className="text-xs text-[#6E6E73] font-sans">
                  These 3 starter habits will be added to your quest board immediately
                </p>
              </div>
            </div>
            <span className="text-[11px] text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full font-mono font-semibold hidden sm:inline-block">
              Starter Pack
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeArch.starterQuests.map((q, idx) => (
              <div key={idx} className="p-4 bg-[#F5F5F7] hover:bg-white rounded-2xl border border-[#E5E5EA] transition-colors">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                  {q.difficulty}
                </span>
                <div className="text-xs font-bold text-[#1D1D1F] mt-2 leading-snug">{q.title}</div>
                <div className="text-[11px] font-mono text-purple-600 mt-1.5 font-semibold">+{q.attribute} XP</div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit button & Auto-Scroll Target */}
        <div ref={initializeRef} id="initialize-section" className="text-center pt-2 pb-6 scroll-mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isInitializing || !username.trim()}
            className="px-10 py-4 btn-primary-gradient text-white font-bold text-sm uppercase font-mono tracking-wider rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center space-x-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span>{isInitializing ? 'Starting Journey...' : `Start Journey as ${activeArch.name}`}</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <p className="text-xs text-[#6E6E73] mt-2 font-mono">
            You&apos;re all set to begin as <strong className="text-[#1D1D1F]">{username || 'Hero'}</strong> ({activeArch.name})
          </p>
        </div>
      </form>
    </div>
  );
}
