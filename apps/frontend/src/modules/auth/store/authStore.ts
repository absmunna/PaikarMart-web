import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppRole } from '@/config/roles.config';

/** @deprecated Prefer AppRole from @/config/roles.config — kept as alias for store consumers */
export type UserRole = AppRole;

export interface User {
  id: string;
  name: string;
  fullName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  avatarUrl?: string;
  role: AppRole;
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
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      login: (user, token) => set({ user, token: token || 'mock-token', isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateProfile: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
      })),
    }),
    {
      name: 'pm-auth-storage',
    }
  )
);
