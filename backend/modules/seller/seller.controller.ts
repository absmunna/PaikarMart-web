import { Request, Response } from 'express';
import { prisma } from '../../config/database';

// ── Products ──────────────────────────────────────────────────────────
export const listSellerProducts = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user?.id || req.headers['x-user-id'] as string || 'dev-seller';
    if (!process.env.DATABASE_URL) {
      return res.json([]);
    }
    const products = await (prisma as any).product.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (e) {
    console.error('listSellerProducts error:', e);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const createSellerProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user?.id || req.headers['x-user-id'] as string || 'dev-seller';
    if (!process.env.DATABASE_URL) {
      return res.status(201).json({ id: `dev-${Date.now()}`, ...req.body, sellerId });
    }
    const product = await (prisma as any).product.create({
      data: { ...req.body, sellerId },
    });
    res.status(201).json(product);
  } catch (e) {
    console.error('createSellerProduct error:', e);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateSellerProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!process.env.DATABASE_URL) {
      return res.json({ id, ...req.body, message: 'Updated (dev mode)' });
    }
    const updated = await (prisma as any).product.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  } catch (e) {
    console.error('updateSellerProduct error:', e);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteSellerProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!process.env.DATABASE_URL) {
      return res.json({ message: 'Deleted (dev mode)' });
    }
    await (prisma as any).product.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    console.error('deleteSellerProduct error:', e);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// ── Orders ────────────────────────────────────────────────────────────
export const listSellerOrders = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user?.id || req.headers['x-user-id'] as string || 'dev-seller';
    if (!process.env.DATABASE_URL) {
      return res.json([]);
    }
    const orders = await (prisma as any).order.findMany({
      where: { sellerId },
      include: { buyer: { select: { id: true, fullName: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (e) {
    console.error('listSellerOrders error:', e);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const updateSellerOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!process.env.DATABASE_URL) {
      return res.json({ id, status, message: 'Status updated (dev mode)' });
    }
    const updated = await (prisma as any).order.update({
      where: { id },
      data: { status },
    });
    res.json(updated);
  } catch (e) {
    console.error('updateSellerOrderStatus error:', e);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// ── Verification ──────────────────────────────────────────────────────
export const submitSellerVerification = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user?.id || req.headers['x-user-id'] as string || 'dev-seller';
    if (!process.env.DATABASE_URL) {
      return res.json({ message: 'Verification submitted (dev mode)', sellerId });
    }
    const result = await (prisma as any).sellerVerification?.create({
      data: { ...req.body, sellerId, status: 'pending' },
    });
    res.status(201).json(result || { message: 'Submitted', sellerId });
  } catch (e) {
    console.error('submitSellerVerification error:', e);
    res.status(500).json({ error: 'Failed to submit verification' });
  }
};
