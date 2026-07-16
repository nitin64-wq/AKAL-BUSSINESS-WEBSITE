'use client';

import React from 'react';
import { SectionHeader } from '@/components/ui';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { useFetch } from '@/hooks/useFetch';
import styles from './WhyABSSection.module.css';

const DEFAULT_FEATURES = [
  { title: '50% International Faculty', desc: 'Learn directly from foreign professors and global business researchers.' },
  { title: 'USA University MoUs', desc: 'Academic pathways, summer schools, and student exchanges with top US institutes.' },
  { title: 'AI & Business Analytics Core', desc: 'Curriculum fully embedded with Power BI, Tableau, Python, SQL, and Machine Learning.' },
  { title: 'Paid Corporate Internships', desc: 'Gain hands-on corporate experience with stipends during the course of study.' },
  { title: '100% Placement Assistance', desc: 'Specialized corporate placement cell with consistent high-paying mock drills.' },
  { title: 'Industry Certifications', desc: 'Graduate with career-advancing professional certifications integrated in modules.' },
];

export const WhyABSSection: React.FC = () => {
  const { data: settings, isLoading } = useFetch<Record<string, any>>(
    '/settings',
    ['settings_public']
  );

  if (isLoading || !settings) {
    return null;
  }

  const hasImage = !!settings.why_abs_image;

  // Read editable content from settings, fall back to defaults
  const content = settings.section_why_abs_content || {};
  const title = content.title || 'Why Future Leaders Choose ABS';
  const subtitle = content.subtitle || 'The ABS Advantage';
  const description = content.description || 'We deliver a premium management education ecosystem, blending advanced technical analytics tools with strategic leadership paradigms.';
  const features = content.features || DEFAULT_FEATURES;

  return (
    <section className={`${styles.section} sectionLight`}>
      <div className="container">
        <div className={`${styles.grid} ${!hasImage ? styles.noImage : ''}`}>
          {/* Left Column (Header & Image Mockup) */}
          <div className={styles.imageCol}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', width: '100%', alignItems: 'flex-start' }}>
              <SectionHeader
                title={title}
                subtitle={subtitle}
                align="left"
                theme="light"
                description={description}
              />
              {hasImage && (
                <div className={styles.imageFrame} style={{ position: 'relative', overflow: 'hidden' }}>
                  <ImageWithFallback
                    src={settings.why_abs_image}
                    fallbackSrc="/images/placeholder-campus.jpg"
                    alt="Akal Business School Campus Life"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Feature Grid) */}
          <div className={styles.featureGrid}>
            {features.map((feat: any, idx: number) => (
              <div key={idx} className={styles.featureCard}>
                <h3 className={styles.featureTitle}>{feat.title}</h3>
                <p className={styles.featureDesc}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
