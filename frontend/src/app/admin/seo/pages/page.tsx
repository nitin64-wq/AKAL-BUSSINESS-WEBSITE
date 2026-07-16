/* ============================================================
   ABS — Page SEO Manager
   CRUD for static page SEO entries with SERP preview.
   ============================================================ */

'use client';

import React, { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { useQueryClient } from '@tanstack/react-query';
import { seoService, PageSeoRecord } from '@/services/seoService';
import styles from '../Seo.module.css';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Save, X, Search, Eye, Globe } from 'lucide-react';

export default function PageSeoPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<PageSeoRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');

  const { data: pages, isLoading } = useFetch<PageSeoRecord[]>('/admin/seo/pages', ['seo_pages']);

  const filteredPages = (pages || []).filter(
    (p) =>
      p.page_identifier.toLowerCase().includes(search.toLowerCase()) ||
      (p.seo_title || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this page SEO entry?')) return;
    try {
      await seoService.deletePage(id);
      toast.success('Page SEO deleted.');
      queryClient.invalidateQueries({ queryKey: ['seo_pages'] });
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Page SEO Manager</h1>
          <p className={styles.pageSubtitle}>Manage SEO metadata for each static page</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
            <input
              className={styles.input}
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 32, width: 220 }}
            />
          </div>
          <button className={styles.btnPrimary} onClick={() => { setCreating(true); setEditing(null); }}>
            <Plus size={15} /> Add Page
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={styles.section} style={{ padding: 0 }}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Page</th>
                <th>SEO Title</th>
                <th>Meta Description</th>
                <th>Robots</th>
                <th>Score</th>
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>Loading...</td></tr>
              ) : filteredPages.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--color-muted)' }}>No page SEO entries found.</td></tr>
              ) : (
                filteredPages.map((page) => (
                  <tr key={page.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Globe size={14} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--color-white)', fontSize: 'var(--text-sm)' }}>
                            {page.page_title || page.page_identifier}
                          </span>
                          <span style={{ display: 'block', fontSize: 10, color: 'var(--color-muted)' }}>
                            /{page.slug || page.page_identifier}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {page.seo_title || <span style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>Not set</span>}
                    </td>
                    <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {page.meta_description ? (
                        <span>{page.meta_description.substring(0, 80)}...</span>
                      ) : (
                        <span className={`${styles.badge} ${styles.badgeAmber}`}>Missing</span>
                      )}
                    </td>
                    <td>
                      <span className={`${styles.badge} ${page.meta_robots?.includes('noindex') ? styles.badgeRed : styles.badgeGreen}`}>
                        {page.meta_robots || 'index, follow'}
                      </span>
                    </td>
                    <td>
                      {page.content_score != null ? (
                        <div className={`${styles.scoreRing} ${page.content_score >= 70 ? styles.scoreGood : page.content_score >= 40 ? styles.scoreMedium : styles.scoreLow}`} style={{ width: 36, height: 36, fontSize: 11, borderWidth: 2 }}>
                          {page.content_score}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--color-muted)', fontSize: 11 }}>—</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className={`${styles.btnSecondary} ${styles.btnSmall}`} onClick={() => { setEditing(page); setCreating(false); }}>
                          <Pencil size={12} />
                        </button>
                        <button className={`${styles.btnDanger} ${styles.btnSmall}`} onClick={() => handleDelete(page.id)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {(editing || creating) && (
        <PageSeoModal
          page={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['seo_pages'] });
            setEditing(null);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

// ── Inline Edit/Create Modal ────────────────────────────────

function PageSeoModal({
  page,
  onClose,
  onSaved,
}: {
  page: PageSeoRecord | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!page;
  const [form, setForm] = useState<Record<string, any>>(
    page || {
      page_identifier: '',
      page_title: '',
      seo_title: '',
      meta_description: '',
      meta_keywords: '',
      slug: '',
      canonical_url: '',
      meta_robots: 'index, follow',
      og_title: '',
      og_description: '',
      og_image: '',
      twitter_title: '',
      twitter_description: '',
      twitter_image: '',
      focus_keyword: '',
      schema_type: '',
      author: '',
      breadcrumb_title: '',
      short_summary: '',
      ai_summary: '',
      quick_answer: '',
      featured_snippet: '',
    }
  );
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('seo');

  const handleChange = (key: string, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await seoService.updatePage(page!.id, form);
        toast.success('Page SEO updated.');
      } else {
        await seoService.createPage(form);
        toast.success('Page SEO created.');
      }
      onSaved();
    } catch {
      toast.error('Failed to save page SEO.');
    } finally {
      setSaving(false);
    }
  };

  const MODAL_TABS = [
    { id: 'seo', label: 'Core SEO' },
    { id: 'og', label: 'Open Graph' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'aeo', label: 'AEO' },
    { id: 'preview', label: 'Preview' },
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 860 }}>
        <div className={styles.modalTitle}>
          {isEdit ? `Edit: ${form.page_title || form.page_identifier}` : 'Create Page SEO'}
          <button className={styles.modalClose} onClick={onClose}><X size={20} /></button>
        </div>

        {/* Inner Tabs */}
        <div className={styles.tabs} style={{ marginBottom: 'var(--space-4)' }}>
          {MODAL_TABS.map((t) => (
            <button key={t.id} type="button" className={tab === t.id ? styles.tabActive : styles.tab} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {tab === 'seo' && (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Page Identifier <span className={styles.labelHint}>unique slug key</span></label>
                <input className={styles.input} value={form.page_identifier || ''} onChange={(e) => handleChange('page_identifier', e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Page Title <span className={styles.labelHint}>human-readable</span></label>
                <input className={styles.input} value={form.page_title || ''} onChange={(e) => handleChange('page_title', e.target.value)} />
              </div>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>SEO Title <span className={styles.labelHint}>50-60 chars recommended</span></label>
                <input className={styles.input} value={form.seo_title || ''} onChange={(e) => handleChange('seo_title', e.target.value)} />
                <span style={{ fontSize: 10, color: (form.seo_title || '').length > 60 ? '#EF4444' : 'var(--color-muted)' }}>
                  {(form.seo_title || '').length}/60 characters
                </span>
              </div>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>Meta Description <span className={styles.labelHint}>150-160 chars</span></label>
                <textarea className={styles.textarea} value={form.meta_description || ''} onChange={(e) => handleChange('meta_description', e.target.value)} rows={3} />
                <span style={{ fontSize: 10, color: (form.meta_description || '').length > 160 ? '#EF4444' : 'var(--color-muted)' }}>
                  {(form.meta_description || '').length}/160 characters
                </span>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Meta Keywords</label>
                <input className={styles.input} value={form.meta_keywords || ''} onChange={(e) => handleChange('meta_keywords', e.target.value)} placeholder="keyword1, keyword2" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Focus Keyword</label>
                <input className={styles.input} value={form.focus_keyword || ''} onChange={(e) => handleChange('focus_keyword', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Slug</label>
                <input className={styles.input} value={form.slug || ''} onChange={(e) => handleChange('slug', e.target.value)} />
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
              <div className={styles.formGroup}>
                <label className={styles.label}>Schema Type</label>
                <select className={styles.select} value={form.schema_type || ''} onChange={(e) => handleChange('schema_type', e.target.value)}>
                  <option value="">None</option>
                  <option value="Organization">Organization</option>
                  <option value="Website">Website</option>
                  <option value="Article">Article</option>
                  <option value="BlogPosting">BlogPosting</option>
                  <option value="FAQ">FAQ</option>
                  <option value="HowTo">HowTo</option>
                  <option value="LocalBusiness">LocalBusiness</option>
                  <option value="Event">Event</option>
                  <option value="Person">Person</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Author</label>
                <input className={styles.input} value={form.author || ''} onChange={(e) => handleChange('author', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Breadcrumb Title</label>
                <input className={styles.input} value={form.breadcrumb_title || ''} onChange={(e) => handleChange('breadcrumb_title', e.target.value)} />
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
                <label className={styles.label}>OG Type</label>
                <select className={styles.select} value={form.og_type || 'website'} onChange={(e) => handleChange('og_type', e.target.value)}>
                  <option value="website">website</option>
                  <option value="article">article</option>
                  <option value="profile">profile</option>
                </select>
              </div>
            </div>
          )}

          {tab === 'twitter' && (
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
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
              <div className={styles.formGroup}>
                <label className={styles.label}>Twitter Card</label>
                <select className={styles.select} value={form.twitter_card || 'summary_large_image'} onChange={(e) => handleChange('twitter_card', e.target.value)}>
                  <option value="summary_large_image">summary_large_image</option>
                  <option value="summary">summary</option>
                </select>
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
                <label className={styles.label}>AI Summary <span className={styles.labelHint}>for AI search engines</span></label>
                <textarea className={styles.textarea} value={form.ai_summary || ''} onChange={(e) => handleChange('ai_summary', e.target.value)} rows={3} />
              </div>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>Quick Answer <span className={styles.labelHint}>direct answer block</span></label>
                <textarea className={styles.textarea} value={form.quick_answer || ''} onChange={(e) => handleChange('quick_answer', e.target.value)} rows={2} />
              </div>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.label}>Featured Snippet <span className={styles.labelHint}>optimized for position zero</span></label>
                <textarea className={styles.textarea} value={form.featured_snippet || ''} onChange={(e) => handleChange('featured_snippet', e.target.value)} rows={3} />
              </div>
            </div>
          )}

          {tab === 'preview' && (
            <div>
              <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', marginBottom: 'var(--space-3)', fontWeight: 600 }}>
                <Eye size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} />
                Google SERP Preview
              </h3>
              <div className={styles.serpPreview}>
                <div className={styles.serpUrl}>
                  <div className={styles.serpUrlIcon}>
                    <Globe size={14} style={{ color: '#5F6368' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#202124' }}>business.auts.ac.in</div>
                    <div style={{ fontSize: 12, color: '#4D5156' }}>
                      https://business.auts.ac.in/{form.slug || form.page_identifier || ''}
                    </div>
                  </div>
                </div>
                <div className={styles.serpTitle}>
                  {form.seo_title || form.page_title || 'Page Title'}
                </div>
                <div className={styles.serpDesc}>
                  {form.meta_description || 'Add a meta description to see how this page will appear in search results.'}
                </div>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnPrimary} disabled={saving}>
              <Save size={15} /> {saving ? 'Saving...' : isEdit ? 'Update Page SEO' : 'Create Page SEO'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
