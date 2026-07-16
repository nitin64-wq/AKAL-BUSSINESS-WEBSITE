'use client';

import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import styles from '../about.module.css';
import { Breadcrumb } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';

const DEFAULTS = {
  hero_title: "Chancellor's Message",
  hero_subtitle: 'Words of guidance and inspiration for the next generation of business leaders and global visionaries.',
  section_title: 'Developing Ethical Leaders',
  paragraphs: [
    '\u201CWelcome to Akal Business School, where we strive to shape minds that are technically competent and ethically grounded. The global business ecosystem is evolving at an unprecedented pace, driven by rapid advancements in automation, artificial intelligence, and analytics.\u201D',
    '\u201CIn this context, technical capability alone is not sufficient. We need leaders who possess the wisdom to use these tools for the betterment of society and the integrity to make choices that respect human values. At ABS, our goal is to build an environment that nurtures intellectual curiosity, analytical precision, and moral strength.\u201D',
    '\u201CI invite you to explore our programs, engage with our distinguished faculty, and become part of a community dedicated to excellence, innovation, and service.\u201D',
  ],
  signoff: '\u2014 Chancellor, Akal University',
  image: '/images/placeholder-faculty.jpg',
};

export default function ChancellorsMessagePage() {
  const { data: settings } = useFetch<Record<string, any>>('/settings', ['settings_public']);
  const d = settings?.page_about_chancellors_message || DEFAULTS;
  const g = (key: string) => d[key] ?? (DEFAULTS as any)[key];
  const hasImage = !!d.image;

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: "Chancellor's Message", href: '/about/chancellors-message' },
            ]}
          />
          <h1 className={styles.heroTitle}>{g('hero_title')}</h1>
          <p className={styles.heroSubtitle}>{g('hero_subtitle')}</p>
        </div>
      </div>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={`${styles.splitGrid} ${!hasImage ? styles.noImage : ''}`}>
            <div className={styles.storyContent}>
              <h2>{g('section_title')}</h2>
              {(g('paragraphs') || []).map((para: string, idx: number) => (
                <p key={idx}>{para}</p>
              ))}
              <p style={{ fontWeight: 'bold', color: 'var(--color-gold)', marginTop: 'var(--space-6)' }}>
                {g('signoff')}
              </p>
            </div>
            
            {hasImage && (
              <div className={styles.storyImageFrame} style={{ position: 'relative', overflow: 'hidden' }}>
                <ImageWithFallback
                  src={g('image')}
                  fallbackSrc="/images/placeholder-faculty.jpg"
                  alt="Chancellor, Akal University"
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
