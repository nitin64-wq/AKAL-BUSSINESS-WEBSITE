'use client';

import React from 'react';
import styles from './ScholarshipsSection.module.css';
import { SectionHeader } from '../ui/SectionHeader';
import { useFetch } from '@/hooks/useFetch';
import type { Scholarship } from '@/types';
import { Award, Heart, Trophy, BookOpen } from 'lucide-react';

const iconMap = {
  Award: Award,
  Heart: Heart,
  Trophy: Trophy,
  BookOpen: BookOpen
};

export function ScholarshipsSection() {
  const { data: scholarships } = useFetch<Scholarship[]>(
    '/scholarships',
    ['scholarships_public']
  );

  const displayScholarships: {
    id: number;
    title: string;
    description: string;
    amount_percent: number | null;
    icon: string;
  }[] = scholarships && scholarships.length > 0 
    ? scholarships.map((s: Scholarship, idx: number) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        amount_percent: s.amount_percent,
        icon: idx === 0 ? 'Award' : idx === 1 ? 'Heart' : idx === 2 ? 'Trophy' : 'BookOpen'
      })) 
    : [];

  if (displayScholarships.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.section} darkSection`} id="scholarships">
      <div className="container">
        <SectionHeader 
          title="Empowering Talents Through Scholarships"
          subtitle="ABS believes that financial constraints should never stand in the way of academic excellence and leadership potential."
        />

        <div className={styles.grid}>
          {displayScholarships.map((s) => {
            const IconComponent = iconMap[s.icon as keyof typeof iconMap] || Award;
            return (
              <div key={s.id} className={styles.scholarshipCard}>
                <div className={styles.iconWrapper}>
                  <IconComponent size={28} />
                </div>
                <h4 className={styles.title}>{s.title}</h4>
                <p className={styles.description}>{s.description}</p>
                <div className={styles.amountBadge}>
                  {s.amount_percent ? `Up to ${s.amount_percent}% Waiver` : 'Grants Provided'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
