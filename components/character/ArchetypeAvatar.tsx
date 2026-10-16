'use client';

// ==============================================================================
// ASCEND - ARCHETYPE AVATAR PORTRAITS & VECTOR ART SYSTEM
// High-Fidelity Character Portraits with Dynamic Glows & Role Themes
// ==============================================================================

import React from 'react';
import { Archetype } from '@/types/rpg';
import { motion } from 'framer-motion';

interface ArchetypeAvatarProps {
  archetype: Archetype | string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showGlow?: boolean;
  animate?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
  xl: 'w-28 h-28',
  '2xl': 'w-36 h-36',
};

export const ArchetypeAvatar: React.FC<ArchetypeAvatarProps> = ({
  archetype,
  size = 'lg',
  showGlow = true,
  animate = true,
  className = '',
}) => {
  const normalized = archetype as Archetype;

  // Visual Theme Configurations
  const getTheme = () => {
    switch (normalized) {
      case 'Cyber Mage':
        return {
          primary: '#06B6D4',
          secondary: '#3B82F6',
          bgGradient: 'from-cyan-500/20 via-blue-600/10 to-indigo-900/30',
          glow: 'rgba(6, 182, 212, 0.45)',
          border: 'border-cyan-400/40',
        };
      case 'Iron Titan':
        return {
          primary: '#EF4444',
          secondary: '#F97316',
          bgGradient: 'from-red-500/20 via-orange-600/10 to-amber-900/30',
          glow: 'rgba(239, 68, 68, 0.45)',
          border: 'border-red-400/40',
        };
      case 'Shadow Rogue':
        return {
          primary: '#A855F7',
          secondary: '#6366F1',
          bgGradient: 'from-purple-500/20 via-violet-600/10 to-slate-900/30',
          glow: 'rgba(168, 85, 247, 0.45)',
          border: 'border-purple-400/40',
        };
      case 'Bio Hacker':
        return {
          primary: '#10B981',
          secondary: '#06B6D4',
          bgGradient: 'from-emerald-500/20 via-teal-600/10 to-green-950/30',
          glow: 'rgba(16, 185, 129, 0.45)',
          border: 'border-emerald-400/40',
        };
      case 'Astral Sage':
        return {
          primary: '#F59E0B',
          secondary: '#EC4899',
          bgGradient: 'from-amber-500/20 via-pink-600/10 to-purple-950/30',
          glow: 'rgba(245, 158, 11, 0.45)',
          border: 'border-amber-400/40',
        };
      case 'Nova Paladin':
        return {
          primary: '#3B82F6',
          secondary: '#8B5CF6',
          bgGradient: 'from-blue-500/20 via-indigo-600/10 to-violet-950/30',
          glow: 'rgba(59, 130, 246, 0.45)',
          border: 'border-blue-400/40',
        };
      default:
        return {
          primary: '#7C3AED',
          secondary: '#38BDF8',
          bgGradient: 'from-purple-500/20 via-blue-600/10 to-slate-900/30',
          glow: 'rgba(124, 58, 237, 0.45)',
          border: 'border-purple-400/40',
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className}`}
    >
      {/* Dynamic Ambient Background Glow */}
      {showGlow && (
        <div
          className="absolute inset-0 rounded-3xl blur-xl transition-all duration-300 pointer-events-none -z-10"
          style={{
            backgroundColor: theme.primary,
            opacity: 0.25,
            transform: 'scale(1.15)',
          }}
        />
      )}

      {/* Frame Container */}
      <div
        className={`w-full h-full rounded-2xl sm:rounded-3xl bg-gradient-to-br ${theme.bgGradient} bg-[#FAF9F6] border ${theme.border} shadow-sm overflow-hidden flex items-center justify-center relative p-1`}
      >
        {/* Archetype Custom Vector Art Portraits */}
        {normalized === 'Cyber Mage' && (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="cm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
              <linearGradient id="cm-glow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {/* Hood / Arcane Shroud */}
            <path
              d="M50 12 C28 12, 22 28, 22 52 C22 75, 34 88, 50 88 C66 88, 78 75, 78 52 C78 28, 72 12, 50 12 Z"
              fill="#1E1B4B"
              stroke="url(#cm-grad)"
              strokeWidth="2.5"
            />
            {/* Inner Shadow Realm */}
            <ellipse cx="50" cy="52" rx="22" ry="26" fill="#0F172A" />
            {/* Cyber Neural Visor */}
            <motion.rect
              animate={animate ? { opacity: [0.85, 1, 0.85] } : undefined}
              transition={{ duration: 2, repeat: Infinity }}
              x="32"
              y="44"
              width="36"
              height="10"
              rx="5"
              fill="url(#cm-grad)"
            />
            <rect x="35" y="47" width="30" height="4" rx="2" fill="#E0F2FE" />
            {/* Circuit Nodes */}
            <path
              d="M20 50 L30 50 M70 50 L80 50 M50 20 L50 28 M35 72 L42 66 M65 72 L58 66"
              stroke="#06B6D4"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="20" cy="50" r="2" fill="#22D3EE" />
            <circle cx="80" cy="50" r="2" fill="#22D3EE" />
            <circle cx="50" cy="20" r="2" fill="#22D3EE" />
            {/* Arcane Sigil Crown */}
            <path
              d="M42 26 L50 18 L58 26"
              stroke="#38BDF8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {normalized === 'Iron Titan' && (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="it-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#F97316" />
              </linearGradient>
            </defs>
            {/* Heavy Vanguard Armored Helm */}
            <path
              d="M50 14 L78 26 L74 65 L50 86 L26 65 L22 26 Z"
              fill="#18181B"
              stroke="url(#it-grad)"
              strokeWidth="3"
            />
            {/* Steel Plate Insets */}
            <path
              d="M32 32 L50 22 L68 32 L65 58 L50 72 L35 58 Z"
              fill="#27272A"
              stroke="#EF4444"
              strokeWidth="1.5"
            />
            {/* Crimson Visor T-Slit */}
            <motion.path
              animate={animate ? { opacity: [0.8, 1, 0.8] } : undefined}
              transition={{ duration: 1.5, repeat: Infinity }}
              d="M36 42 L64 42 M50 42 L50 64"
              stroke="url(#it-grad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="50" cy="42" r="3.5" fill="#FEE2E2" />
            {/* Rivets */}
            <circle cx="28" cy="30" r="1.5" fill="#EF4444" />
            <circle cx="72" cy="30" r="1.5" fill="#EF4444" />
            <circle cx="50" cy="80" r="1.5" fill="#F97316" />
          </svg>
        )}

        {normalized === 'Shadow Rogue' && (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="sr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            {/* Phantom Shroud & Cowl */}
            <path
              d="M50 12 C32 12, 20 28, 20 54 C20 74, 32 86, 50 86 C68 86, 80 74, 80 54 C80 28, 68 12, 50 12 Z"
              fill="#09090B"
              stroke="url(#sr-grad)"
              strokeWidth="2.5"
            />
            {/* Lower Shadow Mask */}
            <path
              d="M30 52 L50 76 L70 52 C70 52, 60 62, 50 62 C40 62, 30 52, 30 52 Z"
              fill="#3B0764"
              stroke="#A855F7"
              strokeWidth="1.5"
            />
            {/* Glowing Phantom Twin Eyes */}
            <motion.ellipse
              animate={animate ? { rx: [3.5, 4, 3.5] } : undefined}
              transition={{ duration: 2, repeat: Infinity }}
              cx="40"
              cy="44"
              rx="4"
              ry="2"
              transform="rotate(-15 40 44)"
              fill="#C084FC"
            />
            <motion.ellipse
              animate={animate ? { rx: [3.5, 4, 3.5] } : undefined}
              transition={{ duration: 2, repeat: Infinity }}
              cx="60"
              cy="44"
              rx="4"
              ry="2"
              transform="rotate(15 60 44)"
              fill="#C084FC"
            />
            {/* Crescent Forehead Crest */}
            <path
              d="M44 26 Q50 32 56 26 Q50 22 44 26 Z"
              fill="#E9D5FF"
              stroke="#A855F7"
              strokeWidth="1"
            />
          </svg>
        )}

        {normalized === 'Bio Hacker' && (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="bh-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            {/* Bio-Armor Shell */}
            <path
              d="M50 14 C30 14, 24 28, 24 50 C24 72, 36 86, 50 86 C64 86, 76 72, 76 50 C76 28, 70 14, 50 14 Z"
              fill="#064E3B"
              stroke="url(#bh-grad)"
              strokeWidth="2.5"
            />
            {/* Cybernetic Faceguard */}
            <path
              d="M34 46 Q50 56 66 46 L60 72 L50 78 L40 72 Z"
              fill="#022C22"
              stroke="#10B981"
              strokeWidth="1.5"
            />
            {/* Left Ocular Sensor Eye */}
            <circle cx="40" cy="42" r="4.5" fill="#34D399" />
            <circle cx="40" cy="42" r="2" fill="#ECFDF5" />
            {/* Right Tactical HUD Scanner */}
            <rect x="56" y="39" width="10" height="6" rx="2" fill="#06B6D4" />
            <line x1="58" y1="42" x2="64" y2="42" stroke="#FFFFFF" strokeWidth="1" />
            {/* DNA Nano Strands */}
            <path
              d="M50 20 Q55 26 50 32 Q45 38 50 44"
              stroke="#34D399"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Oxygen Rebreather Nodes */}
            <circle cx="45" cy="68" r="2" fill="#10B981" />
            <circle cx="55" cy="68" r="2" fill="#10B981" />
          </svg>
        )}

        {normalized === 'Astral Sage' && (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="as-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            {/* Celestial Shroud */}
            <path
              d="M50 12 C30 12, 22 28, 22 52 C22 74, 34 88, 50 88 C66 88, 78 74, 78 52 C78 28, 70 12, 50 12 Z"
              fill="#451A03"
              stroke="url(#as-grad)"
              strokeWidth="2.5"
            />
            {/* Astral Third Eye / Star Crown */}
            <path
              d="M50 22 L53 30 L61 33 L53 36 L50 44 L47 36 L39 33 L47 30 Z"
              fill="#FEF3C7"
              stroke="#F59E0B"
              strokeWidth="1"
            />
            {/* Serene Radiant Face */}
            <ellipse cx="50" cy="54" rx="18" ry="20" fill="#291305" />
            {/* Starlight Vision Slits */}
            <motion.path
              animate={animate ? { opacity: [0.75, 1, 0.75] } : undefined}
              transition={{ duration: 2.2, repeat: Infinity }}
              d="M38 52 Q44 54 48 52 M52 52 Q56 54 62 52"
              stroke="#FBBF24"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Orbital Celestial Rings */}
            <ellipse
              cx="50"
              cy="52"
              rx="32"
              ry="10"
              stroke="#F59E0B"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              transform="rotate(-20 50 52)"
            />
            <circle cx="22" cy="42" r="2.5" fill="#FBBF24" />
            <circle cx="78" cy="62" r="2.5" fill="#EC4899" />
          </svg>
        )}

        {normalized === 'Nova Paladin' && (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="np-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            {/* Sun Aegis Helm */}
            <path
              d="M50 12 L76 24 L72 64 L50 88 L28 64 L24 24 Z"
              fill="#172554"
              stroke="url(#np-grad)"
              strokeWidth="3"
            />
            {/* Radiant Halo Wings */}
            <path
              d="M20 28 Q34 16 50 16 Q66 16 80 28"
              stroke="#93C5FD"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Golden Core Inlay */}
            <polygon points="50,26 62,38 50,68 38,38" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1.5" />
            {/* Glowing Cross Visor */}
            <motion.path
              animate={animate ? { opacity: [0.85, 1, 0.85] } : undefined}
              transition={{ duration: 1.8, repeat: Infinity }}
              d="M42 42 L58 42 M50 34 L50 54"
              stroke="#BFDBFE"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="50" cy="42" r="3" fill="#FFFFFF" />
            {/* Bottom Crest Diamond */}
            <polygon points="50,72 54,77 50,82 46,77" fill="#60A5FA" />
          </svg>
        )}
      </div>
    </div>
  );
};
