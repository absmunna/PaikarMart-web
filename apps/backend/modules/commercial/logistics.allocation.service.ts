import { prisma, db } from '../../config/database';
import { HyperlocalEngineService } from './hyperlocal.engine.service';

export type DispatchType = 'instant' | 'scheduled';

export type RiderStatus =
  | 'searching'
  | 'assigned'
  | 'arrived_at_store'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface RiderProfile {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'motorcycle' | 'bicycle' | 'van' | 'technician_kit';
  vehiclePlate?: string;
  rating: number;
  completedDeliveries: number;
  latitude: number;
  longitude: number;
  isAvailable: boolean;
  avatarUrl: string;
}

export interface ServiceBookingParams {
  userId: string;
  serviceType: 'rider_dispatch' | 'courier_parcel' | 'technician_repair' | 'ac_servicing' | 'electrician';
  dispatchType: DispatchType;
  scheduledTime?: string; // ISO string for scheduled slot
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  deliveryAddress?: string;
  deliveryLat?: number;
  deliveryLng?: number;
  orderId?: string;
  storeId?: string;
  specialInstructions?: string;
}

export interface RiderAssignmentResult {
  assignmentId: string;
  orderId: string;
  storeId?: string;
  dispatchType: DispatchType;
  scheduledTime?: string;
  status: RiderStatus;
  rider: RiderProfile | null;
  pickupDistanceKm: number;
  deliveryDistanceKm: number;
  estimatedMinutesToPickup: number;
  estimatedMinutesToDelivery: number;
  timeline: Array<{
    status: RiderStatus;
    label: string;
    completed: boolean;
    timestamp?: string;
  }>;
  createdAt: string;
}

// Active fleet pool of riders & service technicians
const ACTIVE_RIDER_FLEET: RiderProfile[] = [
  {
    id: 'rider-01',
    name: 'তানভীর হাসান',
    phone: '01712-345678',
    vehicleType: 'motorcycle',
    vehiclePlate: 'ঢাকা মেট্রো হ-৪৫-৬৭৮৯',
    rating: 4.9,
    completedDeliveries: 1420,
    latitude: 23.8115,
    longitude: 90.4128,
    isAvailable: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
  },
  {
    id: 'rider-02',
    name: 'মো. রফিকুল ইসলাম',
    phone: '01823-987654',
    vehicleType: 'motorcycle',
    vehiclePlate: 'ঢাকা মেট্রো ল-১২-৩৪৫৬',
    rating: 4.8,
    completedDeliveries: 980,
    latitude: 23.8140,
    longitude: 90.4150,
    isAvailable: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  },
  {
    id: 'tech-01',
    name: 'করিম উল্লাহ (চিফ ইলেকট্রিশিয়ান ও টেকনিশিয়ান)',
    phone: '01911-223344',
    vehicleType: 'technician_kit',
    rating: 4.9,
    completedDeliveries: 650,
    latitude: 23.8105,
    longitude: 90.4110,
    isAvailable: true,
    avatarUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&h=100&fit=crop'
  },
  {
    id: 'tech-02',
    name: 'আহমেদ জুবায়ের (এসি ও অ্যাপ্লায়েন্স মাস্টার)',
    phone: '01678-554433',
    vehicleType: 'technician_kit',
    rating: 4.95,
    completedDeliveries: 820,
    latitude: 23.8165,
    longitude: 90.4175,
    isAvailable: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
  }
];

// In-memory assignment registry
const ASSIGNMENTS_REGISTRY = new Map<string, RiderAssignmentResult>();

