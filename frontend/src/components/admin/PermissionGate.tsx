/* ============================================================
   ABS — PermissionGate Component
   Declarative RBAC wrapper to hide/show parts of the UI based on permissions.
   ============================================================ */

'use client';

import React from 'react';
import { usePermission } from '@/hooks/usePermission';
import type { UserRole } from '@/lib/permissions';

interface PermissionGateProps {
  permission?: string;
  minRole?: UserRole;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGate({
  permission,
  minRole,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { can, canMinRole } = usePermission();

  let hasAccess = true;

  if (permission) {
    hasAccess = can(permission);
  }

  if (minRole) {
    hasAccess = hasAccess && canMinRole(minRole);
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
