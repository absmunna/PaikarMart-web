import { api } from '@/lib/api';

export const orderService = {
  getOrders: async () => {
    return await api.get<any[]>('/api/v1/orders');
  },
  trackOrder: async (orderId: string) => {
    return await api.get<any>(`/api/v1/orders/${orderId}/track`);
  },
  reorder: async (orderId: string) => {
    return await api.post<any>(`/api/v1/orders/${orderId}/reorder`);
  }
};
