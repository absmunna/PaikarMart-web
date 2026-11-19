import rateLimit from 'express-rate-limit';

/**
 * 🛡️ Production Rate Limiting Configuration
 * Removes skip: () => true and defines targeted limits per endpoint category
 */

// General API Rate Limiter (200 requests / 15 mins)
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'TOO_MANY_REQUESTS', message: 'Too many requests, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth & OTP Rate Limiter (15 requests / 15 mins)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { error: 'TOO_MANY_AUTH_ATTEMPTS', message: 'Too many authentication attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Payment & Wallet Rate Limiter (30 requests / 15 mins)
export const paymentRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'TOO_MANY_PAYMENT_REQUESTS', message: 'Too many payment/wallet operations. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI Service Rate Limiter (20 requests / 1 min)
export const aiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: { error: 'TOO_MANY_AI_REQUESTS', message: 'AI generation rate limit reached. Please try again after a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const rateLimitMiddleware = generalRateLimiter;
