export type PortalDomain = 'RETAIL' | 'WHOLESALE' | 'NEARBY' | 'DIGITAL' | 'SERVICE' | 'LOGISTICS' | 'RFQ' | 'WALLET' | 'ORDERS' | 'FEED';

export interface PortalCategory {
  id: string;
  nameEn: string;
  nameBn: string;
  slug: string;
  iconName: string;
  color: string;
  domain: PortalDomain;
  route: string;
  status: 'active' | 'upcoming' | 'maintenance';
}

export interface PortalProduct {
  id: string;
  title: string;
  titleBn: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  portalType: PortalDomain;
  category: string;
  rating: number;
  reviews: number;
  stock: number;

  // Wholesale specific
  moq?: number;
  tieredPricing?: Array<{
    minUnits: number;
    maxUnits?: number;
    unitPrice: number;
  }>;

  // Nearby specific
  storeId?: string;
  storeName?: string;
  distanceKm?: number;
  isOpen?: boolean;
  estimatedDeliveryMinutes?: number;

  // Digital specific
  isInstantDelivery?: boolean;

  // Service specific
  isServiceProvider?: boolean;
}

export interface RFQSubmission {
  userId: string;
  productId?: string;
  productName: string;
  quantity: number;
  targetPrice?: number;
  description: string;
  deadline?: string;
  contactPhone: string;
}

export interface NearbyStore {
  id: string;
  name: string;
  nameBn: string;
  type: 'food' | 'grocery' | 'pharmacy' | 'other';
  latitude: number;
  longitude: number;
  address: string;
  rating: number;
  isOpen: boolean;
  estimatedDeliveryMinutes: number;
  distanceKm?: number;
}
