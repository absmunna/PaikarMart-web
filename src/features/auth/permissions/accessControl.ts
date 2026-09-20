import type { AppRole } from '@/config/roles.config';

const ROLE_RANK: Record<AppRole, number> = {
  guest: 0,
  buyer: 1,
  user: 1,
  rider: 1,
  rural: 1,
  content_creator: 2,
  seller: 3,
  retail_seller: 3,
  rural_seller: 3,
  food_seller: 3,
  grocery_seller: 3,
  digital_seller: 3,
  service_provider: 3,
  wholesale_seller: 4,
  wholesale: 4,
  business: 4,
  nearby_shop: 4,
  property_agent: 4,
  employer: 4,
  brand_seller: 5,
  b2b_seller: 5,
  factory_seller: 6,
  factory: 6,
  exporter: 6,
  importer: 6,
  moderator: 7,
  admin: 8,
  super_admin: 9
};

export function meetsRoleRequirement(current: AppRole, minimum: AppRole): boolean {
  return (ROLE_RANK[current] ?? 0) >= (ROLE_RANK[minimum] ?? 0);
}

export function canAccessPortal(role: AppRole, portal: string): boolean {
  if (role === 'super_admin' || role === 'admin') return true;
  
  const portalRoles: Record<string, AppRole[]> = {
    'seller': ['seller', 'retail_seller', 'wholesale_seller', 'factory_seller', 'b2b_seller', 'brand_seller'],
    'factory': ['factory', 'factory_seller'],
    'rider': ['rider'],
    'admin': ['admin', 'super_admin', 'moderator'],
  };

  if (portalRoles[portal]) {
    return portalRoles[portal].includes(role);
  }

  return true; // Public portals
}
