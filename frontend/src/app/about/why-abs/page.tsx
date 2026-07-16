'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/ui';
import styles from '../about.module.css';
import { useFetch } from '@/hooks/useFetch';

const DEFAULT_HIGHLIGHTS = [
  {
    title: 'Focus on Business Analytics',
    desc: 'Enroll in our cutting-edge curriculum tailored to meet the demands of the dynamic business landscape.'
  },
  {
    title: 'Modeled After U.S. Excellence',
    desc: 'Experience a top-notch academic structure mirroring the rigor of leading U.S. universities, ensuring a world-class education.'
  },
  {
    title: 'International Faculty Expertise',
    desc: 'Enjoy a global learning environment with 50% of our faculty bringing diverse international perspectives to the classroom.'
  },
  {
    title: 'Distinguished Mentors',
    desc: 'Benefit from guidance by industry experts, including Prof. Gurpreet Dhillon (AI & Cybersecurity expert) and Prof. Somendra Pant (academic of international repute).'
  },
  {
    title: 'Small Class Size',
    desc: 'Thrive in a conducive learning environment with small class sizes that ensure individualized attention and meaningful interactions.'
  },
  {
    title: '100% Placement Record',
    desc: 'Embark on your professional journey with confidence, as our program boasts a 100% placement rate for the first batch at competitive salaries.'
  },
  {
    title: 'PhD & Global Opportunities',
    desc: 'Seize opportunities for academic growth, with students securing fully funded PhD positions at prestigious U.S. universities and placements in Dubai and the UK.'
  },
  {
    title: 'VCU Partnership',
    desc: 'Explore international pathways with Virginia Commonwealth University. Master’s Program in Analytics without GRE/GMAT, 30% fee waiver, and seamless course transfers.'
  }
];

const DEFAULT_FAQS = [
  {
    q: 'What sets ABS apart from other business analytics programs?',
    a: 'ABS stands out with its focus on cutting-edge analytics, a world-class academic structure modeled after leading U.S. universities, and a commitment to social impact, providing a holistic learning experience.'
  },
  {
    q: 'How does the VCU partnership benefit students?',
    a: 'Our partnership with VCU allows students to pursue the Master’s Program in Analytics without GRE/GMAT, with a 30% fee waiver and the added advantage of course transfers between ABS and VCU.'
  },
  {
    q: 'Are scholarships available for students?',
    a: 'Yes, ABS offers generous scholarship programs backed by The Kalgidhar Trust to make quality education more accessible to aspiring students.'
  },
  {
    q: 'How rigorous is the program?',
    a: 'This program is rigorous enough to provide a nice blend of Data Science and Management. It is divided into 8 terms with an 11-week internship at the end of the 1st year.'
  }
];

const DEFAULTS = {
  hero_title: 'Why Choose ABS?',
  hero_subtitle: 'Redefine your future with a premium education in Business Analytics, backed by international collaborations and spiritual values.',
  intro_title: 'Get the Opportunity You Desire & the Excellence to Make it Happen',
  intro_text: 'Akal Business School (ABS) stands out as a premier choice for pursuing an MBA in Business Analytics. Our program is designed to empower future leaders with cutting-edge knowledge, global perspectives, and a commitment to social impact.',
  highlights_title: 'Unparalleled Program Highlights',
  highlights: DEFAULT_HIGHLIGHTS,
  faqs: DEFAULT_FAQS
};

export default function WhyABSPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { data: settings } = useFetch<Record<string, any>>('/settings', ['settings_public']);
  const d = settings?.page_about_why_abs || DEFAULTS;
  const g = (key: string) => d[key] ?? (DEFAULTS as any)[key];

  const highlights = g('highlights');
  const faqs = g('faqs');

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'Why ABS', href: '/about/why-abs' },
            ]}
          />
          <h1 className={styles.heroTitle}>{g('hero_title')}</h1>
          <p className={styles.heroSubtitle}>{g('hero_subtitle')}</p>
        </div>
      </div>

      {/* Intro Section */}
      <section className={styles.contentSection} style={{ paddingBottom: '0' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <h2 style={{ fontSize: 'var(--text-3xl)', color: '#1A1A2E', marginBottom: 'var(--space-4)' }}>
              {g('intro_title')}
            </h2>
            <p style={{ color: '#555B6E', fontSize: 'var(--text-base)', lineHeight: '1.7' }}>
              {g('intro_text')}
            </p>
          </div>
        </div>
      </section>

      {/* Grid Highlights */}
      <section style={{ padding: 'var(--space-12) 0', backgroundColor: '#F8F9FA' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-10)', fontSize: 'var(--text-2xl)', color: '#1A1A2E' }}>
            {g('highlights_title')}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-6)'
          }}>
            {highlights.map((item: any, idx: number) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-6)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  border: '1px solid #ECECEC'
                }}
              >
                <h3 style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'bold',
                  color: '#1A1A2E',
                  marginBottom: 'var(--space-2)'
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
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.contentSection}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-8)', fontSize: 'var(--text-3xl)', color: '#1A1A2E' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {faqs.map((faq: any, idx: number) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: 'var(--space-4) var(--space-6)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: 'bold',
                      fontSize: 'var(--text-sm)',
                      color: '#1A1A2E',
                      backgroundColor: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      fontSize: 'var(--text-sm)'
                    }}>
                      ▼
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{
                      padding: 'var(--space-4) var(--space-6)',
                      borderTop: '1px solid #E5E7EB',
                      backgroundColor: '#F9FAFB',
                      color: '#555B6E',
                      fontSize: 'var(--text-sm)',
                      lineHeight: '1.6'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
