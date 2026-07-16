'use client';

import React from 'react';
import clsx from 'clsx';
import { AnimatedCounter } from './AnimatedCounter';
import styles from './StatCard.module.css';

interface StatCardProps {
  end: number;
  label: string;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  end,
  label,
  duration = 2000,
  suffix = '',
  prefix = '',
  decimals = 0,
  icon,
  className = '',
}) => {
  return (
    <div className={clsx(styles.statCard, className)}>
      {icon && <div className={styles.iconWrapper}>{icon}</div>}
      <div className={styles.number}>
        <AnimatedCounter
          end={end}
          duration={duration}
          suffix={suffix}
          prefix={prefix}
          decimals={decimals}
        />
      </div>
      <div className={styles.label}>{label}</div>
    </div>
  );
};
