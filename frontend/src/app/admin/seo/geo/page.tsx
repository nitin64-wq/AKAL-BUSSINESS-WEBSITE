/* ============================================================
   ABS — GEO Optimization Panel
   Generative Engine Optimization metadata management.
   ============================================================ */

'use client';

import React, { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { useQueryClient } from '@tanstack/react-query';
import { seoService, PageSeoRecord } from '@/services/seoService';
import styles from '../Seo.module.css';
import toast from 'react-hot-toast';
import { Bot, Save, Brain, BookOpen, Target, TrendingUp } from 'lucide-react';

export default function GeoPage() {
  const queryClient = useQueryClient();
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  const { data: pagesData } = useFetch<PageSeoRecord[]>('/admin/seo/pages', ['seo_pages']);
  const pages = pagesData || [];

  const selectedPage = Array.isArray(pages) ? pages.find((p) => p.id === selectedPageId) : null;

  const handlePageSelect = async (pageId: number) => {
    setSelectedPageId(pageId);
    try {
      const res = await seoService.getPages();
      const page = (res.data || res || []).find((p: any) => p.id === pageId);
      // Load GEO data from page_seo's geoMeta
      setForm({
        author_bio: '',
        references: '[]',
        sources: '[]',
        entity_keywords: '[]',
        structured_headings: '[]',
        content_score: page?.content_score || '',
        ai_readability_score: page?.ai_readability_score || '',
        generative_search_score: '',
        eeat_score: page?.eeat_score || '',
        internal_linking_suggestions: '[]',
        publication_date: '',
        last_updated: '',
        reading_time: '',
      });
    } catch {
      setForm({});
    }
  };

  const handleChange = (key: string, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPageId) return;
    setSaving(true);
    try {
      await seoService.updateGeoForPage(selectedPageId, form);
      toast.success('GEO metadata saved.');
      queryClient.invalidateQueries({ queryKey: ['seo_pages'] });
    } catch {
      toast.error('Failed to save GEO metadata.');
    } finally {
      setSaving(false);
    }
  };

  const getScoreClass = (score: number) => {
    if (score >= 70) return styles.scoreGood;
    if (score >= 40) return styles.scoreMedium;
    return styles.scoreLow;
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>GEO Optimization</h1>
          <p className={styles.pageSubtitle}>Generative Engine Optimization — optimize for AI search (ChatGPT, Gemini, Claude, Perplexity)</p>
        </div>
      </div>

      {/* Page Selector */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}><Bot size={16} /> Select Page to Optimize</h2>
        <select
          className={styles.select}
          value={selectedPageId || ''}
          onChange={(e) => e.target.value && handlePageSelect(Number(e.target.value))}
          style={{ maxWidth: 400 }}
        >
          <option value="">Choose a page...</option>
          {Array.isArray(pages) && pages.map((p: any) => (
            <option key={p.id} value={p.id}>{p.page_title || p.page_identifier}</option>
          ))}
        </select>
      </div>

      {selectedPageId && (
        <form onSubmit={handleSubmit}>
          {/* Scores Overview */}
          <div className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { label: 'E-E-A-T Score', key: 'eeat_score', icon: Shield2, color: '#A855F7' },
              { label: 'Content Score', key: 'content_score', icon: Target, color: '#22C55E' },
              { label: 'AI Readability', key: 'ai_readability_score', icon: Brain, color: '#3B82F6' },
              { label: 'Gen. Search', key: 'generative_search_score', icon: TrendingUp, color: '#F59E0B' },
            ].map((s) => (
              <div key={s.key} className={styles.statCard}>
                <div className={`${styles.scoreRing} ${getScoreClass(Number(form[s.key]) || 0)}`}>
                  {form[s.key] || '—'}
                </div>
                <div>
                  <span className={styles.statLabel}>{s.label}</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className={styles.input}
                    style={{ width: 70, marginTop: 4, padding: '4px 8px', fontSize: 12 }}
                    value={form[s.key] || ''}
                    onChange={(e) => handleChange(s.key, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Author & Content */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}><BookOpen size={16} /> Author & Content Signals</h2>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>Author Bio <span className={styles.labelHint}>helps establish E-E-A-T expertise</span></label>
                <textarea className={styles.textarea} value={form.author_bio || ''} onChange={(e) => handleChange('author_bio', e.target.value)} rows={3} placeholder="Author credentials, expertise, and background..." />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Publication Date</label>
                <input type="date" className={styles.input} value={form.publication_date || ''} onChange={(e) => handleChange('publication_date', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Last Updated</label>
                <input type="date" className={styles.input} value={form.last_updated || ''} onChange={(e) => handleChange('last_updated', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Reading Time (min)</label>
                <input type="number" className={styles.input} value={form.reading_time || ''} onChange={(e) => handleChange('reading_time', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Entity Keywords & References */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}><Target size={16} /> Entity Keywords & References</h2>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>Entity Keywords <span className={styles.labelHint}>JSON array: ["MBA","Business Analytics","AI"]</span></label>
                <textarea className={styles.textarea} value={form.entity_keywords || '[]'} onChange={(e) => handleChange('entity_keywords', e.target.value)} rows={2} />
              </div>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>References <span className={styles.labelHint}>JSON array of citation URLs</span></label>
                <textarea className={styles.textarea} value={form.references || '[]'} onChange={(e) => handleChange('references', e.target.value)} rows={2} />
              </div>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>Sources <span className={styles.labelHint}>{"JSON: [{\"name\":\"Source\",\"url\":\"https://...\"}]"}</span></label>
                <textarea className={styles.textarea} value={form.sources || '[]'} onChange={(e) => handleChange('sources', e.target.value)} rows={2} />
              </div>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>Internal Linking Suggestions <span className={styles.labelHint}>{"JSON: [{\"text\":\"link text\",\"url\":\"/page\"}]"}</span></label>
                <textarea className={styles.textarea} value={form.internal_linking_suggestions || '[]'} onChange={(e) => handleChange('internal_linking_suggestions', e.target.value)} rows={2} />
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.btnPrimary} disabled={saving}>
              <Save size={15} /> {saving ? 'Saving...' : 'Save GEO Data'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// Inline placeholder since lucide doesn't have Shield2
function Shield2(props: any) {
  return <Bot {...props} />;
}
