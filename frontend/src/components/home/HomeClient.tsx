'use client';

import React from 'react';
import { useFetch } from '@/hooks/useFetch';
import { useUIStore } from '@/store/uiStore';

import { HeroSection } from './HeroSection';
import { StatsBar } from './StatsBar';
import { AnnouncementsSection } from './AnnouncementsSection';
import { WhyABSSection } from './WhyABSSection';
import { ProgramsSection } from './ProgramsSection';
import { ImpactNumbers } from './ImpactNumbers';
import { GlobalLearning } from './GlobalLearning';
import { PlacementsSection } from './PlacementsSection';
import { FacultyCarousel } from './FacultyCarousel';
import { ScholarshipsSection } from './ScholarshipsSection';
import { CampusLifeGrid } from './CampusLifeGrid';
import { TestimonialsSection } from './TestimonialsSection';
import { NewsSection } from './NewsSection';
import { StudentAchievements } from './StudentAchievements';

export function HomeClient() {
  const isDbDisconnected = useUIStore((state) => state.isDbDisconnected);

  const { data: settings } = useFetch<Record<string, any>>(
    '/settings',
    ['settings_public']
  );

  const isVisible = (key: string) => {
    // When the database is offline, hide all sections
    if (isDbDisconnected) return false;
    if (!settings) return true; // default to showing during initial load/fallback
    return settings[key] !== false && settings[key] !== 'false';
  };

  return (
    <>
      {isVisible('section_hero') && <HeroSection />}
      {isVisible('section_stats') && <StatsBar />}
      {isVisible('section_announcements') && <AnnouncementsSection />}
      {isVisible('section_why_abs') && <WhyABSSection />}
      {isVisible('section_programs') && <ProgramsSection />}
      {isVisible('section_impact_numbers') && <ImpactNumbers />}
      {isVisible('section_global_learning') && <GlobalLearning />}
      {isVisible('section_placements') && <PlacementsSection />}
      {isVisible('section_faculty') && <FacultyCarousel />}
      {isVisible('section_scholarships') && <ScholarshipsSection />}
      {isVisible('section_campus_life') && <CampusLifeGrid />}
      {isVisible('section_testimonials') && <TestimonialsSection />}
      {isVisible('section_news') && <NewsSection />}
      {isVisible('section_achievements') && <StudentAchievements />}
    </>
  );
}
