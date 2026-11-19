import { Router } from 'express';
import type { Request, Response } from 'express';
import {
  appendShipmentCheckpoint,
  assignCourierToShipment,
  computeLogisticsQuote,
  CourierPartner,
  createLogisticsDispatch,
  createReturnPickup,
  findShipmentPersistent,
  getNearbyFleetVehicles,
  getOrCreateShipment,
  listLogisticsDispatches,
  listReturnPickups,
  listShipmentsPersistent,
  registerFleetVehicle,
  ShipmentStatus,
  toggleFleetVehicleAvailability,
  verifyShipmentPod
} from './logisticsService.js';
import {
  buildOutboundCourierPayload,
  mapPartnerStatusToShipmentStatus,
  normalizeCourierPartner,
  verifyWebhookSignature
} from './courierAdapters.js';
import { evaluateStoreGeofence, rankHyperlocalProviders } from './distanceEngine.js';
import { LogisticsVehicleClass, VEHICLE_TARIFF_TABLE } from './tariffConfig.js';
import { requireFirebaseAuth } from '../../middleware/requireFirebaseAuth.js';
import { backendEnv, isCourierWebhookConfigured } from '../../config/env.js';
import { upsertStoredShipmentWaybill } from '../../services/dbService.js';

export const logisticsRouter = Router();

// POST /api/logistics/quote
logisticsRouter.post('/quote', (req: Request, res: Response) => {
  const {
    vehicleClass,
    distanceKm,
    pickupCoords,
    dropCoords,
    weightKg,
    stopCount,
    rentalHours,
    weatherMode,
    dispatchType
  } = req.body;

  const targetClass: LogisticsVehicleClass =
    vehicleClass && vehicleClass in VEHICLE_TARIFF_TABLE ? vehicleClass : 'bike';

  const quote = computeLogisticsQuote({
    vehicleClass: targetClass,
    distanceKm: distanceKm ? Number(distanceKm) : undefined,
    pickupCoords,
    dropCoords,
    weightKg: weightKg ? Number(weightKg) : undefined,
    stopCount: stopCount ? Number(stopCount) : 1,
    rentalHours: rentalHours ? Number(rentalHours) : undefined,
    weatherMode,
    dispatchType
  });

  res.json({
    success: true,
    quote
  });
});

// POST /api/logistics/geofence-check
logisticsRouter.post('/geofence-check', (req: Request, res: Response) => {
  const { storeLat, storeLng, buyerLat, buyerLng, serviceRadiusKm, prepMinutes } = req.body;

  if (
    storeLat == null ||
    storeLng == null ||
    buyerLat == null ||
    buyerLng == null
  ) {
    res.status(400).json({ error: 'storeLat, storeLng, buyerLat, and buyerLng are required' });
    return;
  }

  const evaluation = evaluateStoreGeofence({
    storeLat: Number(storeLat),
    storeLng: Number(storeLng),
    buyerLat: Number(buyerLat),
    buyerLng: Number(buyerLng),
    serviceRadiusKm: serviceRadiusKm ? Number(serviceRadiusKm) : 5,
    prepMinutes: prepMinutes ? Number(prepMinutes) : 12
  });

  res.json({
    success: true,
    geofence: evaluation
  });
});

// POST /api/logistics/hyperlocal/rank
logisticsRouter.post('/hyperlocal/rank', (req: Request, res: Response) => {
  const { buyerLat, buyerLng, radiusKm, providers } = req.body || {};

  if (buyerLat == null || buyerLng == null || !Array.isArray(providers)) {
    res.status(400).json({ error: 'buyerLat, buyerLng, and providers[] are required' });
    return;
  }

  const ranked = rankHyperlocalProviders({
    buyerLat: Number(buyerLat),
    buyerLng: Number(buyerLng),
    radiusKm: radiusKm ? Number(radiusKm) : 5,
    providers
  });

  res.json({
    success: true,
    ranked
  });
});

// GET /api/logistics/shipments
logisticsRouter.get('/shipments', requireFirebaseAuth, async (_req: Request, res: Response) => {
  const shipments = await listShipmentsPersistent();
  res.json({
    success: true,
    shipments
  });
});

// GET /api/logistics/shipments/:orderId
logisticsRouter.get('/shipments/:orderId', async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const shipment =
    (await findShipmentPersistent(orderId)) ||
    getOrCreateShipment(orderId, {
      dropLocation: typeof req.query.drop === 'string' ? req.query.drop : undefined
    });

  res.json({
    success: true,
    shipment
  });
});

