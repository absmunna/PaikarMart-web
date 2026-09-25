import { create } from 'zustand';
import { AuthState, User } from '../../../types/auth';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('pm_token'),
  isAuthenticated: !!localStorage.getItem('pm_token'),
  login: (user: User, token: string) => {
    localStorage.setItem('pm_token', token);
    set({ user, token, isAuthenticated: true });
  },
  register: (user: User, token: string) => {
    localStorage.setItem('pm_token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('pm_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
