/* ============================================================
   ABS — Global SEO Settings Page
   Tabbed form for all global SEO configuration.
   ============================================================ */

'use client';

import React, { useState, useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { useQueryClient } from '@tanstack/react-query';
import { seoService, SeoSettingRecord } from '@/services/seoService';
import styles from '../Seo.module.css';
import toast from 'react-hot-toast';
import { Save, Globe, Building2, Share2, BarChart3, Shield, Image } from 'lucide-react';

const TABS = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'social', label: 'Social Links', icon: Share2 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'verification', label: 'Verification', icon: Shield },
  { id: 'opengraph', label: 'Open Graph', icon: Image },
  { id: 'twitter', label: 'Twitter', icon: Share2 },
];

export default function SeoSettingsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const { data: rawData, isLoading } = useFetch<any>('/admin/seo/settings', ['seo_settings_admin']);

  const settingsList: SeoSettingRecord[] = rawData?.data || rawData || [];

  useEffect(() => {
    if (Array.isArray(settingsList) && settingsList.length > 0) {
      const map: Record<string, string> = {};
      settingsList.forEach((s) => {
        map[s.key] = s.value ?? '';
      });
      setFormState(map);
    }
  }, [settingsList]);

  const handleChange = (key: string, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('_method', 'PUT');
      Object.entries(formState).forEach(([k, v]) => {
        fd.append(`settings[${k}]`, v);
      });
      await seoService.updateSettings(fd);
      toast.success('SEO settings saved successfully.');
      queryClient.invalidateQueries({ queryKey: ['seo_settings_admin'] });
    } catch {
      toast.error('Failed to save SEO settings.');
    } finally {
      setSaving(false);
    }
  };

  const filteredSettings = Array.isArray(settingsList)
    ? settingsList.filter((s) => s.group === activeTab)
    : [];

  if (isLoading) {
    return <div style={{ color: 'var(--color-gold)', padding: '40px' }}>Loading SEO settings...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={13} style={{ marginRight: 5, display: 'inline', verticalAlign: '-2px' }} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Fields */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {TABS.find((t) => t.id === activeTab)?.label} Settings
        </h2>

        <div className={styles.formGrid}>
          {filteredSettings.map((setting) => (
            <div
              key={setting.key}
              className={`${styles.formGroup} ${setting.type === 'textarea' ? styles.formGridFull : ''}`}
            >
              <label className={styles.label}>
                {setting.label || setting.key}
                {setting.description && (
                  <span className={styles.labelHint}> — {setting.description}</span>
                )}
              </label>

              {setting.type === 'textarea' ? (
                <textarea
                  className={styles.textarea}
                  value={formState[setting.key] || ''}
                  onChange={(e) => handleChange(setting.key, e.target.value)}
                  rows={3}
                />
              ) : setting.type === 'boolean' ? (
                <select
                  className={styles.select}
                  value={formState[setting.key] || 'false'}
                  onChange={(e) => handleChange(setting.key, e.target.value)}
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              ) : setting.type === 'image' ? (
                <div>
                  <input
                    type="text"
                    className={styles.input}
                    value={formState[setting.key] || ''}
                    onChange={(e) => handleChange(setting.key, e.target.value)}
                    placeholder="Image URL or upload path"
                  />
                  {formState[setting.key] && (
                    <div style={{ marginTop: 8, padding: 8, background: 'rgba(255,255,255,0.03)', borderRadius: 8, display: 'inline-block' }}>
                      <img
                        src={formState[setting.key]}
                        alt={setting.label || ''}
                        style={{ maxHeight: 60, maxWidth: 200, objectFit: 'contain' }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  className={styles.input}
                  value={formState[setting.key] || ''}
                  onChange={(e) => handleChange(setting.key, e.target.value)}
                />
              )}
            </div>
          ))}

          {filteredSettings.length === 0 && (
            <div className={styles.formGridFull}>
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>No settings found for this group.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save */}
      <div className={styles.actions}>
        <button type="submit" className={styles.btnPrimary} disabled={saving}>
          <Save size={15} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
