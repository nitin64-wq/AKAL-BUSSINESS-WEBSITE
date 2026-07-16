/* ============================================================
   ABS — Placement Service
   API requests for placements (public & admin CRUD).
   ============================================================ */

import api from '@/lib/api';
import type { ApiResponse, PaginatedResponse, Placement, QueryParams } from '@/types';

export const placementService = {
  // Public Methods
  getAll: async (params?: QueryParams): Promise<ApiResponse<Placement[]>> => {
    const response = await api.get('/placements', { params });
    return response.data;
  },

  // Admin Methods
  getAdminAll: async (params?: QueryParams): Promise<PaginatedResponse<Placement>> => {
    const response = await api.get('/admin/placements', { params });
    return response.data;
  },

  create: async (data: FormData): Promise<ApiResponse<Placement>> => {
    const response = await api.post('/admin/placements', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<ApiResponse<Placement>> => {
    const response = await api.post(`/admin/placements/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/admin/placements/${id}`);
    return response.data;
  },
};
