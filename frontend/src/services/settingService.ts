/* ============================================================
   ABS — Setting Service
   API requests for settings (public & admin CRUD).
   ============================================================ */

import api from '@/lib/api';
import type { ApiResponse, Setting } from '@/types';

export const settingService = {
  // Public Methods
  getAll: async (): Promise<ApiResponse<Setting[]>> => {
    const response = await api.get('/settings');
    return response.data;
  },

  // Admin Methods
  getAdminAll: async (): Promise<ApiResponse<Setting[]>> => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  update: async (settings: Record<string, unknown>): Promise<ApiResponse<Setting[]>> => {
    const response = await api.put('/admin/settings', { settings });
    return response.data;
  },
};
