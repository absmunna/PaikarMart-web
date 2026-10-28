import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { prisma } from '../../config/database';

/**
 * Interface for the Request object after authentication
 */
export interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Middleware to verify Firebase ID tokens and attach user info to the request.
 * 
 * 1. Extracts the Bearer token from the Authorization header.
 * 2. Verifies the token using Firebase Admin SDK.
 * 3. Synchronizes the user with the Prisma database (JIT registration).
 * 4. Attaches the decoded user and database profile to req.user.
 */
export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'No authorization header provided.' 
    });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    // 1. Verify token with Firebase Admin
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(idToken);

    // 2. Synchronize with Prisma Database (PostgreSQL/Supabase)
    // Check if user exists, otherwise create a new record
    let userProfile = await prisma.user.findUnique({
      where: { id: decodedToken.uid }
    });

    if (!userProfile) {
      try {
        userProfile = await prisma.user.create({
          data: {
            id: decodedToken.uid,
            email: decodedToken.email || `${decodedToken.uid}@paikarmart.com`,
            fullName: decodedToken.name || decodedToken.email?.split('@')[0] || 'Paikar Mart User',
            phone: decodedToken.phone_number || null,
            role: 'buyer', // Default role
            isVerified: true
          }
        });

        // Initialize wallet for new users
        await prisma.wallet.create({
          data: {
            userId: userProfile.id,
            balance: 0,
            coins: 100
          }
        });
      } catch (dbError) {
        console.error('Database Sync Error during auth:', dbError);
        // We continue anyway with the token data to ensure availability
      }
    }

    // 3. Attach the combined user object to the request
    req.user = {
      ...decodedToken,
      dbProfile: userProfile
    };

    return next();
  } catch (error: any) {
    console.error('Firebase Auth Verification Error:', error.message || error);
    
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid or expired authentication token.' 
    });
  }
};
