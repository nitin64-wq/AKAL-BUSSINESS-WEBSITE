/* ============================================================
   ABS — Program Service
   API requests for programs (public & admin CRUD).
   ============================================================ */

import api from '@/lib/api';
import type { ApiResponse, PaginatedResponse, Program, QueryParams } from '@/types';

export const programService = {
  // Public Methods
  getAll: async (params?: QueryParams): Promise<ApiResponse<Program[]>> => {
    const response = await api.get('/programs', { params });
    return response.data;
  },

  getBySlug: async (slug: string): Promise<ApiResponse<Program>> => {
    const response = await api.get(`/programs/${slug}`);
    return response.data;
  },

  // Admin Methods
  getAdminAll: async (params?: QueryParams): Promise<PaginatedResponse<Program>> => {
    const response = await api.get('/admin/programs', { params });
    return response.data;
  },

  create: async (data: FormData): Promise<ApiResponse<Program>> => {
    const response = await api.post('/admin/programs', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<ApiResponse<Program>> => {
    // Note: Laravel can sometimes have issues parsing multipart FormData with PUT.
    // A common workaround is using POST with a _method=PUT field.
    const response = await api.post(`/admin/programs/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/admin/programs/${id}`);
    return response.data;
  },

  toggleActive: async (id: number): Promise<ApiResponse<Program>> => {
    const response = await api.patch(`/admin/programs/${id}/toggle-active`);
    return response.data;
  },
};
