/* ============================================================
   ABS — Admin Main Layout
   Layout wrapper managing authorization check, sidebar collapse state, and main content views.
   ============================================================ */

'use client';

import React, { useState } from 'react';
import { RoleGuard } from '@/components/admin/RoleGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DbConnectionWarning } from '@/components/layout/DbConnectionWarning';
import styles from './AdminLayout.module.css';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // If we are on the login page, do not mount the admin sidebar or header!
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <div className={styles.loginLayout}>
        <DbConnectionWarning />
        {children}
      </div>
    );
  }

  // Get human-readable title based on path
  const getPageTitle = (path: string) => {
    if (path === '/admin') return 'Dashboard';
    if (path.startsWith('/admin/programs')) return 'Programs Manager';
    if (path.startsWith('/admin/faculty')) return 'Faculty Directory';
    if (path.startsWith('/admin/news')) return 'News & Events Publisher';
    if (path.startsWith('/admin/events')) return 'Events Planner';
    if (path.startsWith('/admin/applications')) return 'Admissions Applications';
    if (path.startsWith('/admin/placements')) return 'Corporate Placements';
    if (path.startsWith('/admin/scholarships')) return 'Scholarships & Grants';
    if (path.startsWith('/admin/downloads')) return 'Downloads & Resources';
    if (path.startsWith('/admin/testimonials')) return 'Testimonials Manager';
    if (path.startsWith('/admin/announcements')) return 'Scrolling Announcements';
    if (path.startsWith('/admin/messages')) return 'Inquiries & Messages';
    if (path.startsWith('/admin/seo')) return 'Enterprise SEO Suite';
    if (path.startsWith('/admin/users')) return 'Users & RBAC Controls';
    if (path.startsWith('/admin/settings')) return 'Global Settings';
    if (path.startsWith('/admin/audit-log')) return 'System Audit Trail';
    return 'Admin Panel';
  };

  const pageTitle = getPageTitle(pathname);

  return (
    <RoleGuard minRole="viewer" redirectTo="/admin/login">
      <div className={styles.layout}>
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        
        <div className={styles.mainContainer}>
          <DbConnectionWarning />
          <AdminHeader title={pageTitle} />
          
          <main className={styles.content}>
            <div className="container" style={{ padding: 'var(--space-6) 0' }}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
