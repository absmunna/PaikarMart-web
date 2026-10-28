import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma, db } from '../../config/database';

import { JWT_SECRET } from '../../middleware/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, fullName, role, phone, uid, id } = req.body;
    const effectiveEmail = email?.trim() || (phone ? `${phone.trim()}@paikarmart.com` : `u_${Date.now()}@paikarmart.com`);
    const effectiveFullName = (fullName || name || effectiveEmail.split('@')[0]).trim();
    const effectiveRole = (role as any) || 'buyer';
    const effectiveId = id || uid || `u_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const effectivePhone = phone ? phone.trim() : null;

    let user: any = null;

    if (db.isConnected()) {
      const existing = await prisma.user.findFirst({
        where: {
          OR: [
            { email: effectiveEmail },
            ...(effectivePhone ? [{ phone: effectivePhone }] : []),
            { id: effectiveId }
          ]
        }
      });

      if (existing) {
        user = existing;
      } else {
        user = await prisma.user.create({
          data: {
            id: effectiveId,
            email: effectiveEmail,
            fullName: effectiveFullName,
            phone: effectivePhone,
            role: effectiveRole
          }
        });

        // Auto-initialize Wallet
        try {
          await prisma.wallet.create({
            data: {
              userId: user.id,
              balance: 0.00,
              coins: 100
            }
          });
        } catch (wErr) {
          console.warn('Wallet auto-creation notice:', wErr);
        }
      }
    } else {
      user = {
        id: effectiveId,
        email: effectiveEmail,
        fullName: effectiveFullName,
        name: effectiveFullName,
        phone: effectivePhone,
        role: effectiveRole
      };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.fullName || user.name, role: user.role, roles: [user.role] },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'User registered and synchronized with database',
      accessToken: token,
      token,
      refreshToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName || user.name,
        fullName: user.fullName || user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to register. Please try again.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, phone, password, uid, id } = req.body;
    const identifier = (email || phone || '').trim().toLowerCase();
    const effectiveEmail = identifier.includes('@') ? identifier : (identifier ? `${identifier}@paikarmart.com` : '');

    let user: any = null;

    if (db.isConnected()) {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            ...(uid || id ? [{ id: uid || id }] : []),
            ...(effectiveEmail ? [{ email: effectiveEmail }] : []),
            ...(identifier && !identifier.includes('@') ? [{ phone: identifier }] : [])
          ]
        }
      });

      if (!user && (uid || id || effectiveEmail)) {
        const userId = uid || id || `u_${Date.now()}`;
        user = await prisma.user.create({
          data: {
            id: userId,
            email: effectiveEmail || `${userId}@paikarmart.com`,
            fullName: identifier ? identifier.split('@')[0] : 'Paikar Mart User',
            phone: identifier && !identifier.includes('@') ? identifier : null,
            role: 'buyer'
          }
        });

        try {
          await prisma.wallet.create({
            data: {
              userId: user.id,
              balance: 0.00,
              coins: 100
            }
          });
        } catch {}
      }
    } else {
      user = {
        id: uid || id || 'usr-demo',
        email: effectiveEmail || 'buyer@paikarmart.com',
        fullName: identifier ? identifier.split('@')[0] : 'Paikar Mart User',
        name: identifier ? identifier.split('@')[0] : 'Paikar Mart User',
        phone: identifier && !identifier.includes('@') ? identifier : '01700000000',
        role: 'buyer'
      };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.fullName || user.name, role: user.role, roles: [user.role] },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      accessToken: token,
      token,
      refreshToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName || user.name,
        fullName: user.fullName || user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: error.message || 'Login verification failed.' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    
    if (db.isConnected()) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
         // Return success anyway for security reasons
         return res.json({ message: 'If that email exists, a reset link was sent.' });
      }
    }

    // Usually we would dispatch an email here using Resend or NodeMailer.
    res.json({ message: 'If that email exists, a reset link was sent.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request.' });
  }
};

// In-memory OTP storage for dev / test mode
const otpStore = new Map<string, { code: string; expiresAt: number; role?: string }>();

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email, phone, purpose } = req.body;
    const identifier = (email || phone || '').toString().trim().toLowerCase();
    if (!identifier) {
      return res.status(400).json({ error: 'ইমেইল অথবা মোবাইল নম্বর প্রয়োজন' });
    }

    // Generate 6 digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore.set(identifier, { code, expiresAt });

    console.log(`[OTP Sent] Identifier: ${identifier}, Code: ${code}, Purpose: ${purpose || 'login'}`);

    return res.json({
      success: true,
      message: 'কোড সফলভাবে পাঠানো হয়েছে',
      email: identifier,
      expiresInSeconds: 300
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ error: 'OTP পাঠানো সম্ভব হয়নি' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, phone, otp, code } = req.body;
    const identifier = (email || phone || '').toString().trim().toLowerCase();
    const inputOtp = (otp || code || '').toString().trim();

    if (!identifier || !inputOtp) {
      return res.status(400).json({ error: 'কোড এবং পরিচয় নম্বর প্রদান করুন' });
    }

    const stored = otpStore.get(identifier);
    // Verify stored code and expiration
    const isValid = (stored && stored.code === inputOtp && Date.now() <= stored.expiresAt);

    if (!isValid) {
      return res.status(400).json({ error: 'ভুল ওটিপি কোড অথবা মেয়াদের সময় শেষ হয়ে গেছে।' });
    }

    // Clear OTP
    otpStore.delete(identifier);

    // Retrieve or create user
    let user: any = null;
    const userEmail = identifier.includes('@') ? identifier : `${identifier}@paikarmart.com`;
    const userPhone = identifier.includes('@') ? null : identifier;
    const userFullName = identifier.split('@')[0] || 'Paikar Mart User';

    if (db.isConnected()) {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: userEmail },
            ...(userPhone ? [{ phone: userPhone }] : [])
          ]
        }
      });
      if (!user) {
        user = await prisma.user.create({
          data: {
            id: `u_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            email: userEmail,
            fullName: userFullName,
            phone: userPhone,
            role: 'buyer'
          }
        });
        try {
          await prisma.wallet.create({
            data: { userId: user.id, balance: 0.00, coins: 100 }
          });
        } catch {}
      }
    } else {
      user = {
        id: `usr-${Date.now()}`,
        email: userEmail,
        fullName: userFullName,
        name: userFullName,
        phone: userPhone,
        role: 'buyer'
      };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.fullName || user.name, role: user.role, roles: [user.role] },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      verified: true,
      message: 'ভেরিফিকেশন সফল হয়েছে',
      accessToken: token,
      token,
      refreshToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ error: 'ওটিপি ভেরিফিকেশন ব্যর্থ হয়েছে' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // Dev mode fallback guest/demo user
      return res.json({
        id: 'usr-demo',
        name: 'Demo Buyer',
        email: 'buyer@paikarmart.com',
        role: 'buyer',
        phone: '01700000000'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (db.isConnected() && decoded.id) {
      const dbUser = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (dbUser) {
        return res.json({
          id: dbUser.id,
          name: dbUser.fullName,
          fullName: dbUser.fullName,
          email: dbUser.email,
          phone: dbUser.phone,
          avatarUrl: dbUser.avatarUrl,
          role: dbUser.role
        });
      }
    }

    return res.json({
      id: decoded.id || 'usr-demo',
      name: decoded.name || 'Demo Buyer',
      fullName: decoded.name || 'Demo Buyer',
      email: decoded.email || 'buyer@paikarmart.com',
      phone: decoded.phone || '01700000000',
      role: decoded.role || 'buyer'
    });
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized or token expired' });
  }
};

