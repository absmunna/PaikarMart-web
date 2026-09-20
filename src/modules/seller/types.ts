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
  type?: 'retail' | 'wholesale';
  isActive?: boolean;
  sellerId: string;
  createdAt?: string;
}

export interface SellerOrder {
  id: string;
  buyerName?: string;
  buyerPhone?: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  totalAmount: number;
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
  status: 'open' | 'reviewing' | 'approved' | 'rejected';
  createdAt?: string;
}

export interface SellerVerificationPayload {
  nidNumber?: string;
  shopName?: string;
  tradeLicense?: string;
  documents?: string[];
}
