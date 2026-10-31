import { create } from 'zustand';
import axios from 'axios';
import { API_BASE_URL } from '@/core/config/api';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  image?: string;
  images?: string[];
  coinCashback?: number;
  tag?: string;
  portal: 'pk-shop' | 'pk-store' | 'b2c' | 'b2b';
  description?: string;
  stock?: number;
  isPKShop?: boolean;
  vendor?: any;
  category?: string;
  isNearMe?: boolean;
  createdAt?: string;
}


interface ProductState {
  products: Product[];
  customProducts: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: (params?: any) => Promise<void>;
  addProduct: (productData: any) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  customProducts: [],
  isLoading: false,
  error: null,

  fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, { params });
      
      const mappedProducts = (response.data && response.data.length > 0)
        ? response.data.map((p: any) => {
            let portal = p.portal || 'b2c';
            if (p.isPKShop) portal = 'pk-shop';
            else if (p.id?.startsWith('pk-polo') || p.id?.startsWith('pk-oud')) portal = 'pk-store';
            else if (p.id?.startsWith('pk-')) portal = 'pk-shop';
            else if (p.type === 'wholesale' || p.category === 'wholesale') portal = 'b2b';
            
            return {
              ...p,
              portal,
              image: p.images?.[0] || 'https://via.placeholder.com/300',
              price: Number(p.price),
              originalPrice: Number(p.originalPrice || p.price),
              category: p.category,
              vendor: p.vendor,
              isNearMe: p.isNearMe
            };
          })
        : [];

      const combined = [...get().customProducts, ...mappedProducts];
      set({ products: combined, isLoading: false });
    } catch (err: any) {
      set({ products: get().customProducts, isLoading: false, error: 'Failed to load products' });
    }
  },

  addProduct: async (productData) => {
    set({ isLoading: true });
    
    // Construct local product representation so it's guaranteed to show up instantly!
    const newProduct: Product = {
      id: productData.id || `custom-prod-${Date.now()}`,
      name: productData.name || productData.title || "Custom Product",
      price: Number(productData.price || 0),
      originalPrice: Number(productData.comparePrice || productData.price || 0),
      portal: productData.portal || 'b2c',
      category: productData.category || 'Fashion',
      image: productData.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
      images: [productData.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600'],
      rating: 4.8,
      reviews: 1,
      vendor: productData.vendor || "My Shop",
      description: productData.description || productData.name || "",
      isPKShop: productData.portal === 'pk-shop'
    };

    // Prepend to products and customProducts arrays instantly in state
    set((state) => ({ 
      customProducts: [newProduct, ...state.customProducts],
      products: [newProduct, ...state.products],
      isLoading: false 
    }));

    try {
      await axios.post(`${API_BASE_URL}/products`, {
        ...productData,
        isPKShop: productData.portal === 'pk-shop',
        images: [productData.image],
        description: productData.description || productData.name,
      });
    } catch (err) {
      console.warn('API post failed, kept in local state fallback:', err);
    }
  },

  removeProduct: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      set((state) => ({
        products: state.products.filter(p => p.id !== id)
      }));
    } catch (err) {
      set({ error: 'Failed to delete product' });
    }
  }
}));
