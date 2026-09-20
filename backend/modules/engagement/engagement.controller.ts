import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { AuthenticatedRequest } from '../../middleware/auth';
import { eventBus } from '../../services/eventBus';

/**
 * 1. Reaction System
 * Toggles or updates LIKE/LOVE/WOW/SAVE reactions on a ContentItem.
 */
export const toggleReaction = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { contentItemId, type } = req.body;
    const userId = req.user!.id;

    if (!contentItemId || !type) {
      return res.status(400).json({ error: 'contentItemId and type are required' });
    }

    const validTypes = ['LIKE', 'LOVE', 'WOW', 'SAVE'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: `Reaction type must be one of: ${validTypes.join(', ')}` });
    }

    const contentItem = await prisma.contentItem.findUnique({
      where: { id: contentItemId, deletedAt: null }
    });

    if (!contentItem) {
      return res.status(404).json({ error: 'Content item not found' });
    }

    // Attempt to locate active reaction trace
    const existing = await prisma.contentReaction.findFirst({
      where: {
        contentItemId,
        userId,
        type
      }
    });

    let action = 'added';
    let currentReaction = null;

    if (existing) {
      if (existing.deletedAt === null && existing.type === type) {
        // Toggle action: remove reaction
        currentReaction = await prisma.contentReaction.update({
          where: { id: existing.id },
          data: { deletedAt: new Date() }
        });
        action = 'removed';
      } else {
        // Update existing / restore reaction trace
        currentReaction = await prisma.contentReaction.update({
          where: { id: existing.id },
          data: {
            type,
            deletedAt: null
          }
        });
        action = 'updated';
      }
    } else {
      // Complete fresh instantiation
      currentReaction = await prisma.contentReaction.create({
        data: {
          contentItemId,
          userId,
          type
        }
      });
    }

    // Refresh general likeCount caches inside ContentItem
    const totalLikes = await prisma.contentReaction.count({
      where: {
        contentItemId,
        deletedAt: null,
        type: { in: ['LIKE', 'LOVE', 'WOW'] }
      }
    });

    await prisma.contentItem.update({
      where: { id: contentItemId },
      data: { likeCount: totalLikes }
    });

    // Fire Event bus traces
    if (action === 'added' || action === 'updated') {
      await eventBus.emitEvent('REACTION_ADDED', {
        userId,
        contentItemId,
        reactionId: currentReaction.id,
        type
      });
    } else {
      await eventBus.emitEvent('REACTION_REMOVED', {
        userId,
        contentItemId,
        reactionId: currentReaction.id,
        type
      });
    }

    res.status(200).json({
      status: 'success',
      action,
      data: currentReaction,
      totalLikes
    });
  } catch (error) {
    console.error('[Engagement Controller] Error in toggleReaction', error);
    res.status(500).json({ error: 'Failed to manage reaction' });
  }
};

/**
 * 2. Comment System
 * Creates comments and sub-nested threading replies.
 */
export const createComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { contentItemId, content, parentCommentId } = req.body;
    const userId = req.user!.id;

    if (!contentItemId || !content) {
      return res.status(400).json({ error: 'contentItemId and content are required' });
    }

    const contentItem = await prisma.contentItem.findUnique({
      where: { id: contentItemId, deletedAt: null }
    });

    if (!contentItem) {
      return res.status(404).json({ error: 'Content item not found' });
    }

    if (parentCommentId) {
      const parent = await prisma.contentComment.findFirst({
        where: { id: parentCommentId, contentItemId, deletedAt: null }
      });
      if (!parent) {
        return res.status(400).json({ error: 'Valid parentCommentId not found on this post scope' });
      }
    }

    const comment = await prisma.contentComment.create({
      data: {
        contentItemId,
        userId,
        content,
        parentCommentId: parentCommentId || null
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        }
      }
    });

    // Update aggregate counts
    const totalComments = await prisma.contentComment.count({
      where: { contentItemId, deletedAt: null }
    });

    await prisma.contentItem.update({
      where: { id: contentItemId },
      data: { commentCount: totalComments }
    });

    // Emit event
    await eventBus.emitEvent('COMMENT_CREATED', {
      id: comment.id,
      contentItemId,
      userId,
      parentCommentId
    });

    res.status(201).json({
      status: 'created',
      data: comment,
      totalComments
    });
  } catch (error) {
    console.error('[Engagement Controller] Error in createComment', error);
    res.status(500).json({ error: 'Failed to store comment trace' });
  }
};

