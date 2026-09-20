import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { safeStorage } from "@/modules/app/utils/storage";

export const onRequest = (config: InternalAxiosRequestConfig) => {
  const token = safeStorage.getItem('pm_token') || safeStorage.getItem('pm.auth.token.v1') || safeStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const onResponse = (response: AxiosResponse) => response;

export const onError = (error: AxiosError) => {
  // Centralized error handling
  return Promise.reject(error);
};
