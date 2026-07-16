/* ============================================================
   ABS — UI Store (Zustand)
   Global UI state: mobile menu, modals, loading.
   ============================================================ */

import { create } from 'zustand';

interface UIState {
  // Mobile menu
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;

  // Admin sidebar
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Global loading
  isPageLoading: boolean;
  setPageLoading: (loading: boolean) => void;

  // Scroll
  scrollY: number;
  setScrollY: (y: number) => void;
  isScrolled: boolean;

  // DB Connection
  isDbDisconnected: boolean;
  setDbDisconnected: (disconnected: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Mobile menu
  isMobileMenuOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  // Admin sidebar
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  // Global loading
  isPageLoading: false,
  setPageLoading: (loading) => set({ isPageLoading: loading }),

  // Scroll
  scrollY: 0,
  setScrollY: (y) => set({ scrollY: y, isScrolled: y > 50 }),
  isScrolled: false,

  // DB Connection
  isDbDisconnected: false,
  setDbDisconnected: (disconnected) => set({ isDbDisconnected: disconnected }),
}));
