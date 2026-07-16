'use client';

import React, { useMemo } from 'react';
import styles from './StudentAchievements.module.css';
import { SectionHeader } from '../ui/SectionHeader';
import { Badge } from '../ui/Badge';
import { useFetch } from '@/hooks/useFetch';
import { Trophy, GraduationCap, Lightbulb, BookOpen, Award } from 'lucide-react';

interface StudentAchievement {
  id: number;
  title: string;
  description: string;
  badge: string | null;
  highlight: string | null;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Trophy,
  GraduationCap,
  Lightbulb,
  BookOpen,
  Award,
};

export function StudentAchievements() {
  const { data: dbAchievements } = useFetch<StudentAchievement[]>(
    '/student-achievements',
    ['student_achievements_public']
  );

  const achievements = useMemo(() => {
    if (dbAchievements && dbAchievements.length > 0) {
      return dbAchievements;
    }
    return [];
  }, [dbAchievements]);

  if (achievements.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.section} sectionLight`} id="achievements">
      <div className="container">
        <SectionHeader 
          title="Student Milestones & Achievements"
          subtitle="Celebrating the academic excellence, research contributions, and entrepreneurial triumphs of our student community."
          theme="light"
        />

        <div className={styles.grid}>
          {achievements.map((ach) => {
            const IconComponent = ICON_MAP[ach.icon] || Trophy;
            return (
              <div key={ach.id} className={styles.achievementCard}>
                <div className={styles.header}>
                  <div className={styles.iconWrapper}>
                    <IconComponent size={24} />
                  </div>
                  {ach.badge && <Badge variant="gold">{ach.badge}</Badge>}
                </div>
                <h4 className={styles.title}>{ach.title}</h4>
                <p className={styles.description}>{ach.description}</p>
                {ach.highlight && (
                  <div className={styles.footer}>
                    {ach.highlight}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
