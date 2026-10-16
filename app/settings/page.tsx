'use client';

// ==============================================================================
// ASCEND - SETTINGS, THEMES & AUDIO CUSTOMIZATION
// Apple Bright Premium Settings
// ==============================================================================

import React, { useState } from 'react';
import { useGame } from '@/lib/context/game-context';
import {
  Settings,
  Palette,
  Volume2,
  VolumeX,
  User,
  Database,
  Trash2,
  Download,
  Check,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ARCHETYPE_LIST } from '@/lib/progression/archetypes';
import { Archetype } from '@/types/rpg';
import { PageMascot } from '@/components/PageMascot';

export default function SettingsPage() {
  const {
    profile,
    updateUserProfile,
    setTheme,
    toggleSound,
    resetAllGameData,
    isConfigured,
    isDemoUser,
  } = useGame();

  const [username, setUsername] = useState(profile.username);
  const [title, setTitle] = useState(profile.title);
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype>(profile.archetype);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const themes = [
    { id: 'cyberpunk', name: 'Cyberpunk Neon', desc: 'Luminous cyan & electric violet grid', color: '#06B6D4' },
    { id: 'theme-void', name: 'Obsidian Void', desc: 'Deep ultraviolet obsidian darkness', color: '#A855F7' },
    { id: 'theme-solar', name: 'Solar Flare', desc: 'Radiant gold and magma orange reactor', color: '#F59E0B' },
    { id: 'theme-matrix', name: 'Emerald Matrix', desc: 'Cyber terminal green phosphor rain', color: '#10B981' },
    { id: 'theme-crimson', name: 'Crimson Vanguard', desc: 'Tactical combat red and carbon HUD', color: '#EF4444' },
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      username: username.trim(),
      title: title.trim(),
      archetype: selectedArchetype,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportData = () => {
    const backup = {
      profile,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascend-hero-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 pt-4 px-4 sm:px-0">
      {/* Header */}
      <div className="flex items-center space-x-4 pb-4 border-b border-[#E5E5EA]">
        <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 shadow-sm">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight">Settings</h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-0.5">Manage your profile, themes, sound preferences, and account data.</p>
        </div>
      </div>

      {/* 1. THEME SELECTION */}
      <div className="apple-card p-6 sm:p-8 relative">
        <div className="absolute -top-3 right-8 hidden sm:block">
          <PageMascot animationType="hanging" size={88} position="top-edge" />
        </div>
        <div className="flex items-center space-x-3 pb-4 border-b border-[#E5E5EA] mb-5">
          <Palette className="w-5 h-5 text-purple-600" />
          <div>
            <h3 className="text-base font-bold text-[#1D1D1F]">Visual Themes</h3>
            <p className="text-xs text-[#6E6E73]">Switch global palette and luminous accent styling</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {themes.map((th) => {
            const isSelected = profile.theme === th.id;
            return (
              <button
                key={th.id}
                onClick={() => setTheme(th.id)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-50/50 border-purple-400 shadow-sm ring-1 ring-purple-400'
                    : 'bg-[#F5F5F7] border-[#E5E5EA] hover:border-[#C7C7CC]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: th.color }} />
                  {isSelected && <Check className="w-4 h-4 text-purple-600 stroke-[3]" />}
                </div>
                <div className="text-sm font-bold text-[#1D1D1F]">{th.name}</div>
                <div className="text-xs text-[#6E6E73] mt-0.5">{th.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. AUDIO SFX CONTROLS */}
      <div className="apple-card p-6 sm:p-8">
        <div className="flex items-center space-x-3 pb-4 border-b border-[#E5E5EA] mb-5">
          <Volume2 className="w-5 h-5 text-purple-600" />
          <div>
            <h3 className="text-base font-bold text-[#1D1D1F]">Sound Effects</h3>
            <p className="text-xs text-[#6E6E73]">Zero-latency synthesized RPG sound chimes</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA]">
          <div className="flex items-center space-x-3.5">
            {profile.sound_enabled ? (
              <Volume2 className="w-5 h-5 text-purple-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-[#8E8E93]" />
            )}
            <div>
              <div className="text-sm font-bold text-[#1D1D1F]">Audio Effects</div>
              <div className="text-xs text-[#6E6E73]">Quest completion chimes, gold clinks, and level-up fanfares</div>
            </div>
          </div>

          <button
            onClick={() => toggleSound(!profile.sound_enabled)}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all border cursor-pointer ${
              profile.sound_enabled
                ? 'btn-primary-gradient text-white shadow-sm'
                : 'bg-white text-[#6E6E73] border-[#E5E5EA]'
            }`}
          >
            {profile.sound_enabled ? 'Enabled' : 'Muted'}
          </button>
        </div>
      </div>

      {/* 3. PROFILE DETAILS */}
      <form onSubmit={handleSaveProfile} className="apple-card p-6 sm:p-8 space-y-5">
        <div className="flex items-center space-x-3 pb-4 border-b border-[#E5E5EA]">
          <User className="w-5 h-5 text-purple-600" />
          <div>
            <h3 className="text-base font-bold text-[#1D1D1F]">Hero Identity</h3>
            <p className="text-xs text-[#6E6E73]">Update codename, active title, and character class</p>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 stroke-[3] text-emerald-600" />
            <span>Profile successfully updated!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-[#1D1D1F] uppercase tracking-wider mb-1.5">
              Codename / Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-[#1D1D1F] text-sm focus:outline-none focus:border-purple-500 font-medium transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#1D1D1F] uppercase tracking-wider mb-1.5">
              Display Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-[#1D1D1F] text-sm focus:outline-none focus:border-purple-500 font-medium transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-[#1D1D1F] uppercase tracking-wider mb-1.5">
            Character Archetype
          </label>
          <select
            value={selectedArchetype}
            onChange={(e) => setSelectedArchetype(e.target.value as Archetype)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-[#1D1D1F] text-sm font-medium focus:outline-none focus:border-purple-500 cursor-pointer transition-colors"
          >
            {ARCHETYPE_LIST.map((arch) => (
              <option key={arch.id} value={arch.id}>
                {arch.name} ({arch.role})
              </option>
            ))}
          </select>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-3 btn-primary-gradient text-white font-bold text-xs font-mono uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* 4. DATABASE & BACKUP MANAGEMENT */}
      <div className="apple-card p-6 sm:p-8">
        <div className="flex items-center space-x-3 pb-4 border-b border-[#E5E5EA] mb-5">
          <Database className="w-5 h-5 text-purple-600" />
          <div>
            <h3 className="text-base font-bold text-[#1D1D1F]">Data & Backup</h3>
            <p className="text-xs text-[#6E6E73]">Backend connection status and backup export</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E6E73] font-medium">Database Status:</span>
            <span className={`font-bold font-mono flex items-center gap-1.5 ${isConfigured ? 'text-emerald-600' : 'text-amber-600'}`}>
              <ShieldCheck className="w-4 h-4" />
              <span>{isConfigured ? 'Supabase Postgres RLS Connected' : 'Local Persistence Mode Active'}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-3 pt-3 border-t border-[#E5E5EA]">
            <button
              onClick={handleExportData}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#1D1D1F] font-bold text-xs flex items-center space-x-1.5 transition-all border border-[#E5E5EA] cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-purple-600" />
              <span>Export Character Backup (JSON)</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all game data to default starting state?')) {
                  resetAllGameData();
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center space-x-1.5 transition-all border border-rose-200 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Game Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

