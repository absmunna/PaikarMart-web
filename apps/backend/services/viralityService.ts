import { prisma } from '../config/database';
import { eventBus } from './eventBus';

export interface ContentMetrics {
  id: string;
  contentItemId: string;
  viewCount: number;
  engagementRate: number;
  viralityIndex: number;
  lastComputedAt: Date;
}

export class ViralityService {
  /**
   * 1. Register post view / reach count increment
   */
  static async recordView(contentItemId: string): Promise<void> {
    try {
      // Upsert to ensure analytics row exists
      await prisma.contentAnalytics.upsert({
        where: { contentItemId },
        create: {
          contentItemId,
          viewCount: 1,
          engagementRate: 0,
          viralityIndex: 0
        },
        update: {
          viewCount: { increment: 1 }
        }
      });

      // Recalculate metrics in background
      await this.computePerformanceMetrics(contentItemId);
    } catch (error) {
      console.error(`[Virality Service] Error registering view trace for ${contentItemId}`, error);
    }
  }

  /**
   * 2. Compute performance analytics and virality scores
   */
  static async computePerformanceMetrics(contentItemId: string): Promise<ContentMetrics | null> {
    try {
      const contentItem = await prisma.contentItem.findUnique({
        where: { id: contentItemId, deletedAt: null },
        include: {
          comments: { where: { deletedAt: null } },
          reactions: { where: { deletedAt: null } },
          bookmarks: { where: { deletedAt: null } },
          shares: true
        }
      });

      if (!contentItem) {
        return null;
      }

      // Calculation variables
      const reactionsCount = contentItem.reactions.length;
      const commentsCount = contentItem.comments.length;
      const bookmarksCount = contentItem.bookmarks.length;
      const sharesCount = contentItem.shares.length;

      // Extract hours since post initiation to compute interaction decay velocities
      const hoursSinceCreated = Math.max(
        0.1,
        (Date.now() - new Date(contentItem.createdAt).getTime()) / (1000 * 60 * 60)
      );

      // Core engagement score weightings (shares and bookmarks are premium factors)
      const totalEngagementPoints = 
        (reactionsCount * 5) + 
        (commentsCount * 10) + 
        (bookmarksCount * 15) + 
        (sharesCount * 25);

      // Fetch or instantiate base reach stats
      const analyticsRecord = await prisma.contentAnalytics.findUnique({
        where: { contentItemId }
      });

      const currentViews = analyticsRecord ? analyticsRecord.viewCount : 0;
      const adjustedViews = Math.max(currentViews, totalEngagementPoints + 1);

      // Calculate ratios
      const engagementRate = totalEngagementPoints / adjustedViews;
      const velocity = totalEngagementPoints / hoursSinceCreated;
      
      // Share multiplication amplification index
      const shareMultiplier = 1.0 + (sharesCount * 0.4);
      const viralityIndex = velocity * shareMultiplier;

      // Upsert record update with structured intelligence indices
      const updatedAnalytics = await prisma.contentAnalytics.upsert({
        where: { contentItemId },
        create: {
          contentItemId,
          viewCount: adjustedViews,
          engagementRate,
          viralityIndex,
          lastComputedAt: new Date()
        },
        update: {
          engagementRate,
          viralityIndex,
          lastComputedAt: new Date()
        }
      });

      console.log(`[Virality Engine] Recomputed content performance metrics for ${contentItemId}. Virality Index = ${viralityIndex.toFixed(4)}`);

      return {
        id: updatedAnalytics.id,
        contentItemId: updatedAnalytics.contentItemId,
        viewCount: updatedAnalytics.viewCount,
        engagementRate: updatedAnalytics.engagementRate,
        viralityIndex: updatedAnalytics.viralityIndex,
        lastComputedAt: updatedAnalytics.lastComputedAt
      };
    } catch (error) {
      console.error(`[Virality Service] Recalculation failure for ${contentItemId}`, error);
      return null;
    }
  }
}
