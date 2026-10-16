'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Lottie, type LottieHandle } from 'lottie-react';

import hangingAnimation from '@/public/animations/hanging.json';
import runningAnimation from '@/public/animations/running.json';
import cyclingAnimation from '@/public/animations/cycling.json';
import gymAnimation from '@/public/animations/gym.json';
import studyingAnimation from '@/public/animations/studying.json';

export type PageMascotType = 'hanging' | 'running' | 'cycling' | 'gym' | 'studying';

export interface PageMascotProps {
  animationType?: PageMascotType;
  size?: number;
  className?: string;
  badgeText?: string;
  tooltipText?: string;
  showBadge?: boolean;
  position?: 'top-edge' | 'inline' | 'corner';
  onClick?: () => void;
}

const MASCOT_CONFIG: Record<
  PageMascotType,
  {
    data: object;
    defaultBadge: string;
    description: string;
    isHanging: boolean;
  }
> = {
  hanging: {
    data: hangingAnimation,
    defaultBadge: 'ASCEND Mascot',
    description: 'Playful mascot gripping the quest ledge',
    isHanging: true,
  },
  running: {
    data: runningAnimation,
    defaultBadge: 'Daily Momentum',
    description: 'Running to maintain daily streak momentum',
    isHanging: false,
  },
  cycling: {
    data: cyclingAnimation,
    defaultBadge: 'Quests in Motion',
    description: 'Pedaling through active quests and habits',
    isHanging: false,
  },
  gym: {
    data: gymAnimation,
    defaultBadge: 'Fitness & Power',
    description: 'Leveling up strength and discipline in the gym',
    isHanging: false,
  },
  studying: {
    data: studyingAnimation,
    defaultBadge: 'Deep Analytics',
    description: 'Reflecting on telemetry and stats',
    isHanging: false,
  },
};

export function PageMascot({
  animationType = 'hanging',
  size = 92,
  className = '',
  badgeText,
  tooltipText,
  showBadge = false,
  position = 'top-edge',
  onClick,
}: PageMascotProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const lottieRef = useRef<LottieHandle | null>(null);

  const config = MASCOT_CONFIG[animationType] || MASCOT_CONFIG.hanging;
  const isHangingType = animationType === 'hanging' || config.isHanging;

  // Detect prefers-reduced-motion on client mount
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

  // Handle freeze on reduced motion
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

  const displayBadge = badgeText !== undefined ? badgeText : config.defaultBadge;

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none pointer-events-auto transition-transform duration-300 ${
        isHangingType && !isReducedMotion ? 'animate-mascot-swing' : ''
      } ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''} ${className}`}
      style={{
        transformOrigin: isHangingType ? '50% 12px' : 'center center',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      title={tooltipText || config.description}
      role="img"
      aria-label={`${animationType} mascot: ${config.description}`}
    >
      {/* Visual Anchor Indicator for hanging characters */}
      {isHangingType && position === 'top-edge' && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-black/10 rounded-full blur-[0.5px] pointer-events-none" />
      )}

      {/* Lottie Animation Canvas Container */}
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
            src={config.data}
            loop={!isReducedMotion}
            autoplay={!isReducedMotion}
            style={{ width: size, height: size }}
            className="w-full h-full flex items-center justify-center pointer-events-none"
          />
        )}
      </div>

      {/* Optional micro badge */}
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

export default PageMascot;
