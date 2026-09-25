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
  status?: 'in_stock' | 'low_stock' | 'out_of_stock' | string;
  type?: 'retail' | 'wholesale' | 'homemade' | 'nearby' | string;
  isActive?: boolean;
  sellerId: string;
  sellerName?: string;
  location?: string;
  tags?: string[];
  views?: number;
  createdAt?: string;
  [key: string]: any;
}

export interface SellerOrder {
  id: string;
  buyerName?: string;
  buyerPhone?: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  totalAmount: number;
  total?: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
  deliveryAddress?: string;
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
  status: 'open' | 'reviewing' | 'approved' | 'rejected' | 'pending';
  createdAt?: string;
}

export interface SellerProfile {
  id: string;
  sellerId?: string;
  storeName?: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  avatar?: string;
  tradeLicense?: string;
  nidNumber?: string;
  address?: any;
  verified?: boolean;
  tier?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface SellerVerificationPayload {
  nidNumber?: string;
  shopName?: string;
  tradeLicense?: string;
  documents?: string[];
}
