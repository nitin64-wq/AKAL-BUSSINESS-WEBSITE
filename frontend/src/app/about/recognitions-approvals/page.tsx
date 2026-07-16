'use client';

import React from 'react';
import { Breadcrumb } from '@/components/ui';
import styles from '../about.module.css';
import { useFetch } from '@/hooks/useFetch';

const DEFAULTS = {
  hero_title: 'Recognitions & Approvals',
  hero_subtitle: 'Proudly recognized and approved by leading statutory bodies and international quality organizations.',
  section_title: 'Official Recognitions & Certifications',
  recognitions: [
    {
      title: 'University Grants Commission (UGC)',
      desc: 'Akal University is duly recognized by the University Grants Commission (UGC) – a statutory body of the Government of India established for the coordination, determination, and maintenance of standards of university education in India.',
      badge: 'UGC'
    },
    {
      title: 'Government of Punjab',
      desc: 'Akal University is a full-fledged University established under the Punjab State Legislature Act No. 25 of 2015.',
      badge: 'PUNJAB GOVT'
    },
    {
      title: 'National Council for Teacher Education (NCTE)',
      desc: 'Our Four-Year Integrated B.Sc.-B.Ed. and B.A.-B.Ed. programs are fully approved by the National Council for Teacher Education, a statutory body of the Government of India.',
      badge: 'NCTE'
    },
    {
      title: 'ISO 9001:2015 Certification',
      desc: 'Certified Quality Management System demonstrating our commitment to excellence in providing higher education and administrative services.',
      badge: 'ISO 9001'
    },
    {
      title: 'ISO 45001:2018 Certification',
      desc: 'Occupational Health and Safety Management System certified, ensuring a safe, secure, and healthy campus environment.',
      badge: 'ISO 45001'
    }
  ]
};

export default function RecognitionsApprovalsPage() {
  const { data: settings } = useFetch<Record<string, any>>('/settings', ['settings_public']);
  const d = settings?.page_about_recognitions || DEFAULTS;
  const g = (key: string) => d[key] ?? (DEFAULTS as any)[key];

  const recognitions = g('recognitions');

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'Recognitions & Approvals', href: '/about/recognitions-approvals' },
            ]}
          />
          <h1 className={styles.heroTitle}>{g('hero_title')}</h1>
          <p className={styles.heroSubtitle}>{g('hero_subtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <section className={styles.contentSection}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-10)', fontSize: 'var(--text-3xl)', color: '#1A1A2E' }}>
            {g('section_title')}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-6)',
            marginTop: 'var(--space-6)'
          }}>
            {recognitions.map((item: any, idx: number) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-6)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid #ECECEC',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                className="recognition-card"
              >
                <div>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(157, 34, 53, 0.1)',
                    color: 'var(--color-gold)',
                    fontWeight: 'bold',
                    fontSize: 'var(--text-xs)',
                    padding: 'var(--space-1) var(--space-3)',
                    borderRadius: 'var(--radius-full)',
                    marginBottom: 'var(--space-4)',
                    textTransform: 'uppercase'
                  }}>
                    {item.badge}
                  </div>
                  <h3 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'bold',
                    color: '#1A1A2E',
                    marginBottom: 'var(--space-3)'
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    color: '#555B6E',
                    fontSize: 'var(--text-sm)',
                    lineHeight: '1.6'
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
