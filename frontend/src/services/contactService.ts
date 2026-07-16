/* ============================================================
   ABS — Contact & Enquiry Service
   API requests for contact messages, settings, placements,
   scholarships, gallery, and administrative controls.
   ============================================================ */

import api from '@/lib/api';
import type {
  ApiResponse,
  PaginatedResponse,
  ContactMessage,
  ContactFormData,
  NewsletterFormData,
  Placement,
  Scholarship,
  GalleryItem,
  Setting,
  User,
  AuditLog,
  DashboardStats,
  QueryParams,
  SettingsUpdateData,
} from '@/types';

export const contactService = {
  // --- Contact Messages ---
  // Public
  submitContact: async (data: ContactFormData): Promise<ApiResponse<ContactMessage>> => {
    const response = await api.post('/contact', data);
    return response.data;
  },

  submitNewsletter: async (data: NewsletterFormData): Promise<ApiResponse<null>> => {
    const response = await api.post('/newsletter/subscribe', data);
    return response.data;
  },

  // Admin
  getMessagesAdminAll: async (params?: QueryParams): Promise<PaginatedResponse<ContactMessage>> => {
    const response = await api.get('/admin/messages', { params });
    return response.data;
  },

  markMessageRead: async (id: number): Promise<ApiResponse<ContactMessage>> => {
    const response = await api.patch(`/admin/messages/${id}/read`);
    return response.data;
  },

  replyToMessage: async (id: number, reply: string): Promise<ApiResponse<ContactMessage>> => {
    const response = await api.post(`/admin/messages/${id}/reply`, { reply });
    return response.data;
  },

  deleteMessage: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/admin/messages/${id}`);
    return response.data;
  },

  // --- Placements ---
  // Public
  getPlacementsAll: async (params?: QueryParams): Promise<ApiResponse<Placement[]>> => {
    const response = await api.get('/placements', { params });
    return response.data;
  },

  // Admin
  getPlacementsAdminAll: async (params?: QueryParams): Promise<PaginatedResponse<Placement>> => {
    const response = await api.get('/admin/placements', { params });
    return response.data;
  },

  createPlacement: async (data: FormData): Promise<ApiResponse<Placement>> => {
    const response = await api.post('/admin/placements', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updatePlacement: async (id: number, data: FormData): Promise<ApiResponse<Placement>> => {
    const response = await api.post(`/admin/placements/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deletePlacement: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/admin/placements/${id}`);
    return response.data;
  },

  // --- Scholarships ---
  // Public
  getScholarshipsAll: async (params?: QueryParams): Promise<ApiResponse<Scholarship[]>> => {
    const response = await api.get('/scholarships', { params });
    return response.data;
  },

  // Admin
  getScholarshipsAdminAll: async (params?: QueryParams): Promise<PaginatedResponse<Scholarship>> => {
    const response = await api.get('/admin/scholarships', { params });
    return response.data;
  },

  createScholarship: async (data: Partial<Scholarship>): Promise<ApiResponse<Scholarship>> => {
    const response = await api.post('/admin/scholarships', data);
    return response.data;
  },

  updateScholarship: async (id: number, data: Partial<Scholarship>): Promise<ApiResponse<Scholarship>> => {
    const response = await api.put(`/admin/scholarships/${id}`, data);
    return response.data;
  },

  deleteScholarship: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/admin/scholarships/${id}`);
    return response.data;
  },

  // --- Gallery ---
  // Public
  getGalleryAll: async (params?: QueryParams): Promise<ApiResponse<GalleryItem[]>> => {
    const response = await api.get('/gallery', { params });
    return response.data;
  },

  // Admin
  getGalleryAdminAll: async (params?: QueryParams): Promise<PaginatedResponse<GalleryItem>> => {
    const response = await api.get('/admin/gallery', { params });
    return response.data;
  },

  uploadGalleryImage: async (data: FormData): Promise<ApiResponse<GalleryItem>> => {
    const response = await api.post('/admin/gallery', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteGalleryImage: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/admin/gallery/${id}`);
    return response.data;
  },

  // --- Settings ---
  // Public
  getSettingsPublic: async (): Promise<ApiResponse<Record<string, any>>> => {
    const response = await api.get('/settings');
    return response.data;
  },

  // Admin
  getSettingsAdmin: async (): Promise<ApiResponse<Setting[]>> => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  updateSettings: async (data: SettingsUpdateData): Promise<ApiResponse<Setting[]>> => {
    const response = await api.put('/admin/settings', data);
    return response.data;
  },

  // --- Dashboard Stats ---
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // --- Admin User Management ---
  getUsersAdminAll: async (params?: QueryParams): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  createUserAdmin: async (data: Partial<User> & { password?: string }): Promise<ApiResponse<User>> => {
    const response = await api.post('/admin/users', data);
    return response.data;
  },

  updateUserAdmin: async (id: number, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUserAdmin: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  changeUserRole: async (id: number, role: User['role']): Promise<ApiResponse<User>> => {
    const response = await api.patch(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  // --- Audit Logs ---
  getAuditLogs: async (params?: QueryParams): Promise<PaginatedResponse<AuditLog>> => {
    const response = await api.get('/admin/audit-logs', { params });
    return response.data;
  },
};
