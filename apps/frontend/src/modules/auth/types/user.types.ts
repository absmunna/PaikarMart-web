export type UserRole = "user" | "seller" | "moderator" | "admin";
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
  role?: UserRole;
  sellerType?: SellerType;
  shopName?: string;
  shopCover?: string;
  shopLogo?: string;
  isVerified?: boolean;
}
