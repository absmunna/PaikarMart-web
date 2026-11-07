export type PKShopRole = 'SUPER_ADMIN' | 'STORE_MANAGER' | 'MODERATOR' | 'BUYER' | 'GUEST';

export interface PKShopProduct {
  id: string;
  sku: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category: string;
  images: string[];
  isVerified: boolean;
  portal: string;
  coinCashbackPercent: number;
  shippingOption: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  createdAt: string;
  updatedAt?: string;
}

export interface PKShopOrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface PKShopOrder {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  deliveryAddress: string;
  geoCoordinates?: { lat: number; lng: number };
  items: PKShopOrderItem[];
  totalAmount: number;
  paymentMethod: 'bkash' | 'nagad' | 'cod' | 'wallet';
  paymentStatus: 'PAID' | 'UNPAID' | 'ESCROW_HELD';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  sellerType: 'PK_SHOP_OFFICIAL';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PKShopTeamMember {
  id: string;
  userId?: string;
  email: string;
  phone?: string;
  name: string;
  role: 'STORE_MANAGER' | 'MODERATOR';
  permissions: string[];
  addedBy: string;
  createdAt: string;
}

export interface PKShopStats {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  totalProducts: number;
  totalInventory: number;
  activeTeamCount: number;
}
