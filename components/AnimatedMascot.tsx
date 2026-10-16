'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Lottie, type LottieHandle } from 'lottie-react';

import runningAnimation from '@/public/animations/running.json';
import cyclingAnimation from '@/public/animations/cycling.json';
import gamingAnimation from '@/public/animations/gaming.json';
import studyingAnimation from '@/public/animations/studying.json';

export type MascotAnimationType = 'running' | 'cycling' | 'gaming' | 'studying';

interface AnimatedMascotProps {
  animationType: MascotAnimationType;
  size?: number;
  className?: string;
  badgeText?: string;
  tooltipText?: string;
  showBadge?: boolean;
  onClick?: () => void;
}

const ANIMATION_MAP: Record<
  MascotAnimationType,
  { data: object; defaultBadge: string; description: string }
> = {
  running: {
    data: runningAnimation,
    defaultBadge: 'Daily Momentum',
    description: 'Active daily progress in motion',
  },
  cycling: {
    data: cyclingAnimation,
    defaultBadge: 'Quests in Motion',
    description: 'Pedaling through active quests and habits',
  },
  gaming: {
    data: gamingAnimation,
    defaultBadge: 'RPG Mastery',
    description: 'Leveling up stats and unlocking perks',
  },
  studying: {
    data: studyingAnimation,
    defaultBadge: 'Deep Analytics',
    description: 'Reflecting on telemetry and metrics',
  },
};

export function AnimatedMascot({
  animationType = 'running',
  size = 96,
  className = '',
  badgeText,
  tooltipText,
  showBadge = true,
  onClick,
}: AnimatedMascotProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const lottieRef = useRef<LottieHandle | null>(null);

  const meta = ANIMATION_MAP[animationType] || ANIMATION_MAP.running;

  // Mount on client
  useEffect(() => {
    setIsMounted(true);
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Handle reduced motion
  useEffect(() => {
    if (lottieRef.current) {
      if (isReducedMotion) {
        lottieRef.current.pause();
        lottieRef.current.seek(0);
      } else {
        lottieRef.current.play();
      }
    }
  }, [isReducedMotion]);

  const displayBadge = badgeText !== undefined ? badgeText : meta.defaultBadge;

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none transition-transform duration-300 ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      title={tooltipText || meta.description}
      role="img"
      aria-label={`${animationType} mascot animation: ${meta.description}`}
    >
      {/* Animation Canvas Wrapper with explicit size */}
      <div
        className="relative flex items-center justify-center overflow-hidden shrink-0"
        style={{ width: size, height: size }}
      >
        {!isMounted ? (
          <div
            className="w-full h-full rounded-2xl bg-purple-500/5 animate-pulse flex items-center justify-center"
            style={{ width: size, height: size }}
          />
        ) : (
          <Lottie
            lottieRef={lottieRef}
            src={meta.data}
            loop={!isReducedMotion}
            autoplay={!isReducedMotion}
            style={{ width: size, height: size }}
            className="w-full h-full flex items-center justify-center pointer-events-none"
          />
        )}
      </div>

      {/* Optional micro badge pill */}
      {showBadge && displayBadge && (
        <span
          className={`mt-1 text-[10px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded-full transition-all duration-200 shrink-0 ${
            isHovered
              ? 'bg-purple-100 text-purple-700 border border-purple-200'
              : 'bg-[#F2F2F7] text-[#6E6E73] border border-[#E5E5EA]'
          }`}
        >
          {displayBadge}
        </span>
      )}
    </div>
  );
}

export default AnimatedMascot;
