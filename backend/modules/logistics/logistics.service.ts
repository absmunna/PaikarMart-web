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
    if (!process.env.DATABASE_URL || !(prisma as any).vehicle) {
      return [
        {
          id: 'v-1',
          type: type || 'BIKE',
          model: 'Honda CB Shine 125',
          capacity: '1 Passenger / 15kg',
          documents: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80'],
          owner: {
            name: 'করিম উল্লাহ',
            fullName: 'করিম উল্লাহ',
            phone: '01711223344',
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
          },
          availability: { isOnline: true }
        },
        {
          id: 'v-2',
          type: type || 'TRUCK',
          model: 'Tata Ace Mega (1 Ton)',
          capacity: '1 Ton Cargo',
          documents: ['https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&q=80'],
          owner: {
            name: 'আলমগীর হোসেন',
            fullName: 'আলমগীর হোসেন',
            phone: '01811223344',
            avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop'
          },
          availability: { isOnline: true }
        }
      ];
    }

    try {
      const vehicles = await (prisma as any).vehicle.findMany({
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
              name: true
            }
          }
        }
      });
      return vehicles.map((v: any) => ({
        ...v,
        owner: {
          ...v.owner,
          fullName: v.owner?.name
        }
      }));
    } catch {
      return [];
    }
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
