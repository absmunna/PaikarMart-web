import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { prisma, db } from '../../config/database';
import { CommercialPricingService } from '../commercial/commercial.pricing.service';
import { LogisticsAllocationService } from '../commercial/logistics.allocation.service';
import { DigitalEngineService } from '../commercial/digital.engine.service';
import { WalletService } from '../wallet/wallet.service';

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: []
};

const mapOrderForResponse = (order: any) => {
  const itemsList = (order.orderItems || order.items || []).map((it: any) => ({
    id: it.id,
    productId: it.productId,
    productTitle: it.productTitle || it.title || (it.product ? it.product.title : 'Product'),
    title: it.title || it.productTitle || (it.product ? it.product.title : 'Product'),
    unitPrice: Number(it.unitPrice || it.price || 0),
    price: Number(it.price || it.unitPrice || 0),
    quantity: Number(it.quantity || it.qty || 1),
    qty: Number(it.qty || it.quantity || 1),
    lineTotal: Number(it.unitPrice || it.price || 0) * Number(it.quantity || it.qty || 1),
    productImage: it.productImage || (it.product?.images?.[0] || '')
  }));

  return {
    id: order.id,
    orderNo: order.orderNo,
    status: order.status,
    paymentStatus: order.paymentStatus || 'unpaid',
    paymentMethod: order.paymentMethod || 'cod',
    deliveryType: order.deliveryType,
    deliveryAddress: order.deliveryAddress,
    deliveryDistrict: order.deliveryDistrict,
    subtotal: Number(order.subtotal || 0),
    vatAmount: Number(order.vatAmount || 0),
    shippingFee: Number(order.shippingFee || 0),
    total: Number(order.total || order.totalAmount || order.price || 0),
    items: itemsList,
    orderItems: itemsList,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    buyerId: order.buyerId,
    sellerId: order.sellerId
  };
};

export const getOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!db.isConnected()) return res.status(503).json({ error: 'Database offline' });

    const orders = await prisma.order.findMany({
      where: { OR: [{ buyerId: userId }, { userId }] },
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return res.json(orders.map(mapOrderForResponse));
  } catch (error: any) {
    console.error('[Order] getOrders', error);
    return res.status(500).json({ error: 'Failed to list orders' });
  }
};

export const getOrderById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!db.isConnected()) return res.status(503).json({ error: 'Database offline' });

    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        OR: [{ buyerId: userId }, { userId }, { sellerId: userId }]
      },
      include: { orderItems: { include: { product: true } } }
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.json(mapOrderForResponse(order));
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to get order' });
  }
};

