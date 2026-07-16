/* ============================================================
   ABS — Metadata Generator
   Translates SEO models/settings into Next.js Metadata objects.
   ============================================================ */

import { Metadata } from 'next';
import { fetchGlobalSeoSettings } from './seoApi';

interface RawSeoData {
  seo_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  canonical_url?: string | null;
  meta_robots?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  og_type?: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image?: string | null;
  twitter_card?: string | null;
}

export async function generateSeoMetadata(
  pageData: any,
  fallbackTitle?: string
): Promise<Metadata> {
  // Retrieve global fallback settings
  const globalSettings = await fetchGlobalSeoSettings();

  let seo: RawSeoData | null = null;
  if (pageData) {
    if (pageData.data) {
      seo = pageData.data;
    } else {
      seo = pageData;
    }
  }

  // Resolve titles
  const title =
    seo?.seo_title ||
    fallbackTitle ||
    globalSettings.website_title ||
    globalSettings.default_meta_title ||
    'Akal Business School';

  // Resolve description
  const description =
    seo?.meta_description ||
    globalSettings.default_meta_description ||
    'Akal Business School offers premium MBA, BBA, and PhD programs.';

  // Resolve keywords
  const keywords = seo?.meta_keywords || globalSettings.default_keywords || '';

  // Resolve canonical
  const canonical =
    seo?.canonical_url ||
    globalSettings.default_canonical_url ||
    'https://business.auts.ac.in';

  // Resolve robots
  const robotsRaw = seo?.meta_robots || 'index, follow';
  const robots = {
    index: !robotsRaw.includes('noindex'),
    follow: !robotsRaw.includes('nofollow'),
    nocache: robotsRaw.includes('noarchive'),
    googleBot: {
      index: !robotsRaw.includes('noindex'),
      follow: !robotsRaw.includes('nofollow'),
    },
  };

  // Open Graph
  const ogTitle = seo?.og_title || seo?.seo_title || title;
  const ogDesc = seo?.og_description || seo?.meta_description || description;
  const ogImg = seo?.og_image || globalSettings.default_og_image || '';

  // Twitter
  const twTitle = seo?.twitter_title || seo?.seo_title || title;
  const twDesc = seo?.twitter_description || seo?.meta_description || description;
  const twImg = seo?.twitter_image || seo?.og_image || globalSettings.default_og_image || '';
  const twCard = (seo?.twitter_card || globalSettings.twitter_card_type || 'summary_large_image') as
    | 'summary'
    | 'summary_large_image'
    | 'app'
    | 'player';

  // Other verification tags
  const verification: Record<string, string> = {};
  if (globalSettings.google_verification) {
    verification.google = globalSettings.google_verification;
  }
  if (globalSettings.bing_verification) {
    verification.yahoo = globalSettings.bing_verification; // Yahoo/Bing share verification format sometimes
  }

  return {
    title,
    description,
    keywords: keywords.split(',').map((k: string) => k.trim()).filter(Boolean),
    alternates: {
      canonical,
    },
    robots,
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: canonical,
      siteName: globalSettings.website_name || 'Akal Business School',
      locale: globalSettings.og_locale || 'en_US',
      type: (seo?.og_type || 'website') as 'website' | 'article',
      images: ogImg
        ? [
            {
              url: ogImg,
              width: 1200,
              height: 630,
              alt: ogTitle,
            },
          ]
        : [],
    },
    twitter: {
      card: twCard,
      title: twTitle,
      description: twDesc,
      images: twImg ? [twImg] : [],
      creator: globalSettings.twitter_creator || undefined,
      site: globalSettings.twitter_site || undefined,
    },
    verification,
    other: {
      'msvalidate.01': globalSettings.bing_verification || '',
      'yandex-verification': globalSettings.yandex_verification || '',
      'baidu-site-verification': globalSettings.baidu_verification || '',
    },
  };
}
