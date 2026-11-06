export interface EcomProduct {
  id: string;
  name: string;
  nameLocal?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  unit?: string;
  inStock: boolean;
  
  // Food-specific fields
  veg?: boolean;
  spicy?: boolean;
  popular?: boolean;
  
  // Pharmacy-specific fields
  requiresRx?: boolean;
  generic?: string;
  brand?: string;
  description?: string;
  
  // Grocery-specific fields
  isOrganic?: boolean;
  isFeatured?: boolean;
  supermarket?: string;
  discount?: number;
}

export interface EcomStore {
  id: string;
  name: string;
  cuisine?: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  distance: string;
  isOpen: boolean;
  banner: string;
  logo: string;
  promo?: string;
  category?: string;
  items: EcomProduct[];
}

export type EcomDomain = 'food' | 'grocery' | 'pharmacy';
