import { Request, Response, NextFunction } from 'express';

export const auditMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Only audit API requests; skip Vite dev module requests and static assets
  const url = req.originalUrl || req.url || '';
  if (!url.startsWith('/api')) {
    return next();
  }

  const isSensitive = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
  // Log mutating API actions for security auditing
  if (isSensitive) {
    const timestamp = new Date().toISOString();
    console.log(`[API-AUDIT] ${timestamp} - ${req.method} ${url} - IP: ${req.ip}`);
    
    if (req.body && typeof req.body === 'object') {
      const bodyKeys = Object.keys(req.body);
      if (bodyKeys.length > 0) {
        console.log(`[API-AUDIT] Data keys: ${bodyKeys.join(', ')}`);
      }
    }
  }
  
  next();
};
