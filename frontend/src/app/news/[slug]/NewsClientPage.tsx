'use client';

import React from 'react';
import styles from '../../other-pages.module.css';
import { Breadcrumb, Button, Skeleton, Badge } from '@/components/ui';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { useFetch } from '@/hooks/useFetch';
import type { News } from '@/types';
import Link from 'next/link';
import { Calendar, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const FALLBACK_NEWS: News[] = [
  {
    id: 1,
    title: 'ABS Hosts International Conference on Generative AI in Business Analytics',
    slug: 'international-conference-gen-ai-analytics',
    excerpt: 'The three-day conference featured keynotes from distinguished global partners and panel discussions on AI-driven financial models and strategic decision systems.',
    body: 'Akal Business School successfully organized a three-day International Conference on Generative AI in Business Analytics at the Baru Sahib campus. The conference brought together business executives, technology experts, and academic researchers from leading global institutions.\n\nKeynotes were delivered by distinguished international partners, including advisors from the University of Nebraska Omaha, Virginia Commonwealth University, and the University of North Carolina Greensboro.\n\nPanel discussions focused on building predictive financial models, designing AI-driven strategic decisions, and establishing cognitive analytics within modern commerce paradigms. ABS students co-authored multiple research papers that were presented during the conference sessions, highlighting their contribution to computational management science.',
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
    body: 'Akal Business School is pleased to welcome Dr. Suraj Verma as the HOD and Associate Professor of our flagship Business Analytics programs.\n\nDr. Verma brings over 12 years of core industry consulting, computational management research, and academic experience. He holds a PhD in Management from IIT Delhi and has published extensively in Scopus-indexed journals.\n\nUnder his guidance, ABS will continue to enhance its hands-on analytic laboratory drills, introducing advanced modules in machine learning and data engineering to ensure our students remain highly competitive in the global business economy.',
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
    body: 'Akal Business School has recorded outstanding results during its latest placements drive, achieving a corporate placement rate of 95%.\n\nABS graduates secured premium placements and consultant-track designations at top global corporations, including KPMG, Deloitte, EY, PwC, Axis Bank, and HDFC Bank. The compensation packages scaled up to a highest of ₹12.0 LPA, with an average salary package of ₹7.2 LPA.\n\nThe Director of Akal Business School commended the placement cell, student committees, and faculty advisors for their combined dedication in organizing intensive mock drills, corporate internships, and analytics workshops that made this success possible.',
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

export default function NewsClientPage({ params }: { params: { slug: string } }) {
  const { data: news, isLoading } = useFetch<News>(
    `/news/${params.slug}`,
    [`news_${params.slug}`]
  );

  const fallbackNews = FALLBACK_NEWS.find((n) => n.slug === params.slug);
  const displayNews = news || fallbackNews;

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', padding: 'var(--space-24) 0' }}>
        <div className="container">
          <Skeleton height={40} className="mb-4" />
          <Skeleton height={300} className="mb-8" />
          <Skeleton height={200} />
        </div>
      </div>
    );
  }

  if (!displayNews) {
    return (
      <div style={{ minHeight: '100vh', padding: 'var(--space-24) 0', textAlign: 'center' }}>
        <div className="container">
          <h1 className={styles.heroTitle}>Article Not Found</h1>
          <p style={{ color: 'var(--color-muted)' }}>The requested news article could not be found.</p>
          <Link href="/news" style={{ marginTop: 'var(--space-4)', display: 'inline-block' }}>
            <Button variant="primary" size="md">Back to News</Button>
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
              { label: 'News & Events', href: '/news' },
              { label: displayNews.title, href: `/news/${displayNews.slug}` },
            ]}
          />
          <span style={{ display: 'inline-block', marginBottom: 'var(--space-2)' }}>
            <Badge variant="gold">{displayNews.category}</Badge>
          </span>
          <h1 className={styles.heroTitle} style={{ fontSize: 'var(--text-3xl)' }}>{displayNews.title}</h1>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'var(--space-6)',
            color: 'var(--color-muted)',
            fontSize: 'var(--text-xs)',
            marginTop: 'var(--space-4)'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} />
              {displayNews.published_at ? formatDate(displayNews.published_at) : 'June 2026'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Eye size={14} />
              {displayNews.views} Views
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <section className={styles.section}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '400px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: 'var(--space-8)'
          }}>
            <ImageWithFallback
              src={displayNews.cover_image || ''}
              fallbackSrc="/images/placeholder-news.jpg"
              alt={displayNews.title}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div style={{
            color: 'var(--color-off-white)',
            fontSize: 'var(--text-base)',
            lineHeight: 'var(--leading-relaxed)',
            whiteSpace: 'pre-line'
          }}>
            {displayNews.body}
          </div>
        </div>
      </section>
    </div>
  );
}
