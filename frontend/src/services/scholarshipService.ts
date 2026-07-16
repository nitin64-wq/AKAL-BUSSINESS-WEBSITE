/* ============================================================
   ABS — Scholarship Service
   API requests for scholarships (public & admin CRUD).
   ============================================================ */

import api from '@/lib/api';
import type { ApiResponse, PaginatedResponse, Scholarship, QueryParams } from '@/types';

export const scholarshipService = {
  // Public Methods
  getAll: async (params?: QueryParams): Promise<ApiResponse<Scholarship[]>> => {
    const response = await api.get('/scholarships', { params });
    return response.data;
  },

  // Admin Methods
  getAdminAll: async (params?: QueryParams): Promise<PaginatedResponse<Scholarship>> => {
    const response = await api.get('/admin/scholarships', { params });
    return response.data;
  },

  create: async (data: Partial<Scholarship>): Promise<ApiResponse<Scholarship>> => {
    const response = await api.post('/admin/scholarships', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Scholarship>): Promise<ApiResponse<Scholarship>> => {
    const response = await api.put(`/admin/scholarships/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/admin/scholarships/${id}`);
    return response.data;
  },
};
