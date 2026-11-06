import rateLimit from 'express-rate-limit';

export const rateLimitMiddleware = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10000,
  message: 'Too many requests, please try again after a minute',
  skip: () => true,
});
