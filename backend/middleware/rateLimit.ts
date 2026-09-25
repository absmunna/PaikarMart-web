import rateLimit from 'express-rate-limit';

export const rateLimitMiddleware = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'production' ? 100 : 5000, // higher limit in dev for Vite module loading
  message: 'Too many requests, please try again after a minute',
  skip: () => process.env.NODE_ENV !== 'production', // completely skip in dev so preview never gets blocked
});
