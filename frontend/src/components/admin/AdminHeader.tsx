/* ============================================================
   ABS — AdminHeader Component
   Header panel inside admin interface displaying page breadcrumbs and action buttons.
   ============================================================ */

'use client';

import React from 'react';
import { usePermission } from '@/hooks/usePermission';
import styles from './AdminHeader.module.css';
import { Bell, User as UserIcon, LogOut, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useConfirm } from '@/context/ConfirmContext';

interface AdminHeaderProps {
  title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  const { user, role } = usePermission();
  const confirm = useConfirm();

  const handleLogout = async () => {
    const isConfirmed = await confirm('Are you sure you want to sign out?', {
      title: 'Sign Out',
      confirmText: 'Sign Out',
      variant: 'warning',
    });
    if (isConfirmed) {
      window.location.href = '/admin/login?logout=true';
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.right}>
        {/* Public Website Link */}
        <Link href="/" target="_blank" className={styles.btnLink} title="View Live Website">
          <ExternalLink size={16} />
          <span className={styles.btnLabel}>View Website</span>
        </Link>

        {/* Notifications */}
        <button className={styles.iconBtn} aria-label="Notifications" title="No new notifications">
          <Bell size={18} />
          <span className={styles.dot} />
        </button>

        {/* User profile dropdown trigger */}
        <div className={styles.profile}>
          <div className={styles.userTrigger}>
            <div className={styles.avatar}>
              <UserIcon size={16} />
            </div>
            <div className={styles.meta}>
              <span className={styles.name}>{user?.name || 'ABS Staff'}</span>
              <span className={styles.role}>{role.toUpperCase()}</span>
            </div>
          </div>

          <button onClick={handleLogout} className={styles.logoutBtn} title="Sign Out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
