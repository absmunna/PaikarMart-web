import type { AppRole as UserRole } from '@/features/auth/permissions/roles';

export interface BusinessProfile {
  id: string;
  name: string;
  type: string;
  verifiedLevel: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  name?: string; // Legacy/Alias for compatibility
  roles: UserRole[];   // Replaced single role with array
  role?: UserRole;     // Legacy fallback
  businessProfiles?: BusinessProfile[];
  avatarUrl?: string;
  avatar?: string; // Legacy/Alias for compatibility
  phone?: string;
  portals?: string[];
  isVerified?: boolean;
  verified?: boolean; // Legacy/Alias
  handle?: string;
  location?: string;
  bio?: string;
  trustScore?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
