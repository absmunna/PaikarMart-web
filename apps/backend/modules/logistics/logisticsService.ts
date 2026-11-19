import {
  DispatchScheduleType,
  LogisticsVehicleClass,
  MULTI_STOP_FEE_BDT,
  RECURRING_DISCOUNT_RATE,
  SCHEDULED_DISCOUNT_RATE,
  SURGE_MULTIPLIERS,
  VEHICLE_TARIFF_TABLE,
  WeatherTrafficMode
} from './tariffConfig.js';
import { calculateHaversineKm, GeoPoint } from './distanceEngine.js';
import { getEscrowSummaryForUser, releaseEscrowRecord } from '../wallet/walletService.js';
import {
  findStoredShipmentWaybill,
  listStoredShipmentWaybills,
  upsertStoredShipmentWaybill
} from '../../services/dbService.js';

export type ShipmentStatus =
  | 'PENDING'
  | 'PICKUP_ASSIGNED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'RETURN_REQUESTED'
  | 'CANCELLED';

export type CourierPartner = 'PaikarForce' | 'Steadfast' | 'Pathao' | 'RedX';

export interface ShipmentCheckpoint {
  id: string;
  status: ShipmentStatus;
  message: string;
  location: string;
  time: string;
}

export interface CourierRider {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'bike' | 'van' | 'pickup' | 'truck';
  rating: number;
  tripsCount: number;
  currentLocation: { lat: number; lng: number };
}

export interface PodReceipt {
  verifiedAt: string;
  verifiedOtp: string;
  recipientName?: string;
  photoDataUrl?: string;
  signatureDataUrl?: string;
  escrowReleased?: boolean;
}

export interface ShipmentRecord {
  id: string;
  orderId: string;
  courierPartner: CourierPartner;
  trackingNumber: string;
  status: ShipmentStatus;
  deliveryOtp: string;
  checkpoints: ShipmentCheckpoint[];
  rider: CourierRider;
  estimatedDelivery: string;
  etaText: string;
  distanceRemaining: string;
  pickupLocation: string;
  dropLocation: string;
  shippingFee: number;
  podReceipt?: PodReceipt;
  updatedAt: string;
}

export interface FleetVehicle {
  id: string;
  type: LogisticsVehicleClass;
  model: string;
  licensePlate: string;
  capacity: string;
  driverName: string;
  driverPhone: string;
  rating: number;
  etaMinutes: number;
  baseFareBdt: number;
  perKmBdt: number;
  currentArea: string;
  lat: number;
  lng: number;
  isOnline: boolean;
}

export interface RideDispatchRecord {
  id: string;
  trackingCode: string;
  userId: string;
  category: 'RIDE' | 'PARCEL' | 'FREIGHT' | 'RENTAL' | 'EMERGENCY';
  vehicleType: string;
  courierPartner?: CourierPartner;
  pickupName: string;
  dropName: string;
  stops?: string[];
  weightKg?: number;
  rentalHours?: number;
  dispatchType?: DispatchScheduleType;
  scheduledAt?: string;
  weatherMode?: WeatherTrafficMode;
  fareBdt: number;
  distanceKm: number;
  driverName: string;
  driverPhone: string;
  status: 'MATCHING' | 'ASSIGNED' | 'IN_TRANSIT' | 'COMPLETED';
  createdAt: string;
}

export interface ReturnPickupRecord {
  id: string;
  returnWaybill: string;
  orderId: string;
  userId: string;
  reason: string;
  pickupAddress: string;
  courierPartner: CourierPartner;
  status: 'PICKUP_SCHEDULED' | 'IN_TRANSIT' | 'INSPECTED_REFUNDED';
  createdAt: string;
}

export interface LogisticsQuoteRequest {
  vehicleClass: LogisticsVehicleClass;
  distanceKm?: number;
  pickupCoords?: GeoPoint;
  dropCoords?: GeoPoint;
  weightKg?: number;
  stopCount?: number;
  rentalHours?: number;
  weatherMode?: WeatherTrafficMode;
  dispatchType?: DispatchScheduleType;
}

