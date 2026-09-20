import { Request, Response, NextFunction } from 'express';

export const helmetMiddleware = (req: Request, res: Response, next: NextFunction) => {
  next();
};
