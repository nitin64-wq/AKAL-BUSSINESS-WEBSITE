/* ============================================================
   ABS — Public SEO Fetch Utilities
   Server-side fetch helpers for public pages.
   ============================================================ */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchGlobalSeoSettings() {
  try {
    const res = await fetch(`${API_BASE}/seo/settings`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    const data = await res.json();
    return data.success ? data.data : {};
  } catch (error) {
    console.error('Error fetching global SEO settings:', error);
    return {};
  }
}

export async function fetchPageSeo(identifier: string) {
  try {
    const res = await fetch(`${API_BASE}/seo/pages/${encodeURIComponent(identifier)}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    const data = await res.json();
    return data.success ? data : null;
  } catch (error) {
    console.error(`Error fetching page SEO for ${identifier}:`, error);
    return null;
  }
}

export async function fetchContentSeo(type: string, id: number | string) {
  try {
    const res = await fetch(`${API_BASE}/seo/content/${type}/${id}`, {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    return data.success ? data : null;
  } catch (error) {
    console.error(`Error fetching content SEO for ${type} #${id}:`, error);
    return null;
  }
}

export async function fetchGlobalSchemas() {
  try {
    const res = await fetch(`${API_BASE}/seo/schemas`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching global schemas:', error);
    return [];
  }
}

export async function fetchRobotsData() {
  try {
    const res = await fetch(`${API_BASE}/seo/robots-data`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching robots data:', error);
    return null;
  }
}

export async function fetchSitemapData() {
  try {
    const res = await fetch(`${API_BASE}/seo/sitemap-data`, {
      next: { revalidate: 600 }, // Cache for 10 minutes
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching sitemap data:', error);
    return [];
  }
}
