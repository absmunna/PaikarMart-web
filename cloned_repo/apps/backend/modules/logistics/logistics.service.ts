import { prisma } from "../../config/database";


export class LogisticsService {
  static async registerVehicle(userId: string, data: any) {
    return await prisma.vehicle.create({
      data: {
        ownerId: userId,
        type: data.type,
        model: data.model,
        licensePlate: data.licensePlate,
        color: data.color,
        capacity: data.capacity,
        documents: data.documents || [],
        availability: {
          create: {
            isOnline: false
          }
        }
      }
    });
  }

  static async updateAvailability(vehicleId: string, isOnline: boolean, location?: { lat: number; lng: number; name?: string; area?: string }) {
    return await prisma.logisticsAvailability.update({
      where: { vehicleId },
      data: {
        isOnline,
        lastLocationLat: location?.lat,
        lastLocationLng: location?.lng,
        lastLocationName: location?.name,
        currentArea: location?.area,
        updatedAt: new Date()
      }
    });
  }

  static async createRideRequest(userId: string, data: any) {
    return await prisma.rideRequest.create({
      data: {
        userId,
        pickupLat: data.pickupLat,
        pickupLng: data.pickupLng,
        pickupName: data.pickupName,
        dropLat: data.dropLat,
        dropLng: data.dropLng,
        dropName: data.dropName,
        type: data.type,
        fare: data.fare,
        distance: data.distance
      }
    });
  }

  static async getNearbyVehicles(lat: number, lng: number, type?: string) {
    // Simple area-based or basic distance filtering for now
    // Production would use PostGIS or specialized geo-search
    return await prisma.vehicle.findMany({
      where: {
        type: type,
        status: "active",
        availability: {
          isOnline: true
        }
      },
      include: {
        availability: true,
        owner: {
          select: {
            fullName: true,
            phone: true,
            avatarUrl: true
          }
        }
      }
    });
  }

  static async createShipment(data: any) {
    return await prisma.shipment.create({
      data: {
        orderId: data.orderId,
        senderName: data.senderName,
        senderPhone: data.senderPhone,
        senderAddress: data.senderAddress,
        receiverName: data.receiverName,
        receiverPhone: data.receiverPhone,
        receiverAddress: data.receiverAddress,
        type: data.type,
        status: "pending"
      }
    });
  }

  static async getShipmentByTracking(trackingNo: string) {
    return await prisma.shipment.findUnique({
      where: { trackingNo },
      include: {
        vehicle: {
          include: {
            owner: true,
            availability: true
          }
        }
      }
    });
  }
}
