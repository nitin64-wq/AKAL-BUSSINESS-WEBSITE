/* ============================================================
   ABS — Faculty Service
   API requests for faculty members (public & admin CRUD).
   ============================================================ */

import api from '@/lib/api';
import type { ApiResponse, PaginatedResponse, Faculty, QueryParams } from '@/types';

export const facultyService = {
  // Public Methods
  getAll: async (params?: QueryParams): Promise<ApiResponse<Faculty[]>> => {
    const response = await api.get('/faculty', { params });
    return response.data;
  },

  getBySlug: async (slug: string): Promise<ApiResponse<Faculty>> => {
    const response = await api.get(`/faculty/${slug}`);
    return response.data;
  },

  // Admin Methods
  getAdminAll: async (params?: QueryParams): Promise<PaginatedResponse<Faculty>> => {
    const response = await api.get('/admin/faculty', { params });
    return response.data;
  },

  create: async (data: FormData): Promise<ApiResponse<Faculty>> => {
    const response = await api.post('/admin/faculty', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<ApiResponse<Faculty>> => {
    const response = await api.post(`/admin/faculty/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/admin/faculty/${id}`);
    return response.data;
  },

  reorder: async (orders: { id: number; sort_order: number }[]): Promise<ApiResponse<null>> => {
    const response = await api.post('/admin/faculty/reorder', { orders });
    return response.data;
  },
};
