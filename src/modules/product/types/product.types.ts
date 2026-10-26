export interface Product {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  sellerId: string;
  rating: number;
  reviewCount: number;
  category: string;
  description: string;
  isFlashSale?: boolean;
  isNewArrival?: boolean;
  isWholesale?: boolean;
  location?: string;
  portal?: 'pk-shop' | 'b2c' | 'wholesale' | 'b2b';
  coinCashback?: number;
}
