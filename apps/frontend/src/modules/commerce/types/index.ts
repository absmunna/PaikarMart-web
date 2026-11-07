export type CommerceDomain = 'retail' | 'b2b' | 'food' | 'pharmacy' | 'digital' | 'service';

export interface CommerceItem {
  id: string;
  sourceId: string; // The original product ID
  domain: CommerceDomain;
  name: string;
  price: number;
  image: string;
  quantity: number;
  metadata?: Record<string, any>;
}

export interface CartState {
  items: CommerceItem[];
  totalAmount: number;
  totalItems: number;
}
