import { AppRole } from '../permissions/roles';

export interface RoleRouteConfig {
  role: AppRole;
  homePath: string;
  allowedPortals: string[];
}

export const ROLE_ROUTE_CONFIG: Partial<Record<AppRole, RoleRouteConfig>> = {
  buyer: {
    role: 'buyer',
    homePath: '/',
    allowedPortals: ['b2c', 'pk-shop', 'services', 'ride', 'nearby', 'grocery', 'pharmacy', 'electronics'],
  },
  seller: {
    role: 'seller',
    homePath: '/dashboard',
    allowedPortals: ['b2c', 'wholesale', 'services', 'nearby', 'grocery', 'pharmacy', 'electronics'],
  },
  wholesale: {
    role: 'wholesale',
    homePath: '/wholesale',
    allowedPortals: ['wholesale', 'b2b'],
  },
  factory: {
    role: 'factory',
    homePath: '/wholesale',
    allowedPortals: ['wholesale', 'export', 'b2b'],
  },
  nearby_shop: {
    role: 'nearby_shop',
    homePath: '/portal/nearby',
    allowedPortals: ['nearby', 'grocery', 'pharmacy', 'electronics'],
  },
  service_provider: {
    role: 'service_provider',
    homePath: '/portal/services',
    allowedPortals: ['services'],
  },
  rider: {
    role: 'rider',
    homePath: '/portal/ride',
    allowedPortals: ['ride'],
  },
  digital_seller: {
    role: 'digital_seller',
    homePath: '/portal/digital',
    allowedPortals: ['digital', 'video'],
  },
  moderator: {
    role: 'moderator',
    homePath: '/dashboard/moderator',
    allowedPortals: ['all'],
  },
  admin: {
    role: 'admin',
    homePath: '/dashboard/admin',
    allowedPortals: ['all'],
  },
  super_admin: {
    role: 'super_admin',
    homePath: '/dashboard/admin',
    allowedPortals: ['all'],
  },
  rural: {
    role: 'rural',
    homePath: '/portal/nearby',
    allowedPortals: ['nearby'],
  },
};
