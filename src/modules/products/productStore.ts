import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

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
  portal: 'pk-shop' | 'b2c' | 'wholesale';
  description?: string;
  stock?: number;
  isPKShop?: boolean;
  // Additional fields for B2C UI
  category?: string;
  vendor?: string;
  isNearMe?: boolean;
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: (params?: any) => Promise<void>;
  addProduct: (productData: any) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'pk_1',
    name: 'PK Exclusive Honey - 100% Pure Sundarban Honey (1kg)',
    price: 850,
    originalPrice: 1050,
    portal: 'pk-shop',
    tag: 'Pure',
    coinCashback: 42,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&fit=crop',
    rating: 4.9,
    reviews: 128,
    category: 'grocery',
    vendor: 'PaikarMart Store',
    description: 'খাঁটি সুন্দরবনের প্রাকৃতিক মধু, সরাসরি সংগৃহীত ও ল্যাব পরীক্ষিত।'
  },
  {
    id: 'pk_2',
    name: 'PK Royal Cold-Pressed Mustard Oil (5L Jar)',
    price: 1150,
    originalPrice: 1350,
    portal: 'pk-shop',
    tag: 'Exclusive',
    coinCashback: 55,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&fit=crop',
    rating: 4.8,
    reviews: 94,
    category: 'grocery',
    vendor: 'PaikarMart Store',
    description: 'ঘানি ভাঙা খাঁটি সরিষার তেল, কোনো কৃত্রিম প্রিজারভেটিভ নেই।'
  },
  {
    id: 'pk_3',
    name: 'PK Handcrafted Traditional Nakshi Kantha',
    price: 2400,
    originalPrice: 3000,
    portal: 'pk-shop',
    tag: 'Handmade',
    coinCashback: 120,
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&fit=crop',
    rating: 5.0,
    reviews: 45,
    category: 'fashion',
    vendor: 'PaikarMart Store',
    description: 'ঐতিহ্যবাহী হাতের কাজের নকশী কাঁথা, উন্নত সুতা ও রঙ।'
  },
  {
    id: 'b2c_1',
    name: 'অর্গানিক তাজা পালং শাক (Organic Spinach)',
    price: 35,
    originalPrice: 50,
    portal: 'b2c',
    category: 'grocery',
    vendor: 'Fresh Valley Farm',
    isNearMe: true,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&fit=crop',
    rating: 4.8,
    reviews: 54,
    description: 'সরাসরি সাভার খামার থেকে উত্তোলিত বিষমুক্ত তাজা পালং শাক।'
  },
  {
    id: 'b2c_2',
    name: 'Smart Watch Series 9 Ultimate AMOLED',
    price: 2450,
    originalPrice: 3200,
    portal: 'b2c',
    category: 'electronics',
    vendor: 'Rahim Electronics',
    isNearMe: false,
    image: 'https://images.unsplash.com/photo-1546868871-70c122467d9b?w=400&fit=crop',
    rating: 4.7,
    reviews: 112,
    description: 'ফুল এইচডি ডিসপ্লে, কলিং ফিচার এবং ৭ দিনের ব্যাটারি ব্যাকআপ।'
  },
  {
    id: 'b2c_3',
    name: 'প্রিমিয়াম ডেনিম জ্যাকেট (Slim Fit)',
    price: 1850,
    originalPrice: 2400,
    portal: 'b2c',
    category: 'fashion',
    vendor: "Sarah's Boutique",
    isNearMe: true,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&fit=crop',
    rating: 4.9,
    reviews: 87,
    description: 'উন্নত মানের ডেনিম ফেব্রিক, দীর্ঘস্থায়ী রঙ ও আরামদায়ক।'
  },
  {
    id: 'b2c_4',
    name: 'চিনিকুড়া সুগন্ধি পোলাও চাল (৫ কেজি)',
    price: 680,
    originalPrice: 750,
    portal: 'b2c',
    category: 'grocery',
    vendor: 'মদিনা রাইস এজেন্সি',
    isNearMe: true,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&fit=crop',
    rating: 4.9,
    reviews: 204,
    description: 'দিনাজপুরের খাঁটি চিনিকুড়া সুগন্ধি পোলাও চাল।'
  },
  {
    id: 'ws_1',
    name: 'মিনিকেট চাল ৫০ কেজি বস্তা (বাল্ক লট)',
    price: 3400,
    originalPrice: 3800,
    portal: 'wholesale',
    category: 'wholesale',
    vendor: 'মদিনা রাইস এজেন্সি',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&fit=crop',
    rating: 4.9,
    reviews: 184,
    description: 'কারওয়ান বাজার আড়ত থেকে সরাসরি পাইকারি সরবরাহ।'
  }
];

export const useProductStore = create<ProductState>((set, get) => ({
  products: DEFAULT_PRODUCTS,
  isLoading: false,
  error: null,

  fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, { params });
      if (Array.isArray(response.data) && response.data.length > 0) {
        const mappedProducts = response.data.map((p: any) => ({
          ...p,
          portal: p.isPKShop ? 'pk-shop' : (p.category === 'wholesale' ? 'wholesale' : 'b2c'),
          image: p.images?.[0] || 'https://via.placeholder.com/300',
          price: Number(p.price),
          originalPrice: Number(p.originalPrice),
          category: p.category,
          vendor: p.vendor,
          isNearMe: p.isNearMe
        }));
        set({ products: mappedProducts, isLoading: false });
      } else {
        // Keep default products if backend returns empty array
        set({ isLoading: false });
      }
    } catch (err: any) {
      // In dev fallback keep default products
      set({ error: null, isLoading: false });
    }
  },

  addProduct: async (productData) => {
    set({ isLoading: true });
    try {
      // In a real app, you might need an auth token here
      const response = await axios.post(`${API_BASE_URL}/products`, {
        ...productData,
        isPKShop: productData.portal === 'pk-shop',
        images: [productData.image],
        description: productData.description || productData.name,
      });
      
      const newProduct = {
        ...response.data,
        portal: response.data.isPKShop ? 'pk-shop' : 'b2c',
        image: response.data.images?.[0]
      };

      set((state) => ({ 
        products: [newProduct, ...state.products],
        isLoading: false 
      }));
    } catch (err) {
      set({ error: 'Failed to add product', isLoading: false });
      throw err;
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
