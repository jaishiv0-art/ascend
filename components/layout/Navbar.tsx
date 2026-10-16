'use client';

// ==============================================================================
// ASCEND - APPLE-INSPIRED NAVIGATION BAR
// Clean, bright floating header with soft shadows and precise contrast
// ==============================================================================

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { usePathname } from 'next/navigation';
import { useGame } from '@/lib/context/game-context';
import { calculateLevelProgress } from '@/lib/progression/levels';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import {
  Flame,
  Coins,
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  Settings,
  ChevronDown,
  Package,
  BarChart3,
  Trophy,
  LogOut,
} from 'lucide-react';
import { ARCHETYPE_LIST } from '@/lib/progression/archetypes';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { profile, streak, toggleSound, switchArchetype, isDemoUser, isLoaded, logout } = useGame();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [archetypeDropdownOpen, setArchetypeDropdownOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const archetypeDropdownRef = useRef<HTMLDivElement>(null);

  const progress = calculateLevelProgress(profile.xp);

  const primaryNavLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/quests', label: 'Quests' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/character', label: 'Character' },
    { href: '/shop', label: 'Shop' },
    { href: '/leaderboard', label: 'Leaderboard' },
  ];

  const secondaryNavLinks = [
    { href: '/inventory', label: 'Inventory', icon: Package },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/achievements', label: 'Trophies & Badges', icon: Trophy },
  ];

  const allNavLinks = [
    ...primaryNavLinks,
    ...secondaryNavLinks,
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const isSecondaryActive = secondaryNavLinks.some((l) => pathname === l.href);

  // Close dropdowns on route change or click outside
  useEffect(() => {
    setMoreMenuOpen(false);
    setArchetypeDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
      if (archetypeDropdownRef.current && !archetypeDropdownRef.current.contains(event.target as Node)) {
        setArchetypeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#E5E5EA] py-3 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center min-w-0">
          <Link
            href="/"
            className="flex items-center group transition-transform hover:opacity-90 mr-6 lg:mr-8 xl:mr-10 shrink-0"
            title="ASCEND Home"
          >
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation (Visible at xl: 1280px+) */}
          {!isDemoUser && (
            <nav className="hidden xl:flex items-center gap-5 2xl:gap-6 text-sm font-medium text-[#6E6E73] whitespace-nowrap overflow-visible">
              {primaryNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-colors py-1 shrink-0 ${
                      isActive
                        ? 'text-[#1D1D1F] font-semibold border-b-2 border-[#7C3AED]'
                        : 'hover:text-[#1D1D1F]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* "More" Dropdown Menu */}
              <div className="relative shrink-0" ref={moreDropdownRef}>
                <button
                  onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                  className={`flex items-center gap-1 py-1 transition-colors cursor-pointer shrink-0 ${
                    isSecondaryActive
                      ? 'text-[#1D1D1F] font-semibold border-b-2 border-[#7C3AED]'
                      : 'hover:text-[#1D1D1F]'
                  }`}
                >
                  <span>Progress</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreMenuOpen ? 'rotate-180 text-[#7C3AED]' : ''}`} />
                </button>

                {moreMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-white border border-[#E5E5EA] shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    {secondaryNavLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                            isActive
                              ? 'bg-[#F2F2F7] text-[#7C3AED] font-semibold'
                              : 'text-[#1D1D1F] hover:bg-[#FAF9F5]'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#7C3AED]' : 'text-[#8E8E93]'}`} />
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
          )}
        </div>

        {/* Right: Telemetry Badges & Profile / Auth Buttons */}
        <div className="flex items-center gap-3 shrink-0 ml-auto pl-4">
          
          {isLoaded && isDemoUser ? (
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-semibold text-[#1D1D1F] hover:text-[#7C3AED] transition-colors shrink-0"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 text-sm font-semibold text-white btn-primary-gradient rounded-full hover:opacity-90 transition-opacity shrink-0 shadow-sm"
              >
                Get Started
              </Link>
            </div>
          ) : isLoaded && !isDemoUser ? (
            <>
              {/* Telemetry Pills */}
              <div className="hidden sm:flex items-center gap-2.5 text-xs font-semibold shrink-0">
            <Link
              href="/shop"
              className="px-3 py-1.5 rounded-full bg-[#FAF9F5] border border-[#E5E5EA] text-[#C9A227] flex items-center gap-1.5 hover:bg-[#F2F2F7] transition-colors shrink-0"
            >
              <Coins className="w-4 h-4 text-[#C9A227] shrink-0" />
              <span className="font-bold"><AnimatedCounter value={profile.gold} /> G</span>
            </Link>
            
            <div className="px-3 py-1.5 rounded-full bg-[#FAF9F5] border border-[#E5E5EA] text-[#7C3AED] flex items-center gap-1.5 shrink-0">
              <Flame className="w-4 h-4 text-[#7C3AED] shrink-0" />
              <span>{streak.current_streak}d Streak</span>
            </div>

            <button
              onClick={() => toggleSound(!profile.sound_enabled)}
              className="p-2 rounded-full bg-[#F2F2F7] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer shrink-0"
              aria-label="Toggle Sound Effects"
            >
              {profile.sound_enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* User Profile Trigger */}
          <div className="relative shrink-0" ref={archetypeDropdownRef}>
            <button
              onClick={() => setArchetypeDropdownOpen(!archetypeDropdownOpen)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-[#F2F2F7] hover:bg-[#E5E5EA] transition-all cursor-pointer border border-[#E5E5EA] shrink-0"
            >
              <div className="w-7 h-7 rounded-full btn-primary-gradient flex items-center justify-center text-white font-bold text-xs shrink-0">
                {profile.username.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col items-start text-left">
                <span className="text-xs font-semibold text-[#1D1D1F] leading-none">{profile.username}</span>
                <span className="text-[10px] text-[#6E6E73] leading-tight mt-0.5">Lvl {progress.currentLevel} • {profile.archetype}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#6E6E73] shrink-0" />
            </button>

            {archetypeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-[#E5E5EA] shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-2 z-50">
                <div className="px-3 py-2 border-b border-[#E5E5EA] mb-1">
                  <div className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider">Switch Archetype</div>
                </div>
                {ARCHETYPE_LIST.map((arch) => (
                  <button
                    key={arch.id}
                    onClick={() => {
                      switchArchetype(arch.id);
                      setArchetypeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      profile.archetype === arch.id
                        ? 'text-[#7C3AED] bg-[#F2F2F7] font-semibold'
                        : 'text-[#1D1D1F] hover:bg-[#FAF9F5]'
                    }`}
                  >
                    <span>{arch.name}</span>
                    {profile.archetype === arch.id && <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />}
                  </button>
                ))}
                <div className="border-t border-[#E5E5EA] mt-1 pt-1">
                  <Link
                    href="/settings"
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#FAF9F5] transition-colors flex items-center space-x-2"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={async () => {
                      await logout();
                      window.location.href = '/';
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center space-x-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

            {/* Mobile Menu Button (Visible below xl: 1280px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-[#1D1D1F] cursor-pointer rounded-xl hover:bg-[#F2F2F7] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            </>
          ) : null}
        </div>
      </div>

      {/* Mobile / Tablet Drawer (Below 1280px) */}
      {mobileMenuOpen && !isDemoUser && (
        <div className="xl:hidden bg-white border-b border-[#E5E5EA] mt-2 py-4 px-6 space-y-2 animate-in fade-in duration-150">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#E5E5EA] sm:hidden">
            <Link
              href="/shop"
              className="px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E5E5EA] text-[#C9A227] flex items-center justify-center gap-1.5 text-xs font-semibold"
            >
              <Coins className="w-4 h-4 text-[#C9A227]" />
              <span>{profile.gold} G</span>
            </Link>
            <div className="px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E5E5EA] text-[#7C3AED] flex items-center justify-center gap-1.5 text-xs font-semibold">
              <Flame className="w-4 h-4 text-[#7C3AED]" />
              <span>{streak.current_streak}d Streak</span>
            </div>
          </div>

          {allNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'text-[#7C3AED] bg-[#F2F2F7] font-semibold'
                  : 'text-[#1D1D1F] hover:bg-[#FAF9F5]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
