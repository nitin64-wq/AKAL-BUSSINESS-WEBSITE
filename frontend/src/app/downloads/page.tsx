'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumb } from '@/components/ui';
import styles from './downloads.module.css';
import { useFetch } from '@/hooks/useFetch';
import api from '@/lib/api';
import { 
  Search, 
  FileText, 
  Download, 
  AlertCircle, 
  FileArchive, 
  Layers, 
  BookOpen, 
  GraduationCap, 
  FileCheck,
  Calendar
} from 'lucide-react';

interface DownloadItem {
  id: number;
  title: string;
  file_path: string;
  file_size: string | null;
  type: string;
  sort_order: number;
  is_active: boolean;
}

type CategoryType = 'All' | 'Syllabus' | 'Entrance' | 'Competitive';

export default function DownloadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('All');

  // Fetch active downloads
  const { data: downloads, isLoading, error } = useFetch<DownloadItem[]>(
    '/downloads',
    ['public_downloads_list']
  );

  const getFullDownloadUrl = (path: string) => {
    if (!path) return '#';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${api.defaults.baseURL?.replace('/api', '')}/${cleanPath}`;
  };

  // Helper to resolve icon style based on file format
  const getFormatDetails = (type: string = 'PDF') => {
    const normType = (type || 'PDF').toUpperCase();
    if (normType === 'PDF') {
      return {
        styleClass: styles.pdfIcon,
        badgeClass: styles.pdfBadge,
        icon: FileText
      };
    }
    if (['DOC', 'DOCX', 'TXT'].includes(normType)) {
      return {
        styleClass: styles.docIcon,
        badgeClass: styles.docBadge,
        icon: FileCheck
      };
    }
    if (['ZIP', 'RAR', '7Z'].includes(normType)) {
      return {
        styleClass: styles.zipIcon,
        badgeClass: styles.zipBadge,
        icon: FileArchive
      };
    }
    return {
      styleClass: styles.defaultIcon,
      badgeClass: styles.badge,
      icon: FileText
    };
  };

  // Categorize a download item dynamically based on keywords
  const getItemCategory = (title: string): CategoryType => {
    const t = title.toLowerCase();
    if (t.includes('syllabus') || t.includes('curriculum') || t.includes('course')) {
      return 'Syllabus';
    }
    if (t.includes('entrance') || t.includes('sample') || t.includes('mock')) {
      return 'Entrance';
    }
    if (t.includes('solved') || t.includes('ssc') || t.includes('ibps') || t.includes('paper') || t.includes('solutions')) {
      return 'Competitive';
    }
    return 'All';
  };

  // Filter downloads by search and category
  const filteredDownloads = useMemo(() => {
    if (!downloads) return [];
    return downloads.filter((item) => {
      const matchSearch = searchQuery.toLowerCase();
      const matchesText = 
        item.title.toLowerCase().includes(matchSearch) ||
        (item.type && item.type.toLowerCase().includes(matchSearch));
      
      const itemCat = getItemCategory(item.title);
      const matchesCategory = activeCategory === 'All' || itemCat === activeCategory;
      
      return matchesText && matchesCategory;
    });
  }, [downloads, searchQuery, activeCategory]);

  return (
    <div className={styles.pageWrapper}>
      {/* Background ambient glowing spheres */}
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Downloads', href: '/downloads' },
            ]}
          />
          <h1 className={styles.heroTitle}>Downloads &amp; Resources</h1>
          <p className={styles.heroSubtitle}>
            Access curriculum syllabus parameters, mock entrance question files, and solved competitive study papers curated by ABS Faculty.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section style={{ position: 'relative', zIndex: 10, padding: '0 0 var(--space-12)' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          
          {/* Filters Dashboard Panel */}
          <div className={styles.filterBar}>
            <div className={styles.filterCard}>
              
              {/* Search box */}
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search resources, mock test papers, or syllabi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                <Search size={18} className={styles.searchIcon} />
              </div>

              {/* Category tabs */}
              <div className={styles.tabsContainer}>
                {[
                  { id: 'All', label: 'All Resources', icon: Layers },
                  { id: 'Syllabus', label: 'Syllabus & Core', icon: BookOpen },
                  { id: 'Entrance', label: 'Entrance Tests', icon: GraduationCap },
                  { id: 'Competitive', label: 'Solved Papers', icon: FileCheck },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategory(tab.id as CategoryType)}
                      className={`${styles.tabBtn} ${activeCategory === tab.id ? styles.tabBtnActive : ''}`}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Icon size={13} />
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Resources count log */}
            {!isLoading && downloads && (
              <div style={{ fontSize: 'var(--text-xs)', color: '#64748B', fontWeight: 600, marginTop: 'var(--space-4)', paddingLeft: 'var(--space-3)' }}>
                Showing {filteredDownloads.length} of {downloads.length} resources
              </div>
            )}
          </div>

          {/* Loading Skeletons */}
          {isLoading && (
            <div className={styles.grid}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className={styles.skeletonCard} />
              ))}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              color: '#F87171',
              maxWidth: '600px',
              margin: '0 auto var(--space-8)'
            }}>
              <AlertCircle size={24} style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700 }}>Service Unreachable</h4>
                <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: '#94A3B8' }}>
                  Failed to fetch documents from database. Please verify your connection or retry shortly.
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredDownloads.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '80px var(--space-6)',
              backgroundColor: 'rgba(17, 24, 39, 0.35)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{ fontSize: '40px', marginBottom: 'var(--space-4)' }}>📂</div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                No Resources Found
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: '#94A3B8', lineHeight: 'var(--leading-relaxed)' }}>
                {searchQuery 
                  ? 'We couldn\'t find any files matching your search term. Try checking spelling or search in another category.'
                  : 'There are currently no files published in this tab. Check back shortly for downloads.'}
              </p>
            </div>
          )}

          {/* Dynamic Redesigned Grid */}
          {!isLoading && !error && filteredDownloads.length > 0 && (
            <div className={styles.grid}>
              {filteredDownloads.map((item) => {
                const formatDetails = getFormatDetails(item.type);
                const FormatIcon = formatDetails.icon;
                
                return (
                  <div key={item.id} className={styles.card}>
                    {/* Top Row: File icon & Format Badge */}
                    <div className={styles.cardTop}>
                      <div className={`${styles.iconWrapper} ${formatDetails.styleClass}`}>
                        <FormatIcon size={20} />
                      </div>
                      <span className={`${styles.badge} ${formatDetails.badgeClass}`}>
                        {item.type || 'PDF'}
                      </span>
                    </div>

                    {/* Middle Row: Title */}
                    <div>
                      <h3 className={styles.cardTitle} title={item.title}>
                        {item.title}
                      </h3>
                      
                      {/* File Metadata Info */}
                      <div className={styles.cardMeta}>
                        <div className={styles.metaItem}>
                          <Layers size={11} />
                          <span>{item.file_size || 'Unknown size'}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <Calendar size={11} />
                          <span>Verified Resource</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Download Action button */}
                    <a
                      href={getFullDownloadUrl(item.file_path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.downloadBtn}
                    >
                      <Download size={13} />
                      <span>Download File</span>
                    </a>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
