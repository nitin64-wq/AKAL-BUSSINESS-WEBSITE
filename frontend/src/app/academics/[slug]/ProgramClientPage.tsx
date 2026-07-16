'use client';

import React from 'react';
import styles from '../academics.module.css';
import { Breadcrumb, Button, Skeleton } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';
import type { Program } from '@/types';
import { Check } from 'lucide-react';
import Link from 'next/link';

export default function ProgramClientPage({ params }: { params: { slug: string } }) {
  const { data: program, isLoading } = useFetch<Program>(
    `/programs/${params.slug}`,
    [`program_${params.slug}`]
  );

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', padding: 'var(--space-24) 0' }}>
        <div className="container">
          <Skeleton height={40} className="mb-4" />
          <Skeleton height={200} className="mb-8" />
          <Skeleton height={300} />
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div style={{ minHeight: '100vh', padding: 'var(--space-24) 0', textAlign: 'center' }}>
        <div className="container">
          <h1 className={styles.heroTitle}>Program Not Found</h1>
          <p style={{ color: 'var(--color-muted)' }}>The requested academic program details could not be found.</p>
          <Link href="/academics" style={{ marginTop: 'var(--space-4)', display: 'inline-block' }}>
            <Button variant="primary" size="md">Back to Programs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Academics', href: '/academics' },
              { label: program.title, href: `/academics/${program.slug}` },
            ]}
          />
          <h1 className={styles.heroTitle}>{program.title}</h1>
          <p className={styles.heroSubtitle}>{program.type} Degree Program</p>
        </div>
      </div>

      {/* Main Details */}
      <section style={{ padding: 'var(--space-12) 0' }}>
        <div className="container">
          <div className={styles.detailGrid}>
            <div className={styles.mainContent}>
              <div>
                <h2 className={styles.detailTitle}>Program Overview</h2>
                <p className={styles.detailDesc}>{program.description}</p>
              </div>

              {program.highlights && program.highlights.length > 0 && (
                <div>
                  <h2 className={styles.detailTitle}>Program Highlights</h2>
                  <div className={styles.checklist}>
                    {program.highlights.map((h, i) => (
                      <div key={i} className={styles.checkItem}>
                        <Check className={styles.checkIcon} size={18} />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.sidebar}>
              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>Program Facts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                  <div>
                    <span style={{ color: 'var(--color-muted)', display: 'block' }}>Duration</span>
                    <strong style={{ color: '#1A1A2E' }}>{program.duration}</strong>
                  </div>
                  {program.eligibility && (
                    <div>
                      <span style={{ color: 'var(--color-muted)', display: 'block' }}>Eligibility</span>
                      <strong style={{ color: '#1A1A2E' }}>{program.eligibility}</strong>
                    </div>
                  )}
                  <div>
                    <span style={{ color: 'var(--color-muted)', display: 'block' }}>Seats Available</span>
                    <strong style={{ color: '#1A1A2E' }}>{program.seats} Seats</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-muted)', display: 'block' }}>Annual Tuition Fee</span>
                    <strong style={{ color: '#1A1A2E' }}>
                      {program.fee_per_year
                        ? `₹${Number(program.fee_per_year).toLocaleString('en-IN')} / year`
                        : 'Contact Admissions Desk'}
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
