export interface Product {
  id: string;
  title?: string;
  name?: string;
  nameBn?: string;
  price: number;
  oldPrice?: number;
  compareAtPrice?: number;
  image?: string;
  images?: string[];
  sellerId?: string;
  seller?: string;
  vendorId?: string;
  vendorName?: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  categoryId?: string;
  categoryName?: string;
  description?: string;
  isFlashSale?: boolean;
  isNewArrival?: boolean;
  isWholesale?: boolean;
  isTrending?: boolean;
  isVerified?: boolean;
  location?: string;
  portal?: 'pk-shop' | 'b2c' | 'wholesale' | 'b2b' | 'retail';
  coinCashback?: number;
  brand?: string;
  stock?: number;
  metadata?: Record<string, any>;
}

export interface SellerProductOffer {
  id: string;
  masterProductId: string;
  asin: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerReviewCount: number;
  sellerLocation: string;
  sellerVerified: boolean;
  sellerSku: string;
  condition: "New" | "Refurbished" | "Open Box" | "Wholesale Lot";
  price: number;
  originalPrice?: number;
  stock: number;
  minOrderQty: number;
  fulfillmentType: "paikar_express" | "seller_fulfilled";
  shippingFee: number;
  freeShippingAbove?: number;
  dispatchTimeDays: number;
  warranty?: string;
  isBuyBoxWinner: boolean;
  isActive: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface MasterProductCatalog {
  id: string;
  asin: string;
  upcOrEan?: string;
  title: string;
  brand: string;
  categoryId: string;
  description: string;
  specifications: Record<string, string>;
  canonicalImages: string[];
  defaultMoq: number;
  isPKStore?: boolean;
  totalSellers?: number;
  activeSellers?: number;
  buyBoxWinner?: SellerProductOffer | null;
  priceRange?: { min: number; max: number } | null;
  createdAt: string;
}
