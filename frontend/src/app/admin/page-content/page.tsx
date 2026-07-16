/* ============================================================
   ABS — Page Content Editor (Admin)
   Lets admins edit all static text, images, features, and
   navigation across every page of the website.
   ============================================================ */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { usePermission } from '@/hooks/usePermission';
import api from '@/lib/api';
import styles from './PageContent.module.css';
import { Button } from '@/components/ui';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ShieldAlert, Save, Plus, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { FileUpload } from '@/components/admin';
import { getImageUrl } from '@/lib/utils';

interface SettingRecord {
  id: number;
  key: string;
  value: string;
  type: 'text' | 'number' | 'boolean' | 'json';
  group: string;
  label: string | null;
}

type TabKey = 'home' | 'about' | 'academics' | 'admissions' | 'contact' | 'navigation' | 'placements';
type AboutSubKey = 'main' | 'founders' | 'chancellors' | 'vc' | 'directors' | 'kalgidhar' | 'recognitions' | 'why_abs' | 'vision_mission';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'home', label: 'Home Page' },
  { key: 'about', label: 'About Pages' },
  { key: 'academics', label: 'Academics' },
  { key: 'admissions', label: 'Admissions' },
  { key: 'contact', label: 'Contact & Facilities' },
  { key: 'navigation', label: 'Navigation & Footer' },
  { key: 'placements', label: 'Placements List' },
];

const ABOUT_SUBTABS: { key: AboutSubKey; label: string }[] = [
  { key: 'main', label: 'About Main' },
  { key: 'founders', label: 'Founders' },
  { key: 'chancellors', label: "Chancellor's Msg" },
  { key: 'vc', label: "VC's Message" },
  { key: 'directors', label: "Director's Msg" },
  { key: 'kalgidhar', label: 'Kalgidhar Society' },
  { key: 'recognitions', label: 'Recognitions' },
  { key: 'why_abs', label: 'Why ABS' },
  { key: 'vision_mission', label: 'Vision & Mission' },
];

