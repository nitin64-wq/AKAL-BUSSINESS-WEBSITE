/* ============================================================
   ABS — News & Events Service
   API requests for news posts and events (public & admin CRUD).
   ============================================================ */

import api from '@/lib/api';
import type { ApiResponse, PaginatedResponse, News, Event, QueryParams } from '@/types';

export const newsService = {
  // --- News Methods ---
  // Public
  getNewsAll: async (params?: QueryParams): Promise<ApiResponse<News[]>> => {
    const response = await api.get('/news', { params });
    return response.data;
  },

  getNewsBySlug: async (slug: string): Promise<ApiResponse<News>> => {
    const response = await api.get(`/news/${slug}`);
    return response.data;
  },

  // Admin
  getNewsAdminAll: async (params?: QueryParams): Promise<PaginatedResponse<News>> => {
    const response = await api.get('/admin/news', { params });
    return response.data;
  },

  createNews: async (data: FormData): Promise<ApiResponse<News>> => {
    const response = await api.post('/admin/news', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateNews: async (id: number, data: FormData): Promise<ApiResponse<News>> => {
    const response = await api.post(`/admin/news/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteNews: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/admin/news/${id}`);
    return response.data;
  },

  publishNews: async (id: number, isPublished: boolean): Promise<ApiResponse<News>> => {
    const response = await api.patch(`/admin/news/${id}/publish`, { is_published: isPublished });
    return response.data;
  },

  featureNews: async (id: number, isFeatured: boolean): Promise<ApiResponse<News>> => {
    const response = await api.patch(`/admin/news/${id}/feature`, { is_featured: isFeatured });
    return response.data;
  },

  // --- Events Methods ---
  // Public
  getEventsAll: async (params?: QueryParams): Promise<ApiResponse<Event[]>> => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  getEventBySlug: async (slug: string): Promise<ApiResponse<Event>> => {
    const response = await api.get(`/events/${slug}`);
    return response.data;
  },

  // Admin
  getEventsAdminAll: async (params?: QueryParams): Promise<PaginatedResponse<Event>> => {
    const response = await api.get('/admin/events', { params });
    return response.data;
  },

  createEvent: async (data: FormData): Promise<ApiResponse<Event>> => {
    const response = await api.post('/admin/events', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateEvent: async (id: number, data: FormData): Promise<ApiResponse<Event>> => {
    const response = await api.post(`/admin/events/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteEvent: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/admin/events/${id}`);
    return response.data;
  },
};
