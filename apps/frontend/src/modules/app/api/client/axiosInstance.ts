import axios from 'axios';
import { onRequest, onResponse, onError } from './interceptors';
import { API_BASE_URL } from '@/core/config/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(onRequest);
apiClient.interceptors.response.use(onResponse, onError);
