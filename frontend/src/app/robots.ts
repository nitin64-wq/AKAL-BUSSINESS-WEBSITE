import { MetadataRoute } from 'next';
import { fetchRobotsData } from '@/lib/seoApi';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const data = await fetchRobotsData();

  if (data && data.rules && data.rules[0]) {
    const mainRule = data.rules[0];
    return {
      rules: {
        userAgent: mainRule.userAgent || '*',
        allow: mainRule.allow || '/',
        disallow: mainRule.disallow || '/admin/',
      },
      sitemap: data.sitemap || 'https://business.auts.ac.in/sitemap.xml',
    };
  }

  // Fallback to defaults
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://business.auts.ac.in/sitemap.xml',
  };
}
