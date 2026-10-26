import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'guest' | 'buyer' | 'seller' | 'admin' | 'moderator';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  portals?: string[];
  isVerified?: boolean;
  phone?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (profile: any) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (profile) => set({
        user: {
          id: `usr_${Math.random().toString(36).substr(2, 9)}`,
          email: profile.email || 'guest@paikarmart.com',
          name: profile.fullName || profile.name || 'User',
          role: profile.role || 'buyer',
          avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.fullName || 'User'}`
        },
        isAuthenticated: true
      }),

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      logout: () => set({ user: null, isAuthenticated: false }),

      updateProfile: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
      }))
    }),
    {
      name: 'pm-auth-storage',
    }
  )
);
