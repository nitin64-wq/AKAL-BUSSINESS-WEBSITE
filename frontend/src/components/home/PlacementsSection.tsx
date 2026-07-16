'use client';

import React, { useMemo, useState, useCallback } from 'react';
import styles from './PlacementsSection.module.css';
import { SectionHeader } from '../ui/SectionHeader';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { useFetch } from '@/hooks/useFetch';
import { getImageUrl } from '@/lib/utils';
import type { Placement } from '@/types';

const CAREER_OUTCOMES = [
  { label: 'Business Analyst', icon: '📊' },
  { label: 'Data Analyst', icon: '📈' },
  { label: 'Financial Analyst', icon: '💰' },
  { label: 'BI Executive', icon: '🎯' },
  { label: 'Management Trainee', icon: '🚀' },
  { label: 'Consultant', icon: '💼' },
];

const STAT_ICONS = ['🏆', '📊', '🎓'];

// Get initials for colorful logo fallback
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);
}

// Deterministic color from company name
function nameToColor(name: string): string {
  const BRAND_COLORS = [
    '#6366F1', '#EC4899', '#10B981', '#F59E0B',
    '#EF4444', '#8B5CF6', '#06B6D4', '#F97316',
    '#14B8A6', '#3B82F6', '#D946EF', '#22C55E',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BRAND_COLORS[Math.abs(hash) % BRAND_COLORS.length];
}

/**
 * Single logo tile — shows the uploaded image if it loads,
 * otherwise falls back to a colourful branded-initial icon.
 * Company name text is NEVER rendered.
 */
function LogoTile({
  name,
  logo,
  color,
}: {
  name: string;
  logo: string | null;
  color: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  const handleImgError = useCallback(() => setImgFailed(true), []);

  const showImage = logo && !imgFailed;

  return (
    <div className={styles.logoItem} title={name}>
      {showImage ? (
        <img
          src={getImageUrl(logo)}
          alt=""
          className={styles.logoImg}
          loading="lazy"
          onError={handleImgError}
        />
      ) : (
        <div className={styles.logoFallback}>
          <div
            className={styles.logoFallbackIcon}
            style={{ background: color }}
          >
            {getInitials(name)}
          </div>
        </div>
      )}
    </div>
  );
}

export function PlacementsSection() {
  const { data: placements } = useFetch<Placement[]>(
    '/placements',
    ['placements_public']
  );

  const placementList = placements || [];

  if (placements && placementList.length === 0) {
    return null;
  }

  // Highlight stats
  const stats = [
    { num: 12, suffix: ' LPA', label: 'Highest Package', icon: STAT_ICONS[0] },
    { num: 7.2, suffix: ' LPA', label: 'Average Package', icon: STAT_ICONS[1] },
    { num: 95, suffix: '%', label: 'Internship Success', icon: STAT_ICONS[2] },
  ];

  // Build recruiter list from DB — only featured companies in marquee
  const recruiterLogos = useMemo(() => {
    let dbList: { name: string; logo: string | null; color: string }[] = [];

    if (placementList.length > 0) {
      // Filter to featured only for the marquee, deduplicate by company_name
      const seen = new Set<string>();
      const featured = placementList
        .filter((p) => p.is_featured)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        .filter((p) => {
          if (seen.has(p.company_name)) return false;
          seen.add(p.company_name);
          return true;
        });

      const selectedList = featured.length > 0 ? featured : placementList;

      seen.clear();
      dbList = selectedList
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        .filter((p) => {
          if (seen.has(p.company_name)) return false;
          seen.add(p.company_name);
          return true;
        })
        .map((p: Placement) => ({
          name: p.company_name,
          logo: p.company_logo,
          color: nameToColor(p.company_name),
        }));
    }

    // Assign stable sequential IDs
    return dbList.map((item, idx) => ({
      id: idx,
      ...item,
    }));
  }, [placementList]);

  // Double the items for seamless infinite scroll
  const marqueeRow1 = useMemo(() => {
    const half = recruiterLogos.slice(0, Math.ceil(recruiterLogos.length / 2));
    return [...half, ...half]; // duplicate for seamless loop
  }, [recruiterLogos]);

  const marqueeRow2 = useMemo(() => {
    const half = recruiterLogos.slice(Math.ceil(recruiterLogos.length / 2));
    return [...half, ...half]; // duplicate for seamless loop
  }, [recruiterLogos]);

  return (
    <section className={`${styles.section} sectionLight`} id="placements">
      <div className="container">
        <SectionHeader
          title="Outstanding Placement Record"
          subtitle="ABS graduates are highly sought after by leading technology, management, and global service corporations."
          theme="light"
        />

        {/* ── Stats Grid ── */}
        <div className={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <div key={idx} className={styles.statCard}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statNum}>
                {stat.num === 7.2 ? '7.2' : <AnimatedCounter end={stat.num} duration={1.5} />}
                {stat.suffix}
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Recruiters Marquee — logo only, no text ── */}
        <div className={styles.recruitersArea}>
          <h3 className={styles.recruiterTitle}>Our Prestigious Recruiters</h3>

          {/* Row 1 — scrolls left */}
          <div className={styles.marqueeWrapper}>
            <div className={styles.marqueeTrack}>
              {marqueeRow1.map((recruiter, idx) => (
                <LogoTile
                  key={`r1-${recruiter.id}-${idx}`}
                  name={recruiter.name}
                  logo={recruiter.logo}
                  color={recruiter.color}
                />
              ))}
            </div>
          </div>

          {/* Row 2 — scrolls right (reverse) */}
          <div className={styles.marqueeWrapper}>
            <div className={styles.marqueeTrackReverse}>
              {marqueeRow2.map((recruiter, idx) => (
                <LogoTile
                  key={`r2-${recruiter.id}-${idx}`}
                  name={recruiter.name}
                  logo={recruiter.logo}
                  color={recruiter.color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Career Outcomes ── */}
        <div className={styles.outcomesArea}>
          <h3 className={styles.outcomesTitle}>Career Outcomes & Roles</h3>
          <p className={styles.outcomesSubtitle}>
            Our graduates step into impactful roles across diverse industries
          </p>
          <div className={styles.outcomesGrid}>
            {CAREER_OUTCOMES.map((outcome, idx) => (
              <div key={idx} className={styles.outcomeCard}>
                <div className={styles.outcomeIconWrapper}>{outcome.icon}</div>
                <span className={styles.outcomeLabel}>{outcome.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
