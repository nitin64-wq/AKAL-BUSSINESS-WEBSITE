import React from 'react';
import styles from '../other-pages.module.css';
import { Breadcrumb } from '@/components/ui';

export const metadata = {
  title: 'Campus Life | Akal Business School',
  description: 'Explore life at Akal Business School, featuring state-of-the-art computational labs, smart classrooms, student clubs, and hostels.',
};

export default function CampusLifePage() {
  const sections = [
    {
      title: 'Smart Analytics Classrooms',
      desc: 'ABS classrooms are equipped with high-definition projection, multi-channel sound systems, and dedicated power grids for student laptops, facilitating collaborative real-time analytics drills.'
    },
    {
      title: 'Innovation & Computational Lab',
      desc: 'Our labs host high-performance computer terminals pre-installed with analytics systems (Tableau, Power BI, Python libraries, SQL database clients, SPSS) to support diagnostic and predictive research.'
    },
    {
      title: 'Vibrant Student Clubs',
      desc: 'From the Analytics Club to the Cultural Committee and Sports Society, students engage in multi-disciplinary groups that build leadership, project coordination, and teamwork.'
    },
    {
      title: 'Modern Hostel Accommodation',
      desc: 'Set in the peaceful, distraction-free environment of Baru Sahib, hostellers enjoy spacious rooms, nutritious vegetarian dining, comprehensive gym installations, and round-the-clock security.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Campus Life', href: '/campus-life' },
            ]}
          />
          <h1 className={styles.heroTitle}>Campus Life at ABS</h1>
          <p className={styles.heroSubtitle}>
            A serene, distraction-free, and value-based ecosystem designed to foster professional capability and moral integrity.
          </p>
        </div>
      </div>

      {/* Main Details */}
      <section className={styles.section}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {sections.map((sec, idx) => (
              <div key={idx} style={{
                background: 'var(--gradient-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-8)',
                boxShadow: 'var(--shadow-card)',
              }}>
                <h2 style={{
                  color: 'var(--color-gold)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-xl)',
                  marginBottom: 'var(--space-2)'
                }}>{sec.title}</h2>
                <p style={{
                  color: 'var(--color-off-white)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 'var(--leading-relaxed)',
                  margin: 0
                }}>{sec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
