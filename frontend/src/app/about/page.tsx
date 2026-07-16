'use client';

import React from 'react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import styles from './about.module.css';
import { Breadcrumb } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';

const DEFAULTS = {
  hero_title: 'About Akal Business School',
  hero_subtitle: 'A globally benchmarked management education with a strong foundation in analytics, technology, and ethical leadership.',
  mba_title: 'About the MBA in AI & Business Analytics',
  mba_para1: 'The MBA in AI & Business Analytics at Akal Business School (ABS), Akal University, Talwandi Sabo is designed to deliver a globally benchmarked management education with a strong foundation in analytics, technology, and ethical leadership.',
  mba_para2: 'The program operates under the stewardship of Prof. Gurpreet Dhillon, Dean, College of Business Administration, University of Nebraska, Omaha and the philanthropic vision of The Kalgidhar Trust, blending global academic standards with value-based education and societal impact.',
  mba_image: '/storage/programs/about_img.png',
  global_mba_title: 'A Global MBA Experience',
  global_mba_text: 'Our MBA offers an American-style learning experience with 50% of the courses taught by foreign faculty, bringing international perspectives, case-based pedagogy, and global best practices into the classroom. Students receive the rigor and exposure of an international MBA at a fraction of the cost compared to leading Indian MBA programs.',
  curriculum_title: 'State-of-the-Art Curriculum in AI & Business Analytics',
  curriculum_subtitle: 'The program integrates management fundamentals with advanced analytics, ensuring graduates are industry-ready from day one.',
  curriculum_areas: ['Data Analytics, AI, & Business Intelligence', 'Predictive Modelling & Decision Sciences', 'Financial & Marketing Analytics', 'Operations & Supply Chain Analytics', 'Data Visualization & Dashboarding', 'Research-Driven Dissertation / Capstone Project'],
  tools: ['Excel', 'SPSS', 'SmartPLS', 'Power BI', 'Tableau', 'Python', 'Machine Learning', 'AI', 'SQL'],
  placement_title: '100% Placement Assistance & Paid Internships',
  placement_subtitle: 'We provide comprehensive career support to ensure every graduate is placed.',
  placement_cards: [
    { icon: '🎯', title: '100% Placement Assistance', desc: 'Full placement assistance after MBA completion' },
    { icon: '💼', title: 'Structured, Paid Internships', desc: 'Industry-embedded internship experiences' },
    { icon: '🧑‍🏫', title: 'Industry Mentorship', desc: 'Mentorship and live projects with industry leaders' },
    { icon: '🌐', title: 'Strong Corporate Linkages', desc: 'Across IT, logistics, consulting, EdTech, manufacturing, and international firms' },
  ],
  placement_highlight: 'Students in the past have gone on to pursue fully sponsored PhDs in the USA, to work at Oracle, India and other reputed MNCs.',
  placement_roles: ['Business Analysts', 'Data Analysts', 'Financial Analysts', 'BI Executives', 'Consultants', 'Entrepreneurs'],
  mou_title: 'MoUs with Top US Universities',
  mou_universities: [
    { name: 'Virginia Commonwealth University', icon: '🏛️', desc: 'Pursue higher studies in the USA without GMAT / GRE with tuition reductions.' },
    { name: 'University of North Carolina, Greensboro', icon: '🎓', desc: 'Pursue higher studies in the USA without GMAT / GRE with tuition reductions.' },
  ],
  mou_quote: 'At Akal Business School, the MBA in Business Analytics is not just a degree—it is a globally oriented, ethically grounded, and industry-integrated pathway to leadership in the data-driven economy.',
  timeline_title: 'Our Journey & Milestones',
  timeline_subtitle: 'A legacy of rapid growth, global academic integrations, and record placement drives.',
  milestones: [
    { year: '2015', title: 'Foundation of Akal University', desc: 'Established under the Kalgidhar Society, providing value-based higher education to rural youth.' },
    { year: '2018', title: 'Scaffolding Akal Business School', desc: 'Inception of management courses to develop future commerce and administration professionals.' },
    { year: '2021', title: 'US University Collaborations', desc: 'Formed partnerships and MoUs with major US institutions including VCU and UNCG.' },
    { year: '2024', title: 'Launch of AI & Analytics Core', desc: 'Embedded AI, Power BI, Python, and Tableau directly into the management curriculum.' },
    { year: '2026', title: 'Complete Full-Stack Transition', desc: 'Reaching new milestones with record 95% placements and state-of-the-art computational labs.' },
  ],
};

