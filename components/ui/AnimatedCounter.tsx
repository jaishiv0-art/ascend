'use client';

// ==============================================================================
// ASCEND - SMOOTH ANIMATED NUMBER COUNTER (XP / GOLD)
// ==============================================================================

import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatter?: (n: number) => string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 800,
  formatter = (n) => new Intl.NumberFormat('en-US').format(n),
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;
    if (startValue === endValue) return;

    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easeOutExpo curve
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startValue + (endValue - startValue) * easeProgress);

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(updateCount);
      } else {
        prevValueRef.current = endValue;
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateCount);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration]);

  return <span className={className}>{formatter(displayValue)}</span>;
};
