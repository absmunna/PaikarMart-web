import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const TOKEN_KEYS = ['pm_token', 'accessToken', 'token', 'refreshToken'] as const;

function clearAuthTokens() {
  try {
    for (const key of TOKEN_KEYS) {
      localStorage.removeItem(key);
    }
  } catch {
    // ignore (SSR / restricted storage)
  }
}

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  try {
    const token = localStorage.getItem('pm_token') || localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore
  }
  return config;
};

export const responseInterceptor = (response: AxiosResponse) => response;

export const responseErrorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 401) {
    // Invalid/expired token — clear all known auth keys so UI can re-auth
    clearAuthTokens();
  }
  return Promise.reject(error);
};
