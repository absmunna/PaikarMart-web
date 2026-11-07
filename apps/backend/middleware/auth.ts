import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppRole, RoleGroup, getRoleGroup, getPermissionsForRole } from "../../frontend/src/core/config/roles.config";
import { JWT_SECRET } from "../config/env";
import { prisma, db } from "../config/database";

export { JWT_SECRET };

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

/**
 * 🛡️ Strict Auth Middleware
 * Requires a valid, cryptographically verified JWT or Firebase ID token.
 * Never trusts unverified jwt.decode claims or client-injected roles.
 */
export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Empty token provided" });
  }

  let verifiedPayload: any = null;

  // 1. Attempt verification with JWT_SECRET
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    // Ensure refresh tokens cannot be used as access tokens
    if (payload.type && payload.type === 'refresh') {
      return res.status(401).json({ error: "Unauthorized: Invalid token type for API access" });
    }
    verifiedPayload = payload;
  } catch (error) {
    // 2. If JWT verification fails, attempt verification with Firebase Admin SDK
    try {
      const { firebaseAuthInstance } = await import("../config/firebase");
      if (firebaseAuthInstance) {
        const firebaseUser = await firebaseAuthInstance.verifyIdToken(token);
        verifiedPayload = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          phone: firebaseUser.phone_number,
          name: firebaseUser.name,
          // Custom claims from Firebase Admin SDK are trusted
          role: firebaseUser.role,
          roles: firebaseUser.roles
        };
      }
    } catch (fbError) {
      // Firebase verification also failed
    }
  }

  if (!verifiedPayload || (!verifiedPayload.id && !verifiedPayload.sub && !verifiedPayload.uid)) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired access token" });
  }

  const userId = verifiedPayload.id || verifiedPayload.sub || verifiedPayload.uid;

  // 3. Resolve canonical user role from database if connected
  let userRole: AppRole = 'buyer';
  let dbUserEmail = verifiedPayload.email;
  let dbUserPhone = verifiedPayload.phone;
  let dbUserName = verifiedPayload.name;

  if (db.isConnected()) {
    try {
      const dbUser = await prisma.user.findUnique({ where: { id: userId } });
      if (dbUser) {
        userRole = (dbUser.role as AppRole) || 'buyer';
        dbUserEmail = dbUser.email || dbUserEmail;
        dbUserPhone = dbUser.phone || dbUserPhone;
        dbUserName = dbUser.fullName || dbUser.name || dbUserName;
      } else {
        // Default newly seen verified users to buyer role (unless token is signed server JWT or Firebase claim)
        userRole = (verifiedPayload.role as AppRole) || 'buyer';
      }
    } catch (dbErr) {
      userRole = (verifiedPayload.role as AppRole) || 'buyer';
    }
  } else {
    userRole = (verifiedPayload.role as AppRole) || 'buyer';
  }

  const roleGroup: RoleGroup = getRoleGroup(userRole);
  const permissions: string[] = getPermissionsForRole(userRole);

  req.user = {
    id: userId,
    email: dbUserEmail,
    phone: dbUserPhone,
    name: dbUserName,
    role: userRole,
    roles: [userRole],
    roleGroup,
    permissions
  };

  return next();
};

/**
 * 🔓 Optional Auth Middleware
 * Evaluates authorization header if provided. Attaches req.user ONLY if cryptographically verified.
 * Never sets req.user using unverified claims or fallback mocks.
 */
export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    if (token) {
      let verifiedPayload: any = null;

      try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        if (!payload.type || payload.type !== 'refresh') {
          verifiedPayload = payload;
        }
      } catch (err) {
        try {
          const { firebaseAuthInstance } = await import("../config/firebase");
          if (firebaseAuthInstance) {
            const firebaseUser = await firebaseAuthInstance.verifyIdToken(token);
            verifiedPayload = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              phone: firebaseUser.phone_number,
              name: firebaseUser.name,
              role: firebaseUser.role
            };
          }
        } catch (fbErr) {}
      }

      if (verifiedPayload && (verifiedPayload.id || verifiedPayload.sub || verifiedPayload.uid)) {
        const userId = verifiedPayload.id || verifiedPayload.sub || verifiedPayload.uid;
        let userRole: AppRole = (verifiedPayload.role as AppRole) || 'buyer';
        let dbUserEmail = verifiedPayload.email;
        let dbUserPhone = verifiedPayload.phone;
        let dbUserName = verifiedPayload.name;

        if (db.isConnected()) {
          try {
            const dbUser = await prisma.user.findUnique({ where: { id: userId } });
            if (dbUser) {
              userRole = (dbUser.role as AppRole) || 'buyer';
              dbUserEmail = dbUser.email || dbUserEmail;
              dbUserPhone = dbUser.phone || dbUserPhone;
              dbUserName = dbUser.fullName || dbUser.name || dbUserName;
            }
          } catch {}
        }

        const roleGroup: RoleGroup = getRoleGroup(userRole);
        const permissions: string[] = getPermissionsForRole(userRole);

        req.user = {
          id: userId,
          email: dbUserEmail,
          phone: dbUserPhone,
          name: dbUserName,
          role: userRole,
          roles: [userRole],
          roleGroup,
          permissions
        };
      }
    }
  }
  next();
};

export { verifySuperAdmin } from './rbac';
export const authMiddleware = requireAuth;

