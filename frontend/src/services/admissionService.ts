/* ============================================================
   ABS — Admission & Applications Service
   API requests for student applications and admissions.
   ============================================================ */

import api from '@/lib/api';
import type { ApiResponse, PaginatedResponse, Application, ApplicationFormData, QueryParams } from '@/types';

export const admissionService = {
  // Public Methods
  apply: async (data: ApplicationFormData): Promise<ApiResponse<Application>> => {
    const response = await api.post('/applications', data);
    return response.data;
  },

  track: async (applicationNo: string): Promise<ApiResponse<Application>> => {
    const response = await api.get(`/applications/track/${applicationNo}`);
    return response.data;
  },

  // Admin Methods
  getAdminAll: async (params?: QueryParams): Promise<PaginatedResponse<Application>> => {
    const response = await api.get('/admin/applications', { params });
    return response.data;
  },

  getAdminById: async (id: number): Promise<ApiResponse<Application>> => {
    const response = await api.get(`/admin/applications/${id}`);
    return response.data;
  },

  updateStatus: async (
    id: number,
    status: Application['status'],
    remarks?: string
  ): Promise<ApiResponse<Application>> => {
    const response = await api.patch(`/admin/applications/${id}/status`, { status, remarks });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/admin/applications/${id}`);
    return response.data;
  },

  exportCsv: async (params?: QueryParams): Promise<Blob> => {
    const response = await api.get('/admin/applications/export/csv', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  exportPdf: async (id: number): Promise<Blob> => {
    const response = await api.get(`/admin/applications/${id}/export/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