export const trackOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!db.isConnected()) return res.status(503).json({ error: 'Database offline' });

    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        OR: [{ buyerId: userId }, { userId }]
      },
      include: { orderItems: { include: { product: true } } }
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    return res.json({
      ...mapOrderForResponse(order),
      tracking: {
        status: order.status,
        paymentStatus: order.paymentStatus,
        updatedAt: order.updatedAt
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to track order' });
  }
};

export const addOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!db.isConnected()) return res.status(503).json({ error: 'Database offline' });

    const {
      items,
      deliveryAddress,
      deliveryDistrict,
      deliveryType = 'standard',
      scheduledSlot,
      notes,
      paymentMethod = 'cod',
      idempotencyKey
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items required' });
    }
    if (!deliveryAddress) {
      return res.status(400).json({ error: 'Delivery address required' });
    }

    if (idempotencyKey) {
      const existing = await prisma.order.findFirst({ where: { idempotencyKey: String(idempotencyKey) } });
      if (existing) {
        const full = await prisma.order.findUnique({
          where: { id: existing.id },
          include: { orderItems: { include: { product: true } } }
        });
        return res.status(200).json(mapOrderForResponse(full));
      }
    }

    const validatedOrderItems: any[] = [];
    let subtotalSum = 0;

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ error: 'Invalid order item' });
      }
      const dbProduct = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!dbProduct) return res.status(400).json({ error: `Product not found: ${item.productId}` });
      if ((dbProduct.stock ?? 0) < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${dbProduct.title}` });
      }
      const unitPrice = Number(dbProduct.price);
      const lineTotal = unitPrice * item.quantity;
      subtotalSum += lineTotal;
      validatedOrderItems.push({
        productId: dbProduct.id,
        title: dbProduct.title,
        productImage: dbProduct.images?.[0] || '',
        unitPrice,
        quantity: item.quantity,
        lineTotal,
        sellerId: dbProduct.sellerId,
        vendorId: (dbProduct as any).vendorId
      });
    }

    const isInsideDhaka = String(deliveryDistrict || deliveryAddress).toLowerCase().includes('dhaka');
    const shippingFee = isInsideDhaka ? 60 : 120;
    const vatAmount = Math.round(subtotalSum * 0.05);
    const grandTotal = subtotalSum + vatAmount + shippingFee;
    const orderNo = `PKM-${Date.now().toString(36).toUpperCase()}`;
    const primaryVendorId = validatedOrderItems[0]?.vendorId || null;
    const primarySellerId = validatedOrderItems[0]?.sellerId || null;

    if (paymentMethod === 'wallet') {
      try {
        await WalletService.debitWallet({
          userId,
          amount: grandTotal,
          title: 'অর্ডার পেমেন্ট (Order Payment)',
          subtitle: `Order ${orderNo}`,
          idempotencyKey: idempotencyKey ? `order-wallet-${idempotencyKey}` : `order-wallet-${orderNo}`
        });
      } catch (err: any) {
        if (err.message === 'INSUFFICIENT_BALANCE') {
          return res.status(400).json({ error: 'পর্যাপ্ত ওয়ালেট ব্যালেন্স নেই', code: 'INSUFFICIENT_WALLET_BALANCE' });
        }
        throw err;
      }
    }

    let createdOrder;
    try {
      createdOrder = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            orderNo,
            idempotencyKey: idempotencyKey || null,
            buyerId: userId,
            userId: userId,
            sellerId: primarySellerId,
            vendorId: primaryVendorId,
            status: 'pending',
            paymentStatus: paymentMethod === 'wallet' ? 'paid' : 'unpaid',
            paymentMethod,
            deliveryType,
            scheduledSlot: scheduledSlot ? new Date(scheduledSlot) : null,
            deliveryAddress: String(deliveryAddress).trim(),
            deliveryDistrict: String(deliveryDistrict || 'Dhaka').trim(),
            notes: notes ? String(notes).trim() : null,
            subtotal: subtotalSum,
            vatAmount,
            shippingFee,
            total: grandTotal,
            totalAmount: grandTotal,
            price: grandTotal,
            orderItems: {
              create: validatedOrderItems.map(it => ({
                productId: it.productId,
                title: it.title,
                productTitle: it.title,
                productImage: it.productImage,
                unitPrice: it.unitPrice,
                price: it.unitPrice,
                quantity: it.quantity,
                qty: it.quantity
              }))
            }
          },
          include: { orderItems: { include: { product: true } } }
        });

        for (const item of validatedOrderItems) {
          const updated = await tx.product.updateMany({
            where: { id: item.productId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } }
          });
          if (updated.count === 0) {
            throw new Error(`INSUFFICIENT_STOCK:${item.productId}`);
          }
        }

        await tx.cartItem.deleteMany({ where: { userId } });
        return newOrder;
      });
    } catch (err: any) {
      if (paymentMethod === 'wallet') {
        try {
          await WalletService.creditWallet({
            userId,
            amount: grandTotal,
            title: 'অর্ডার বাতিল রিফান্ড (Order Failed Refund)',
            subtitle: `Order ${orderNo}`,
            idempotencyKey: `order-wallet-refund-${orderNo}`
          });
        } catch (refundErr) {
          console.error('[Order Controller] CRITICAL: wallet refund after order failure failed', refundErr);
        }
      }
      if (String(err.message || '').startsWith('INSUFFICIENT_STOCK')) {
        return res.status(400).json({ error: 'পণ্যের স্টক পর্যাপ্ত নেই', code: 'INSUFFICIENT_STOCK' });
      }
      throw err;
    }

    return res.status(201).json(mapOrderForResponse(createdOrder));
  } catch (error: any) {
    console.error('[Order Controller] Add Order Error:', error);
    return res.status(500).json({ error: 'Failed to place order', details: error.message });
  }
};

export const guestCheckout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!db.isConnected()) return res.status(503).json({ error: 'Database offline' });

    const { items, deliveryAddress, deliveryDistrict, guestEmail, guestPhone, guestName } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items required' });
    }
    if (!deliveryAddress || !guestPhone) {
      return res.status(400).json({ error: 'Delivery address and phone required for guest checkout' });
    }

    const validatedOrderItems: any[] = [];
    let subtotalSum = 0;
    for (const item of items) {
      const dbProduct = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!dbProduct) return res.status(400).json({ error: `Product not found: ${item.productId}` });
      if ((dbProduct.stock ?? 0) < (item.quantity || 1)) {
        return res.status(400).json({ error: `Insufficient stock for ${dbProduct.title}` });
      }
      const qty = item.quantity || 1;
      const unitPrice = Number(dbProduct.price);
      subtotalSum += unitPrice * qty;
      validatedOrderItems.push({
        productId: dbProduct.id,
        title: dbProduct.title,
        productImage: dbProduct.images?.[0] || '',
        unitPrice,
        quantity: qty,
        sellerId: dbProduct.sellerId
      });
    }

    const isInsideDhaka = String(deliveryDistrict || deliveryAddress).toLowerCase().includes('dhaka');
    const shippingFee = isInsideDhaka ? 60 : 120;
    const vatAmount = Math.round(subtotalSum * 0.05);
    const grandTotal = subtotalSum + vatAmount + shippingFee;
    const orderNo = `PKM-G-${Date.now().toString(36).toUpperCase()}`;

    const createdOrder = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNo,
          status: 'pending',
          paymentStatus: 'unpaid',
          paymentMethod: 'cod',
          deliveryAddress: String(deliveryAddress).trim(),
          deliveryDistrict: String(deliveryDistrict || 'Dhaka').trim(),
          notes: `Guest: ${guestName || ''} | ${guestEmail || ''} | ${guestPhone}`,
          subtotal: subtotalSum,
          vatAmount,
          shippingFee,
          total: grandTotal,
          totalAmount: grandTotal,
          price: grandTotal,
          sellerId: validatedOrderItems[0]?.sellerId || null,
          orderItems: {
            create: validatedOrderItems.map(it => ({
              productId: it.productId,
              title: it.title,
              productTitle: it.title,
              productImage: it.productImage,
              unitPrice: it.unitPrice,
              price: it.unitPrice,
              quantity: it.quantity,
              qty: it.quantity
            }))
          }
        },
        include: { orderItems: { include: { product: true } } }
      });

      for (const item of validatedOrderItems) {
        await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } }
        });
      }
      return newOrder;
    });

    return res.status(201).json(mapOrderForResponse(createdOrder));
  } catch (error: any) {
    console.error('[Order] guestCheckout', error);
    return res.status(500).json({ error: 'Guest checkout failed', details: error.message });
  }
};

export const reorder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!db.isConnected()) return res.status(503).json({ error: 'Database offline' });

    const previous = await prisma.order.findFirst({
      where: { id: req.params.id, OR: [{ buyerId: userId }, { userId }] },
      include: { orderItems: true }
    });
    if (!previous) return res.status(404).json({ error: 'Original order not found' });

    const items = (previous.orderItems || []).map((it: any) => ({
      productId: it.productId,
      quantity: it.quantity || it.qty || 1
    }));

    req.body = {
      items,
      deliveryAddress: previous.deliveryAddress,
      deliveryDistrict: previous.deliveryDistrict,
      deliveryType: previous.deliveryType || 'standard',
      paymentMethod: 'cod',
      notes: `Reorder of ${previous.orderNo}`
    };
    return addOrder(req, res);
  } catch (error: any) {
    console.error('[Order] reorder', error);
    return res.status(500).json({ error: 'Reorder failed' });
  }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!db.isConnected()) return res.status(503).json({ error: 'Database offline' });

    const { status: targetStatus } = req.body;
    if (!targetStatus) return res.status(400).json({ error: 'Status required' });

    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const allowed = VALID_TRANSITIONS[order.status] || [];
    if (!allowed.includes(targetStatus)) {
      return res.status(400).json({ error: `Cannot transition from ${order.status} to ${targetStatus}` });
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: targetStatus,
        ...(targetStatus === 'delivered' ? { paymentStatus: 'paid' } : {})
      },
      include: { orderItems: { include: { product: true } } }
    });

    return res.json(mapOrderForResponse(updated));
  } catch (error: any) {
    console.error('[Order] updateStatus', error);
    return res.status(500).json({ error: 'Failed to update order status' });
  }
};
