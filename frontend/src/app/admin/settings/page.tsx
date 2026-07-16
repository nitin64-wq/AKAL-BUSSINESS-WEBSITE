/* ============================================================
   ABS — Global Settings Panel
   Allows administrators (restricted to admin role) to update website parameters.
   ============================================================ */

'use client';

import React, { useState, useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { usePermission } from '@/hooks/usePermission';
import api from '@/lib/api';
import styles from './Settings.module.css';
import { Button } from '@/components/ui';
import { FileUpload } from '@/components/admin';
import { getImageUrl } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ShieldAlert, Save } from 'lucide-react';

interface SettingRecord {
  id: number;
  key: string;
  value: string;
  type: 'text' | 'number' | 'boolean' | 'json';
  group: string;
  label: string | null;
}

export default function AdminSettingsPage() {
  const { role } = usePermission();
  const queryClient = useQueryClient();

  // Fetch settings from admin settings endpoint
  const { data: settingsList, isLoading } = useFetch<SettingRecord[]>(
    '/admin/settings',
    ['admin_settings_all']
  );

  const [settingsState, setSettingsState] = useState<Record<string, any>>({});
  const [whyAbsImageFile, setWhyAbsImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // Sync state with fetched settings
  useEffect(() => {
    if (settingsList && settingsList.length > 0) {
      const stateMap: Record<string, any> = {};
      settingsList.forEach((item) => {
        if (item.type === 'boolean') {
          stateMap[item.key] = item.value === 'true' || item.value === '1';
        } else if (item.type === 'number') {
          stateMap[item.key] = Number(item.value);
        } else {
          stateMap[item.key] = item.value;
        }
      });
      setSettingsState(stateMap);
    }
  }, [settingsList]);

  // Auth block
  if (role !== 'admin') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-12) 0',
        color: 'var(--color-error)'
      }}>
        <ShieldAlert size={48} style={{ marginBottom: 'var(--space-4)' }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold' }}>Access Denied</h2>
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
          You do not have administrative permissions to view or edit system settings.
        </p>
      </div>
    );
  }

  const handleTextChange = (key: string, val: string) => {
    setSettingsState((prev) => ({ ...prev, [key]: val }));
  };

  const handleNumberChange = (key: string, val: string) => {
    setSettingsState((prev) => ({ ...prev, [key]: val === '' ? '' : Number(val) }));
  };

  const handleCheckboxChange = (key: string, val: boolean) => {
    setSettingsState((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT'); // Laravel method spoofing for PUT with file upload

      Object.keys(settingsState).forEach((key) => {
        const val = settingsState[key];
        if (typeof val === 'boolean') {
          formData.append(`settings[${key}]`, val ? 'true' : 'false');
        } else {
          formData.append(`settings[${key}]`, String(val));
        }
      });

      if (whyAbsImageFile) {
        formData.append('why_abs_image_file', whyAbsImageFile);
      }

      await api.post('/admin/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('System settings updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin_settings_all'] });
      queryClient.invalidateQueries({ queryKey: ['settings_public'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
    } catch {
      toast.error('Failed to update system settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div style={{ color: 'var(--color-gold)' }}>Loading configuration values...</div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          
          {/* General settings group */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>General Portal Settings</h2>
            <div className={styles.grid}>
              {/* Contact Email */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Director Contact Email</label>
                <input
                  type="email"
                  value={settingsState.contact_email || ''}
                  onChange={(e) => handleTextChange('contact_email', e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              {/* Admissions phone */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Admissions Desk Phone</label>
                <input
                  type="text"
                  value={settingsState.contact_phone || ''}
                  onChange={(e) => handleTextChange('contact_phone', e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              {/* Admission Session */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Active Admission Session</label>
                <input
                  type="text"
                  value={settingsState.current_session || ''}
                  onChange={(e) => handleTextChange('current_session', e.target.value)}
                  className={styles.input}
                  placeholder="e.g. 2026-2028"
                  required
                />
              </div>

              {/* Google Form URL */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Admissions Google Form URL</label>
                <input
                  type="text"
                  value={settingsState.google_form_link || ''}
                  onChange={(e) => handleTextChange('google_form_link', e.target.value)}
                  className={styles.input}
                  placeholder="https://forms.gle/..."
                />
              </div>

              {/* Why Choose ABS Section Image */}
              <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                <label className={styles.label}>Why Choose ABS Section Image</label>
                <FileUpload
                  onChange={(file) => {
                    setWhyAbsImageFile(file);
                    if (file === null) {
                      setSettingsState((prev) => ({ ...prev, why_abs_image: '' }));
                    }
                  }}
                  accept="image/*"
                  label="Select Section Image (Max 3MB)"
                  currentFileUrl={settingsState.why_abs_image ? getImageUrl(settingsState.why_abs_image) : undefined}
                />
              </div>
            </div>
          </div>

          {/* Stats metrics group */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Home Page Statistics & Metrics</h2>
            <div className={styles.grid}>
              {/* Placement rate */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Placement Success Rate (%)</label>
                <input
                  type="number"
                  value={settingsState.placement_rate ?? ''}
                  onChange={(e) => handleNumberChange('placement_rate', e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              {/* Highest Package */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Highest Package LPA (Lakhs Per Annum)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settingsState.highest_package ?? ''}
                  onChange={(e) => handleNumberChange('highest_package', e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              {/* Average Package */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Average Package LPA (Lakhs Per Annum)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settingsState.average_package ?? ''}
                  onChange={(e) => handleNumberChange('average_package', e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              {/* Alumni count */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Total Alumni Count</label>
                <input
                  type="number"
                  value={settingsState.alumni_count ?? ''}
                  onChange={(e) => handleNumberChange('alumni_count', e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              {/* Recruiters count */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Corporate Recruiters Count</label>
                <input
                  type="number"
                  value={settingsState.corporate_recruiters ?? ''}
                  onChange={(e) => handleNumberChange('corporate_recruiters', e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              {/* Partnerships count */}
              <div className={styles.formGroup}>
                <label className={styles.label}>International Partner Collaborations</label>
                <input
                  type="number"
                  value={settingsState.international_partners ?? ''}
                  onChange={(e) => handleNumberChange('international_partners', e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              {/* Faculty count */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Total Faculty Count</label>
                <input
                  type="number"
                  value={settingsState.faculty_count ?? ''}
                  onChange={(e) => handleNumberChange('faculty_count', e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>
          </div>

          {/* Homepage Sections Visibility */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Homepage Sections Visibility</h2>
            <p className={styles.sectionSubtitle} style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>
              Enable or disable sections on the public facing homepage in real-time.
            </p>
            <div className={styles.grid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
              {[
                { key: 'section_hero', label: 'Hero Banner Carousel' },
                { key: 'section_stats', label: 'Statistics Bar' },
                { key: 'section_announcements', label: 'Announcements Section' },
                { key: 'section_why_abs', label: 'Why ABS Section' },
                { key: 'section_programs', label: 'Academic Programs Section' },
                { key: 'section_impact_numbers', label: 'ABS by the Numbers (Metrics)' },
                { key: 'section_global_learning', label: 'Global Learning (MoUs)' },
                { key: 'section_placements', label: 'Placements Ticker (Marquee)' },
                { key: 'section_faculty', label: 'Faculty Carousel' },
                { key: 'section_scholarships', label: 'Scholarships & Aids' },
                { key: 'section_campus_life', label: 'Vibrant Campus Life Grid' },
                { key: 'section_testimonials', label: 'Student Testimonials' },
                { key: 'section_news', label: 'Latest News & Events' },
                { key: 'section_achievements', label: 'Student Milestones & Achievements' },
              ].map((item) => (
                <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
                  <input
                    type="checkbox"
                    id={item.key}
                    checked={!!settingsState[item.key]}
                    onChange={(e) => handleCheckboxChange(item.key, e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-gold)' }}
                  />
                  <label htmlFor={item.key} style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: '#334155', cursor: 'pointer', userSelect: 'none' }}>
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className={styles.actions}>
            <Button type="submit" variant="primary" size="md" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Save size={16} /> {saving ? 'Saving config...' : 'Save Configuration'}
            </Button>
          </div>

        </form>
      )}
    </div>
  );
}
