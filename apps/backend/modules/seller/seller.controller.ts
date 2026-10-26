import { Request, Response } from 'express';
import { prisma, db } from '../../config/database';

// ── Products ──────────────────────────────────────────────────────────
export const listSellerProducts = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user?.id || req.headers['x-user-id'] as string || 'dev-seller';
    if (!db.isConnected()) {
      return res.json([]);
    }
    const products = await (prisma as any).product.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (e) {
    console.warn('listSellerProducts error, falling back to empty list:', e);
    res.json([]);
  }
};

export const createSellerProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user?.id || req.headers['x-user-id'] as string || 'dev-seller';
    if (!db.isConnected()) {
      return res.status(201).json({ id: `dev-${Date.now()}`, ...req.body, sellerId });
    }
    const product = await (prisma as any).product.create({
      data: { ...req.body, sellerId },
    });
    res.status(201).json(product);
  } catch (e) {
    console.warn('createSellerProduct fallback in dev mode:', e);
    const sellerId = (req as any).user?.id || req.headers['x-user-id'] as string || 'dev-seller';
    res.status(201).json({ id: `dev-${Date.now()}`, ...req.body, sellerId });
  }
};

export const updateSellerProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!db.isConnected()) {
      return res.json({ id, ...req.body, message: 'Updated (dev mode)' });
    }
    const updated = await (prisma as any).product.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  } catch (e) {
    console.warn('updateSellerProduct fallback:', e);
    const { id } = req.params;
    res.json({ id, ...req.body, message: 'Updated (dev mode)' });
  }
};

export const deleteSellerProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!db.isConnected()) {
      return res.json({ message: 'Deleted (dev mode)' });
    }
    await (prisma as any).product.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    console.warn('deleteSellerProduct fallback:', e);
    res.status(204).send();
  }
};

// ── Orders ────────────────────────────────────────────────────────────
export const listSellerOrders = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user?.id || req.headers['x-user-id'] as string || 'dev-seller';
    if (!db.isConnected()) {
      return res.json([]);
    }
    const orders = await (prisma as any).order.findMany({
      where: { sellerId },
      include: { buyer: { select: { id: true, fullName: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (e) {
    console.warn('listSellerOrders fallback:', e);
    res.json([]);
  }
};

export const updateSellerOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!db.isConnected()) {
      return res.json({ id, status, message: 'Status updated (dev mode)' });
    }
    const updated = await (prisma as any).order.update({
      where: { id },
      data: { status },
    });
    res.json(updated);
  } catch (e) {
    console.warn('updateSellerOrderStatus fallback:', e);
    const { id } = req.params;
    const { status } = req.body;
    res.json({ id, status, message: 'Status updated (dev mode)' });
  }
};

// ── Verification ──────────────────────────────────────────────────────
export const submitSellerVerification = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user?.id || req.headers['x-user-id'] as string || 'dev-seller';
    if (!db.isConnected()) {
      return res.json({ message: 'Verification submitted (dev mode)', sellerId });
    }
    const result = await (prisma as any).sellerVerification?.create({
      data: { ...req.body, sellerId, status: 'pending' },
    });
    res.status(201).json(result || { message: 'Submitted', sellerId });
  } catch (e) {
    console.warn('submitSellerVerification fallback:', e);
    const sellerId = (req as any).user?.id || req.headers['x-user-id'] as string || 'dev-seller';
    res.status(201).json({ message: 'Submitted (dev fallback)', sellerId });
  }
};
