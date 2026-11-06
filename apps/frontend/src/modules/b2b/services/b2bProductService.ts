import { api } from '@/core/api';
import { B2BProduct } from '../types/b2bTypes';

export const b2bProductService = {
  getProducts: async (): Promise<B2BProduct[]> => {
    return api.get<B2BProduct[]>('/b2b/products');
  },

  getProductById: async (id: string): Promise<B2BProduct | undefined> => {
    return api.get<B2BProduct>(`/b2b/products/${id}`);
  }
};
