import axios from 'axios';
import { UserProfile, SellerStore, ProfileProduct } from '../types';
import { API_BASE_URL } from '@/core/config/api';

export const profileApi = {
  /**
   * Fetches authenticated user cockpit data
   */
  getMe: async (): Promise<UserProfile> => {
    const response = await axios.get(`${API_BASE_URL}/profile/me`);
    return response.data;
  },

  /**
   * Fetches public seller storefront data, stats, and posts
   */
  getStoreBySlug: async (slug: string): Promise<{ store: SellerStore; products: ProfileProduct[]; posts: any[] }> => {
    const response = await axios.get(`${API_BASE_URL}/stores/${slug}`);
    return response.data;
  },

  /**
   * Product/Post publishing controller with multi-media payload
   */
  createProduct: async (productData: any): Promise<ProfileProduct> => {
    const response = await axios.post(`${API_BASE_URL}/stores/products`, productData);
    return response.data;
  },

  /**
   * Toggle store follow status
   */
  followStore: async (storeId: string): Promise<{ isFollowing: boolean }> => {
    const response = await axios.post(`${API_BASE_URL}/stores/${storeId}/follow`);
    return response.data;
  }
};
