export type PortalTab = 
  | 'feed'
  | 'hub'
  | 'explore'
  | 'commerce'
  | 'wholesale'
  | 'services'
  | 'rides'
  | 'creator'
  | 'vendor-dash'
  | 'profile'
  | 'settings'
  | 'orders'
  | 'notifications'
  | 'wallet'
  | 'messages'
  | 'guide'
  | 'demand'
  | 'nearby'
  | 'community-hub'
  | 'utility-hub';

export type SettingsSectionId =
  | 'appearance'
  | 'language'
  | 'location'
  | 'about'
  | 'account_profile'
  | 'account_security'
  | 'account_addresses'
  | 'account_payments'
  | 'account_notifications'
  | 'vendor_store'
  | 'vendor_kyc'
  | 'vendor_payout'
  | 'vendor_fulfillment'
  | 'vendor_hours';

export type UserRole = 'consumer' | 'vendor' | 'moderator' | 'admin' | 'super_admin';

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

export type TradeMode = 'retail' | 'wholesale';

export type CommerceSubCategory = 
  | 'brand' | 'nearby' | 'homemade' | 'pharmacy' | 'online' | 'dropshipping' // Retail
  | 'exporter' | 'importer' | 'factory' | 'dealer' | 'broker'; // Wholesale

export type ServiceType = 
  | 'salon' | 'swiper' | 'plumber' | 'electrician' | 'repair' | 'hotel' | 'grocery' | 'pharmacy' | 'restaurant' // Physical
  | 'digital'; // Digital

export type RideType = 
  | 'bike' | 'car' | 'pickup' | 'truck' | 'intercity' | 'parcel' | 'sameday' | 'food' | 'quick';

export type VendorCategory = 
  | 'wholesale'
  | 'retail'
  | 'restaurant'
  | 'services'
  | 'rideshare'
  | 'grocery';

export type BusinessRole = 
  | 'retail_merchant'
  | 'wholesale_supplier'
  | 'service_provider'
  | 'rideshare_driver'
  | 'content_creator';

export interface BusinessDocument {
  id: string;
  type: 'Trade License' | 'NID / Passport' | 'TIN Certificate' | 'Vehicle Registration';
  fileName: string;
  fileUrl?: string;
  contentType?: string;
  sizeBytes?: number;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: string;
}

export interface PayoutAccount {
  type: 'Bank Account' | 'bKash Merchant' | 'Nagad Merchant' | 'Rocket';
  accountName: string;
  accountNumber: string;
  routingNumber?: string;
}

export interface VendorProfile {
  id: string;
  handle?: string;
  storeName: string;
  legalEntityName: string;
  businessRegNumber: string;
  taxIdentificationNumber: string;
  nidNumber?: string;
  sellerTier?: SellerTier;
  kycStatus?: KycStatus;
  trustLevel?: TrustLevel;
  category: VendorCategory;
  verified: boolean;
  status: 'active' | 'pending' | 'suspended';
  commissionTier: 'Standard 8%' | 'Wholesale 4%' | 'Enterprise 2.5%';
  rating: number;
  totalSales: number;
  bannerUrl?: string;
  location?: string;
  isOpen?: boolean;
  openingHoursLabel?: string;
  coordinates?: { lat: number; lng: number };
  createdAt: string;
  activeRoles?: BusinessRole[];
  documents?: BusinessDocument[];
  payoutAccount?: PayoutAccount;
}

export interface VendorMembership {
  id: string;
  vendorProfileId: string;
  userId: string;
  roles: BusinessRole[];
  status: 'pending' | 'active' | 'suspended' | 'revoked';
  isPrimary?: boolean;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'purchase' | 'cashback' | 'escrow_hold' | 'escrow_release';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  referenceId?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  handle: string;
  avatar: string;
  coverImage?: string;
  role: UserRole;
  isVendor: boolean;
  kycStatus?: KycStatus;
  trustLevel?: TrustLevel;
  vendorProfile?: VendorProfile;
  vendorProfiles?: VendorProfile[];
  vendorMemberships?: VendorMembership[];
  activeVendorId?: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  isLiveLocationActive?: boolean;
  balance: number;
  rewardPoints?: number;
  transactions?: WalletTransaction[];
  savedAddresses?: SavedAddress[];
  paymentMethods?: PaymentMethodItem[];
}

export type ReactionType = 'like' | 'love' | 'care' | 'haha' | 'wow' | 'sad';

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface TaggedProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  storeName: string;
  storeHandle?: string;
  type: 'retail' | 'wholesale' | 'food' | 'service' | 'rides' | 'grocery';
}

