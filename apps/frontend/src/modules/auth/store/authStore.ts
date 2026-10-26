import { create } from 'zustand';

export type UserRole = 'buyer' | 'seller' | 'admin' | 'super_admin' | 'moderator' | 'nearby_shop' | 'service_provider';

export interface User {
  id: string;
  name: string;
  fullName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  avatarUrl?: string;
  role: UserRole;
  isVerified?: boolean;
  portals?: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token?: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  (set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: false }),
    setToken: (token) => set({ token, isAuthenticated: false }),
    login: (user, token) => set({ user, token: token || null, isAuthenticated: Boolean(token) }),
    logout: () => set({ user: null, token: null, isAuthenticated: false }),
    updateProfile: (data) => set((state) => ({
      user: state.user ? { ...state.user, ...data } : null
    })),
  })
);
