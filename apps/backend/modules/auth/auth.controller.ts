import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma, db } from '../../config/database';
import { JWT_SECRET } from '../../config/jwt';

export const register = async (_req: Request, res: Response) => {
  return res.status(503).json({
    error: 'Backend password registration is disabled. Configure a trusted authentication provider.'
  });
};

export const login = async (_req: Request, res: Response) => {
  return res.status(503).json({
    error: 'Backend password login is disabled. Configure a trusted authentication provider.'
  });
};

export const forgotPassword = async (_req: Request, res: Response) => {
  return res.status(503).json({ error: 'Password reset delivery is not configured.' });
};

export const sendOtp = async (_req: Request, res: Response) => {
  return res.status(503).json({ error: 'OTP delivery is not configured.' });
};

export const verifyOtp = async (_req: Request, res: Response) => {
  return res.status(503).json({ error: 'OTP verification is not configured.' });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Unauthorized or token expired' });
  }

  if (!decoded.id) {
    return res.status(401).json({ error: 'Unauthorized: Token has no user identity' });
  }

  if (!db.isConnected()) {
    return res.status(503).json({ error: 'User lookup is unavailable while the database is disconnected.' });
  }

  try {
    const dbUser = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!dbUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      id: dbUser.id,
      name: dbUser.fullName,
      email: dbUser.email,
      role: dbUser.role
    });
  } catch {
    return res.status(503).json({ error: 'User lookup is temporarily unavailable.' });
  }
};

export const syncUser = async (_req: Request, res: Response) => {
  return res.status(503).json({
    error: 'User synchronization is disabled until Firebase ID token verification is configured.'
  });
};

export const getDbStatus = async (req: Request, res: Response) => {
  res.json({
    connected: db.isConnected(),
    mode: db.isConnected() ? 'PostgreSQL (Supabase)' : 'Resilient Dev Mode',
    timestamp: new Date().toISOString()
  });
};
