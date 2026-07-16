'use client';

import React from 'react';
import styles from './NewsSection.module.css';
import { SectionHeader } from '../ui/SectionHeader';
import { Badge } from '../ui/Badge';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { useFetch } from '@/hooks/useFetch';
import type { News } from '@/types';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function NewsSection() {
  const { data: newsList } = useFetch<News[]>(
    '/news',
    ['news_public_featured'],
    { params: { is_featured: true } }
  );

  const displayNews = newsList && newsList.length > 0 ? newsList.slice(0, 3) : [];

  if (displayNews.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.section} sectionLight`} id="news-events">
      <div className="container">
        <SectionHeader
          title="News & Campus Updates"
          subtitle="Stay informed with the latest updates on international academic partnerships, research breakthroughs, campus milestones, and placement records."
          theme="light"
        />

        <div className={styles.grid}>
          {displayNews.map((n) => (
            <div key={n.id} className={styles.newsCard}>
              <div className={styles.imageWrapper}>
                <ImageWithFallback
                  src={n.cover_image || ''}
                  fallbackSrc="/images/placeholder-news.jpg"
                  alt={n.title}
                  className={styles.image}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className={styles.badge}>
                  <Badge variant="gold">{n.category}</Badge>
                </div>
              </div>
              <div className={styles.content}>
                <div className={styles.date}>
                  <Calendar size={12} style={{ marginRight: '4px', display: 'inline' }} />
                  {n.published_at ? formatDate(n.published_at) : 'June 2026'}
                </div>
                <h4 className={styles.title}>{n.title}</h4>
                <p className={styles.excerpt}>{n.excerpt}</p>

                <div className={styles.footer}>
                  <Link href={`/news/${n.slug}`} className={styles.readMore}>
                    Read Article <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