export interface LogisticsQuoteBreakdown {
  vehicleClass: LogisticsVehicleClass;
  label: string;
  labelBn: string;
  category: string;
  distanceKm: number;
  estimatedEtaMin: number;
  baseFareBdt: number;
  distanceFeeBdt: number;
  weightSurchargeBdt: number;
  multiStopFeeBdt: number;
  rentalDurationFeeBdt: number;
  surgeFeeBdt: number;
  surgeMultiplier: number;
  scheduledDiscountBdt: number;
  totalFareBdt: number;
  capacityLabel: string;
}

const shipmentStore = new Map<string, ShipmentRecord>();
const dispatchStore: RideDispatchRecord[] = [];
const returnStore: ReturnPickupRecord[] = [];

const FLEET_VEHICLES: FleetVehicle[] = [
  {
    id: 'veh_bike_01',
    type: 'bike',
    model: 'Suzuki Gixxer 155 Courier',
    licensePlate: 'DHAKA METRO-HA 42-1904',
    capacity: '1 Passenger · Up to 15 kg parcel',
    driverName: 'Anisur Rahman',
    driverPhone: '+8801712889900',
    rating: 4.9,
    etaMinutes: 5,
    baseFareBdt: 50,
    perKmBdt: 15,
    currentArea: 'Karwan Bazar Hub',
    lat: 23.7509,
    lng: 90.3935,
    isOnline: true
  },
  {
    id: 'veh_cng_01',
    type: 'cng',
    model: 'Bajaj RE Eco City CNG',
    licensePlate: 'DHAKA METRO-THA 13-5521',
    capacity: '3 Passengers · Rain protected',
    driverName: 'Shahidul Haque',
    driverPhone: '+8801714223388',
    rating: 4.8,
    etaMinutes: 7,
    baseFareBdt: 80,
    perKmBdt: 22,
    currentArea: 'Farmgate Crossing',
    lat: 23.7561,
    lng: 90.3872,
    isOnline: true
  },
  {
    id: 'veh_car_01',
    type: 'car',
    model: 'Toyota Axio AC Sedan',
    licensePlate: 'DHAKA METRO-GA 33-9024',
    capacity: '4 Passengers · Luggage trunk',
    driverName: 'Faruk Hossain',
    driverPhone: '+8801819774422',
    rating: 4.9,
    etaMinutes: 9,
    baseFareBdt: 140,
    perKmBdt: 34,
    currentArea: 'Gulshan 1 Circle',
    lat: 23.7805,
    lng: 90.4165,
    isOnline: true
  },
  {
    id: 'veh_amb_01',
    type: 'ambulance',
    model: 'HiAce ICU Emergency Ambulance',
    licensePlate: 'DHAKA METRO-CHA 71-0112',
    capacity: 'Oxygen Support · 24/7 Priority',
    driverName: 'Md. Nasir Uddin',
    driverPhone: '+8801911990011',
    rating: 5.0,
    etaMinutes: 8,
    baseFareBdt: 650,
    perKmBdt: 45,
    currentArea: 'Panthapath Medical Zone',
    lat: 23.7518,
    lng: 90.3849,
    isOnline: true
  },
  {
    id: 'veh_parcel_01',
    type: 'parcel',
    model: 'PaikarForce Express Cargo Bike',
    licensePlate: 'DHAKA METRO-LA 19-4412',
    capacity: 'Up to 35 kg insulated box',
    driverName: 'Rakib Hossain',
    driverPhone: '+8801815334455',
    rating: 4.8,
    etaMinutes: 10,
    baseFareBdt: 70,
    perKmBdt: 14,
    currentArea: 'Banani Sorting Point',
    lat: 23.7937,
    lng: 90.4066,
    isOnline: true
  },
  {
    id: 'veh_pickup_01',
    type: 'pickup',
    model: 'Toyota TownAce 1.5 Ton Pickup',
    licensePlate: 'DHAKA METRO-DA 11-7081',
    capacity: '1,500 kg commercial cartons',
    driverName: 'Kamrul Islam',
    driverPhone: '+8801911223344',
    rating: 4.9,
    etaMinutes: 18,
    baseFareBdt: 1200,
    perKmBdt: 62,
    currentArea: 'Tejgaon Industrial Hub',
    lat: 23.7638,
    lng: 90.3991,
    isOnline: true
  },
  {
    id: 'veh_truck_01',
    type: 'truck',
    model: 'Isuzu 5-Ton Covered Freight Van',
    licensePlate: 'GAZIPUR-TA 04-8820',
    capacity: '5,000 kg B2B palletized freight',
    driverName: 'Mizanur Chowdhury',
    driverPhone: '+8801614556677',
    rating: 4.7,
    etaMinutes: 30,
    baseFareBdt: 3600,
    perKmBdt: 105,
    currentArea: 'Gazipur Tongi Corridor',
    lat: 23.8975,
    lng: 90.4048,
    isOnline: true
  },
  {
    id: 'veh_rental_noah_01',
    type: 'rental_noah',
    model: 'Toyota Noah 8-Seater Dual AC',
    licensePlate: 'DHAKA METRO-CHA 52-4180',
    capacity: '8 Seats · Corporate / Inter-district',
    driverName: 'Tanvir Ahmed',
    driverPhone: '+8801755667788',
    rating: 4.9,
    etaMinutes: 20,
    baseFareBdt: 1600,
    perKmBdt: 32,
    currentArea: 'Uttara Sector 7',
    lat: 23.8728,
    lng: 90.3984,
    isOnline: true
  }
];

