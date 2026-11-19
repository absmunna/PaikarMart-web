import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { prisma } from '../../config/database';
import { storageService } from './storage.service';

const SELLER_ROLES = [
  'seller',
  'digital_seller',
  'retail_seller',
  'wholesale_seller',
  'factory_seller',
  'brand_seller',
  'business',
  'service_provider',
  'moderator',
  'admin',
  'super_admin',
];

/**
 * 📷 POST /api/v1/storage/upload/image
 * Upload an image (product, avatar, banner) to Supabase Storage (public bucket).
 * Enforces max 2 MB limit, sanitized filename, and authentication.
 */
export const uploadImage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required to upload files' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided. Please attach an image file.' });
    }

    const purpose = (req.body.purpose || req.query.purpose || 'images') as string;

    // Upload to public Supabase bucket
    const result = await storageService.uploadPublicImage(req.file, req.user.id, purpose);

    // Save record to database
    let fileRecord: any = null;
    try {
      fileRecord = await prisma.fileAsset.create({
        data: {
          ownerId: req.user.id,
          purpose,
          bucket: result.bucket,
          path: result.path,
          url: result.url,
          isPrivate: false,
          mimeType: result.mimeType,
          size: result.size,
          originalName: result.originalName,
        },
      });
    } catch (dbErr) {
      console.warn('Database record save fallback for file asset:', dbErr);
      fileRecord = {
        id: `file_${Date.now()}`,
        ownerId: req.user.id,
        purpose,
        ...result,
        createdAt: new Date().toISOString(),
      };
    }

    return res.status(201).json({
      ok: true,
      message: 'Image uploaded successfully',
      file: fileRecord,
    });
  } catch (error: any) {
    console.error('uploadImage error:', error);
    return res.status(500).json({
      error: 'Upload failed',
      message: error?.message || 'Failed to upload image to storage',
    });
  }
};

/**
 * 📦 POST /api/v1/storage/upload/digital
 * Upload a digital product (PDF, ZIP, software, media) to Supabase Storage (private bucket).
 * Strictly requires seller/admin role.
 * NEVER returns a public link.
 */
export const uploadDigitalProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required to upload files' });
    }

    // Role check: Only vendors and admins may publish digital products
    const userRole = req.user.role;
    const userRoles = req.user.roles || [userRole];
    const isAuthorizedSeller = userRoles.some((r) => SELLER_ROLES.includes(r));

    if (!isAuthorizedSeller) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only registered sellers, digital creators, and administrators can upload digital products.',
        currentRole: userRole,
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No digital product file provided.' });
    }

    // Upload to private Supabase bucket
    const result = await storageService.uploadDigitalProduct(req.file, req.user.id);

    // Save record to database with isPrivate: true and url: null
    let fileRecord: any = null;
    try {
      fileRecord = await prisma.fileAsset.create({
        data: {
          ownerId: req.user.id,
          purpose: 'digital_product',
          bucket: result.bucket,
          path: result.path,
          url: null, // Strictly null - private storage
          isPrivate: true,
          mimeType: result.mimeType,
          size: result.size,
          originalName: result.originalName,
        },
      });
    } catch (dbErr) {
      console.warn('Database record save fallback for digital asset:', dbErr);
      fileRecord = {
        id: `dig_${Date.now()}`,
        ownerId: req.user.id,
        purpose: 'digital_product',
        ...result,
        createdAt: new Date().toISOString(),
      };
    }

    return res.status(201).json({
      ok: true,
      message: 'Digital product uploaded to secure private storage. Access is granted via signed URLs only.',
      file: {
        id: fileRecord.id,
        ownerId: fileRecord.ownerId,
        purpose: fileRecord.purpose,
        bucket: fileRecord.bucket,
        path: fileRecord.path,
        url: null, // Never expose public URL
        isPrivate: true,
        mimeType: fileRecord.mimeType,
        size: fileRecord.size,
        originalName: fileRecord.originalName,
        createdAt: fileRecord.createdAt,
      },
    });
  } catch (error: any) {
    console.error('uploadDigitalProduct error:', error);
    return res.status(500).json({
      error: 'Upload failed',
      message: error?.message || 'Failed to upload digital product to private storage',
    });
  }
};

/**
 * 🔑 GET /api/v1/storage/file/:id/signed-url
 * Generate a signed, expiring URL for a private digital asset.
 * Enforces ownership or admin role.
 */
export const getSignedUrl = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required to access digital files' });
    }

    const { id } = req.params;
    let file = await prisma.fileAsset.findUnique({ where: { id } });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Authorization: User must be file owner or admin/super_admin
    const isOwner = file.ownerId === req.user.id;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'super_admin' || req.user.roles?.includes('admin') || req.user.roles?.includes('super_admin');

    if (!isOwner && !isAdmin) {
      // Check if buyer has completed an order for a product by this seller (if applicable)
      const userOrder = await prisma.order.findFirst({
        where: {
          userId: req.user.id,
          sellerId: file.ownerId,
          status: 'completed',
        },
      });

      if (!userOrder) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission or a verified purchase to download this digital product.',
        });
      }
    }

    // Default expiration: 15 minutes (900s), max 1 hour (3600s)
    const expiresInRequested = parseInt(req.query.expiresIn as string, 10);
    const expiresIn = Number.isInteger(expiresInRequested) && expiresInRequested > 0 && expiresInRequested <= 3600
      ? expiresInRequested
      : 900;

    const signedUrlData = await storageService.createSignedUrl(file.bucket, file.path, expiresIn);

    return res.json({
      ok: true,
      fileId: file.id,
      fileName: file.originalName,
      signedUrl: signedUrlData.signedUrl,
      expiresIn: signedUrlData.expiresIn,
      expiresAt: signedUrlData.expiresAt,
    });
  } catch (error: any) {
    console.error('getSignedUrl error:', error);
    return res.status(500).json({
      error: 'Failed to generate signed URL',
      message: error?.message || 'Internal error',
    });
  }
};

/**
 * 📄 GET /api/v1/storage/file/:id
 * Retrieve file metadata. If private, the URL field is strictly null.
 */
export const getFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const file = await prisma.fileAsset.findUnique({ where: { id } });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // For private files, ensure url is strictly null
    const safeResponse = {
      ...file,
      url: file.isPrivate ? null : file.url,
      signedUrlNotice: file.isPrivate
        ? 'This is a private digital product. Request a temporary download link via GET /api/v1/storage/file/:id/signed-url'
        : undefined,
    };

    return res.json(safeResponse);
  } catch (error: any) {
    console.error('getFile error:', error);
    return res.status(500).json({ error: 'Failed to retrieve file metadata' });
  }
};

/**
 * 🗑️ DELETE /api/v1/storage/file/:id
 * Delete a file from storage and database.
 */
export const deleteFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const file = await prisma.fileAsset.findUnique({ where: { id } });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const isOwner = file.ownerId === req.user.id;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'super_admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: You cannot delete another user’s files' });
    }

    // Remove from Supabase bucket
    await storageService.deleteFile(file.bucket, file.path);

    // Remove from DB
    await prisma.fileAsset.delete({ where: { id } });

    return res.json({ ok: true, message: 'File deleted successfully' });
  } catch (error: any) {
    console.error('deleteFile error:', error);
    return res.status(500).json({ error: 'Failed to delete file' });
  }
};
