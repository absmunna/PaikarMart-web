// Unified Types, RBAC Roles, Seller Tiers & Trust Ladder for PaikarMart Monorepo (SSOT)

export type UserRole = 'consumer' | 'vendor' | 'moderator' | 'admin' | 'super_admin';
export type TradeMode = 'retail' | 'wholesale';

export type BusinessRole =
  | 'retail_merchant'
  | 'wholesale_supplier'
  | 'service_provider'
  | 'rideshare_driver'
  | 'content_creator';

export type VendorMembershipStatus = 'pending' | 'active' | 'suspended' | 'revoked';

export interface VendorMembership {
  id: string;
  vendorProfileId: string;
  userId: string;
  roles: BusinessRole[];
  status: VendorMembershipStatus;
  isPrimary?: boolean;
  createdAt: string;
}

export type SellerTier =
  | 'retail_seller'
  | 'brand_seller'
  | 'wholesale_seller'
  | 'b2b_seller'
  | 'importer'
  | 'exporter'
  | 'factory_seller';

export type KycStatus =
  | 'none'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'suspended';

export type TrustLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface TrustLevelMeta {
  level: TrustLevel;
  label: string;
  labelBn: string;
  summary: string;
}

export const TRUST_LEVEL_DEFINITIONS: Record<TrustLevel, TrustLevelMeta> = {
  0: { level: 0, label: 'Guest', labelBn: 'অতিথি', summary: 'Public catalog & guest order tracking' },
  1: { level: 1, label: 'Phone / Email Verified', labelBn: 'ইমেইল ভেরিফায়েড', summary: 'Retail checkout, rides & social posts' },
  2: { level: 2, label: 'Profile Complete', labelBn: 'প্রোফাইল সম্পূর্ণ', summary: 'Saved addresses & reviews' },
  3: { level: 3, label: 'Trusted Buyer', labelBn: 'বিশ্বস্ত ক্রেতা', summary: 'COD eligibility & open demands' },
  4: { level: 4, label: 'NID KYC Verified', labelBn: 'এনআইডি ভেরিফায়েড', summary: 'B2B > ৳50,000, bank payouts & driver onboarding' },
  5: { level: 5, label: 'Trade License Verified', labelBn: 'ট্রেড লাইসেন্স ভেরিফায়েড', summary: 'Verified Storefront & RFQ bidding rights' },
  6: { level: 6, label: 'Enterprise Audited', labelBn: 'এন্টারপ্রাইজ অডিটেড', summary: '3PL billing & high-volume factory supply' },
  7: { level: 7, label: 'Export Certified', labelBn: 'রপ্তানি লাইসেন্সপ্রাপ্ত', summary: 'Cross-border international B2B trade' }
};

export interface SellerTierMeta {
  tier: SellerTier;
  label: string;
  labelBn: string;
  commissionLabel: 'Standard 8%' | 'Wholesale 4%' | 'Enterprise 2.5%';
  minTrustLevel: TrustLevel;
}

export const SELLER_TIER_DEFINITIONS: SellerTierMeta[] = [
  { tier: 'retail_seller', label: 'Retail Storefront', labelBn: 'রিটেইল স্টোর', commissionLabel: 'Standard 8%', minTrustLevel: 4 },
  { tier: 'brand_seller', label: 'Official Brand Flagship', labelBn: 'অফিশিয়াল ব্র্যান্ড শপ', commissionLabel: 'Standard 8%', minTrustLevel: 5 },
  { tier: 'wholesale_seller', label: 'Wholesale Distributor', labelBn: 'পাইকারি পরিবেশক', commissionLabel: 'Wholesale 4%', minTrustLevel: 5 },
  { tier: 'b2b_seller', label: 'B2B Trade Enterprise', labelBn: 'বিটুবি ট্রেড এন্টারপ্রাইজ', commissionLabel: 'Wholesale 4%', minTrustLevel: 5 },
  { tier: 'importer', label: 'Authorized Importer', labelBn: 'অনুমোদিত আমদানিকারক', commissionLabel: 'Wholesale 4%', minTrustLevel: 6 },
  { tier: 'exporter', label: 'International Exporter', labelBn: 'আন্তর্জাতিক রপ্তানিকারক', commissionLabel: 'Enterprise 2.5%', minTrustLevel: 7 },
  { tier: 'factory_seller', label: 'Factory / Manufacturer (OEM)', labelBn: 'সরাসরি ফ্যাক্টরি / প্রস্তুতকারক', commissionLabel: 'Enterprise 2.5%', minTrustLevel: 6 }
];

export function isGovernanceRole(role?: UserRole): boolean {
  return role === 'moderator' || role === 'admin' || role === 'super_admin';
}

export function canAccessSellerCentral(user?: {
  role?: UserRole;
  isVendor?: boolean;
  kycStatus?: KycStatus;
  vendorProfile?: { status?: string } | null;
}): boolean {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'super_admin') return true;
  if (!user.isVendor && !user.vendorProfile) return false;
  if (user.kycStatus && user.kycStatus !== 'approved') return false;
  if (user.vendorProfile?.status && user.vendorProfile.status !== 'active') return false;
  return true;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  handle: string;
  avatar: string;
  role: UserRole;
  isVendor: boolean;
  kycStatus?: KycStatus;
  trustLevel?: TrustLevel;
  location: string;
  balance: number;
  vendorMemberships?: VendorMembership[];
  activeVendorId?: string;
}

export interface CommerceItem {
  id: string;
  masterProductId?: string;
  storeId: string;
  storeName: string;
  type: 'retail' | 'wholesale' | 'food' | 'service' | 'rides' | 'grocery';
  tradeMode?: TradeMode;
  title: string;
  description: string;
  price: number;
  inStock: boolean;
  category: string;
  imageUrl: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: any[];
  subtotal: number;
  total: number;
  status: string;
  deliveryAddress: string;
  paymentMethod: string;
}

export interface SocialPost {
  id: string;
  authorId?: string;
  authorName: string;
  authorHandle?: string;
  content: string;
  timestamp: string;
  reactionsCount: {
    like: number;
    love: number;
    care: number;
  };
}

/**
 * Normalizes any username, store name, or @handle into a safe URL slug (without leading @).
 * Example: "@TechNova BD!" -> "technova_bd"
 */
export function normalizeHandle(input?: string | null): string {
  if (!input) return 'paikarmart_member';
  const cleaned = input
    .trim()
    .replace(/^@+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return cleaned || 'paikarmart_member';
}

export function formatDisplayHandle(input?: string | null): string {
  return `@${normalizeHandle(input)}`;
}

/**
 * Strictly Public (Zero-PII) projection returned by /api/vendors/profile/:handle.
 * Never includes NID, TIN, payoutAccount, private email, wallet balance, or order history.
 */
export interface PublicProfileProjection {
  handle: string;
  storeId?: string;
  displayName: string;
  avatar?: string;
  location: string;
  verified: boolean;
  trustLevel: TrustLevel;
  sellerTier?: SellerTier;
  category?: string;
  rating?: number;
  activeRoles?: BusinessRole[];
  isOpen?: boolean;
  openingHoursLabel?: string;
  coordinates?: { lat: number; lng: number };
}

export interface HyperlocalProviderRank {
  id: string;
  distanceKm: number;
  withinRadius: boolean;
  radiusLimitKm: number;
  hyperlocalDeliveryFeeBdt: number;
  estimatedPrepMin: number;
  estimatedTransitMin: number;
  totalEtaMin: number;
  isOpen: boolean;
}
