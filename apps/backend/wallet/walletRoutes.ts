import express from 'express';
import type { Request, Response } from 'express';
import { requireFirebaseAuth } from '../middleware/requireFirebaseAuth.js';
import { getOrCreateWallet, getEscrowSummaryForUser } from './walletService.js';

export const walletRouter = express.Router();
walletRouter.use(requireFirebaseAuth);

function financeUnavailable(_req: Request, res: Response) {
  res.status(503).json({ error: 'Wallet transactions are unavailable until a persistent ledger and verified payment provider are configured.' });
}

walletRouter.get('/', (req: Request, res: Response) => {
  const userId = String(res.locals.auth.uid);
  const wallet = getOrCreateWallet(userId);
  const escrowData = getEscrowSummaryForUser(userId);

  res.json({
    success: true,
    wallet,
    escrowSummary: escrowData.summary,
    escrows: escrowData.escrows
  });
});

walletRouter.post('/deposit', financeUnavailable);

walletRouter.post('/withdraw', financeUnavailable);

walletRouter.post('/transfer', financeUnavailable);

walletRouter.post('/redeem-coins', financeUnavailable);
