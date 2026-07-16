/* ============================================================
   ABS — Testimonial Service
   API requests for testimonials (public & admin CRUD).
   ============================================================ */

import api from '@/lib/api';
import type { ApiResponse, PaginatedResponse, Testimonial, QueryParams } from '@/types';

export const testimonialService = {
  // Public Methods
  getAll: async (params?: QueryParams): Promise<ApiResponse<Testimonial[]>> => {
    const response = await api.get('/testimonials', { params });
    return response.data;
  },

  // Admin Methods
  getAdminAll: async (params?: QueryParams): Promise<PaginatedResponse<Testimonial>> => {
    const response = await api.get('/admin/testimonials', { params });
    return response.data;
  },

  create: async (data: FormData): Promise<ApiResponse<Testimonial>> => {
    const response = await api.post('/admin/testimonials', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<ApiResponse<Testimonial>> => {
    const response = await api.post(`/admin/testimonials/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/admin/testimonials/${id}`);
    return response.data;
  },
};
