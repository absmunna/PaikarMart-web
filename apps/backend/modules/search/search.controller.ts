import { Request, Response } from 'express';
import { prisma } from '@backend/config/database';

/**
 * Unified Search Controller
 * Aggregates results from all hubs:
 * - Products (Marketplace Hub)
 * - Demands/Services (Services Hub)
 * - Businesses/Shops (Local Hub)
 * - Content/Videos/Offers (Community Hub)
 */
export const unifiedSearch = async (req: Request, res: Response) => {
  try {
    const { q, type } = req.query;
    const query = String(q || '').trim();

    if (!query) {
      return res.status(200).json({
        products: [],
        services: [],
        shops: [],
        content: [],
        offers: []
      });
    }

    // Parallel search across all entities
    const [products, demands, businesses, contentItems] = await Promise.all([
      // 1. Marketplace: Products
      prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ],
          isActive: true
        },
        include: { business: true },
        take: 10
      }),

      // 2. Services: Demands
      prisma.demand.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ],
          status: 'open'
        },
        take: 10
      }),

      // 3. Local: Shops/Businesses
      prisma.sellerProfile.findMany({
        where: {
          OR: [
            { storeName: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 10
      }),

      // 4. Community: Content (Videos, Offers, News)
      prisma.contentItem.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 10
      })
    ]);

    // Categorize ContentItems for cleaner response
    const videos = contentItems.filter(item => item.contentType === 'VIDEO' || item.contentType === 'REEL');
    const offers = contentItems.filter(item => item.contentType === 'OFFER');
    const news = contentItems.filter(item => item.contentType === 'NEWS');

    res.status(200).json({
      success: true,
      query,
      results: {
        products,
        services: demands,
        shops: businesses,
        videos,
        offers,
        news
      }
    });
  } catch (error) {
    console.error('Unified Search Error:', error);
    res.status(500).json({ success: false, message: 'Search failed' });
  }
};
