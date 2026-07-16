import { MetadataRoute } from 'next';
import { fetchSitemapData } from '@/lib/seoApi';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicEntries = await fetchSitemapData();

  if (Array.isArray(dynamicEntries) && dynamicEntries.length > 0) {
    return dynamicEntries.map((entry: any) => ({
      url: entry.url,
      lastModified: entry.lastModified ? new Date(entry.lastModified) : new Date(),
      changeFrequency: entry.changeFrequency as any,
      priority: entry.priority,
    }));
  }

  // Fallback original sitemap implementation
  const baseUrl = 'https://business.auts.ac.in';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  const staticRoutes = [
    '',
    '/about',
    '/about/founders',
    '/about/chancellors-message',
    '/about/directors-message',
    '/about/vision-mission',
    '/academics',
    '/academics/mba',
    '/academics/bba',
    '/admissions',
    '/admissions/apply',
    '/admissions/fees',
    '/admissions/scholarships',
    '/faculty',
    '/placements',
    '/campus-life',
    '/research',
    '/news',
    '/contact',
    '/alumni',
    '/media',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Fetch programs
  try {
    const res = await fetch(`${apiUrl}/programs`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      const programs = json.data ?? json;
      if (Array.isArray(programs)) {
        programs.forEach((p: any) => {
          sitemapEntries.push({
            url: `${baseUrl}/academics/${p.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });
      }
    }
  } catch (e) {
    console.warn('Failed to fetch programs for sitemap', e);
  }

  // Fetch faculty
  try {
    const res = await fetch(`${apiUrl}/faculty`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      const faculty = json.data ?? json;
      if (Array.isArray(faculty)) {
        faculty.forEach((f: any) => {
          sitemapEntries.push({
            url: `${baseUrl}/faculty/${f.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
          });
        });
      }
    }
  } catch (e) {
    console.warn('Failed to fetch faculty for sitemap', e);
  }

  // Fetch news
  try {
    const res = await fetch(`${apiUrl}/news`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      const news = json.data ?? json;
      if (Array.isArray(news)) {
        news.forEach((n: any) => {
          sitemapEntries.push({
            url: `${baseUrl}/news/${n.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
          });
        });
      }
    }
  } catch (e) {
    console.warn('Failed to fetch news for sitemap', e);
  }

  return sitemapEntries;
}
