import { Review, CreateReviewDTO } from './types';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const reviewService = {
  async getReviewsByProduct(productId: string): Promise<Review[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews`, { params: { productId } });
      return response.data || [];
    } catch {
      return [
        {
          id: 'rev-1',
          productId,
          userId: 'user-1',
          userName: 'Rafiqul Islam',
          rating: 5,
          comment: 'খুব ভালো কোয়ালিটি এবং দ্রুত ডেলিভারি পেয়েছি।',
          createdAt: new Date().toISOString()
        }
      ];
    }
  },

  async getReviewsByShop(shopId: string): Promise<Review[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews`, { params: { shopId } });
      return response.data || [];
    } catch {
      return [
        {
          id: 'rev-shop-1',
          shopId,
          userId: 'user-2',
          userName: 'Salma Begum',
          rating: 5,
          comment: 'দারুণ সার্ভিস এবং বিক্রেতার ব্যবহার চমৎকার।',
          createdAt: new Date().toISOString()
        }
      ];
    }
  },

  async addReview(data: CreateReviewDTO): Promise<Review> {
    try {
      const response = await axios.post(`${API_BASE_URL}/reviews`, data);
      return response.data;
    } catch {
      return {
        id: `rev-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString()
      };
    }
  }
};
