/* ============================================================
   ABS — SEO Service
   API requests for SEO/AEO/GEO module.
   ============================================================ */

import api from '@/lib/api';

// ── Types ───────────────────────────────────────────────────

export interface SeoSettingRecord {
  id: number;
  key: string;
  value: string;
  type: string;
  group: string;
  label: string | null;
  description: string | null;
  sort_order: number;
}

export interface PageSeoRecord {
  id: number;
  page_identifier: string;
  page_title: string | null;
  seo_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  slug: string | null;
  canonical_url: string | null;
  meta_robots: string;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_type: string;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  twitter_card: string;
  focus_keyword: string | null;
  schema_type: string | null;
  custom_schema_json: Record<string, unknown> | null;
  publish_date: string | null;
  updated_date: string | null;
  author: string | null;
  breadcrumb_title: string | null;
  short_summary: string | null;
  ai_summary: string | null;
  quick_answer: string | null;
  featured_snippet: string | null;
  content_score: number | null;
  eeat_score: number | null;
  ai_readability_score: number | null;
  is_active: boolean;
}

export interface FaqRecord {
  id: number;
  page_seo_id: number | null;
  faqable_type: string | null;
  faqable_id: number | null;
  question: string;
  answer: string;
  short_summary: string | null;
  ai_summary: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface SchemaRecord {
  id: number;
  name: string;
  schema_type: string;
  json_data: Record<string, unknown>;
  page_seo_id: number | null;
  metable_type: string | null;
  metable_id: number | null;
  is_global: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface ContentTypeInfo {
  key: string;
  label: string;
  model: string;
}

export interface ContentItemSeo {
  id: number;
  title: string;
  identifier: string | null;
  has_seo: boolean;
  seo_title: string | null;
  faq_count: number;
}

export interface GeoMetaRecord {
  id?: number;
  page_seo_id?: number | null;
  metable_type?: string | null;
  metable_id?: number | null;
  author_bio: string | null;
  references: string[] | null;
  sources: Array<{ name: string; url: string }> | null;
  publication_date: string | null;
  last_updated: string | null;
  reading_time: number | null;
  entity_keywords: string[] | null;
  structured_headings: Array<{ level: string; text: string }> | null;
  content_score: number | null;
  ai_readability_score: number | null;
  generative_search_score: number | null;
  eeat_score: number | null;
  internal_linking_suggestions: Array<{ text: string; url: string }> | null;
}

// ── API Methods ─────────────────────────────────────────────

export const seoService = {
  // ── Global SEO Settings ─────────────────────────────────
  getSettings: async () => {
    const res = await api.get('/admin/seo/settings');
    return res.data;
  },

  updateSettings: async (data: FormData) => {
    const res = await api.post('/admin/seo/settings', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // ── Page SEO ────────────────────────────────────────────
  getPages: async (search?: string) => {
    const params = search ? { search } : {};
    const res = await api.get('/admin/seo/pages', { params });
    return res.data;
  },

  createPage: async (data: Partial<PageSeoRecord>) => {
    const res = await api.post('/admin/seo/pages', data);
    return res.data;
  },

  updatePage: async (id: number, data: Partial<PageSeoRecord>) => {
    const res = await api.put(`/admin/seo/pages/${id}`, data);
    return res.data;
  },

  deletePage: async (id: number) => {
    const res = await api.delete(`/admin/seo/pages/${id}`);
    return res.data;
  },

  // ── Content SEO (Polymorphic) ───────────────────────────
  getContentTypes: async (): Promise<{ data: ContentTypeInfo[] }> => {
    const res = await api.get('/admin/seo/content-types');
    return res.data;
  },

  getContentItems: async (type: string): Promise<{ data: ContentItemSeo[] }> => {
    const res = await api.get(`/admin/seo/content/${type}`);
    return res.data;
  },

  getContentSeo: async (type: string, id: number) => {
    const res = await api.get(`/admin/seo/content/${type}/${id}`);
    return res.data;
  },

  updateContentSeo: async (type: string, id: number, data: Record<string, unknown>) => {
    const res = await api.put(`/admin/seo/content/${type}/${id}`, data);
    return res.data;
  },

  // ── Schemas ─────────────────────────────────────────────
  getSchemas: async (params?: Record<string, string>) => {
    const res = await api.get('/admin/seo/schemas', { params });
    return res.data;
  },

  createSchema: async (data: Partial<SchemaRecord>) => {
    const res = await api.post('/admin/seo/schemas', data);
    return res.data;
  },

  updateSchema: async (id: number, data: Partial<SchemaRecord>) => {
    const res = await api.put(`/admin/seo/schemas/${id}`, data);
    return res.data;
  },

  deleteSchema: async (id: number) => {
    const res = await api.delete(`/admin/seo/schemas/${id}`);
    return res.data;
  },

  // ── FAQs (AEO) ─────────────────────────────────────────
  getFaqs: async (params?: Record<string, string | number>) => {
    const res = await api.get('/admin/seo/faqs', { params });
    return res.data;
  },

  createFaq: async (data: Partial<FaqRecord>) => {
    const res = await api.post('/admin/seo/faqs', data);
    return res.data;
  },

  updateFaq: async (id: number, data: Partial<FaqRecord>) => {
    const res = await api.put(`/admin/seo/faqs/${id}`, data);
    return res.data;
  },

  deleteFaq: async (id: number) => {
    const res = await api.delete(`/admin/seo/faqs/${id}`);
    return res.data;
  },

  reorderFaqs: async (order: Array<{ id: number; sort_order: number }>) => {
    const res = await api.post('/admin/seo/faqs/reorder', { order });
    return res.data;
  },

  // ── GEO Meta ────────────────────────────────────────────
  updateGeoForPage: async (pageSeoId: number, data: Partial<GeoMetaRecord>) => {
    const res = await api.put(`/admin/seo/geo/page/${pageSeoId}`, data);
    return res.data;
  },

  updateGeoForContent: async (type: string, id: number, data: Partial<GeoMetaRecord>) => {
    const res = await api.put(`/admin/seo/geo/${type}/${id}`, data);
    return res.data;
  },

  // ── Robots ──────────────────────────────────────────────
  updateRobots: async (data: Record<string, string>) => {
    const res = await api.put('/admin/seo/robots', data);
    return res.data;
  },
};
