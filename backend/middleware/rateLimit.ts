import rateLimit from 'express-rate-limit';

const isProd = process.env.NODE_ENV === 'production';

// Auth endpoints – strictest (10 req/min in prod)
export const authRateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000,
  max: isProd ? 10 : 10000,
  message: 'Too many auth requests, please try again after a minute',
  skip: (req) => !req.path.startsWith('/api'),
});

// Write endpoints (POST/PUT/PATCH/DELETE) – 30 req/min in prod
export const writeRateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000,
  max: isProd ? 30 : 10000,
  message: 'Too many write requests, please try again after a minute',
  skip: (req) => !req.path.startsWith('/api'),
});

// General fallback – 200 req/min in prod
export const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000,
  max: isProd ? 200 : 10000,
  message: 'Too many requests, please try again after a minute',
  skip: (req) => !req.path.startsWith('/api'),
});

