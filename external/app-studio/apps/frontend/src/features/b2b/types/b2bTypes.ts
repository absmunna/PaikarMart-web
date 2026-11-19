export interface TierPrice {
  range: string;
  price: number;
}

export interface B2BProduct {
  id: string;
  name: string;
  category: string;
  moq: number;
  stock: number;
  image: string;
  vendorId: string;
  vendorName: string;
  isVerified: boolean;
  isExport: boolean;
  rating: number;
  description?: string;
  tierPrices: TierPrice[];
  specs?: { [key: string]: string };
}

export interface RFQuote {
  id: string;
  companyName: string;
  quotePrice: number;
  deliveryTime: string;
  message: string;
  date: string;
}

export interface RFQ {
  id: string;
  title: string;
  category: string;
  quantity: number;
  unit: string;
  budget: string;
  deadline: string;
  description: string;
  buyerName: string;
  buyerRegion: string;
  isUrgent?: boolean;
  quotes?: RFQuote[];
  status: 'Open' | 'Closed' | 'Awarded';
  date: string;
}

export type B2BPaymentTerms = 'wholesale_credit' | 'lc' | 'bank_transfer' | 'escrow';

export interface PurchaseOrderDraft {
  poNumber: string;
  rfqId: string;
  status: 'draft_submitted' | 'supplier_accepted' | 'counter_offered' | 'escrow_locked' | 'declined';
  buyer: {
    name: string;
    phone: string;
    company: string;
    district: string;
    email?: string;
  };
  supplier: {
    id: string;
    factoryName: string;
    tradeLicense: string;
    location: string;
    verified: boolean;
  };
  product: {
    id: string;
    name: string;
    moq: number;
    leadTime: string;
  };
  financials: {
    quantity: number;
    unitPrice: number;
    subtotal: number;
    estimatedAitVat: number;
    grandTotal: number;
    counterPrice?: number;
    currency: 'BDT';
  };
  paymentTerms: B2BPaymentTerms;
  paymentTermsLabel: string;
  deliveryDistrict: string;
  notes: string;
  supplierComments?: string;
  escrowId?: string;
  createdAt: string;
  respondedAt?: string;
  expiresAt: string;
}

export interface WholesaleSampleOrder {
  id: string;
  productId: string;
  productTitle: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  shippingAddress: string;
  sampleFee: number;
  status: 'requested' | 'dispatched' | 'delivered';
  trackingCode: string;
  createdAt: string;
}
