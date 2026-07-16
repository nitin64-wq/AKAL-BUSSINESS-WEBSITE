import type { Metadata } from 'next';
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { PublicLayoutWrapper } from '@/components/layout';
import QueryProvider from '@/providers/QueryProvider';
import { Toaster } from 'react-hot-toast';


import { fetchGlobalSeoSettings } from '@/lib/seoApi';

// Font definitions linking to CSS custom properties
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Akal Business School (ABS) | Premium Management Education',
    template: '%s | Akal Business School',
  },
  description:
    'Akal Business School (ABS) offers premium MBA, BBA, and PhD programs in Business Analytics, AI, and Management. Transform your future with international MoUs, placement records, and distinguished faculty.',
  metadataBase: new URL('https://business.auts.ac.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Akal Business School (ABS) | Premium Management Education',
    description:
      'Akal Business School (ABS) offers premium MBA, BBA, and PhD programs in Business Analytics, AI, and Management.',
    url: 'https://business.auts.ac.in',
    siteName: 'Akal Business School',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Akal Business School (ABS) | Premium Management Education',
    description:
      'Akal Business School (ABS) offers premium MBA, BBA, and PhD programs in Business Analytics, AI, and Management.',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch global tracking and settings from DB
  const settings = await fetchGlobalSeoSettings();

  const gaId = settings.google_analytics_id;
  const gtmId = settings.google_tag_manager_id;
  const pixelId = settings.facebook_pixel_id;

  // Schema.org JSON-LD data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': settings.business_type || 'EducationalOrganization',
    '@id': `${settings.default_canonical_url || 'https://business.auts.ac.in'}/#organization`,
    name: settings.organization_name || settings.website_name || 'Akal Business School',
    alternateName: settings.website_name || 'ABS',
    url: settings.default_canonical_url || 'https://business.auts.ac.in',
    logo: settings.organization_logo || 'https://business.auts.ac.in/images/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings.contact_phone || '+91-XXXX-XXXXXX',
      contactType: 'Admissions Office',
      email: settings.contact_email || 'director_abs@auts.ac.in',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
    sameAs: array_values(settings.social_facebook, settings.social_instagram, settings.social_linkedin, settings.social_youtube, settings.social_twitter),
  };

  function array_values(...args: any[]) {
    return args.filter(Boolean);
  }

  const fallbackSameAs = [
    'https://www.facebook.com/AkalBusinessSchool',
    'https://www.instagram.com/akalbusinessschool',
    'https://www.linkedin.com/school/akal-business-school',
    'https://www.youtube.com/AkalBusinessSchool',
  ];

  if (jsonLd.sameAs.length === 0) {
    jsonLd.sameAs = fallbackSameAs;
  }

  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager - Head */}
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}

        {/* Google Analytics (GA4) */}
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', { page_path: window.location.pathname });`,
              }}
            />
          </>
        )}

        {/* Meta Pixel (Facebook Pixel) */}
        {pixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${pixelId}');
              fbq('track', 'PageView');`,
            }}
          />
        )}

        {/* Dynamic global organization schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${playfairDisplay.variable} ${inter.variable} ${jetbrainsMono.variable}`}
        style={{
          fontFamily: 'var(--font-body)',
          backgroundColor: '#FFFFFF',
          color: 'var(--color-navy)',
        }}
      >
        {/* Google Tag Manager (noscript) - Body */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        <QueryProvider>
          <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(201, 162, 39, 0.25)',
                color: '#FFFFFF',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                padding: '12px 24px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
              },
              success: {
                iconTheme: {
                  primary: '#C9A227',
                  secondary: '#0F172A',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
