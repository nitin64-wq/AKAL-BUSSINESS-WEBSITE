'use client';

import React from 'react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import styles from '../about.module.css';
import { Breadcrumb } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';

const DEFAULTS = {
  hero_title: "Vice Chancellor's Message",
  hero_subtitle: 'Providing value-based quality education, learning, and research at the highest international level of excellence.',
  section_title: 'Value-Based Quality Education',
  paragraphs: [
    '“Envisioned to establish a Centre of Excellence at par with the best Universities in the world, Akal University is committed to providing value-based quality education, learning, and research at the highest international level of excellence. The University is making steady and satisfactory progress in this direction. The dynamic and outstanding faculty, innovative pedagogical practices, modern and state-of-the-art infrastructure, drug-free campus, and honours school integrated programmes in basic and fundamental sciences, commerce, and languages at Bachelor and Master Levels are the hallmark of the academic standards of this University.”',
    '“With the rapid explosion of information technology, mass media, and globalization of the world economy, insular existence is no longer feasible. Consequently, the dynamics of education have undergone qualitative changes in the recent past. The evolving higher education system in the country is producing mere literates, devoid of our rich heritage of ancient wisdom of moral, ethical, and spiritual values.”',
    '“In its endeavor to adhere to the path of ‘Sarbat Ka Bhala’ as envisioned by the Sikh Gurus, the university is committed to making value-based education accessible and affordable by providing liberal scholarships to meritorious and deserving students from all backgrounds.”',
    '“If you dream of receiving high-quality, value-based modern education in a drug-free and fully safe environment, Akal University is the right place to fulfill your aspirations. Thank you for your keen interest in the university. It will be a great pleasure for us to welcome you to the esteemed Akal University!”',
  ],
  signoff_name: '— Prof. Gurmail Singh',
  signoff_title: 'Vice Chancellor, Akal University',
  image: '/images/placeholder-faculty.jpg',
};

export default function ViceChancellorsMessagePage() {
  const { data: settings } = useFetch<Record<string, any>>('/settings', ['settings_public']);
  const d = settings?.page_about_vc_message || DEFAULTS;
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
              { label: "Vice Chancellor's Message", href: '/about/vice-chancellors-message' },
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
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>{g('signoff_title')}</span>
              </p>
            </div>
            
            {hasImage && (
              <div className={styles.storyImageFrame} style={{ position: 'relative', overflow: 'hidden' }}>
                <ImageWithFallback
                  src={g('image')}
                  fallbackSrc="/images/placeholder-faculty.jpg"
                  alt="Vice Chancellor Prof. Gurmail Singh"
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
