import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma, db } from '../../config/database';
import { JWT_SECRET } from '../../config/env';

// In-memory OTP storage with rate limiting & attempt tracking
interface OtpEntry {
  code: string;
  expiresAt: number;
  lastSentAt: number;
  attempts: number;
  requestCount: number;
  firstRequestAt: number;
}
const otpStore = new Map<string, OtpEntry>();

/**
 * 🔒 Generate distinct access & refresh tokens
 */
function generateTokens(user: { id: string; email?: string | null; name?: string | null; role: string }) {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      roles: [user.role],
      type: 'access'
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
      type: 'refresh'
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
}

/**
 * 📝 User Registration
 * Enforces role assignment via server-side policy only. Ignores client-injected role claims.
 */
export const register = async (req: Request, res: Response) => {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    const { name, fullName } = req.body;
    const tokenToVerify = req.body.idToken || req.body.firebaseToken;
    if (!tokenToVerify) {
      return res.status(401).json({ error: 'Firebase identity verification is required.' });
    }
    const { firebaseAuthInstance } = await import('../../config/firebase');
    if (!firebaseAuthInstance) return res.status(503).json({ error: 'Auth service unavailable.' });
    const decoded = await firebaseAuthInstance.verifyIdToken(tokenToVerify);
    const effectiveId = decoded.uid;
    const verifiedEmail = decoded.email || null;
    const verifiedPhone = decoded.phone_number || null;
    const effectiveEmail = verifiedEmail || `${effectiveId}@paikarmart.com`;
    const effectiveFullName = (decoded.name || fullName || name || effectiveEmail.split('@')[0]).trim();
    const effectivePhone = verifiedPhone;

    let user: any = null;

    if (db.isConnected()) {
      const existing = await prisma.user.findUnique({ where: { id: effectiveId } });
      const emailOwner = await prisma.user.findUnique({ where: { email: effectiveEmail } });
      if (emailOwner && emailOwner.id !== effectiveId) {
        return res.status(409).json({ error: 'This verified email is already linked to another account.' });
      }

      if (existing) {
        user = await prisma.user.update({
          where: { id: effectiveId },
          data: {
            email: effectiveEmail,
            fullName: effectiveFullName,
            phone: effectivePhone || existing.phone
          }
        });
      } else {
        user = await prisma.user.create({
          data: {
            id: effectiveId,
            email: effectiveEmail,
            fullName: effectiveFullName,
            phone: effectivePhone,
            role: 'buyer',
            isSeller: false
          }
        });
        try {
          await prisma.wallet.create({
            data: { userId: user.id, balance: 0.00, coins: 100 }
          });
        } catch {}
      }
    } else {
      if (isProd) {
        return res.status(503).json({ error: 'Account service is temporarily unavailable. Please try again later.' });
      }
      user = {
        id: effectiveId,
        email: effectiveEmail,
        fullName: effectiveFullName,
        phone: effectivePhone,
        role: 'buyer',
        isSeller: false
      };
    }

    const { accessToken, refreshToken } = generateTokens(user);

    return res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isSeller: user.isSeller ?? false
      }
    });
  } catch (error: any) {
    console.error('Registration Error:', error);
    if (error?.code === 'auth/id-token-expired' || error?.code === 'auth/argument-error') {
      return res.status(401).json({ error: 'Invalid or expired Firebase identity token.' });
    }
    return res.status(500).json({ error: 'Registration failed.' });
  }
};

/**
 * 🔐 User Login
 * Requires Firebase ID token. Does not trust client-supplied uid/email without verification.
 */
