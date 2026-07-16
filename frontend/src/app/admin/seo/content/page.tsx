/* ============================================================
   ABS — Content SEO Manager
   Manage SEO/AEO/GEO for all content types (News, Programs, etc.)
   ============================================================ */

'use client';

import React, { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { useQueryClient } from '@tanstack/react-query';
import { seoService, ContentTypeInfo, ContentItemSeo } from '@/services/seoService';
import styles from '../Seo.module.css';
import toast from 'react-hot-toast';
import { Layers, Pencil, Save, X, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

export default function ContentSeoPage() {
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<string>('');
  const [editingItem, setEditingItem] = useState<{ type: string; id: number; title: string } | null>(null);

  const { data: typesData } = useFetch<any>('/admin/seo/content-types', ['seo_content_types']);
  const contentTypes: ContentTypeInfo[] = typesData?.data || typesData || [];

  const { data: itemsData, isLoading: itemsLoading } = useFetch<any>(
    selectedType ? `/admin/seo/content/${selectedType}` : '',
    ['seo_content_items', selectedType],
    { enabled: !!selectedType }
  );

  const items: ContentItemSeo[] = itemsData?.data || itemsData || [];

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Content SEO Manager</h1>
          <p className={styles.pageSubtitle}>Manage SEO, AEO & GEO for all content types</p>
        </div>
      </div>

      {/* Content Type Selector */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}><Layers size={16} /> Select Content Type</h2>
        <div className={styles.tabs}>
          {contentTypes.map((ct) => (
            <button
              key={ct.key}
              type="button"
              className={selectedType === ct.key ? styles.tabActive : styles.tab}
              onClick={() => setSelectedType(ct.key)}
            >
              {ct.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items Table */}
      {selectedType && (
        <div className={styles.section} style={{ padding: 0 }}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>SEO Status</th>
                  <th>SEO Title</th>
                  <th>FAQs</th>
                  <th style={{ width: 80 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {itemsLoading ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>Loading {selectedType}...</td></tr>
                ) : items.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--color-muted)' }}>No items found.</td></tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>#{item.id}</td>
                      <td style={{ fontWeight: 600, color: 'var(--color-white)' }}>
                        {item.title}
                        {item.identifier && (
                          <span style={{ display: 'block', fontSize: 10, color: 'var(--color-muted)' }}>/{item.identifier}</span>
                        )}
                      </td>
                      <td>
                        {item.has_seo ? (
                          <span className={`${styles.badge} ${styles.badgeGreen}`}>
                            <CheckCircle size={10} /> Configured
                          </span>
                        ) : (
                          <span className={`${styles.badge} ${styles.badgeAmber}`}>
                            <AlertCircle size={10} /> Not Set
                          </span>
                        )}
                      </td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.seo_title || <span style={{ color: 'var(--color-muted)' }}>—</span>}
                      </td>
                      <td>
                        {item.faq_count > 0 ? (
                          <span className={`${styles.badge} ${styles.badgeBlue}`}>
                            <HelpCircle size={10} /> {item.faq_count}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--color-muted)', fontSize: 11 }}>0</span>
                        )}
                      </td>
                      <td>
                        <button
                          className={`${styles.btnSecondary} ${styles.btnSmall}`}
                          onClick={() => setEditingItem({ type: selectedType, id: item.id, title: item.title })}
                        >
                          <Pencil size={12} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <ContentSeoModal
          type={editingItem.type}
          id={editingItem.id}
          title={editingItem.title}
          onClose={() => setEditingItem(null)}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['seo_content_items', selectedType] });
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

// ── Content SEO Edit Modal ──────────────────────────────────

function ContentSeoModal({
  type, id, title, onClose, onSaved,
}: {
  type: string; id: number; title: string; onClose: () => void; onSaved: () => void;
}) {
  const [tab, setTab] = useState('seo');
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load existing SEO data
  const { data: seoData } = useFetch<any>(
    `/admin/seo/content/${type}/${id}`,
    ['seo_content_detail', type, String(id)]
  );

  React.useEffect(() => {
    if (seoData && !loaded) {
      const meta = seoData.seo_meta || {};
      const geo = seoData.geo_meta || {};
      setForm({ ...meta, ...geo });
      setLoaded(true);
    }
  }, [seoData, loaded]);

  const handleChange = (key: string, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await seoService.updateContentSeo(type, id, {
        metable_type: type,
        metable_id: id,
        ...form,
      });
      toast.success('Content SEO updated.');
      onSaved();
    } catch {
      toast.error('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { id: 'seo', label: 'SEO' },
    { id: 'og', label: 'OG / Twitter' },
    { id: 'aeo', label: 'AEO' },
    { id: 'geo', label: 'GEO' },
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 860 }}>
        <div className={styles.modalTitle}>
          SEO for: {title}
          <button className={styles.modalClose} onClick={onClose}><X size={20} /></button>
        </div>

        <div className={styles.tabs} style={{ marginBottom: 'var(--space-4)' }}>
          {TABS.map((t) => (
            <button key={t.id} type="button" className={tab === t.id ? styles.tabActive : styles.tab} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {tab === 'seo' && (
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>SEO Title</label>
                <input className={styles.input} value={form.seo_title || ''} onChange={(e) => handleChange('seo_title', e.target.value)} />
                <span style={{ fontSize: 10, color: (form.seo_title || '').length > 60 ? '#EF4444' : 'var(--color-muted)' }}>{(form.seo_title || '').length}/60</span>
              </div>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>Meta Description</label>
                <textarea className={styles.textarea} value={form.meta_description || ''} onChange={(e) => handleChange('meta_description', e.target.value)} rows={3} />
                <span style={{ fontSize: 10, color: (form.meta_description || '').length > 160 ? '#EF4444' : 'var(--color-muted)' }}>{(form.meta_description || '').length}/160</span>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Meta Keywords</label>
                <input className={styles.input} value={form.meta_keywords || ''} onChange={(e) => handleChange('meta_keywords', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Focus Keyword</label>
                <input className={styles.input} value={form.focus_keyword || ''} onChange={(e) => handleChange('focus_keyword', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Canonical URL</label>
                <input className={styles.input} value={form.canonical_url || ''} onChange={(e) => handleChange('canonical_url', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Meta Robots</label>
                <select className={styles.select} value={form.meta_robots || 'index, follow'} onChange={(e) => handleChange('meta_robots', e.target.value)}>
                  <option value="index, follow">index, follow</option>
                  <option value="noindex, follow">noindex, follow</option>
                  <option value="index, nofollow">index, nofollow</option>
                  <option value="noindex, nofollow">noindex, nofollow</option>
                </select>
              </div>
            </div>
          )}

          {tab === 'og' && (
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>OG Title</label>
                <input className={styles.input} value={form.og_title || ''} onChange={(e) => handleChange('og_title', e.target.value)} />
              </div>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>OG Description</label>
                <textarea className={styles.textarea} value={form.og_description || ''} onChange={(e) => handleChange('og_description', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>OG Image URL</label>
                <input className={styles.input} value={form.og_image || ''} onChange={(e) => handleChange('og_image', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Twitter Title</label>
                <input className={styles.input} value={form.twitter_title || ''} onChange={(e) => handleChange('twitter_title', e.target.value)} />
              </div>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>Twitter Description</label>
                <textarea className={styles.textarea} value={form.twitter_description || ''} onChange={(e) => handleChange('twitter_description', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Twitter Image URL</label>
                <input className={styles.input} value={form.twitter_image || ''} onChange={(e) => handleChange('twitter_image', e.target.value)} />
              </div>
            </div>
          )}

          {tab === 'aeo' && (
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>Short Summary <span className={styles.labelHint}>for featured snippets</span></label>
                <textarea className={styles.textarea} value={form.short_summary || ''} onChange={(e) => handleChange('short_summary', e.target.value)} rows={2} />
              </div>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>AI Summary <span className={styles.labelHint}>for AI search engines (ChatGPT, Gemini, Perplexity)</span></label>
                <textarea className={styles.textarea} value={form.ai_summary || ''} onChange={(e) => handleChange('ai_summary', e.target.value)} rows={3} />
              </div>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>Quick Answer</label>
                <textarea className={styles.textarea} value={form.quick_answer || ''} onChange={(e) => handleChange('quick_answer', e.target.value)} rows={2} />
              </div>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>Excerpt</label>
                <textarea className={styles.textarea} value={form.excerpt || ''} onChange={(e) => handleChange('excerpt', e.target.value)} rows={2} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Reading Time (min)</label>
                <input type="number" className={styles.input} value={form.reading_time || ''} onChange={(e) => handleChange('reading_time', e.target.value)} />
              </div>
            </div>
          )}

          {tab === 'geo' && (
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>Author Bio</label>
                <textarea className={styles.textarea} value={form.author_bio || ''} onChange={(e) => handleChange('author_bio', e.target.value)} rows={3} />
              </div>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>Entity Keywords <span className={styles.labelHint}>JSON array: ["keyword1","keyword2"]</span></label>
                <textarea className={styles.textarea} value={typeof form.entity_keywords === 'string' ? form.entity_keywords : JSON.stringify(form.entity_keywords || [], null, 2)} onChange={(e) => handleChange('entity_keywords', e.target.value)} rows={2} />
              </div>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>References <span className={styles.labelHint}>JSON array of URLs</span></label>
                <textarea className={styles.textarea} value={typeof form.references === 'string' ? form.references : JSON.stringify(form.references || [], null, 2)} onChange={(e) => handleChange('references', e.target.value)} rows={2} />
              </div>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>Sources <span className={styles.labelHint}>{"JSON array: [{\"name\":\"...\",\"url\":\"...\"}]"}</span></label>
                <textarea className={styles.textarea} value={typeof form.sources === 'string' ? form.sources : JSON.stringify(form.sources || [], null, 2)} onChange={(e) => handleChange('sources', e.target.value)} rows={2} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>E-E-A-T Score (0-100)</label>
                <input type="number" min="0" max="100" className={styles.input} value={form.eeat_score || ''} onChange={(e) => handleChange('eeat_score', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Content Score (0-100)</label>
                <input type="number" min="0" max="100" className={styles.input} value={form.content_score || ''} onChange={(e) => handleChange('content_score', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>AI Readability Score (0-100)</label>
                <input type="number" min="0" max="100" className={styles.input} value={form.ai_readability_score || ''} onChange={(e) => handleChange('ai_readability_score', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Generative Search Score (0-100)</label>
                <input type="number" min="0" max="100" className={styles.input} value={form.generative_search_score || ''} onChange={(e) => handleChange('generative_search_score', e.target.value)} />
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnPrimary} disabled={saving}>
              <Save size={15} /> {saving ? 'Saving...' : 'Save SEO Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
