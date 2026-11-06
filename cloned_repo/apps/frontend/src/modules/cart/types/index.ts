export type SellerTier = 'factory' | 'wholesaler' | 'local_shop';
export type CommerceDomain = 'retail' | 'b2b' | 'food' | 'pharmacy' | 'digital' | 'service' | 'social';

export interface CartItem {
  id: string;
  sourceId?: string; 
  domain: CommerceDomain;
  portal?: 'pk-shop' | 'b2c' | 'b2b' | 'service' | 'logistics' | 'nearby' | 'digital';
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  vendorId: string;
  vendorName: string;
  variantInfo?: string;
  moq?: number;
  stock?: number;
  sellerId: string;
  sellerTier?: SellerTier;
  coinCashback?: number;
  tieredPricing?: {
    minQty: number;
    price: number;
  }[];
  metadata?: Record<string, any>;
  distanceKm?: number;
  deliveryFee?: number;
  estimatedDeliveryTime?: string;
}

export interface OrderPayload {
  items: CartItem[];
  shippingAddressId: string;
  paymentMethod: 'wallet' | 'bkash' | 'nagad' | 'rocket' | 'bank_transfer' | 'cod';
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
}
