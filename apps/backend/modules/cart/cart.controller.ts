import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { prisma, db } from '../../config/database';

export const getCart = async (req: Request, res: Response) => {
  try {
    if (!db.isConnected()) {
      return res.status(503).json({ error: 'Cart service is temporarily unavailable because the database is offline.' });
    }

    const userId = (req as AuthenticatedRequest).user!.id;
    
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            seller: {
              select: { id: true, fullName: true, shopName: true }
            }
          }
        }
      }
    });

    const itemsMapped = cartItems.map((item: any) => ({
      id: item.id,
      quantity: item.qty,
      product: {
        id: item.product.id,
        title: item.product.title,
        price: Number(item.product.price),
        images: item.product.images,
        vendor: {
          id: item.product.sellerId,
          name: item.product.seller?.shopName || item.product.seller?.fullName || 'Paikar Mart Partner'
        }
      }
    }));

    const subtotal = itemsMapped.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);
    const itemCount = itemsMapped.reduce((acc: number, item: any) => acc + item.quantity, 0);

    res.json({
      items: itemsMapped,
      subtotal,
      itemCount,
      currency: 'BDT'
    });
  } catch (error) {
    console.error('Fetch Cart Error:', error);
    res.status(500).json({ error: 'Failed to fetch cart elements' });
  }
};

export const addCartItem = async (req: Request, res: Response) => {
  try {
    const { productId, qty } = req.body;
    const quantity = qty === undefined ? 1 : Number(qty);
    if (typeof productId !== 'string' || !productId.trim() || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return res.status(400).json({ error: 'A valid productId and quantity from 1 to 99 are required.' });
    }

    if (!db.isConnected()) {
      return res.status(503).json({ error: 'Cart service is temporarily unavailable because the database is offline.' });
    }

    const userId = (req as AuthenticatedRequest).user!.id;
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'Authenticated user profile was not found.' });

    const existingDbItem = await prisma.cartItem.findFirst({
      where: { userId, productId }
    });

    if (existingDbItem) {
      if (existingDbItem.qty + quantity > 99) {
        return res.status(400).json({ error: 'A cart item cannot exceed a quantity of 99.' });
      }
      await prisma.cartItem.update({
        where: { id: existingDbItem.id },
        data: { qty: existingDbItem.qty + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId,
          productId,
          qty: quantity
        }
      });
    }

    res.status(201).json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Add Cart Item Error:', error);
    res.status(500).json({ error: 'Failed to add cart item' });
  }
};

export const updateCartItemQty = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { qty } = req.body;
    const quantity = Number(qty);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return res.status(400).json({ error: 'Quantity must be a whole number from 1 to 99.' });
    }

    if (!db.isConnected()) {
      return res.status(503).json({ error: 'Cart service is temporarily unavailable because the database is offline.' });
    }

    const userId = (req as AuthenticatedRequest).user!.id;
    const updated = await prisma.cartItem.updateMany({
      where: { id, userId },
      data: { qty: quantity }
    });
    if (!updated.count) return res.status(404).json({ error: 'Cart item not found.' });

    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Update Cart Quantity Error:', error);
    res.status(500).json({ error: 'Failed to update quantity' });
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!db.isConnected()) {
      return res.status(503).json({ error: 'Cart service is temporarily unavailable because the database is offline.' });
    }

    const userId = (req as AuthenticatedRequest).user!.id;
    const deleted = await prisma.cartItem.deleteMany({ where: { id, userId } });
    if (!deleted.count) return res.status(404).json({ error: 'Cart item not found.' });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Delete Cart Item Error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    if (!db.isConnected()) {
      return res.status(503).json({ error: 'Cart service is temporarily unavailable because the database is offline.' });
    }

    const userId = (req as AuthenticatedRequest).user!.id;
    
    await prisma.cartItem.deleteMany({ where: { userId } });

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear Cart Error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};