const PARTNER_PREFIX: Record<CourierPartner, string> = {
  PaikarForce: 'PKF',
  Steadfast: 'SF',
  Pathao: 'PTH',
  RedX: 'RDX'
};

export function computeLogisticsQuote(req: LogisticsQuoteRequest): LogisticsQuoteBreakdown {
  const rule = VEHICLE_TARIFF_TABLE[req.vehicleClass] || VEHICLE_TARIFF_TABLE.bike;

  let distanceKm = Number(req.distanceKm || 0);
  if (req.pickupCoords && req.dropCoords) {
    distanceKm = Math.max(1, calculateHaversineKm(req.pickupCoords, req.dropCoords));
  }
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
    distanceKm = 6;
  }

  const extraStops = Math.max(0, Number(req.stopCount || 1) - 1);
  const multiStopFeeBdt = extraStops * MULTI_STOP_FEE_BDT;

  const weightKg = Math.max(0, Number(req.weightKg || 0));
  const extraWeightKg = Math.max(0, weightKg - rule.freeWeightKg);
  const weightSurchargeBdt = Math.round(extraWeightKg * rule.perExtraKgBdt);

  const rentalHours = req.rentalHours ? Number(req.rentalHours) : 0;
  const rentalDurationFeeBdt =
    rule.hourlyRateBdt && rentalHours > 1
      ? Math.round((rentalHours - 1) * rule.hourlyRateBdt)
      : 0;

  const distanceFeeBdt = Math.round(distanceKm * rule.perKmBdt);
  const subTotal =
    rule.baseFareBdt + distanceFeeBdt + weightSurchargeBdt + multiStopFeeBdt + rentalDurationFeeBdt;

  const weatherMode: WeatherTrafficMode = req.weatherMode || 'normal';
  const surgeMultiplier = SURGE_MULTIPLIERS[weatherMode] ?? 1.0;
  const surgeFeeBdt = Math.round(subTotal * (surgeMultiplier - 1));

  const grossTotal = subTotal + surgeFeeBdt;
  const dispatchType: DispatchScheduleType = req.dispatchType || 'now';
  const discountRate =
    dispatchType === 'recurring'
      ? RECURRING_DISCOUNT_RATE
      : dispatchType === 'scheduled'
      ? SCHEDULED_DISCOUNT_RATE
      : 0;
  const scheduledDiscountBdt = Math.round(grossTotal * discountRate);
  const totalFareBdt = Math.max(rule.baseFareBdt, grossTotal - scheduledDiscountBdt);

  const estimatedEtaMin = rule.baseEtaMin + Math.ceil(distanceKm * 2.4) + extraStops * 6;

  return {
    vehicleClass: rule.vehicleClass,
    label: rule.label,
    labelBn: rule.labelBn,
    category: rule.category,
    distanceKm: Number(distanceKm.toFixed(1)),
    estimatedEtaMin,
    baseFareBdt: rule.baseFareBdt,
    distanceFeeBdt,
    weightSurchargeBdt,
    multiStopFeeBdt,
    rentalDurationFeeBdt,
    surgeFeeBdt,
    surgeMultiplier,
    scheduledDiscountBdt,
    totalFareBdt,
    capacityLabel: rule.maxCapacityLabel
  };
}

