import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { AuthenticatedRequest } from '../../middleware/auth';
import { eventBus } from '../../services/eventBus';
import { sendNotification } from '../../services/notificationService';

export const followTarget = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { targetId, targetType } = req.body;
    const followerId = req.user!.id;

    if (!targetId || !targetType) {
      return res.status(400).json({ error: 'targetId and targetType are mandatory' });
    }

    // 1. Duplicate follow check (and active state tracking)
    const existing = await prisma.followRelationship.findFirst({
      where: {
        followerId,
        targetId,
        targetType
      }
    });

    if (existing) {
      if (existing.deletedAt === null) {
        // Idempotent success - already active
        return res.status(200).json({
          status: 'ok',
          message: 'Already matching active target engagement',
          data: existing
        });
      } else {
        // Soft delete recovery / restore transition
        const restored = await prisma.followRelationship.update({
          where: { id: existing.id },
          data: { deletedAt: null }
        });

        // Emit trace event
        await eventBus.emitEvent('FOLLOW_CREATED', {
          followerId,
          targetId,
          targetType,
          relId: restored.id
        });

        // Notify target resource owner
        await routeFollowNotification(followerId, targetId, targetType);

        return res.status(200).json({
          status: 'restored',
          message: 'Reactivated engagement trace',
          data: restored
        });
      }
    }

    // New insertion if no record exists
    const follow = await prisma.followRelationship.create({
      data: {
        followerId,
        targetId,
        targetType,
        deletedAt: null
      }
    });

    // Emit event
    await eventBus.emitEvent('FOLLOW_CREATED', {
      followerId,
      targetId,
      targetType,
      relId: follow.id
    });

    // Route target user/merchant notification
    await routeFollowNotification(followerId, targetId, targetType);

    res.status(201).json({
      status: 'created',
      data: follow
    });
  } catch (error) {
    console.error('[Social Controller] Error in followTarget', error);
    res.status(500).json({ error: 'Failed to follow structural target' });
  }
};

export const unfollowTarget = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { targetId, targetType } = req.body;
    const followerId = req.user!.id;

    const existing = await prisma.followRelationship.findFirst({
      where: {
        followerId,
        targetId,
        targetType,
        deletedAt: null
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Active engagement target not found' });
    }

    // Standardized soft deletion to preserve history
    const softDeleted = await prisma.followRelationship.update({
      where: { id: existing.id },
      data: { deletedAt: new Date() }
    });

    // Emit remove event
    await eventBus.emitEvent('FOLLOW_REMOVED', {
      followerId,
      targetId,
      targetType,
      relId: softDeleted.id
    });

    res.status(200).json({
      status: 'ok',
      message: 'Unfollowed destination trace safely'
    });
  } catch (error) {
    console.error('[Social Controller] Error in unfollowTarget', error);
    res.status(500).json({ error: 'Failed to unfollow target' });
  }
};

export const getFollowStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = (req.params.userId as string) || req.user!.id;

    // Fast, indexed aggregation checks to prevent N+1 query patterns
    const [followersCount, followingCount] = await Promise.all([
      prisma.followRelationship.count({
        where: {
          targetId: userId,
          targetType: 'USER',
          deletedAt: null
        }
      }),
      prisma.followRelationship.count({
        where: {
          followerId: userId,
          deletedAt: null
        }
      })
    ]);

    res.status(200).json({
      userId,
      followersCount,
      followingCount
    });
  } catch (error) {
    console.error('[Social Controller] Error fetching follow stats', error);
    res.status(500).json({ error: 'Failed to load social graph analytics' });
  }
};

/**
 * Direct Notification Router helper:
 * Decoupled helper to resolve target owner and push personalized alerts.
 */
async function routeFollowNotification(followerId: string, targetId: string, targetType: string) {
  try {
    const follower = await prisma.user.findUnique({
      where: { id: followerId },
      select: { fullName: true }
    });
    
    const senderName = follower?.fullName || 'A merchant partner';

    if (targetType === 'USER') {
      await sendNotification(
        targetId,
        'New Follower Alert',
        `${senderName} is now following your personal timeline profile!`,
        'social'
      );
    } else if (targetType === 'BUSINESS') {
      const business = await prisma.sellerProfile.findUnique({
        where: { id: targetId },
        select: { userId: true, storeName: true }
      });
      
      const notifyUserId = business?.userId || targetId;
      const storeLabel = business?.storeName || 'your storefront';

      await sendNotification(
        notifyUserId,
        'Merchant Follow Active',
        `${senderName} is now tracking updates from ${storeLabel}!`,
        'business'
      );
    }
  } catch (err) {
    console.error('[Social Notification Router] Suppressed async failure', err);
  }
}
