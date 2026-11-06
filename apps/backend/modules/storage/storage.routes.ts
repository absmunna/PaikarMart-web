import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import {
  imageUpload,
  digitalProductUpload,
  handleMulterError,
} from './storage.validation';
import {
  uploadImage,
  uploadDigitalProduct,
  getSignedUrl,
  getFile,
  deleteFile,
} from './storage.controller';

const router = Router();

// Upload image (public bucket, max 2 MB, authentication required)
router.post(
  '/upload/image',
  requireAuth,
  imageUpload.single('file'),
  handleMulterError,
  uploadImage
);

// Backward-compatible upload endpoint (defaults to image upload)
router.post(
  '/upload',
  requireAuth,
  imageUpload.single('file'),
  handleMulterError,
  uploadImage
);

// Upload digital product (private bucket, seller/vendor/admin required, signed URLs only)
router.post(
  '/upload/digital',
  requireAuth,
  digitalProductUpload.single('file'),
  handleMulterError,
  uploadDigitalProduct
);

// Request a signed, expiring URL for a digital product
router.get(
  '/file/:id/signed-url',
  requireAuth,
  getSignedUrl
);

// Retrieve file metadata
router.get(
  '/file/:id',
  getFile
);

// Delete file
router.delete(
  '/file/:id',
  requireAuth,
  deleteFile
);

export const storageRoutes = router;
export default router;
