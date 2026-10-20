import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth";
import { db } from "../config/database";

export interface PKShopTeamMember {
  id: string;
  userId?: string;
  email: string;
  phone?: string;
  name: string;
  role: 'STORE_MANAGER' | 'MODERATOR';
  permissions: string[];
  addedBy: string;
  createdAt: string;
}

// In-memory persistent registry for PK Shop Managers/Moderators (resilient when DB offline)
export const pkShopTeamRegistry: PKShopTeamMember[] = [
  {
    id: "pk-team-1",
    userId: "admin-master",
    email: "abs.munna1@gmail.com",
    name: "System Super Admin",
    role: "STORE_MANAGER",
    permissions: ["products:write", "orders:write", "inventory:write", "team:write"],
    addedBy: "system",
    createdAt: new Date().toISOString()
  }
];

export const isUserSuperAdmin = (req: AuthenticatedRequest): boolean => {
  if (!req.user) return false;
  const role = String(req.user.role || '').toLowerCase();
  const roles = (req.user.roles || []).map(r => String(r).toLowerCase());
  return role === 'admin' || role === 'super_admin' || roles.includes('admin') || roles.includes('super_admin');
};

export const isUserPKShopStaff = (req: AuthenticatedRequest): { isStaff: boolean; role?: string; permissions?: string[] } => {
  if (!req.user) return { isStaff: false };
  
  if (isUserSuperAdmin(req)) {
    return {
      isStaff: true,
      role: 'SUPER_ADMIN',
      permissions: ["products:write", "orders:write", "inventory:write", "team:write", "payouts:write"]
    };
  }

  const userEmail = req.user.email?.toLowerCase();
  const userId = req.user.id;
  const userPhone = req.user.phone;

  const member = pkShopTeamRegistry.find(m => 
    (userEmail && m.email.toLowerCase() === userEmail) ||
    (userId && m.userId === userId) ||
    (userPhone && m.phone === userPhone)
  );

  if (member) {
    return {
      isStaff: true,
      role: member.role,
      permissions: member.permissions
    };
  }

  return { isStaff: false };
};

/**
 * 🛡️ Verifies whether current user is Super Admin or PK Shop Staff (Store Manager / Moderator)
 */
export const verifyPKShopAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication token is required to access PK Shop Administration."
    });
  }

  const { isStaff, role, permissions } = isUserPKShopStaff(req);
  if (!isStaff) {
    return res.status(403).json({
      error: "Forbidden",
      message: "Access Denied: You do not possess Store Manager or Moderator privileges for PK Shop."
    });
  }

  // Attach PK Shop role context to request
  (req as any).pkShopRole = role;
  (req as any).pkShopPermissions = permissions;
  next();
};

/**
 * 🛡️ Strictly requires SUPER_ADMIN for team governance and financial operations
 */
export const verifyPKShopSuperAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication token is required."
    });
  }

  if (!isUserSuperAdmin(req)) {
    return res.status(403).json({
      error: "Forbidden",
      message: "Requires Super Admin credentials to manage PK Shop team members."
    });
  }

  next();
};
