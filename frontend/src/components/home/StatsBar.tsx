'use client';

import React, { useMemo } from 'react';
import { AnimatedCounter } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';
import styles from './StatsBar.module.css';

export const StatsBar: React.FC = () => {
  const { data: settings, isLoading } = useFetch<Record<string, any>>(
    '/settings',
    ['settings_public']
  );

  const stats = useMemo(() => {
    if (!settings) {
      return [];
    }
    const alumni = settings.alumni_count;
    const placements = settings.placement_rate;
    const recruiters = settings.corporate_recruiters;
    const mous = settings.international_partners;
    const faculty = settings.faculty_count;

    // If none of the values exist in settings, don't render
    if (!alumni && !placements && !recruiters && !mous && !faculty) {
      return [];
    }

    return [
      { end: Number(alumni) || 0, suffix: '+', label: 'Alumni Network' },
      { end: Number(placements) || 0, suffix: '%', label: 'Placement Rate' },
      { end: Number(recruiters) || 0, suffix: '+', label: 'Recruiters' },
      { end: Number(mous) || 0, suffix: '+', label: 'Global MoUs' },
      { end: Number(faculty) || 0, suffix: '+', label: 'Faculty Members' },
    ];
  }, [settings]);

  // Don't render if settings haven't loaded (DB offline) or stats is empty
  if (isLoading || !settings || stats.length === 0) {
    return null;
  }

  return (
    <div className={styles.statsBar}>
      <div className={`container ${styles.grid}`}>
        {stats.map((stat, idx) => (
          <div key={idx} className={styles.statItem}>
            <div className={styles.number}>
              <AnimatedCounter end={stat.end} suffix={stat.suffix} />
            </div>
            <div className={styles.label}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
