/**
 * Paikar Mart - Unified API Client & Configuration
 * Single source of truth for backend API connectivity.
 * Merged from legacy core/lib/api and core/config/api.
 */

import axios from 'axios';
import { requestInterceptor, responseInterceptor, responseErrorInterceptor } from './interceptors';

// 1. Configuration & Base URL
const rawBase = import.meta.env.VITE_API_BASE_URL;

if (import.meta.env.PROD && !rawBase) {
  console.error(
    '❌ CRITICAL: VITE_API_BASE_URL is missing in production build. ' +
    'API calls will default to "" which may cause routing issues if not proxied.'
  );
}

export const API_BASE_URL: string = (rawBase || '').replace(/\/+$/, '');

/**
 * Builds a clean, fully-qualified URL for any API endpoint.
 * Prevents duplicate  segments.
 */
export function buildApiUrl(endpoint: string): string {
  if (!endpoint) return API_BASE_URL;
  if (/^https?:\/\//i.test(endpoint)) return endpoint;

  let path = endpoint.trim();

  // Strip duplicate  or /api if API_BASE_URL already contains it
  if (API_BASE_URL.endsWith('') && path.startsWith('')) {
    path = path.slice(''.length);
  } else if (API_BASE_URL.endsWith('/api') && path.startsWith('/api')) {
    path = path.slice('/api'.length);
  }

  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  return `${API_BASE_URL}${path}`;
}

// 2. Axios Instance (Core Client)
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors for token management
apiClient.interceptors.request.use(requestInterceptor);
apiClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor);


// 3. Lightweight "api" helper (legacy compatibility)
function normalizeUrl(url: string): string {
  if (!url || /^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return url.slice(''.length);
  if (url === '') return '/';
  if (url.startsWith('/api/')) return url.slice('/api'.length);
  return url;
}

export const api = {
  get: async <T>(url: string, config?: any): Promise<T> => {
    const response = await apiClient.get<T>(normalizeUrl(url), config);
    return response.data;
  },
  post: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.post<T>(normalizeUrl(url), data);
    return response.data;
  },
  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.put<T>(normalizeUrl(url), data);
    return response.data;
  },
  patch: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.patch<T>(normalizeUrl(url), data);
    return response.data;
  },
  delete: async <T>(url: string): Promise<T> => {
    const response = await apiClient.delete<T>(normalizeUrl(url));
    return response.data;
  },
  del: async <T>(url: string): Promise<T> => {
    const response = await apiClient.delete<T>(normalizeUrl(url));
    return response.data;
  }
};

// 4. Fetch-based helper (legacy compatibility)
export async function apiFetch<T = any>(endpoint: string, init?: RequestInit): Promise<T> {
  const url = buildApiUrl(endpoint);
  const headers = new Headers(init?.headers);

  if (!headers.has('Content-Type') && !(init?.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('pm_token') || localStorage.getItem('accessToken') || localStorage.getItem('token') 
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
    throw new Error(errorData?.message || errorData?.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export default api;
