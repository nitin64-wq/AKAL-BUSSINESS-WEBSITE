'use client';

import React from 'react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import styles from '../about.module.css';
import { Breadcrumb } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';

const DEFAULTS = {
  hero_title: 'The Kalgidhar Society',
  hero_subtitle: 'Transforming rural lives through value-based modern education, healthcare, and social welfare.',
  section_title: 'Serving Humanity with Devotion',
  para1: 'The Kalgidhar Society \u2013 Baru Sahib is a non-profit charitable organisation focussed on providing quality education to fight against the alarming rise in drugs and alcohol abuse. With equal stress on Healthcare, Women Empowerment, and Social Welfare, the organisation has been instrumental in the socio-economic uplift of the poor in the far-flung rural areas of North India.',
  para2: 'Established under the guidance of spiritual leaders, the Society runs Akal Academies and two universities (Akal University at Talwandi Sabo and Eternal University at Baru Sahib). These institutions are committed to providing a secure, distraction-free environment that combines the best of modern scientific education with deep moral and spiritual foundations.',
  pillars_title: 'Key Pillars of Impact',
  pillars: [
    {
      title: 'Value-Based Education',
      desc: 'Over 129 Akal Academies in rural Punjab, Haryana, Himachal Pradesh, Rajasthan, and Uttar Pradesh, educating more than 70,000 students.',
    },
    {
      title: 'Healthcare Services',
      desc: 'Running the Akal Charitable Hospital at Baru Sahib and organizing regular free medical and de-addiction camps in rural pockets.',
    },
    {
      title: 'Women Empowerment',
      desc: 'Providing vocational training and employment opportunities to rural women, fostering independence and confidence.',
    },
    {
      title: 'Drug De-addiction',
      desc: 'Combating substance abuse through rehabilitation, spiritual counseling, and healthy environment cultivation.',
    },
  ],
  image: '/storage/programs/about_img.png',
};

export default function KalgidharSocietyPage() {
  const { data: settings } = useFetch<Record<string, any>>('/settings', ['settings_public']);
  const d = settings?.page_about_kalgidhar || DEFAULTS;
  const g = (key: string) => d[key] ?? (DEFAULTS as any)[key];
  const hasImage = !!d.image;

  const pillars = g('pillars');

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'The Kalgidhar Society', href: '/about/the-kalgidhar-society' },
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
              <p>{g('para1')}</p>
              <p>{g('para2')}</p>
              
              <h3 style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-3)', color: '#1A1A2E' }}>{g('pillars_title')}</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: 'var(--space-6)', color: '#555B6E' }}>
                {pillars.map((pillar: any, idx: number) => (
                  <li key={idx} style={{ marginBottom: 'var(--space-2)' }}>
                    <strong>{pillar.title}:</strong> {pillar.desc}
                  </li>
                ))}
              </ul>
            </div>
            
            {hasImage && (
              <div className={styles.storyImageFrame} style={{ position: 'relative', overflow: 'hidden' }}>
                <ImageWithFallback
                  src={g('image')}
                  fallbackSrc="/images/placeholder-campus.jpg"
                  alt="The Kalgidhar Society Baru Sahib"
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
