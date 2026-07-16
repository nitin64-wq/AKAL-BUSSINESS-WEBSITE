'use client';

import React from 'react';
import styles from '../academics.module.css';
import { Breadcrumb, Button, Skeleton } from '@/components/ui';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useFetch } from '@/hooks/useFetch';
import type { Program } from '@/types';

export default function PhdProgramPage() {
  const { data: programs, isLoading } = useFetch<Program[]>(
    '/programs',
    ['programs_all']
  );

  const program = programs?.find(p => p.type === 'Doctoral');

  const highlights = program?.highlights && program.highlights.length > 0
    ? program.highlights
    : [
        'Rigorous doctoral coursework covering advanced research methodologies',
        'Mentorship by leading international scholars and publications guidance',
        'Specialized research domains: Business Analytics, AI Ethics, Finance, and HRM',
        'Opportunities to present at national and international research conferences',
        'Full access to advanced computational research lab databases'
      ];

  const annualFeeStr = program?.fee_per_year
    ? `₹${Number(program.fee_per_year).toLocaleString('en-IN')} / year (₹${(Number(program.fee_per_year) / 2).toLocaleString('en-IN')} per semester)`
    : '₹1,00,000 / year (₹50,000 per semester)';

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Academics', href: '/academics' },
              { label: 'PhD', href: '/academics/phd' },
            ]}
          />
          <h1 className={styles.heroTitle}>
            {isLoading ? <Skeleton width={200} height={40} /> : (program?.title || 'PhD in Management')}
          </h1>
          <p className={styles.heroSubtitle}>
            {isLoading ? <Skeleton width={400} height={20} /> : (program?.description ? (program.description.split('.')[0] + '.') : 'A comprehensive doctoral research program designed to prepare scholars for academic and research leadership.')}
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
                    program?.description || 'The PhD in Management program at Akal Business School is designed for candidates seeking deep academic expertise and qualitative/quantitative research competencies. Under the supervision of distinguished guides and professors, researchers investigate emerging challenges in global business administration, AI ethics, corporate sustainability, and computational economics.'
                  )}
                </p>
              </div>

              <div>
                <h2 className={styles.detailTitle}>PhD Program Highlights</h2>
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
            </div>

            <div className={styles.sidebar}>
              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>Quick Facts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                  <div>
                    <span style={{ color: 'var(--color-muted)', display: 'block' }}>Duration</span>
                    <strong style={{ color: '#1A1A2E' }}>
                      {isLoading ? <Skeleton width={120} height={16} /> : (program?.duration || '3 - 5 Years')}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-muted)', display: 'block' }}>Eligibility</span>
                    <strong style={{ color: '#1A1A2E' }}>
                      {isLoading ? <Skeleton width={180} height={16} /> : (program?.eligibility || 'Master\'s degree with min 55% marks (NET/JRF preferred)')}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-muted)', display: 'block' }}>Total Intake</span>
                    <strong style={{ color: '#1A1A2E' }}>
                      {isLoading ? <Skeleton width={80} height={16} /> : (program?.seats ? `${program.seats} Seats` : '10 Seats')}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-muted)', display: 'block' }}>Annual Tuition Fee</span>
                    <strong style={{ color: '#1A1A2E' }}>
                      {isLoading ? <Skeleton width={200} height={16} /> : annualFeeStr}
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
