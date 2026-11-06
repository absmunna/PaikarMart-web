export type Permission = 
  | 'view_dashboard' 
  | 'manage_products' 
  | 'manage_orders' 
  | 'manage_users'
  | 'view_analytics'
  | 'post_content'
  | 'seller.dashboard';

export function hasPermission(role: string, permission: Permission): boolean {
  if (role === 'admin' || role === 'super_admin') return true;
  if (role === 'seller' || role.includes('seller') || role === 'factory' || role === 'wholesale' || role === 'business') {
    if (['manage_products', 'manage_orders', 'view_dashboard'].includes(permission)) return true;
  }
  if (role === 'buyer' || role === 'user' || role === 'guest') {
    if (['view_dashboard', 'post_content'].includes(permission)) return true;
  }
  return false;
}

export function hasAnyPermission(role: string, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(role, p));
}

export function hasAllPermissions(role: string, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(role, p));
}
