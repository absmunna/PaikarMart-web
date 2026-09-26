export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  phoneVerified?: boolean;
  avatarUrl?: string;
  avatar?: string;
  roles?: string[];
  role?: string;
  createdAt?: any;
  updatedAt?: any;
  joinDate?: string;
  trustScore?: number;
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  verificationLevels?: any[];
  reputation?: any;
  activities?: any[];
  [key: string]: any;
}

export interface UserCapabilities {
  canSell?: boolean;
  canBuy?: boolean;
  canDeliver?: boolean;
  canProvideService?: boolean;
  canModerate?: boolean;
  canAdminister?: boolean;
  [key: string]: any;
}

export type { UserProfile as default };
