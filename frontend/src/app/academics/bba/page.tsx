'use client';

import React from 'react';
import styles from '../academics.module.css';
import { Breadcrumb, Button, Skeleton } from '@/components/ui';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useFetch } from '@/hooks/useFetch';
import type { Program } from '@/types';

export default function BbaProgramPage() {
  const { data: programs, isLoading } = useFetch<Program[]>(
    '/programs',
    ['programs_all']
  );

  const program = programs?.find(p => p.type === 'BBA');

  const highlights = program?.highlights && program.highlights.length > 0
    ? program.highlights
    : [
        'Comprehensive foundation in business economics, accounting, and administration',
        'Practical management case study analyses led by industry experts',
        'Interactive business dashboard modeling and digital strategy concepts',
        'Dedicated soft-skills training workshops and placement counseling support',
        'Seamless pathways into specialized MBA courses'
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
              { label: 'BBA', href: '/academics/bba' },
            ]}
          />
          <h1 className={styles.heroTitle}>
            {isLoading ? <Skeleton width={200} height={40} /> : (program?.title || 'BBA (4-year course)')}
          </h1>
          <p className={styles.heroSubtitle}>
            {isLoading ? <Skeleton width={400} height={20} /> : (program?.description ? (program.description.split('.')[0] + '.') : 'A comprehensive 4-year undergraduate program blending core management administration with digital business principles.')}
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
                    program?.description || 'The Bachelor of Business Administration (BBA) at Akal Business School is designed to foster professional acumen and management readiness in young undergraduates. The curriculum covers foundational economics, corporate communication, business law, marketing intelligence, and corporate strategy, preparing students for early careers in commerce.'
                  )}
                </p>
              </div>

              <div>
                <h2 className={styles.detailTitle}>BBA Program Highlights</h2>
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
                      {isLoading ? <Skeleton width={120} height={16} /> : (program?.duration || '4 Years (8 Semesters)')}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-muted)', display: 'block' }}>Eligibility</span>
                    <strong style={{ color: '#1A1A2E' }}>
                      {isLoading ? <Skeleton width={180} height={16} /> : (program?.eligibility || '10+2 in any stream with min 50% marks')}
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
