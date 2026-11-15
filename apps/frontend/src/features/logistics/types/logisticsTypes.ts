export type ShipmentStatus =
  | 'PENDING'
  | 'PICKUP_ASSIGNED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'RETURN_REQUESTED'
  | 'CANCELLED';

export type CourierPartner = 'PaikarForce' | 'Steadfast' | 'Pathao' | 'RedX';

export type LogisticsSubPortal = 'ride' | 'courier' | 'cargo' | 'fleet';

export type LogisticsVehicleClass =
  | 'bike'
  | 'cng'
  | 'car'
  | 'ambulance'
  | 'parcel'
  | 'pickup'
  | 'truck'
  | 'rental_sedan'
  | 'rental_noah';

export type WeatherTrafficMode = 'normal' | 'rush_hour' | 'rainy';
export type DispatchScheduleType = 'now' | 'scheduled' | 'recurring';

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

export interface LogisticsQuoteRequest {
  vehicleClass: LogisticsVehicleClass;
  distanceKm?: number;
  pickupCoords?: { lat: number; lng: number };
  dropCoords?: { lat: number; lng: number };
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

export interface GeofenceEvaluation {
  withinRadius: boolean;
  distanceKm: number;
  radiusLimitKm: number;
  hyperlocalDeliveryFeeBdt: number;
  estimatedPrepMin: number;
  estimatedTransitMin: number;
  totalEtaMin: number;
  reason?: string;
}

export interface PodVerificationPayload {
  otp: string;
  recipientName?: string;
  photoDataUrl?: string;
  signatureDataUrl?: string;
  userId?: string;
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

export interface FleetRegistrationPayload {
  type: LogisticsVehicleClass;
  model: string;
  licensePlate: string;
  capacity: string;
  driverName: string;
  driverPhone: string;
  currentArea: string;
}
