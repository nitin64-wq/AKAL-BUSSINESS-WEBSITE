/* ============================================================
   ABS — FAQ Builder (AEO - Answer Engine Optimization)
   Manage FAQs with FAQ Schema auto-generation.
   ============================================================ */

'use client';

import React, { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { useQueryClient } from '@tanstack/react-query';
import { seoService, FaqRecord } from '@/services/seoService';
import styles from '../Seo.module.css';
import toast from 'react-hot-toast';
import { HelpCircle, Plus, Pencil, Trash2, Save, X, ChevronDown, ChevronUp, Copy, Code2, GripVertical } from 'lucide-react';

export default function FaqsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<FaqRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterPage, setFilterPage] = useState('');

  const { data: rawData, isLoading } = useFetch<any>('/admin/seo/faqs', ['seo_faqs']);
  const { data: pagesData } = useFetch<any>('/admin/seo/pages', ['seo_pages']);

  const faqs: FaqRecord[] = rawData?.data || rawData || [];
  const pages = pagesData || [];

  const filteredFaqs = filterPage
    ? faqs.filter((f) => String(f.page_seo_id) === filterPage)
    : faqs;

  // Generate FAQ Schema preview
  const faqSchema = filteredFaqs.filter((f) => f.is_active).length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: filteredFaqs.filter((f) => f.is_active).map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer.replace(/<[^>]*>/g, '') },
        })),
      }
    : null;

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this FAQ?')) return;
    try {
      await seoService.deleteFaq(id);
      toast.success('FAQ deleted.');
      queryClient.invalidateQueries({ queryKey: ['seo_faqs'] });
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>FAQ Builder (AEO)</h1>
          <p className={styles.pageSubtitle}>Answer Engine Optimization — FAQ Schema auto-generation</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <select className={styles.select} value={filterPage} onChange={(e) => setFilterPage(e.target.value)} style={{ width: 200 }}>
            <option value="">All FAQs</option>
            {Array.isArray(pages) && pages.map((p: any) => (
              <option key={p.id} value={p.id}>{p.page_title || p.page_identifier}</option>
            ))}
          </select>
          <button className={styles.btnPrimary} onClick={() => { setCreating(true); setEditing(null); }}>
            <Plus size={15} /> Add FAQ
          </button>
        </div>
      </div>

      {/* FAQ List */}
      <div className={styles.section}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-muted)' }}>Loading FAQs...</div>
        ) : filteredFaqs.length === 0 ? (
          <div className={styles.emptyState}>
            <HelpCircle size={40} className={styles.emptyIcon} />
            <p className={styles.emptyText}>No FAQs created yet. Add FAQs for Answer Engine Optimization.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {filteredFaqs.map((faq, idx) => (
              <div key={faq.id} style={{
                background: 'var(--color-navy)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
              }}>
                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: '12px 16px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                >
                  <GripVertical size={14} style={{ color: 'var(--color-muted)', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-muted)', width: 24 }}>
                    #{idx + 1}
                  </span>
                  <span style={{ flex: 1, fontWeight: 600, color: 'var(--color-white)', fontSize: 'var(--text-sm)' }}>
                    {faq.question}
                  </span>
                  <span className={`${styles.badge} ${faq.is_active ? styles.badgeGreen : styles.badgeRed}`} style={{ flexShrink: 0 }}>
                    {faq.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button className={`${styles.btnSecondary} ${styles.btnSmall}`} onClick={(e) => { e.stopPropagation(); setEditing(faq); setCreating(false); }}>
                      <Pencil size={11} />
                    </button>
                    <button className={`${styles.btnDanger} ${styles.btnSmall}`} onClick={(e) => { e.stopPropagation(); handleDelete(faq.id); }}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                  {expandedId === faq.id ? <ChevronUp size={16} style={{ color: 'var(--color-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--color-muted)' }} />}
                </div>

                {/* Expanded Answer */}
                {expandedId === faq.id && (
                  <div style={{
                    padding: '0 16px 16px 56px',
                    borderTop: '1px solid var(--color-border)',
                  }}>
                    <div style={{ paddingTop: 12, fontSize: 'var(--text-sm)', color: 'var(--color-off-white)', lineHeight: 1.7 }}
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                    {faq.short_summary && (
                      <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(201,162,39,0.05)', borderRadius: 6, fontSize: 12, color: 'var(--color-gold-light)' }}>
                        <strong>Short Summary:</strong> {faq.short_summary}
                      </div>
                    )}
                    {faq.ai_summary && (
                      <div style={{ marginTop: 4, padding: '8px 12px', background: 'rgba(59,130,246,0.05)', borderRadius: 6, fontSize: 12, color: '#93C5FD' }}>
                        <strong>AI Summary:</strong> {faq.ai_summary}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQ Schema Preview */}
      {faqSchema && (
        <div className={styles.section}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}><Code2 size={16} /> Auto-Generated FAQ Schema</h2>
            <button className={`${styles.btnSecondary} ${styles.btnSmall}`} onClick={() => { navigator.clipboard.writeText(JSON.stringify(faqSchema, null, 2)); toast.success('FAQ Schema copied!'); }}>
              <Copy size={12} /> Copy
            </button>
          </div>
          <pre className={styles.jsonEditor} style={{ minHeight: 100, cursor: 'default' }}>
            {JSON.stringify(faqSchema, null, 2)}
          </pre>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(editing || creating) && (
        <FaqModal
          faq={editing}
          pages={pages}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['seo_faqs'] });
            setEditing(null);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function FaqModal({ faq, pages, onClose, onSaved }: { faq: FaqRecord | null; pages: any[]; onClose: () => void; onSaved: () => void; }) {
  const isEdit = !!faq;
  const [form, setForm] = useState({
    question: faq?.question || '',
    answer: faq?.answer || '',
    short_summary: faq?.short_summary || '',
    ai_summary: faq?.ai_summary || '',
    page_seo_id: faq?.page_seo_id || '',
    is_active: faq?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, page_seo_id: form.page_seo_id || null };
      if (isEdit) {
        await seoService.updateFaq(faq!.id, data as any);
        toast.success('FAQ updated.');
      } else {
        await seoService.createFaq(data as any);
        toast.success('FAQ created.');
      }
      onSaved();
    } catch {
      toast.error('Failed to save FAQ.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalTitle}>
          {isEdit ? 'Edit FAQ' : 'Create FAQ'}
          <button className={styles.modalClose} onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.formGridFull}`}>
              <label className={styles.label}>Question</label>
              <input className={styles.input} value={form.question} onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))} required />
            </div>
            <div className={`${styles.formGroup} ${styles.formGridFull}`}>
              <label className={styles.label}>Answer <span className={styles.labelHint}>HTML supported</span></label>
              <textarea className={styles.textarea} value={form.answer} onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))} rows={5} required />
            </div>
            <div className={`${styles.formGroup} ${styles.formGridFull}`}>
              <label className={styles.label}>Short Summary <span className={styles.labelHint}>for featured snippets</span></label>
              <textarea className={styles.textarea} value={form.short_summary} onChange={(e) => setForm((p) => ({ ...p, short_summary: e.target.value }))} rows={2} />
            </div>
            <div className={`${styles.formGroup} ${styles.formGridFull}`}>
              <label className={styles.label}>AI Summary <span className={styles.labelHint}>for AI engines</span></label>
              <textarea className={styles.textarea} value={form.ai_summary} onChange={(e) => setForm((p) => ({ ...p, ai_summary: e.target.value }))} rows={2} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Assign to Page</label>
              <select className={styles.select} value={form.page_seo_id || ''} onChange={(e) => setForm((p) => ({ ...p, page_seo_id: e.target.value }))}>
                <option value="">No page (global)</option>
                {Array.isArray(pages) && pages.map((pg: any) => (
                  <option key={pg.id} value={pg.id}>{pg.page_title || pg.page_identifier}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Status</label>
              <select className={styles.select} value={form.is_active ? 'active' : 'inactive'} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.value === 'active' }))}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnPrimary} disabled={saving}>
              <Save size={15} /> {saving ? 'Saving...' : isEdit ? 'Update FAQ' : 'Create FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
