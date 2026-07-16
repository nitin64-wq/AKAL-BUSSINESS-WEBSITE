/* ============================================================
   ABS — Gallery Service
   API requests for gallery items (public & admin CRUD).
   ============================================================ */

import api from '@/lib/api';
import type { ApiResponse, PaginatedResponse, GalleryItem, QueryParams } from '@/types';

export const galleryService = {
  // Public Methods
  getAll: async (params?: QueryParams): Promise<ApiResponse<GalleryItem[]>> => {
    const response = await api.get('/gallery', { params });
    return response.data;
  },

  // Admin Methods
  getAdminAll: async (params?: QueryParams): Promise<PaginatedResponse<GalleryItem>> => {
    const response = await api.get('/admin/gallery', { params });
    return response.data;
  },

  create: async (data: FormData): Promise<ApiResponse<GalleryItem>> => {
    const response = await api.post('/admin/gallery', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/admin/gallery/${id}`);
    return response.data;
  },
};
