import { Router } from 'express';
import type { Request, Response } from 'express';
import { getStoredOrders, insertStoredOrder, supabaseAdmin } from '../../services/dbService.js';
import {
  appendShipmentCheckpoint,
  getOrCreateShipment,
  ShipmentStatus
} from '../logistics/logisticsService.js';
import { evaluateVoucher } from '../retail/retailRoutes.js';
import { isPrivilegedRole, optionalFirebaseAuth, requireFirebaseAuth } from '../../middleware/requireFirebaseAuth.js';
import { isStoreOwnedByUser } from '../vendors/vendorService.js';

export const orderRouter = Router();

export type OrderLifecycleStatus = 'confirmed' | 'preparing' | 'in_transit' | 'delivered';

interface ServerOrderRecord {
  id: string;
  createdAt: string;
  status: OrderLifecycleStatus;
  trackingStep: number;
  deliveryAddress: string;
  paymentMethod: string;
  estimatedArrival: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount?: number;
  promoCode?: string;
  total: number;
  items: any[];
  customerId?: string;
  buyerName?: string;
  buyerPhone?: string;
  storeId?: string;
  storeName?: string;
  prescriptionId?: string;
  riderName?: string;
  riderPhone?: string;
  idempotencyKey?: string;
  updatedAt?: string;
}

const serverOrders: ServerOrderRecord[] = [];

const STATUS_TO_STEP: Record<OrderLifecycleStatus, number> = {
  confirmed: 1,
  preparing: 2,
  in_transit: 3,
  delivered: 4
};

const VALID_TRANSITIONS: Record<OrderLifecycleStatus, OrderLifecycleStatus[]> = {
  confirmed: ['preparing', 'in_transit', 'delivered'],
  preparing: ['in_transit', 'delivered'],
  in_transit: ['delivered'],
  delivered: []
};

const STATUS_TO_SHIPMENT: Record<OrderLifecycleStatus, ShipmentStatus> = {
  confirmed: 'PENDING',
  preparing: 'PICKUP_ASSIGNED',
  in_transit: 'OUT_FOR_DELIVERY',
  delivered: 'DELIVERED'
};

// GET /api/orders
orderRouter.get('/', requireFirebaseAuth, async (_req: Request, res: Response) => {
  const auth = res.locals.auth;
  const allOrders = await getStoredOrders(serverOrders);
  const orders = isPrivilegedRole(auth)
    ? allOrders
    : allOrders.filter((o: any) => o.customerId === auth.uid || o.customer_id === auth.uid);
  res.json({ orders });
});

