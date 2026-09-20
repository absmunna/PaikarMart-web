export type AppRole =
  | 'guest'
  | 'buyer'
  | 'user'
  | 'seller'
  | 'business'
  | 'retail_seller'
  | 'wholesale_seller'
  | 'factory_seller'
  | 'factory'
  | 'rural'
  | 'wholesale'
  | 'exporter'
  | 'importer'
  | 'brand_seller'
  | 'b2b_seller'
  | 'food_seller'
  | 'grocery_seller'
  | 'rural_seller'
  | 'nearby_shop'
  | 'service_provider'
  | 'digital_seller'
  | 'content_creator'
  | 'property_agent'
  | 'employer'
  | 'moderator'
  | 'admin'
  | 'super_admin'
  | 'rider';

export interface RoleConfig {
  role: AppRole;
  labelEn: string;
  labelBn: string;
  color: string; // Tailwind class colors
  requiredTrustLevel: number;
}

export const ROLE_HIERARCHY: Record<AppRole, RoleConfig> = {
  guest: { role: 'guest', labelEn: 'Guest', labelBn: 'অতিথি', color: 'bg-zinc-700/50 text-zinc-300', requiredTrustLevel: 0 },
  buyer: { role: 'buyer', labelEn: 'Buyer', labelBn: 'ক্রেতা', color: 'bg-slate-600 text-white', requiredTrustLevel: 1 },
  user: { role: 'user', labelEn: 'User', labelBn: 'ব্যবহারকারী', color: 'bg-slate-500 text-white', requiredTrustLevel: 1 },
  seller: { role: 'seller', labelEn: 'Seller', labelBn: 'বিক্রেতা', color: 'bg-blue-500 text-white', requiredTrustLevel: 4 },
  business: { role: 'business', labelEn: 'Business', labelBn: 'ব্যবসায়িক', color: 'bg-indigo-500 text-white', requiredTrustLevel: 5 },
  retail_seller: { role: 'retail_seller', labelEn: 'Retail Seller', labelBn: 'রিটেইল সেলার', color: 'bg-blue-600/90 text-white', requiredTrustLevel: 4 },
  wholesale_seller: { role: 'wholesale_seller', labelEn: 'Wholesale Seller', labelBn: 'পাইকারি বিক্রেতা', color: 'bg-indigo-600/90 text-white', requiredTrustLevel: 5 },
  factory_seller: { role: 'factory_seller', labelEn: 'Factory Owner', labelBn: 'ফ্যাক্টরি মালিক', color: 'bg-orange-600/90 text-white', requiredTrustLevel: 6 },
  factory: { role: 'factory', labelEn: 'Factory', labelBn: 'ফ্যাক্টরি', color: 'bg-orange-500/90 text-white', requiredTrustLevel: 6 },
  rural: { role: 'rural', labelEn: 'Rural Seller', labelBn: 'পল্লী বিক্রেতা', color: 'bg-teal-500/90 text-white', requiredTrustLevel: 4 },
  wholesale: { role: 'wholesale', labelEn: 'Wholesale', labelBn: 'হোলসেল', color: 'bg-indigo-500/90 text-white', requiredTrustLevel: 5 },
  exporter: { role: 'exporter', labelEn: 'Export Merchant', labelBn: 'রপ্তানিকারক', color: 'bg-violet-600/90 text-white', requiredTrustLevel: 6 },
  importer: { role: 'importer', labelEn: 'Import Merchant', labelBn: 'আমদানিকারক', color: 'bg-indigo-700/90 text-white', requiredTrustLevel: 6 },
  brand_seller: { role: 'brand_seller', labelEn: 'Brand Shop / Owner', labelBn: 'ব্র্যান্ড বিক্রেতা', color: 'bg-fuchsia-600/90 text-white', requiredTrustLevel: 5 },
  b2b_seller: { role: 'b2b_seller', labelEn: 'B2B Seller', labelBn: 'বিটুবি বিক্রেতা', color: 'bg-rose-600/90 text-white', requiredTrustLevel: 5 },
  food_seller: { role: 'food_seller', labelEn: 'Restaurant Owner', labelBn: 'রেস্টুরেন্ট', color: 'bg-red-600/90 text-white', requiredTrustLevel: 4 },
  grocery_seller: { role: 'grocery_seller', labelEn: 'Grocery Seller', labelBn: 'মুদি বিক্রেতা', color: 'bg-green-600/90 text-white', requiredTrustLevel: 4 },
  rural_seller: { role: 'rural_seller', labelEn: 'Rural Producer', labelBn: 'গ্রামীন খামারি', color: 'bg-teal-600/90 text-white', requiredTrustLevel: 4 },
  nearby_shop: { role: 'nearby_shop', labelEn: 'Local Physical Shop', labelBn: 'শারীরিক দোকান', color: 'bg-pink-600/90 text-white', requiredTrustLevel: 5 },
  service_provider: { role: 'service_provider', labelEn: 'Service Pro', labelBn: 'সার্ভিস প্রোভাইডার', color: 'bg-purple-600/90 text-white', requiredTrustLevel: 4 },
  digital_seller: { role: 'digital_seller', labelEn: 'Digital Creator', labelBn: 'ডিজিটাল সেলার', color: 'bg-violet-600/90 text-white', requiredTrustLevel: 4 },
  content_creator: { role: 'content_creator', labelEn: 'Media Creator', labelBn: 'মিডিয়া ক্রিয়েটর', color: 'bg-pink-500/90 text-white', requiredTrustLevel: 2 },
  property_agent: { role: 'property_agent', labelEn: 'Property Agent', labelBn: 'রিয়েল এস্টেট এজেন্ট', color: 'bg-amber-600/90 text-white', requiredTrustLevel: 5 },
  employer: { role: 'employer', labelEn: 'Employer', labelBn: 'নিয়োগকর্তা', color: 'bg-teal-500/90 text-white', requiredTrustLevel: 5 },
  moderator: { role: 'moderator', labelEn: 'Moderator', labelBn: 'মডারেটর', color: 'bg-yellow-500/90 text-black font-semibold', requiredTrustLevel: 4 },
  admin: { role: 'admin', labelEn: 'Admin', labelBn: 'এডমিন', color: 'bg-lime-500 text-black font-bold', requiredTrustLevel: 4 },
  super_admin: { role: 'super_admin', labelEn: 'Super Admin', labelBn: 'সুপার এডমিন', color: 'bg-cyan-500 text-black font-extrabold', requiredTrustLevel: 4 },
  rider: { role: 'rider', labelEn: 'Rider', labelBn: 'রাইডার', color: 'bg-orange-400 text-black font-bold', requiredTrustLevel: 1 }
};

