'use client';

import React, { useMemo } from 'react';
import styles from './TestimonialsSection.module.css';
import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { useFetch } from '@/hooks/useFetch';
import type { Testimonial } from '@/types';
import { Star, Quote, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function TestimonialsSection() {
  const { data: testimonials } = useFetch<Testimonial[]>(
    '/testimonials',
    ['testimonials_public']
  );

  // Limit homepage to top 3 featured testimonials for a clean grid
  const displayTestimonials = useMemo(() => {
    const list = testimonials && testimonials.length > 0 ? testimonials : [];
    return list.filter(t => t.is_featured && t.is_active).slice(0, 3);
  }, [testimonials]);

  if (displayTestimonials.length === 0) {
    return null;
  }

  return (
    <section className={styles.section} id="testimonials">
      <div className="container">
        <SectionHeader 
          title="Student Success Stories"
          subtitle="Hear directly from our graduates about their academic journey, transformation, and professional placement success at ABS."
          theme="light"
        />

        {/* 3-Column Grid */}
        <div className={styles.grid}>
          {displayTestimonials.map((t) => (
            <div key={t.id} className={styles.testimonialCard}>
              <Quote className={styles.quoteIcon} size={32} />
              
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
                    {t.designation} {t.batch_year ? `(Batch of ${t.batch_year})` : ''}
                  </span>
                  <span className={styles.userCompany}>{t.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className={styles.viewAllWrapper}>
          <Link href="/testimonials" passHref legacyBehavior>
            <Button variant="secondary" size="md" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Read More Success Stories <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        {/* Full Width CTA Banner */}
        <div className={styles.ctaBanner}>
          <div className={styles.ctaContent}>
            <h4 className={styles.ctaTitle}>Begin Your Journey Today</h4>
            <p className={styles.ctaDescription}>
              Admissions are open for the 2026-2028 session. Elevate your career with our specialized MBA, BBA, and PhD programs.
            </p>
          </div>
          <div className={styles.ctaActions}>
            <Link href="/admissions/apply" passHref legacyBehavior>
              <Button variant="primary" size="lg">Apply Online Now</Button>
            </Link>
            <a href="/downloads/brochure.pdf" download className={styles.downloadBtn}>
              <Button variant="secondary" size="lg">Download Brochure</Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
