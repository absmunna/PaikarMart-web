export type ProductCondition = 'new' | 'refurbished' | 'like_new' | 'open_box';
export type FulfillmentType = 'FBP' | 'FBM'; // FBP = Fulfilled by PaikarMart (Amazon FBA style), FBM = Fulfilled by Merchant

export interface MasterProduct {
  asin: string; // 10-char Unique Amazon-style Product Identifier, e.g. PM08N5WRWN
  upc?: string; // Standard Barcode / GTIN
  title: string;
  brand: string;
  category: string;
  portal?: 'wholesale' | 'retail' | 'digital' | 'pk-shop';
  description: string;
  bulletPoints: string[];
  specifications: Record<string, string>;
  images: string[];
  rating: number;
  reviewCount: number;
  totalSold: number;
  createdAt: string;
}

export interface SellerOffer {
  id: string; // Offer ID
  asin: string; // Reference to MasterProduct
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  positiveFeedbackPct: number;
  location: string;
  isVerified: boolean;
  sellerSku: string; // Seller's own private inventory SKU
  price: number;
  originalPrice?: number;
  condition: ProductCondition;
  stock: number;
  moq: number; // Minimum order quantity (B2B wholesale / B2C)
  fulfillmentType: FulfillmentType;
  shippingFee: number;
  estimatedDelivery: string; // e.g. "আগামীকাল (Tomorrow)" or "২-৩ দিন"
  isBuyBoxWinner?: boolean;
  score?: number; // Calculated Buy Box score
  updatedAt: string;
}

export interface BuyBoxResult {
  winner: SellerOffer;
  allOffers: SellerOffer[];
  lowestPrice: number;
  totalSellers: number;
}
