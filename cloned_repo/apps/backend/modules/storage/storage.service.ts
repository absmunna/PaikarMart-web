import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export interface UploadedFileResult {
  bucket: string;
  path: string;
  url: string | null;
  isPrivate: boolean;
  mimeType: string;
  size: number;
  originalName: string;
}

export interface SignedUrlResult {
  signedUrl: string;
  expiresIn: number;
  expiresAt: string;
}

class StorageService {
  private supabase: SupabaseClient | null = null;
  public readonly publicBucket: string;
  public readonly digitalBucket: string;
  private isConfiguredState = false;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    this.publicBucket = process.env.SUPABASE_STORAGE_PUBLIC_BUCKET || 'public-media';
    this.digitalBucket = process.env.SUPABASE_STORAGE_PRIVATE_BUCKET || 'digital-products';

    if (supabaseUrl && serviceRoleKey) {
      try {
        this.supabase = createClient(supabaseUrl, serviceRoleKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        });
        this.isConfiguredState = true;
        console.log('✅ Supabase Storage service initialized with service role key.');
      } catch (err) {
        console.error('❌ Failed to initialize Supabase Storage client:', err);
      }
    } else {
      if (process.env.NODE_ENV === 'production') {
        console.warn('⚠️ [PROD WARNING] SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL is missing. Supabase Storage requires this for uploads.');
      } else {
        console.log('ℹ️ Supabase Storage: Running in development mock/fallback mode (no SUPABASE_SERVICE_ROLE_KEY provided).');
      }
    }
  }

  public isConfigured(): boolean {
    return this.isConfiguredState && this.supabase !== null;
  }

  /**
   * Generates a sanitized, safe filename stripping any path traversal or unsafe characters
   */
  public sanitizeFilename(originalName: string): string {
    // Strip paths, null bytes, non-alphanumeric except dots, dashes, underscores
    const base = originalName.replace(/[/\\?%*:|"<>]/g, '-').replace(/\0/g, '');
    const clean = base.replace(/[^a-zA-Z0-9._-]/g, '_');
    // Ensure not empty and limit length
    return clean.slice(0, 100) || 'file.bin';
  }

  /**
   * Upload an image to the public Supabase bucket
   * Generates a permanent public URL
   */
  public async uploadPublicImage(
    file: Express.Multer.File,
    userId: string,
    purpose = 'images'
  ): Promise<UploadedFileResult> {
    const safeName = this.sanitizeFilename(file.originalname);
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    const storagePath = `${purpose}/${userId}/${uniqueSuffix}-${safeName}`;

    if (!this.isConfigured() || !this.supabase) {
      // In development fallback, return simulated success URL
      const mockUrl = `/uploads/${this.publicBucket}/${storagePath}`;
      console.warn(`[Storage Fallback] Uploaded image to mock path: ${mockUrl}`);
      return {
        bucket: this.publicBucket,
        path: storagePath,
        url: mockUrl,
        isPrivate: false,
        mimeType: file.mimetype,
        size: file.size,
        originalName: safeName,
      };
    }

    const { data, error } = await this.supabase.storage
      .from(this.publicBucket)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Supabase Storage public upload error:', error);
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    const { data: publicUrlData } = this.supabase.storage
      .from(this.publicBucket)
      .getPublicUrl(data.path);

    return {
      bucket: this.publicBucket,
      path: data.path,
      url: publicUrlData.publicUrl,
      isPrivate: false,
      mimeType: file.mimetype,
      size: file.size,
      originalName: safeName,
    };
  }

  /**
   * Upload a digital product to the private Supabase bucket
   * NEVER returns a public link. Returns url: null and isPrivate: true.
   */
  public async uploadDigitalProduct(
    file: Express.Multer.File,
    userId: string
  ): Promise<UploadedFileResult> {
    const safeName = this.sanitizeFilename(file.originalname);
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    const storagePath = `digital-goods/${userId}/${uniqueSuffix}-${safeName}`;

    if (!this.isConfigured() || !this.supabase) {
      console.warn(`[Storage Fallback] Uploaded digital product to private mock path: ${storagePath}`);
      return {
        bucket: this.digitalBucket,
        path: storagePath,
        url: null, // Strictly null for digital products
        isPrivate: true,
        mimeType: file.mimetype,
        size: file.size,
        originalName: safeName,
      };
    }

    const { data, error } = await this.supabase.storage
      .from(this.digitalBucket)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Supabase Storage digital product upload error:', error);
      throw new Error(`Digital product upload failed: ${error.message}`);
    }

    return {
      bucket: this.digitalBucket,
      path: data.path,
      url: null, // Strictly null - private only!
      isPrivate: true,
      mimeType: file.mimetype,
      size: file.size,
      originalName: safeName,
    };
  }

  /**
   * Generates a signed, expiring URL for a private digital asset.
   * Default expiration: 15 minutes (900 seconds).
   */
  public async createSignedUrl(
    bucket: string,
    path: string,
    expiresIn = 900
  ): Promise<SignedUrlResult> {
    if (!this.isConfigured() || !this.supabase) {
      // Mock signed URL for development
      const mockToken = crypto.randomBytes(16).toString('hex');
      const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
      return {
        signedUrl: `https://mock-supabase.local/storage/v1/object/sign/${bucket}/${path}?token=${mockToken}&expires=${expiresIn}`,
        expiresIn,
        expiresAt,
      };
    }

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error || !data?.signedUrl) {
      console.error('Supabase createSignedUrl error:', error);
      throw new Error(`Failed to generate signed download link: ${error?.message || 'Unknown error'}`);
    }

    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    return {
      signedUrl: data.signedUrl,
      expiresIn,
      expiresAt,
    };
  }

  /**
   * Delete a file from Supabase storage
   */
  public async deleteFile(bucket: string, path: string): Promise<boolean> {
    if (!this.isConfigured() || !this.supabase) {
      return true;
    }

    const { error } = await this.supabase.storage.from(bucket).remove([path]);
    if (error) {
      console.error('Failed to remove file from Supabase Storage:', error);
      return false;
    }
    return true;
  }
}

export const storageService = new StorageService();
