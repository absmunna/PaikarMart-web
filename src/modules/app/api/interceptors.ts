import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { safeStorage } from "@/modules/app/utils/storage";

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = safeStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const responseInterceptor = (response: AxiosResponse) => response;

export const responseErrorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 401) {
    // Handle token refresh logic or logout
  }
  return Promise.reject(error);
};