export default function AdminPageContentPage() {
  const { role } = usePermission();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [aboutSubTab, setAboutSubTab] = useState<AboutSubKey>('main');

  const { data: settingsList, isLoading } = useFetch<SettingRecord[]>(
    '/admin/settings',
    ['admin_settings_all']
  );

  // Local state for all page content settings as parsed JSON objects
  const [contentState, setContentState] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState<Record<string, File | null>>({});

  // Parse settings into content state
  useEffect(() => {
    if (settingsList && settingsList.length > 0) {
      const parsed: Record<string, any> = {};
      settingsList.forEach((item) => {
        if (item.type === 'json' && item.group === 'page_content') {
          try {
            parsed[item.key] = JSON.parse(item.value);
          } catch {
            parsed[item.key] = {};
          }
        }
      });
      setContentState(parsed);
    }
  }, [settingsList]);



  // ─── Helper: Update a nested field in a content key ───
  const updateField = useCallback((settingKey: string, fieldPath: string, value: any) => {
    setContentState((prev) => {
      const obj = { ...(prev[settingKey] || {}) };
      const keys = fieldPath.split('.');
      let ref: any = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (Array.isArray(ref[k])) {
          ref[k] = [...ref[k]];
        } else {
          ref[k] = { ...(ref[k] || {}) };
        }
        ref = ref[k];
      }
      ref[keys[keys.length - 1]] = value;
      return { ...prev, [settingKey]: obj };
    });
  }, []);

  // ─── Helper: Update an array item ───
  const updateArrayItem = useCallback((settingKey: string, arrayField: string, index: number, itemField: string, value: string) => {
    setContentState((prev) => {
      const obj = { ...(prev[settingKey] || {}) };
      const arr = [...(obj[arrayField] || [])];
      arr[index] = { ...arr[index], [itemField]: value };
      obj[arrayField] = arr;
      return { ...prev, [settingKey]: obj };
    });
  }, []);

  // ─── Helper: Add an item to an array ───
  const addArrayItem = useCallback((settingKey: string, arrayField: string, template: any) => {
    setContentState((prev) => {
      const obj = { ...(prev[settingKey] || {}) };
      const arr = [...(obj[arrayField] || []), template];
      obj[arrayField] = arr;
      return { ...prev, [settingKey]: obj };
    });
  }, []);

  // ─── Helper: Remove an item from an array ───
  const removeArrayItem = useCallback((settingKey: string, arrayField: string, index: number) => {
    setContentState((prev) => {
      const obj = { ...(prev[settingKey] || {}) };
      const arr = [...(obj[arrayField] || [])];
      arr.splice(index, 1);
      obj[arrayField] = arr;
      return { ...prev, [settingKey]: obj };
    });
  }, []);

  // ─── Helper: Update a string array item ───
  const updateStringArrayItem = useCallback((settingKey: string, arrayField: string, index: number, value: string) => {
    setContentState((prev) => {
      const obj = { ...(prev[settingKey] || {}) };
      const arr = [...(obj[arrayField] || [])];
      arr[index] = value;
      obj[arrayField] = arr;
      return { ...prev, [settingKey]: obj };
    });
  }, []);

  // ─── Save handler ───
  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');

      // Send each page content key as settings[key] = JSON string
      Object.entries(contentState).forEach(([key, value]) => {
        formData.append(`settings[${key}]`, JSON.stringify(value));
      });

      // Handle any image file uploads
      Object.entries(imageFiles).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      await api.post('/admin/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Page content updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin_settings_all'] });
      queryClient.invalidateQueries({ queryKey: ['settings_public'] });
      setImageFiles({});
    } catch {
      toast.error('Failed to update page content.');
    } finally {
      setSaving(false);
    }
  };

  // ─── Reusable field renderers ───
  const renderInput = (settingKey: string, field: string, label: string, opts?: { placeholder?: string; fullWidth?: boolean }) => (
    <div className={clsx(styles.formGroup, opts?.fullWidth && styles.fullWidth)}>
      <label className={styles.label}>{label}</label>
      <input
        type="text"
        className={styles.input}
        value={contentState[settingKey]?.[field] ?? ''}
        onChange={(e) => updateField(settingKey, field, e.target.value)}
        placeholder={opts?.placeholder}
      />
    </div>
  );

  const renderTextarea = (settingKey: string, field: string, label: string, opts?: { rows?: number; fullWidth?: boolean }) => (
    <div className={clsx(styles.formGroup, opts?.fullWidth && styles.fullWidth)}>
      <label className={styles.label}>{label}</label>
      <textarea
        className={styles.textarea}
        rows={opts?.rows || 3}
        value={contentState[settingKey]?.[field] ?? ''}
        onChange={(e) => updateField(settingKey, field, e.target.value)}
      />
    </div>
  );

  const renderImageUpload = (settingKey: string, field: string, label: string) => {
    const fileKey = `${settingKey}_${field}_file`;
    const currentValue = contentState[settingKey]?.[field];
    
    return (
      <div className={clsx(styles.formGroup, styles.fullWidth)} style={{ marginTop: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <FileUpload
          onChange={(file) => {
            setImageFiles((prev) => ({ ...prev, [fileKey]: file }));
            // If the user clears the file, update the text field to empty string so it gets saved
            if (file === null) {
              updateField(settingKey, field, '');
            }
          }}
          accept="image/*"
          label={label}
          labelColor="#475569"
          currentFileUrl={currentValue ? getImageUrl(currentValue) : undefined}
        />
      </div>
    );
  };

  // ─── HOME TAB ───
  const renderHomeTab = () => (
    <>
      {/* Why ABS Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Why ABS Section</h2>
        <p className={styles.sectionSubtitle}>Edit the title, subtitle, description, and feature cards on the homepage &ldquo;Why ABS&rdquo; section.</p>
        <div className={styles.grid}>
          {renderInput('section_why_abs_content', 'title', 'Section Title')}
          {renderInput('section_why_abs_content', 'subtitle', 'Section Subtitle')}
          {renderTextarea('section_why_abs_content', 'description', 'Section Description', { fullWidth: true })}
        </div>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>Feature Cards</h3>
        <div className={styles.grid}>
          {(contentState.section_why_abs_content?.features || []).map((feat: any, idx: number) => (
            <div key={idx} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIndex}>Card #{idx + 1}</span>
                <button className={styles.removeBtn} onClick={() => removeArrayItem('section_why_abs_content', 'features', idx)}>
                  <Trash2 size={12} /> Remove
                </button>
              </div>
              <div className={styles.formGroup} style={{ marginBottom: '8px' }}>
                <label className={styles.label}>Title</label>
                <input className={styles.input} value={feat.title || ''} onChange={(e) => updateArrayItem('section_why_abs_content', 'features', idx, 'title', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea className={styles.textarea} rows={2} value={feat.desc || ''} onChange={(e) => updateArrayItem('section_why_abs_content', 'features', idx, 'desc', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
        <button className={styles.addBtn} onClick={() => addArrayItem('section_why_abs_content', 'features', { title: '', desc: '' })}>
          <Plus size={14} /> Add Feature Card
        </button>
      </div>

      {/* Impact Numbers Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Impact Numbers Section</h2>
        <p className={styles.sectionSubtitle}>Edit the header and stat descriptions for &ldquo;ABS By The Numbers&rdquo;.</p>
        <div className={styles.grid}>
          {renderInput('section_impact_numbers_content', 'title', 'Section Title')}
          {renderInput('section_impact_numbers_content', 'subtitle', 'Section Subtitle')}
          {renderTextarea('section_impact_numbers_content', 'description', 'Section Description', { fullWidth: true })}
        </div>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>Stat Item Labels & Descriptions</h3>
        <div className={styles.grid}>
          {(contentState.section_impact_numbers_content?.items || []).map((item: any, idx: number) => (
            <div key={idx} className={styles.card}>
              <span className={styles.cardIndex}>Stat #{idx + 1}</span>
              <div className={styles.formGroup} style={{ marginTop: '8px', marginBottom: '8px' }}>
                <label className={styles.label}>Label</label>
                <input className={styles.input} value={item.label || ''} onChange={(e) => updateArrayItem('section_impact_numbers_content', 'items', idx, 'label', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea className={styles.textarea} rows={2} value={item.desc || ''} onChange={(e) => updateArrayItem('section_impact_numbers_content', 'items', idx, 'desc', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campus Life Header */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Campus Life Section Header</h2>
        <div className={styles.grid}>
          {renderInput('section_campus_life_content', 'title', 'Section Title')}
          {renderTextarea('section_campus_life_content', 'subtitle', 'Section Subtitle', { fullWidth: true })}
        </div>
      </div>

      {/* Global Learning Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Global Learning Section</h2>
        <div className={styles.grid}>
          {renderInput('section_global_learning_content', 'title', 'Section Title')}
          {renderInput('section_global_learning_content', 'subtitle', 'Section Subtitle')}
          {renderTextarea('section_global_learning_content', 'description', 'Section Description', { fullWidth: true })}
        </div>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>Benefits List</h3>
        {(contentState.section_global_learning_content?.benefits || []).map((benefit: string, idx: number) => (
          <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
            <input className={styles.input} style={{ flex: 1 }} value={benefit} onChange={(e) => updateStringArrayItem('section_global_learning_content', 'benefits', idx, e.target.value)} />
            <button className={styles.removeBtn} onClick={() => removeArrayItem('section_global_learning_content', 'benefits', idx)}><Trash2 size={12} /></button>
          </div>
        ))}
        <button className={styles.addBtn} onClick={() => addArrayItem('section_global_learning_content', 'benefits', '')}>
          <Plus size={14} /> Add Benefit
        </button>
      </div>
    </>
  );

  // ─── ABOUT TAB ───
  const renderAboutTab = () => {
    const renderMessagePage = (settingKey: string, hasSignoffEmail?: boolean) => {
      const data = contentState[settingKey] || {};
      return (
        <div className={styles.section}>
          <div className={styles.grid}>
            {renderInput(settingKey, 'hero_title', 'Hero Title')}
            {renderTextarea(settingKey, 'hero_subtitle', 'Hero Subtitle', { fullWidth: true })}
            {renderInput(settingKey, 'section_title', 'Section Heading')}
          </div>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>Paragraphs</h3>
          {(data.paragraphs || []).map((para: string, idx: number) => (
            <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px' }}>
              <textarea className={styles.textarea} rows={3} style={{ flex: 1 }} value={para} onChange={(e) => updateStringArrayItem(settingKey, 'paragraphs', idx, e.target.value)} />
              <button className={styles.removeBtn} onClick={() => removeArrayItem(settingKey, 'paragraphs', idx)}><Trash2 size={12} /></button>
            </div>
          ))}
          <button className={styles.addBtn} onClick={() => addArrayItem(settingKey, 'paragraphs', '')}>
            <Plus size={14} /> Add Paragraph
          </button>
          <div className={styles.grid} style={{ marginTop: 'var(--space-4)' }}>
            {data.signoff !== undefined && renderInput(settingKey, 'signoff', 'Signoff Line')}
            {data.signoff_name !== undefined && renderInput(settingKey, 'signoff_name', 'Signoff Name')}
            {data.signoff_title !== undefined && renderInput(settingKey, 'signoff_title', 'Signoff Title')}
            {hasSignoffEmail && renderInput(settingKey, 'signoff_email', 'Signoff Email')}
            {renderImageUpload(
              settingKey, 
              'image', 
              settingKey.includes('chancellor') 
                ? "Chancellor's Photo" 
                : settingKey.includes('vc') 
                  ? "Vice Chancellor's Photo" 
                  : "Director's Photo"
            )}
          </div>
        </div>
      );
    };

    switch (aboutSubTab) {
      case 'main':
        return (
          <>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>About Main Page — Hero & MBA Section</h2>
              <div className={styles.grid}>
                {renderInput('page_about_main', 'hero_title', 'Hero Title')}
                {renderTextarea('page_about_main', 'hero_subtitle', 'Hero Subtitle', { fullWidth: true })}
                {renderInput('page_about_main', 'mba_title', 'MBA Section Title', { fullWidth: true })}
                {renderTextarea('page_about_main', 'mba_para1', 'MBA Paragraph 1', { fullWidth: true })}
                {renderTextarea('page_about_main', 'mba_para2', 'MBA Paragraph 2', { fullWidth: true })}
                {renderImageUpload('page_about_main', 'mba_image', 'MBA Section Image')}
              </div>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Global MBA Experience</h2>
              <div className={styles.grid}>
                {renderInput('page_about_main', 'global_mba_title', 'Title', { fullWidth: true })}
                {renderTextarea('page_about_main', 'global_mba_text', 'Description', { fullWidth: true })}
              </div>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Curriculum Section</h2>
              <div className={styles.grid}>
                {renderInput('page_about_main', 'curriculum_title', 'Title', { fullWidth: true })}
                {renderTextarea('page_about_main', 'curriculum_subtitle', 'Subtitle', { fullWidth: true })}
              </div>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>Curriculum Areas</h3>
              {(contentState.page_about_main?.curriculum_areas || []).map((area: string, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <input className={styles.input} style={{ flex: 1 }} value={area} onChange={(e) => updateStringArrayItem('page_about_main', 'curriculum_areas', idx, e.target.value)} />
                  <button className={styles.removeBtn} onClick={() => removeArrayItem('page_about_main', 'curriculum_areas', idx)}><Trash2 size={12} /></button>
                </div>
              ))}
              <button className={styles.addBtn} onClick={() => addArrayItem('page_about_main', 'curriculum_areas', '')}>
                <Plus size={14} /> Add Area
              </button>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>Tools</h3>
              {(contentState.page_about_main?.tools || []).map((tool: string, idx: number) => (
                <div key={idx} style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', marginBottom: '4px', marginRight: '8px' }}>
                  <input className={styles.input} style={{ width: '140px' }} value={tool} onChange={(e) => updateStringArrayItem('page_about_main', 'tools', idx, e.target.value)} />
                  <button className={styles.removeBtn} onClick={() => removeArrayItem('page_about_main', 'tools', idx)}><Trash2 size={10} /></button>
                </div>
              ))}
              <button className={styles.addBtn} onClick={() => addArrayItem('page_about_main', 'tools', '')}>
                <Plus size={14} /> Add Tool
              </button>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Placement Section</h2>
              <div className={styles.grid}>
                {renderInput('page_about_main', 'placement_title', 'Title', { fullWidth: true })}
                {renderTextarea('page_about_main', 'placement_subtitle', 'Subtitle', { fullWidth: true })}
                {renderTextarea('page_about_main', 'placement_highlight', 'Highlight Text', { fullWidth: true })}
              </div>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>Placement Cards</h3>
              <div className={styles.grid}>
                {(contentState.page_about_main?.placement_cards || []).map((card: any, idx: number) => (
                  <div key={idx} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardIndex}>Card #{idx + 1}</span>
                      <button className={styles.removeBtn} onClick={() => removeArrayItem('page_about_main', 'placement_cards', idx)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className={styles.formGroup} style={{ marginBottom: '6px' }}>
                      <label className={styles.label}>Icon (emoji)</label>
                      <input className={styles.input} value={card.icon || ''} onChange={(e) => updateArrayItem('page_about_main', 'placement_cards', idx, 'icon', e.target.value)} />
                    </div>
                    <div className={styles.formGroup} style={{ marginBottom: '6px' }}>
                      <label className={styles.label}>Title</label>
                      <input className={styles.input} value={card.title || ''} onChange={(e) => updateArrayItem('page_about_main', 'placement_cards', idx, 'title', e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Description</label>
                      <input className={styles.input} value={card.desc || ''} onChange={(e) => updateArrayItem('page_about_main', 'placement_cards', idx, 'desc', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
              <button className={styles.addBtn} onClick={() => addArrayItem('page_about_main', 'placement_cards', { icon: '', title: '', desc: '' })}>
                <Plus size={14} /> Add Card
              </button>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>Placement Roles</h3>
              {(contentState.page_about_main?.placement_roles || []).map((role: string, idx: number) => (
                <div key={idx} style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', marginBottom: '4px', marginRight: '8px' }}>
                  <input className={styles.input} style={{ width: '160px' }} value={role} onChange={(e) => updateStringArrayItem('page_about_main', 'placement_roles', idx, e.target.value)} />
                  <button className={styles.removeBtn} onClick={() => removeArrayItem('page_about_main', 'placement_roles', idx)}><Trash2 size={10} /></button>
                </div>
              ))}
              <button className={styles.addBtn} onClick={() => addArrayItem('page_about_main', 'placement_roles', '')}>
                <Plus size={14} /> Add Role
              </button>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>MoUs Section</h2>
              <div className={styles.grid}>
                {renderInput('page_about_main', 'mou_title', 'Section Title', { fullWidth: true })}
                {renderTextarea('page_about_main', 'mou_quote', 'Quote / Closing Text', { fullWidth: true })}
              </div>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>MoU Universities</h3>
              <div className={styles.grid}>
                {(contentState.page_about_main?.mou_universities || []).map((uni: any, idx: number) => (
                  <div key={idx} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardIndex}>University #{idx + 1}</span>
                      <button className={styles.removeBtn} onClick={() => removeArrayItem('page_about_main', 'mou_universities', idx)}><Trash2 size={12} /></button>
                    </div>
                    <div className={styles.formGroup} style={{ marginBottom: '6px' }}>
                      <label className={styles.label}>Icon</label>
                      <input className={styles.input} value={uni.icon || ''} onChange={(e) => updateArrayItem('page_about_main', 'mou_universities', idx, 'icon', e.target.value)} />
                    </div>
                    <div className={styles.formGroup} style={{ marginBottom: '6px' }}>
                      <label className={styles.label}>Name</label>
                      <input className={styles.input} value={uni.name || ''} onChange={(e) => updateArrayItem('page_about_main', 'mou_universities', idx, 'name', e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Description</label>
                      <textarea className={styles.textarea} rows={2} value={uni.desc || ''} onChange={(e) => updateArrayItem('page_about_main', 'mou_universities', idx, 'desc', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
              <button className={styles.addBtn} onClick={() => addArrayItem('page_about_main', 'mou_universities', { icon: '🏛️', name: '', desc: '' })}>
                <Plus size={14} /> Add University
              </button>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Timeline / Milestones</h2>
              <div className={styles.grid}>
                {renderInput('page_about_main', 'timeline_title', 'Title')}
                {renderInput('page_about_main', 'timeline_subtitle', 'Subtitle')}
              </div>
              <div className={styles.grid} style={{ marginTop: 'var(--space-3)' }}>
                {(contentState.page_about_main?.milestones || []).map((ms: any, idx: number) => (
                  <div key={idx} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardIndex}>Milestone #{idx + 1}</span>
                      <button className={styles.removeBtn} onClick={() => removeArrayItem('page_about_main', 'milestones', idx)}><Trash2 size={12} /></button>
                    </div>
                    <div className={styles.formGroup} style={{ marginBottom: '6px' }}>
                      <label className={styles.label}>Year</label>
                      <input className={styles.input} value={ms.year || ''} onChange={(e) => updateArrayItem('page_about_main', 'milestones', idx, 'year', e.target.value)} />
                    </div>
                    <div className={styles.formGroup} style={{ marginBottom: '6px' }}>
                      <label className={styles.label}>Title</label>
                      <input className={styles.input} value={ms.title || ''} onChange={(e) => updateArrayItem('page_about_main', 'milestones', idx, 'title', e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Description</label>
                      <textarea className={styles.textarea} rows={2} value={ms.desc || ''} onChange={(e) => updateArrayItem('page_about_main', 'milestones', idx, 'desc', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
              <button className={styles.addBtn} onClick={() => addArrayItem('page_about_main', 'milestones', { year: '', title: '', desc: '' })}>
                <Plus size={14} /> Add Milestone
              </button>
            </div>
          </>
        );
      case 'founders':
        return (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Founders Page</h2>
            <div className={styles.grid}>
              {renderInput('page_about_founders', 'hero_title', 'Hero Title')}
              {renderTextarea('page_about_founders', 'hero_subtitle', 'Hero Subtitle', { fullWidth: true })}
              {renderInput('page_about_founders', 'section_title', 'Section Title')}
              {renderTextarea('page_about_founders', 'section_para1', 'Paragraph 1', { fullWidth: true, rows: 4 })}
              {renderTextarea('page_about_founders', 'section_para2', 'Paragraph 2', { fullWidth: true, rows: 4 })}
              {renderInput('page_about_founders', 'kalgidhar_title', 'Kalgidhar Section Title')}
              {renderTextarea('page_about_founders', 'kalgidhar_para1', 'Kalgidhar Paragraph 1', { fullWidth: true, rows: 4 })}
              {renderTextarea('page_about_founders', 'kalgidhar_para2', 'Kalgidhar Paragraph 2', { fullWidth: true, rows: 4 })}
              {renderImageUpload('page_about_founders', 'image', 'Founders Page Image')}
            </div>
          </div>
        );
      case 'chancellors':
        return renderMessagePage('page_about_chancellors_message');
      case 'vc':
        return renderMessagePage('page_about_vc_message');
      case 'directors':
        return renderMessagePage('page_about_directors_message', true);
      case 'kalgidhar':
        return (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Kalgidhar Society Page</h2>
            <div className={styles.grid}>
              {renderInput('page_about_kalgidhar', 'hero_title', 'Hero Title')}
              {renderTextarea('page_about_kalgidhar', 'hero_subtitle', 'Hero Subtitle', { fullWidth: true })}
              {renderInput('page_about_kalgidhar', 'section_title', 'Section Title')}
              {renderTextarea('page_about_kalgidhar', 'para1', 'Paragraph 1', { fullWidth: true, rows: 4 })}
              {renderTextarea('page_about_kalgidhar', 'para2', 'Paragraph 2', { fullWidth: true, rows: 4 })}
              {renderInput('page_about_kalgidhar', 'pillars_title', 'Pillars Section Title')}
              {renderImageUpload('page_about_kalgidhar', 'image', 'Kalgidhar Page Image')}
            </div>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>Key Pillars</h3>
            <div className={styles.grid}>
              {(contentState.page_about_kalgidhar?.pillars || []).map((pillar: any, idx: number) => (
                <div key={idx} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardIndex}>Pillar #{idx + 1}</span>
                    <button className={styles.removeBtn} onClick={() => removeArrayItem('page_about_kalgidhar', 'pillars', idx)}><Trash2 size={12} /></button>
                  </div>
                  <div className={styles.formGroup} style={{ marginBottom: '6px' }}>
                    <label className={styles.label}>Title</label>
                    <input className={styles.input} value={pillar.title || ''} onChange={(e) => updateArrayItem('page_about_kalgidhar', 'pillars', idx, 'title', e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Description</label>
                    <textarea className={styles.textarea} rows={2} value={pillar.desc || ''} onChange={(e) => updateArrayItem('page_about_kalgidhar', 'pillars', idx, 'desc', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
            <button className={styles.addBtn} onClick={() => addArrayItem('page_about_kalgidhar', 'pillars', { title: '', desc: '' })}>
              <Plus size={14} /> Add Pillar
            </button>
          </div>
        );
      case 'recognitions':
        return (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Recognitions & Approvals Page</h2>
            <div className={styles.grid}>
              {renderInput('page_about_recognitions', 'hero_title', 'Hero Title')}
              {renderTextarea('page_about_recognitions', 'hero_subtitle', 'Hero Subtitle', { fullWidth: true })}
              {renderInput('page_about_recognitions', 'section_title', 'Section Title', { fullWidth: true })}
            </div>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>Recognitions</h3>
            <div className={styles.grid}>
              {(contentState.page_about_recognitions?.recognitions || []).map((rec: any, idx: number) => (
                <div key={idx} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardIndex}>#{idx + 1}</span>
                    <button className={styles.removeBtn} onClick={() => removeArrayItem('page_about_recognitions', 'recognitions', idx)}><Trash2 size={12} /></button>
                  </div>
                  <div className={styles.formGroup} style={{ marginBottom: '6px' }}>
                    <label className={styles.label}>Badge</label>
                    <input className={styles.input} value={rec.badge || ''} onChange={(e) => updateArrayItem('page_about_recognitions', 'recognitions', idx, 'badge', e.target.value)} />
                  </div>
                  <div className={styles.formGroup} style={{ marginBottom: '6px' }}>
                    <label className={styles.label}>Title</label>
                    <input className={styles.input} value={rec.title || ''} onChange={(e) => updateArrayItem('page_about_recognitions', 'recognitions', idx, 'title', e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Description</label>
                    <textarea className={styles.textarea} rows={2} value={rec.desc || ''} onChange={(e) => updateArrayItem('page_about_recognitions', 'recognitions', idx, 'desc', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
            <button className={styles.addBtn} onClick={() => addArrayItem('page_about_recognitions', 'recognitions', { title: '', desc: '', badge: '' })}>
              <Plus size={14} /> Add Recognition
            </button>
          </div>
        );
      case 'why_abs':
        return (
          <>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Why ABS Page</h2>
              <div className={styles.grid}>
                {renderInput('page_about_why_abs', 'hero_title', 'Hero Title')}
                {renderTextarea('page_about_why_abs', 'hero_subtitle', 'Hero Subtitle', { fullWidth: true })}
                {renderInput('page_about_why_abs', 'intro_title', 'Intro Title', { fullWidth: true })}
                {renderTextarea('page_about_why_abs', 'intro_text', 'Intro Text', { fullWidth: true })}
                {renderInput('page_about_why_abs', 'highlights_title', 'Highlights Section Title', { fullWidth: true })}
              </div>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Highlights</h2>
              <div className={styles.grid}>
                {(contentState.page_about_why_abs?.highlights || []).map((hl: any, idx: number) => (
                  <div key={idx} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardIndex}>#{idx + 1}</span>
                      <button className={styles.removeBtn} onClick={() => removeArrayItem('page_about_why_abs', 'highlights', idx)}><Trash2 size={12} /></button>
                    </div>
                    <div className={styles.formGroup} style={{ marginBottom: '6px' }}>
                      <label className={styles.label}>Title</label>
                      <input className={styles.input} value={hl.title || ''} onChange={(e) => updateArrayItem('page_about_why_abs', 'highlights', idx, 'title', e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Description</label>
                      <textarea className={styles.textarea} rows={2} value={hl.desc || ''} onChange={(e) => updateArrayItem('page_about_why_abs', 'highlights', idx, 'desc', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
              <button className={styles.addBtn} onClick={() => addArrayItem('page_about_why_abs', 'highlights', { title: '', desc: '' })}>
                <Plus size={14} /> Add Highlight
              </button>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>FAQs</h2>
              <div className={styles.grid}>
                {(contentState.page_about_why_abs?.faqs || []).map((faq: any, idx: number) => (
                  <div key={idx} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardIndex}>FAQ #{idx + 1}</span>
                      <button className={styles.removeBtn} onClick={() => removeArrayItem('page_about_why_abs', 'faqs', idx)}><Trash2 size={12} /></button>
                    </div>
                    <div className={styles.formGroup} style={{ marginBottom: '6px' }}>
                      <label className={styles.label}>Question</label>
                      <input className={styles.input} value={faq.q || ''} onChange={(e) => updateArrayItem('page_about_why_abs', 'faqs', idx, 'q', e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Answer</label>
                      <textarea className={styles.textarea} rows={3} value={faq.a || ''} onChange={(e) => updateArrayItem('page_about_why_abs', 'faqs', idx, 'a', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
              <button className={styles.addBtn} onClick={() => addArrayItem('page_about_why_abs', 'faqs', { q: '', a: '' })}>
                <Plus size={14} /> Add FAQ
              </button>
            </div>
          </>
        );
      case 'vision_mission':
        return (
          <>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Vision &amp; Mission Page — Hero &amp; Welcome</h2>
              <div className={styles.grid}>
                {renderInput('page_about_vision_mission', 'hero_title', 'Hero Title')}
                {renderTextarea('page_about_vision_mission', 'hero_subtitle', 'Hero Subtitle', { fullWidth: true })}
                {renderInput('page_about_vision_mission', 'welcome_title', 'Welcome Title', { fullWidth: true })}
                {renderTextarea('page_about_vision_mission', 'welcome_closing', 'Welcome Closing Text', { fullWidth: true, rows: 4 })}
              </div>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>Welcome Paragraphs</h3>
              {(contentState.page_about_vision_mission?.welcome_cards || []).map((card: string, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <textarea className={styles.textarea} rows={3} style={{ flex: 1 }} value={card} onChange={(e) => updateStringArrayItem('page_about_vision_mission', 'welcome_cards', idx, e.target.value)} />
                  <button className={styles.removeBtn} onClick={() => removeArrayItem('page_about_vision_mission', 'welcome_cards', idx)}><Trash2 size={12} /></button>
                </div>
              ))}
              <button className={styles.addBtn} onClick={() => addArrayItem('page_about_vision_mission', 'welcome_cards', '')}>
                <Plus size={14} /> Add Welcome Paragraph
              </button>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Mission &amp; Vision Statements</h2>
              <div className={styles.grid}>
                {renderInput('page_about_vision_mission', 'guiding_pillars_label', 'Guiding Pillars Label')}
                {renderInput('page_about_vision_mission', 'guiding_pillars_title', 'Guiding Pillars Title')}
                
                <div className={styles.card} style={{ gridColumn: '1 / -1', marginTop: 'var(--space-4)' }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Mission Statement</h4>
                  <div className={styles.grid}>
                    {renderInput('page_about_vision_mission', 'mission_title', 'Mission Title')}
                    {renderInput('page_about_vision_mission', 'mission_label', 'Mission Label')}
                    {renderTextarea('page_about_vision_mission', 'mission_text', 'Mission Text', { fullWidth: true, rows: 4 })}
                  </div>
                </div>

                <div className={styles.card} style={{ gridColumn: '1 / -1', marginTop: 'var(--space-4)' }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Vision Statement</h4>
                  <div className={styles.grid}>
                    {renderInput('page_about_vision_mission', 'vision_title', 'Vision Title')}
                    {renderInput('page_about_vision_mission', 'vision_label', 'Vision Label')}
                    {renderTextarea('page_about_vision_mission', 'vision_text', 'Vision Text', { fullWidth: true, rows: 4 })}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Scope of Akal Business School</h2>
              <div className={styles.grid}>
                {renderInput('page_about_vision_mission', 'scope_label', 'Scope Label')}
                {renderInput('page_about_vision_mission', 'scope_title', 'Scope Title')}
                {renderTextarea('page_about_vision_mission', 'scope_desc', 'Scope Description', { fullWidth: true })}
                {renderTextarea('page_about_vision_mission', 'scope_footer', 'Scope Footer Text', { fullWidth: true })}
              </div>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>Scope Items</h3>
              <div className={styles.grid}>
                {(contentState.page_about_vision_mission?.scope_items || []).map((item: any, idx: number) => (
                  <div key={idx} className={styles.card} style={{ gridColumn: '1 / -1' }}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardIndex}>Scope Item #{idx + 1}</span>
                      <button className={styles.removeBtn} onClick={() => removeArrayItem('page_about_vision_mission', 'scope_items', idx)}><Trash2 size={12} /></button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <div className={styles.formGroup} style={{ width: '80px' }}>
                        <label className={styles.label}>Icon</label>
                        <input className={styles.input} value={item.icon || ''} onChange={(e) => updateArrayItem('page_about_vision_mission', 'scope_items', idx, 'icon', e.target.value)} />
                      </div>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label className={styles.label}>Title</label>
                        <input className={styles.input} value={item.title || ''} onChange={(e) => updateArrayItem('page_about_vision_mission', 'scope_items', idx, 'title', e.target.value)} />
                      </div>
                    </div>
                    <div style={{ paddingLeft: '16px', borderLeft: '2px solid #E2E8F0', marginTop: '8px' }}>
                      <label className={styles.label}>Points / Bullet items</label>
                      {(item.points || []).map((point: string, pIdx: number) => (
                        <div key={pIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                          <input className={styles.input} style={{ flex: 1 }} value={point} onChange={(e) => {
                            const newItems = [...(contentState.page_about_vision_mission?.scope_items || [])];
                            const newPoints = [...newItems[idx].points];
                            newPoints[pIdx] = e.target.value;
                            newItems[idx] = { ...newItems[idx], points: newPoints };
                            updateField('page_about_vision_mission', 'scope_items', newItems);
                          }} />
                          <button className={styles.removeBtn} onClick={() => {
                            const newItems = [...(contentState.page_about_vision_mission?.scope_items || [])];
                            const newPoints = [...newItems[idx].points];
                            newPoints.splice(pIdx, 1);
                            newItems[idx] = { ...newItems[idx], points: newPoints };
                            updateField('page_about_vision_mission', 'scope_items', newItems);
                          }}><Trash2 size={10} /></button>
                        </div>
                      ))}
                      <button className={styles.addBtn} style={{ marginTop: '4px' }} onClick={() => {
                        const newItems = [...(contentState.page_about_vision_mission?.scope_items || [])];
                        const newPoints = [...(newItems[idx].points || []), ''];
                        newItems[idx] = { ...newItems[idx], points: newPoints };
                        updateField('page_about_vision_mission', 'scope_items', newItems);
                      }}>
                        <Plus size={12} /> Add Point
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className={styles.addBtn} onClick={() => addArrayItem('page_about_vision_mission', 'scope_items', { title: '', icon: '', points: [] })}>
                <Plus size={14} /> Add Scope Item
              </button>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Media Coverage Section</h2>
              <div className={styles.grid}>
                {renderInput('page_about_vision_mission', 'media_label', 'Media Label')}
                {renderInput('page_about_vision_mission', 'media_title', 'Media Title')}
                {renderTextarea('page_about_vision_mission', 'media_quote', 'Media Quote Text', { fullWidth: true })}
                {renderInput('page_about_vision_mission', 'media_tagline', 'Media Tagline', { fullWidth: true })}
              </div>
              
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>Media Intro Paragraphs</h3>
              {(contentState.page_about_vision_mission?.media_intro_paragraphs || []).map((para: string, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <textarea className={styles.textarea} rows={3} style={{ flex: 1 }} value={para} onChange={(e) => updateStringArrayItem('page_about_vision_mission', 'media_intro_paragraphs', idx, e.target.value)} />
                  <button className={styles.removeBtn} onClick={() => removeArrayItem('page_about_vision_mission', 'media_intro_paragraphs', idx)}><Trash2 size={12} /></button>
                </div>
              ))}
              <button className={styles.addBtn} onClick={() => addArrayItem('page_about_vision_mission', 'media_intro_paragraphs', '')}>
                <Plus size={14} /> Add Intro Paragraph
              </button>

              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-6)', marginBottom: 'var(--space-3)' }}>Media Highlights / Cards</h3>
              <div className={styles.grid}>
                {(contentState.page_about_vision_mission?.media_highlights || []).map((hl: any, idx: number) => (
                  <div key={idx} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardIndex}>Highlight #{idx + 1}</span>
                      <button className={styles.removeBtn} onClick={() => removeArrayItem('page_about_vision_mission', 'media_highlights', idx)}><Trash2 size={12} /></button>
                    </div>
                    <div className={styles.formGroup} style={{ marginBottom: '6px' }}>
                      <label className={styles.label}>Icon</label>
                      <input className={styles.input} value={hl.icon || ''} onChange={(e) => updateArrayItem('page_about_vision_mission', 'media_highlights', idx, 'icon', e.target.value)} />
                    </div>
                    <div className={styles.formGroup} style={{ marginBottom: '6px' }}>
                      <label className={styles.label}>Title</label>
                      <input className={styles.input} value={hl.title || ''} onChange={(e) => updateArrayItem('page_about_vision_mission', 'media_highlights', idx, 'title', e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Description</label>
                      <textarea className={styles.textarea} rows={2} value={hl.desc || ''} onChange={(e) => updateArrayItem('page_about_vision_mission', 'media_highlights', idx, 'desc', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
              <button className={styles.addBtn} onClick={() => addArrayItem('page_about_vision_mission', 'media_highlights', { title: '', icon: '', desc: '' })}>
                <Plus size={14} /> Add Highlight Card
              </button>

              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-6)', marginBottom: 'var(--space-3)' }}>Media Closing Paragraphs</h3>
              {(contentState.page_about_vision_mission?.media_closing_paragraphs || []).map((para: string, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <textarea className={styles.textarea} rows={3} style={{ flex: 1 }} value={para} onChange={(e) => updateStringArrayItem('page_about_vision_mission', 'media_closing_paragraphs', idx, e.target.value)} />
                  <button className={styles.removeBtn} onClick={() => removeArrayItem('page_about_vision_mission', 'media_closing_paragraphs', idx)}><Trash2 size={12} /></button>
                </div>
              ))}
              <button className={styles.addBtn} onClick={() => addArrayItem('page_about_vision_mission', 'media_closing_paragraphs', '')}>
                <Plus size={14} /> Add Closing Paragraph
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // ─── ACADEMICS TAB ───
  const renderAcademicsTab = () => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Academics Page — Hero Section</h2>
      <div className={styles.grid}>
        {renderInput('page_academics', 'hero_title', 'Hero Title')}
        {renderTextarea('page_academics', 'hero_subtitle', 'Hero Subtitle', { fullWidth: true })}
      </div>
    </div>
  );

  // ─── ADMISSIONS TAB ───
  const renderAdmissionsTab = () => (
    <>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Admissions Page</h2>
        <div className={styles.grid}>
          {renderInput('page_admissions', 'hero_title', 'Hero Title')}
          {renderTextarea('page_admissions', 'hero_subtitle', 'Hero Subtitle', { fullWidth: true })}
          {renderInput('page_admissions', 'how_to_apply_title', 'How to Apply Title')}
          {renderTextarea('page_admissions', 'how_to_apply_text', 'How to Apply Text', { fullWidth: true })}
          {renderInput('page_admissions', 'portal_title', 'Portal Card Title')}
          {renderTextarea('page_admissions', 'portal_text', 'Portal Card Text', { fullWidth: true })}
        </div>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>Application Steps</h3>
        <div className={styles.grid}>
          {(contentState.page_admissions?.steps || []).map((step: any, idx: number) => (
            <div key={idx} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIndex}>Step {idx + 1}</span>
                <button className={styles.removeBtn} onClick={() => removeArrayItem('page_admissions', 'steps', idx)}><Trash2 size={12} /></button>
              </div>
              <div className={styles.formGroup} style={{ marginBottom: '6px' }}>
                <label className={styles.label}>Title</label>
                <input className={styles.input} value={step.title || ''} onChange={(e) => updateArrayItem('page_admissions', 'steps', idx, 'title', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea className={styles.textarea} rows={2} value={step.desc || ''} onChange={(e) => updateArrayItem('page_admissions', 'steps', idx, 'desc', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
        <button className={styles.addBtn} onClick={() => addArrayItem('page_admissions', 'steps', { title: '', desc: '' })}>
          <Plus size={14} /> Add Step
        </button>
      </div>
    </>
  );

  // ─── CONTACT TAB ───
  const renderContactTab = () => (
    <>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Contact Page</h2>
        <div className={styles.grid}>
          {renderInput('page_contact', 'hero_title', 'Hero Title')}
          {renderTextarea('page_contact', 'hero_subtitle', 'Hero Subtitle', { fullWidth: true })}
          {renderInput('page_contact', 'form_title', 'Form Section Title')}
          {renderTextarea('page_contact', 'form_subtitle', 'Form Section Subtitle', { fullWidth: true })}
          {renderInput('page_contact', 'address_title', 'Address Card Title')}
          {renderTextarea('page_contact', 'address', 'Full Address', { fullWidth: true })}
          {renderInput('page_contact', 'phone_title', 'Phone Card Title')}
          {renderTextarea('page_contact', 'phones', 'Phone Numbers (one per line)', { fullWidth: true })}
          {renderInput('page_contact', 'email_title', 'Email Card Title')}
          {renderTextarea('page_contact', 'emails', 'Email Addresses (one per line)', { fullWidth: true })}
          {renderInput('page_contact', 'hours_title', 'Hours Card Title')}
          {renderTextarea('page_contact', 'hours', 'Office Hours', { fullWidth: true })}
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Facilities Page</h2>
        <div className={styles.grid}>
          {renderInput('page_facilities', 'hero_title', 'Hero Title')}
          {renderTextarea('page_facilities', 'hero_subtitle', 'Hero Subtitle', { fullWidth: true })}
          {renderInput('page_facilities', 'section_title', 'Section Title')}
          {renderTextarea('page_facilities', 'section_text', 'Section Description', { fullWidth: true })}
        </div>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>Facility Items</h3>
        <div className={styles.grid}>
          {(contentState.page_facilities?.facilities || []).map((fac: any, idx: number) => (
            <div key={idx} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIndex}>#{idx + 1}</span>
                <button className={styles.removeBtn} onClick={() => removeArrayItem('page_facilities', 'facilities', idx)}><Trash2 size={12} /></button>
              </div>
              <div className={styles.formGroup} style={{ marginBottom: '6px' }}>
                <label className={styles.label}>Icon</label>
                <input className={styles.input} value={fac.icon || ''} onChange={(e) => updateArrayItem('page_facilities', 'facilities', idx, 'icon', e.target.value)} />
              </div>
              <div className={styles.formGroup} style={{ marginBottom: '6px' }}>
                <label className={styles.label}>Title</label>
                <input className={styles.input} value={fac.title || ''} onChange={(e) => updateArrayItem('page_facilities', 'facilities', idx, 'title', e.target.value)} />
              </div>
              <div className={styles.formGroup} style={{ marginBottom: '6px' }}>
                <label className={styles.label}>Description</label>
                <textarea className={styles.textarea} rows={2} value={fac.desc || ''} onChange={(e) => updateArrayItem('page_facilities', 'facilities', idx, 'desc', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Link (href)</label>
                <input className={styles.input} value={fac.href || ''} onChange={(e) => updateArrayItem('page_facilities', 'facilities', idx, 'href', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
        <button className={styles.addBtn} onClick={() => addArrayItem('page_facilities', 'facilities', { icon: '', title: '', desc: '', href: '' })}>
          <Plus size={14} /> Add Facility
        </button>
      </div>
    </>
  );

  // ─── NAVIGATION TAB ───
  const renderNavigationTab = () => (
    <>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Navigation Menu</h2>
        <p className={styles.sectionSubtitle}>Edit the main navigation bar items. Changes apply to both desktop navbar and mobile menu.</p>
        {(contentState.site_navbar?.items || []).map((item: any, idx: number) => (
          <div key={idx} className={styles.card} style={{ marginBottom: '12px' }}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIndex}>Nav Item #{idx + 1}</span>
              <button className={styles.removeBtn} onClick={() => removeArrayItem('site_navbar', 'items', idx)}><Trash2 size={12} /> Remove</button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label className={styles.label}>Label</label>
                <input className={styles.input} value={item.label || ''} onChange={(e) => updateArrayItem('site_navbar', 'items', idx, 'label', e.target.value)} />
              </div>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label className={styles.label}>URL</label>
                <input className={styles.input} value={item.href || ''} onChange={(e) => updateArrayItem('site_navbar', 'items', idx, 'href', e.target.value)} />
              </div>
            </div>
            {item.submenu && (
              <div style={{ paddingLeft: '16px', borderLeft: '2px solid #E2E8F0' }}>
                <label className={styles.label} style={{ marginBottom: '6px', display: 'block' }}>Submenu Items</label>
                {item.submenu.map((sub: any, sIdx: number) => (
                  <div key={sIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <input className={styles.input} style={{ flex: 1 }} placeholder="Label" value={sub.label || ''} onChange={(e) => {
                      const newItems = [...(contentState.site_navbar?.items || [])];
                      const newSub = [...newItems[idx].submenu];
                      newSub[sIdx] = { ...newSub[sIdx], label: e.target.value };
                      newItems[idx] = { ...newItems[idx], submenu: newSub };
                      updateField('site_navbar', 'items', newItems);
                    }} />
                    <input className={styles.input} style={{ flex: 1 }} placeholder="URL" value={sub.href || ''} onChange={(e) => {
                      const newItems = [...(contentState.site_navbar?.items || [])];
                      const newSub = [...newItems[idx].submenu];
                      newSub[sIdx] = { ...newSub[sIdx], href: e.target.value };
                      newItems[idx] = { ...newItems[idx], submenu: newSub };
                      updateField('site_navbar', 'items', newItems);
                    }} />
                    <button className={styles.removeBtn} onClick={() => {
                      const newItems = [...(contentState.site_navbar?.items || [])];
                      const newSub = [...newItems[idx].submenu];
                      newSub.splice(sIdx, 1);
                      newItems[idx] = { ...newItems[idx], submenu: newSub };
                      updateField('site_navbar', 'items', newItems);
                    }}><Trash2 size={10} /></button>
                  </div>
                ))}
                <button className={styles.addBtn} style={{ marginTop: '4px' }} onClick={() => {
                  const newItems = [...(contentState.site_navbar?.items || [])];
                  const newSub = [...(newItems[idx].submenu || []), { label: '', href: '' }];
                  newItems[idx] = { ...newItems[idx], submenu: newSub };
                  updateField('site_navbar', 'items', newItems);
                }}>
                  <Plus size={12} /> Add Sub-item
                </button>
              </div>
            )}
          </div>
        ))}
        <button className={styles.addBtn} onClick={() => addArrayItem('site_navbar', 'items', { label: '', href: '/' })}>
          <Plus size={14} /> Add Nav Item
        </button>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Footer Content</h2>
        <div className={styles.grid}>
          {renderTextarea('site_footer', 'brand_description', 'Brand Description', { fullWidth: true })}
          {renderInput('site_footer', 'address', 'Address', { fullWidth: true })}
          {renderInput('site_footer', 'phones', 'Phone Numbers')}
          {renderInput('site_footer', 'email', 'Email Address')}
        </div>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>Social Media Links</h3>
        {(contentState.site_footer?.social_links || []).map((link: any, idx: number) => (
          <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
            <input className={styles.input} style={{ width: '120px' }} placeholder="Platform" value={link.platform || ''} onChange={(e) => updateArrayItem('site_footer', 'social_links', idx, 'platform', e.target.value)} />
            <input className={styles.input} style={{ flex: 1 }} placeholder="URL" value={link.url || ''} onChange={(e) => updateArrayItem('site_footer', 'social_links', idx, 'url', e.target.value)} />
            <button className={styles.removeBtn} onClick={() => removeArrayItem('site_footer', 'social_links', idx)}><Trash2 size={12} /></button>
          </div>
        ))}
        <button className={styles.addBtn} onClick={() => addArrayItem('site_footer', 'social_links', { platform: '', url: '' })}>
          <Plus size={14} /> Add Social Link
        </button>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>TopBar Content</h2>
        <div className={styles.grid}>
          {renderInput('site_topbar', 'phone', 'Display Phone')}
          {renderInput('site_topbar', 'phone_href', 'Phone Link (tel:...)')}
          {renderInput('site_topbar', 'email', 'Display Email')}
          {renderInput('site_topbar', 'email_href', 'Email Link (mailto:...)')}
        </div>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#334155', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>Social Media Links</h3>
        {(contentState.site_topbar?.social_links || []).map((link: any, idx: number) => (
          <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
            <input className={styles.input} style={{ width: '120px' }} placeholder="Platform" value={link.platform || ''} onChange={(e) => updateArrayItem('site_topbar', 'social_links', idx, 'platform', e.target.value)} />
            <input className={styles.input} style={{ flex: 1 }} placeholder="URL" value={link.url || ''} onChange={(e) => updateArrayItem('site_topbar', 'social_links', idx, 'url', e.target.value)} />
            <button className={styles.removeBtn} onClick={() => removeArrayItem('site_topbar', 'social_links', idx)}><Trash2 size={12} /></button>
          </div>
        ))}
        <button className={styles.addBtn} onClick={() => addArrayItem('site_topbar', 'social_links', { platform: '', url: '' })}>
          <Plus size={14} /> Add Social Link
        </button>
      </div>
    </>
  );

  // ─── PLACEMENTS TAB ───
  const renderPlacementsTab = () => (
    <>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Placements Page — Placed Students Ledger</h2>
        <p className={styles.sectionSubtitle}>
          Add, edit, or remove the individual student placement rows displayed in the table on /placements page.
        </p>

        <div style={{ marginTop: 'var(--space-6)' }}>
          {(contentState.page_placements_students?.students || []).map((record: any, idx: number) => (
            <div key={idx} className={styles.card} style={{ marginBottom: 'var(--space-4)' }}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIndex}>Student #{idx + 1}</span>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeArrayItem('page_placements_students', 'students', idx)}
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>

              <div className={styles.grid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Student Name *</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={record.name || ''}
                    onChange={(e) => updateArrayItem('page_placements_students', 'students', idx, 'name', e.target.value)}
                    placeholder="e.g. Simranpreet Kaur"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Batch *</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={record.batch || ''}
                    onChange={(e) => updateArrayItem('page_placements_students', 'students', idx, 'batch', e.target.value)}
                    placeholder="e.g. MBA (2023–2025)"
                  />
                </div>

                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                  <label className={styles.label}>Company / Recruiter *</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={record.company || ''}
                    onChange={(e) => updateArrayItem('page_placements_students', 'students', idx, 'company', e.target.value)}
                    placeholder="e.g. Oracle India Pvt. Ltd."
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className={styles.addBtn}
            onClick={() => addArrayItem('page_placements_students', 'students', { name: '', batch: '', company: '' })}
            style={{ marginTop: 'var(--space-2)' }}
          >
            <Plus size={14} /> Add Student Placement Record
          </button>
        </div>
      </div>
    </>
  );

  // ─── Render active tab content ───
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home': return renderHomeTab();
      case 'about': return renderAboutTab();
      case 'academics': return renderAcademicsTab();
      case 'admissions': return renderAdmissionsTab();
      case 'contact': return renderContactTab();
      case 'navigation': return renderNavigationTab();
      case 'placements': return renderPlacementsTab();
      default: return null;
    }
  };

  // Auth block
  if (role !== 'admin') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-12) 0', color: 'var(--color-error)' }}>
        <ShieldAlert size={48} style={{ marginBottom: 'var(--space-4)' }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold' }}>Access Denied</h2>
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
          You do not have administrative permissions to edit page content.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: '#1E293B', marginBottom: 'var(--space-2)' }}>
        Page Content Editor
      </h1>
      <p style={{ color: '#64748B', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
        Edit all static text, images, and content across every page of the website. Changes are reflected on the public site immediately after saving.
      </p>

      {isLoading ? (
        <div style={{ color: 'var(--color-gold)', padding: 'var(--space-8)' }}>Loading page content...</div>
      ) : (
        <>
          {/* Main Tabs */}
          <div className={styles.tabs}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={clsx(styles.tab, activeTab === tab.key && styles.tabActive)}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* About sub-tabs */}
          {activeTab === 'about' && (
            <div className={styles.subtab}>
              {ABOUT_SUBTABS.map((st) => (
                <button
                  key={st.key}
                  className={clsx(styles.subtabBtn, aboutSubTab === st.key && styles.subtabActive)}
                  onClick={() => setAboutSubTab(st.key)}
                >
                  {st.label}
                </button>
              ))}
            </div>
          )}

          {renderTabContent()}

          {/* Global Save */}
          <div className={styles.actions}>
            <Button type="button" variant="primary" size="md" disabled={saving} onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
