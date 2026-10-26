export interface SellerProduct {
  id: string;
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
  minOrderQty?: number;
  unit?: string;
  category?: string;
  categoryId?: string;
  categoryName?: string;
  type?: 'retail' | 'wholesale' | 'homemade' | 'nearby' | string;
  isActive?: boolean;
  status?: string;
  sellerId: string;
  createdAt?: string;
  [key: string]: any;
}

export interface SellerOrder {
  id: string;
  buyerName?: string;
  buyerPhone?: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  totalAmount?: number;
  total?: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
  deliveryAddress?: string;
  [key: string]: any;
}

export interface ServiceBooking {
  id: string;
  customer: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'assigned' | 'completed' | 'cancelled';
  phone: string;
  area: string;
}

export interface DeliveryTask {
  id: string;
  orderId: string;
  courier: string;
  status: 'pending' | 'picked_up' | 'dispatched' | 'delivered' | 'loading';
  route: string;
  timeline: string[];
  type: 'parcel' | 'delivery' | 'ride' | 'food' | 'transport';
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  reason: string;
  status: 'open' | 'reviewing' | 'approved' | 'rejected';
  createdAt?: string;
}

export interface SellerVerificationPayload {
  nidNumber?: string;
  shopName?: string;
  tradeLicense?: string;
  documents?: string[];
}

export interface SellerProfile {
  id: string;
  storeName?: string;
  shopName?: string;
  name?: string;
  email?: string;
  phone?: string;
  logo?: string;
  banner?: string;
  description?: string;
  address?: string;
  division?: string;
  district?: string;
  upazila?: string;
  isVerified?: boolean;
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  verificationPayload?: SellerVerificationPayload;
  sellerType?: 'retail' | 'wholesale' | 'both' | 'service' | string;
  rating?: number;
  totalOrders?: number;
  totalSales?: number;
  balance?: number;
  createdAt?: any;
  updatedAt?: any;
  [key: string]: any;
}
