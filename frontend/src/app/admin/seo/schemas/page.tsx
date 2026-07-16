/* ============================================================
   ABS — Schema Builder
   Visual JSON-LD schema editor supporting all 14 schema types.
   ============================================================ */

'use client';

import React, { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { useQueryClient } from '@tanstack/react-query';
import { seoService, SchemaRecord } from '@/services/seoService';
import styles from '../Seo.module.css';
import toast from 'react-hot-toast';
import { Code2, Plus, Pencil, Trash2, Save, X, Eye, Globe, Copy } from 'lucide-react';

const SCHEMA_TYPES = [
  'Organization', 'Website', 'Article', 'BlogPosting', 'Product', 'FAQ',
  'HowTo', 'Breadcrumb', 'LocalBusiness', 'Person', 'VideoObject',
  'Event', 'SoftwareApplication', 'SearchAction',
];

const SCHEMA_TEMPLATES: Record<string, object> = {
  Organization: { '@context': 'https://schema.org', '@type': 'Organization', name: '', url: '', logo: '', contactPoint: { '@type': 'ContactPoint', telephone: '', contactType: '' } },
  Website: { '@context': 'https://schema.org', '@type': 'WebSite', name: '', url: '' },
  Article: { '@context': 'https://schema.org', '@type': 'Article', headline: '', description: '', image: '', author: { '@type': 'Person', name: '' }, datePublished: '', dateModified: '' },
  BlogPosting: { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: '', description: '', image: '', author: { '@type': 'Person', name: '' }, datePublished: '' },
  FAQ: { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: '', acceptedAnswer: { '@type': 'Answer', text: '' } }] },
  Event: { '@context': 'https://schema.org', '@type': 'Event', name: '', startDate: '', endDate: '', location: { '@type': 'Place', name: '' } },
  Person: { '@context': 'https://schema.org', '@type': 'Person', name: '', jobTitle: '', image: '' },
  LocalBusiness: { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: '', address: { '@type': 'PostalAddress', streetAddress: '' }, telephone: '' },
  Product: { '@context': 'https://schema.org', '@type': 'Product', name: '', description: '', image: '', brand: { '@type': 'Brand', name: '' } },
  HowTo: { '@context': 'https://schema.org', '@type': 'HowTo', name: '', step: [{ '@type': 'HowToStep', text: '' }] },
  Breadcrumb: { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: '', item: '' }] },
  VideoObject: { '@context': 'https://schema.org', '@type': 'VideoObject', name: '', description: '', thumbnailUrl: '', uploadDate: '' },
  SoftwareApplication: { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: '', operatingSystem: '', applicationCategory: '' },
  SearchAction: { '@context': 'https://schema.org', '@type': 'WebSite', url: '', potentialAction: { '@type': 'SearchAction', target: '', 'query-input': 'required name=search_term_string' } },
};

