import React from 'react';
import { 
  Home, ShoppingBag, Truck, LayoutDashboard, 
  User, Shield, Box, MessageSquare, History, 
  Settings, Zap, Store, MapPin, LayoutGrid, Bell, Grid3x3, Compass, Newspaper, PlayCircle
} from 'lucide-react';
import { AppRole as UserRole } from '@/config/roles.config';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: any;
  roles: UserRole[];
  badge?: string;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  { 
    id: 'home', 
    label: 'Home Feed', 
    path: '/', 
    icon: Home, 
    roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider', 'guest'] 
  },
  { 
    id: 'local', 
    label: 'Nearby', 
    path: '/local', 
    icon: MapPin, 
    roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider', 'guest'] 
  },
  { 
    id: 'news', 
    label: 'News', 
    path: '/news', 
    icon: Newspaper, 
    roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider', 'guest'] 
  },
  { 
    id: 'marketplace', 
    label: 'Marketplace', 
    path: '/marketplace', 
    icon: ShoppingBag, 
    roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider', 'guest'] 
  },
  { 
    id: 'services', 
    label: 'Services', 
    path: '/services', 
    icon: Zap, 
    roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider', 'guest'] 
  },
  { 
    id: 'logistics', 
    label: 'Logistics', 
    path: '/logistics', 
    icon: Truck, 
    roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider', 'guest'] 
  },
  { 
    id: 'orders', 
    label: 'My Orders', 
    path: '/orders', 
    icon: History, 
    roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] 
  },
  { 
    id: 'seller', 
    label: 'Seller Hub', 
    path: '/seller', 
    icon: Store, 
    roles: ['seller', 'business', 'admin'] 
  },
  { 
    id: 'admin', 
    label: 'Governance', 
    path: '/admin', 
    icon: Shield, 
    roles: ['admin'] 
  },
  { 
    id: 'profile', 
    label: 'Identity', 
    path: '/profile', 
    icon: User, 
    roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] 
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    path: '/settings', 
    icon: Settings, 
    roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider', 'guest'] 
  },
];

export const MOBILE_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', path: '/', icon: Home, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin'] },
  { id: 'market', label: 'Market', path: '/market', icon: Store, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin'] },
  { id: 'services', label: 'Service', path: '/services', icon: Zap, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin'] },
  { id: 'video', label: 'Video', path: '/video', icon: PlayCircle, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin'] },
  { id: 'explore', label: 'Explore', path: '/portals', icon: Compass, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin'] },
];
