import type { AppRole } from '@/config/roles.config';

/** @deprecated Prefer AppRole from @/config/roles.config */
export type UserRole = AppRole;
export type SellerType = "wholesale" | "retail" | "service" | "content_creator";

export interface User {
  id: string; // internal-only user identity
  name: string;
  handle: string; // public URL identity, like @username
  avatar: string;
  isSeller?: boolean;
  followers?: number;
  rating?: number;
  about?: string;
  
  // System behavior controls
  role?: AppRole;
  sellerType?: SellerType;
  shopName?: string;
  shopCover?: string;
  shopLogo?: string;
  isVerified?: boolean;
}
