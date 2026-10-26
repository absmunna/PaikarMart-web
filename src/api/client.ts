import axios from 'axios';
import { requestInterceptor, responseInterceptor } from './interceptors';
import { API_BASE_URL } from './endpoints';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(requestInterceptor);
apiClient.interceptors.response.use(responseInterceptor);
