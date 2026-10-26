import { apiClient } from "@/modules/app/api/client";

export const api = {
  get: async <T>(url: string, config?: any): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },
  post: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.post<T>(url, data);
    return response.data;
  },
  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.put<T>(url, data);
    return response.data;
  },
  patch: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.patch<T>(url, data);
    return response.data;
  },
  delete: async <T>(url: string): Promise<T> => {
    const response = await apiClient.delete<T>(url);
    return response.data;
  },
  del: async <T>(url: string): Promise<T> => {
    const response = await apiClient.delete<T>(url);
    return response.data;
  }
};
export default api;
