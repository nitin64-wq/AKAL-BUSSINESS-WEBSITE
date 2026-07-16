'use client';

import React, { useEffect, useState } from 'react';
import { useIntersection } from '@/hooks/useIntersection';

interface AnimatedCounterProps {
  end: number;
  duration?: number; // duration in milliseconds
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}) => {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useIntersection<HTMLSpanElement>({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutQuad
      const easedProgress = progress * (2 - progress);
      
      const currentCount = easedProgress * end;
      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    window.requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  // Format count
  const formattedCount = count.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formattedCount}
      {suffix}
    </span>
  );
};
