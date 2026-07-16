/* ============================================================
   ABS — AdminSidebar Component
   Collapsible and role-aware navigation sidebar.
   ============================================================ */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePermission } from '@/hooks/usePermission';
import styles from './AdminSidebar.module.css';
import clsx from 'clsx';
import { useConfirm } from '@/context/ConfirmContext';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Newspaper,
  Calendar,
  FileText,
  Briefcase,
  Award,
  Mail,
  Shield,
  Settings,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MessageSquare,
  Megaphone,
  Image,
  Sliders,
  Trophy,
  Globe,
  FileEdit,
  Download
} from 'lucide-react';

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function AdminSidebar({ collapsed, setCollapsed }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, role, canMinRole } = usePermission();
  const confirm = useConfirm();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin', minRole: 'viewer' as const },
    { label: 'Programs', icon: GraduationCap, href: '/admin/programs', minRole: 'viewer' as const },
    { label: 'Faculty', icon: Users, href: '/admin/faculty', minRole: 'viewer' as const },
    { label: 'News', icon: Newspaper, href: '/admin/news', minRole: 'viewer' as const },
    { label: 'Events', icon: Calendar, href: '/admin/events', minRole: 'viewer' as const },
    { label: 'Applications', icon: FileText, href: '/admin/applications', minRole: 'viewer' as const },
    { label: 'Hero Slides', icon: Sliders, href: '/admin/hero-slides', minRole: 'editor' as const },
    { label: 'Placements', icon: Briefcase, href: '/admin/placements', minRole: 'editor' as const },
    { label: 'Achievements', icon: Trophy, href: '/admin/student-achievements', minRole: 'editor' as const },
    { label: 'Global MoUs', icon: Globe, href: '/admin/partner-universities', minRole: 'editor' as const },
    { label: 'Campus Life', icon: Image, href: '/admin/gallery', minRole: 'editor' as const },
    { label: 'Scholarships', icon: Award, href: '/admin/scholarships', minRole: 'viewer' as const },
    { label: 'Downloads', icon: Download, href: '/admin/downloads', minRole: 'editor' as const },
    { label: 'Testimonials', icon: MessageSquare, href: '/admin/testimonials', minRole: 'editor' as const },
    { label: 'Announcements', icon: Megaphone, href: '/admin/announcements', minRole: 'editor' as const },
    { label: 'Messages', icon: Mail, href: '/admin/messages', minRole: 'viewer' as const },
    { label: 'Page Content', icon: FileEdit, href: '/admin/page-content', minRole: 'admin' as const },
    { label: 'SEO Suite', icon: Globe, href: '/admin/seo', minRole: 'admin' as const },
    { label: 'Users', icon: Shield, href: '/admin/users', minRole: 'admin' as const },
    { label: 'Settings', icon: Settings, href: '/admin/settings', minRole: 'admin' as const },
    { label: 'Audit Log', icon: ClipboardList, href: '/admin/audit-log', minRole: 'admin' as const },
  ];

  const visibleItems = menuItems.filter((item) => canMinRole(item.minRole));

  // Determine role color badge class name
  const roleBadgeClass = clsx(
    styles.roleBadge,
    role === 'admin' && styles.roleAdmin,
    role === 'editor' && styles.roleEditor,
    role === 'viewer' && styles.roleViewer
  );

  return (
    <aside className={clsx(styles.sidebar, collapsed && styles.collapsed)}>
      {/* Brand Logo Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <span className={styles.logoGold}>ABS</span>
          {!collapsed && <span className={styles.logoText}> Admin</span>}
        </Link>
        <button
          className={styles.toggleBtn}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User Quick Info */}
      {!collapsed && user && (
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{user.name}</span>
            <span className={roleBadgeClass}>{role.toUpperCase()}</span>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {visibleItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <li key={idx}>
                <Link
                  href={item.href}
                  className={clsx(styles.navLink, isActive && styles.navLinkActive)}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={styles.icon} size={18} />
                  {!collapsed && <span className={styles.label}>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer log out button */}
      <div className={styles.footer}>
        <button
          onClick={async () => {
            const isConfirmed = await confirm('Are you sure you want to sign out?', {
              title: 'Sign Out',
              confirmText: 'Sign Out',
              variant: 'warning',
            });
            if (isConfirmed) {
              window.location.href = '/admin/login?logout=true';
            }
          }}
          className={styles.logoutBtn}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className={styles.icon} size={18} />
          {!collapsed && <span className={styles.label}>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
