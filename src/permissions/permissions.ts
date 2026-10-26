import { UserRole } from './roles';

export type Permission = 
  | 'all'
  | 'view_dashboard' 
  | 'manage_products' 
  | 'manage_orders' 
  | 'manage_users'
  | 'view_analytics'
  | 'post_content'
  | 'seller.dashboard'
  | 'product.create'
  | 'seller.analytics'
  | 'admin.users'
  | 'admin.settings'
  | 'admin.financials'
  | 'portal.b2b'
  | 'logistics.view'
  | 'export.view'
  | string;

export const Permissions: Record<string, string[]> = {
  [UserRole.ADMIN]: ['all'],
  [UserRole.MODERATOR]: ['moderate_content', 'view_analytics'],
  [UserRole.SELLER]: ['manage_products', 'view_orders', 'view_analytics', 'seller.dashboard', 'product.create', 'seller.analytics'],
  [UserRole.BUYER]: ['place_orders', 'view_products'],
};

export function hasPermission(role: string, permission: Permission): boolean {
  if (role === 'admin' || role === 'super_admin') return true;
  const perms = Permissions[role];
  if (perms) {
    if (perms.includes('all') || perms.includes(permission)) return true;
  }
  if (role === 'seller' || role.includes('seller') || role === 'factory' || role === 'wholesale' || role === 'business') {
    if (['manage_products', 'manage_orders', 'view_dashboard', 'seller.dashboard', 'product.create', 'seller.analytics'].includes(permission)) return true;
  }
  if (role === 'buyer' || role === 'user' || role === 'guest') {
    if (['view_dashboard', 'post_content', 'view_products'].includes(permission)) return true;
  }
  return false;
}

export function hasAnyPermission(role: string, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(role, p));
}

export const canAccess = (role: UserRole | string, permission: string) => {
  return hasPermission(role, permission);
};
