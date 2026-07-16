'use client';

import React from 'react';
import styles from '../academics.module.css';
import { Breadcrumb, Button, Skeleton } from '@/components/ui';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useFetch } from '@/hooks/useFetch';
import type { Program } from '@/types';

export default function MbaProgramPage() {
  const { data: programs, isLoading } = useFetch<Program[]>(
    '/programs',
    ['programs_all']
  );

  const program = programs?.find(p => p.type === 'MBA');

  const tools = [
    'Power BI', 'Tableau', 'Python', 'SQL', 
    'SPSS', 'SmartPLS', 'Machine Learning', 'Generative AI'
  ];

  const highlights = program?.highlights && program.highlights.length > 0
    ? program.highlights
    : [
        'Hands-on practical analytics laboratory drills',
        'Mentorship by foreign professors and international researchers',
        'Specialized workshops on predictive financial models and cognitive systems',
        'Compulsory paid corporate internships with corporate partners',
        'Access to international semesters and joint research projects'
      ];

  const annualFeeStr = program?.fee_per_year
    ? `₹${Number(program.fee_per_year).toLocaleString('en-IN')} / year`
    : '₹1,00,000 / year';

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Academics', href: '/academics' },
              { label: 'MBA', href: '/academics/mba' },
            ]}
          />
          <h1 className={styles.heroTitle}>
            {isLoading ? <Skeleton width={200} height={40} /> : (program?.title || 'MBA in Business Analytics')}
          </h1>
          <p className={styles.heroSubtitle}>
            {isLoading ? <Skeleton width={400} height={20} /> : (program?.description ? (program.description.split('.')[0] + '.') : 'Our flagship 2-Year management program designed to build computational intelligence and visionary leadership.')}
          </p>
        </div>
      </div>

      {/* Main Details */}
      <section style={{ padding: 'var(--space-12) 0' }}>
        <div className="container">
          <div className={styles.detailGrid}>
            <div className={styles.mainContent}>
              <div>
                <h2 className={styles.detailTitle}>Program Overview</h2>
                <p className={styles.detailDesc}>
                  {isLoading ? (
                    <>
                      <Skeleton height={20} className="mb-2" />
                      <Skeleton height={20} className="mb-2" />
                      <Skeleton height={20} className="mb-2" />
                    </>
                  ) : (
                    program?.description || 'The MBA in Business Analytics at Akal Business School is a comprehensive, multi-disciplinary course designed to bridge the gap between core management science and modern computation. Master data extraction, diagnostic reporting, forecasting modeling, and cognitive decision frameworks.'
                  )}
                </p>
              </div>

              <div>
                <h2 className={styles.detailTitle}>Key Program Highlights</h2>
                <div className={styles.checklist}>
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className={styles.checkItem}>
                        <Skeleton width={300} height={20} />
                      </div>
                    ))
                  ) : (
                    highlights.map((h, i) => (
                      <div key={i} className={styles.checkItem}>
                        <Check className={styles.checkIcon} size={18} />
                        <span>{h}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h2 className={styles.detailTitle}>Analytical Tools & Technologies Covered</h2>
                <p className={styles.detailDesc} style={{ marginBottom: 'var(--space-4)' }}>
                  Our curriculum is completely integrated with practical lab drills utilizing industry-standard analytic tools:
                </p>
                <div className={styles.toolGrid}>
                  {tools.map((tool, idx) => (
                    <div key={idx} className={styles.toolItem}>
                      {tool}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.sidebar}>
              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>Quick Facts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                  <div>
                    <span style={{ color: 'var(--color-muted)', display: 'block' }}>Duration</span>
                    <strong style={{ color: '#1A1A2E' }}>
                      {isLoading ? <Skeleton width={120} height={16} /> : (program?.duration || '2 Years (4 Semesters)')}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-muted)', display: 'block' }}>Eligibility</span>
                    <strong style={{ color: '#1A1A2E' }}>
                      {isLoading ? <Skeleton width={180} height={16} /> : (program?.eligibility || 'Bachelor\'s degree with min 50% marks')}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-muted)', display: 'block' }}>Total Intake</span>
                    <strong style={{ color: '#1A1A2E' }}>
                      {isLoading ? <Skeleton width={80} height={16} /> : (program?.seats ? `${program.seats} Seats` : '60 Seats')}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-muted)', display: 'block' }}>Annual Tuition Fee</span>
                    <strong style={{ color: '#1A1A2E' }}>
                      {isLoading ? <Skeleton width={150} height={16} /> : annualFeeStr}
                    </strong>
                  </div>
                  <div style={{ marginTop: 'var(--space-2)' }}>
                    <Link href="/admissions/apply" passHref legacyBehavior>
                      <Button variant="primary" fullWidth size="md">Apply Online Now</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