export function getOrCreateShipment(
  orderId: string,
  options?: {
    dropLocation?: string;
    pickupLocation?: string;
    courierPartner?: CourierPartner;
    shippingFee?: number;
  }
): ShipmentRecord {
  const existing = shipmentStore.get(orderId);
  if (existing) return existing;

  const partner: CourierPartner = options?.courierPartner || 'PaikarForce';
  const now = new Date().toISOString();
  const numericSuffix = Math.floor(100000 + Math.random() * 900000);
  const otp = String(Math.floor(1000 + Math.random() * 9000));

  const record: ShipmentRecord = {
    id: `SHP-${numericSuffix}`,
    orderId,
    courierPartner: partner,
    trackingNumber: `${PARTNER_PREFIX[partner]}-2026-${numericSuffix}`,
    status: 'PENDING',
    deliveryOtp: otp,
    checkpoints: [
      {
        id: `cp_${Date.now()}`,
        status: 'PENDING',
        message: 'Order manifested & queued for seller warehouse pickup',
        location: options?.pickupLocation || 'Dhaka Central Fulfillment Hub',
        time: now
      }
    ],
    rider: {
      id: 'rider_408',
      name: 'Rakib Hossain (Rider #408)',
      phone: '+8801712889900',
      vehicleType: 'bike',
      rating: 4.9,
      tripsCount: 1420,
      currentLocation: { lat: 23.7509, lng: 90.3935 }
    },
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    etaText: '35 mins - Same Day Express',
    distanceRemaining: '4.2 km',
    pickupLocation: options?.pickupLocation || 'Tejgaon Merchant Warehouse, Dhaka',
    dropLocation: options?.dropLocation || 'Dhanmondi / Banani, Dhaka',
    shippingFee: options?.shippingFee ?? 60,
    updatedAt: now
  };

  shipmentStore.set(orderId, record);
  void upsertStoredShipmentWaybill(record);
  return record;
}

function mapStoredWaybillToShipmentRecord(row: any): ShipmentRecord {
  const status = (row.status || 'PENDING') as ShipmentStatus;
  const partner = (row.courier_partner || 'PaikarForce') as CourierPartner;
  const checkpoints = Array.isArray(row.checkpoints) ? row.checkpoints : [];
  return {
    id: `SHP-${String(row.id || row.tracking_number || '').slice(0, 8)}`,
    orderId: String(row.order_id),
    courierPartner: partner,
    trackingNumber: String(row.tracking_number),
    status,
    deliveryOtp: String(row.delivery_otp || '0000'),
    checkpoints,
    rider: {
      id: 'rider_408',
      name: 'Rakib Hossain (Rider #408)',
      phone: '+8801712889900',
      vehicleType: 'bike',
      rating: 4.9,
      tripsCount: 1420,
      currentLocation: { lat: 23.7509, lng: 90.3935 }
    },
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    etaText: status === 'DELIVERED' ? 'Delivered' : status === 'OUT_FOR_DELIVERY' ? '8 mins' : '25 mins',
    distanceRemaining: status === 'DELIVERED' ? '0.0 km' : status === 'OUT_FOR_DELIVERY' ? '1.4 km' : '4.2 km',
    pickupLocation: String(row.pickup_location || 'Dhaka Fulfillment Hub'),
    dropLocation: String(row.drop_location || 'Dhaka, Bangladesh'),
    shippingFee: Number(row.shipping_fee_bdt ?? 60),
    podReceipt: row.pod_verified_at
      ? {
          verifiedAt: row.pod_verified_at,
          verifiedOtp: String(row.delivery_otp || ''),
          recipientName: 'Verified Recipient'
        }
      : undefined,
    updatedAt: String(row.updated_at || row.created_at || new Date().toISOString())
  };
}