export type PostType = 'regular' | 'demand' | 'sale';

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle?: string;
  authorAvatar: string;
  authorVerified?: boolean;
  timestamp: string;
  content: string;
  mediaUrl?: string;
  postType?: PostType;
  taggedProduct?: TaggedProduct;
  reactionsCount: {
    like: number;
    love: number;
    care: number;
  };
  userReaction?: ReactionType;
  comments: Comment[];
  sharesCount: number;
  isSponsored?: boolean;
  adNetwork?: 'AdMob Native' | 'AdMob Interstitial';
}

export interface Story {
  id: string;
  authorName: string;
  authorAvatar: string;
  mediaUrl: string;
  isLive?: boolean;
  viewed?: boolean;
}

export interface WholesaleTier {
  minQty: number;
  pricePerUnit: number;
}

export interface RFQRequest {
  id: string;
  productId: string;
  productTitle: string;
  targetQuantity: number;
  targetPricePerUnit?: number;
  companyName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  destinationCity: string;
  paymentTerms?: 'wholesale_credit' | 'lc' | 'bank_transfer' | 'escrow';
  notes?: string;
  status: 'pending' | 'quoted' | 'accepted' | 'declined';
  createdAt: string;
}

export interface SampleRequest {
  id: string;
  productId: string;
  productTitle: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  shippingAddress: string;
  status: 'submitted' | 'processing' | 'shipped';
  createdAt: string;
}

export interface MasterProduct {
  id: string;
  barcode?: string;
  titleEn: string;
  titleBn: string;
  brand: string;
  category: string;
  description: string;
  canonicalImages: string[];
  specifications: Record<string, string>;
  variantOptions?: ProductVariantOption[];
  isVerified: boolean;
  createdAt: string;
}

export interface SellerListing {
  id: string;
  masterProductId: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerReviewsCount: number;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  tradeMode: TradeMode;
  minWholesaleQty?: number;
  wholesaleTiers?: WholesaleTier[];
  sellerRealPhotos?: string[];
  deliveryEta: string;
  proximityDistance?: string;
  location: string;
  isActive: boolean;
  createdAt: string;
}

export interface MasterCatalogSubmission {
  id: string;
  sellerId: string;
  sellerName: string;
  proposedTitle: string;
  proposedBrand: string;
  proposedCategory: string;
  proposedDescription: string;
  proposedImages: string[];
  proposedPrice: number;
  tradeMode: TradeMode;
  status: 'pending_review' | 'approved' | 'rejected';
  aiConfidenceScore?: number;
  aiAuditNotes?: string;
  createdAt: string;
}

export interface MasterService {
  id: string;
  titleEn: string;
  titleBn: string;
  serviceType: string;
  description: string;
  includedChecklist: string[];
  estimatedDuration: string;
  canonicalImageUrl: string;
  createdAt: string;
}

export interface ProviderServiceOffer {
  id: string;
  masterServiceId: string;
  providerId: string;
  providerName: string;
  baseRate: number;
  serviceRadiusKm: number;
  verifiedBadge: boolean;
  rating: number;
  reviewsCount: number;
  proximityDistance: string;
  estimatedArrival: string;
}

export interface CommerceItem {
  id: string;
  masterProductId?: string;
  storeId: string;
  storeName: string;
  storeHandle?: string;
  type: 'retail' | 'wholesale' | 'food' | 'service' | 'rides' | 'grocery';
  tradeMode?: TradeMode;
  subCategory?: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  wholesaleTiers?: WholesaleTier[];
  minWholesaleQty?: number;
  rating: number;
  reviewsCount: number;
  deliveryEta: string;
  proximityDistance?: string;
  coordinates?: { lat: number; lng: number };
  isOpen?: boolean;
  openingHoursLabel?: string;
  prepMinutes?: number;
  imageUrl: string;
  sellerRealPhotos?: string[];
  galleryImages?: string[];
  brand?: string;
  specifications?: Record<string, string>;
  variantOptions?: ProductVariantOption[];
  variantOffers?: ProductVariantOffer[];
  highlights?: string[];
  warrantyLabel?: string;
  category: string;
  inStock: boolean;
  badge?: string;
  cuisine?: string; // For food
  restaurantAddress?: string; // For food
  serviceDuration?: string; // For services
  hourlyRate?: number; // For services
  isDemandRequest?: boolean;
  isUsedItem?: boolean;
}

export interface ProductVariantOption {
  id: string;
  label: string;
  values: string[];
}

