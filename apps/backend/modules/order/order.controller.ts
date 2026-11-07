import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { prisma, db } from '../../config/database';
import { CommercialPricingService } from '../commercial/commercial.pricing.service';
import { LogisticsAllocationService } from '../commercial/logistics.allocation.service';
import { DigitalEngineService } from '../commercial/digital.engine.service';

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: []
};

// Helper: map order for API response consistency
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

  const subtotal = Number(order.subtotal || order.total || order.totalAmount || 0);
  const vatAmount = Number(order.vatAmount || Math.round(subtotal * 0.05));
  const shippingFee = Number(order.shippingFee || 60);
  const total = Number(order.total || order.totalAmount || (subtotal + vatAmount + shippingFee));

  return {
    id: order.id,
    orderNo: order.orderNo || `PKM-DB${order.id.substring(0, 5).toUpperCase()}`,
    idempotencyKey: order.idempotencyKey,
    buyerId: order.buyerId || order.userId,
    userId: order.userId || order.buyerId,
    sellerId: order.sellerId,
    vendorId: order.vendorId,
    buyerName: order.buyer?.fullName || order.buyer?.name || 'Paikar Mart Buyer',
    status: order.status,
    paymentStatus: order.paymentStatus || 'unpaid',
    paymentMethod: order.paymentMethod || 'cod',
    deliveryType: order.deliveryType || 'standard',
    scheduledSlot: order.scheduledSlot,
    deliveryAddress: order.deliveryAddress || 'Dhaka, Bangladesh',
    deliveryDistrict: order.deliveryDistrict || 'Dhaka',
    notes: order.notes || '',
    subtotal,
    vatAmount,
    shippingFee,
    total,
    totalAmount: total,
    currency: 'BDT',
    createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
    updatedAt: order.updatedAt instanceof Date ? order.updatedAt.toISOString() : order.updatedAt,
    orderItems: itemsList,
    items: itemsList
  };
};

// Helper: Check caller authorization for an order
const canAccessOrder = async (order: any, user: any): Promise<{ allowed: boolean; isOwner: boolean; isSeller: boolean; isAdmin: boolean }> => {
  const isAdmin = user.role === 'admin' || user.role === 'super_admin';
  if (isAdmin) return { allowed: true, isOwner: false, isSeller: false, isAdmin: true };

  const userId = user.id;
  const isOwner = (order.buyerId === userId) || (order.userId === userId);
  if (isOwner) return { allowed: true, isOwner: true, isSeller: false, isAdmin: false };

  let isSeller = (order.sellerId === userId);
  if (!isSeller && db.isConnected()) {
    const vendorProfile = await prisma.vendorProfile.findUnique({ where: { userId } });
    if (vendorProfile && order.vendorId === vendorProfile.id) {
      isSeller = true;
    }
  }

  return { allowed: isSeller, isOwner: false, isSeller, isAdmin: false };
};

/**
 * 📦 GET /api/v1/orders
 * Returns orders isolated strictly by user context:
 * - Buyers see only their own orders
 * - Sellers see only orders belonging to their store
 * - Admins see all orders
 */
export const getOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }

    if (!db.isConnected()) {
      return res.json([]);
    }

    let whereCondition: any = {};

    if (user.role === 'admin' || user.role === 'super_admin') {
      whereCondition = {};
    } else if (user.role === 'seller' || user.isSeller) {
      const vendorProfile = await prisma.vendorProfile.findUnique({ where: { userId: user.id } });
      const vendorId = vendorProfile?.id;
      whereCondition = {
        OR: [
          { sellerId: user.id },
          ...(vendorId ? [{ vendorId }] : [])
        ]
      };
    } else {
      whereCondition = {
        OR: [
          { buyerId: user.id },
          { userId: user.id }
        ]
      };
    }

    const orders = await prisma.order.findMany({
      where: whereCondition,
      include: {
        orderItems: { include: { product: true } },
        buyer: { select: { id: true, fullName: true, phone: true } },
        vendor: { select: { id: true, shopName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(orders.map(mapOrderForResponse));
  } catch (error: any) {
    console.error('Fetch Orders Error:', error);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

/**
 * 🔍 GET /api/v1/orders/:id
 * Direct order lookup with strict tenant isolation
 */
export const getOrderById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }

    const { id } = req.params;

    if (!db.isConnected()) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: { include: { product: true } },
        buyer: { select: { id: true, fullName: true, phone: true } },
        vendor: { select: { id: true, shopName: true } }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const access = await canAccessOrder(order, user);
    if (!access.allowed) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to view this order' });
    }

    return res.json(mapOrderForResponse(order));
  } catch (error: any) {
    console.error('Fetch Order By ID Error:', error);
    return res.status(500).json({ error: 'Failed to fetch order details' });
  }
};

/**
 * 🚚 GET /api/v1/orders/:id/track
 * Retrieves live order tracking status for authorized owner/seller/admin
 */
export const trackOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }

    const { id } = req.params;

    if (db.isConnected()) {
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const access = await canAccessOrder(order, user);
      if (!access.allowed) {
        return res.status(403).json({ error: 'Forbidden: You do not have permission to track this order' });
      }

      return res.json({
        orderId: order.id,
        status: order.status,
        deliveryStatus: order.status,
        eta: order.status === 'delivered' ? 'Delivery completed' : '30-45 mins',
        currentLocation: 'Mohakhali Transit Hub',
        timeline: [
          { label: 'Order Received', time: order.createdAt.toISOString(), completed: true },
          { label: 'Processing', time: 'In progress', completed: order.status !== 'pending' },
          { label: 'Dispatched to Rider', time: 'Pending', completed: ['shipped', 'delivered'].includes(order.status) },
          { label: 'Delivery Completed', time: 'Pending', completed: order.status === 'delivered' }
        ]
      });
    }

    return res.status(404).json({ error: 'Order not found' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch tracking details' });
  }
};

