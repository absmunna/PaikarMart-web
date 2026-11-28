/**
 * Backend Master Catalog API (Postgres / Prisma).
 * Base: /api/v1/catalog  (axios baseURL usually already includes /api/v1)
 */
import { api } from '@/core/api';

export type CatalogMasterInput = {
  title: string;
  titleBn?: string;
  brand?: string;
  category: string;
  categoryId?: string;
  description?: string;
  canonicalImages?: string[];
  specifications?: Record<string, unknown>;
  barcode?: string;
  /** Optional pre-chosen PMIN; backend generates if omitted */
  pmin?: string;
};

export type CatalogOfferInput = {
  masterProductId?: string;
  pmin?: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  moq?: number;
  tradeMode?: 'retail' | 'wholesale';
  wholesaleTiers?: unknown;
  sellerPhotos?: string[];
  deliveryEta?: string;
  location?: string;
  condition?: string;
  fulfillmentType?: string;
  shippingFee?: number;
  isActive?: boolean;
};

export type CatalogMaster = {
  id: string;
  pmin: string;
  title: string;
  titleBn?: string | null;
  brand: string;
  category: string;
  description?: string | null;
  canonicalImages: string[];
  isVerified?: boolean;
};

export type CatalogOffer = {
  id: string;
  masterProductId: string;
  pmin: string;
  price: number;
  stock: number;
  moq: number;
  isBuyBoxWinner?: boolean;
  isActive?: boolean;
};

const ROOT = '/catalog';

export const catalogApi = {
  search(params?: { q?: string; category?: string; limit?: number }) {
    return api.get<{ ok: boolean; items: any[]; count: number }>(`${ROOT}/search`, { params });
  },

  getByPmin(pmin: string) {
    return api.get<{ ok: boolean; master: CatalogMaster; offers: any[]; buyBox: any }>(
      `${ROOT}/pmin/${encodeURIComponent(pmin)}`
    );
  },

  createMaster(body: CatalogMasterInput) {
    return api.post<{ ok: boolean; master: CatalogMaster }>(`${ROOT}/masters`, body);
  },

  upsertOffer(body: CatalogOfferInput) {
    return api.post<{ ok: boolean; offer: CatalogOffer; buyBoxWinnerId: string | null; master: Pick<CatalogMaster, 'id' | 'pmin' | 'title'> }>(
      `${ROOT}/offers`,
      body
    );
  },

  patchOffer(id: string, body: Partial<CatalogOfferInput>) {
    return api.patch<{ ok: boolean; offer: CatalogOffer; buyBoxWinnerId: string | null }>(
      `${ROOT}/offers/${id}`,
      body
    );
  },

  myOffers() {
    return api.get<{ ok: boolean; offers: any[] }>(`${ROOT}/my-offers`);
  },

  /**
   * Sell flow helper: create master (if needed) then attach seller offer.
   * Returns pmin + offer id for UI feedback.
   */
  async listNewProduct(input: {
    title: string;
    description?: string;
    category: string;
    brand?: string;
    image?: string;
    price: number;
    originalPrice?: number;
    stock: number;
    moq?: number;
    tradeMode?: 'retail' | 'wholesale';
  }) {
    const images = input.image ? [input.image] : [];
    const masterRes = await catalogApi.createMaster({
      title: input.title,
      description: input.description,
      category: input.category,
      brand: input.brand || 'Generic',
      canonicalImages: images,
    });
    const master = masterRes.master;
    const offerRes = await catalogApi.upsertOffer({
      masterProductId: master.id,
      pmin: master.pmin,
      price: input.price,
      originalPrice: input.originalPrice,
      stock: input.stock,
      moq: input.moq ?? 1,
      tradeMode: input.tradeMode ?? 'retail',
      sellerPhotos: images,
      condition: 'New',
      isActive: true,
    });
    return {
      master,
      offer: offerRes.offer,
      pmin: master.pmin,
      buyBoxWinnerId: offerRes.buyBoxWinnerId,
    };
  },
};

export default catalogApi;
