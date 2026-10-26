import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppRole, RoleGroup, getRoleGroup, getPermissionsForRole } from "../../frontend/src/core/config/roles.config";
import { JWT_SECRET } from "../config/jwt";

export interface AuthenticatedUser {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  role: AppRole;
  roles: AppRole[];
  roleGroup: RoleGroup;
  permissions: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const role: AppRole = (decoded.role || 'buyer') as AppRole;
    const roles: AppRole[] = (decoded.roles || [role]) as AppRole[];
    const roleGroup: RoleGroup = (decoded.roleGroup || getRoleGroup(role)) as RoleGroup;
    const permissions: string[] = decoded.permissions || getPermissionsForRole(role);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      phone: decoded.phone,
      name: decoded.name,
      role,
      roles,
      roleGroup,
      permissions
    };
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const role: AppRole = (decoded.role || 'buyer') as AppRole;
      const roles: AppRole[] = (decoded.roles || [role]) as AppRole[];
      const roleGroup: RoleGroup = (decoded.roleGroup || getRoleGroup(role)) as RoleGroup;
      const permissions: string[] = decoded.permissions || getPermissionsForRole(role);

      req.user = {
        id: decoded.id,
        email: decoded.email,
        phone: decoded.phone,
        name: decoded.name,
        role,
        roles,
        roleGroup,
        permissions
      };
    } catch (error) {
      // Ignore errors for optional authentication
    }
  }
  next();
};

export { verifySuperAdmin } from './rbac';
export { JWT_SECRET };
