'use client';

import React, { useMemo } from 'react';
import styles from './academics.module.css';
import { Breadcrumb, Badge, Button, Skeleton } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';
import type { Program } from '@/types';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const FALLBACK_PROGRAMS: Program[] = [
  {
    id: 1,
    title: 'MBA in Business Analytics',
    slug: 'mba',
    type: 'MBA',
    duration: '2 Years (4 Semesters)',
    description: 'A premier flagship program designed to bridge the gap between business management and advanced analytical technologies. Features a 1+1 study abroad option with foreign university MoUs.',
    highlights: [],
    eligibility: 'Graduation with 50% marks',
    fee_per_year: 100000.00,
    seats: 60,
    cover_image: null,
    brochure_url: null,
    is_active: true,
    sort_order: 1,
    meta_title: null,
    meta_description: null,
    created_at: '',
    updated_at: '',
  },
  {
    id: 2,
    title: 'BBA (4-year course)',
    slug: 'bba',
    type: 'BBA',
    duration: '4 Years (8 Semesters)',
    description: 'Integrates core business administration concepts with management principles. Prepares students for early careers in business intelligence, marketing intelligence, and corporate strategy.',
    highlights: [],
    eligibility: '10+2 with 50% marks',
    fee_per_year: 100000.00,
    seats: 60,
    cover_image: null,
    brochure_url: null,
    is_active: true,
    sort_order: 2,
    meta_title: null,
    meta_description: null,
    created_at: '',
    updated_at: '',
  },
];

export default function AcademicsPage() {
  const { data: programs, isLoading } = useFetch<Program[]>(
    '/programs',
    ['programs_all']
  );

  const { data: settings } = useFetch<Record<string, any>>(
    '/settings',
    ['settings_public']
  );

  const heroTitle = settings?.page_academics?.hero_title || 'Academic Programs';
  const heroSubtitle = settings?.page_academics?.hero_subtitle || 'ABS offers industry-demanded management degrees designed to build business competence and advanced analytics intelligence.';

  const displayPrograms = useMemo(() => {
    // Ensure BBA is 4 years and PhD is always present
    const rawList = programs && programs.length > 0 ? programs : FALLBACK_PROGRAMS;
    
    // Create copy of raw list
    const processed = [...rawList];

    // Ensure PhD is always in the list
    if (!processed.some(p => p.slug === 'phd' || p.type === 'Doctoral')) {
      processed.push({
        id: 3,
        title: 'PhD in Management',
        slug: 'phd',
        type: 'Doctoral',
        duration: '3 - 5 Years',
        description: 'Designed for scholars aiming to conduct cutting-edge research in management sciences, business intelligence, operations, finance, and marketing.',
        highlights: [],
        eligibility: 'Master\'s degree with min 55% marks (NET/JRF preferred)',
        fee_per_year: 100000.00,
        seats: 10,
        cover_image: null,
        brochure_url: null,
        is_active: true,
        sort_order: 3,
        meta_title: null,
        meta_description: null,
        created_at: '',
        updated_at: '',
      });
    }

    return processed;
  }, [programs]);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Academics', href: '/academics' },
            ]}
          />
          <h1 className={styles.heroTitle}>{heroTitle}</h1>
          <p className={styles.heroSubtitle}>{heroSubtitle}</p>
        </div>
      </div>

      {/* Main Grid */}
      <section style={{ padding: 'var(--space-12) 0' }}>
        <div className="container">
          <div className={styles.grid}>
            {isLoading
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className={styles.programCard}>
                    <Skeleton height={180} />
                    <div className={styles.content}>
                      <Skeleton width={80} height={20} className="mb-4" />
                      <Skeleton height={28} className="mb-2" />
                      <Skeleton width={120} height={16} className="mb-4" />
                      <Skeleton height={60} className="mb-4" />
                      <Skeleton height={40} />
                    </div>
                  </div>
                ))
              : displayPrograms.map((program) => (
                  <div key={program.id} className={styles.programCard}>
                    <div className={styles.imageArea}>
                      <span className={styles.typeBadge}>
                        <Badge variant="gold">{program.type}</Badge>
                      </span>
                      {program.type}
                    </div>
                    <div className={styles.content}>
                      <h3 className={styles.title}>{program.title}</h3>
                      <div className={styles.duration}>{program.duration}</div>
                      <p className={styles.desc}>{program.description}</p>
                      
                      <div className={styles.footer}>
                        <div>
                          <span className={styles.feeLabel}>Annual Fee</span>
                          <span className={styles.fee}>
                            {program.fee_per_year
                              ? `₹${Number(program.fee_per_year).toLocaleString('en-IN')}`
                              : 'Contact Desk'}
                          </span>
                        </div>
                        <Link href={`/academics/${program.slug}`}>
                          <Button
                            variant="link"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            Details <ArrowRight size={14} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>
    </div>
  );
}
