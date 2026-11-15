import express from 'express';
import type { Request, Response } from 'express';
import { requireFirebaseAuth } from '../middleware/requireFirebaseAuth.js';
import { getEscrowSummaryForUser } from '../wallet/walletService.js';

export const escrowRouter = express.Router();
escrowRouter.use(requireFirebaseAuth);

function financeUnavailable(_req: Request, res: Response) {
  res.status(503).json({ error: 'Escrow operations are unavailable until persistent, authorized order and ledger services are configured.' });
}

escrowRouter.get('/summary', (req: Request, res: Response) => {
  const userId = String(res.locals.auth.uid);
  const data = getEscrowSummaryForUser(userId);
  res.json({ success: true, ...data });
});

escrowRouter.get('/order/:orderId', (req: Request, res: Response) => {
  const { orderId } = req.params;
  const userId = String(res.locals.auth.uid);
  const data = getEscrowSummaryForUser(userId);
  const escrow = data.escrows.find((e) => e.orderId === orderId || e.poNumber === orderId);

  if (!escrow) {
    res.status(404).json({ error: 'এই অর্ডারের কোনো এসক্রো রেকর্ড পাওয়া যায়নি।' });
    return;
  }

  const now = Date.now();
  const releaseTime = new Date(escrow.releaseAt).getTime();
  const inspectionDaysRemaining = Math.max(0, Math.ceil((releaseTime - now) / (1000 * 60 * 60 * 24)));

  res.json({
    success: true,
    escrow,
    inspectionDaysRemaining,
    canDispute: escrow.status === 'held'
  });
});

escrowRouter.post('/hold', financeUnavailable);
escrowRouter.post('/release/:escrowId', financeUnavailable);
escrowRouter.post('/dispute/:escrowId', financeUnavailable);