export interface ProductVariantOffer {
  key: string;
  label: string;
  sku?: string;
  price?: number;
  stockQuantity?: number;
}

export interface CartItem {
  product: CommerceItem;
  quantity: number;
  isWholesale: boolean;
  selectedVariant?: string;
  specialInstructions?: string;
}

export interface OrderReview {
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  reviewerName?: string;
  tags?: string[];
}

export interface OrderStatusLog {
  status: 'confirmed' | 'preparing' | 'in_transit' | 'delivered';
  title: string;
  timestamp: string;
  description: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: 'confirmed' | 'preparing' | 'in_transit' | 'delivered';
  deliveryAddress: string;
  paymentMethod: 'Credit / Debit Card' | 'Mobile Wallet (bKash/Venmo)' | 'Cash on Delivery';
  estimatedArrival: string;
  trackingStep: number; // 1 to 4
  buyerName?: string;
  buyerPhone?: string;
  storeId?: string;
  storeName?: string;
  riderName?: string;
  riderPhone?: string;
  statusHistory?: OrderStatusLog[];
  review?: OrderReview;
}

export interface ServiceBooking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  providerName: string;
  customerName: string;
  customerPhone: string;
  serviceAddress: string;
  date: string;
  timeSlot: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  depositAmount: number;
  totalEstimate: number;
  notes?: string;
}

export interface RideOption {
  id: string;
  tier: 'Economy' | 'Comfort' | 'SuperXL' | 'Express Bike';
  name: string;
  description: string;
  baseFare: number;
  perKm: number;
  estimatedMinutes: number;
  seats: number;
  imageUrl: string;
}

export interface CreatorContent {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  creatorHandle: string;
  verified: boolean;
  title: string;
  previewText: string;
  fullContent?: string;
  isPremium: boolean;
  unlockPrice?: number;
  isUnlocked?: boolean;
  likes: number;
  tipsReceived: number;
  mediaUrl?: string;
  timestamp: string;
  admobBannerSlot?: boolean;
}

export interface VendorApplication {
  applicantId: string;
  legalEntityName: string;
  tradingName: string;
  businessType: 'Sole Proprietorship' | 'Registered Corporation' | 'LLC' | 'Partnership';
  businessRegistrationNumber: string;
  taxIdentificationNumber: string;
  category: VendorCategory;
  storeAddress: string;
  contactEmail: string;
  contactPhone: string;
  payoutAccountType: 'Bank Account' | 'Mobile Banking';
  accountNumber: string;
  documentType: 'Trade License' | 'National ID / Passport' | 'Certificate of Incorporation';
  documentFileName: string;
  acceptedTerms: boolean;
}

export interface AppNotification {
  id: string;
  type: 'order' | 'booking' | 'social' | 'system' | 'wallet';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionTab?: PortalTab;
  avatar?: string;
  linkId?: string;
}

// User Account Settings Interfaces
export interface SavedAddress {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  postalCode?: string;
  tag: 'home' | 'office' | 'other';
  isDefault: boolean;
  notes?: string;
}

export interface PaymentMethodItem {
  id: string;
  type: 'visa' | 'mastercard' | 'bkash' | 'nagad';
  holderName: string;
  last4?: string;
  walletNumber?: string;
  expiry?: string;
  isDefault: boolean;
}

export interface UserNotificationPreferences {
  orderUpdatesEmail: boolean;
  orderUpdatesSms: boolean;
  deliveryPushAlerts: boolean;
  socialInteractions: boolean;
  promotionalOffers: boolean;
  securityLoginAlerts: boolean;
}

// Vendor Account Settings Interfaces
export interface VendorStoreSettings {
  storeName: string;
  category: VendorCategory;
  tagline: string;
  description: string;
  helplinePhone: string;
  supportEmail: string;
  storeAddress: string;
  logoUrl?: string;
  bannerUrl?: string;
  tradeLicenseNumber: string;
  tinNumber: string;
  vatRegistrationNumber: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  mobileWalletProvider?: 'bKash Merchant' | 'Nagad Merchant' | 'Rocket';
  mobileWalletNumber?: string;
  payoutFrequency: 'Daily' | 'Weekly (Every Monday)' | 'Bi-Weekly' | 'Monthly';
  deliveryRadiusKm: number;
  minOrderAmount: number;
  freeDeliveryThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  estimatedDeliveryEta: string;
  openingTime: string;
  closingTime: string;
  isHolidayMode: boolean;
  holidayMessage?: string;
  autoAcceptOrders: boolean;
}

