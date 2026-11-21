/**
 * Auth module roles — re-export single source of truth.
 * Canonical: @/config/roles.config (AppRole) + @/permissions/roles (UserRole enum)
 */
import { AppRole, ROLE_HIERARCHY } from '@/config/roles.config';

export type { AppRole };
export { ROLE_HIERARCHY };
export { UserRole } from '@/permissions/roles';

export const ROLE_LABELS: Record<string, string> = Object.entries(ROLE_HIERARCHY).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: value.labelBn || value.labelEn
  }),
  {} as Record<string, string>
);
