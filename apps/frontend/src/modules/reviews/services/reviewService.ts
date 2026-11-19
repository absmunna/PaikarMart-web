import { Review } from '../types';

// Standard storage key
const REVIEWS_STORAGE_KEY = 'pm-reviews-local';

const defaultReviews: Review[] = [
  {
    id: 'rev-1',
    productId: '1',
    shopId: 'demo-seller-1',
    userId: 'user-demo-1',
    userName: 'মোহাম্মদ করিম (Md. Karim)',
    rating: 5,
    comment: 'অসাধারণ কোয়ালিটি! কাপড়ের সুতা ও স্টিচিং খুব মজবুত। সময়মতো ডেলিভারি পেয়েছি। ধন্যবাদ পাইকারমার্ট।',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    isVerifiedBuyer: true,
    helpfulCount: 14,
    recommended: true,
    tags: ['১০০% খাঁটি পণ্য', 'দ্রুত ডেলিভারি', 'উন্নত মানের ফেব্রিক'],
  },
  {
    id: 'rev-2',
    productId: '1',
    shopId: 'demo-seller-1',
    userId: 'user-demo-2',
    userName: 'সুলতানা বেগম (Sultana Begum)',
    rating: 5,
    comment: 'পাইকারি রেটে এত সুন্দর ফিনিশিং সত্যি প্রশংসনীয়। পরবর্তীতে আরও ৫০ পিস বাল্ক অর্ডার করব।',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isVerifiedBuyer: true,
    helpfulCount: 9,
    recommended: true,
    tags: ['দাম অনুযায়ী সেরা', 'সেলার খুব দায়িত্বশীল'],
  },
  {
    id: 'rev-3',
    productId: '1',
    shopId: 'demo-seller-1',
    userId: 'user-demo-3',
    userName: 'রাশেদ খান (Rashed Khan)',
    rating: 4,
    comment: 'ভালো মানের প্রোডাক্ট, কালার একদম ছবির মতোই এসেছে। তবে প্যাকেজিং আরেকটু প্রিমিয়াম করা যেত।',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    isVerifiedBuyer: true,
    helpfulCount: 5,
    recommended: true,
    tags: ['মানসম্মত প্যাকেজিং'],
  }
];

export const reviewService = {
  getAllReviews(): Review[] {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (!saved) {
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(defaultReviews));
        return defaultReviews;
      }
      return JSON.parse(saved);
    } catch {
      return defaultReviews;
    }
  },

  async getReviewsByProduct(productId: string): Promise<Review[]> {
    const all = this.getAllReviews();
    const productReviews = all.filter(r => r.productId === productId || r.productId === String(productId));
    
    // If no reviews yet for this specific product, provide realistic sample reviews tied to this product
    if (productReviews.length === 0) {
      const seeded: Review[] = [
        {
          id: `rev-${productId}-1`,
          productId,
          shopId: 'store-1',
          userName: 'তানভীর আহমেদ (Tanvir Ahmed)',
          rating: 5,
          comment: 'পণ্যটি হাতে পাওয়ার পর দেখলাম বিবরণীর সাথে শতভাগ মিল রয়েছে। ফেব্রিক ও ফিনিশিং প্রিমিয়াম।',
          createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
          isVerifiedBuyer: true,
          helpfulCount: 8,
          recommended: true,
          tags: ['১০০% খাঁটি পণ্য', 'দ্রুত ডেলিভারি']
        },
        {
          id: `rev-${productId}-2`,
          productId,
          shopId: 'store-1',
          userName: 'নাসরিন আক্তার (Nasrin Akter)',
          rating: 4,
          comment: 'দারুণ সার্ভিস ও নির্ভরযোগ্য সেলার। খুব দ্রুত ঢাকা সিটিতে ডেলিভারি পেয়েছি। সুপারিশ করছি।',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          isVerifiedBuyer: true,
          helpfulCount: 4,
          recommended: true,
          tags: ['দাম অনুযায়ী সেরা']
        }
      ];
      // Save seeded so user can add to it
      const updated = [...all, ...seeded];
      try {
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return seeded;
    }

    return productReviews;
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
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
      isVerifiedBuyer: true
    };
    const updated = [newReview, ...all];
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return newReview;
  },

  async markHelpful(reviewId: string): Promise<number> {
    const all = this.getAllReviews();
    let updatedCount = 0;
    const updated = all.map(r => {
      if (r.id === reviewId) {
        const current = r.helpfulCount || 0;
        updatedCount = current + 1;
        return { ...r, helpfulCount: updatedCount };
      }
      return r;
    });
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return updatedCount;
  }
};

