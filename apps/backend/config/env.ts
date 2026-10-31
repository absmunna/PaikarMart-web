import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Multi-path .env fallback for monorepo development & production
const envPathsToTry = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'apps/backend/.env'),
  path.resolve(process.cwd(), '../../.env'),
  path.resolve(process.cwd(), '../.env')
];

for (const envPath of envPathsToTry) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}
dotenv.config();

export interface BackendEnv {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: string;
  DATABASE_URL?: string;
  JWT_SECRET: string;
  REDIS_URL?: string;
  CORS_ORIGINS?: string;
}

const rawNodeEnv = process.env.NODE_ENV || 'development';
const isProduction = rawNodeEnv === 'production';
const rawJwtSecret = process.env.JWT_SECRET?.trim();

// Clearly named development fallback secret (must be at least 32 characters)
export const DEV_FALLBACK_JWT_SECRET = 'paikarmart_development_only_jwt_secret_key_minimum_32_characters';

let validatedJwtSecret: string;

if (isProduction) {
  if (!rawJwtSecret) {
    const errorMsg = 'FATAL: JWT_SECRET environment variable is missing in production environment. Paikar Mart server refuses to start.';
    console.error(`❌ ${errorMsg}`);
    throw new Error(errorMsg);
  }
  if (rawJwtSecret.length < 32) {
    const errorMsg = `FATAL: JWT_SECRET environment variable is too short (${rawJwtSecret.length} chars). In production, it must be at least 32 characters long. Paikar Mart server refuses to start.`;
    console.error(`❌ ${errorMsg}`);
    throw new Error(errorMsg);
  }
  validatedJwtSecret = rawJwtSecret;

  if (!process.env.CORS_ORIGINS?.trim()) {
    console.warn('⚠️ [PROD WARNING] CORS_ORIGINS is not set. Browser cross-origin requests will be restricted in production.');
  }
} else {
  if (!rawJwtSecret) {
    console.warn('⚠️ [DEV WARNING] JWT_SECRET is not configured. Falling back to development-only secret. DO NOT USE IN PRODUCTION.');
    validatedJwtSecret = DEV_FALLBACK_JWT_SECRET;
  } else if (rawJwtSecret.length < 32) {
    console.warn(`⚠️ [DEV WARNING] JWT_SECRET is shorter than 32 characters (${rawJwtSecret.length} chars). Consider using a 32+ character key.`);
    validatedJwtSecret = rawJwtSecret;
  } else {
    validatedJwtSecret = rawJwtSecret;
  }
}

export const env: BackendEnv = {
  NODE_ENV: (['development', 'production', 'test'].includes(rawNodeEnv) ? rawNodeEnv : 'development') as 'development' | 'production' | 'test',
  PORT: process.env.PORT || '3000',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: validatedJwtSecret,
  REDIS_URL: process.env.REDIS_URL,
  CORS_ORIGINS: process.env.CORS_ORIGINS,
};

export const JWT_SECRET = env.JWT_SECRET;
