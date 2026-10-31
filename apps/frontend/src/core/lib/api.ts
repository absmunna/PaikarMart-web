import { apiClient } from "@/modules/app";

function normalizeUrl(url: string): string {
  if (!url || /^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/api/v1/')) return url.slice('/api/v1'.length);
  if (url === '/api/v1') return '/';
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
export default api;