export function listAllShipments(): ShipmentRecord[] {
  return Array.from(shipmentStore.values()).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  );
}

export async function listShipmentsPersistent(): Promise<ShipmentRecord[]> {
  const stored = await listStoredShipmentWaybills();
  if (stored.length > 0) {
    const merged = new Map<string, ShipmentRecord>();
    for (const row of stored) {
      const mapped = mapStoredWaybillToShipmentRecord(row);
      merged.set(mapped.trackingNumber, mapped);
    }
    for (const mem of shipmentStore.values()) {
      if (!merged.has(mem.trackingNumber)) {
        merged.set(mem.trackingNumber, mem);
      }
    }
    return Array.from(merged.values()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  return listAllShipments();
}

export function findShipmentByTrackingOrOrder(key: string): ShipmentRecord | undefined {
  if (shipmentStore.has(key)) return shipmentStore.get(key);
  for (const shp of shipmentStore.values()) {
    if (shp.trackingNumber.toLowerCase() === key.toLowerCase()) {
      return shp;
    }
  }
  return undefined;
}

export async function findShipmentPersistent(key: string): Promise<ShipmentRecord | undefined> {
  const mem = findShipmentByTrackingOrOrder(key);
  if (mem) return mem;
  const row = await findStoredShipmentWaybill(key);
  if (!row) return undefined;
  const mapped = mapStoredWaybillToShipmentRecord(row);
  shipmentStore.set(mapped.orderId, mapped);
  return mapped;
}

export function assignCourierToShipment(orderId: string, partner: CourierPartner): ShipmentRecord {
  const shp = getOrCreateShipment(orderId, { courierPartner: partner });
  const suffix = shp.trackingNumber.split('-').pop() || '100200';
  shp.courierPartner = partner;
  shp.trackingNumber = `${PARTNER_PREFIX[partner]}-2026-${suffix}`;
  shp.shippingFee = partner === 'PaikarForce' ? 60 : partner === 'Steadfast' ? 70 : partner === 'Pathao' ? 80 : 75;
  shp.updatedAt = new Date().toISOString();
  shp.checkpoints.unshift({
    id: `cp_${Date.now()}`,
    status: shp.status,
    message: `Waybill reassigned to ${partner} Express Network (${shp.trackingNumber})`,
    location: shp.pickupLocation,
    time: shp.updatedAt
  });
  void upsertStoredShipmentWaybill(shp);
  return shp;
}

export function appendShipmentCheckpoint(
  orderId: string,
  status: ShipmentStatus,
  message?: string,
  location?: string
): ShipmentRecord {
  const shp = getOrCreateShipment(orderId);
  const now = new Date().toISOString();

  const defaultMessageMap: Record<ShipmentStatus, string> = {
    PENDING: 'Manifest logged for dispatch',
    PICKUP_ASSIGNED: 'Courier rider assigned & heading to merchant hub',
    IN_TRANSIT: 'Parcel scanned at PaikarLogistics Sorting Hub',
    OUT_FOR_DELIVERY: 'Rider is out for last-mile delivery with OTP verification',
    DELIVERED: 'Package delivered and confirmed via recipient OTP',
    RETURN_REQUESTED: 'Reverse logistics return pickup scheduled',
    CANCELLED: 'Shipment cancelled and returned to origin hub'
  };

  const defaultLocationMap: Record<ShipmentStatus, string> = {
    PENDING: shp.pickupLocation,
    PICKUP_ASSIGNED: 'Merchant Dispatch Bay',
    IN_TRANSIT: 'Tejgaon Central Sorting Hub, Dhaka',
    OUT_FOR_DELIVERY: 'Last-Mile Delivery Zone',
    DELIVERED: shp.dropLocation,
    RETURN_REQUESTED: shp.dropLocation,
    CANCELLED: shp.pickupLocation
  };

  shp.status = status;
  shp.updatedAt = now;

  if (status === 'IN_TRANSIT') {
    shp.distanceRemaining = '6.8 km';
    shp.etaText = '25 mins';
  } else if (status === 'OUT_FOR_DELIVERY') {
    shp.distanceRemaining = '1.4 km';
    shp.etaText = '8 mins';
  } else if (status === 'DELIVERED') {
    shp.distanceRemaining = '0.0 km';
    shp.etaText = 'Delivered';
  }

  shp.checkpoints.unshift({
    id: `cp_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    status,
    message: message || defaultMessageMap[status],
    location: location || defaultLocationMap[status],
    time: now
  });

  void upsertStoredShipmentWaybill(shp);
  return shp;
}

/**
 * 3-Step POD Verification: validates 4-digit server OTP, stores photo & signature proof,
 * advances shipment to DELIVERED, and releases any associated Escrow hold.
 */
export function verifyShipmentPod(
  orderId: string,
  payload: {
    otp: string;
    recipientName?: string;
    photoDataUrl?: string;
    signatureDataUrl?: string;
    userId?: string;
  }
): { ok: boolean; error?: string; shipment?: ShipmentRecord; escrowReleased?: boolean } {
  const shp = getOrCreateShipment(orderId);
  const cleanOtp = String(payload.otp || '').trim();

  if (cleanOtp !== shp.deliveryOtp) {
    return {
      ok: false,
      error: `Invalid Delivery OTP. Ask recipient for the 4-digit code (${shp.deliveryOtp} on waybill).`
    };
  }

  let escrowReleased = false;
  try {
    const summary = getEscrowSummaryForUser(payload.userId || 'user_me');
    const escrow = summary.escrows.find((e) => e.orderId === orderId || e.poNumber === orderId);
    if (escrow && escrow.status === 'held') {
      releaseEscrowRecord(escrow.id);
      escrowReleased = true;
    }
  } catch {
    escrowReleased = false;
  }

  const now = new Date().toISOString();
  shp.podReceipt = {
    verifiedAt: now,
    verifiedOtp: cleanOtp,
    recipientName: payload.recipientName || 'Verified Recipient',
    photoDataUrl: payload.photoDataUrl,
    signatureDataUrl: payload.signatureDataUrl,
    escrowReleased
  };

  const proofTags: string[] = [`OTP ${cleanOtp}`];
  if (payload.photoDataUrl) proofTags.push('Photo Proof');
  if (payload.signatureDataUrl) proofTags.push('Digital Signature');

  const updated = appendShipmentCheckpoint(
    orderId,
    'DELIVERED',
    `3-Step POD verified (${proofTags.join(' + ')})${escrowReleased ? ' · Escrow released' : ''}`,
    shp.dropLocation
  );

  return { ok: true, shipment: updated, escrowReleased };
}

export function createReturnPickup(payload: {
  orderId: string;
  userId?: string;
  reason: string;
  pickupAddress: string;
  courierPartner?: CourierPartner;
}): ReturnPickupRecord {
  const partner: CourierPartner = payload.courierPartner || 'PaikarForce';
  const waybill = `RTN-${PARTNER_PREFIX[partner]}-${Math.floor(100000 + Math.random() * 900000)}`;

  const record: ReturnPickupRecord = {
    id: `RET-${Date.now()}`,
    returnWaybill: waybill,
    orderId: payload.orderId,
    userId: payload.userId || 'user_me',
    reason: payload.reason.trim(),
    pickupAddress: payload.pickupAddress.trim(),
    courierPartner: partner,
    status: 'PICKUP_SCHEDULED',
    createdAt: new Date().toISOString()
  };

  returnStore.unshift(record);
  appendShipmentCheckpoint(
    payload.orderId,
    'RETURN_REQUESTED',
    `Reverse pickup scheduled (${waybill}): ${record.reason}`,
    record.pickupAddress
  );

  return record;
}

export function listReturnPickups(): ReturnPickupRecord[] {
  return returnStore;
}

export function getNearbyFleetVehicles(type?: string, includeOffline = false): FleetVehicle[] {
  return FLEET_VEHICLES.filter((v) => {
    const statusOk = includeOffline || v.isOnline;
    const typeOk = !type || type === 'all' || v.type.toLowerCase() === type.toLowerCase();
    return statusOk && typeOk;
  });
}

export function registerFleetVehicle(payload: {
  type: LogisticsVehicleClass;
  model: string;
  licensePlate: string;
  capacity: string;
  driverName: string;
  driverPhone: string;
  currentArea: string;
}): FleetVehicle {
  const rule = VEHICLE_TARIFF_TABLE[payload.type] || VEHICLE_TARIFF_TABLE.bike;
  const created: FleetVehicle = {
    id: `veh_usr_${Date.now()}`,
    type: payload.type,
    model: payload.model.trim(),
    licensePlate: payload.licensePlate.trim().toUpperCase(),
    capacity: payload.capacity.trim() || rule.maxCapacityLabel,
    driverName: payload.driverName.trim(),
    driverPhone: payload.driverPhone.trim(),
    rating: 5.0,
    etaMinutes: rule.baseEtaMin,
    baseFareBdt: rule.baseFareBdt,
    perKmBdt: rule.perKmBdt,
    currentArea: payload.currentArea.trim() || 'Dhaka Metro',
    lat: 23.7605,
    lng: 90.3915,
    isOnline: true
  };
  FLEET_VEHICLES.unshift(created);
  return created;
}

export function toggleFleetVehicleAvailability(
  vehicleId: string,
  isOnline?: boolean,
  currentArea?: string
): FleetVehicle | null {
  const target = FLEET_VEHICLES.find((v) => v.id === vehicleId);
  if (!target) return null;
  target.isOnline = typeof isOnline === 'boolean' ? isOnline : !target.isOnline;
  if (currentArea && currentArea.trim()) {
    target.currentArea = currentArea.trim();
  }
  return target;
}

export function createLogisticsDispatch(payload: {
  userId?: string;
  category?: 'RIDE' | 'PARCEL' | 'FREIGHT' | 'RENTAL' | 'EMERGENCY';
  vehicleType?: LogisticsVehicleClass | string;
  courierPartner?: CourierPartner;
  pickupName: string;
  dropName: string;
  stops?: string[];
  distanceKm?: number;
  weightKg?: number;
  rentalHours?: number;
  dispatchType?: DispatchScheduleType;
  scheduledAt?: string;
  weatherMode?: WeatherTrafficMode;
}): RideDispatchRecord {
  const vClass = (payload.vehicleType as LogisticsVehicleClass) || 'bike';
  const quote = computeLogisticsQuote({
    vehicleClass: vClass in VEHICLE_TARIFF_TABLE ? vClass : 'bike',
    distanceKm: Number(payload.distanceKm || 5),
    weightKg: payload.weightKg,
    stopCount: 1 + (payload.stops?.length || 0),
    rentalHours: payload.rentalHours,
    dispatchType: payload.dispatchType,
    weatherMode: payload.weatherMode
  });

  const matchingVehicle =
    FLEET_VEHICLES.find((v) => v.type === vClass && v.isOnline) ||
    FLEET_VEHICLES.find((v) => v.isOnline) ||
    FLEET_VEHICLES[0];

  const code = `PKL-${Math.floor(100000 + Math.random() * 900000)}`;

  const dispatch: RideDispatchRecord = {
    id: `DSP-${Date.now()}`,
    trackingCode: code,
    userId: payload.userId || 'user_me',
    category: payload.category || (quote.category as RideDispatchRecord['category']),
    vehicleType: vClass,
    courierPartner: payload.courierPartner || 'PaikarForce',
    pickupName: payload.pickupName,
    dropName: payload.dropName,
    stops: payload.stops,
    weightKg: payload.weightKg,
    rentalHours: payload.rentalHours,
    dispatchType: payload.dispatchType || 'now',
    scheduledAt: payload.scheduledAt,
    weatherMode: payload.weatherMode || 'normal',
    fareBdt: quote.totalFareBdt,
    distanceKm: quote.distanceKm,
    driverName: matchingVehicle.driverName,
    driverPhone: matchingVehicle.driverPhone,
    status: 'ASSIGNED',
    createdAt: new Date().toISOString()
  };

  dispatchStore.unshift(dispatch);
  return dispatch;
}

export function listLogisticsDispatches(): RideDispatchRecord[] {
  return dispatchStore;
}
