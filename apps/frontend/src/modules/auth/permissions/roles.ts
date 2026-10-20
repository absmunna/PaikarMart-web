import { AppRole, ROLE_HIERARCHY } from '@/config/roles.config';

export type { AppRole };
export { ROLE_HIERARCHY };

export const ROLE_LABELS: Record<AppRole, string> = Object.entries(ROLE_HIERARCHY).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: value.labelBn || value.labelEn
  }),
  {} as Record<AppRole, string>
);
