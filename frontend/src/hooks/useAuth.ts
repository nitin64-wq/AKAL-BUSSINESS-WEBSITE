/* ============================================================
   ABS — useAuth Hook
   Convenience hook wrapping the auth store.
   ============================================================ */

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import type { UserRole } from '@/lib/permissions';

export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    if (store.isLoading && !store.user) {
      // Try to restore session on mount
      store.fetchUser();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login: store.login,
    logout: store.logout,
    fetchUser: store.fetchUser,
    role: (store.user?.role || 'viewer') as UserRole,
  };
}
