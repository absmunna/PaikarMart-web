import { Request, Response } from 'express';
import { prisma } from '../../config/database';

// In-memory sessions storage for dev mode without DB
let devSessionCart: any[] = [
  {
    id: "cart-mock-1",
    quantity: 1,
    product: {
      id: "p2",
      title: "Premium Cotton Panjabi for Men (Regular Fit)",
      price: 1450,
      images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?fit=crop&w=400&h=400&q=80"],
      vendor: { name: "Chittagong Fashion House" }
    }
  }
];

export const getCart = async (req: Request, res: Response) => {
  try {
    if (!process.env.DATABASE_URL) {
      const subtotal = devSessionCart.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);
      const itemCount = devSessionCart.reduce((acc: number, item: any) => acc + item.quantity, 0);
      return res.json({
        items: devSessionCart,
        subtotal,
        itemCount,
        currency: 'BDT'
      });
    }

    const userId = req.headers['x-user-id'] as string || 'dev-user-id';
    
    // Find or create user to safeguard profile matches
    let user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.findFirst();
    }
    if (!user) {
      return res.json({ items: [], subtotal: 0, itemCount: 0, currency: 'BDT' });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
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
    const quantity = qty ? Number(qty) : 1;

    if (!process.env.DATABASE_URL) {
      const existing = devSessionCart.find((item: any) => item.product.id === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        devSessionCart.push({
          id: `cart-mock-${Date.now()}`,
          quantity: quantity,
          product: {
            id: productId || "unknown",
            title: "Dynamic Selected Product",
            price: 850,
            images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?fit=crop&w=400&h=400&q=80"],
            vendor: { name: "PK Store Exclusive" }
          }
        });
      }
      return res.status(201).json({ message: 'Added to cart in dev mode' });
    }

    const userId = req.headers['x-user-id'] as string || 'dev-user-id';
    
    let user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.findFirst();
    }
    if (!user) {
      return res.status(401).json({ error: 'Authorized user context required to modify cart' });
    }

    // Upsert Cart Item
    const existingDbItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId
        }
      }
    });

    if (existingDbItem) {
      await prisma.cartItem.update({
        where: { id: existingDbItem.id },
        data: { qty: existingDbItem.qty + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId: productId,
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

    if (!process.env.DATABASE_URL) {
      const existing = devSessionCart.find((item: any) => item.id === id);
      if (existing) {
        existing.quantity = Math.max(1, quantity);
      }
      return res.json({ message: 'Cart items updated' });
    }

    await prisma.cartItem.update({
      where: { id },
      data: { qty: Math.max(1, quantity) }
    });

    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Update Cart Quantity Error:', error);
    res.status(500).json({ error: 'Failed to update quantity' });
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!process.env.DATABASE_URL) {
      devSessionCart = devSessionCart.filter((item: any) => item.id !== id);
      return res.json({ message: 'Cart item removed in dev mode' });
    }

    await prisma.cartItem.delete({
      where: { id }
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Delete Cart Item Error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    if (!process.env.DATABASE_URL) {
      devSessionCart = [];
      return res.json({ message: 'Cart cleared in dev mode' });
    }

    const userId = req.headers['x-user-id'] as string || 'dev-user-id';
    
    let user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.findFirst();
    }
    if (user) {
      await prisma.cartItem.deleteMany({
        where: { userId: user.id }
      });
    }

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear Cart Error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};
