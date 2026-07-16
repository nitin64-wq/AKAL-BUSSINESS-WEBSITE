/* ============================================================
   ABS — usePermission Hook
   React hook providing easy role and capability checks for UI rendering.
   ============================================================ */

'use client';

import { useAuth } from './useAuth';
import { hasPermission, hasMinRole, type UserRole } from '@/lib/permissions';

export function usePermission() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const role: UserRole = user?.role || 'viewer';

  return {
    user,
    role,
    isAuthenticated,
    isLoading,
    can: (permission: string) => isAuthenticated && hasPermission(role, permission),
    canMinRole: (minRole: UserRole) => isAuthenticated && hasMinRole(role, minRole),
    isAdmin: isAuthenticated && role === 'admin',
    isEditor: isAuthenticated && role === 'editor',
    isViewer: isAuthenticated && role === 'viewer',
  };
}
