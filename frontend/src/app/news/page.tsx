'use client';

import React, { useState, useMemo } from 'react';
import styles from '../other-pages.module.css';
import { Breadcrumb, Badge, Skeleton } from '@/components/ui';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { useFetch } from '@/hooks/useFetch';
import type { News } from '@/types';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const FALLBACK_NEWS: News[] = [
  {
    id: 1,
    title: 'ABS Hosts International Conference on Generative AI in Business Analytics',
    slug: 'international-conference-gen-ai-analytics',
    excerpt: 'The three-day conference featured keynotes from distinguished global partners and panel discussions on AI-driven financial models and strategic decision systems.',
    body: '',
    cover_image: '/images/news/conference.jpg',
    category: 'International Conference',
    author_id: null,
    published_at: '2026-06-15T10:00:00Z',
    is_featured: true,
    is_published: true,
    views: 120,
    meta_title: null,
    meta_description: null,
    created_at: '',
    updated_at: ''
  },
  {
    id: 2,
    title: 'Dr. Suraj Verma Appointed Associate Professor & HOD of Business Analytics',
    slug: 'dr-suraj-verma-appointed-hod-business-analytics',
    excerpt: 'Dr. Suraj Verma joins ABS to lead our state-of-the-art Business Analytics program, bringing over 12 years of core industry and research consulting expertise.',
    body: '',
    cover_image: '/images/news/faculty-appointment.jpg',
    category: 'Campus News',
    author_id: null,
    published_at: '2026-06-10T09:00:00Z',
    is_featured: false,
    is_published: true,
    views: 85,
    meta_title: null,
    meta_description: null,
    created_at: '',
    updated_at: ''
  },
  {
    id: 3,
    title: 'Akal Business School Achieves Record 95% Placement in 2026 Drive',
    slug: 'record-placements-drive-2026',
    excerpt: 'Our students secure premium placements in top corporations including KPMG, Deloitte, EY, PwC, and HDFC Bank with packages scaling up to ₹12 LPA.',
    body: '',
    cover_image: '/images/news/placements.jpg',
    category: 'Placement Drive',
    author_id: null,
    published_at: '2026-06-05T08:30:00Z',
    is_featured: true,
    is_published: true,
    views: 310,
    meta_title: null,
    meta_description: null,
    created_at: '',
    updated_at: ''
  }
];

const CATEGORIES = [
  'All',
  'Industry Talk',
  'International Conference',
  'Placement Drive',
  'Scholarship',
  'Research',
  'Campus News'
];

export default function NewsPage() {
  const { data: newsList, isLoading } = useFetch<News[]>(
    '/news',
    ['news_all']
  );

  const [activeCategory, setActiveCategory] = useState('All');

  const displayNews = newsList && newsList.length > 0 ? newsList : FALLBACK_NEWS;

  const filteredNews = useMemo(() => {
    if (activeCategory === 'All') return displayNews;
    return displayNews.filter((n) => n.category === activeCategory);
  }, [displayNews, activeCategory]);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'News & Events', href: '/news' },
            ]}
          />
          <h1 className={styles.heroTitle}>News & Campus Events</h1>
          <p className={styles.heroSubtitle}>
            Stay up to date with absolute campus milestones, academic summits, placements, and research updates.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className={styles.section}>
        <div className="container">
          {/* Category Filter */}
          <div className={styles.categoryList}>
            {CATEGORIES.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`${styles.categoryButton} ${activeCategory === cat ? styles.categoryButtonActive : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid list */}
          <div className={styles.newsGrid}>
            {isLoading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className={styles.newsCard}>
                    <Skeleton height={180} />
                    <div className={styles.newsContent}>
                      <Skeleton height={20} className="mb-2" />
                      <Skeleton height={16} className="mb-4" />
                      <Skeleton height={40} />
                    </div>
                  </div>
                ))
              : filteredNews.map((n) => (
                  <div key={n.id} className={styles.newsCard}>
                    <div className={styles.newsImageWrapper}>
                      <ImageWithFallback
                        src={n.cover_image || ''}
                        fallbackSrc="/images/placeholder-news.jpg"
                        alt={n.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10 }}>
                        <Badge variant="gold">{n.category}</Badge>
                      </div>
                    </div>
                    <div className={styles.newsContent}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-gold-light)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-2)' }}>
                        <Calendar size={12} />
                        {n.published_at ? formatDate(n.published_at) : 'June 2026'}
                      </div>
                      <h3 className={styles.newsTitle}>{n.title}</h3>
                      <p className={styles.newsExcerpt}>{n.excerpt}</p>
                      
                      <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px solid rgba(30, 58, 110, 0.3)' }}>
                        <Link href={`/news/${n.slug}`} style={{ fontSize: 'var(--text-xs)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                          Read Article <ArrowRight size={14} />
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
