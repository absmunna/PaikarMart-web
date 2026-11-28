import { create } from 'zustand';
import { MasterProduct, SellerOffer, BuyBoxResult } from '../types/catalog.types';
import { calculateBuyBox } from '../services/asinGenerator';
import { catalogApi } from '../services/catalogApi';

interface CatalogState {
  masterProducts: Record<string, MasterProduct>;
  offersByAsin: Record<string, SellerOffer[]>;

  getMasterProduct: (idOrAsin: string) => MasterProduct | null;
  getBuyBox: (asin: string) => BuyBoxResult | null;
  getOffers: (asin: string) => SellerOffer[];

  linkSellerOffer: (offer: Omit<SellerOffer, 'id' | 'updatedAt'>) => void;
  updateSellerOffer: (offerId: string, updates: Partial<SellerOffer>) => void;
  removeSellerOffer: (offerId: string) => void;

  /** Backend-first hydrate for product detail Buy-Box */
  hydrateFromApi: (pminOrAsin: string) => Promise<boolean>;
}

const INITIAL_ASIN_MAP: Record<string, MasterProduct> = {
  PM8N5WRW01: {
    asin: 'PM8N5WRW01',
    upc: '8901234567890',
    title: 'প্রিমিয়াম রিং-স্পান সুতি ক্রুনেক টি-শার্ট (১৮০ জিএসএম)',
    brand: 'Paikar Basics',
    category: 'fashion',
    portal: 'wholesale',
    description:
      '১০০% কম্বড কটন, অ্যান্টি-পিলিং ওয়াশ, আরামদায়ক সেলাই এবং কালার গ্যারান্টি। পাইকারি রি-ব্র্যান্ডিং এবং রিটেইল বিক্রয়ের জন্য আদর্শ।',
    bulletPoints: [
      '১৮০ জিএসএম কম্বড সুতি কাপড়',
      'অরিজিনাল ডাবল স্টিচ কলার ও হেম',
      'প্রতিক্রিয়াশীল রঞ্জনবিদ্যা (Reactive Dye) - রং উঠবে না',
      'স্মার্ট রেগুলার ফিট সাইজ ৩৮ থেকে ৪৬',
    ],
    specifications: {
      ফ্যাব্রিক: '100% Combed Ringspun Cotton',
      জিএসএম: '180 GSM',
      উৎপাদনস্থল: 'নারায়ণগঞ্জ নিট কম্পোজিট, বাংলাদেশ',
      প্যাকিং: '১০ পিস মাস্টার পলি প্যাক',
    },
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
    ],
    rating: 4.8,
    reviewCount: 168,
    totalSold: 4210,
    createdAt: '2026-01-15',
  },
};

const INITIAL_OFFERS: Record<string, SellerOffer[]> = {
  PM8N5WRW01: [
    {
      id: 'offer-1',
      asin: 'PM8N5WRW01',
      sellerId: 'seller-rahim',
      sellerName: 'রহিম নিট কম্পোজিট (ফ্যাক্টরি ডিরেক্ট)',
      sellerRating: 4.9,
      positiveFeedbackPct: 98,
      location: 'নারায়ণগঞ্জ বিসিক হাব',
      isVerified: true,
      sellerSku: 'RNC-COTTON-180-BLK',
      price: 340,
      originalPrice: 450,
      condition: 'new',
      stock: 450,
      moq: 20,
      fulfillmentType: 'FBP',
      shippingFee: 0,
      estimatedDelivery: 'আগামীকাল (Tomorrow Express)',
      updatedAt: '2026-10-06',
    },
    {
      id: 'offer-2',
      asin: 'PM8N5WRW01',
      sellerId: 'seller-chawkbazar',
      sellerName: 'আল-মদিনা ক্লথ স্টোর',
      sellerRating: 4.7,
      positiveFeedbackPct: 94,
      location: 'চকবাজার পাইকারি মার্কেট, ঢাকা',
      isVerified: true,
      sellerSku: 'AM-TSHIRT-180-PREM',
      price: 355,
      originalPrice: 460,
      condition: 'new',
      stock: 120,
      moq: 10,
      fulfillmentType: 'FBM',
      shippingFee: 60,
      estimatedDelivery: '২-৩ কার্যদিবস',
      updatedAt: '2026-10-05',
    },
    {
      id: 'offer-3',
      asin: 'PM8N5WRW01',
      sellerId: 'seller-savar',
      sellerName: 'সাভার অ্যাপারেলস এক্সপোর্ট হাব',
      sellerRating: 4.8,
      positiveFeedbackPct: 96,
      location: 'সাভার ইপিজেড রোড, ঢাকা',
      isVerified: true,
      sellerSku: 'SAV-EXP-CREW-01',
      price: 330,
      originalPrice: 440,
      condition: 'new',
      stock: 15,
      moq: 50,
      fulfillmentType: 'FBM',
      shippingFee: 120,
      estimatedDelivery: '৩-৪ কার্যদিবস',
      updatedAt: '2026-10-06',
    },
  ],
};

