import { UserRole } from '../permissions/roles';

export interface User {
  id: string;
  email: string;
  role: UserRole | string;
  name?: string;
  displayName?: string;
  avatar?: string;
  phone?: string;
  portals?: string[];
  [key: string]: any;
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
