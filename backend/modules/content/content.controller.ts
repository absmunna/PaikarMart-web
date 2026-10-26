import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { AuthenticatedRequest } from '../../middleware/auth';
import { eventBus } from '../../services/eventBus';

// Valid ContentType structures
const VALID_CONTENT_TYPES = ['PRODUCT', 'BUSINESS', 'SERVICE', 'ANNOUNCEMENT', 'OFFER'];

export const createContentItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { contentType, title, content, mediaUrl, metadata, isPromoted } = req.body;
    const authorId = req.user?.id || 'dev-author-id';

    if (!contentType || !VALID_CONTENT_TYPES.includes(contentType)) {
      return res.status(400).json({
        error: `Invalid contentType. Must be one of: ${VALID_CONTENT_TYPES.join(', ')}`
      });
    }

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required fields' });
    }

    if (!process.env.DATABASE_URL || !(prisma as any).contentItem) {
      return res.status(201).json({
        status: 'created',
        data: {
          id: `cnt-${Date.now()}`,
          authorId,
          contentType,
          title,
          content,
          mediaUrl: mediaUrl || null,
          isPromoted: isPromoted || false,
          metadata: metadata || {},
          createdAt: new Date().toISOString()
        }
      });
    }

    const contentItem = await (prisma as any).contentItem.create({
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

    if (!process.env.DATABASE_URL || !(prisma as any).contentItem) {
      return res.status(200).json({
        status: 'success',
        data: [
          {
            id: 'mock-cnt-1',
            authorId: 'v1',
            contentType: contentType || 'PRODUCT',
            title: 'নতুন পাইকারি কালেকশন',
            content: 'উচ্চমানের পাইকারি পোশাক ও ফ্যাশন পণ্য সাশ্রয়ী মূল্যে সরাসরি প্রস্তুতকারকের কাছ থেকে।',
            mediaUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?fit=crop&w=400&h=400&q=80',
            isPromoted: true,
            author: { id: 'v1', name: 'চকবাজার ট্রেডার্স', fullName: 'চকবাজার ট্রেডার্স', role: 'seller' },
            createdAt: new Date().toISOString()
          }
        ],
        nextCursor: null
      });
    }

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
            name: true,
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

    const items = await (prisma as any).contentItem.findMany(queryOptions);

    const mappedItems = items.map((it: any) => ({
      ...it,
      author: it.author ? { ...it.author, fullName: it.author.name } : undefined
    }));

    const nextCursor = mappedItems.length > 0 ? mappedItems[mappedItems.length - 1].id : null;

    res.status(200).json({
      status: 'success',
      data: mappedItems,
      nextCursor
    });
  } catch (error) {
    console.error('[Content Controller] Error in getContentItems', error);
    res.status(200).json({
      status: 'success',
      data: [],
      nextCursor: null
    });
  }
};

export const promoteContentItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const authorId = req.user?.id || 'dev-author-id';

    if (!process.env.DATABASE_URL || !(prisma as any).contentItem) {
      return res.status(200).json({
        status: 'success',
        data: { id, isPromoted: true }
      });
    }

    const existing = await (prisma as any).contentItem.findFirst({
      where: { id, deletedAt: null }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Content item not found' });
    }

    // Role check: Only system admin or original author can promote content
    if (existing.authorId !== authorId && !req.user?.roles?.includes('admin')) {
      return res.status(403).json({ error: 'Unauthorized to promote this content item' });
    }

    const updated = await (prisma as any).contentItem.update({
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
    const authorId = req.user?.id || 'dev-author-id';

    if (!process.env.DATABASE_URL || !(prisma as any).contentItem) {
      return res.status(200).json({
        status: 'ok',
        message: 'Content item soft-deleted successfully'
      });
    }

    const existing = await (prisma as any).contentItem.findFirst({
      where: { id, deletedAt: null }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Content item not found' });
    }

    if (existing.authorId !== authorId && !req.user?.roles?.includes('admin')) {
      return res.status(403).json({ error: 'Unauthorized to modify this resource' });
    }

    // Perform safe Soft Deletion as mandated by the constitution
    const softDeleted = await (prisma as any).contentItem.update({
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
