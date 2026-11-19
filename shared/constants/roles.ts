export const ROLES = {
  ADMIN: 'admin',
  MERCHANT: 'merchant',
  BUYER: 'buyer',
  SELLER: 'seller',
  SUPER_ADMIN: 'super_admin',
  VENDOR: 'vendor',
  NEARBY_SHOP: 'nearby_shop',
  SERVICE_PROVIDER: 'service_provider'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
