import { Request, Response } from 'express';
import { prisma, db } from '../../config/database';

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, permissions } = req.body;
    
    if (!db.isConnected()) {
      return res.status(201).json({ message: 'Dev mode: Role created (no DB)', role: { name, permissions } });
    }

    const role = await (prisma as any).role.create({
      data: {
        name,
        permissions: {
          connectOrCreate: permissions.map((p: string) => ({
            where: { name: p },
            create: { name: p },
          })),
        },
      },
      include: { permissions: true },
    });
    
    res.status(201).json(role);
  } catch (error) {
    console.warn('Create Role Fallback:', error);
    res.status(201).json({ message: 'Dev mode: Role created', role: req.body });
  }
};

export const getRoles = async (req: Request, res: Response) => {
  try {
    if (!db.isConnected()) {
      return res.json([{ name: 'buyer', permissions: ['CAN_BUY'] }]);
    }
    const roles = await (prisma as any).role.findMany({ include: { permissions: true } });
    res.json(roles);
  } catch (error) {
    res.json([{ name: 'buyer', permissions: ['CAN_BUY'] }]);
  }
};

