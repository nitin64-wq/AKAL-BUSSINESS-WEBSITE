/* ============================================================
   ABS — SEO Suite Layout
   Nested layout providing tabbed navigation across all SEO sub-modules.
   ============================================================ */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Seo.module.css';
import {
  LayoutDashboard,
  Settings,
  Layout,
  Layers,
  Code2,
  HelpCircle,
  Bot,
  Globe,
  Shield,
} from 'lucide-react';

const SUB_MODULES = [
  { id: 'dashboard', label: 'Overview', href: '/admin/seo', icon: LayoutDashboard },
  { id: 'settings', label: 'Global SEO', href: '/admin/seo/settings', icon: Settings },
  { id: 'pages', label: 'Page SEO', href: '/admin/seo/pages', icon: Layout },
  { id: 'content', label: 'Content SEO', href: '/admin/seo/content', icon: Layers },
  { id: 'schemas', label: 'Schema Builder', href: '/admin/seo/schemas', icon: Code2 },
  { id: 'faqs', label: 'FAQ Builder (AEO)', href: '/admin/seo/faqs', icon: HelpCircle },
  { id: 'geo', label: 'GEO Panel', href: '/admin/seo/geo', icon: Bot },
  { id: 'google', label: 'Google & Tracking', href: '/admin/seo/google', icon: Globe },
  { id: 'robots', label: 'Robots & Sitemap', href: '/admin/seo/robots', icon: Shield },
];

export default function SeoSuiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div>
      {/* Tabbed Navigation Sub-header */}
      <div className={styles.tabs} style={{ padding: '4px', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        {SUB_MODULES.map((mod) => {
          const isActive = pathname === mod.href;
          return (
            <Link
              key={mod.id}
              href={mod.href}
              className={isActive ? styles.tabActive : styles.tab}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <mod.icon size={14} />
              {mod.label}
            </Link>
          );
        })}
      </div>

      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
}
