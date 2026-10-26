import { Router, type IRouter } from "express";
import { db, cartTotals, genId } from "../lib/db";
import { prisma } from "../../config/database";

const router: IRouter = Router();

router.get("/cart", async (req, res) => {
  try {
    if (!process.env.DATABASE_URL || !(prisma as any).cartItem?.findMany) {
      return res.json(cartTotals());
    }

    const userId = req.headers['x-user-id'] as string || 'dev-user-id';
    
    // Find or create default user in database
    let user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.findFirst();
    }
    if (!user) {
      return res.json(cartTotals());
    }

    const cartItems = await (prisma as any).cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            seller: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    if (!cartItems || cartItems.length === 0) {
      return res.json(cartTotals());
    }

    const itemsMapped = cartItems.map((item: any) => ({
      id: item.id,
      quantity: item.qty,
      product: {
        id: item.product.id,
        title: item.product.name,
        name: item.product.name,
        price: Number(item.product.price),
        images: item.product.images,
        vendor: {
          id: item.product.sellerId,
          name: item.product.seller?.name || 'Paikar Mart Partner'
        }
      }
    }));

    const subtotal = itemsMapped.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);
    const itemCount = itemsMapped.reduce((acc: number, item: any) => acc + item.quantity, 0);

    res.json({
      items: itemsMapped,
      subtotal,
      itemCount,
      currency: "BDT"
    });
  } catch (error) {
    res.json(cartTotals());
  }
});


router.post("/cart", async (req, res) => {
  try {
    const { productId, quantity } = req.body ?? {};
    if (!productId || !quantity) {
      return res.status(400).json({ error: "invalid" });
    }

    if (!process.env.DATABASE_URL) {
      const product = db.products.find((p) => p.id === productId);
      if (!product) return res.status(404).json({ error: "not_found" });
      const existing = db.cart.find((c) => c.productId === productId);
      if (existing) existing.quantity += Number(quantity);
      else {
        db.cart.push({ id: genId("ci"), productId, quantity: Number(quantity) });
      }
      return res.status(201).json(cartTotals());
    }

    const userId = req.headers['x-user-id'] as string || 'dev-user-id';
    
    let user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.findFirst();
    }
    if (!user) {
      return res.status(401).json({ error: 'Auth user required' });
    }

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
        data: { qty: existingDbItem.qty + Number(quantity) }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId: productId,
          qty: Number(quantity)
        }
      });
    }

    // Return the mapped updated cart totals
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true }
    });

    const itemsMapped = cartItems.map((item: any) => ({
      id: item.id,
      quantity: item.qty,
      product: {
        id: item.product.id,
        title: item.product.title,
        price: Number(item.product.price),
        images: item.product.images
      }
    }));

    const subtotal = itemsMapped.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);
    const itemCount = itemsMapped.reduce((acc: number, item: any) => acc + item.quantity, 0);

    res.status(201).json({
      items: itemsMapped,
      subtotal,
      itemCount,
      currency: "BDT"
    });
  } catch (error) {
    console.error("Add to API Cart Error:", error);
    res.status(500).json({ error: "Error adding product to cart" });
  }
});

router.delete("/cart/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!process.env.DATABASE_URL) {
      db.cart = db.cart.filter((c) => c.id !== itemId);
      return res.json(cartTotals());
    }

    const userId = req.headers['x-user-id'] as string || 'dev-user-id';
    
    // Check if the cart item exists link
    const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
    if (item) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    }

    // Reload remaining cart elements
    let user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) user = await prisma.user.findFirst();

    const cartItems = user 
      ? await prisma.cartItem.findMany({ where: { userId: user.id }, include: { product: true } })
      : [];

    const itemsMapped = cartItems.map((item: any) => ({
      id: item.id,
      quantity: item.qty,
      product: {
        id: item.product.id,
        title: item.product.title,
        price: Number(item.product.price)
      }
    }));

    const subtotal = itemsMapped.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);
    const itemCount = itemsMapped.reduce((acc: number, item: any) => acc + item.quantity, 0);

    res.json({
      items: itemsMapped,
      subtotal,
      itemCount,
      currency: "BDT"
    });
  } catch (error) {
    console.error("Delete Cart Item API Error:", error);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

export default router;

