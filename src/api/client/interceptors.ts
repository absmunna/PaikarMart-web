import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export const onRequest = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('pm_token');
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
