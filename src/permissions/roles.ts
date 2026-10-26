import { AppRole, ROLE_HIERARCHY, RoleConfig } from '@/config/roles.config';

export type { AppRole, RoleConfig };
export { ROLE_HIERARCHY };

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

export const ROLE_LABELS: Record<AppRole, string> = Object.entries(ROLE_HIERARCHY).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: value.labelBn || value.labelEn
  }),
  {} as Record<AppRole, string>
);