export const login = async (req: Request, res: Response) => {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    const { email, phone, idToken, firebaseToken } = req.body;
    const tokenToVerify = idToken || firebaseToken;

    let verifiedUserId: string | null = null;
    let verifiedEmail: string | null = null;

    if (tokenToVerify) {
      try {
        const { firebaseAuthInstance } = await import('../../config/firebase');
        if (firebaseAuthInstance) {
          const decoded = await firebaseAuthInstance.verifyIdToken(tokenToVerify);
          verifiedUserId = decoded.uid;
          verifiedEmail = decoded.email || null;
        } else {
          return res.status(503).json({ error: 'Auth service unavailable.' });
        }
      } catch (e: any) {
        return res.status(401).json({ error: 'Invalid or expired Firebase identity token.' });
      }
    } else if (isProd) {
      return res.status(401).json({ error: 'Firebase identity verification is required.' });
    }

    let user: any = null;
    const identifier = email || phone;

    if (db.isConnected()) {
      if (verifiedUserId) {
        user = await prisma.user.findUnique({ where: { id: verifiedUserId } });
      }
      if (!user && verifiedEmail) {
        user = await prisma.user.findUnique({ where: { email: verifiedEmail } });
        if (user && verifiedUserId && user.id !== verifiedUserId) {
          return res.status(409).json({ error: 'Verified email is linked to a different account ID. Contact support to recover the account.' });
        }
      }

      if (isProd && !user && !verifiedUserId) {
        return res.status(401).json({ error: 'Unauthorized: Identity verification required.' });
      }

      if (!user && verifiedUserId) {
        user = await prisma.user.create({
          data: {
            id: verifiedUserId,
            email: verifiedEmail || `${verifiedUserId}@paikarmart.com`,
            fullName: identifier ? String(identifier).split('@')[0] : 'Paikar Mart User',
            role: 'buyer',
            isSeller: false
          }
        });
        try {
          await prisma.wallet.create({
            data: { userId: user.id, balance: 0.00, coins: 100 }
          });
        } catch {}
      }
    } else {
      if (!isProd && verifiedUserId) {
        user = {
          id: verifiedUserId,
          email: verifiedEmail || `${verifiedUserId}@paikarmart.com`,
          fullName: 'Paikar Mart User',
          role: 'buyer',
          isSeller: false
        };
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Account not found or credentials invalid.' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    return res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isSeller: user.isSeller ?? false
      }
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: 'Login verification failed.' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (db.isConnected()) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.json({ message: 'If that email exists, a reset link was sent.' });
      }
    }
    res.json({ message: 'If that email exists, a reset link was sent.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request.' });
  }
};

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({ error: 'Valid phone number is required' });
    }
    const now = Date.now();
    const existing = otpStore.get(phone);
    if (existing && now - existing.lastSentAt < 30000) {
      return res.status(429).json({ error: 'Please wait before requesting another OTP.' });
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    otpStore.set(phone, {
      code,
      expiresAt: now + 5 * 60 * 1000,
      lastSentAt: now,
      attempts: 0,
      requestCount: (existing?.requestCount || 0) + 1,
      firstRequestAt: existing?.firstRequestAt || now
    });
    // In production, integrate SMS provider here. Never return OTP in production responses.
    const isProd = process.env.NODE_ENV === 'production';
    return res.json({
      success: true,
      message: 'OTP sent',
      ...(isProd ? {} : { debugOtp: code })
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ error: 'Phone and code are required' });
    const entry = otpStore.get(phone);
    if (!entry || entry.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'OTP expired or not found' });
    }
    if (entry.attempts >= 5) {
      otpStore.delete(phone);
      return res.status(429).json({ error: 'Too many attempts. Request a new OTP.' });
    }
    entry.attempts += 1;
    if (entry.code !== String(code)) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    otpStore.delete(phone);
    return res.json({ success: true, message: 'OTP verified' });
  } catch (error) {
    res.status(500).json({ error: 'OTP verification failed' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) return res.status(400).json({ error: 'Refresh token required' });
    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type' });
    }
    let user: any = null;
    if (db.isConnected()) {
      user = await prisma.user.findUnique({ where: { id: decoded.id } });
    }
    if (!user) return res.status(401).json({ error: 'User not found' });
    const tokens = generateTokens(user);
    return res.json(tokens);
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
};

export const syncProfile = async (req: Request, res: Response) => {
  try {
    const firebaseUser = (req as any).user;
    if (!firebaseUser || !firebaseUser.uid) {
      return res.status(401).json({ error: 'Unauthorized: Verified firebase user required' });
    }
    const uid = firebaseUser.uid;
    const email = (firebaseUser.email || '').toLowerCase().trim();
    const phone = firebaseUser.phone_number || req.body.phone || null;
    const bodyFullName = req.body.fullName || req.body.name;
    const bodyAvatarUrl = req.body.avatarUrl;
    const effectiveFullName = (bodyFullName || firebaseUser.name || (email ? email.split('@')[0] : 'Paikar Mart User')).trim();
    const effectiveAvatar = bodyAvatarUrl || firebaseUser.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`;

    if (!db.isConnected()) {
      return res.status(503).json({ error: 'Profile database unavailable. Account synchronization cannot be completed.' });
    }

    let user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: uid,
          email: email || `${uid}@paikarmart.com`,
          fullName: effectiveFullName,
          phone,
          avatarUrl: effectiveAvatar,
          role: 'buyer',
          isSeller: false
        }
      });
      try {
        await prisma.wallet.create({ data: { userId: user.id, balance: 0.00, coins: 100 } });
      } catch {}
    } else {
      user = await prisma.user.update({
        where: { id: uid },
        data: {
          email: email || user.email,
          fullName: effectiveFullName || user.fullName,
          phone: phone || user.phone,
          avatarUrl: effectiveAvatar || user.avatarUrl
        }
      });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isSeller: user.isSeller
      }
    });
  } catch (error) {
    console.error('syncProfile error:', error);
    return res.status(500).json({ error: 'Profile sync failed' });
  }
};

export const getDbStatus = async (req: Request, res: Response) => {
  res.json({
    connected: db.isConnected(),
    mode: db.isConnected() ? 'PostgreSQL (Supabase)' : 'Resilient Dev Mode',
    timestamp: new Date().toISOString()
  });
};
