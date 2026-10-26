import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { AuthenticatedRequest } from '../../middleware/auth';
import { eventBus } from '../../services/eventBus';

// Valid ContentType structures
const VALID_CONTENT_TYPES = ['PRODUCT', 'BUSINESS', 'SERVICE', 'ANNOUNCEMENT', 'OFFER'];

export const createContentItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { contentType, title, content, mediaUrl, metadata, isPromoted } = req.body;
    const authorId = req.user!.id;

    if (!contentType || !VALID_CONTENT_TYPES.includes(contentType)) {
      return res.status(400).json({
        error: `Invalid contentType. Must be one of: ${VALID_CONTENT_TYPES.join(', ')}`
      });
    }

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required fields' });
    }

    const contentItem = await prisma.contentItem.create({
      data: {
        authorId,
        contentType,
        title,
        content,
        mediaUrl: mediaUrl || null,
        isPromoted: isPromoted || false,
        metadata: metadata || {},
        targetArea: req.body.targetArea || null,
        deletedAt: null
      }
    });

    // Emit CONTENT_CREATED event
    await eventBus.emitEvent('CONTENT_CREATED', {
      id: contentItem.id,
      contentType,
      authorId,
      title
    });

    res.status(201).json({
      status: 'created',
      data: contentItem
    });
  } catch (error) {
    console.error('[Content Controller] Error in createContentItem', error);
    res.status(500).json({ error: 'Failed to create content item' });
  }
};

export const getContentItems = async (req: Request, res: Response) => {
  try {
    const { contentType, authorId, limit = '10', cursor } = req.query;

    const queryOptions: any = {
      where: {
        deletedAt: null
      },
      take: parseInt(limit as string, 10),
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        }
      }
    };

    if (contentType) {
      queryOptions.where.contentType = contentType as string;
    }

    if (authorId) {
      queryOptions.where.authorId = authorId as string;
    }

    if (cursor) {
      queryOptions.skip = 1;
      queryOptions.cursor = { id: cursor as string };
    }

    const items = await prisma.contentItem.findMany(queryOptions);

    const nextCursor = items.length > 0 ? items[items.length - 1].id : null;

    res.status(200).json({
      status: 'success',
      data: items,
      nextCursor
    });
  } catch (error) {
    console.error('[Content Controller] Error in getContentItems', error);
    res.status(500).json({ error: 'Failed to fetch content items' });
  }
};

export const promoteContentItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const authorId = req.user!.id;

    const existing = await prisma.contentItem.findFirst({
      where: { id, deletedAt: null }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Content item not found' });
    }

    // Role check: Only system admin or original author can promote content
    if (existing.authorId !== authorId && !req.user!.roles.includes('admin')) {
      return res.status(403).json({ error: 'Unauthorized to promote this content item' });
    }

    const updated = await prisma.contentItem.update({
      where: { id },
      data: { isPromoted: true }
    });

    // Emit EVENT_PROMOTED trace
    await eventBus.emitEvent('CONTENT_PROMOTED', { id, authorId });

    res.status(200).json({
      status: 'success',
      data: updated
    });
  } catch (error) {
    console.error('[Content Controller] Error in promoteContentItem', error);
    res.status(500).json({ error: 'Failed to promote content item' });
  }
};

export const deleteContentItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const authorId = req.user!.id;

    const existing = await prisma.contentItem.findFirst({
      where: { id, deletedAt: null }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Content item not found' });
    }

    if (existing.authorId !== authorId && !req.user!.roles.includes('admin')) {
      return res.status(403).json({ error: 'Unauthorized to modify this resource' });
    }

    // Perform safe Soft Deletion as mandated by the constitution
    const softDeleted = await prisma.contentItem.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    // Emit event
    await eventBus.emitEvent('CONTENT_REMOVED', { id, authorId });

    res.status(200).json({
      status: 'ok',
      message: 'Content item soft-deleted successfully'
    });
  } catch (error) {
    console.error('[Content Controller] Error in deleteContentItem', error);
    res.status(500).json({ error: 'Failed to delete content item' });
  }
};
