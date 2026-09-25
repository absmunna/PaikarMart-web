import { UserRole } from './roles';

export type Permission = 
  | 'view_dashboard' 
  | 'manage_products' 
  | 'manage_orders' 
  | 'manage_users'
  | 'view_analytics'
  | 'post_content'
  | 'product.create'
  | 'seller.dashboard'
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
  [UserRole.SELLER]: ['manage_products', 'view_orders', 'view_analytics', 'seller.dashboard', 'product.create'],
  [UserRole.BUYER]: ['place_orders', 'view_products', 'post_content'],
};

export function hasPermission(role: string, permission: Permission): boolean {
  if (role === 'admin' || role === 'super_admin') return true;
  const list = Permissions[role] || [];
  if (list.includes('all') || list.includes(permission)) return true;
  if (role.includes('seller') || role === 'factory' || role === 'wholesale') {
    if (['manage_products', 'manage_orders', 'view_dashboard', 'seller.dashboard', 'product.create'].includes(permission)) {
      return true;
    }
  }
  return false;
}

export function hasAnyPermission(role: string, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(role, p));
}

export function hasAllPermissions(role: string, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(role, p));
}

export const canAccess = (role: UserRole, permission: string) => {
  return hasPermission(role, permission);
};
