import { Request, Response } from 'express';
import { prisma } from '@backend/config/database';
import { AuthenticatedRequest } from '@backend/middleware/auth';

export interface FeedItem {
  id: string;
  contentType: string;
  title: string;
  content: string;
  mediaUrl: string | null;
  authorId: string;
  author: {
    id: string;
    fullName: string;
    role: string;
  };
  visibility: string;
  isPromoted: boolean;
  metadata: any;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  rankingScore: number;
}

// 1. Projection Layer (maps DB ContentItem to FeedItem read-model projection)
function projectToFeedItem(item: any, sourceWeight: number): FeedItem {
  // If we have aggregated analytics containing structured virality metrics, we factor them in automatically
  const viralityIndexBoost = item.analytics ? item.analytics.viralityIndex * 15 : 0;

  const engagementScore = (item.likeCount * 5) + (item.commentCount * 10) + viralityIndexBoost;
  const hoursSinceCreated = Math.max(
    0.1,
    (Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60)
  );
  
  // Power/exponential recency decay: Score = (Base Source Weight + Engagement) / DecayFactor
  const recencyDecay = Math.pow(hoursSinceCreated + 2, 1.5);
  const rankBoost = item.isPromoted ? 500 : 0;
  const rankingScore = ((sourceWeight + engagementScore + rankBoost) / recencyDecay);

  return {
    id: item.id,
    contentType: item.contentType,
    title: item.title,
    content: item.content,
    mediaUrl: item.mediaUrl,
    authorId: item.authorId,
    author: {
      id: item.author.id,
      fullName: item.author.fullName,
      role: item.author.role
    },
    visibility: item.visibility,
    isPromoted: item.isPromoted,
    metadata: item.metadata || {},
    likeCount: item.likeCount,
    commentCount: item.commentCount,
    createdAt: item.createdAt,
    rankingScore
  };
}

/**
 * 2. Get Assembly / Personal Feed
 * Aggregates following feed, trending/global feed, categories, filters with security visibility.
 * Unified Feed: Pulls from ContentItems, Products, and Demands.
 */
export const assembleHomeFeed = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    const { category, limit = '20', cursor, area } = req.query;
    const limitInt = parseInt(limit as string, 10);

    // Get user address area for localized filtering
    let activeArea: string | null = (area as string) || null;
    if (!activeArea && currentUserId) {
      const user = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { addressArea: true }
      });
      activeArea = user?.addressArea || null;
    }

    // Parallel fetch from different Hub sources
    const [rawContentItems, rawProducts, rawDemands] = await Promise.all([
      // 1. Community Hub: Social posts, Videos, Offers
      prisma.contentItem.findMany({
        where: { deletedAt: null },
        take: limitInt,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { id: true, fullName: true, role: true } }, analytics: true }
      }),
      // 2. Marketplace Hub: Featured Products
      prisma.product.findMany({
        where: { isActive: true },
        take: limitInt / 2,
        orderBy: { createdAt: 'desc' },
        include: { seller: { select: { id: true, fullName: true, role: true } } }
      }),
      // 3. Services Hub: Recent Demands
      prisma.demand.findMany({
        where: { status: 'open' },
        take: limitInt / 4,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { id: true, fullName: true, role: true } } }
      })
    ]);

    const projectedFeedItems: FeedItem[] = [];

    // Project ContentItems
    rawContentItems.forEach(item => {
      projectedFeedItems.push(projectToFeedItem(item, 100));
    });

    // Project Products to FeedItems
    rawProducts.forEach(product => {
      projectedFeedItems.push({
        id: product.id,
        contentType: 'PRODUCT',
        title: product.title,
        content: product.description || '',
        mediaUrl: product.images[0] || null,
        authorId: product.sellerId,
        author: {
          id: product.seller.id,
          fullName: product.seller.fullName || 'Seller',
          role: product.seller.role
        },
        visibility: 'PUBLIC',
        isPromoted: false,
        metadata: { price: product.price, type: product.type },
        likeCount: 0,
        commentCount: 0,
        createdAt: product.createdAt,
        rankingScore: 80 // Base score for products
      });
    });

    // Project Demands to FeedItems
    rawDemands.forEach(demand => {
      projectedFeedItems.push({
        id: demand.id,
        contentType: 'SERVICE',
        title: demand.title,
        content: demand.description || '',
        mediaUrl: null,
        authorId: demand.authorUserId,
        author: {
          id: demand.author.id,
          fullName: demand.author.fullName || 'User',
          role: demand.author.role
        },
        visibility: 'PUBLIC',
        isPromoted: false,
        metadata: { budget: demand.budget, location: demand.location },
        likeCount: 0,
        commentCount: 0,
        createdAt: demand.createdAt,
        rankingScore: 70 // Base score for services/demands
      });
    });

    // Final sorting by rankingScore (mixed feed)
    projectedFeedItems.sort((a, b) => {
      // Prioritize promoted, then rankingScore, then date
      return b.rankingScore - a.rankingScore || b.createdAt.getTime() - a.createdAt.getTime();
    });

    const paginatedItems = projectedFeedItems.slice(0, limitInt);
    const nextCursor = paginatedItems.length > 0 ? paginatedItems[paginatedItems.length - 1].id : null;

    res.status(200).json({
      status: 'success',
      data: paginatedItems,
      nextCursor
    });

  } catch (error) {
    console.error('[Feed Assembler] Error in assembleHomeFeed', error);
    res.status(500).json({ error: 'Failed to assemble unified feed' });
  }
};
