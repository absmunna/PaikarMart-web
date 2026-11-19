import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order } from '@/types';
import {
  CourierPartner,
  DispatchScheduleType,
  FleetRegistrationPayload,
  FleetVehicle,
  LogisticsQuoteBreakdown,
  LogisticsQuoteRequest,
  LogisticsVehicleClass,
  PodVerificationPayload,
  ReturnPickupRecord,
  RideDispatchRecord,
  ShipmentRecord,
  ShipmentStatus,
  WeatherTrafficMode
} from '@/features/logistics/types/logisticsTypes';
import { logisticsOrderApiClient } from '@/features/logistics/services/logisticsOrderApiClient';

const PARTNER_PREFIX: Record<CourierPartner, string> = {
  PaikarForce: 'PKF',
  Steadfast: 'SF',
  Pathao: 'PTH',
  RedX: 'RDX'
};

const ORDER_TO_SHIPMENT: Record<Order['status'], ShipmentStatus> = {
  confirmed: 'PENDING',
  preparing: 'PICKUP_ASSIGNED',
  in_transit: 'OUT_FOR_DELIVERY',
  delivered: 'DELIVERED'
};

const DEFAULT_FLEET: FleetVehicle[] = [
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
  }
];

function buildLocalShipment(orderId: string, dropLocation?: string): ShipmentRecord {
  const suffix = Math.floor(100000 + Math.random() * 900000);
  const now = new Date().toISOString();
  return {
    id: `SHP-${suffix}`,
    orderId,
    courierPartner: 'PaikarForce',
    trackingNumber: `PKF-2026-${suffix}`,
    status: 'PENDING',
    deliveryOtp: String(Math.floor(1000 + Math.random() * 9000)),
    checkpoints: [
      {
        id: `cp_${Date.now()}`,
        status: 'PENDING',
        message: 'Order manifested & queued for seller warehouse pickup',
        location: 'Dhaka Central Fulfillment Hub',
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
    pickupLocation: 'Tejgaon Merchant Warehouse, Dhaka',
    dropLocation: dropLocation || 'Dhaka Metropolitan Zone',
    shippingFee: 60,
    updatedAt: now
  };
}

function buildFallbackQuote(req: LogisticsQuoteRequest): LogisticsQuoteBreakdown {
  const baseByClass: Record<LogisticsVehicleClass, { base: number; perKm: number; freeKg: number; extraKg: number; label: string; labelBn: string; cat: string; cap: string; eta: number; hr?: number }> = {
    bike: { base: 50, perKm: 15, freeKg: 10, extraKg: 10, label: 'Express Moto Bike', labelBn: 'এক্সপ্রেস মোটরবাইক', cat: 'RIDE', cap: '1 Passenger · Up to 10 kg', eta: 5 },
    cng: { base: 80, perKm: 22, freeKg: 25, extraKg: 8, label: 'City CNG Auto', labelBn: 'সিটি সিএনজি অটো', cat: 'RIDE', cap: '3 Passengers', eta: 7 },
    car: { base: 140, perKm: 34, freeKg: 40, extraKg: 8, label: 'AC Sedan Car', labelBn: 'এসি সেডান গাড়ি', cat: 'RIDE', cap: '4 Passengers', eta: 9 },
    ambulance: { base: 650, perKm: 45, freeKg: 100, extraKg: 0, label: '24/7 Priority Ambulance', labelBn: 'জরুরি অ্যাম্বুলেন্স (২৪/৭)', cat: 'EMERGENCY', cap: 'Oxygen Support', eta: 8 },
    parcel: { base: 70, perKm: 14, freeKg: 5, extraKg: 12, label: 'Courier Express Box', labelBn: 'এক্সপ্রেস পার্সেল বক্স', cat: 'PARCEL', cap: 'Up to 35 kg sealed parcel', eta: 12 },
    pickup: { base: 1200, perKm: 62, freeKg: 500, extraKg: 2, label: '1-Ton Commercial Pickup', labelBn: '১-টন কমার্শিয়াল পিকআপ', cat: 'FREIGHT', cap: '1,500 kg cartons', eta: 18, hr: 650 },
    truck: { base: 3600, perKm: 105, freeKg: 2000, extraKg: 1.5, label: '3–5 Ton Covered Truck', labelBn: '৩–৫ টন কাভার্ড ট্রাক', cat: 'FREIGHT', cap: '5,000 kg pallets', eta: 30, hr: 1400 },
    rental_sedan: { base: 900, perKm: 24, freeKg: 50, extraKg: 0, label: 'Executive Sedan Rental', labelBn: 'সেডান গাড়ি ভাড়া', cat: 'RENTAL', cap: '4 Seats · Chauffeur', eta: 20, hr: 550 },
    rental_noah: { base: 1600, perKm: 32, freeKg: 120, extraKg: 0, label: 'Noah Microbus XL Rental', labelBn: 'নোয়া মাইক্রোবাস ভাড়া', cat: 'RENTAL', cap: '7–9 Seats', eta: 25, hr: 850 }
  };

  const rule = baseByClass[req.vehicleClass] || baseByClass.bike;
  const dist = Math.max(1, Number(req.distanceKm || 6));
  const distFee = Math.round(dist * rule.perKm);
  const weightFee = req.weightKg && req.weightKg > rule.freeKg ? Math.round((req.weightKg - rule.freeKg) * rule.extraKg) : 0;
  const multiStopFee = Math.max(0, Number(req.stopCount || 1) - 1) * 55;
  const rentalFee = rule.hr && req.rentalHours && req.rentalHours > 1 ? Math.round((req.rentalHours - 1) * rule.hr) : 0;
  const sub = rule.base + distFee + weightFee + multiStopFee + rentalFee;
  const mult = req.weatherMode === 'rainy' ? 1.35 : req.weatherMode === 'rush_hour' ? 1.25 : 1.0;
  const surgeFee = Math.round(sub * (mult - 1));
  const gross = sub + surgeFee;
  const discRate = req.dispatchType === 'recurring' ? 0.08 : req.dispatchType === 'scheduled' ? 0.05 : 0;
  const disc = Math.round(gross * discRate);

  return {
    vehicleClass: req.vehicleClass,
    label: rule.label,
    labelBn: rule.labelBn,
    category: rule.cat,
    distanceKm: dist,
    estimatedEtaMin: rule.eta + Math.ceil(dist * 2.4),
    baseFareBdt: rule.base,
    distanceFeeBdt: distFee,
    weightSurchargeBdt: weightFee,
    multiStopFeeBdt: multiStopFee,
    rentalDurationFeeBdt: rentalFee,
    surgeFeeBdt: surgeFee,
    surgeMultiplier: mult,
    scheduledDiscountBdt: disc,
    totalFareBdt: Math.max(rule.base, gross - disc),
    capacityLabel: rule.cap
  };
}

interface LogisticsState {
  shipments: Record<string, ShipmentRecord>;
  dispatches: RideDispatchRecord[];
  fleetVehicles: FleetVehicle[];
  returns: ReturnPickupRecord[];
  activeQuote: LogisticsQuoteBreakdown | null;
  isLoading: boolean;
  error: string | null;

  fetchQuote: (req: LogisticsQuoteRequest) => Promise<LogisticsQuoteBreakdown>;
  fetchShipment: (orderId: string, dropLocation?: string) => Promise<ShipmentRecord>;
  fetchAllShipments: () => Promise<ShipmentRecord[]>;
  assignCourierPartner: (orderId: string, partner: CourierPartner) => Promise<void>;
  advanceShipmentCheckpoint: (
    orderId: string,
    status: ShipmentStatus,
    message?: string,
    location?: string
  ) => Promise<void>;
  verifyShipmentPod: (
    orderId: string,
    payload: PodVerificationPayload
  ) => Promise<{ ok: boolean; error?: string; escrowReleased?: boolean }>;
  requestReturnPickup: (payload: {
    orderId: string;
    reason: string;
    pickupAddress: string;
    courierPartner?: CourierPartner;
    userId?: string;
  }) => Promise<ReturnPickupRecord>;
  syncOrderLifecycle: (order: Order, nextStatus: Order['status']) => Promise<Order>;
  reorderPreviousOrder: (order: Order) => Promise<Order>;
  fetchFleetAndDispatches: () => Promise<void>;
  registerFleetVehicle: (payload: FleetRegistrationPayload) => Promise<FleetVehicle>;
  toggleVehicleOnline: (vehicleId: string, isOnline?: boolean, currentArea?: string) => Promise<void>;
  dispatchRideOrParcel: (payload: {
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
  }) => Promise<RideDispatchRecord>;
}

export const useLogisticsStore = create<LogisticsState>()(
  persist(
    (set, get) => ({
      shipments: {},
      dispatches: [],
      fleetVehicles: DEFAULT_FLEET,
      returns: [],
      activeQuote: null,
      isLoading: false,
      error: null,

      fetchQuote: async (req) => {
        const remote = await logisticsOrderApiClient.fetchQuote(req);
        const quote = remote || buildFallbackQuote(req);
        set({ activeQuote: quote });
        return quote;
      },

      fetchAllShipments: async () => {
        const remote = await logisticsOrderApiClient.fetchAllShipments();
        if (remote) {
          const merged: Record<string, ShipmentRecord> = { ...get().shipments };
          remote.forEach((shp) => {
            merged[shp.orderId] = shp;
          });
          set({ shipments: merged });
          return remote;
        }
        return Object.values(get().shipments);
      },

      fetchShipment: async (orderId, dropLocation) => {
        set({ isLoading: true, error: null });
        const remote = await logisticsOrderApiClient.fetchShipment(orderId, dropLocation);
        const existing = get().shipments[orderId];
        const shipment = remote || existing || buildLocalShipment(orderId, dropLocation);

        set((state) => ({
          shipments: { ...state.shipments, [orderId]: shipment },
          isLoading: false
        }));
        return shipment;
      },

      assignCourierPartner: async (orderId, partner) => {
        const remote = await logisticsOrderApiClient.assignCourier(orderId, partner);
        if (remote) {
          set((state) => ({
            shipments: { ...state.shipments, [orderId]: remote }
          }));
          return;
        }

        set((state) => {
          const current = state.shipments[orderId] || buildLocalShipment(orderId);
          const suffix = current.trackingNumber.split('-').pop() || '100200';
          const updated: ShipmentRecord = {
            ...current,
            courierPartner: partner,
            trackingNumber: `${PARTNER_PREFIX[partner]}-2026-${suffix}`,
            shippingFee:
              partner === 'PaikarForce' ? 60 : partner === 'Steadfast' ? 70 : partner === 'Pathao' ? 80 : 75,
            updatedAt: new Date().toISOString(),
            checkpoints: [
              {
                id: `cp_${Date.now()}`,
                status: current.status,
                message: `Waybill assigned to ${partner} Express Network`,
                location: current.pickupLocation,
                time: new Date().toISOString()
              },
              ...current.checkpoints
            ]
          };
          return { shipments: { ...state.shipments, [orderId]: updated } };
        });
      },

      advanceShipmentCheckpoint: async (orderId, status, message, location) => {
        const remote = await logisticsOrderApiClient.appendCheckpoint(orderId, {
          status,
          message,
          location
        });

        if (remote) {
          set((state) => ({
            shipments: { ...state.shipments, [orderId]: remote }
          }));
          return;
        }

        set((state) => {
          const current = state.shipments[orderId] || buildLocalShipment(orderId);
          const now = new Date().toISOString();
          const updated: ShipmentRecord = {
            ...current,
            status,
            updatedAt: now,
            distanceRemaining:
              status === 'DELIVERED' ? '0.0 km' : status === 'OUT_FOR_DELIVERY' ? '1.4 km' : '5.5 km',
            etaText:
              status === 'DELIVERED' ? 'Delivered' : status === 'OUT_FOR_DELIVERY' ? '8 mins' : '25 mins',
            checkpoints: [
              {
                id: `cp_${Date.now()}`,
                status,
                message: message || `Status updated to ${status.replace(/_/g, ' ')}`,
                location: location || 'Dhaka Logistics Hub',
                time: now
              },
              ...current.checkpoints
            ]
          };
          return { shipments: { ...state.shipments, [orderId]: updated } };
        });
      },

      verifyShipmentPod: async (orderId, payload) => {
        const remote = await logisticsOrderApiClient.verifyPod(orderId, payload);
        if (remote.ok && remote.shipment) {
          set((state) => ({
            shipments: { ...state.shipments, [orderId]: remote.shipment! }
          }));
          return { ok: true, escrowReleased: remote.escrowReleased };
        }
        if (remote.error && !remote.error.includes('Network unavailable')) {
          return { ok: false, error: remote.error };
        }

        const current = get().shipments[orderId] || buildLocalShipment(orderId);
        if (payload.otp.trim() !== current.deliveryOtp) {
          return {
            ok: false,
            error: `Invalid Delivery OTP. Check shipment code (${current.deliveryOtp}).`
          };
        }

        const now = new Date().toISOString();
        const updated: ShipmentRecord = {
          ...current,
          status: 'DELIVERED',
          distanceRemaining: '0.0 km',
          etaText: 'Delivered',
          updatedAt: now,
          podReceipt: {
            verifiedAt: now,
            verifiedOtp: payload.otp.trim(),
            recipientName: payload.recipientName || 'Verified Recipient',
            photoDataUrl: payload.photoDataUrl,
            signatureDataUrl: payload.signatureDataUrl,
            escrowReleased: true
          },
          checkpoints: [
            {
              id: `cp_${Date.now()}`,
              status: 'DELIVERED',
              message: `3-Step POD verified via OTP ${payload.otp.trim()}`,
              location: current.dropLocation,
              time: now
            },
            ...current.checkpoints
          ]
        };

        set((state) => ({
          shipments: { ...state.shipments, [orderId]: updated }
        }));
        return { ok: true, escrowReleased: true };
      },

      requestReturnPickup: async (payload) => {
        const remote = await logisticsOrderApiClient.createReturnRequest(payload);
        if (remote) {
          set((state) => ({
            returns: [remote, ...state.returns]
          }));
          await get().fetchShipment(payload.orderId, payload.pickupAddress);
          return remote;
        }

        const fallback: ReturnPickupRecord = {
          id: `RET-${Date.now()}`,
          returnWaybill: `RTN-PKF-${Math.floor(100000 + Math.random() * 900000)}`,
          orderId: payload.orderId,
          userId: payload.userId || 'user_me',
          reason: payload.reason,
          pickupAddress: payload.pickupAddress,
          courierPartner: payload.courierPartner || 'PaikarForce',
          status: 'PICKUP_SCHEDULED',
          createdAt: new Date().toISOString()
        };

        set((state) => ({
          returns: [fallback, ...state.returns]
        }));
        await get().advanceShipmentCheckpoint(
          payload.orderId,
          'RETURN_REQUESTED',
          `Reverse pickup scheduled (${fallback.returnWaybill}): ${payload.reason}`,
          payload.pickupAddress
        );
        return fallback;
      },

      syncOrderLifecycle: async (order, nextStatus) => {
        const stepMap: Record<Order['status'], number> = {
          confirmed: 1,
          preparing: 2,
          in_transit: 3,
          delivered: 4
        };

        const remote = await logisticsOrderApiClient.updateOrderStatus(order.id, nextStatus, order);
        if (remote?.shipment) {
          set((state) => ({
            shipments: { ...state.shipments, [order.id]: remote.shipment! }
          }));
        } else {
          await get().advanceShipmentCheckpoint(
            order.id,
            ORDER_TO_SHIPMENT[nextStatus],
            `Order lifecycle progressed to ${nextStatus.replace('_', ' ')}`,
            nextStatus === 'delivered' ? order.deliveryAddress : 'Dhaka Dispatch Hub'
          );
        }

        return {
          ...order,
          status: nextStatus,
          trackingStep: stepMap[nextStatus]
        };
      },

      reorderPreviousOrder: async (order) => {
        const remote = await logisticsOrderApiClient.reorderOrder(order.id, order);
        if (remote?.order) {
          if (remote.shipment) {
            set((state) => ({
              shipments: { ...state.shipments, [remote.order.id]: remote.shipment! }
            }));
          }
          return {
            ...order,
            id: remote.order.id,
            createdAt: 'Just now',
            status: 'confirmed',
            trackingStep: 1,
            estimatedArrival: remote.order.estimatedArrival || '40 mins'
          };
        }

        const clonedId = `PKM-${Math.floor(100000 + Math.random() * 900000)}`;
        const localShp = buildLocalShipment(clonedId, order.deliveryAddress);
        set((state) => ({
          shipments: { ...state.shipments, [clonedId]: localShp }
        }));

        return {
          ...order,
          id: clonedId,
          createdAt: 'Just now',
          status: 'confirmed',
          trackingStep: 1,
          estimatedArrival: '40 mins'
        };
      },

      fetchFleetAndDispatches: async () => {
        const [vehicles, dispatches, returns, allShipments] = await Promise.all([
          logisticsOrderApiClient.fetchFleetRegistry(),
          logisticsOrderApiClient.fetchDispatches(),
          logisticsOrderApiClient.fetchReturns(),
          logisticsOrderApiClient.fetchAllShipments()
        ]);

        set((state) => {
          const mergedShipments = { ...state.shipments };
          if (allShipments) {
            allShipments.forEach((s) => {
              mergedShipments[s.orderId] = s;
            });
          }
          return {
            fleetVehicles: vehicles && vehicles.length > 0 ? vehicles : state.fleetVehicles,
            dispatches: dispatches || state.dispatches,
            returns: returns || state.returns,
            shipments: mergedShipments
          };
        });
      },

      registerFleetVehicle: async (payload) => {
        const remote = await logisticsOrderApiClient.registerFleetVehicle(payload);
        if (remote) {
          set((state) => ({
            fleetVehicles: [remote, ...state.fleetVehicles]
          }));
          return remote;
        }

        const fallback: FleetVehicle = {
          id: `veh_usr_${Date.now()}`,
          type: payload.type,
          model: payload.model,
          licensePlate: payload.licensePlate.toUpperCase(),
          capacity: payload.capacity || 'Standard Capacity',
          driverName: payload.driverName,
          driverPhone: payload.driverPhone,
          rating: 5.0,
          etaMinutes: 8,
          baseFareBdt: 80,
          perKmBdt: 18,
          currentArea: payload.currentArea || 'Dhaka Metro',
          lat: 23.7605,
          lng: 90.3915,
          isOnline: true
        };
        set((state) => ({
          fleetVehicles: [fallback, ...state.fleetVehicles]
        }));
        return fallback;
      },

      toggleVehicleOnline: async (vehicleId, isOnline, currentArea) => {
        const remote = await logisticsOrderApiClient.toggleVehicleAvailability(
          vehicleId,
          isOnline,
          currentArea
        );
        if (remote) {
          set((state) => ({
            fleetVehicles: state.fleetVehicles.map((v) => (v.id === vehicleId ? remote : v))
          }));
          return;
        }

        set((state) => ({
          fleetVehicles: state.fleetVehicles.map((v) =>
            v.id === vehicleId
              ? {
                  ...v,
                  isOnline: typeof isOnline === 'boolean' ? isOnline : !v.isOnline,
                  currentArea: currentArea || v.currentArea
                }
              : v
          )
        }));
      },

      dispatchRideOrParcel: async (payload) => {
        const remote = await logisticsOrderApiClient.createDispatch(payload);
        if (remote) {
          set((state) => ({ dispatches: [remote, ...state.dispatches] }));
          return remote;
        }

        const vClass = (payload.vehicleType as LogisticsVehicleClass) || 'parcel';
        const quote = buildFallbackQuote({
          vehicleClass: vClass,
          distanceKm: payload.distanceKm,
          weightKg: payload.weightKg,
          stopCount: 1 + (payload.stops?.length || 0),
          rentalHours: payload.rentalHours,
          dispatchType: payload.dispatchType,
          weatherMode: payload.weatherMode
        });

        const fallback: RideDispatchRecord = {
          id: `DSP-${Date.now()}`,
          trackingCode: `PKL-${Math.floor(100000 + Math.random() * 900000)}`,
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
          driverName: 'Anisur Rahman',
          driverPhone: '+8801712889900',
          status: 'ASSIGNED',
          createdAt: new Date().toISOString()
        };

        set((state) => ({ dispatches: [fallback, ...state.dispatches] }));
        return fallback;
      }
    }),
    {
      name: 'paikarmart_logistics_v1'
    }
  )
);
