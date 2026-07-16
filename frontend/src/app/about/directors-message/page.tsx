'use client';

import React from 'react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import styles from '../about.module.css';
import { Breadcrumb } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';

const DEFAULTS = {
  hero_title: "Director's Message",
  hero_subtitle: 'Welcoming you to the core of computational business administration and analytical excellence.',
  section_title: 'Bridging Tech & Management',
  paragraphs: [
    '“It is my distinct pleasure to welcome you to Akal Business School (ABS). We are at a critical juncture in business history. Traditional frameworks are shifting, and data has emerged as the single most critical asset for decision-making. Our mission at ABS is to equip students to thrive in this new landscape.”',
    '“Our curriculum is fully aligned with industry expectations, with intensive training in tools like Power BI, Tableau, Python, SQL, and ML integrated directly into the core management subjects. By keeping our class sizes small and focused, we ensure that every student receives individualized attention and guidance.”',
    '“Our partnerships with leading US universities and top corporate recruiters ensure that ABS graduates possess the skills and global mindset needed to make a substantial impact from day one. We look forward to guiding you on this transformative journey.”',
  ],
  signoff_name: '— Director, Akal Business School',
  signoff_email: 'director_abs@auts.ac.in',
  image: '/storage/faculty/gurpreet-dhillon.jpg',
};

export default function DirectorsMessagePage() {
  const { data: settings } = useFetch<Record<string, any>>('/settings', ['settings_public']);
  const d = settings?.page_about_directors_message || DEFAULTS;
  const g = (key: string) => d[key] ?? (DEFAULTS as any)[key];
  const hasImage = !!d.image;

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: "Director's Message", href: '/about/directors-message' },
            ]}
          />
          <h1 className={styles.heroTitle}>{g('hero_title')}</h1>
          <p className={styles.heroSubtitle}>{g('hero_subtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <section className={styles.contentSection}>
        <div className="container">
          <div className={`${styles.splitGrid} ${!hasImage ? styles.noImage : ''}`}>
            <div className={styles.storyContent}>
              <h2>{g('section_title')}</h2>
              {(g('paragraphs') || []).map((para: string, idx: number) => (
                <p key={idx}>{para}</p>
              ))}
              <p style={{ fontWeight: 'bold', color: 'var(--color-gold)', marginTop: 'var(--space-6)' }}>
                {g('signoff_name')}<br />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>{g('signoff_email')}</span>
              </p>
            </div>
            
            {hasImage && (
              <div className={styles.storyImageFrame} style={{ position: 'relative', overflow: 'hidden' }}>
                <ImageWithFallback
                  src={g('image')}
                  fallbackSrc="/images/placeholder-faculty.jpg"
                  alt="Director, Akal Business School"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
