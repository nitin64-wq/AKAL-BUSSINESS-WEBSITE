/* ============================================================
   ABS — Robots & Sitemap Settings
   Dynamic robots.txt configuration.
   ============================================================ */

'use client';

import React, { useState, useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { useQueryClient } from '@tanstack/react-query';
import { seoService, SeoSettingRecord } from '@/services/seoService';
import styles from '../Seo.module.css';
import toast from 'react-hot-toast';
import { Save, Shield, Eye, FileText } from 'lucide-react';

export default function RobotsPage() {
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const { data: rawData, isLoading } = useFetch<any>('/admin/seo/settings', ['seo_settings_admin']);
  const settingsList: SeoSettingRecord[] = rawData?.data || rawData || [];

  useEffect(() => {
    if (Array.isArray(settingsList) && settingsList.length > 0) {
      const map: Record<string, string> = {};
      settingsList.forEach((s) => { map[s.key] = s.value ?? ''; });
      setFormState(map);
    }
  }, [settingsList]);

  const handleChange = (key: string, val: string) => {
    setFormState((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const robotsFields = ['robots_user_agent', 'robots_allow', 'robots_disallow', 'robots_crawl_delay', 'robots_sitemap_url', 'robots_host'];
      const fd = new FormData();
      fd.append('_method', 'PUT');
      robotsFields.forEach((k) => {
        fd.append(`settings[${k}]`, formState[k] || '');
      });
      await seoService.updateSettings(fd);
      toast.success('Robots settings saved.');
      queryClient.invalidateQueries({ queryKey: ['seo_settings_admin'] });
    } catch {
      toast.error('Failed to save robots settings.');
    } finally {
      setSaving(false);
    }
  };

  // Generate preview
  const previewText = [
    `User-agent: ${formState['robots_user_agent'] || '*'}`,
    ...(formState['robots_allow'] || '/').split('\n').filter(Boolean).map((r) => `Allow: ${r.trim()}`),
    ...(formState['robots_disallow'] || '/admin/').split('\n').filter(Boolean).map((r) => `Disallow: ${r.trim()}`),
    formState['robots_crawl_delay'] ? `Crawl-delay: ${formState['robots_crawl_delay']}` : '',
    formState['robots_host'] ? `Host: ${formState['robots_host']}` : '',
    '',
    `Sitemap: ${formState['robots_sitemap_url'] || 'https://business.auts.ac.in/sitemap.xml'}`,
  ].filter(Boolean).join('\n');

  if (isLoading) {
    return <div style={{ color: 'var(--color-gold)', padding: 40 }}>Loading...</div>;
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Robots & Sitemap</h1>
          <p className={styles.pageSubtitle}>Configure dynamic robots.txt and sitemap settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}><Shield size={16} /> Robots.txt Configuration</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>User-Agent</label>
              <input className={styles.input} value={formState['robots_user_agent'] || '*'} onChange={(e) => handleChange('robots_user_agent', e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Crawl Delay <span className={styles.labelHint}>(seconds)</span></label>
              <input className={styles.input} value={formState['robots_crawl_delay'] || ''} onChange={(e) => handleChange('robots_crawl_delay', e.target.value)} placeholder="Optional" />
            </div>
            <div className={`${styles.formGroup} ${styles.formGridFull}`}>
              <label className={styles.label}>Allow Rules <span className={styles.labelHint}>(one per line)</span></label>
              <textarea className={styles.textarea} value={formState['robots_allow'] || '/'} onChange={(e) => handleChange('robots_allow', e.target.value)} rows={3} />
            </div>
            <div className={`${styles.formGroup} ${styles.formGridFull}`}>
              <label className={styles.label}>Disallow Rules <span className={styles.labelHint}>(one per line)</span></label>
              <textarea className={styles.textarea} value={formState['robots_disallow'] || '/admin/'} onChange={(e) => handleChange('robots_disallow', e.target.value)} rows={3} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Host</label>
              <input className={styles.input} value={formState['robots_host'] || ''} onChange={(e) => handleChange('robots_host', e.target.value)} placeholder="https://business.auts.ac.in" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Sitemap URL</label>
              <input className={styles.input} value={formState['robots_sitemap_url'] || ''} onChange={(e) => handleChange('robots_sitemap_url', e.target.value)} placeholder="https://business.auts.ac.in/sitemap.xml" />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}><Eye size={16} /> robots.txt Preview</h2>
          <pre className={styles.jsonEditor} style={{ minHeight: 100 }}>
            {previewText}
          </pre>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.btnPrimary} disabled={saving}>
            <Save size={15} /> {saving ? 'Saving...' : 'Save Robots Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
