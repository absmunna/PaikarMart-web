import { requireRole } from "./permission";

export const RoleGuard = (requiredRoles: string | string[]) => {
  return requireRole(requiredRoles);
};

export default RoleGuard;
