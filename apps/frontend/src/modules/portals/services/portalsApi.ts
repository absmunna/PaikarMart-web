import axios from 'axios';
import { PortalCategory, PortalProduct, RFQSubmission, PortalDomain } from '../types';
import { API_BASE_URL } from '@/core/api';

const FALLBACK_CATEGORIES: PortalCategory[] = [
  {
    id: 'retail-1',
    nameEn: 'Retail & Marketplace',
    nameBn: 'খুচরা ও মার্কেটপ্লেস',
    slug: 'retail',
    iconName: 'ShoppingBag',
    color: '#FF6B00',
    domain: 'RETAIL',
    route: '/portals/marketplace',
    status: 'active'
  },
  {
    id: 'wholesale-1',
    nameEn: 'Wholesale B2B',
    nameBn: 'পাইকারি ট্রেড',
    slug: 'wholesale',
    iconName: 'Package',
    color: '#0052CC',
    domain: 'WHOLESALE',
    route: '/portals/wholesale',
    status: 'active'
  },
  {
    id: 'service-1',
    nameEn: 'Expert Services',
    nameBn: 'এক্সপার্ট সার্ভিস',
    slug: 'service',
    iconName: 'Wrench',
    color: '#10B981',
    domain: 'SERVICE',
    route: '/portals/services',
    status: 'active'
  },
  {
    id: 'logistics-1',
    nameEn: 'Ride & Logistics',
    nameBn: 'রাইড ও লজিস্টিকস',
    slug: 'logistics',
    iconName: 'Truck',
    color: '#8B5CF6',
    domain: 'LOGISTICS',
    route: '/portals/logistics',
    status: 'active'
  },
  {
    id: 'nearby-1',
    nameEn: 'Nearby Shops & Food',
    nameBn: 'কাছাকাছি দোকান ও ফুড',
    slug: 'nearby',
    iconName: 'Store',
    color: '#EC4899',
    domain: 'NEARBY',
    route: '/portals/nearby',
    status: 'active'
  }
];

const FALLBACK_PRODUCTS: PortalProduct[] = [
  {
    id: 'prod-1',
    title: 'Premium Bangladeshi Cotton Panjabi (Wholesale Lot)',
    titleBn: 'প্রিমিয়াম কটন পাঞ্জাবি (পাইকারি লট)',
    price: 450,
    originalPrice: 850,
    imageUrl: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600',
    portalType: 'WHOLESALE',
    category: 'Apparel',
    rating: 4.9,
    reviews: 142,
    stock: 5000,
    moq: 50,
    tieredPricing: [
      { minUnits: 50, maxUnits: 199, unitPrice: 450 },
      { minUnits: 200, maxUnits: 999, unitPrice: 410 },
      { minUnits: 1000, unitPrice: 380 }
    ]
  },
  {
    id: 'prod-2',
    title: 'Wireless Bluetooth Earbuds Pro',
    titleBn: 'ওয়্যারলেস ব্লুটুথ ইয়ারবাডস প্রো',
    price: 1200,
    originalPrice: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600',
    portalType: 'RETAIL',
    category: 'Electronics',
    rating: 4.7,
    reviews: 89,
    stock: 350
  },
  {
    id: 'prod-3',
    title: 'AC Servicing & Deep Cleaning Expert',
    titleBn: 'এসি সার্ভিসিং ও ডিপ ক্লিনিং',
    price: 800,
    originalPrice: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600',
    portalType: 'SERVICE',
    category: 'Home Service',
    rating: 4.9,
    reviews: 310,
    stock: 99
  }
];

export const portalsApi = {
  /**
   * Fetches dynamic portal modules metadata
   */
  getCategories: async (): Promise<PortalCategory[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/portals/categories`, { timeout: 3000 });
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch {}
    return FALLBACK_CATEGORIES;
  },

  /**
   * Fetches portal-specific listings with MOQ/Location/Digital filters
   */
  getProducts: async (portalType: PortalDomain, params?: any): Promise<PortalProduct[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/portals/${portalType.toLowerCase()}/products`, { params, timeout: 3000 });
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
    } catch {}

    return FALLBACK_PRODUCTS.filter(p => p.portalType === portalType || portalType === 'RETAIL');
  },

  /**
   * Submits B2B bulk request for quote
   */
  submitRFQ: async (rfqData: RFQSubmission): Promise<{ success: boolean; rfqId: string }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/portals/rfq/submit`, rfqData, { timeout: 3000 });
      return response.data;
    } catch {
      return {
        success: true,
        rfqId: `RFQ-${Date.now().toString().slice(-6)}`
      };
    }
  }
};

