'use client';

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui';
import styles from '../about/about.module.css';
import { useFetch } from '@/hooks/useFetch';

const DEFAULT_FACILITIES = [
  {
    title: 'Library & Learning Centre',
    desc: 'Our state-of-the-art library is RFID-automated, runs on Koha LMS, features silent reading rooms, and provides access to digital journals and databases.',
    href: '/facilities/library',
    icon: '📚'
  },
  {
    title: 'Residential Hostels',
    desc: 'Separate, secure hostels for boys and girls offering nutritious vegetarian food, air-conditioned reading rooms, indoor gymnasiums, and a spiritual prayer hall.',
    href: '/facilities/hostels',
    icon: '🏢'
  }
];

const DEFAULTS = {
  hero_title: 'Campus Facilities',
  hero_subtitle: 'Providing a world-class environment with advanced learning hubs and comfortable, drug-free residential services.',
  section_title: 'Infrastructure Designed for Excellence',
  section_text: 'At Akal Business School, we believe that learning goes beyond the classroom. Our campus infrastructure is designed to provide students with the resources they need for both intellectual growth and comfortable living.',
  facilities: DEFAULT_FACILITIES,
};

export default function FacilitiesIndexPage() {
  const { data: settings } = useFetch<Record<string, any>>('/settings', ['settings_public']);
  const d = settings?.page_facilities || DEFAULTS;
  const g = (key: string) => d[key] ?? (DEFAULTS as any)[key];

  const facilities = g('facilities');

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Facilities', href: '/facilities' },
            ]}
          />
          <h1 className={styles.heroTitle}>{g('hero_title')}</h1>
          <p className={styles.heroSubtitle}>{g('hero_subtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <section className={styles.contentSection}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-8)', fontSize: 'var(--text-3xl)', color: '#1A1A2E' }}>
            {g('section_title')}
          </h2>
          <p style={{ textAlign: 'center', color: '#555B6E', fontSize: 'var(--text-base)', maxWidth: '700px', margin: '0 auto var(--space-12) auto', lineHeight: '1.7' }}>
            {g('section_text')}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 'var(--space-8)',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {facilities.map((facility: any, idx: number) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-8)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid #ECECEC',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div>
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: 'var(--space-4)'
                  }}>
                    {facility.icon}
                  </div>
                  <h3 style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 'bold',
                    color: '#1A1A2E',
                    marginBottom: 'var(--space-3)'
                  }}>
                    {facility.title}
                  </h3>
                  <p style={{
                    color: '#555B6E',
                    fontSize: 'var(--text-sm)',
                    lineHeight: '1.6',
                    marginBottom: 'var(--space-6)'
                  }}>
                    {facility.desc}
                  </p>
                </div>
                <Link
                  href={facility.href}
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--color-gold)',
                    color: '#FFFFFF',
                    padding: 'var(--space-3) var(--space-6)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 'bold',
                    fontSize: 'var(--text-sm)',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease'
                  }}
                  className="btn-hover-opacity"
                >
                  Explore Facility &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
