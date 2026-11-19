
import { api } from '@/core/api';

export const vendorService = {
  getNearbyShops: async (area?: string) => {
    return await api.get<any[]>('/shops/nearby', { params: { area } });
  },
};