function mapApiOfferToSellerOffer(o: any, pmin: string): SellerOffer {
  const ft = String(o.fulfillmentType || '').toLowerCase();
  const fulfillmentType = ft.includes('paikar') || ft === 'fbp' ? 'FBP' : 'FBM';
  const condRaw = String(o.condition || 'new').toLowerCase();
  const condition =
    condRaw.includes('refurb')
      ? 'refurbished'
      : condRaw.includes('open')
        ? 'open_box'
        : condRaw.includes('like')
          ? 'like_new'
          : 'new';

  return {
    id: o.id,
    asin: pmin,
    sellerId: o.seller?.id || o.sellerId || 'unknown',
    sellerName:
      o.vendor?.shopName ||
      o.seller?.fullName ||
      o.seller?.name ||
      o.seller?.handle ||
      'Seller',
    sellerRating: 4.5,
    positiveFeedbackPct: 95,
    location: o.location || o.vendor?.location || 'Bangladesh',
    isVerified: Boolean(o.vendor?.isVerified),
    sellerSku: o.id?.slice(0, 12) || 'SKU',
    price: Number(o.price) || 0,
    originalPrice: o.originalPrice != null ? Number(o.originalPrice) : undefined,
    condition: condition as SellerOffer['condition'],
    stock: Number(o.stock) || 0,
    moq: Number(o.moq) || 1,
    fulfillmentType,
    shippingFee: Number(o.shippingFee) || 0,
    estimatedDelivery: o.deliveryEta || '২-৪ কার্যদিবস',
    isBuyBoxWinner: Boolean(o.isBuyBoxWinner),
    updatedAt: new Date().toISOString(),
  };
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  masterProducts: INITIAL_ASIN_MAP,
  offersByAsin: INITIAL_OFFERS,

  getMasterProduct: (idOrAsin: string) => {
    const state = get();
    if (state.masterProducts[idOrAsin]) return state.masterProducts[idOrAsin];
    return null;
  },

  getBuyBox: (asin: string) => {
    const offers = get().offersByAsin[asin] || [];
    return calculateBuyBox(offers);
  },

  getOffers: (asin: string) => get().offersByAsin[asin] || [],

  linkSellerOffer: (newOffer) => {
    set((state) => {
      const offerId = `offer-${Date.now()}`;
      const offer: SellerOffer = {
        ...newOffer,
        id: offerId,
        updatedAt: new Date().toISOString(),
      };
      const existing = state.offersByAsin[newOffer.asin] || [];
      return {
        offersByAsin: {
          ...state.offersByAsin,
          [newOffer.asin]: [...existing, offer],
        },
      };
    });
  },

  updateSellerOffer: (offerId, updates) => {
    set((state) => {
      const updatedMap: Record<string, SellerOffer[]> = {};
      for (const [asin, offers] of Object.entries(state.offersByAsin)) {
        updatedMap[asin] = offers.map((o) =>
          o.id === offerId ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o
        );
      }
      return { offersByAsin: updatedMap };
    });
  },

  removeSellerOffer: (offerId) => {
    set((state) => {
      const updatedMap: Record<string, SellerOffer[]> = {};
      for (const [asin, offers] of Object.entries(state.offersByAsin)) {
        updatedMap[asin] = offers.filter((o) => o.id !== offerId);
      }
      return { offersByAsin: updatedMap };
    });
  },

  hydrateFromApi: async (pminOrAsin: string) => {
    const key = pminOrAsin.trim();
    if (!key) return false;
    try {
      const res = await catalogApi.getByPmin(key);
      if (!res?.ok || !res.master) return false;

      const pmin = res.master.pmin || key.toUpperCase();
      const images = Array.isArray(res.master.canonicalImages)
        ? res.master.canonicalImages
        : [];

      const master: MasterProduct = {
        asin: pmin,
        title: res.master.title,
        brand: res.master.brand || 'Generic',
        category: res.master.category || 'General',
        description: res.master.description || '',
        bulletPoints: [],
        specifications:
          res.master.specifications && typeof res.master.specifications === 'object'
            ? (res.master.specifications as Record<string, string>)
            : {},
        images,
        rating: 0,
        reviewCount: 0,
        totalSold: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      const offers = (res.offers || []).map((o: any) => mapApiOfferToSellerOffer(o, pmin));

      set((state) => ({
        masterProducts: { ...state.masterProducts, [pmin]: master },
        offersByAsin: { ...state.offersByAsin, [pmin]: offers },
      }));
      return true;
    } catch (err) {
      console.warn('[catalogStore] hydrateFromApi failed, using local data:', err);
      return false;
    }
  },
}));
