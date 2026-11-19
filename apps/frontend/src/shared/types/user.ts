export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  phoneVerified?: boolean;
  avatar?: string;
  avatarUrl?: string;
  roles?: string[];
  role?: string;
  trustScore?: number;
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  verificationLevels?: any[];
  createdAt?: any;
  updatedAt?: any;
  [key: string]: any;
}
