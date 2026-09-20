import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth";
import { AppRole, RoleGroup, getRoleGroup } from "@/config/roles.config";

export type { AuthenticatedRequest };

/**
 * 🛡️ RBAC Middleware: Require specific role or one of multiple roles.
 * Super admins bypass this check automatically.
 */
export const requireRole = (requiredRoles: string | string[]) => {
  const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication is required to access this resource."
      });
    }

    const userRoles = req.user.roles || (req.user.role ? [req.user.role] : []);

    // Super admin bypass
    if (userRoles.includes("super_admin" as AppRole)) {
      return next();
    }

    const hasMatch = rolesArray.some(role => userRoles.includes(role as AppRole));
    if (!hasMatch) {
      return res.status(403).json({
        error: "Forbidden",
        message: `Requires one of the following roles: ${rolesArray.join(", ")}`,
        currentRole: req.user.role,
        requiredRoles: rolesArray,
        timestamp: new Date().toISOString()
      });
    }

    next();
  };
};

/**
 * 🏷️ RBAC Middleware: Require specific role group ('customer' | 'vendor' | 'admin').
 * Allows distinguishing clearly between customers, merchants/vendors, and admins.
 */
export const requireRoleGroup = (requiredGroups: RoleGroup | RoleGroup[]) => {
  const groupsArray = Array.isArray(requiredGroups) ? requiredGroups : [requiredGroups];

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication is required."
      });
    }

    // Super admin bypass
    if (req.user.role === "super_admin" || req.user.roles?.includes("super_admin" as AppRole)) {
      return next();
    }

    const userGroup = req.user.roleGroup || getRoleGroup(req.user.role);

    // If route allows customer, vendor or admin can also view customer-facing resources
    const isCustomerAllowed = groupsArray.includes("customer");
    const isMatched = groupsArray.includes(userGroup) || (isCustomerAllowed && (userGroup === "vendor" || userGroup === "admin"));

    if (!isMatched) {
      return res.status(403).json({
        error: "Forbidden",
        message: `Access restricted. Required account type: ${groupsArray.join(" or ")}`,
        userGroup,
        requiredGroups: groupsArray,
        timestamp: new Date().toISOString()
      });
    }

    next();
  };
};

/**
 * 🛒 RBAC Shorthand: Require Customer or higher
 */
export const requireCustomer = requireRoleGroup(["customer", "vendor", "admin"]);

/**
 * 🛍️ RBAC Shorthand: Require Vendor (Merchants, Factories, Wholesalers, etc.)
 */
export const requireVendor = requireRoleGroup(["vendor", "admin"]);

/**
 * 🛡️ RBAC Shorthand: Require Administrator
 */
export const requireAdmin = requireRoleGroup(["admin"]);

/**
 * 🔒 RBAC Middleware: Require specific permission scope(s)
 */
export const requirePermission = (requiredPermissions: string | string[]) => {
  const permsArray = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication is required."
      });
    }

    // Super admin bypass
    if (req.user.role === "super_admin" || req.user.roles?.includes("super_admin" as AppRole)) {
      return next();
    }

    const userPermissions = req.user.permissions || [];
    const hasAll = permsArray.every(perm => userPermissions.includes(perm));

    if (!hasAll) {
      return res.status(403).json({
        error: "Forbidden",
        message: `Missing required permission scope(s): ${permsArray.join(", ")}`,
        missing: permsArray.filter(p => !userPermissions.includes(p)),
        timestamp: new Date().toISOString()
      });
    }

    next();
  };
};
