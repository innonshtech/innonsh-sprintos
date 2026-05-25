import { Request, Response, NextFunction } from 'express';

export const requireProductManager = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'PRODUCT_MANAGER') {
    return res.status(403).json({ error: 'Access denied. Requires PRODUCT_MANAGER role.' });
  }
  next();
};
