/**
 * Paikar Mart - Unified API Client & Configuration
 * Single source of truth for backend API connectivity.
 */

import axios from 'axios';
import { requestInterceptor, responseInterceptor, responseErrorInterceptor } from './interceptors';

// 1. Configuration & Base URL
const rawBase = import.meta.env.VITE_API_BASE_URL;

if (import.meta.env.PROD && !rawBase) {
  console.error(
    '❌ CRITICAL: VITE_API_BASE_URL is missing in production build. ' +
      'Set it in Vercel Environment Variables (e.g. https://paikarmart-web-api.onrender.com/api/v1).'
  );
}

export const API_BASE_URL: string = (rawBase || '').replace(/\/+$/, '');

/**
 * Builds a clean, fully-qualified URL for any API endpoint.
 * Prevents duplicate /api/v1 segments when base already includes the prefix.
 */
export function buildApiUrl(endpoint: string): string {
  if (!endpoint) return API_BASE_URL;
  if (/^https?:\/\//i.test(endpoint)) return endpoint;

  let path = endpoint.trim();
  if (!path.startsWith('/')) path = `/${path}`;

  const base = API_BASE_URL;

  // Strip duplicate /api/v1 when base already ends with it
  if (base.endsWith('/api/v1') && (path === '/api/v1' || path.startsWith('/api/v1/'))) {
    path = path.slice('/api/v1'.length) || '/';
  } else if (base.endsWith('/api') && (path === '/api' || path.startsWith('/api/'))) {
    path = path.slice('/api'.length) || '/';
  }

  return `${base}${path}`;
}

// 2. Axios Instance (Core Client)
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(requestInterceptor);
apiClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

/**
 * Normalize path relative to axios baseURL.
 * Callers may pass '/auth/login' or '/api/v1/auth/login' — both must work.
 */
function normalizeUrl(url: string): string {
  if (!url || /^https?:\/\//i.test(url)) return url;

  let path = url.trim();
  if (!path.startsWith('/')) path = `/${path}`;

  if (path === '/api/v1' || path.startsWith('/api/v1/')) {
    path = path.slice('/api/v1'.length) || '/';
  } else if (path === '/api' || path.startsWith('/api/')) {
    // Only strip /api when base already encodes the API root
    if (API_BASE_URL.endsWith('/api') || API_BASE_URL.includes('/api/')) {
      path = path.slice('/api'.length) || '/';
    }
  }

  return path;
}

export const api = {
  get: async <T>(url: string, config?: any): Promise<T> => {
    const response = await apiClient.get<T>(normalizeUrl(url), config);
    return response.data;
  },
  post: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await apiClient.post<T>(normalizeUrl(url), data, config);
    return response.data;
  },
  put: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await apiClient.put<T>(normalizeUrl(url), data, config);
    return response.data;
  },
  patch: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await apiClient.patch<T>(normalizeUrl(url), data, config);
    return response.data;
  },
  delete: async <T>(url: string, config?: any): Promise<T> => {
    const response = await apiClient.delete<T>(normalizeUrl(url), config);
    return response.data;
  },
  del: async <T>(url: string, config?: any): Promise<T> => {
    const response = await apiClient.delete<T>(normalizeUrl(url), config);
    return response.data;
  },
};

// 4. Fetch-based helper (legacy compatibility)
export async function apiFetch<T = any>(endpoint: string, init?: RequestInit): Promise<T> {
  const url = buildApiUrl(endpoint);
  const headers = new Headers(init?.headers);

  if (!headers.has('Content-Type') && !(init?.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('pm_token') ||
        localStorage.getItem('accessToken') ||
        localStorage.getItem('token')
      : null;

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, { ...init, headers });

  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText || 'Network request failed' };
    }
    throw new Error(
      errorData?.message || errorData?.error || `Request failed with status ${response.status}`
    );
  }

  // 204 No Content
  if (response.status === 204) return undefined as T;
  return response.json();
}

export default api;
