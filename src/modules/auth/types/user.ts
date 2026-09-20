/**
 * Paikar Mart - Role-Based Authentication & Verification Type Definitions
 * 
 * This file maintains the type definitions, interfaces, and permissions schemas
 * for Paikar Mart's Progressive Verification & Role-Permission Matrix.
 * 
 * Consistent with our hybrid social e-commerce model, a single user profile 
 * can possess multiple roles simultaneously to allow fluid B2B, B2C, Riders, 
 * and Local Service portal access.
 */

export type UserRole =
  | "guest"
  | "buyer"
  | "seller"
  | "rider"
  | "service_provider"
  | "moderator"
  | "admin"
  | "super_admin";

export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

export type DocumentType =
  | "NID"
  | "TRADE_LICENSE"
  | "DRIVING_LICENSE"
  | "VEHICLE_REGISTRATION"
  | "ESTABLISHMENT_CERTIFICATE";

/**
 * Core User Permissions mapping directly from our verification tiers
 */
export type AppPermission =
  // Social & Content Permissions
  | "CAN_VIEW_FEED"
  | "CAN_POST_COMMENT"
  | "CAN_CREATE_POST"
  | "CAN_POST_REELS"
  | "CAN_MODERATE_CHAT"
  
  // E-Commerce Permissions (B2C & B2B)
  | "CAN_BUY"
  | "CAN_SELL_RETAIL"
  | "CAN_SELL_WHOLESALE"
  | "CAN_MANAGE_INVENTORY"
  | "CAN_SUBMIT_BID"
  | "CAN_POST_DEMAND"
  
  // Ride-Sharing & Logistic Permissions
  | "CAN_ACCEPT_RIDES"
  | "CAN_DISPATCH_RIDER"
  | "CAN_DRIVE"
  
  // Service Provider Permissions
  | "CAN_LST_SERVICES"
  | "CAN_MANAGE_APPOINTMENTS"
  
  // System Administative Permissions
  | "CAN_ACCESS_DASHBOARD"
  | "CAN_VERIFY_DOCUMENTS"
  | "CAN_SYSTEM_CONFIG";

/**
 * -------------------------------------------------------------
 * 1. Progress Verification Tier Documents
 * -------------------------------------------------------------
 */
export interface VerificationDocument {
  id: string;
  userId: string;
  documentType: DocumentType;
  documentNumber: string;
  imageFrontUrl?: string;
  imageBackUrl?: string;
  status: VerificationStatus;
  statusComment?: string;
  submittedAt: string;
  verifiedAt?: string;
}

export interface UserTrustBadge {
  id: string;
  userId: string;
  badgeType: "verified" | "trusted_merchant" | "pro_rider" | "top_creator";
  issuedAt: string;
}

/**
 * -------------------------------------------------------------
 * 2. Role-Permission Matrix Interfaces
 * -------------------------------------------------------------
 */

/**
 * Guest Interface (Tier 0: Fully Read-Only, No Auth)
 */
export interface GuestUser {
  role: "guest";
  permissions: Extract<AppPermission, "CAN_VIEW_FEED">[];
  isAuthenticated: false;
}

/**
 * Buyer Interface (Tier 1: OTP Verified User with phone number)
 */
export interface BuyerProfile {
  id: string;
  phone: string;
  fullName: string;
  email?: string;
  avatarUrl?: string;
  role: "buyer";
  roles: UserRole[];
  permissions: Array<
    | "CAN_VIEW_FEED"
    | "CAN_POST_COMMENT"
    | "CAN_CREATE_POST"
    | "CAN_BUY"
    | "CAN_POST_DEMAND"
  >;
  verification: {
    status: VerificationStatus; // Generally "verified" once OTP matches
    phoneVerified: boolean;
  };
  coinsBalance: number; // PK Coins tracker
  createdAt: string;
}

/**
 * Seller Interface (Tier 2: Business details approved)
 */
export interface SellerProfile extends Omit<BuyerProfile, "role" | "permissions"> {
  role: "seller";
  permissions: Array<
    | "CAN_VIEW_FEED"
    | "CAN_POST_COMMENT"
    | "CAN_CREATE_POST"
    | "CAN_BUY"
    | "CAN_POST_DEMAND"
    | "CAN_POST_REELS"
    | "CAN_SELL_RETAIL"
    | "CAN_SELL_WHOLESALE"
    | "CAN_MANAGE_INVENTORY"
    | "CAN_SUBMIT_BID"
  >;
  sellerDetails: {
    shopName: string;
    tradeLicenseNo?: string;
    tradeLicenseImage?: string;
    physicalAddress: string;
    longitude?: number;
    latitude?: number;
    category: string;
    payoutMethod: {
      type: "bkash" | "nagad" | "bank";
      details: string; // Account Number, Branch details, etc.
    };
    rating: number;
    totalSales: number;
    isStoreVerified: boolean;
  };
}

/**
 * Ride-Sharer (Rider) Interface (Tier 3: Extreme Validation)
 */
export interface RiderProfile extends Omit<BuyerProfile, "role" | "permissions"> {
  role: "rider";
  permissions: Array<
    | "CAN_VIEW_FEED"
    | "CAN_BUY"
    | "CAN_ACCEPT_RIDES"
    | "CAN_DRIVE"
  >;
  riderDetails: {
    drivingLicenseNo: string;
    drivingLicenseExpiry: string;
    licenseFrontImage: string;
    licenseBackImage: string;
    vehicleType: "motorcycle" | "bicycle" | "car" | "rickshaw";
    vehiclePlateNumber?: string;
    vehicleRegistrationDetails?: string;
    liveLocation?: {
      latitude: number;
      longitude: number;
      updatedAt: string;
    };
    isRiderActive: boolean;
    rating: number;
    totalRidesCompleted: number;
    safetyComplianceChecked: boolean;
  };
}

/**
 * Service Provider Interface (Local services & digital services)
 */
export interface ServiceProviderProfile extends Omit<BuyerProfile, "role" | "permissions"> {
  role: "service_provider";
  permissions: Array<
    | "CAN_VIEW_FEED"
    | "CAN_POST_COMMENT"
    | "CAN_CREATE_POST"
    | "CAN_BUY"
    | "CAN_POST_DEMAND"
    | "CAN_LST_SERVICES"
    | "CAN_MANAGE_APPOINTMENTS"
  >;
  providerDetails: {
    serviceCategory: "home_made_food" | "pharmacy" | "hotel_restaurant" | "appliance_repair" | "salon" | "other";
    businessLocation: string;
    hasPhysicalShop: boolean;
    tradeLicenseNo?: string;
    verifiedAreasOfWork: string[]; // List of areas/postal-codes serviced
    rating: number;
    completedServices: number;
  };
}

/**
 * Unified Active Client User representation supporting all active matrix structures
 */
export type ActiveUserProfile = BuyerProfile | SellerProfile | RiderProfile | ServiceProviderProfile;
