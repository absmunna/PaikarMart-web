import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// Limits
export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB strict limit
export const MAX_DIGITAL_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB limit for digital goods

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

export const ALLOWED_DIGITAL_MIME_TYPES = [
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'application/epub+zip',
  'application/octet-stream',
  'audio/mpeg',
  'audio/wav',
  'video/mp4',
  'text/plain',
  'text/markdown',
];

const memoryStorage = multer.memoryStorage();

// Multer upload instances
export const imageUpload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error(`Invalid image type: ${file.mimetype}. Allowed types: JPEG, PNG, WEBP, GIF, SVG.`));
    }
    cb(null, true);
  },
});

export const digitalProductUpload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: MAX_DIGITAL_SIZE_BYTES,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_DIGITAL_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error(`Invalid digital file type: ${file.mimetype}. Allowed types: PDF, ZIP, EPUB, MP3, MP4, TXT.`));
    }
    cb(null, true);
  },
});

/**
 * Custom error handler for Multer upload errors (e.g. file size exceeded)
 */
export const handleMulterError = (err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'File size exceeds maximum allowed limit. Images must be 2 MB or smaller.',
      });
    }
    return res.status(400).json({
      error: 'File upload error',
      message: err.message,
    });
  }
  if (err) {
    return res.status(400).json({
      error: 'Invalid file',
      message: err.message,
    });
  }
  next();
};
