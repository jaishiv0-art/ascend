'use client';

import React from 'react';

interface AmbientBackgroundProps {
  variant?: 'global' | 'section' | 'card';
  className?: string;
  showParticles?: boolean;
}

export function AmbientBackground({
  variant = 'global',
  className = '',
  showParticles = true,
}: AmbientBackgroundProps) {
  if (variant === 'card') {
    return (
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 rounded-[inherit] select-none ${className}`}
        aria-hidden="true"
      >
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-purple-500/[0.05] blur-3xl animate-ambient-orb-1"
          style={{ willChange: 'transform' }}
        />
        <div
          className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-sky-400/[0.04] blur-3xl animate-ambient-orb-2"
          style={{ willChange: 'transform' }}
        />
      </div>
    );
  }

  if (variant === 'section') {
    return (
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none ${className}`}
        aria-hidden="true"
      >
        {/* Soft Ambient Mesh Orbs */}
        <div
          className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-purple-600/[0.06] blur-[90px] animate-ambient-orb-1"
          style={{ willChange: 'transform' }}
        />
        <div
          className="absolute bottom-10 -right-20 w-88 h-88 rounded-full bg-sky-400/[0.05] blur-[100px] animate-ambient-orb-2"
          style={{ willChange: 'transform' }}
        />
        <div
          className="absolute top-2/3 left-1/3 w-64 h-64 rounded-full bg-amber-400/[0.03] blur-[80px] animate-ambient-orb-3"
          style={{ willChange: 'transform' }}
        />

        {/* Faint Micro Particles */}
        {showParticles && (
          <div className="absolute inset-0">
            <span
              className="absolute bottom-10 left-[15%] w-1.5 h-1.5 rounded-full bg-purple-500/20 animate-ambient-particle"
              style={
                {
                  '--particle-drift-x': '20px',
                  '--particle-duration': '16s',
                  animationDelay: '1s',
                } as React.CSSProperties
              }
            />
            <span
              className="absolute bottom-20 left-[45%] w-1 h-1 rounded-full bg-sky-400/25 animate-ambient-particle"
              style={
                {
                  '--particle-drift-x': '-25px',
                  '--particle-duration': '19s',
                  animationDelay: '5s',
                } as React.CSSProperties
              }
            />
            <span
              className="absolute bottom-16 right-[20%] w-1.5 h-1.5 rounded-full bg-amber-400/20 animate-ambient-particle"
              style={
                {
                  '--particle-drift-x': '15px',
                  '--particle-duration': '14s',
                  animationDelay: '3s',
                } as React.CSSProperties
              }
            />
          </div>
        )}
      </div>
    );
  }

  // Default 'global' fixed background texture
  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none -z-10 select-none ${className}`}
      aria-hidden="true"
    >
      {/* Ambient particles and glow effects overlay */}

      {/* Top-Right Soft Purple Glow */}
      <div
        className="absolute -top-32 right-[5%] w-[480px] h-[480px] rounded-full bg-[#7C3AED]/[0.055] blur-[120px] animate-ambient-orb-1"
        style={{ willChange: 'transform' }}
      />

      {/* Middle-Left Soft Sky Glow */}
      <div
        className="absolute top-[35%] -left-32 w-[520px] h-[520px] rounded-full bg-[#38BDF8]/[0.05] blur-[130px] animate-ambient-orb-2"
        style={{ willChange: 'transform' }}
      />

      {/* Bottom-Right Soft Amber/Gold RPG Accent Glow */}
      <div
        className="absolute bottom-[10%] -right-24 w-[420px] h-[420px] rounded-full bg-[#C9A227]/[0.035] blur-[110px] animate-ambient-orb-3"
        style={{ willChange: 'transform' }}
      />

      {/* Micro floating particles */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden">
          <span
            className="absolute bottom-12 left-[12%] w-1.5 h-1.5 rounded-full bg-[#7C3AED]/20 animate-ambient-particle"
            style={
              {
                '--particle-drift-x': '24px',
                '--particle-duration': '18s',
                animationDelay: '0s',
              } as React.CSSProperties
            }
          />
          <span
            className="absolute bottom-24 left-[38%] w-1 h-1 rounded-full bg-[#38BDF8]/25 animate-ambient-particle"
            style={
              {
                '--particle-drift-x': '-18px',
                '--particle-duration': '21s',
                animationDelay: '6s',
              } as React.CSSProperties
            }
          />
          <span
            className="absolute bottom-16 right-[28%] w-1.5 h-1.5 rounded-full bg-[#7C3AED]/15 animate-ambient-particle"
            style={
              {
                '--particle-drift-x': '16px',
                '--particle-duration': '15s',
                animationDelay: '3s',
              } as React.CSSProperties
            }
          />
          <span
            className="absolute bottom-32 right-[10%] w-1 h-1 rounded-full bg-[#C9A227]/20 animate-ambient-particle"
            style={
              {
                '--particle-drift-x': '-12px',
                '--particle-duration': '24s',
                animationDelay: '9s',
              } as React.CSSProperties
            }
          />
          <span
            className="absolute bottom-8 left-[65%] w-1.5 h-1.5 rounded-full bg-[#38BDF8]/20 animate-ambient-particle"
            style={
              {
                '--particle-drift-x': '20px',
                '--particle-duration': '17s',
                animationDelay: '12s',
              } as React.CSSProperties
            }
          />
        </div>
      )}
    </div>
  );
}

export default AmbientBackground;
