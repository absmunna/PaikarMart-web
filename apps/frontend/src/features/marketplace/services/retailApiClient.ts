export interface RetailVoucher {
  code: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  discountType: 'percent' | 'flat' | 'free_shipping';
  discountValue: number;
  maxDiscountBdt?: number;
  minSpendBdt: number;
  eligibleCategory?: string;
  expiresAt: string;
  isActive: boolean;
}

export interface VoucherValidationResult {
  valid: boolean;
  code: string;
  discountBdt: number;
  freeShipping: boolean;
  message: string;
  voucher?: RetailVoucher;
}

export interface ProductReviewItem {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  sellerReply?: string;
  createdAt: string;
}

export interface ProductQuestionItem {
  id: string;
  productId: string;
  authorId: string;
  authorName: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
  createdAt: string;
}

export interface ProductEngagementResponse {
  success: boolean;
  productId: string;
  reviews: ProductReviewItem[];
  qna: ProductQuestionItem[];
  stats: {
    averageRating: number;
    totalReviews: number;
    verifiedCount: number;
    breakdown: Record<1 | 2 | 3 | 4 | 5, number>;
  };
}

export interface PrescriptionSubmissionPayload {
  orderType: 'pharmacy_rx' | 'grocery_list';
  customerId: string;
  customerName: string;
  contactPhone: string;
  deliveryAddress: string;
  notes: string;
  fileName?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  previewDataUrl?: string;
}

export interface PrescriptionRecord {
  id: string;
  orderId: string;
  orderType: 'pharmacy_rx' | 'grocery_list';
  status: string;
  createdAt: string;
}

const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL as string) || '';

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    ...init,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errMsg = data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(errMsg);
  }
  return data as T;
}

export const retailApiClient = {
  async fetchDeals(): Promise<RetailVoucher[]> {
    try {
      const data = await requestJson<{ success: boolean; vouchers: RetailVoucher[] }>('/api/retail/deals');
      return Array.isArray(data.vouchers) ? data.vouchers : [];
    } catch {
      return [];
    }
  },

  async validateVoucher(
    code: string,
    subtotal: number,
    categories: string[] = []
  ): Promise<VoucherValidationResult> {
    try {
      return await requestJson<VoucherValidationResult>('/api/retail/vouchers/validate', {
        method: 'POST',
        body: JSON.stringify({ code, subtotal, categories }),
      });
    } catch (err: any) {
      return {
        valid: false,
        code: code.trim().toUpperCase(),
        discountBdt: 0,
        freeShipping: false,
        message: err?.message || 'Unable to validate voucher right now.',
      };
    }
  },

  async rankBuyBoxOffers<T extends Record<string, any>>(
    offers: T[]
  ): Promise<{ buyBoxWinnerId: string | null; rankedOffers: Array<T & { landedPrice: number; buyBoxScore: number; isBuyBoxWinner: boolean }> }> {
    try {
      const data = await requestJson<{
        success: boolean;
        buyBoxWinnerId: string | null;
        rankedOffers: Array<T & { landedPrice: number; buyBoxScore: number; isBuyBoxWinner: boolean }>;
      }>('/api/retail/buybox/rank', {
        method: 'POST',
        body: JSON.stringify({ offers }),
      });
      return {
        buyBoxWinnerId: data.buyBoxWinnerId,
        rankedOffers: data.rankedOffers,
      };
    } catch {
      const fallback = offers
        .map((o, idx) => ({
          ...o,
          landedPrice: Number(o.price || 0) + (o.deliveryEta?.includes('Same Day') ? 0 : 60),
          buyBoxScore: 100 - idx,
          isBuyBoxWinner: idx === 0,
        }));
      return {
        buyBoxWinnerId: fallback[0]?.id || null,
        rankedOffers: fallback,
      };
    }
  },

  async fetchProductEngagement(productId: string): Promise<ProductEngagementResponse | null> {
    try {
      return await requestJson<ProductEngagementResponse>(
        `/api/retail/products/${encodeURIComponent(productId)}/engagement`
      );
    } catch {
      return null;
    }
  },

  async submitProductReview(
    productId: string,
    payload: { userId: string; userName: string; rating: number; comment: string }
  ): Promise<ProductEngagementResponse> {
    return await requestJson<ProductEngagementResponse>(
      `/api/retail/products/${encodeURIComponent(productId)}/reviews`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  },

  async submitProductQuestion(
    productId: string,
    payload: { authorId: string; authorName: string; question: string }
  ): Promise<{ success: boolean; question: ProductQuestionItem }> {
    return await requestJson<{ success: boolean; question: ProductQuestionItem }>(
      `/api/retail/products/${encodeURIComponent(productId)}/qna`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  },

  async submitPrescriptionOrder(
    payload: PrescriptionSubmissionPayload
  ): Promise<{ success: boolean; prescription: PrescriptionRecord; orderId: string }> {
    return await requestJson<{ success: boolean; prescription: PrescriptionRecord; orderId: string }>(
      '/api/retail/prescriptions',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  },

  async createServerOrder(payload: Record<string, any>): Promise<{ success: boolean; order: any; shipment?: any }> {
    return await requestJson<{ success: boolean; order: any; shipment?: any }>('/api/orders', {
      method: 'POST',
      headers: payload.idempotencyKey
        ? { 'X-Idempotency-Key': String(payload.idempotencyKey) }
        : undefined,
      body: JSON.stringify(payload),
    });
  },
};
import { auth } from '@/lib/firebase';