// GET /api/orders/:id
orderRouter.get('/:id', requireFirebaseAuth, (req: Request, res: Response) => {
  const order = serverOrders.find((o) => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  const auth = res.locals.auth;
  if (!isPrivilegedRole(auth) && order.customerId !== auth.uid) {
    res.status(403).json({ error: 'Not authorized to view this order.' });
    return;
  }
  const shipment = getOrCreateShipment(order.id, {
    dropLocation: order.deliveryAddress,
    shippingFee: order.deliveryFee
  });
  res.json({ order, shipment });
});

// GET /api/orders/:id/track (Public zero-PII status & milestone projection)
orderRouter.get('/:id/track', (req: Request, res: Response) => {
  const order = serverOrders.find((o) => o.id === req.params.id);
  const shipment = getOrCreateShipment(req.params.id);

  res.json({
    success: true,
    order: order
      ? {
          id: order.id,
          status: order.status,
          trackingStep: order.trackingStep,
          estimatedArrival: order.estimatedArrival,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          storeName: order.storeName,
        }
      : null,
    shipment: {
      trackingNumber: shipment.trackingNumber,
      orderId: shipment.orderId,
      courierPartner: shipment.courierPartner,
      status: shipment.status,
      estimatedDelivery: shipment.estimatedDelivery,
      etaText: shipment.etaText,
      checkpoints: shipment.checkpoints,
      updatedAt: shipment.updatedAt,
    }
  });
});

async function calculateAuthoritativeOrderTotals(params: {
  items: any[];
  fallbackSubtotal?: number;
  promoCode?: string;
}) {
  const sanitizedItems = Array.isArray(params.items) ? params.items : [];
  const listingIds = sanitizedItems
    .map((item) => item?.product?.id || item?.productId || item?.id)
    .filter((id): id is string => typeof id === 'string' && /^[0-9a-f-]{36}$/i.test(id));

  const authoritativePriceMap = new Map<string, number>();
  if (supabaseAdmin && listingIds.length > 0) {
    try {
      const { data } = await supabaseAdmin
        .from('seller_listings')
        .select('id, price')
        .in('id', listingIds)
        .eq('is_active', true);
      if (Array.isArray(data)) {
        for (const row of data) {
          const price = Number(row.price);
          if (Number.isFinite(price) && price >= 0) {
            authoritativePriceMap.set(row.id, price);
          }
        }
      }
    } catch {
      // Fallback to sanitized item prices when offline
    }
  }

  let computedSubtotal = 0;
  for (const item of sanitizedItems) {
    const itemId = String(item?.product?.id || item?.productId || item?.id || '');
    const dbUnitPrice = authoritativePriceMap.get(itemId);
    const rawUnit = dbUnitPrice !== undefined
      ? dbUnitPrice
      : Number(item?.product?.price ?? item?.price ?? 0);
    const safeUnit = Number.isFinite(rawUnit) && rawUnit >= 0 ? rawUnit : 0;
    const rawQty = Number(item?.quantity ?? 1);
    const safeQty = Number.isFinite(rawQty) ? Math.max(1, Math.min(10000, Math.floor(rawQty))) : 1;
    computedSubtotal += safeUnit * safeQty;
  }

  const fallbackSub = Number(params.fallbackSubtotal ?? 0);
  const subtotal = computedSubtotal > 0
    ? Number(computedSubtotal.toFixed(2))
    : (Number.isFinite(fallbackSub) && fallbackSub > 0 ? Number(fallbackSub.toFixed(2)) : 0);
  const rawDeliveryFee = subtotal > 2000 || subtotal === 0 ? 0 : 60;
  const tax = Number((subtotal * 0.05).toFixed(2));
  const promoCode = params.promoCode ? String(params.promoCode).trim().toUpperCase() : undefined;

  let discount = 0;
  let effectiveDeliveryFee = rawDeliveryFee;

  if (promoCode) {
    const categories = sanitizedItems.map((i: any) => String(i?.product?.category || i?.category || ''));
    const evalResult = evaluateVoucher(promoCode, subtotal, categories);
    if (evalResult.valid) {
      discount = evalResult.discountBdt;
      if (evalResult.freeShipping) {
        effectiveDeliveryFee = 0;
      }
    }
  }

  const total = Math.max(0, Number((subtotal + effectiveDeliveryFee + tax - discount).toFixed(2)));
  return {
    subtotal,
    deliveryFee: effectiveDeliveryFee,
    tax,
    discount,
    promoCode: discount > 0 || (promoCode && effectiveDeliveryFee === 0) ? promoCode : undefined,
    total
  };
}

// POST /api/orders
orderRouter.post('/', optionalFirebaseAuth, async (req: Request, res: Response) => {
  const idempotencyKey =
    (req.headers['x-idempotency-key'] as string) || req.body?.idempotencyKey;

  if (idempotencyKey) {
    const existing = serverOrders.find((o) => o.idempotencyKey === idempotencyKey);
    if (existing) {
      const shipment = getOrCreateShipment(existing.id, {
        dropLocation: existing.deliveryAddress,
        shippingFee: existing.deliveryFee
      });
      res.status(200).json({ success: true, order: existing, shipment });
      return;
    }
  }

  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  if (items.length === 0 && !(Number(req.body?.subtotal) > 0)) {
    res.status(400).json({ error: 'Order items or valid subtotal are required.' });
    return;
  }

  const totals = await calculateAuthoritativeOrderTotals({
    items,
    fallbackSubtotal: req.body?.subtotal,
    promoCode: req.body?.promoCode
  });

  const orderId = `PKM-${Math.floor(100000 + Math.random() * 900000)}`;
  const newOrder: ServerOrderRecord = {
    id: orderId,
    customerId: res.locals.auth?.uid,
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    trackingStep: 1,
    deliveryAddress: String(req.body?.deliveryAddress || 'Dhaka, Bangladesh').slice(0, 300),
    paymentMethod: String(req.body?.paymentMethod || 'Mobile Wallet (bKash/Nagad)').slice(0, 80),
    estimatedArrival: String(req.body?.estimatedArrival || '45 mins').slice(0, 60),
    subtotal: totals.subtotal,
    deliveryFee: totals.deliveryFee,
    tax: totals.tax,
    discount: totals.discount,
    promoCode: totals.promoCode,
    total: totals.total,
    items,
    buyerName: req.body?.buyerName ? String(req.body.buyerName).slice(0, 100) : undefined,
    buyerPhone: req.body?.buyerPhone ? String(req.body.buyerPhone).slice(0, 32) : undefined,
    storeId: req.body?.storeId ? String(req.body.storeId).slice(0, 120) : undefined,
    storeName: req.body?.storeName ? String(req.body.storeName).slice(0, 120) : undefined,
    prescriptionId: req.body?.prescriptionId ? String(req.body.prescriptionId).slice(0, 120) : undefined,
    idempotencyKey,
    updatedAt: new Date().toISOString()
  };

  await insertStoredOrder(newOrder);
  serverOrders.unshift(newOrder);

  const shipment = getOrCreateShipment(newOrder.id, {
    dropLocation: newOrder.deliveryAddress,
    shippingFee: newOrder.deliveryFee
  });

  res.status(201).json({ success: true, order: newOrder, shipment });
});

// POST /api/orders/:id/reorder
orderRouter.post('/:id/reorder', requireFirebaseAuth, async (req: Request, res: Response) => {
  const previous = serverOrders.find((o) => o.id === req.params.id);
  const auth = res.locals.auth;
  if (previous && !isPrivilegedRole(auth) && previous.customerId !== auth.uid) {
    res.status(403).json({ error: 'Not authorized to reorder this order.' });
    return;
  }

  const fallbackOrder = req.body?.fallbackOrder;
  if (!previous && fallbackOrder?.customerId && fallbackOrder.customerId !== auth.uid && !isPrivilegedRole(auth)) {
    res.status(403).json({ error: 'Not authorized to reorder this order.' });
    return;
  }

  const sourceOrder = previous || fallbackOrder;

  if (!sourceOrder) {
    res.status(404).json({ error: 'Original order not found for reorder' });
    return;
  }

  const sourceItems = Array.isArray(sourceOrder.items) ? sourceOrder.items : [];
  const totals = await calculateAuthoritativeOrderTotals({
    items: sourceItems,
    fallbackSubtotal: sourceOrder.subtotal,
    promoCode: sourceOrder.promoCode
  });

  const nextId = `PKM-${Math.floor(100000 + Math.random() * 900000)}`;
  const cloned: ServerOrderRecord = {
    id: nextId,
    customerId: auth.uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'confirmed',
    trackingStep: 1,
    deliveryAddress: String(sourceOrder.deliveryAddress || 'Dhaka, Bangladesh').slice(0, 300),
    paymentMethod: String(sourceOrder.paymentMethod || 'Mobile Wallet (bKash/Nagad)').slice(0, 80),
    estimatedArrival: '40 mins',
    subtotal: totals.subtotal,
    deliveryFee: totals.deliveryFee,
    tax: totals.tax,
    discount: totals.discount,
    promoCode: totals.promoCode,
    total: totals.total,
    items: sourceItems,
    buyerName: sourceOrder.buyerName,
    buyerPhone: sourceOrder.buyerPhone,
    storeId: sourceOrder.storeId,
    storeName: sourceOrder.storeName
  };

  await insertStoredOrder(cloned);
  serverOrders.unshift(cloned);

  const shipment = getOrCreateShipment(cloned.id, {
    dropLocation: cloned.deliveryAddress,
    shippingFee: cloned.deliveryFee
  });

  res.status(201).json({ success: true, order: cloned, shipment });
});

const handleUpdateStatus = (req: Request, res: Response) => {
  const targetStatus = req.body?.status as OrderLifecycleStatus | undefined;
  const validStatuses: OrderLifecycleStatus[] = [
    'confirmed',
    'preparing',
    'in_transit',
    'delivered'
  ];

  if (!targetStatus || !validStatuses.includes(targetStatus)) {
    res.status(400).json({ error: 'Valid lifecycle status is required' });
    return;
  }

  const auth = res.locals.auth;
  let order = serverOrders.find((o) => o.id === req.params.id);
  const fallbackOrder = req.body?.fallbackOrder;
  if (!order && fallbackOrder) {
    const canHydrateFallback =
      isPrivilegedRole(auth) ||
      fallbackOrder.customerId === auth.uid ||
      isStoreOwnedByUser(fallbackOrder.storeId, auth.uid);
    if (!canHydrateFallback) {
      res.status(403).json({ error: 'Not authorized to initialize or update this order status.' });
      return;
    }
    order = {
      ...fallbackOrder,
      id: req.params.id,
      customerId: fallbackOrder.customerId || auth.uid,
    };
    serverOrders.unshift(order!);
  }

  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  const isAdmin = isPrivilegedRole(auth);
  const isOwningVendor = isStoreOwnedByUser(order.storeId, auth.uid);
  const isBuyerConfirmingDelivery =
    order.customerId === auth.uid &&
    targetStatus === 'delivered' &&
    order.status === 'in_transit';

  if (!isAdmin && !isOwningVendor && !isBuyerConfirmingDelivery) {
    res.status(403).json({ error: 'Not authorized to update this order status.' });
    return;
  }

  if (order.status !== targetStatus) {
    const allowed = VALID_TRANSITIONS[order.status] || [];
    if (!allowed.includes(targetStatus)) {
      res.status(400).json({
        error: `Cannot transition order from ${order.status} to ${targetStatus}`
      });
      return;
    }
  }

  order.status = targetStatus;
  order.trackingStep = STATUS_TO_STEP[targetStatus];
  order.updatedAt = new Date().toISOString();

  const shipmentStatus = STATUS_TO_SHIPMENT[targetStatus];
  const shipment = appendShipmentCheckpoint(
    order.id,
    shipmentStatus,
    req.body?.checkpointMessage,
    req.body?.checkpointLocation
  );

  res.json({
    success: true,
    order,
    shipment
  });
};

orderRouter.patch('/:id/status', requireFirebaseAuth, handleUpdateStatus);
orderRouter.put('/:id/status', requireFirebaseAuth, handleUpdateStatus);
