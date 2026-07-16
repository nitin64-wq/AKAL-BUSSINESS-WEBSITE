/* ============================================================
   ABS — Axios API Client
   Central API instance with auth interceptors.
   ============================================================ */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useUIStore } from '@/store/uiStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

// Request interceptor — attach Bearer token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('abs_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle database offline state & auth expiry
api.interceptors.response.use(
  (response) => {
    // If request succeeds, reset database disconnected state
    useUIStore.getState().setDbDisconnected(false);
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const isDbErr = status === 500 || status === 503 || error.code === 'ERR_NETWORK' || error.message === 'Network Error';
    if (isDbErr) {
      useUIStore.getState().setDbDisconnected(true);
    }

    if (status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('abs_token');
      localStorage.removeItem('abs_user');
      // Only redirect if we're in the admin area
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
