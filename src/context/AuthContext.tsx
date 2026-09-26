import { createContext, useContext } from 'react';
import { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading?: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  signOut?: () => void;
  [key: string]: any;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
