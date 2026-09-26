import { Request, Response } from 'express';
import { prisma } from '../../config/database';

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

    if (!process.env.DATABASE_URL) {
      // Dev mode fallback search results
      return res.status(200).json({
        success: true,
        query,
        results: {
          products: [
            {
              id: 'pk-01',
              name: 'Premium Leather Wallet',
              title: 'Premium Leather Wallet',
              price: 2499,
              category: 'accessories',
              images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=400&fit=crop']
            }
          ],
          services: [
            {
              id: 'd_1',
              title: 'Fresh Vegetables Supply Needed',
              budget: 5000,
              currency: 'BDT'
            }
          ],
          shops: [
            {
              id: 's_1',
              name: 'Royal Wholesale Center',
              fullName: 'Royal Wholesale Center',
              location: 'Chawkbazar, Dhaka'
            }
          ],
          videos: [],
          offers: [],
          news: []
        }
      });
    }

    // Parallel search across models
    const [products, demands, sellers, posts] = await Promise.all([
      // 1. Marketplace: Products (name in schema, not title)
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: { seller: true },
        take: 10
      }).then(prods => prods.map(p => ({ ...p, title: p.name, name: p.name }))),

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

      // 3. Local: Shops/Businesses (from User model where role is seller)
      prisma.user.findMany({
        where: {
          role: 'seller',
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 10
      }).then(users => users.map(u => ({ ...u, fullName: u.name, storeName: u.name }))),

      // 4. Community: Content (Posts in schema)
      prisma.post.findMany({
        where: {
          OR: [
            { content: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 10
      })
    ]);

    // Categorize Posts
    const videos = posts.filter(item => item.type === 'video');
    const offers = posts.filter(item => item.type === 'offer');

    res.status(200).json({
      success: true,
      query,
      results: {
        products,
        services: demands,
        shops: sellers,
        videos,
        offers,
        news: []
      }
    });
  } catch (error) {
    console.error('Unified Search Error:', error);
    res.status(200).json({
      success: false,
      query: String(req.query.q || ''),
      results: { products: [], services: [], shops: [], videos: [], offers: [], news: [] }
    });
  }
};