export class LogisticsAllocationService {
  /**
   * Find nearest available riders within a given radius (km) from pickup
   */
  static findNearbyRiders(
    pickupLat: number,
    pickupLng: number,
    vehicleType?: string,
    maxRadiusKm: number = 8.0
  ): Array<RiderProfile & { distanceKm: number }> {
    return ACTIVE_RIDER_FLEET
      .filter(r => r.isAvailable && (!vehicleType || r.vehicleType === vehicleType))
      .map(rider => {
        const distanceKm = HyperlocalEngineService.calculateDistanceKm(
          pickupLat,
          pickupLng,
          rider.latitude,
          rider.longitude
        );
        return {
          ...rider,
          distanceKm
        };
      })
      .filter(r => r.distanceKm <= maxRadiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  /**
   * Core Rider Allocation Engine:
   * Links Hyperlocal store order with nearest available Rider.
   * Handles Instant Dispatch vs Scheduled Slot.
   */
  static async allocateRiderForOrder(params: {
    orderId: string;
    storeId?: string;
    pickupLat: number;
    pickupLng: number;
    deliveryLat: number;
    deliveryLng: number;
    dispatchType: DispatchType;
    scheduledSlot?: string;
  }): Promise<RiderAssignmentResult> {
    const assignmentId = `ASG-${Date.now().toString().slice(-6)}`;
    const isInstant = params.dispatchType === 'instant';

    // Find nearest motorcycle or bicycle rider
    const availableRiders = this.findNearbyRiders(params.pickupLat, params.pickupLng, 'motorcycle');
    const selectedRider = isInstant && availableRiders.length > 0 ? availableRiders[0] : null;

    const pickupDistanceKm = selectedRider ? selectedRider.distanceKm : 1.2;
    const deliveryDistanceKm = HyperlocalEngineService.calculateDistanceKm(
      params.pickupLat,
      params.pickupLng,
      params.deliveryLat,
      params.deliveryLng
    );

    const etaPickup = Math.ceil(pickupDistanceKm * 3.5) + 3;
    const etaDelivery = Math.ceil(deliveryDistanceKm * 3.5) + 12;

    const initialStatus: RiderStatus = isInstant
      ? (selectedRider ? 'assigned' : 'searching')
      : 'searching';

    const timeline = this.buildTimeline(initialStatus, isInstant, params.scheduledSlot);

    const assignment: RiderAssignmentResult = {
      assignmentId,
      orderId: params.orderId,
      storeId: params.storeId,
      dispatchType: params.dispatchType,
      scheduledTime: params.scheduledSlot,
      status: initialStatus,
      rider: selectedRider,
      pickupDistanceKm,
      deliveryDistanceKm,
      estimatedMinutesToPickup: etaPickup,
      estimatedMinutesToDelivery: etaDelivery,
      timeline,
      createdAt: new Date().toISOString()
    };

    ASSIGNMENTS_REGISTRY.set(assignmentId, assignment);

    // Persist to Prisma if DB is online
    if (db.isConnected()) {
      try {
        await prisma.riderAssignment.upsert({
          where: { orderId: params.orderId },
          update: {
            status: initialStatus as any,
            riderId: selectedRider?.id,
            storeId: params.storeId,
            pickupLat: params.pickupLat,
            pickupLng: params.pickupLng,
            deliveryLat: params.deliveryLat,
            deliveryLng: params.deliveryLng,
            distanceKm: deliveryDistanceKm,
            estimatedMinutes: etaDelivery,
            dispatchType: params.dispatchType,
            scheduledTime: params.scheduledSlot ? new Date(params.scheduledSlot) : null,
            assignedAt: selectedRider ? new Date() : null
          },
          create: {
            orderId: params.orderId,
            riderId: selectedRider?.id,
            storeId: params.storeId,
            status: initialStatus as any,
            pickupLat: params.pickupLat,
            pickupLng: params.pickupLng,
            deliveryLat: params.deliveryLat,
            deliveryLng: params.deliveryLng,
            distanceKm: deliveryDistanceKm,
            estimatedMinutes: etaDelivery,
            dispatchType: params.dispatchType,
            scheduledTime: params.scheduledSlot ? new Date(params.scheduledSlot) : null,
            assignedAt: selectedRider ? new Date() : null
          }
        });
      } catch (err) {
        console.warn('Could not persist RiderAssignment to Prisma:', err);
      }
    }

    return assignment;
  }

  /**
   * Service Booking Logic:
   * Instant Dispatch vs Scheduled Slot (e.g. Technician, Electrician, Courier)
   */
  static async bookService(params: ServiceBookingParams): Promise<{
    bookingId: string;
    serviceType: string;
    dispatchType: DispatchType;
    scheduledTime?: string;
    assignedProvider: RiderProfile | null;
    estimatedArrivalOrSlot: string;
    fare: number;
    status: string;
    message: string;
  }> {
    const bookingId = `SRV-${Date.now().toString().slice(-6)}`;
    const isInstant = params.dispatchType === 'instant';

    const isTechnician = params.serviceType.includes('technician') ||
                         params.serviceType.includes('electrician') ||
                         params.serviceType.includes('servicing');

    const providerType = isTechnician ? 'technician_kit' : 'motorcycle';
    const availableProviders = this.findNearbyRiders(params.pickupLat, params.pickupLng, providerType);
    const assignedProvider = isInstant && availableProviders.length > 0 ? availableProviders[0] : null;

    // Price calculation
    let baseFare = isTechnician ? 350 : 80;
    if (!isInstant) {
      baseFare = Math.round(baseFare * 0.95); // 5% discount for advance scheduled bookings
    }

    const estimatedArrivalOrSlot = isInstant
      ? (assignedProvider ? `${Math.ceil(assignedProvider.distanceKm * 3.5) + 10} মিনিটের মধ্যে পৌঁছাবেন` : '১৫-২০ মিনিট')
      : (params.scheduledTime ? `নির্ধারিত শিডিউল: ${new Date(params.scheduledTime).toLocaleDateString('bn-BD', { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}` : 'নির্ধারিত স্লটে বরাদ্দ');

    return {
      bookingId,
      serviceType: params.serviceType,
      dispatchType: params.dispatchType,
      scheduledTime: params.scheduledTime,
      assignedProvider,
      estimatedArrivalOrSlot,
      fare: baseFare,
      status: isInstant ? 'assigned' : 'slot_confirmed',
      message: isInstant
        ? `ইনস্ট্যান্ট ডিসপ্যাচ নিশ্চিত হয়েছে। সার্ভিস প্রোভাইডার ${assignedProvider ? assignedProvider.name : 'নিকটবর্তী টিম'} রওনা দিচ্ছেন।`
        : `শিডিউল স্লট বুকিং সফল হয়েছে। নির্ধারিত সময়ে আমাদের প্রোভাইডার উপস্থিত থাকবেন।`
    };
  }

  /**
   * Transition Rider Status Machine
   */
  static async updateRiderStatus(assignmentId: string, newStatus: RiderStatus): Promise<RiderAssignmentResult> {
    const existing = ASSIGNMENTS_REGISTRY.get(assignmentId);
    if (!existing) {
      throw new Error(`Assignment ${assignmentId} not found`);
    }

    existing.status = newStatus;
    existing.timeline = this.buildTimeline(newStatus, existing.dispatchType === 'instant', existing.scheduledTime);

    if (db.isConnected()) {
      try {
        await prisma.riderAssignment.updateMany({
          where: { id: assignmentId },
          data: {
            status: newStatus as any,
            deliveredAt: newStatus === 'delivered' ? new Date() : undefined
          }
        });
      } catch (err) {
        console.warn('Prisma status update failed:', err);
      }
    }

    return existing;
  }

  static getAssignment(assignmentId: string): RiderAssignmentResult | null {
    return ASSIGNMENTS_REGISTRY.get(assignmentId) || null;
  }

  private static buildTimeline(currentStatus: RiderStatus, isInstant: boolean, scheduledSlot?: string): Array<{
    status: RiderStatus;
    label: string;
    completed: boolean;
    timestamp?: string;
  }> {
    const stages: Array<{ status: RiderStatus; label: string }> = isInstant ? [
      { status: 'searching', label: 'রাইডার খোঁজা হচ্ছে' },
      { status: 'assigned', label: 'নিকটবর্তী রাইডার নিযুক্ত' },
      { status: 'arrived_at_store', label: 'স্টোরে পৌঁছেছেন' },
      { status: 'picked_up', label: 'পার্সেল পিকআপ সম্পন্ন' },
      { status: 'out_for_delivery', label: 'গন্তব্যের উদ্দেশ্যে রওনা' },
      { status: 'delivered', label: 'সফলভাবে ডেলিভারি সম্পন্ন' }
    ] : [
      { status: 'searching', label: scheduledSlot ? `শিডিউল স্লট কনফার্ম (${scheduledSlot})` : 'শিডিউল বুকিং প্রস্তুত' },
      { status: 'assigned', label: 'স্লটের জন্য সার্ভিসম্যান নির্ধারিত' },
      { status: 'picked_up', label: 'নির্ধারিত সময়ে সার্ভিস শুরু' },
      { status: 'delivered', label: 'কাজ সম্পন্ন ও ভেরিফায়েড' }
    ];

    const statusOrder: RiderStatus[] = [
      'searching',
      'assigned',
      'arrived_at_store',
      'picked_up',
      'out_for_delivery',
      'delivered'
    ];

    const currentIndex = statusOrder.indexOf(currentStatus);

    return stages.map(stage => {
      const stageIndex = statusOrder.indexOf(stage.status);
      return {
        ...stage,
        completed: stageIndex <= currentIndex
      };
    });
  }
}
