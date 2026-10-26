import { MOCK_B2B_PRODUCTS } from '../store/useB2BProductDataStore';
import { B2BProduct } from '../types/b2bTypes';

export const b2bProductService = {
  getProducts: async (): Promise<B2BProduct[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In real app: return axios.get('/api/v1/b2b/products').then(res => res.data);
    return MOCK_B2B_PRODUCTS;
  },

  getProductById: async (id: string): Promise<B2BProduct | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_B2B_PRODUCTS.find(p => p.id === id);
  }
};
