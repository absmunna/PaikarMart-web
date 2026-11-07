import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('pm_token') || localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const responseInterceptor = (response: AxiosResponse) => response;

export const responseErrorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 401) {
    // If the token is invalid or expired, remove it so subsequent requests don't keep failing
    try {
      localStorage.removeItem('accessToken');
    } catch {}
  }
  return Promise.reject(error);
};
