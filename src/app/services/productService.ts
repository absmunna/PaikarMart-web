import axios from 'axios';

export interface ProductDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category?: { id: string; name: string };
  type: 'retail' | 'wholesale' | 'factory_direct' | 'service' | 'digital_service';
  stock: number;
  variants?: { id: string; name: string; options: string[] }[];
  wholesaleTiers?: { minQty: number; price: number }[];
  viralityScore?: number;
  isPromoted?: boolean;
}

export interface SellerProfile {
  id: string;
  name: string;
  avatar?: string;
  isVerified: boolean;
  isTopRated: boolean;
  responseRate: string;
  followersCount: number;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerifiedBuyer: boolean;
}

export interface QuestionAnswer {
  id: string;
  userName: string;
  question: string;
  answer?: string;
  createdAt: string;
  answeredAt?: string;
}

export const productService = {
  getProductDetails: async (id: string): Promise<ProductDetails> => {
    try {
      const response = await axios.get(`/api/v1/products/${id}`);
      return response.data;
    } catch {
      // Robust development fallback data
      return {
        id,
        title: "Premium Handloom Jamdani Saree - Exclusive Royal Red (update-v01)",
        description: "An exceptional work of handcrafted Jamdani weave from Narayanganj, Bangladesh. Built with 84-count premium cotton and pure silk blend threadwork. Perfect for high-end celebrations and authentic heritage display.",
        price: 8500,
        originalPrice: 12000,
        images: [
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600",
          "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600"
        ],
        type: 'retail',
        stock: 14,
        category: { id: "cat_handloom", name: "Traditional Handloom" },
        variants: [
          { id: "color", name: "Color Theme", options: ["Royal Red", "Heritage Black", "Golden Zari"] },
          { id: "length", name: "Saree Length", options: ["12 Cubits (Standard)", "14 Cubits (Premium)"] }
        ],
        wholesaleTiers: [
          { minQty: 5, price: 7800 },
          { minQty: 20, price: 7200 },
          { minQty: 50, price: 6500 }
        ],
        viralityScore: 9.8,
        isPromoted: true
      };
    }
  },

  getSellerProfile: async (productId: string): Promise<SellerProfile> => {
    try {
      const response = await axios.get(`/api/v1/products/${productId}/seller`);
      return response.data;
    } catch {
      return {
        id: "sel_royal_weaves",
        name: "Royal Dhaka Weavers Ltd.",
        isVerified: true,
        isTopRated: true,
        responseRate: "99%",
        followersCount: 14850
      };
    }
  },

  getReviews: async (productId: string): Promise<Review[]> => {
    try {
      const response = await axios.get(`/api/v1/products/${productId}/reviews`);
      return response.data;
    } catch {
      return [
        {
          id: "r1",
          userName: "Anika Rahman",
          rating: 5,
          comment: "The thread work is incredibly fine! Authentic Jamdani at a reasonable price. Perfect delivery packing as well.",
          createdAt: "2026-05-15",
          isVerifiedBuyer: true
        },
        {
          id: "r2",
          userName: "Sajid Hasan",
          rating: 4,
          comment: "Gave this as a wedding gift. Elegantly designed and verified. Recommended seller.",
          createdAt: "2026-05-10",
          isVerifiedBuyer: true
        }
      ];
    }
  },

  getQuestionsAnswers: async (productId: string): Promise<QuestionAnswer[]> => {
    try {
      const response = await axios.get(`/api/v1/products/${productId}/qna`);
      return response.data;
    } catch {
      return [
        {
          id: "q1",
          userName: "Fariha Chowdhury",
          question: "Is dry cleaning mandatory for this specific saree?",
          answer: "Yes, to retain the pure silk zari thread luster, we highly recommend professional dry cleaning only.",
          createdAt: "2026-05-20",
          answeredAt: "2026-05-21"
        },
        {
          id: "q2",
          userName: "Niaz Morshed",
          question: "Can I get customized box wrapping for overseas gifting?",
          answer: "Yes! While checking out, please select premium packaging option or message us directly.",
          createdAt: "2026-05-18",
          answeredAt: "2026-05-19"
        }
      ];
    }
  },

  submitQuestion: async (productId: string, question: string): Promise<any> => {
    const response = await axios.post(`/api/v1/products/${productId}/questions`, { question });
    return response.data;
  }
};
