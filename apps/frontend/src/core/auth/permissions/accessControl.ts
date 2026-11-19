import type { AppRole } from "./roles";
import { ROLE_HIERARCHY } from "./roles";
import type { Permission } from "./permissions";
import { hasPermission, hasAnyPermission } from "./permissions";

/** True if role meets minimum required role level */
export function meetsRoleRequirement(userRole: AppRole, requiredRole: AppRole): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[requiredRole] ?? 0);
}

/** Portal access map — which roles can access which portal */
export const PORTAL_ACCESS: Record<string, AppRole[]> = {
  b2b:       ["wholesale", "factory", "admin", "super_admin"],
  wholesale: ["wholesale", "admin", "super_admin"],
  factory:   ["factory", "admin", "super_admin"],
  ride:      ["rider", "admin", "super_admin"],
  services:  ["service_provider", "admin", "super_admin"],
  digital:   ["digital_seller", "seller", "admin", "super_admin"],
  nearby:    ["nearby_shop", "rural", "admin", "super_admin"],
  admin:     ["admin", "super_admin"],
};

export function canAccessPortal(role: AppRole, portal: string): boolean {
  const allowed = PORTAL_ACCESS[portal];
  if (!allowed) return true; // public portal
  return allowed.includes(role);
}

/** Route-level permission map */
export const ROUTE_PERMISSIONS: Record<string, { roles?: AppRole[]; permission?: Permission; minRole?: AppRole }> = {
  "/seller":                { permission: "seller.dashboard" },
  "/seller/products/new":   { permission: "product.create" },
  "/seller/analytics":      { permission: "seller.analytics" },
  "/admin":                 { minRole: "admin" },
  "/admin/users":           { permission: "admin.users" },
  "/admin/settings":        { permission: "admin.settings" },
  "/admin/financials":      { permission: "admin.financials" },
  "/b2b":                   { permission: "portal.b2b" },
  "/logistics":             { permission: "logistics.view" },
  "/export":                { permission: "export.view" },
  "/wallet":                { minRole: "buyer" },
  "/orders":                { minRole: "buyer" },
  "/cart":                  { minRole: "buyer" },
  "/profile":               { minRole: "buyer" },
};

export function canAccessRoute(role: AppRole, path: string): boolean {
  const rule = ROUTE_PERMISSIONS[path];
  if (!rule) return true;
  if (rule.minRole && !meetsRoleRequirement(role, rule.minRole)) return false;
  if (rule.permission && !hasPermission(role, rule.permission)) return false;
  if (rule.roles && !rule.roles.includes(role)) return false;
  return true;
}