// GET /api/logistics/shipments/:orderId/outbound-payload
logisticsRouter.get('/shipments/:orderId/outbound-payload', requireFirebaseAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const shipment = (await findShipmentPersistent(orderId)) || getOrCreateShipment(orderId);
  res.json({
    success: true,
    partner: shipment.courierPartner,
    payload: buildOutboundCourierPayload(shipment)
  });
});

// POST /api/logistics/webhooks/:partner (Signed external courier status updates)
logisticsRouter.post('/webhooks/:partner', async (req: Request, res: Response) => {
  const partner = normalizeCourierPartner(req.params.partner);
  if (!partner) {
    res.status(400).json({ error: 'Unsupported courier partner.' });
    return;
  }

  if (!isCourierWebhookConfigured()) {
    res.status(503).json({
      error: 'Courier webhook secret is not configured. External tracking updates remain fail-closed.'
    });
    return;
  }

  const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;
  const isSignatureValid = verifyWebhookSignature({
    rawBody,
    bodyFallback: req.body,
    providedSignature: req.header('x-courier-signature') || req.header('x-webhook-signature'),
    providedSecretHeader: req.header('x-courier-secret'),
    authorizationHeader: req.header('authorization'),
    secret: backendEnv.courierWebhookSecret
  });

  if (!isSignatureValid) {
    res.status(401).json({ error: 'Invalid or missing courier webhook signature.' });
    return;
  }

  const body = req.body || {};
  const lookupKey = String(
    body.trackingNumber ||
      body.tracking_code ||
      body.consignment_id ||
      body.orderId ||
      body.merchant_order_id ||
      ''
  ).trim();

  if (!lookupKey) {
    res.status(400).json({ error: 'trackingNumber, consignment_id, or orderId is required.' });
    return;
  }

  const existing = await findShipmentPersistent(lookupKey);
  if (!existing && !body.orderId) {
    res.status(404).json({ error: 'Matching waybill or order not found for tracking update.' });
    return;
  }

  const rawPartnerStatus = String(
    body.status || body.delivery_status || body.order_status || 'IN_TRANSIT'
  );
  const mappedStatus = mapPartnerStatusToShipmentStatus(partner, rawPartnerStatus);
  const message =
    typeof body.message === 'string' && body.message.trim()
      ? `${partner}: ${body.message.trim().slice(0, 240)}`
      : `${partner} webhook update (${rawPartnerStatus})`;
  const location =
    typeof body.location === 'string' && body.location.trim()
      ? body.location.trim().slice(0, 140)
      : undefined;

  const targetOrderId = existing ? existing.orderId : String(body.orderId);
  const updated = appendShipmentCheckpoint(targetOrderId, mappedStatus, message, location);
  const persisted = await upsertStoredShipmentWaybill(updated);

  res.json({
    success: true,
    partner,
    mappedStatus,
    persisted,
    shipment: updated
  });
});

// POST /api/logistics/shipments/:orderId/checkpoint
logisticsRouter.post('/shipments/:orderId/checkpoint', requireFirebaseAuth, (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status, message, location } = req.body as {
    status?: ShipmentStatus;
    message?: string;
    location?: string;
  };

  const validStatuses: ShipmentStatus[] = [
    'PENDING',
    'PICKUP_ASSIGNED',
    'IN_TRANSIT',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'RETURN_REQUESTED',
    'CANCELLED'
  ];

  const targetStatus: ShipmentStatus =
    status && validStatuses.includes(status) ? status : 'IN_TRANSIT';

  const updated = appendShipmentCheckpoint(orderId, targetStatus, message, location);
  res.json({
    success: true,
    shipment: updated
  });
});

// POST /api/logistics/shipments/:orderId/verify-pod
logisticsRouter.post('/shipments/:orderId/verify-pod', requireFirebaseAuth, (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { otp, recipientName, photoDataUrl, signatureDataUrl } = req.body;

  if (!otp) {
    res.status(400).json({ error: '4-digit recipient Delivery OTP is required.' });
    return;
  }

  const result = verifyShipmentPod(orderId, {
    otp: String(otp),
    recipientName,
    photoDataUrl,
    signatureDataUrl,
    userId: res.locals.auth.uid
  });

  if (!result.ok) {
    res.status(400).json({ error: result.error });
    return;
  }

  res.json({
    success: true,
    shipment: result.shipment,
    escrowReleased: result.escrowReleased
  });
});

