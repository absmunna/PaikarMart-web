import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, JWT_SECRET } from "./auth";
import { db, prisma } from "../config/database";

export const verifySuperAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      error: "Unauthorized: Missing Authorization header",
      code: "AUTH_TOKEN_MISSING"
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized: Empty access token",
      code: "AUTH_TOKEN_EMPTY"
    });
  }

  let userId: string | undefined;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded !== "string") {
      userId = typeof decoded.id === "string" ? decoded.id : decoded.sub;
    }
  } catch {
    return res.status(401).json({
      error: "Unauthorized: Invalid or expired access token",
      code: "INVALID_TOKEN"
    });
  }

  if (!userId) {
    return res.status(401).json({
      error: "Unauthorized: Token has no user identity",
      code: "INVALID_TOKEN_SUBJECT"
    });
  }

  if (!db.isConnected()) {
    return res.status(503).json({
      error: "Admin authorization is unavailable while the database is disconnected.",
      code: "AUTHORIZATION_UNAVAILABLE"
    });
  }

  try {
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser || dbUser.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden: Access restricted to administrators.",
        code: "ADMIN_REQUIRED"
      });
    }

    req.user = {
      id: dbUser.id,
      email: dbUser.email,
      role: "admin",
      roles: ["admin"],
      roleGroup: "admin",
      permissions: ["all", "admin:super", "settings:write", "payouts:write"]
    };

    return next();
  } catch {
    return res.status(503).json({
      error: "Admin authorization is temporarily unavailable.",
      code: "AUTHORIZATION_UNAVAILABLE"
    });
  }
};

export default verifySuperAdmin;
