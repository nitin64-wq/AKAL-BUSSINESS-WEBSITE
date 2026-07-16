'use client';

import React, { useMemo } from 'react';
import styles from './testimonials.module.css';
import { Breadcrumb, Skeleton } from '@/components/ui';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { useFetch } from '@/hooks/useFetch';
import type { Testimonial } from '@/types';
import { Star } from 'lucide-react';

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Manjinder Kaur',
    designation: 'MBA - Business Analytics',
    company: 'Placed at KPMG',
    photo: '/images/testimonials/manjinder.jpg',
    quote: 'ABS provided me with a perfect launchpad for my career. The MBA in Business Analytics program was rigorous and highly practical, equipping me with industry-demand skills like Python, Power BI, and Machine Learning. The mentorship was outstanding.',
    rating: 5,
    batch_year: 2024,
    is_featured: true,
    is_active: true,
    sort_order: 1,
    created_at: '',
    updated_at: ''
  },
  {
    id: 2,
    name: 'Rasleen Kaur',
    designation: 'MBA - Business Analytics',
    company: 'Placed at Deloitte',
    photo: '/images/testimonials/rasleen.jpg',
    quote: 'The international collaborations at ABS opened global doors for me. The mentorship from distinguished international faculty and the exposure through live corporate projects and internships were absolute game-changers for my career path.',
    rating: 5,
    batch_year: 2024,
    is_featured: true,
    is_active: true,
    sort_order: 2,
    created_at: '',
    updated_at: ''
  }
];

export default function PublicTestimonialsPage() {
  const { data: testimonials, isLoading } = useFetch<Testimonial[]>(
    '/testimonials',
    ['testimonials_public']
  );

  const displayTestimonials = useMemo(() => {
    return testimonials && testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;
  }, [testimonials]);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Testimonials', href: '/testimonials' },
            ]}
          />
          <h1 className={styles.heroTitle}>Student Testimonials</h1>
          <p className={styles.heroSubtitle}>
            Hear directly from our graduates about their academic transformation and career success at ABS.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.grid}>
            {isLoading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className={styles.testimonialCard}>
                    <Skeleton height={20} className="mb-4" />
                    <Skeleton height={60} className="mb-4" />
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <Skeleton width={50} height={50} variant="circle" />
                      <div>
                        <Skeleton width={120} height={16} className="mb-2" />
                        <Skeleton width={80} height={12} />
                      </div>
                    </div>
                  </div>
                ))
              : displayTestimonials.map((t) => (
                  <div key={t.id} className={styles.testimonialCard}>
                    <div className={styles.stars}>
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
                    <div className={styles.userInfo}>
                      <div className={styles.avatarWrapper}>
                        <ImageWithFallback
                          src={t.photo || ''}
                          fallbackSrc="/images/placeholder-avatar.jpg"
                          alt={t.name}
                          className={styles.avatar}
                          fill
                          sizes="50px"
                        />
                      </div>
                      <div className={styles.userDetails}>
                        <span className={styles.userName}>{t.name}</span>
                        <span className={styles.userMeta}>
                          {t.designation} {t.batch_year ? `(Batch of ${t.batch_year})` : ''} • {t.company}
                        </span>
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
