/* ============================================================
   ABS — Google & Analytics Configuration
   Manage Google Analytics, GTM, Search Console, verification codes.
   ============================================================ */

'use client';

import React, { useState, useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { useQueryClient } from '@tanstack/react-query';
import { seoService, SeoSettingRecord } from '@/services/seoService';
import styles from '../Seo.module.css';
import toast from 'react-hot-toast';
import { Save, Globe, BarChart3, Search, Shield, Zap } from 'lucide-react';

const FIELDS = [
  { group: 'Analytics & Tracking', icon: BarChart3, color: '#F59E0B', items: [
    { key: 'google_analytics_id', label: 'Google Analytics ID', placeholder: 'G-XXXXXXXXXX', desc: 'Google Analytics 4 Measurement ID' },
    { key: 'google_tag_manager_id', label: 'Google Tag Manager ID', placeholder: 'GTM-XXXXXXX', desc: 'Tag Manager Container ID' },
    { key: 'facebook_pixel_id', label: 'Facebook Pixel ID', placeholder: '123456789', desc: 'Meta Pixel tracking ID' },
    { key: 'indexnow_api_key', label: 'IndexNow API Key', placeholder: 'Your IndexNow API key', desc: 'For instant URL indexing on Bing & Yandex' },
  ]},
  { group: 'Search Engine Verification', icon: Shield, color: '#22C55E', items: [
    { key: 'google_verification', label: 'Google Search Console', placeholder: 'Verification code', desc: 'google-site-verification meta tag content' },
    { key: 'bing_verification', label: 'Bing Webmaster Tools', placeholder: 'Verification code', desc: 'msvalidate.01 meta tag content' },
    { key: 'yandex_verification', label: 'Yandex Webmaster', placeholder: 'Verification code', desc: 'yandex-verification meta tag content' },
    { key: 'baidu_verification', label: 'Baidu Webmaster', placeholder: 'Verification code', desc: 'baidu-site-verification meta tag content' },
  ]},
];

export default function GooglePage() {
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
      const fd = new FormData();
      fd.append('_method', 'PUT');
      // Only send relevant fields
      const relevantKeys = FIELDS.flatMap((g) => g.items.map((i) => i.key));
      relevantKeys.forEach((k) => {
        fd.append(`settings[${k}]`, formState[k] || '');
      });
      await seoService.updateSettings(fd);
      toast.success('Google & Analytics settings saved.');
      queryClient.invalidateQueries({ queryKey: ['seo_settings_admin'] });
    } catch {
      toast.error('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div style={{ color: 'var(--color-gold)', padding: 40 }}>Loading...</div>;
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Google & Analytics</h1>
          <p className={styles.pageSubtitle}>Configure tracking, verification, and search engine integrations</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {FIELDS.map((group) => (
          <div key={group.group} className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <group.icon size={16} style={{ color: group.color }} /> {group.group}
            </h2>
            <div className={styles.formGrid}>
              {group.items.map((field) => {
                const hasValue = !!formState[field.key];
                return (
                  <div key={field.key} className={styles.formGroup}>
                    <label className={styles.label}>
                      {field.label}
                      {hasValue ? (
                        <span className={`${styles.badge} ${styles.badgeGreen}`} style={{ marginLeft: 8 }}>
                          <Zap size={9} /> Active
                        </span>
                      ) : (
                        <span className={`${styles.badge} ${styles.badgeAmber}`} style={{ marginLeft: 8 }}>
                          Not Set
                        </span>
                      )}
                    </label>
                    <input
                      className={styles.input}
                      value={formState[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                    <span className={styles.labelHint}>{field.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Integration Status */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}><Globe size={16} /> Integration Status</h2>
          <div className={styles.statsGrid}>
            {[
              { label: 'Google Analytics', key: 'google_analytics_id', color: '#F59E0B' },
              { label: 'Google Tag Manager', key: 'google_tag_manager_id', color: '#3B82F6' },
              { label: 'Facebook Pixel', key: 'facebook_pixel_id', color: '#8B5CF6' },
              { label: 'Google Search Console', key: 'google_verification', color: '#22C55E' },
              { label: 'Bing Webmaster', key: 'bing_verification', color: '#0EA5E9' },
              { label: 'IndexNow', key: 'indexnow_api_key', color: '#F97316' },
            ].map((item) => (
              <div key={item.key} className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: `${item.color}15`, color: item.color }}>
                  {formState[item.key] ? <Zap size={18} /> : <Search size={18} />}
                </div>
                <div>
                  <span className={styles.statValue} style={{ fontSize: 'var(--text-sm)' }}>
                    {formState[item.key] ? '✓ Connected' : '✗ Not Set'}
                  </span>
                  <span className={styles.statLabel}>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.btnPrimary} disabled={saving}>
            <Save size={15} /> {saving ? 'Saving...' : 'Save Google Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
