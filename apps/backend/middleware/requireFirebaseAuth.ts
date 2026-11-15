import type { NextFunction, Request, Response } from 'express';
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

function getFirebaseAdminAuth() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) return null;

  const app = getApps()[0] || initializeApp({
    credential: applicationDefault(),
    projectId,
  });

  return getAuth(app);
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
    };
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
