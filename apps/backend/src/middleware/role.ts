import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';

export const RoleGuard = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Authentication required.' 
      });
    }

    const primaryRole = req.user.dbProfile?.role || req.user.role || 'buyer';
    const allRoles: string[] = Array.isArray(req.user.roles) 
      ? [...req.user.roles] 
      : [primaryRole];
      
    if (req.user.dbProfile?.role && !allRoles.includes(req.user.dbProfile.role)) {
      allRoles.push(req.user.dbProfile.role);
    }
    if (req.user.role && !allRoles.includes(req.user.role)) {
      allRoles.push(req.user.role);
    }

    const isSuperOrAdmin = allRoles.some(r => ['super_admin', 'admin'].includes(String(r).toLowerCase()));
    const hasPermission = isSuperOrAdmin || allowedRoles.some(r => allRoles.map(x => String(x).toLowerCase()).includes(String(r).toLowerCase()));

    if (!hasPermission) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Access denied: Insufficient permissions.' 
      });
    }
    next();
  };
};
