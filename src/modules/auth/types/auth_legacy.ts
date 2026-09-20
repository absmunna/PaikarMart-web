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
  roles: UserRole[];
  role?: UserRole; // legacy
  businessProfiles?: BusinessProfile[];
  displayName?: string;
  avatar?: string;
  portals?: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (user: User, token: string) => void;
  register: (user: User, token: string) => void;
  logout: () => void;
}

export interface AuthToken { access: string; refresh: string; }