/**
 * 🇧🇩 7 Main Physical Product Seller Roles in exact logical/hierarchical sequence:
 * 1. উৎপাদক (Factory Owner / Manufacturer - factory_seller)
 * 2. এক্সপোর্টার (Exporter - exporter)
 * 3. ইম্পোর্টার (Importer - importer)
 * 4. বিটুবি বিক্রেতা (B2B Bulk Merchant - b2b_seller)
 * 5. হোলসেল সেলার (Wholesale Bulk Dealer - wholesale_seller)
 * 6. ব্র্যান্ড সেলার (Brand Shop Merchant - brand_seller)
 * 7. রিটেইল সেলার (Retail Shop Owner - retail_seller)
 */
export const PHYSICAL_PRODUCT_SELLER_ROLES: RoleConfig[] = [
  { role: 'factory_seller', labelEn: 'Factory Owner / Manufacturer', labelBn: 'উৎপাদক (ফ্যাক্টরি মালিক)', color: 'bg-orange-600/90 text-white', requiredTrustLevel: 6 },
  { role: 'exporter', labelEn: 'Exporter', labelBn: 'এক্সপোর্টার (রপ্তানিকারক)', color: 'bg-violet-600/90 text-white', requiredTrustLevel: 6 },
  { role: 'importer', labelEn: 'Importer', labelBn: 'ইম্পোর্টার (আমদানিকারক)', color: 'bg-indigo-700/90 text-white', requiredTrustLevel: 6 },
  { role: 'b2b_seller', labelEn: 'B2B Seller', labelBn: 'B2B সেলার (ব্যবসায়িক বিক্রেতা)', color: 'bg-rose-600/90 text-white', requiredTrustLevel: 5 },
  { role: 'wholesale_seller', labelEn: 'Wholesale Seller', labelBn: 'হোলসেল সেলার (পাইকারি বিক্রেতা)', color: 'bg-indigo-600/90 text-white', requiredTrustLevel: 5 },
  { role: 'brand_seller', labelEn: 'Brand Seller', labelBn: 'ব্র্যান্ড সেলার (ব্র্যান্ড বিক্রেতা)', color: 'bg-fuchsia-600/90 text-white', requiredTrustLevel: 5 },
  { role: 'retail_seller', labelEn: 'Retail Seller', labelBn: 'রিটেইল সেলার (খুচরা বিক্রেতা)', color: 'bg-blue-600/90 text-white', requiredTrustLevel: 4 }
];

