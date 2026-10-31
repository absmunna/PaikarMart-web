export { API_BASE_URL } from '../config/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },
  B2B: {
    PRODUCTS: '/b2b/products',
    ORDERS: '/b2b/orders',
  },
  WALLET: {
    BALANCE: '/wallet/balance',
    TRANSACTIONS: '/wallet/transactions',
  }
};

