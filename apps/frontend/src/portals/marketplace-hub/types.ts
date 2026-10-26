/**
 * PaikarMart Marketplace Hub Types
 * Defines the core structure for Portals, Seller Types, Categories & Subcategories
 */

export type MarketplacePortalId =
  | 'wholesale'
  | 'retail'
  | 'pk-shop'
  | 'brand-shops'
  | 'digital'
  | 'dropship'
  | 'auto';

export type MarketplaceSellerType =
  | 'wholesaler'        // পাইকারি আড়তদার ও ডিলার
  | 'factory'           // উৎপাদনকারী ও শিল্প কারখানা
  | 'importer'          // আমদানিকারক
  | 'exporter'          // রপ্তানিকারক
  | 'brand_seller'      // অফিশিয়াল ব্র্যান্ড স্টোর
  | 'retail_seller'     // খুচরা অনলাইন বিক্রেতা
  | 'dropship_supplier' // ড্রপশিপিং ভেন্ডর
  | 'digital_seller';   // ডিজিটাল ও সফটওয়্যার ক্রিয়েটর

export interface SellerTypeConfig {
  id: MarketplaceSellerType;
  labelEn: string;
  labelBn: string;
  descriptionEn: string;
  descriptionBn: string;
  badgeColor: string;
  iconName: string;
  features: string[];
  requiresKYC: boolean;
  targetPortal: MarketplacePortalId;
}

export interface MarketplaceSubCategory {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  productCount?: number;
  moqRequired?: boolean;
  tags?: string[];
}

export interface MarketplaceCategory {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  iconName: string;
  color: string;
  bgGradient: string;
  featured?: boolean;
  targetSellerTypes: MarketplaceSellerType[];
  subcategories: MarketplaceSubCategory[];
}

export interface MarketplacePortalConfig {
  id: MarketplacePortalId;
  nameEn: string;
  nameBn: string;
  taglineEn: string;
  taglineBn: string;
  route: string;
  iconName: string;
  accentColor: string;
  allowedSellers: MarketplaceSellerType[];
  badge?: string;
}
