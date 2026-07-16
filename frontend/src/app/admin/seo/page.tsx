/* ============================================================
   ABS — SEO Module Dashboard
   Overview of SEO health across all content.
   ============================================================ */

'use client';

import React from 'react';
import Link from 'next/link';
import { useFetch } from '@/hooks/useFetch';
import { Skeleton } from '@/components/ui';
import styles from './Seo.module.css';
import {
  Globe, FileText, Code2, HelpCircle, Compass,
  Search, Settings, Layout, Layers, Bot,
  BarChart3, Shield
} from 'lucide-react';

export default function SeoDashboardPage() {
  const { data: pages } = useFetch<any[]>('/admin/seo/pages', ['seo_pages']);
  const { data: schemasData } = useFetch<any>('/admin/seo/schemas', ['seo_schemas']);
  const { data: faqsData } = useFetch<any>('/admin/seo/faqs', ['seo_faqs']);
  const { data: settingsData } = useFetch<any>('/admin/seo/settings', ['seo_settings_admin']);

  const schemas = schemasData?.data || schemasData || [];
  const faqs = faqsData?.data || faqsData || [];
  const settings = settingsData?.data || settingsData || [];
  const settingsArr = Array.isArray(settings) ? settings : [];

  const totalPages = Array.isArray(pages) ? pages.length : 0;
  const pagesWithMeta = Array.isArray(pages)
    ? pages.filter((p: any) => p.meta_description).length
    : 0;
  const pagesMissingMeta = totalPages - pagesWithMeta;
  const totalSchemas = Array.isArray(schemas) ? schemas.length : 0;
  const totalFaqs = Array.isArray(faqs) ? faqs.length : 0;

  const analyticsConfigured = settingsArr.some?.(
    (s: any) => s.key === 'google_analytics_id' && s.value
  );

  return (
    <div>
      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(201,162,39,0.1)', color: 'var(--color-gold)' }}>
            <FileText size={20} />
          </div>
          <div>
            <span className={styles.statValue}>{totalPages}</span>
            <span className={styles.statLabel}>Pages with SEO</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
            <Search size={20} />
          </div>
          <div>
            <span className={styles.statValue}>{pagesMissingMeta}</span>
            <span className={styles.statLabel}>Missing Meta Desc.</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(168,85,247,0.1)', color: '#A855F7' }}>
            <Code2 size={20} />
          </div>
          <div>
            <span className={styles.statValue}>{totalSchemas}</span>
            <span className={styles.statLabel}>Schema Records</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}>
            <HelpCircle size={20} />
          </div>
          <div>
            <span className={styles.statValue}>{totalFaqs}</span>
            <span className={styles.statLabel}>FAQ Items (AEO)</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: analyticsConfigured ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: analyticsConfigured ? '#22C55E' : '#EF4444' }}>
            <BarChart3 size={20} />
          </div>
          <div>
            <span className={styles.statValue}>{analyticsConfigured ? 'ON' : 'OFF'}</span>
            <span className={styles.statLabel}>Google Analytics</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Compass size={18} /> SEO Management Modules
        </h2>

        <div className={styles.navGrid}>
          <Link href="/admin/seo/settings" className={styles.navCard}>
            <div className={styles.navCardIcon} style={{ background: 'rgba(201,162,39,0.1)', color: 'var(--color-gold)' }}>
              <Settings size={18} />
            </div>
            <div>
              <span className={styles.navCardTitle}>Global SEO Settings</span>
              <span className={styles.navCardDesc}>Website name, meta defaults, organization, social, analytics IDs, verification</span>
            </div>
          </Link>

          <Link href="/admin/seo/pages" className={styles.navCard}>
            <div className={styles.navCardIcon} style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}>
              <Layout size={18} />
            </div>
            <div>
              <span className={styles.navCardTitle}>Page SEO</span>
              <span className={styles.navCardDesc}>SEO title, meta, OG, Twitter, schema for each static page</span>
            </div>
          </Link>

          <Link href="/admin/seo/content" className={styles.navCard}>
            <div className={styles.navCardIcon} style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E' }}>
              <Layers size={18} />
            </div>
            <div>
              <span className={styles.navCardTitle}>Content SEO</span>
              <span className={styles.navCardDesc}>SEO/AEO/GEO for News, Programs, Events, Announcements & more</span>
            </div>
          </Link>

          <Link href="/admin/seo/schemas" className={styles.navCard}>
            <div className={styles.navCardIcon} style={{ background: 'rgba(168,85,247,0.1)', color: '#A855F7' }}>
              <Code2 size={18} />
            </div>
            <div>
              <span className={styles.navCardTitle}>Schema Builder</span>
              <span className={styles.navCardDesc}>JSON-LD structured data: Organization, Article, FAQ, Event & 10 more</span>
            </div>
          </Link>

          <Link href="/admin/seo/faqs" className={styles.navCard}>
            <div className={styles.navCardIcon} style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
              <HelpCircle size={18} />
            </div>
            <div>
              <span className={styles.navCardTitle}>FAQ Builder (AEO)</span>
              <span className={styles.navCardDesc}>Answer Engine Optimization: FAQ schema, quick answers, AI summaries</span>
            </div>
          </Link>

          <Link href="/admin/seo/geo" className={styles.navCard}>
            <div className={styles.navCardIcon} style={{ background: 'rgba(14,165,233,0.1)', color: '#0EA5E9' }}>
              <Bot size={18} />
            </div>
            <div>
              <span className={styles.navCardTitle}>GEO Optimization</span>
              <span className={styles.navCardDesc}>Generative Engine: E-E-A-T scores, entity keywords, AI readability</span>
            </div>
          </Link>

          <Link href="/admin/seo/google" className={styles.navCard}>
            <div className={styles.navCardIcon} style={{ background: 'rgba(234,67,53,0.1)', color: '#EA4335' }}>
              <Globe size={18} />
            </div>
            <div>
              <span className={styles.navCardTitle}>Google & Analytics</span>
              <span className={styles.navCardDesc}>GA, GTM, Search Console, IndexNow, Bing, Yandex verification</span>
            </div>
          </Link>

          <Link href="/admin/seo/robots" className={styles.navCard}>
            <div className={styles.navCardIcon} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--color-muted)' }}>
              <Shield size={18} />
            </div>
            <div>
              <span className={styles.navCardTitle}>Robots & Sitemap</span>
              <span className={styles.navCardDesc}>Dynamic robots.txt rules, crawl delay, sitemap settings</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
