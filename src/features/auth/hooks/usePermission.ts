import { useAuth } from "@/features/auth/AuthContext";
import type { AppRole } from "@/features/auth/permissions/roles";
import type { Permission } from "@/features/auth/permissions/permissions";
import {
  hasPermission, hasAnyPermission, hasAllPermissions,
} from "@/features/auth/permissions/permissions";
import { meetsRoleRequirement, canAccessPortal } from "@/features/auth/permissions/accessControl";

/**
 * Central permission hook — use anywhere in the UI to gate features.
 *
 * @example
 * const { can, is, hasMinRole } = usePermission();
 * if (can("product.create")) { ... }
 * if (is("admin"))           { ... }
 * if (hasMinRole("seller"))  { ... }
 */
export function usePermission() {
  const { role, isAuthenticated } = useAuth();
  const appRole = (role ?? "guest") as AppRole;

  return {
    role: appRole,
    isAuthenticated,

    /** Check single permission */
    can: (p: Permission) => hasPermission(appRole, p),

    /** Check if user has ANY of the given permissions */
    canAny: (ps: Permission[]) => hasAnyPermission(appRole, ps),

    /** Check if user has ALL of the given permissions */
    canAll: (ps: Permission[]) => hasAllPermissions(appRole, ps),

    /** Check exact role match (OR) */
    is: (...roles: AppRole[]) => roles.includes(appRole),

    /** Check if role meets minimum hierarchy level */
    hasMinRole: (minRole: AppRole) => meetsRoleRequirement(appRole, minRole),

    /** Check portal access */
    canAccessPortal: (portal: string) => canAccessPortal(appRole, portal),

    // Convenience shorthands
    isAdmin:    meetsRoleRequirement(appRole, "admin"),
    isSeller:   hasPermission(appRole, "seller.dashboard"),
    isWholesale: appRole === "wholesale",
    isFactory:  appRole === "factory",
    isRider:    appRole === "rider",
    isRural:    appRole === "rural",
    isBuyer:    meetsRoleRequirement(appRole, "buyer"),
  };
}
