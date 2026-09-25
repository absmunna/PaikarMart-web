export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin',
  NEARBY_SHOP = 'nearby_shop',
  SERVICE_PROVIDER = 'service_provider',
  DIGITAL_SELLER = 'digital_seller',
  RIDE_PROVIDER = 'ride_provider',
  MODERATOR = 'moderator',
}

export type { AppRole } from '@/config/roles.config';
export { ROLE_HIERARCHY } from '@/config/roles.config';
