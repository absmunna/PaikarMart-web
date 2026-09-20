export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

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