export interface TrustLevel {
  level: number;
  labelEn: string;
  labelBn: string;
  badge: string; // Emoji + Label
}

export const TRUST_LEVELS: Record<number, TrustLevel> = {
  0: { level: 0, labelEn: 'Guest', labelBn: 'অতিথি', badge: '🌐 Guest' },
  1: { level: 1, labelEn: 'Phone OTP Verified', labelBn: 'ফোন ভেরিফাইড', badge: '📱 Phone Unlocked' },
  2: { level: 2, labelEn: 'Email Verified', labelBn: 'ইমেইল ভেরিফাইড', badge: '✉️ Email Verified' },
  3: { level: 3, labelEn: 'NID Submitted', labelBn: 'এনআইডি জমাকৃত', badge: '📄 ID Pending' },
  4: { level: 4, labelEn: 'NID Verified', labelBn: 'এনআইডি ভেরিফাইড', badge: '✅ ID Verified' },
  5: { level: 5, labelEn: 'Trade License Verified', labelBn: 'ট্রেড লাইসেন্স ভেরিফাইড', badge: '🏢 Business Verified' },
  6: { level: 6, labelEn: 'Export License Verified', labelBn: 'রপ্তানি লাইসেন্স ভেরিফাইড', badge: '🌍 Export Verified' },
  7: { level: 7, labelEn: 'Enterprise Partner', labelBn: 'এন্টারপ্রাইজ পার্টনার', badge: '⭐ Enterprise Partner' }
};

/**
 * Gate check if user holds sufficient trust level to execute a guarded action.
 * @param currentLevel Triggering user's current trust level
 * @param requiredLevel Gate's target required trust level
 */
export function hasTrustLevel(currentLevel: number, requiredLevel: number): boolean {
  return currentLevel >= requiredLevel;
}

/**
 * Gate check for transaction limit based on trust level.
 * @param amount Target order transaction value in BDT
 * @param currentLevel Triggering user's current trust level
 */
export function isWithinTransactionLimit(amount: number, currentLevel: number): boolean {
  if (amount > 50000 && currentLevel < 4) {
    return false; // Orders over BDT 50,000 require Trust Level 4 (ID Verified)
  }
  return true;
}

/**
 * 🏷️ Core RBAC Personas / Role Groups
 * Distinguishes cleanly between Customers (shoppers/buyers), Vendors (merchants/producers), and Admins (platform governance).
 */
export type RoleGroup = 'customer' | 'vendor' | 'admin';
export type UserPersona = RoleGroup;

export const CUSTOMER_ROLES: AppRole[] = ['buyer', 'user', 'guest'];

export const VENDOR_ROLES: AppRole[] = [
  'seller',
  'retail_seller',
  'wholesale_seller',
  'factory_seller',
  'factory',
  'rural',
  'wholesale',
  'exporter',
  'importer',
  'brand_seller',
  'b2b_seller',
  'food_seller',
  'grocery_seller',
  'rural_seller',
  'nearby_shop',
  'service_provider',
  'digital_seller',
  'business',
  'property_agent',
  'employer',
  'content_creator',
  'rider'
];

export const ADMIN_ROLES: AppRole[] = [
  'admin',
  'super_admin',
  'moderator'
];

export function getRoleGroup(role?: AppRole | string | null): RoleGroup {
  if (!role) return 'customer';
  const r = role as AppRole;
  if (ADMIN_ROLES.includes(r)) return 'admin';
  if (VENDOR_ROLES.includes(r)) return 'vendor';
  return 'customer';
}

