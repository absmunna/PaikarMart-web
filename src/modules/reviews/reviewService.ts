import { Review } from './types';

// Standard storage key
const REVIEWS_STORAGE_KEY = 'pm-reviews-local';

const defaultReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-demo-1',
    shopId: 'demo-seller-1',
    userId: 'user-demo-1',
    userName: 'Md. Karim',
    rating: 5,
    comment: 'অসাধারণ কোয়ালিটি! সময়মতো ডেলিভারি পেয়েছি। ধন্যবাদ পাইকারমার্ট।',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rev-2',
    productId: 'prod-demo-2',
    shopId: 'demo-seller-1',
    userId: 'user-demo-2',
    userName: 'Sultana Begum',
    rating: 4,
    comment: 'ভালো প্রোডাক্ট, তবে প্যাকেজিং আরেকটু উন্নত করা যেত।',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const reviewService = {
  getAllReviews(): Review[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(defaultReviews));
      return defaultReviews;
    }
    return JSON.parse(saved);
  },

  async getReviewsByProduct(productId: string): Promise<Review[]> {
    const all = this.getAllReviews();
    return all.filter(r => r.productId === productId);
  },

  async getReviewsByShop(shopId: string): Promise<Review[]> {
    const all = this.getAllReviews();
    return all.filter(r => r.shopId === shopId);
  },

  async addReview(params: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const all = this.getAllReviews();
    const newReview: Review = {
      ...params,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newReview, ...all];
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    return newReview;
  }
};
