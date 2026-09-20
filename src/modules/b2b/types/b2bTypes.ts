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

export interface B2BVendor {
  id: string;
  name: string;
  type: 'factory' | 'supplier' | 'exporter' | 'importer';
  isVerified: boolean;
  rating: number;
  location: string;
  banner: string;
  logo: string;
  industry: string;
  description: string;
  employeeCount: number;
  establishedYear: number;
  exportMarkets: string[];
  certifications: string[];
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

export interface B2BPost {
  id: string;
  authorName: string;
  authorRole: string;
  authorLogo: string;
  type: 'product_launch' | 'bulk_offer' | 'trade_announcement';
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  date: string;
}
