import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppRole, RoleGroup, getRoleGroup, getPermissionsForRole } from "@/config/roles.config";

export const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_12345';

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
  } catch (error) {
    // In development mode, allow fallback if verification fails, to ensure UI doesn't break
    if (process.env.NODE_ENV !== "production") {
      console.warn("JWT verification failed, falling back to mock user in dev mode:", error);
      const role: AppRole = 'buyer';
      req.user = {
        id: "mock-user-id",
        role,
        roles: [role],
        roleGroup: 'customer',
        permissions: getPermissionsForRole(role)
      };
      return next();
    }
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

