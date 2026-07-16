'use client';

import React from 'react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import styles from '../about.module.css';
import { Breadcrumb } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';

const DEFAULTS = {
  hero_title: 'Our Visionary Founders',
  hero_subtitle: 'ABS is founded on the spiritual and academic legacy of Sant Attar Singh Ji Mastuana, realized through the lifelong dedication of Baba Iqbal Singh Ji.',
  section_title: 'Baba Iqbal Singh Ji',
  section_para1: 'A retired Director of Agriculture, Himachal Pradesh, Baba Iqbal Singh Ji (revered as Shiromani Panth Rattan) dedicated his post-retirement life to educational reform. Under his leadership, the Kalgidhar Society established 129 rural academies, 2 universities, and multiple charitable healthcare hubs across Northern India.',
  section_para2: 'His core philosophy was "Value-Based Education" — marrying high-quality modern sciences and humanities with moral and spiritual fortitude, creating global citizens who lead with integrity.',
  kalgidhar_title: 'The Kalgidhar Society',
  kalgidhar_para1: 'The Kalgidhar Society (Baru Sahib) is a non-profit organization that manages educational systems, healthcare units, and social welfare programs across Punjab, Haryana, Rajasthan, Uttar Pradesh, and Himachal Pradesh.',
  kalgidhar_para2: 'The society continues to expand its academic reach, ensuring that modern tools like AI, advanced computations, and big data technologies are taught alongside moral sciences to uplift rural underrepresented youth.',
  image: '/storage/programs/webpage-auts-aboutus-3jun23.png',
};

export default function FoundersPage() {
  const { data: settings } = useFetch<Record<string, any>>('/settings', ['settings_public']);
  const d = settings?.page_about_founders || DEFAULTS;
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
              { label: 'Founders', href: '/about/founders' },
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
              <p>{g('section_para1')}</p>
              <p>{g('section_para2')}</p>
              
              <h2 style={{ marginTop: 'var(--space-8)' }}>{g('kalgidhar_title')}</h2>
              <p>{g('kalgidhar_para1')}</p>
              <p>{g('kalgidhar_para2')}</p>
            </div>
            
            {hasImage && (
              <div className={styles.storyImageFrame} style={{ position: 'relative', overflow: 'hidden' }}>
                <ImageWithFallback
                  src={g('image')}
                  fallbackSrc="/images/placeholder-campus.jpg"
                  alt="Baba Iqbal Singh Ji / The Kalgidhar Society"
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
