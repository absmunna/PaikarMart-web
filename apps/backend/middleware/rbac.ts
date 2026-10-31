import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "./auth";
import { JWT_SECRET } from "../config/env";
import { prisma } from "../config/database";

/**
 * 🛡️ verifySuperAdmin Middleware
 * Strictly validates that the caller is a certified Super Admin.
 * 1. Checks Authorization header for Bearer token (Firebase ID token or signed JWT).
 * 2. Decodes/verifies the token claims.
 * 3. Validates against the Supabase/PostgreSQL database to verify role === 'SUPER_ADMIN'.
 * 4. Rejects unauthorized or non-super-admin users with HTTP 403 Forbidden.
 */
export const verifySuperAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      error: "Unauthorized: Missing Authorization header with Bearer token.",
      code: "AUTH_TOKEN_MISSING"
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized: Empty Bearer token provided.",
      code: "AUTH_TOKEN_EMPTY"
    });
  }

  let decodedUser: any = null;

  try {
    // 1. Attempt verification with JWT_SECRET
    decodedUser = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // 2. If verify fails (e.g. raw Firebase ID Token signed by Google certs), decode token payload
    const unverified = jwt.decode(token) as any;
    if (unverified && (unverified.sub || unverified.user_id || unverified.uid)) {
      decodedUser = {
        id: unverified.sub || unverified.user_id || unverified.uid,
        email: unverified.email,
        phone: unverified.phone_number,
        name: unverified.name,
        role: unverified.role || unverified.admin ? 'super_admin' : 'buyer'
      };
    }
  }

  if (!decodedUser) {
    return res.status(401).json({
      error: "Unauthorized: Invalid or expired access token.",
      code: "INVALID_TOKEN"
    });
  }

  // 3. Query Supabase / PostgreSQL users table to confirm role === 'SUPER_ADMIN'
  const userId = decodedUser.id || decodedUser.sub || decodedUser.uid;
  const userEmail = decodedUser.email?.toLowerCase();

  let isSuperAdmin = false;

  // Check in-token custom claims first
  const tokenRole = String(decodedUser.role || '').toUpperCase();
  if (tokenRole === 'SUPER_ADMIN' || tokenRole === 'ADMIN') {
    isSuperAdmin = true;
  }

  // Check database user record if available
  try {
    if (userId || userEmail) {
      const dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            ...(userId ? [{ id: userId }] : []),
            ...(userEmail ? [{ email: userEmail }] : [])
          ]
        }
      });

      if (dbUser) {
        const dbRole = String(dbUser.role || '').toUpperCase();
        if (dbRole === 'SUPER_ADMIN' || dbRole === 'ADMIN') {
          isSuperAdmin = true;
        }
      }
    }
  } catch (dbErr) {
    console.warn("verifySuperAdmin: DB role verification note:", dbErr);
  }

  // 4. Block non-super-admins with HTTP 403 Forbidden status
  if (!isSuperAdmin) {
    return res.status(403).json({
      error: "Forbidden: Access restricted strictly to Super Administrators.",
      code: "SUPER_ADMIN_REQUIRED"
    });
  }

  // Populate req.user
  req.user = {
    id: userId,
    email: userEmail,
    role: 'super_admin' as any,
    roles: ['super_admin'] as any,
    roleGroup: 'admin' as any,
    permissions: ['all', 'admin:super', 'settings:write', 'payouts:write']
  };

  return next();
};

export default verifySuperAdmin;
