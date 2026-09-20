import { prisma } from "../../config/database";

export class DealService {
  static async getActiveDeals() {
    const now = new Date();
    try {
      return await prisma.exclusiveDeal.findMany({
        where: {
          isActive: true,
          startTime: { lte: now },
          endTime: { gte: now },
          currentStock: { gt: 0 }
        },
        include: {
          product: {
            include: {
              category: true,
              seller: {
                select: {
                  id: true,
                  fullName: true,
                  shopName: true,
                  avatarUrl: true
                }
              }
            } as any
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error fetching active deals:', error);
      return [];
    }
  }

  static async createDeal(data: any, sellerId: string) {
    // Validate product ownership
    const product = await prisma.product.findUnique({
      where: { id: data.productId }
    });

    if (!product || product.sellerId !== sellerId) {
      throw new Error("Unauthorized: You do not own this product");
    }

    return prisma.exclusiveDeal.create({
      data: {
        productId: data.productId,
        dealPrice: data.dealPrice,
        initialStock: data.initialStock,
        currentStock: data.initialStock,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
      }
    });
  }

  static async getSellerDeals(sellerId: string) {
    try {
      return await prisma.exclusiveDeal.findMany({
        where: {
          product: {
            sellerId: sellerId
          }
        },
        include: {
          product: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
       console.error('Error fetching seller deals:', error);
       return [];
    }
  }

  static async getDealById(id: string) {
    return prisma.exclusiveDeal.findUnique({
      where: { id },
      include: {
        product: true
      }
    });
  }

  static async decrementStock(dealId: string, quantity: number = 1) {
    return prisma.exclusiveDeal.update({
      where: { id: dealId },
      data: {
        currentStock: { decrement: quantity }
      }
    });
  }
}
