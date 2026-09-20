import { Request, Response, NextFunction } from 'express';

export const auditMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Only audit API routes
  if (!req.url.startsWith('/api/v1/')) {
    return next();
  }

  const isSensitive = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
  const logPrefix = isSensitive ? '[SENSITIVE-AUDIT]' : '[AUDIT]';
  const timestamp = new Date().toISOString();
  
  console.log(`${logPrefix} ${timestamp} - ${req.method} ${req.url} - IP: ${req.ip}`);
  
  if (isSensitive && req.body) {
    // Log body keys but not values for privacy/security
    const bodyKeys = Object.keys(req.body);
    if (bodyKeys.length > 0) {
      console.log(`${logPrefix} Data keys: ${bodyKeys.join(', ')}`);
    }
  }
  
  next();
};