// POST /api/logistics/shipments/:orderId/assign-courier
logisticsRouter.post('/shipments/:orderId/assign-courier', requireFirebaseAuth, (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { courierPartner } = req.body as { courierPartner?: CourierPartner };
  const validPartners: CourierPartner[] = ['PaikarForce', 'Steadfast', 'Pathao', 'RedX'];

  if (!courierPartner || !validPartners.includes(courierPartner)) {
    res.status(400).json({ error: 'Invalid courier partner' });
    return;
  }

  const shipment = assignCourierToShipment(orderId, courierPartner);
  res.json({
    success: true,
    shipment
  });
});

// GET /api/logistics/returns & POST /api/logistics/returns
logisticsRouter.get('/returns', requireFirebaseAuth, (_req: Request, res: Response) => {
  res.json({
    success: true,
    returns: listReturnPickups()
  });
});

logisticsRouter.post('/returns', requireFirebaseAuth, (req: Request, res: Response) => {
  const { orderId, reason, pickupAddress, courierPartner } = req.body;
  if (!orderId || !reason || !pickupAddress) {
    res.status(400).json({ error: 'orderId, reason, and pickupAddress are required' });
    return;
  }

  const returnRecord = createReturnPickup({
    orderId: String(orderId),
    userId: res.locals.auth.uid,
    reason: String(reason),
    pickupAddress: String(pickupAddress),
    courierPartner
  });

  res.status(201).json({
    success: true,
    returnRecord
  });
});

// GET /api/logistics/vehicles/nearby
logisticsRouter.get('/vehicles/nearby', (req: Request, res: Response) => {
  const type = typeof req.query.type === 'string' ? req.query.type : undefined;
  const includeOffline = req.query.includeOffline === 'true';
  const vehicles = getNearbyFleetVehicles(type, includeOffline);

  res.json({
    success: true,
    vehicles,
    meta: { count: vehicles.length }
  });
});

// GET / POST / PATCH /api/logistics/fleet
logisticsRouter.get('/fleet', (_req: Request, res: Response) => {
  res.json({
    success: true,
    vehicles: getNearbyFleetVehicles(undefined, true)
  });
});

logisticsRouter.post('/fleet', requireFirebaseAuth, (req: Request, res: Response) => {
  const { type, model, licensePlate, capacity, driverName, driverPhone, currentArea } = req.body;
  if (!model || !licensePlate || !driverName || !driverPhone) {
    res.status(400).json({ error: 'Model, license plate, driver name, and phone are required.' });
    return;
  }

  const vehicle = registerFleetVehicle({
    type: type && type in VEHICLE_TARIFF_TABLE ? type : 'bike',
    model: String(model),
    licensePlate: String(licensePlate),
    capacity: String(capacity || ''),
    driverName: String(driverName),
    driverPhone: String(driverPhone),
    currentArea: String(currentArea || 'Dhaka Metro')
  });

  res.status(201).json({
    success: true,
    vehicle
  });
});

logisticsRouter.patch('/fleet/:vehicleId/availability', requireFirebaseAuth, (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const { isOnline, currentArea } = req.body;
  const updated = toggleFleetVehicleAvailability(vehicleId, isOnline, currentArea);

  if (!updated) {
    res.status(404).json({ error: 'Fleet vehicle not found' });
    return;
  }

  res.json({
    success: true,
    vehicle: updated
  });
});

// GET /api/logistics/rides
logisticsRouter.get('/rides', requireFirebaseAuth, (_req: Request, res: Response) => {
  res.json({
    success: true,
    dispatches: listLogisticsDispatches()
  });
});

// POST /api/logistics/rides
logisticsRouter.post('/rides', requireFirebaseAuth, (req: Request, res: Response) => {
  const {
    category,
    vehicleType,
    courierPartner,
    pickupName,
    dropName,
    stops,
    distanceKm,
    weightKg,
    rentalHours,
    dispatchType,
    scheduledAt,
    weatherMode
  } = req.body;

  if (!pickupName || !dropName) {
    res.status(400).json({ error: 'Pickup and destination locations are required' });
    return;
  }

  const dispatch = createLogisticsDispatch({
    userId: res.locals.auth.uid,
    category,
    vehicleType,
    courierPartner,
    pickupName,
    dropName,
    stops: Array.isArray(stops) ? stops : undefined,
    distanceKm: Number(distanceKm || 5),
    weightKg: weightKg ? Number(weightKg) : undefined,
    rentalHours: rentalHours ? Number(rentalHours) : undefined,
    dispatchType,
    scheduledAt,
    weatherMode
  });

  res.status(201).json({
    success: true,
    dispatch
  });
});