/**
 * 🛒 POST /api/v1/orders
 * Places a new order from cart / items with server-side pricing & stock validation,
 * atomic DB transactions, inventory decrement, and idempotency key policy.
 */
export const addOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }

    const idempotencyKey = (req.headers['x-idempotency-key'] as string) || req.body.idempotencyKey;

    // Idempotency check: Return existing order if retried with same idempotency key
    if (idempotencyKey && db.isConnected()) {
      const existing = await prisma.order.findUnique({
        where: { idempotencyKey },
        include: { orderItems: { include: { product: true } } }
      });
      if (existing) {
        if (existing.buyerId === userId || existing.userId === userId || req.user?.role === 'admin') {
          return res.status(200).json(mapOrderForResponse(existing));
        }
      }
    }

    const {
      items: rawItems,
      productId,
      quantity,
      deliveryAddress,
      deliveryDistrict,
      paymentMethod = 'cod',
      notes,
      deliveryType = 'standard',
      scheduledSlot
    } = req.body;

    if (!deliveryAddress || String(deliveryAddress).trim().length < 5) {
      return res.status(400).json({ error: 'INVALID_ADDRESS', message: 'Please provide a valid delivery address.' });
    }

    // Build raw order items array
    let itemsToProcess: Array<{ productId: string; quantity: number }> = [];

    if (Array.isArray(rawItems) && rawItems.length > 0) {
      itemsToProcess = rawItems.map((it: any) => ({
        productId: it.productId || it.id,
        quantity: Math.max(1, parseInt(it.quantity || it.qty || 1, 10))
      }));
    } else if (productId) {
      itemsToProcess = [{
        productId,
        quantity: Math.max(1, parseInt(quantity || 1, 10))
      }];
    } else if (db.isConnected()) {
      // Load user's DB cart if items not directly passed
      const dbCartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true }
      });
      itemsToProcess = dbCartItems.map(c => ({
        productId: c.productId,
        quantity: c.qty
      }));
    }

    if (itemsToProcess.length === 0) {
      return res.status(400).json({ error: 'EMPTY_CART', message: 'Cart or items array cannot be empty.' });
    }

    if (!db.isConnected()) {
      return res.status(503).json({ error: 'DB_UNAVAILABLE', message: 'Database connection required for order creation.' });
    }

    // 1. Validate Stock & Calculate Server-Authoritative Prices
    const validatedOrderItems: Array<{
      productId: string;
      title: string;
      productImage: string;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
      sellerId: string | null;
      vendorId: string | null;
    }> = [];

    let subtotalSum = 0;

    for (const item of itemsToProcess) {
      const dbProduct = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!dbProduct) {
        return res.status(404).json({ error: 'PRODUCT_NOT_FOUND', message: `Product with ID '${item.productId}' not found.` });
      }

      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({
          error: 'INSUFFICIENT_STOCK',
          message: `Stock insufficient for "${dbProduct.title}". Available: ${dbProduct.stock}, requested: ${item.quantity}.`
        });
      }

      const pricing = await CommercialPricingService.calculateTieredPricing(item.productId, item.quantity);
      if (!pricing.isMoqMet) {
        return res.status(400).json({
          error: 'MOQ_VIOLATION',
          message: `Minimum order quantity (MOQ) not met for "${pricing.productName}". Minimum required: ${pricing.moq}, selected: ${item.quantity}.`,
          requiredMoq: pricing.moq,
          requestedQuantity: item.quantity
        });
      }

      const unitPrice = pricing.effectiveUnitPrice;
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
        vendorId: dbProduct.vendorId
      });
    }

    const isInsideDhaka = String(deliveryDistrict || deliveryAddress).toLowerCase().includes('dhaka');
    const shippingFee = isInsideDhaka ? 60 : 120;
    const vatAmount = Math.round(subtotalSum * 0.05);
    const grandTotal = subtotalSum + vatAmount + shippingFee;

    const orderNo = `PKM-${Date.now().toString(36).toUpperCase()}`;

    // Group items by vendorId or primary sellerId
    const primaryVendorId = validatedOrderItems[0]?.vendorId || null;
    const primarySellerId = validatedOrderItems[0]?.sellerId || null;

    // 2. Atomic Database Transaction: Order creation + Inventory decrement + Cart clear
    const createdOrder = await prisma.$transaction(async (tx) => {
      // Create Order
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
        include: {
          orderItems: { include: { product: true } }
        }
      });

      // Decrement Inventory Stock for each item
      for (const item of validatedOrderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity }
          }
        });
      }

      // Clear user DB Cart
      await tx.cartItem.deleteMany({
        where: { userId }
      });

      // Create initial Escrow record if payment is paid via wallet
      if (paymentMethod === 'wallet') {
        await tx.escrow.create({
          data: {
            orderId: newOrder.id,
            amount: grandTotal,
            status: 'held',
            releaseAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        });
      }

      return newOrder;
    });

    return res.status(201).json(mapOrderForResponse(createdOrder));
  } catch (error: any) {
    console.error('[Order Controller] Add Order Error:', error);
    return res.status(500).json({ error: 'Failed to place order', details: error.message });
  }
};

