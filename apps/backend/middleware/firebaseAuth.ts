import { Request, Response, NextFunction } from 'express';
import { firebaseAuthInstance } from '../config/firebase';

export const firebaseAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];
  const isProd = process.env.NODE_ENV === 'production';

  // 1. Validation for Firebase Admin initialization
  if (!firebaseAuthInstance) {
    if (!isProd) {
      console.warn('⚠️ Firebase Auth: Using mock development user (local mode active)');
      (req as any).user = { uid: 'dev-user-123', email: 'dev@paikarmart.com', role: 'buyer' };
      return next();
    }
    console.error('❌ FATAL: Firebase Admin not initialized in production environment.');
    return res.status(500).json({ error: 'Identity verification service unavailable.' });
  }

  try {
    // 2. Authoritative UID extraction from decoded Firebase Token
    const decodedToken = await firebaseAuthInstance.verifyIdToken(token);
    
    // Explicitly map verified identity to request object
    (req as any).user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      phone_number: decodedToken.phone_number,
      name: decodedToken.name,
      picture: decodedToken.picture,
      // Note: We ignore custom claims like 'role' from the token for DB synchronization
      // Role MUST be verified against the Supabase DB in the controller/permission middleware.
    };
    
    next();
  } catch (error: any) {
    console.error('Firebase ID Token verification failed:', error.message);
    res.status(401).json({ error: 'Unauthorized: Invalid or expired identity token' });
  }
};
export const verifyFirebaseToken = firebaseAuth;
