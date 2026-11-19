import fs from 'fs';
import path from 'path';
import type { NextFunction, Request, Response } from 'express';
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

export interface VerifiedFirebaseAuth {
  uid: string;
  email?: string;
  emailVerified?: boolean;
  role?: string;
  roles?: string[];
}

function resolveFirebaseProjectId(): string | null {
  if (process.env.FIREBASE_PROJECT_ID) {
    return process.env.FIREBASE_PROJECT_ID;
  }
  const candidates = [
    path.resolve(process.cwd(), 'firebase-applet-config.json'),
    path.resolve(process.cwd(), '../firebase-applet-config.json'),
  ];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const parsed = JSON.parse(fs.readFileSync(candidate, 'utf8')) as { projectId?: string };
        if (parsed.projectId && parsed.projectId !== 'remixed-project-id') {
          return parsed.projectId;
        }
      }
    } catch {
      // Ignore malformed optional config file
    }
  }
  return null;
}

function getFirebaseAdminAuth() {
  const projectId = resolveFirebaseProjectId();
  if (!projectId) return null;
  const app = getApps()[0] || initializeApp({
    credential: applicationDefault(),
    projectId,
  });
  return getAuth(app);
}

export function isPrivilegedRole(auth?: VerifiedFirebaseAuth): boolean {
  if (!auth) return false;
  const privileged = new Set(['admin', 'super_admin', 'moderator']);
  if (auth.role && privileged.has(auth.role)) return true;
  return Array.isArray(auth.roles) && auth.roles.some((r) => privileged.has(r));
}

export async function requireFirebaseAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header('authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }
  try {
    const firebaseAuth = getFirebaseAdminAuth();
    if (!firebaseAuth) {
      res.status(503).json({ error: 'Firebase Admin authentication is not configured.' });
      return;
    }
    const decoded = await firebaseAuth.verifyIdToken(match[1], true);
    const claims = decoded as typeof decoded & { role?: string; roles?: string[] };
    res.locals.auth = {
      uid: decoded.uid,
      email: decoded.email,
      emailVerified: decoded.email_verified,
      role: claims.role,
      roles: Array.isArray(claims.roles) ? claims.roles : undefined,
    } satisfies VerifiedFirebaseAuth;
    next();
  } catch (error) {
    const code = (error as { code?: string })?.code || '';
    if (code.startsWith('app/') || code.includes('network')) {
      res.status(503).json({ error: 'Firebase Admin credentials or verification service are unavailable.' });
      return;
    }
    res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

export async function optionalFirebaseAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header('authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    next();
    return;
  }
  try {
    const firebaseAuth = getFirebaseAdminAuth();
    if (!firebaseAuth) {
      next();
      return;
    }
    const decoded = await firebaseAuth.verifyIdToken(match[1], true);
    const claims = decoded as typeof decoded & { role?: string; roles?: string[] };
    res.locals.auth = {
      uid: decoded.uid,
      email: decoded.email,
      emailVerified: decoded.email_verified,
      role: claims.role,
      roles: Array.isArray(claims.roles) ? claims.roles : undefined,
    } satisfies VerifiedFirebaseAuth;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}