export default function SchemasPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<SchemaRecord | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: rawData, isLoading } = useFetch<any>('/admin/seo/schemas', ['seo_schemas']);
  const schemas: SchemaRecord[] = rawData?.data || rawData || [];

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this schema?')) return;
    try {
      await seoService.deleteSchema(id);
      toast.success('Schema deleted.');
      queryClient.invalidateQueries({ queryKey: ['seo_schemas'] });
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Schema Builder</h1>
          <p className={styles.pageSubtitle}>Manage JSON-LD structured data for Google Rich Results</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => { setCreating(true); setEditing(null); }}>
          <Plus size={15} /> New Schema
        </button>
      </div>

      {/* Schema type legend */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}><Code2 size={16} /> Supported Schema Types</h2>
        <div className={styles.tagList}>
          {SCHEMA_TYPES.map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={styles.section} style={{ padding: 0 }}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Scope</th>
                <th>Status</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>Loading...</td></tr>
              ) : schemas.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--color-muted)' }}>No schemas created yet.</td></tr>
              ) : (
                schemas.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600, color: 'var(--color-white)' }}>{s.name}</td>
                    <td><span className={`${styles.badge} ${styles.badgePurple}`}>{s.schema_type}</span></td>
                    <td>
                      {s.is_global ? (
                        <span className={`${styles.badge} ${styles.badgeGold}`}><Globe size={10} /> Global</span>
                      ) : (
                        <span style={{ color: 'var(--color-muted)', fontSize: 11 }}>Page-specific</span>
                      )}
                    </td>
                    <td>
                      <span className={`${styles.badge} ${s.is_active ? styles.badgeGreen : styles.badgeRed}`}>
                        {s.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className={`${styles.btnSecondary} ${styles.btnSmall}`} onClick={() => { setEditing(s); setCreating(false); }}>
                          <Pencil size={12} />
                        </button>
                        <button className={`${styles.btnSecondary} ${styles.btnSmall}`} onClick={() => { navigator.clipboard.writeText(JSON.stringify(s.json_data, null, 2)); toast.success('JSON-LD copied!'); }}>
                          <Copy size={12} />
                        </button>
                        <button className={`${styles.btnDanger} ${styles.btnSmall}`} onClick={() => handleDelete(s.id)}>
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
        <SchemaModal
          schema={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['seo_schemas'] });
            setEditing(null);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function SchemaModal({ schema, onClose, onSaved }: { schema: SchemaRecord | null; onClose: () => void; onSaved: () => void; }) {
  const isEdit = !!schema;
  const [name, setName] = useState(schema?.name || '');
  const [schemaType, setSchemaType] = useState(schema?.schema_type || 'Organization');
  const [jsonStr, setJsonStr] = useState(
    schema ? JSON.stringify(schema.json_data, null, 2) : JSON.stringify(SCHEMA_TEMPLATES['Organization'], null, 2)
  );
  const [isGlobal, setIsGlobal] = useState(schema?.is_global ?? false);
  const [isActive, setIsActive] = useState(schema?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [jsonError, setJsonError] = useState('');

  const handleTypeChange = (type: string) => {
    setSchemaType(type);
    if (!isEdit) {
      const template = SCHEMA_TEMPLATES[type] || {};
      setJsonStr(JSON.stringify(template, null, 2));
    }
  };

  const validateJson = (str: string): boolean => {
    try {
      JSON.parse(str);
      setJsonError('');
      return true;
    } catch (e) {
      setJsonError('Invalid JSON: ' + (e as Error).message);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateJson(jsonStr)) return;
    setSaving(true);
    try {
      const data = {
        name,
        schema_type: schemaType,
        json_data: JSON.parse(jsonStr),
        is_global: isGlobal,
        is_active: isActive,
      };
      if (isEdit) {
        await seoService.updateSchema(schema!.id, data);
        toast.success('Schema updated.');
      } else {
        await seoService.createSchema(data);
        toast.success('Schema created.');
      }
      onSaved();
    } catch {
      toast.error('Failed to save schema.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 800 }}>
        <div className={styles.modalTitle}>
          {isEdit ? `Edit Schema: ${schema!.name}` : 'Create New Schema'}
          <button className={styles.modalClose} onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Schema Name</label>
              <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. ABS Organization Schema" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Schema Type</label>
              <select className={styles.select} value={schemaType} onChange={(e) => handleTypeChange(e.target.value)}>
                {SCHEMA_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Scope</label>
              <select className={styles.select} value={isGlobal ? 'global' : 'page'} onChange={(e) => setIsGlobal(e.target.value === 'global')}>
                <option value="global">Global (all pages)</option>
                <option value="page">Page-specific</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Status</label>
              <select className={styles.select} value={isActive ? 'active' : 'inactive'} onChange={(e) => setIsActive(e.target.value === 'active')}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className={`${styles.formGroup}`} style={{ marginTop: 'var(--space-4)' }}>
            <label className={styles.label}>
              <Code2 size={13} style={{ marginRight: 4 }} /> JSON-LD Data
              {jsonError && <span style={{ color: '#EF4444', fontWeight: 400, marginLeft: 8 }}>{jsonError}</span>}
            </label>
            <textarea
              className={styles.jsonEditor}
              value={jsonStr}
              onChange={(e) => { setJsonStr(e.target.value); validateJson(e.target.value); }}
              rows={15}
              spellCheck={false}
            />
          </div>

          {/* Live Preview */}
          <div style={{ marginTop: 'var(--space-3)' }}>
            <label className={styles.label} style={{ marginBottom: 4 }}>
              <Eye size={13} style={{ marginRight: 4 }} /> Preview (as rendered in page source)
            </label>
            <pre style={{ background: '#0D1117', color: '#8B949E', padding: 12, borderRadius: 8, fontSize: 11, overflow: 'auto', maxHeight: 120, fontFamily: 'var(--font-mono)' }}>
              {'<script type="application/ld+json">'}{'\n'}
              {jsonStr}{'\n'}
              {'</script>'}
            </pre>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnPrimary} disabled={saving || !!jsonError}>
              <Save size={15} /> {saving ? 'Saving...' : isEdit ? 'Update Schema' : 'Create Schema'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
