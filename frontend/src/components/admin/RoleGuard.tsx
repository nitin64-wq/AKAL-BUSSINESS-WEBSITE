/* ============================================================
   ABS — RoleGuard Component
   Route-level guard that redirects unauthorized users to admin login or home.
   ============================================================ */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks/usePermission';
import type { UserRole } from '@/lib/permissions';

interface RoleGuardProps {
  minRole?: UserRole;
  permission?: string;
  redirectTo?: string;
  children: React.ReactNode;
}

export function RoleGuard({
  minRole = 'viewer',
  permission,
  redirectTo = '/admin/login',
  children,
}: RoleGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, canMinRole, can } = usePermission();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    if (minRole && !canMinRole(minRole)) {
      router.push('/');
      return;
    }

    if (permission && !can(permission)) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, isLoading, minRole, permission, router, redirectTo, canMinRole, can]);

  if (isLoading) {
    return (
      <div style={{
        backgroundColor: 'var(--color-navy)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-gold)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            border: '3px solid rgba(201, 168, 76, 0.1)',
            borderTop: '3px solid var(--color-gold)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto var(--space-4)'
          }} />
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold' }}>Verifying authorization...</p>
        </div>
        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated || (minRole && !canMinRole(minRole)) || (permission && !can(permission))) {
    return null; // Prevents flashing content while redirect is triggered
  }

  return <>{children}</>;
}
