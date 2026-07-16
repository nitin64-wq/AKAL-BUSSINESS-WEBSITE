/* ============================================================
   ABS — Auth Store (Zustand)
   Global authentication state management.
   ============================================================ */

import { create } from 'zustand';
import type { User } from '@/types';
import { getToken, setToken, getStoredUser, setStoredUser, clearAuth } from '@/lib/auth';
import api from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setUser: (user: User) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data.data ?? response.data;

    setToken(token);
    setStoredUser(user);

    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    try {
      const token = get().token || getToken();
      if (token) {
        await api.post('/auth/logout');
      }
    } catch {
      // Ignore errors during logout
    } finally {
      clearAuth();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  fetchUser: async () => {
    const token = getToken();
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const response = await api.get('/auth/me');
      const user = response.data.data || response.data;
      setStoredUser(user);
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      const status = error.response?.status;
      // Only clear credentials if it is explicitly a 401 Unauthorized or 403 Forbidden
      if (status === 401 || status === 403) {
        clearAuth();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      } else {
        // If it is a database connection check failure (e.g., 500 or 503),
        // keep the token and use the cached local user details.
        const cachedUser = getStoredUser();
        set({
          user: cachedUser,
          token,
          isAuthenticated: !!cachedUser,
          isLoading: false,
        });
      }
    }
  },

  setUser: (user: User) => {
    setStoredUser(user);
    set({ user });
  },

  reset: () => {
    clearAuth();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));