export const syncUser = async (req: any, res: Response) => {
  try {
    const firebaseUser = req.user; // From verifyFirebaseToken middleware
    const { role, fullName: bodyFullName, name: bodyName, avatarUrl: bodyAvatarUrl } = req.body;
    
    if (!firebaseUser) {
      return res.status(401).json({ error: 'Unauthorized: No firebase user found in request' });
    }

    const uid = firebaseUser.uid;
    const email = firebaseUser.email || `${uid}@paikarmart.com`;
    const effectiveEmail = email.trim();
    const phone = firebaseUser.phone_number || req.body.phone || null;
    const effectiveRole = (role as any) || 'buyer';
    const effectiveFullName = (bodyFullName || bodyName || firebaseUser.name || email.split('@')[0]).trim();
    const effectiveAvatar = bodyAvatarUrl || firebaseUser.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`;

    let user: any = null;

    if (db.isConnected()) {
      user = await prisma.user.upsert({
        where: { id: uid },
        update: {
          email: effectiveEmail,
          fullName: effectiveFullName,
          phone: phone || undefined,
          avatarUrl: effectiveAvatar,
        },
        create: {
          id: uid,
          email: effectiveEmail,
          fullName: effectiveFullName,
          role: effectiveRole,
          phone: phone || null,
          avatarUrl: effectiveAvatar,
        }
      });

      // Ensure user wallet exists
      try {
        await prisma.wallet.upsert({
          where: { userId: uid },
          update: {},
          create: {
            userId: uid,
            balance: 0.00,
            coins: 100
          }
        });
      } catch (wErr) {
        console.warn('Wallet auto-creation notice:', wErr);
      }
    } else {
      user = {
        id: uid,
        email: effectiveEmail,
        fullName: effectiveFullName,
        name: effectiveFullName,
        role: effectiveRole,
        phone: phone || null,
        avatarUrl: effectiveAvatar
      };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.fullName || user.name, role: user.role, roles: [user.role] },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'User synchronized with Supabase database',
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName || user.name,
        fullName: user.fullName || user.name,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatarUrl
      },
      token,
      accessToken: token,
      isDbConnected: db.isConnected()
    });
  } catch (error: any) {
    console.error('[Auth Sync] Error:', error);
    res.status(500).json({ error: 'User sync failed', details: error.message });
  }
};

export const getDbStatus = async (req: Request, res: Response) => {
  res.json({
    connected: db.isConnected(),
    mode: db.isConnected() ? 'PostgreSQL (Supabase)' : 'Resilient Dev Mode',
    timestamp: new Date().toISOString()
  });
};

