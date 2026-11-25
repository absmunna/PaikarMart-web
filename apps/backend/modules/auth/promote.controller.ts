import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma, db } from '../../config/database';
import { JWT_SECRET } from '../../config/env';

function issueTokens(user: {
  id: string;
  email?: string | null;
  fullName?: string | null;
  name?: string | null;
  role: string;
  isSeller?: boolean;
}) {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.fullName || user.name,
      role: user.role,
      roles: [user.role],
      isSeller: !!user.isSeller,
      type: 'access',
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  const refreshToken = jwt.sign({ id: user.id, type: 'refresh' }, JWT_SECRET, { expiresIn: '30d' });
  return { accessToken, refreshToken };
}

/** POST /auth/promote-seller — Firebase token required; elevates role in Prisma only */
export const promoteSeller = async (req: Request, res: Response) => {
  try {
    const firebaseUser = (req as any).user;
    if (!firebaseUser?.uid) {
      return res.status(401).json({ error: 'Unauthorized: Firebase identity required' });
    }
    const uid = firebaseUser.uid as string;
    const { shopName, type, address } = req.body || {};
    if (!shopName || typeof shopName !== 'string' || shopName.trim().length < 2) {
      return res.status(400).json({ error: 'shopName is required (min 2 characters)' });
    }
    const shopType = ['retail', 'wholesale', 'service'].includes(type) ? type : 'retail';

    if (!db.isConnected()) {
      const user = {
        id: uid,
        email: firebaseUser.email || `${uid}@paikarmart.com`,
        fullName: firebaseUser.name || shopName.trim(),
        role: 'seller',
        isSeller: true,
        seller: { shopName: shopName.trim(), type: shopType, address: address || '' },
      };
      const tokens = issueTokens(user);
      return res.json({
        success: true,
        message: 'Seller role granted (dev mode — no DB)',
        ...tokens,
        token: tokens.accessToken,
        user,
      });
    }

    let user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: uid,
          email: (firebaseUser.email || `${uid}@paikarmart.com`).toLowerCase(),
          fullName: (firebaseUser.name || shopName.trim()).trim(),
          phone: firebaseUser.phone_number || null,
          role: 'seller',
          isSeller: true,
        } as any,
      });
      try {
        await prisma.wallet.create({ data: { userId: user.id, balance: 0.0, coins: 100 } });
      } catch {}
    } else {
      if (user.role === 'admin') {
        return res.status(400).json({ error: 'Admin accounts cannot be converted via promote-seller' });
      }
      user = await prisma.user.update({
        where: { id: uid },
        data: { role: 'seller', isSeller: true } as any,
      });
    }

    const tokens = issueTokens(user);
    return res.json({
      success: true,
      message: 'Seller role activated',
      ...tokens,
      token: tokens.accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isSeller: (user as any).isSeller ?? true,
        seller: { shopName: shopName.trim(), type: shopType, address: address || '' },
      },
    });
  } catch (error) {
    console.error('promoteSeller error:', error);
    return res.status(500).json({ error: 'Seller promotion failed' });
  }
};

/** POST /auth/promote-creator — Firebase token required */
export const promoteCreator = async (req: Request, res: Response) => {
  try {
    const firebaseUser = (req as any).user;
    if (!firebaseUser?.uid) {
      return res.status(401).json({ error: 'Unauthorized: Firebase identity required' });
    }
    const uid = firebaseUser.uid as string;

    if (!db.isConnected()) {
      const user = {
        id: uid,
        email: firebaseUser.email || `${uid}@paikarmart.com`,
        fullName: firebaseUser.name || 'Creator',
        role: 'creator',
        isSeller: false,
      };
      const tokens = issueTokens(user);
      return res.json({
        success: true,
        message: 'Creator role granted (dev mode)',
        ...tokens,
        token: tokens.accessToken,
        user,
      });
    }

    let user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: uid,
          email: (firebaseUser.email || `${uid}@paikarmart.com`).toLowerCase(),
          fullName: (firebaseUser.name || 'Creator').trim(),
          role: 'creator',
          isSeller: false,
        } as any,
      });
    } else {
      if (user.role === 'admin') {
        return res.status(400).json({ error: 'Admin accounts cannot be converted via promote-creator' });
      }
      if (user.role === 'buyer') {
        user = await prisma.user.update({
          where: { id: uid },
          data: { role: 'creator' } as any,
        });
      }
    }

    const tokens = issueTokens(user);
    return res.json({
      success: true,
      message: 'Creator role activated',
      ...tokens,
      token: tokens.accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isSeller: (user as any).isSeller ?? false,
      },
    });
  } catch (error) {
    console.error('promoteCreator error:', error);
    return res.status(500).json({ error: 'Creator promotion failed' });
  }
};