export const ROLE_GROUP_META: Record<RoleGroup, {
  labelEn: string;
  labelBn: string;
  badge: string;
  descriptionEn: string;
  descriptionBn: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  customer: {
    labelEn: 'Customer / Buyer',
    labelBn: 'ক্রেতা / সাধারণ গ্রাহক',
    badge: '🛒 Customer',
    descriptionEn: 'Browse products, place orders, track shipments, chat with sellers, and use wallet',
    descriptionBn: 'পণ্য দেখুন, অর্ডার করুন, শিপমেন্ট ট্র্যাক করুন, বিক্রেতাদের সাথে চ্যাট করুন ও ওয়ালেট ব্যবহার করুন',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/40',
    borderColor: 'border-blue-200 dark:border-blue-800/40'
  },
  vendor: {
    labelEn: 'Vendor / Merchant',
    labelBn: 'বিক্রেতা / মার্চেন্ট',
    badge: '🛍️ Vendor',
    descriptionEn: 'Manage store, product catalog, wholesale quotes, inventory, and order fulfillment',
    descriptionBn: 'দোকান পরিচালনা, পণ্য ক্যাটালগ, পাইকারি কোটেশন, ইনভেন্টরি ও অর্ডার ডেলিভারি',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800/40'
  },
  admin: {
    labelEn: 'Administrator',
    labelBn: 'প্রশাসক / এডমিন',
    badge: '🛡️ Admin',
    descriptionEn: 'Platform governance, KYC verification, commission control, and dispute arbitration',
    descriptionBn: 'প্ল্যাটফর্ম পরিচালনা, কেওয়াইসি ভেরিফিকেশন, কমিশন কন্ট্রোল ও বিরোধ নিষ্পত্তি',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/40',
    borderColor: 'border-purple-200 dark:border-purple-800/40'
  }
};

/**
 * 🔒 Granular RBAC Permissions
 */
export const PERMISSIONS = {
  // Customer Scopes
  CAN_BROWSE: 'CAN_BROWSE',
  CAN_BUY: 'CAN_BUY',
  CAN_PURCHASE: 'CAN_PURCHASE',
  CAN_VIEW_FEED: 'CAN_VIEW_FEED',
  CAN_REVIEW: 'CAN_REVIEW',
  CAN_BID: 'CAN_BID',
  CAN_USE_WALLET: 'CAN_USE_WALLET',
  CAN_CHAT_SELLER: 'CAN_CHAT_SELLER',
  CAN_RIDE_SHARE: 'CAN_RIDE_SHARE',
  CAN_USE_PREMIUM_SERVICES: 'CAN_USE_PREMIUM_SERVICES',

  // Vendor Scopes
  CAN_SELL: 'CAN_SELL',
  CAN_MANAGE_SHOP: 'CAN_MANAGE_SHOP',
  CAN_MANAGE_PRODUCTS: 'CAN_MANAGE_PRODUCTS',
  CAN_MANAGE_INVENTORY: 'CAN_MANAGE_INVENTORY',
  CAN_FULFILL_ORDERS: 'CAN_FULFILL_ORDERS',
  CAN_VIEW_VENDOR_ANALYTICS: 'CAN_VIEW_VENDOR_ANALYTICS',
  CAN_POST_BULK_DEALS: 'CAN_POST_BULK_DEALS',
  CAN_RESPOND_RFQ: 'CAN_RESPOND_RFQ',
  CAN_MANUFACTURE: 'CAN_MANUFACTURE',
  CAN_MANAGE_FACTORY: 'CAN_MANAGE_FACTORY',
  CAN_CREATE_SERVICE: 'CAN_CREATE_SERVICE',
  CAN_MANAGE_SERVICES: 'CAN_MANAGE_SERVICES',
  CAN_DELIVER: 'CAN_DELIVER',

  // Admin Scopes
  CAN_ADMIN: 'CAN_ADMIN',
  CAN_MODERATE: 'CAN_MODERATE',
  CAN_ACCESS_GOVERNANCE: 'CAN_ACCESS_GOVERNANCE',
  CAN_MANAGE_USERS: 'CAN_MANAGE_USERS',
  CAN_MANAGE_ROLES: 'CAN_MANAGE_ROLES',
  CAN_APPROVE_VENDORS: 'CAN_APPROVE_VENDORS',
  CAN_MANAGE_COMMISSIONS: 'CAN_MANAGE_COMMISSIONS',
  CAN_VIEW_PLATFORM_ANALYTICS: 'CAN_VIEW_PLATFORM_ANALYTICS',
  CAN_RESOLVE_DISPUTES: 'CAN_RESOLVE_DISPUTES',
  CAN_ACCESS_AUDIT_LOGS: 'CAN_ACCESS_AUDIT_LOGS'
} as const;

