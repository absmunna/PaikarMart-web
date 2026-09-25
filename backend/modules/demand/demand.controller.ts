import { Request, Response } from 'express';
import { prisma } from '../../config/database';

export const getDemands = async (req: Request, res: Response) => {
  try {
    if (!process.env.DATABASE_URL) {
      // Dev mode mock fallback
      return res.json([
        {
          id: 'd_1',
          title: 'Need 100kg Fresh Spinach',
          description: 'Looking for a wholesale supplier for fresh spinach delivered to Dhaka daily.',
          budget: 5000,
          currency: 'BDT',
          categoryId: 'cat_grocery',
          location: 'Dhaka',
          urgency: 'high',
          status: 'open',
          createdAt: new Date(),
          author: { name: 'Rahim Khan', avatarUrl: '🥬' }
        },
        {
          id: 'd_2',
          title: 'Bulk Order of Smart Watch Series 9',
          description: 'Need 50 pieces of smart watches for employee rewards. Budget is tight.',
          budget: 85000,
          currency: 'BDT',
          categoryId: 'cat_electronics',
          location: 'Chittagong',
          urgency: 'normal',
          status: 'matched',
          createdAt: new Date(),
          author: { name: 'Sarah Boutique', avatarUrl: '👗' }
        }
      ]);
    }

    const demands = await prisma.demand.findMany({
      include: {
        author: {
          select: {
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(demands);
  } catch (error) {
    console.error('Fetch Demands Error:', error);
    res.status(500).json({ error: 'Failed to fetch demands' });
  }
};

export const getDemandById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!process.env.DATABASE_URL) {
      return res.json({
        id,
        title: 'Need 100kg Fresh Spinach',
        description: 'Looking for a wholesale supplier for fresh spinach delivered to Dhaka daily.',
        budget: 5000,
        currency: 'BDT',
        categoryId: 'cat_grocery',
        location: 'Dhaka',
        urgency: 'high',
        status: 'open',
        createdAt: new Date(),
        author: { name: 'Rahim Khan', avatarUrl: '🥬' }
      });
    }

    const demand = await prisma.demand.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            role: true
          }
        }
      }
    });

    if (!demand) {
      return res.status(404).json({ error: 'Demand not found' });
    }

    res.json(demand);
  } catch (error) {
    console.error('Fetch Demand By ID Error:', error);
    res.status(500).json({ error: 'Failed to fetch demand' });
  }
};

export const createDemand = async (req: Request, res: Response) => {
  try {
    const { title, description, budget, categoryId, location, urgency } = req.body;
    const authorUserId = req.headers['x-user-id'] as string || 'dev-buyer-id';

    if (!process.env.DATABASE_URL) {
      return res.status(201).json({
        id: `d-${Date.now()}`,
        title,
        description,
        budget,
        currency: 'BDT',
        categoryId,
        location: location || 'Dhaka',
        urgency: urgency || 'normal',
        status: 'open',
        createdAt: new Date(),
        author: { name: 'Demo Buyer', avatarUrl: '👤' }
      });
    }

    // Grab or create first demo user to link as author
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'demo-buyer@paikarmart.com',
          name: 'Demo Buyer',
          password: 'hashedpassword',
          role: 'buyer'
        }
      });
    }

    const demand = await prisma.demand.create({
      data: {
        title,
        description,
        budget,
        currency: 'BDT',
        categoryId,
        location: location || 'Dhaka',
        urgency: urgency || 'normal',
        authorUserId: user.id
      }
    });

    res.status(201).json(demand);
  } catch (error) {
    console.error('Create Demand Error:', error);
    res.status(500).json({ error: 'Failed to create demand' });
  }
};