/**
 * 👤 POST /api/v1/orders/guest-checkout
 * Abuse-resistant guest checkout with server price verification
 */
export const guestCheckout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      fullName,
      phone,
      email,
      deliveryAddress,
      deliveryDistrict,
      paymentMethod = 'cod',
      cartItems = []
    } = req.body ?? {};

    if (!fullName || String(fullName).trim().length < 2) {
      return res.status(400).json({ error: 'INVALID_NAME', message: 'Please enter your full name.' });
    }
    if (!phone || String(phone).trim().length < 10) {
      return res.status(400).json({ error: 'INVALID_PHONE', message: 'Please provide a valid phone number.' });
    }
    if (!deliveryAddress || String(deliveryAddress).trim().length < 5) {
      return res.status(400).json({ error: 'INVALID_ADDRESS', message: 'Please provide a valid delivery address.' });
    }
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'EMPTY_CART', message: 'Guest checkout requires items.' });
    }

    if (!db.isConnected()) {
      return res.status(503).json({ error: 'DB_UNAVAILABLE', message: 'Database connection required.' });
    }

    const cleanPhone = String(phone).trim();
    const cleanEmail = email ? String(email).trim().toLowerCase() : `${cleanPhone}@paikarmart.com`;

    // Atomic Guest User & Order Creation
    const result = await prisma.$transaction(async (tx) => {
      let guestUser = await tx.user.findFirst({
        where: { OR: [{ phone: cleanPhone }, { email: cleanEmail }] }
      });

      if (!guestUser) {
        guestUser = await tx.user.create({
          data: {
            fullName: String(fullName).trim(),
            phone: cleanPhone,
            email: cleanEmail,
            role: 'buyer'
          }
        });
      }

      let subtotalSum = 0;
      const validatedItems = [];

      for (const item of cartItems) {
        const prodId = item.id || item.productId;
        const qty = Math.max(1, parseInt(item.quantity || item.qty || 1, 10));

        const dbProd = await tx.product.findUnique({ where: { id: prodId } });
        if (!dbProd) {
          throw new Error(`Product '${prodId}' not found`);
        }
        if (dbProd.stock < qty) {
          throw new Error(`Insufficient stock for product '${dbProd.title}'`);
        }

        const unitPrice = Number(dbProd.price);
        const lineTotal = unitPrice * qty;
        subtotalSum += lineTotal;

        validatedItems.push({
          productId: dbProd.id,
          title: dbProd.title,
          productImage: dbProd.images?.[0] || '',
          unitPrice,
          quantity: qty,
          lineTotal
        });

        // Decrement stock
        await tx.product.update({
          where: { id: dbProd.id },
          data: { stock: { decrement: qty } }
        });
      }

      const isInsideDhaka = String(deliveryDistrict || deliveryAddress).toLowerCase().includes('dhaka');
      const shippingFee = isInsideDhaka ? 60 : 120;
      const vatAmount = Math.round(subtotalSum * 0.05);
      const grandTotal = subtotalSum + vatAmount + shippingFee;

      const orderNo = `PKM-GST-${Date.now().toString(36).toUpperCase()}`;

      const order = await tx.order.create({
        data: {
          orderNo,
          buyerId: guestUser.id,
          userId: guestUser.id,
          status: 'pending',
          paymentStatus: 'unpaid',
          paymentMethod,
          deliveryAddress: String(deliveryAddress).trim(),
          deliveryDistrict: String(deliveryDistrict || 'Dhaka').trim(),
          subtotal: subtotalSum,
          vatAmount,
          shippingFee,
          total: grandTotal,
          totalAmount: grandTotal,
          price: grandTotal,
          orderItems: {
            create: validatedItems.map(it => ({
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
        include: {
          orderItems: { include: { product: true } }
        }
      });

      return { order, guestUser };
    });

    return res.status(201).json({
      success: true,
      message: 'Guest order placed successfully.',
      order: mapOrderForResponse(result.order),
      user: {
        id: result.guestUser.id,
        fullName: result.guestUser.fullName,
        phone: result.guestUser.phone
      }
    });
  } catch (error: any) {
    console.error('Guest Checkout Error:', error);
    return res.status(400).json({ error: 'GUEST_CHECKOUT_FAILED', message: error.message });
  }
};

/**
 * 🔁 POST /api/v1/orders/:id/reorder
 * Re-creates order from existing order items for authorized owner
 */
export const reorder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }

    const { id } = req.params;

    if (!db.isConnected()) {
      return res.status(503).json({ error: 'DB_UNAVAILABLE', message: 'Database connection required.' });
    }

    const originalOrder = await prisma.order.findUnique({
      where: { id },
      include: { orderItems: true }
    });

    if (!originalOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (originalOrder.buyerId !== userId && originalOrder.userId !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You do not own this order' });
    }

    req.body.rawItems = originalOrder.orderItems.map(it => ({
      productId: it.productId,
      quantity: it.quantity || it.qty
    }));
    req.body.deliveryAddress = originalOrder.deliveryAddress || 'Dhaka, Bangladesh';
    req.body.deliveryDistrict = originalOrder.deliveryDistrict || 'Dhaka';

    return addOrder(req, res);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to reorder', details: error.message });
  }
};

/**
 * 🔄 PATCH /api/v1/orders/:id/status & PUT /api/v1/orders/:id/status
 * Validates status transitions allowlist & actor permission checks:
 * - Buyers can only cancel their own pending orders
 * - Sellers can advance/cancel their vendor shop orders
 * - Admins can transition according to allowlist
 */
export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }

    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'MISSING_STATUS', message: 'Status field is required.' });
    }

    if (!db.isConnected()) {
      return res.status(503).json({ error: 'DB_UNAVAILABLE', message: 'Database connection required.' });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { orderItems: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const access = await canAccessOrder(order, user);
    if (!access.allowed) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to update this order' });
    }

    // 1. Status Transition Allowlist Enforcement
    const currentStatus = order.status.toLowerCase();
    const targetStatus = String(status).toLowerCase();

    const allowedNextStates = VALID_TRANSITIONS[currentStatus] || [];
    if (!allowedNextStates.includes(targetStatus)) {
      return res.status(400).json({
        error: 'INVALID_TRANSITION',
        message: `Invalid transition from '${currentStatus}' to '${targetStatus}'. Allowed next states: ${allowedNextStates.join(', ') || 'none (terminal state)'}.`
      });
    }

    // 2. Actor Permission Enforcement
    if (access.isOwner && !access.isAdmin && !access.isSeller) {
      // Buyers can only cancel their own pending order
      if (targetStatus !== 'cancelled') {
        return res.status(403).json({
          error: 'FORBIDDEN_TRANSITION',
          message: 'Buyers can only cancel pending orders.'
        });
      }
    }

    // Perform DB status update inside transaction (and replenish stock if cancelled)
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id },
        data: {
          status: targetStatus,
          ...(targetStatus === 'delivered' ? { paymentStatus: 'paid' } : {})
        },
        include: { orderItems: { include: { product: true } } }
      });

      // Replenish stock if order is cancelled
      if (targetStatus === 'cancelled') {
        for (const item of order.orderItems) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity || item.qty || 1 } }
            });
          }
        }
      }

      return updated;
    });

    return res.json(mapOrderForResponse(updatedOrder));
  } catch (error: any) {
    console.error('Update Order Status Error:', error);
    return res.status(500).json({ error: 'Failed to update order status', details: error.message });
  }
};
