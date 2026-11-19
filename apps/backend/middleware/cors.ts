import cors, { CorsOptions } from 'cors';
import { env } from '../config/env';

/**
 * Returns the list of configured origins from CORS_ORIGINS (comma separated).
 */
export const getConfiguredOrigins = (): string[] => {
  const raw = env.CORS_ORIGINS || process.env.CORS_ORIGINS || '';
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

/**
 * Checks if a given origin is allowed based on production/development rules:
 * - Production: ONLY exact origins listed in CORS_ORIGINS are allowed. Wildcards are disabled.
 * - Development: Permissive CORS (localhost, staging/preview wildcards, and open fallback).
 * - Requests without an Origin header (mobile apps, server-to-server, curl) are permitted.
 */
export const isOriginAllowed = (origin: string | undefined): boolean => {
  // Allow server-to-server, curl, Postman or native mobile requests with no origin header
  if (!origin) return true;

  const isProduction = env.NODE_ENV === 'production' || process.env.NODE_ENV === 'production';

  if (isProduction) {
    const allowed = getConfiguredOrigins();
    // In production, allow ONLY origins listed in CORS_ORIGINS
    return allowed.includes(origin);
  }

  // Development mode: Keep permissive CORS
  const devConfigured = getConfiguredOrigins();
  if (devConfigured.includes(origin)) return true;

  // Allow localhost with any port in dev
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;

  // Staging / preview environments allowed in development only
  if (/^https:\/\/([a-zA-Z0-9-]+\.)*vercel\.app$/.test(origin)) return true;
  if (/^https:\/\/([a-zA-Z0-9-]+\.)*run\.app$/.test(origin)) return true;
  if (/^https:\/\/([a-zA-Z0-9-]+\.)*onrender\.com$/.test(origin)) return true;
  if (/^https:\/\/([a-zA-Z0-9-]+\.)*paikarmart\.com$/.test(origin)) return true;

  // Permissive fallback in development so local testing and AI Studio preview never break
  return true;
};

/**
 * Express CORS middleware
 */
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    // Deny unauthorized origins gracefully without throwing an unhandled Error
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
});

/**
 * Socket.IO CORS configuration options, kept strictly consistent with Express CORS
 */
export const socketCorsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST'],
};