import { Request, Response } from 'express';
import { prisma } from '../../config/database';

export const createEscrow = async (req: Request, res: Response) => {
  try {
    const { orderId, amount } = req.body;
    
    // Create Escrow Hold
    const escrow = await prisma.escrow.create({
      data: {
        orderId,
        amount,
        status: 'held'
      }
    });
    
    res.status(201).json(escrow);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create escrow' });
  }
};

export const releaseEscrow = async (req: Request, res: Response) => {
  try {
    const escrowId = req.params.escrowId as string;
    
    // Update Escrow Status
    const escrow = await prisma.escrow.update({
      where: { id: escrowId },
      data: { status: 'released', releaseAt: new Date() }
    });
    
    res.json(escrow);
  } catch (error) {
    res.status(500).json({ error: 'Failed to release escrow' });
  }
};
