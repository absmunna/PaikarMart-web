/**
 * Paikar Mart - Unified API Configuration & Client Helper
 * Single source of truth for backend API connectivity across the frontend.
 */

// Central API Base URL normalized from environment variable
const rawBase = import.meta.env.VITE_API_BASE_URL || '/api/v1';
export const API_BASE_URL: string = rawBase.replace(/\/+$/, '');

/**
 * Builds a clean, fully-qualified URL for any API endpoint.
 * Handles relative endpoints, leading slashes, and prevents duplicate /api/v1 segments.
 *
 * Examples:
 * buildApiUrl('/products') -> 'https://backend.onrender.com/api/v1/products'
 * buildApiUrl('/api/v1/products') -> 'https://backend.onrender.com/api/v1/products'
 */
export function buildApiUrl(endpoint: string): string {
  if (!endpoint) return API_BASE_URL;
  if (/^https?:\/\//i.test(endpoint)) return endpoint;

  let path = endpoint.trim();

  // Strip duplicate /api/v1 or /api if API_BASE_URL already contains it
  if (API_BASE_URL.endsWith('/api/v1') && path.startsWith('/api/v1')) {
    path = path.slice('/api/v1'.length);
  } else if (API_BASE_URL.endsWith('/api') && path.startsWith('/api')) {
    path = path.slice('/api'.length);
  }

  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  return `${API_BASE_URL}${path}`;
}

/**
 * Lightweight wrapper around native fetch that prepends the centralized API_BASE_URL.
 */
export async function apiFetch<T = any>(endpoint: string, init?: RequestInit): Promise<T> {
  const url = buildApiUrl(endpoint);
  const headers = new Headers(init?.headers);

  if (!headers.has('Content-Type') && !(init?.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach auth token if available in localStorage
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('pm_token') || localStorage.getItem('accessToken') || localStorage.getItem('token') 
    : null;
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

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

export default {
  API_BASE_URL,
  buildApiUrl,
  apiFetch,
};