export type Permission = keyof typeof PERMISSIONS;

/**
 * Single source of truth for permission calculation by role and verification status
 */
export function getPermissionsForRole(role: AppRole, isVerified = false): string[] {
  const customerBase: string[] = [
    PERMISSIONS.CAN_BUY,
    PERMISSIONS.CAN_PURCHASE,
    PERMISSIONS.CAN_BROWSE,
    PERMISSIONS.CAN_VIEW_FEED,
    PERMISSIONS.CAN_REVIEW,
    PERMISSIONS.CAN_USE_WALLET,
    PERMISSIONS.CAN_CHAT_SELLER
  ];

  if (isVerified) {
    customerBase.push(
      PERMISSIONS.CAN_BID,
      PERMISSIONS.CAN_USE_PREMIUM_SERVICES,
      PERMISSIONS.CAN_RIDE_SHARE
    );
  }

  const group = getRoleGroup(role);

  if (group === 'admin') {
    return [
      ...customerBase,
      PERMISSIONS.CAN_SELL,
      PERMISSIONS.CAN_MANAGE_SHOP,
      PERMISSIONS.CAN_MANAGE_PRODUCTS,
      PERMISSIONS.CAN_MANAGE_INVENTORY,
      PERMISSIONS.CAN_FULFILL_ORDERS,
      PERMISSIONS.CAN_VIEW_VENDOR_ANALYTICS,
      PERMISSIONS.CAN_POST_BULK_DEALS,
      PERMISSIONS.CAN_RESPOND_RFQ,
      PERMISSIONS.CAN_MANUFACTURE,
      PERMISSIONS.CAN_MANAGE_FACTORY,
      PERMISSIONS.CAN_CREATE_SERVICE,
      PERMISSIONS.CAN_MANAGE_SERVICES,
      PERMISSIONS.CAN_DELIVER,
      PERMISSIONS.CAN_ADMIN,
      PERMISSIONS.CAN_MODERATE,
      PERMISSIONS.CAN_ACCESS_GOVERNANCE,
      PERMISSIONS.CAN_MANAGE_USERS,
      PERMISSIONS.CAN_MANAGE_ROLES,
      PERMISSIONS.CAN_APPROVE_VENDORS,
      PERMISSIONS.CAN_MANAGE_COMMISSIONS,
      PERMISSIONS.CAN_VIEW_PLATFORM_ANALYTICS,
      PERMISSIONS.CAN_RESOLVE_DISPUTES,
      PERMISSIONS.CAN_ACCESS_AUDIT_LOGS
    ];
  }

  if (group === 'vendor') {
    const vendorBase: string[] = [
      ...customerBase,
      PERMISSIONS.CAN_SELL,
      PERMISSIONS.CAN_MANAGE_SHOP,
      PERMISSIONS.CAN_MANAGE_PRODUCTS,
      PERMISSIONS.CAN_MANAGE_INVENTORY,
      PERMISSIONS.CAN_FULFILL_ORDERS,
      PERMISSIONS.CAN_VIEW_VENDOR_ANALYTICS
    ];

    if (['factory', 'factory_seller', 'exporter', 'importer'].includes(role)) {
      vendorBase.push(
        PERMISSIONS.CAN_MANUFACTURE,
        PERMISSIONS.CAN_MANAGE_FACTORY,
        PERMISSIONS.CAN_POST_BULK_DEALS,
        PERMISSIONS.CAN_RESPOND_RFQ
      );
    } else if (['wholesale', 'wholesale_seller', 'b2b_seller'].includes(role)) {
      vendorBase.push(
        PERMISSIONS.CAN_POST_BULK_DEALS,
        PERMISSIONS.CAN_RESPOND_RFQ
      );
    } else if (role === 'service_provider') {
      vendorBase.push(
        PERMISSIONS.CAN_CREATE_SERVICE,
        PERMISSIONS.CAN_MANAGE_SERVICES
      );
    }

    return vendorBase;
  }

  if (role === 'rider') {
    return [
      ...customerBase,
      PERMISSIONS.CAN_DELIVER,
      PERMISSIONS.CAN_RIDE_SHARE
    ];
  }

  return customerBase;
}
