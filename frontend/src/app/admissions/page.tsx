'use client';

import React from 'react';
import styles from './admissions.module.css';
import { Breadcrumb, Button } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';
import Link from 'next/link';

const DEFAULT_STEPS = [
  {
    num: 1,
    title: 'Select Program & Check Eligibility',
    desc: 'Verify that you satisfy the qualifying requirements for your desired course (MBA in AI & Business Analytics, BBA, PhD).'
  },
  {
    num: 2,
    title: 'Fill Application Form',
    desc: 'Apply directly online via our comprehensive application wizard or utilize our Google Forms channel.'
  },
  {
    num: 3,
    title: 'Document Upload & Review',
    desc: 'Submit academic transcript certificates, standard test scores (GMAT/CAT/MAT if applicable), and identity records.'
  },
  {
    num: 4,
    title: 'Admission Interview',
    desc: 'Shortlisted candidates will be invited for a personal counseling and analytical evaluation interview.'
  },
  {
    num: 5,
    title: 'Securing Seat & Fee payment',
    desc: 'Accepted students secure their admission by completing the initial tuition fee installment.'
  }
];

const DEFAULTS = {
  hero_title: 'Admissions Overview',
  hero_subtitle: 'A guide to securing your place at Akal Business School for the 2026-2028 academic session.',
  how_to_apply_title: 'How to Apply',
  how_to_apply_text: 'Admissions to Akal Business School are open to students who demonstrate analytical potential, academic consistency, and moral character. Follow our streamlined step-by-step application flow:',
  steps: DEFAULT_STEPS,
  portal_title: 'Admissions Portal',
  portal_text: 'Admissions are currently active for the 2026-2028 batch. Apply directly today using our built-in application wizard, or submit details via our official Google Forms portal.',
};

export default function AdmissionsPage() {
  const { data: settings } = useFetch<Record<string, any>>('/settings', ['settings_public']);
  const d = settings?.page_admissions || DEFAULTS;
  const g = (key: string) => d[key] ?? (DEFAULTS as any)[key];

  const steps = g('steps');
  const googleFormLink = settings?.google_form_link || 'https://forms.gle/VjWqKM1j4cMrG2kt8';

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Admissions', href: '/admissions' },
            ]}
          />
          <h1 className={styles.heroTitle}>{g('hero_title')}</h1>
          <p className={styles.heroSubtitle}>{g('hero_subtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.splitGrid}>
            <div className={styles.contentBlock}>
              <h2>{g('how_to_apply_title')}</h2>
              <p>{g('how_to_apply_text')}</p>
              
              <div className={styles.stepsList}>
                {steps.map((step: any, idx: number) => (
                  <div key={idx} className={styles.stepItem}>
                    <div className={styles.stepNum}>{idx + 1}</div>
                    <div className={styles.stepInfo}>
                      <h4>{step.title}</h4>
                      <p>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.contentBlock} style={{
              background: '#1A1A2E',
              border: '2px solid #C9A227',
              padding: 'var(--space-8)',
              borderRadius: 'var(--radius-lg)'
            }}>
              <h3 style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-4)' }}>{g('portal_title')}</h3>
              <p style={{ color: '#D1D5DB' }}>
                {g('portal_text')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                <Link href="/admissions/apply" passHref legacyBehavior>
                  <Button variant="primary" size="lg">Start Online Application</Button>
                </Link>
                <a href={googleFormLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="lg" style={{ width: '100%' }}>Apply via Google Forms</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
