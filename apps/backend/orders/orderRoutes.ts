import { Router } from 'express';
import type { Request, Response } from 'express';
import { getStoredOrders, insertStoredOrder } from '../services/dbService.js';
import {
  appendShipmentCheckpoint,
  getOrCreateShipment,
  ShipmentStatus
} from '../logistics/logisticsService.js';
import { evaluateVoucher } from '../retail/retailRoutes.js';

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
orderRouter.get('/', async (_req: Request, res: Response) => {
  const orders = await getStoredOrders(serverOrders);
  res.json({ orders });
});

// GET /api/orders/:id
orderRouter.get('/:id', (req: Request, res: Response) => {
  const order = serverOrders.find((o) => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  const shipment = getOrCreateShipment(order.id, {
    dropLocation: order.deliveryAddress,
    shippingFee: order.deliveryFee
  });
  res.json({ order, shipment });
});

// GET /api/orders/:id/track
orderRouter.get('/:id/track', (req: Request, res: Response) => {
  const order = serverOrders.find((o) => o.id === req.params.id);
  const shipment = getOrCreateShipment(req.params.id, {
    dropLocation: order?.deliveryAddress
  });

  res.json({
    success: true,
    order: order || null,
    shipment
  });
});

// POST /api/orders
orderRouter.post('/', async (req: Request, res: Response) => {
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

  const subtotal = Math.max(0, Number(req.body?.subtotal || 0));
  const rawDeliveryFee = Number(req.body?.deliveryFee ?? (subtotal > 2000 ? 0 : 60));
  const tax = Math.max(0, Number(req.body?.tax || 0));
  const promoCode = req.body?.promoCode ? String(req.body.promoCode).trim().toUpperCase() : undefined;

  let discount = 0;
  let effectiveDeliveryFee = rawDeliveryFee;

  if (promoCode) {
    const categories = Array.isArray(req.body?.items)
      ? req.body.items.map((i: any) => String(i?.product?.category || i?.category || ''))
      : [];
    const evalResult = evaluateVoucher(promoCode, subtotal, categories);
    if (evalResult.valid) {
      discount = evalResult.discountBdt;
      if (evalResult.freeShipping) {
        effectiveDeliveryFee = 0;
      }
    }
  }

  const computedTotal = Math.max(0, Number((subtotal + effectiveDeliveryFee + tax - discount).toFixed(2)));
  const orderId = req.body?.id || `PKM-${Math.floor(100000 + Math.random() * 900000)}`;
  const newOrder: ServerOrderRecord = {
    id: orderId,
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    trackingStep: 1,
    deliveryAddress: req.body?.deliveryAddress || 'Dhaka, Bangladesh',
    paymentMethod: req.body?.paymentMethod || 'Mobile Wallet (bKash/Nagad)',
    estimatedArrival: req.body?.estimatedArrival || '45 mins',
    subtotal,
    deliveryFee: effectiveDeliveryFee,
    tax,
    discount,
    promoCode: discount > 0 || effectiveDeliveryFee === 0 ? promoCode : undefined,
    total: computedTotal > 0 ? computedTotal : Number(req.body?.total || 0),
    items: Array.isArray(req.body?.items) ? req.body.items : [],
    buyerName: req.body?.buyerName,
    buyerPhone: req.body?.buyerPhone,
    storeId: req.body?.storeId,
    storeName: req.body?.storeName,
    prescriptionId: req.body?.prescriptionId,
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
orderRouter.post('/:id/reorder', async (req: Request, res: Response) => {
  const previous = serverOrders.find((o) => o.id === req.params.id);
  const sourceOrder = previous || req.body?.fallbackOrder;

  if (!sourceOrder) {
    res.status(404).json({ error: 'Original order not found for reorder' });
    return;
  }

  const nextId = `PKM-${Math.floor(100000 + Math.random() * 900000)}`;
  const cloned: ServerOrderRecord = {
    ...sourceOrder,
    id: nextId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'confirmed',
    trackingStep: 1,
    estimatedArrival: '40 mins'
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

  let order = serverOrders.find((o) => o.id === req.params.id);
  if (!order && req.body?.fallbackOrder) {
    order = {
      ...req.body.fallbackOrder,
      id: req.params.id
    };
    serverOrders.unshift(order!);
  }

  if (!order) {
    res.status(404).json({ error: 'Order not found' });
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

orderRouter.patch('/:id/status', handleUpdateStatus);
orderRouter.put('/:id/status', handleUpdateStatus);