export default function AboutPage() {
  const { data: settings } = useFetch<Record<string, any>>('/settings', ['settings_public']);
  const d = settings?.page_about_main || DEFAULTS;
  const g = (key: string) => d[key] ?? (DEFAULTS as any)[key];

  const curriculumAreas = g('curriculum_areas');
  const tools = g('tools');
  const placementRoles = g('placement_roles');
  const milestones = g('milestones');
  const placementCards = g('placement_cards');
  const mouUniversities = g('mou_universities');
  const hasImage = !!d.mba_image;

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
            ]}
          />
          <h1 className={styles.heroTitle}>{g('hero_title')}</h1>
          <p className={styles.heroSubtitle}>{g('hero_subtitle')}</p>
        </div>
      </div>

      {/* About the MBA Program */}
      <section className={styles.contentSection}>
        <div className="container">
          <div className={`${styles.splitGrid} ${!hasImage ? styles.noImage : ''}`}>
            <div className={styles.storyContent}>
              <h2>{g('mba_title')}</h2>
              <p>{g('mba_para1')}</p>
              <p>{g('mba_para2')}</p>
            </div>
            
            {hasImage && (
              <div className={styles.storyImageFrame} style={{ position: 'relative', overflow: 'hidden' }}>
                <ImageWithFallback
                  src={g('mba_image')}
                  fallbackSrc="/images/placeholder-campus.jpg"
                  alt="Akal Business School Academic Block"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Global MBA Experience */}
      <section className={styles.featureSection}>
        <div className="container">
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🌍</div>
            <h2 className={styles.featureTitle}>{g('global_mba_title')}</h2>
            <p className={styles.featureText}>{g('global_mba_text')}</p>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className={styles.contentSection} style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 'var(--text-3xl)', color: '#1A1A2E', marginBottom: 'var(--space-2)' }}>
            {g('curriculum_title')}
          </h2>
          <p style={{ textAlign: 'center', color: '#555B6E', fontSize: 'var(--text-base)', marginBottom: 'var(--space-10)', maxWidth: '700px', margin: '0 auto var(--space-10)' }}>
            {g('curriculum_subtitle')}
          </p>

          <div className={styles.curriculumGrid}>
            {curriculumAreas.map((area: string, idx: number) => (
              <div key={idx} className={styles.curriculumCard}>
                <div className={styles.curriculumNumber}>{String(idx + 1).padStart(2, '0')}</div>
                <h3 className={styles.curriculumTitle}>{area}</h3>
              </div>
            ))}
          </div>

          {/* Tools */}
          <div className={styles.toolsSection}>
            <h3 style={{ textAlign: 'center', fontSize: 'var(--text-xl)', color: '#1A1A2E', marginBottom: 'var(--space-4)' }}>
              Hands-On Expertise In
            </h3>
            <div className={styles.toolsGrid}>
              {tools.map((tool: string, idx: number) => (
                <span key={idx} className={styles.toolBadge}>{tool}</span>
              ))}
            </div>
            <p style={{ textAlign: 'center', color: '#555B6E', fontSize: 'var(--text-sm)', marginTop: 'var(--space-4)', maxWidth: '600px', margin: 'var(--space-4) auto 0' }}>
              Combining managerial insight with technical depth.
            </p>
          </div>
        </div>
      </section>

      {/* Placement Section */}
      <section className={styles.featureSection} style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 'var(--text-3xl)', color: '#FFFFFF', marginBottom: 'var(--space-2)' }}>
            {g('placement_title')}
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-10)', maxWidth: '700px', margin: '0 auto var(--space-10)' }}>
            {g('placement_subtitle')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
            {placementCards.map((item: any, idx: number) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>{item.icon}</div>
                <h3 style={{ color: '#C9A227', fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-sm)', lineHeight: '1.6', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(201, 162, 39, 0.1)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', border: '1px solid rgba(201, 162, 39, 0.3)', textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'var(--text-sm)', lineHeight: '1.7', margin: 0 }}>
              {g('placement_highlight')}
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>Our graduates work as:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-2)' }}>
              {placementRoles.map((role: string, idx: number) => (
                <span key={idx} style={{ background: 'rgba(201, 162, 39, 0.15)', color: '#C9A227', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-pill)', fontSize: 'var(--text-xs)', fontWeight: 'bold', border: '1px solid rgba(201, 162, 39, 0.3)' }}>{role}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MoUs Section */}
      <section className={styles.contentSection} style={{ backgroundColor: '#F5F7FA' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'var(--text-3xl)', color: '#1A1A2E', marginBottom: 'var(--space-4)' }}>
              {g('mou_title')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-8)' }}>
              {mouUniversities.map((uni: any, idx: number) => (
                <div key={idx} style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: 'var(--space-8)', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)', border: '1px solid #E8ECF4', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>{uni.icon}</div>
                  <h3 style={{ fontSize: 'var(--text-lg)', color: '#1A1A2E', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>{uni.name}</h3>
                  <p style={{ color: '#555B6E', fontSize: 'var(--text-sm)', lineHeight: '1.6', margin: 0 }}>{uni.desc}</p>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 'var(--space-8)', color: '#555B6E', fontSize: 'var(--text-base)', lineHeight: '1.8', fontStyle: 'italic', background: 'linear-gradient(135deg, rgba(201,162,39,0.05), rgba(26,26,46,0.03))', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid #C9A227' }}>
              {g('mou_quote')}
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className={styles.timelineSection}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 'var(--text-3xl)', color: '#1A1A2E', marginBottom: 'var(--space-2)' }}>
            {g('timeline_title')}
          </h2>
          <p style={{ textAlign: 'center', color: '#555B6E', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-10)', maxWidth: '600px', margin: '0 auto' }}>
            {g('timeline_subtitle')}
          </p>

          <div className={styles.timeline}>
            {milestones.map((item: any, idx: number) => (
              <div key={idx} className={styles.timelineItem}>
                <div className={styles.timelineBadge}>{idx + 1}</div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineYear}>{item.year}</div>
                  <h3 className={styles.timelineTitle}>{item.title}</h3>
                  <p className={styles.timelineDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
