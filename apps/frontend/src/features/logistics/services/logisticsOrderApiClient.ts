import { Order } from '@/types';
import {
  CourierPartner,
  DispatchScheduleType,
  FleetRegistrationPayload,
  FleetVehicle,
  GeofenceEvaluation,
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

const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL as string) || '';

async function safeFetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {})
      },
      ...init
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const logisticsOrderApiClient = {
  async fetchQuote(payload: LogisticsQuoteRequest): Promise<LogisticsQuoteBreakdown | null> {
    const res = await safeFetchJson<{ success: boolean; quote: LogisticsQuoteBreakdown }>(
      '/api/logistics/quote',
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );
    return res?.quote || null;
  },

  async checkGeofence(payload: {
    storeLat: number;
    storeLng: number;
    buyerLat: number;
    buyerLng: number;
    serviceRadiusKm?: number;
    prepMinutes?: number;
  }): Promise<GeofenceEvaluation | null> {
    const res = await safeFetchJson<{ success: boolean; geofence: GeofenceEvaluation }>(
      '/api/logistics/geofence-check',
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );
    return res?.geofence || null;
  },

  async rankHyperlocalProviders(payload: {
    buyerLat: number;
    buyerLng: number;
    radiusKm: number;
    providers: Array<{ id: string; lat: number; lng: number; prepMinutes?: number; isOpen?: boolean }>;
  }): Promise<Array<GeofenceEvaluation & { id: string; isOpen: boolean }> | null> {
    const res = await safeFetchJson<{
      success: boolean;
      ranked: Array<GeofenceEvaluation & { id: string; isOpen: boolean }>;
    }>('/api/logistics/hyperlocal/rank', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res?.ranked || null;
  },

  async fetchAllShipments(): Promise<ShipmentRecord[] | null> {
    const res = await safeFetchJson<{ success: boolean; shipments: ShipmentRecord[] }>(
      '/api/logistics/shipments'
    );
    return res?.shipments || null;
  },

  async fetchShipment(orderId: string, dropLocation?: string): Promise<ShipmentRecord | null> {
    const q = dropLocation ? `?drop=${encodeURIComponent(dropLocation)}` : '';
    const res = await safeFetchJson<{ success: boolean; shipment: ShipmentRecord }>(
      `/api/logistics/shipments/${encodeURIComponent(orderId)}${q}`
    );
    return res?.shipment || null;
  },

  async lookupWaybill(trackingOrOrderId: string): Promise<ShipmentRecord | null> {
    const res = await safeFetchJson<{ success: boolean; shipment: ShipmentRecord }>(
      `/api/logistics/shipments/${encodeURIComponent(trackingOrOrderId.trim())}`
    );
    return res?.shipment || null;
  },

  async appendCheckpoint(
    orderId: string,
    payload: { status: ShipmentStatus; message?: string; location?: string }
  ): Promise<ShipmentRecord | null> {
    const res = await safeFetchJson<{ success: boolean; shipment: ShipmentRecord }>(
      `/api/logistics/shipments/${encodeURIComponent(orderId)}/checkpoint`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );
    return res?.shipment || null;
  },

  async verifyPod(
    orderId: string,
    payload: PodVerificationPayload
  ): Promise<{ ok: boolean; shipment?: ShipmentRecord; escrowReleased?: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/logistics/shipments/${encodeURIComponent(orderId)}/verify-pod`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data?.error || 'POD verification failed' };
      }
      return {
        ok: true,
        shipment: data.shipment,
        escrowReleased: data.escrowReleased
      };
    } catch {
      return { ok: false, error: 'Network unavailable while verifying POD' };
    }
  },

  async assignCourier(orderId: string, courierPartner: CourierPartner): Promise<ShipmentRecord | null> {
    const res = await safeFetchJson<{ success: boolean; shipment: ShipmentRecord }>(
      `/api/logistics/shipments/${encodeURIComponent(orderId)}/assign-courier`,
      {
        method: 'POST',
        body: JSON.stringify({ courierPartner })
      }
    );
    return res?.shipment || null;
  },

  async fetchReturns(): Promise<ReturnPickupRecord[] | null> {
    const res = await safeFetchJson<{ success: boolean; returns: ReturnPickupRecord[] }>(
      '/api/logistics/returns'
    );
    return res?.returns || null;
  },

  async createReturnRequest(payload: {
    orderId: string;
    reason: string;
    pickupAddress: string;
    courierPartner?: CourierPartner;
    userId?: string;
  }): Promise<ReturnPickupRecord | null> {
    const res = await safeFetchJson<{ success: boolean; returnRecord: ReturnPickupRecord }>(
      '/api/logistics/returns',
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );
    return res?.returnRecord || null;
  },

  async fetchNearbyVehicles(type?: string, includeOffline = false): Promise<FleetVehicle[] | null> {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (includeOffline) params.set('includeOffline', 'true');
    const q = params.toString() ? `?${params.toString()}` : '';
    const res = await safeFetchJson<{ success: boolean; vehicles: FleetVehicle[] }>(
      `/api/logistics/vehicles/nearby${q}`
    );
    return res?.vehicles || null;
  },

  async fetchFleetRegistry(): Promise<FleetVehicle[] | null> {
    const res = await safeFetchJson<{ success: boolean; vehicles: FleetVehicle[] }>(
      '/api/logistics/fleet'
    );
    return res?.vehicles || null;
  },

  async registerFleetVehicle(payload: FleetRegistrationPayload): Promise<FleetVehicle | null> {
    const res = await safeFetchJson<{ success: boolean; vehicle: FleetVehicle }>(
      '/api/logistics/fleet',
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );
    return res?.vehicle || null;
  },

  async toggleVehicleAvailability(
    vehicleId: string,
    isOnline?: boolean,
    currentArea?: string
  ): Promise<FleetVehicle | null> {
    const res = await safeFetchJson<{ success: boolean; vehicle: FleetVehicle }>(
      `/api/logistics/fleet/${encodeURIComponent(vehicleId)}/availability`,
      {
        method: 'PATCH',
        body: JSON.stringify({ isOnline, currentArea })
      }
    );
    return res?.vehicle || null;
  },

  async fetchDispatches(): Promise<RideDispatchRecord[] | null> {
    const res = await safeFetchJson<{ success: boolean; dispatches: RideDispatchRecord[] }>(
      '/api/logistics/rides'
    );
    return res?.dispatches || null;
  },

  async createDispatch(payload: {
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
  }): Promise<RideDispatchRecord | null> {
    const res = await safeFetchJson<{ success: boolean; dispatch: RideDispatchRecord }>(
      '/api/logistics/rides',
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );
    return res?.dispatch || null;
  },

  async updateOrderStatus(
    orderId: string,
    status: Order['status'],
    fallbackOrder?: Order
  ): Promise<{ order: Order; shipment?: ShipmentRecord } | null> {
    const res = await safeFetchJson<{ success: boolean; order: Order; shipment?: ShipmentRecord }>(
      `/api/orders/${encodeURIComponent(orderId)}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status, fallbackOrder })
      }
    );
    return res || null;
  },

  async reorderOrder(
    orderId: string,
    fallbackOrder?: Order
  ): Promise<{ order: Order; shipment?: ShipmentRecord } | null> {
    const res = await safeFetchJson<{ success: boolean; order: Order; shipment?: ShipmentRecord }>(
      `/api/orders/${encodeURIComponent(orderId)}/reorder`,
      {
        method: 'POST',
        body: JSON.stringify({ fallbackOrder })
      }
    );
    return res || null;
  }
};
