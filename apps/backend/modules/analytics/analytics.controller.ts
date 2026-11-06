import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { ViralityService } from '../../services/viralityService';

/**
 * 1. Register a view event (reach) on a ContentItem
 */
export const recordContentView = async (req: Request, res: Response) => {
  try {
    const { contentItemId } = req.body;

    if (!contentItemId) {
      return res.status(400).json({ error: 'contentItemId is required' });
    }

    const contentItem = await prisma.contentItem.findUnique({
      where: { id: contentItemId, deletedAt: null }
    });

    if (!contentItem) {
      return res.status(404).json({ error: 'Content item not found' });
    }

    // Call asynchronous view recording trigger
    await ViralityService.recordView(contentItemId);

    res.status(200).json({
      status: 'success',
      message: 'Reach metrics logged and velocity pipeline initiated'
    });
  } catch (error) {
    console.error('[Analytics Controller] Error in recordContentView', error);
    res.status(500).json({ error: 'Failed to record content view reach metrics' });
  }
};

/**
 * 2. Get performance analytics and virality metrics for a specific ContentItem
 */
export const getContentAnalyticsStats = async (req: Request, res: Response) => {
  try {
    const { contentItemId } = req.params;

    if (!contentItemId) {
      return res.status(400).json({ error: 'contentItemId parameter is mandatory' });
    }

    // Attempt to fetch existing record
    let stats = await prisma.contentAnalytics.findUnique({
      where: { contentItemId: contentItemId as string },
      include: {
        contentItem: {
          select: {
            title: true,
            contentType: true,
            likeCount: true,
            commentCount: true
          }
        }
      }
    }) as any;

    if (!stats) {
      // Lazy computation: if no analytics record exists in DB, run compute to generate it dynamically
      const computed = await ViralityService.computePerformanceMetrics(contentItemId as string);
      if (!computed) {
        return res.status(404).json({ error: 'Performance metrics not found on requested ID' });
      }

      stats = await prisma.contentAnalytics.findUnique({
        where: { contentItemId: contentItemId as string },
        include: {
          contentItem: {
            select: {
              title: true,
              contentType: true,
              likeCount: true,
              commentCount: true
            }
          }
        }
      }) as any;
    }

    res.status(200).json({
      status: 'success',
      data: {
        contentItemId: stats?.contentItemId,
        title: stats?.contentItem?.title,
        contentType: stats?.contentItem?.contentType,
        reach: stats?.viewCount,
        engagementRate: stats?.engagementRate,
        viralityIndex: stats?.viralityIndex,
        totalLikes: stats?.contentItem?.likeCount,
        totalComments: stats?.contentItem?.commentCount,
        lastComputedAt: stats?.lastComputedAt
      }
    });

  } catch (error) {
    console.error('[Analytics Controller] Error inside getContentAnalyticsStats', error);
    res.status(500).json({ error: 'Failed to query virality performance metrics' });
  }
};