/**
 * Gets nested comment list.
 */
export const getContentCommentsList = async (req: Request, res: Response) => {
  try {
    const { contentItemId } = req.params;

    const contentItemIdStr = contentItemId as string;

    const comments = await (prisma as any).contentComment.findMany({
      where: {
        contentItemId: contentItemIdStr,
        parentCommentId: null, // Get main threads
        deletedAt: null
      },
      orderBy: {
        createdAt: 'asc'
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        },
        replies: {
          where: { deletedAt: null },
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                role: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({
      status: 'success',
      data: comments
    });
  } catch (error) {
    console.error('[Engagement Controller] Error in getContentCommentsList', error);
    res.status(500).json({ error: 'Failed to load comments' });
  }
};

/**
 * 3. Share Tracking System
 */
export const trackShare = async (req: Request, res: Response) => {
  try {
    const { contentItemId, platform } = req.body;
    let userId = null;

    // Optional user payload tracking if authenticated
    const authHeader = req.headers.authorization;
    if (authHeader) {
      userId = "mock-user-id"; // Safe developmental mock
    }

    if (!contentItemId) {
      return res.status(400).json({ error: 'contentItemId is required' });
    }

    const contentItem = await prisma.contentItem.findUnique({
      where: { id: contentItemId, deletedAt: null }
    });

    if (!contentItem) {
      return res.status(404).json({ error: 'Content item not found' });
    }

    const share = await prisma.contentShare.create({
      data: {
        contentItemId,
        userId: userId || null,
        platform: platform || 'INTERNAL'
      }
    });

    // Emit event to bus
    await eventBus.emitEvent('POST_SHARED', {
      shareId: share.id,
      contentItemId,
      userId,
      platform
    });

    res.status(201).json({
      status: 'tracked',
      data: share
    });
  } catch (error) {
    console.error('[Engagement Controller] Error in trackShare', error);
    res.status(500).json({ error: 'Failed to track sharing analytics' });
  }
};

/**
 * 4. Bookmark System
 * Toggles a content post's saved profile status.
 */
export const toggleBookmark = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { contentItemId, collectionName } = req.body;
    const userId = req.user!.id;

    if (!contentItemId) {
      return res.status(400).json({ error: 'contentItemId is required' });
    }

    const contentItem = await prisma.contentItem.findUnique({
      where: { id: contentItemId, deletedAt: null }
    });

    if (!contentItem) {
      return res.status(404).json({ error: 'Content item not found' });
    }

    const existing = await prisma.contentBookmark.findUnique({
      where: {
        userId_contentItemId: {
          userId,
          contentItemId
        }
      }
    });

    let action = 'saved';
    let bookmark = null;

    if (existing) {
      if (existing.deletedAt === null) {
        bookmark = await prisma.contentBookmark.update({
          where: { id: existing.id },
          data: { deletedAt: new Date() }
        });
        action = 'unsaved';
      } else {
        bookmark = await prisma.contentBookmark.update({
          where: { id: existing.id },
          data: {
            collectionName: collectionName || 'Favorites',
            deletedAt: null
          }
        });
      }
    } else {
      bookmark = await prisma.contentBookmark.create({
        data: {
          userId,
          contentItemId,
          collectionName: collectionName || 'Favorites'
        }
      });
    }

    // Emit event
    if (action === 'saved') {
      await eventBus.emitEvent('POST_SAVED', {
        id: bookmark.id,
        userId,
        contentItemId,
        collectionName: collectionName || 'Favorites'
      });
    }

    res.status(200).json({
      status: 'success',
      action,
      data: bookmark
    });
  } catch (error) {
    console.error('[Engagement Controller] Error in toggleBookmark', error);
    res.status(500).json({ error: 'Failed to manage bookmark status' });
  }
};
