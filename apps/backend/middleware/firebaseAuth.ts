import { Request, Response, NextFunction } from 'express';
import { firebaseAuthInstance } from '../config/firebase';

export const firebaseAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  // Development fallback
  if (!firebaseAuthInstance) {
    const isLocal = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
    if (isLocal) {
      console.warn('⚠️ Firebase Auth: Using mock development user (local mode active)');
      (req as any).user = { uid: 'dev-user-123', email: 'dev@paikarmart.com' };
      return next();
    }
    return res.status(500).json({ error: 'Firebase Admin not initialized (Credentials required in production)' });
  }

  try {
    const decodedToken = await firebaseAuthInstance.verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
export const verifyFirebaseToken = firebaseAuth;
