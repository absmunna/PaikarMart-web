
import { api } from '@/lib/api';

export const vendorService = {
  getNearbyShops: async (area?: string) => {
    return await api.get<any[]>('/api/v1/shops/nearby', { params: { area } });
  },
};
