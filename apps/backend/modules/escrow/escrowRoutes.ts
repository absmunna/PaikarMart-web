import express from 'express';
import type { Request, Response } from 'express';
import { isPrivilegedRole, requireFirebaseAuth } from '../../middleware/requireFirebaseAuth.js';
import { isLiveDatabaseConfigured } from '../../config/env.js';
import {
  createPersistentEscrowHold,
  disputePersistentEscrow,
  getPersistentEscrowSummary,
  releasePersistentEscrow
} from '../wallet/walletService.js';

export const escrowRouter = express.Router();
escrowRouter.use(requireFirebaseAuth);

function financeUnavailable(_req: Request, res: Response) {
  res.status(503).json({
    error: 'Escrow operations are unavailable until persistent, authorized order and ledger services are configured.'
  });
}

escrowRouter.get('/summary', async (_req: Request, res: Response) => {
  const userId = String(res.locals.auth.uid);
  const data = await getPersistentEscrowSummary(userId);
  res.json({ success: true, ...data });
});

escrowRouter.get('/order/:orderId', async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const userId = String(res.locals.auth.uid);
  const data = await getPersistentEscrowSummary(userId);
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

escrowRouter.post('/hold', async (req: Request, res: Response) => {
  if (!isLiveDatabaseConfigured()) {
    financeUnavailable(req, res);
    return;
  }

  const { orderId, vendorId, amount } = req.body || {};
  if (!orderId || !vendorId || !amount) {
    res.status(400).json({ error: 'orderId, vendorId, and amount are required.' });
    return;
  }

  try {
    const result = await createPersistentEscrowHold({
      orderKey: String(orderId),
      buyerAuthUid: String(res.locals.auth.uid),
      vendorAuthUidOrProfileId: String(vendorId),
      amount: Number(amount)
    });
    res.status(result.duplicate ? 200 : 201).json({ success: true, ...result });
  } catch (err: any) {
    const code = err?.message || 'ESCROW_ERROR';
    if (code === 'FINANCE_UNAVAILABLE') {
      financeUnavailable(req, res);
      return;
    }
    if (code === 'ORDER_OR_PROFILE_NOT_FOUND' || code === 'VENDOR_NOT_FOUND') {
      res.status(404).json({ error: code });
      return;
    }
    if (code === 'INSUFFICIENT_BALANCE' || code === 'INVALID_ESCROW_PARAMS') {
      res.status(400).json({ error: code });
      return;
    }
    if (code === 'CONCURRENT_LEDGER_CONFLICT') {
      res.status(409).json({ error: 'Concurrent balance update detected. Please retry.' });
      return;
    }
    res.status(500).json({ error: 'Failed to lock escrow hold.' });
  }
});

escrowRouter.post('/release/:escrowId', async (req: Request, res: Response) => {
  if (!isLiveDatabaseConfigured()) {
    financeUnavailable(req, res);
    return;
  }

  try {
    const result = await releasePersistentEscrow({
      escrowIdOrOrderKey: String(req.params.escrowId),
      actorAuthUid: String(res.locals.auth.uid),
      isPrivileged: isPrivilegedRole(res.locals.auth)
    });
    res.json({ success: true, ...result });
  } catch (err: any) {
    const code = err?.message || 'ESCROW_ERROR';
    if (code === 'FINANCE_UNAVAILABLE') {
      financeUnavailable(req, res);
      return;
    }
    if (code === 'FORBIDDEN') {
      res.status(403).json({ error: 'Not authorized to release this escrow record.' });
      return;
    }
    if (code === 'ESCROW_NOT_FOUND') {
      res.status(404).json({ error: 'Escrow record not found.' });
      return;
    }
    if (code === 'ESCROW_DISPUTED') {
      res.status(400).json({ error: 'Disputed escrow cannot be released directly.' });
      return;
    }
    res.status(500).json({ error: 'Failed to release escrow.' });
  }
});

escrowRouter.post('/dispute/:escrowId', async (req: Request, res: Response) => {
  if (!isLiveDatabaseConfigured()) {
    financeUnavailable(req, res);
    return;
  }

  const reason = String(req.body?.reason || '').trim();
  if (!reason) {
    res.status(400).json({ error: 'Dispute reason is required.' });
    return;
  }

  try {
    const result = await disputePersistentEscrow({
      escrowIdOrOrderKey: String(req.params.escrowId),
      actorAuthUid: String(res.locals.auth.uid),
      isPrivileged: isPrivilegedRole(res.locals.auth),
      reason
    });
    res.json({ success: true, ...result });
  } catch (err: any) {
    const code = err?.message || 'ESCROW_ERROR';
    if (code === 'FINANCE_UNAVAILABLE') {
      financeUnavailable(req, res);
      return;
    }
    if (code === 'FORBIDDEN') {
      res.status(403).json({ error: 'Not authorized to dispute this escrow record.' });
      return;
    }
    if (code === 'ESCROW_NOT_FOUND') {
      res.status(404).json({ error: 'Escrow record not found.' });
      return;
    }
    res.status(500).json({ error: 'Failed to submit escrow dispute.' });
  }
});
