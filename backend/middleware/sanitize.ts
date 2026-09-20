import { Request, Response, NextFunction } from 'express';
import { filterXSS } from 'xss';

/**
 * Middleware to sanitize user input to prevent XSS attacks.
 */
export const sanitizeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeValue = (val: any): any => {
    if (typeof val === 'string') return filterXSS(val);
    if (Array.isArray(val)) return val.map(sanitizeValue);
    if (val !== null && typeof val === 'object') {
      const sanitized: any = {};
      for (const k in val) {
        sanitized[k] = sanitizeValue(val[k]);
      }
      return sanitized;
    }
    return val;
  };

  const sanitizedBody = req.body ? sanitizeValue(req.body) : {};
  const sanitizedQuery = req.query ? sanitizeValue(req.query) : {};
  const sanitizedParams = req.params ? sanitizeValue(req.params) : {};

  // Attach sanitized data to res.locals for safe downstream access
  res.locals.sanitized = {
    body: sanitizedBody,
    query: sanitizedQuery,
    params: sanitizedParams
  };

  next();
};

