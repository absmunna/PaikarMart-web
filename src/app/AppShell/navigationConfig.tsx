import React from 'react';
import { 
  Home, ShoppingBag, Truck, LayoutDashboard, 
  User, Shield, Box, MessageSquare, History, 
  Settings, Zap, Store, MapPin, LayoutGrid, Bell, Grid3x3, Compass, Newspaper
} from 'lucide-react';
import { UserRole } from './routeConfig';

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

function AppsNavIcon(props: any) {
    return <div className="w-12 h-12 bg-cyan-400 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-cyan-400/20"><Grid3x3 {...props} /></div>;
}

export const MOBILE_NAV_ITEMS: NavItem[] = [
  { id: 'apps', label: 'Apps', path: '/portals', icon: Grid3x3, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin'] },
  { id: 'explore', label: 'Explore', path: '/categories', icon: Compass, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin'] },
  { id: 'home', label: 'Home', path: '/', icon: Home, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin'] },
  { id: 'market', label: 'Market', path: '/marketplace', icon: ShoppingBag, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin'] },
  { id: 'profile', label: 'Profile', path: '/profile', icon: User, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin'] },
];
