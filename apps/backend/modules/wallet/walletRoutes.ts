import express from 'express';
import type { Request, Response } from 'express';
import { requireFirebaseAuth } from '../../middleware/requireFirebaseAuth.js';
import { backendEnv, isPersistentFinanceEnabled } from '../../config/env.js';
import { verifyWebhookSignature } from '../logistics/courierAdapters.js';
import {
  applyVerifiedPaymentWebhook,
  getPersistentWalletOverview,
  redeemPersistentWalletCoins
} from './walletService.js';

export const walletRouter = express.Router();

function financeUnavailable(_req: Request, res: Response) {
  res.status(503).json({
    error: 'Wallet transactions are unavailable until a persistent ledger and verified payment provider are configured.'
  });
}

// Verified payment gateway callback (signed with PAYMENT_WEBHOOK_SECRET; mounted prior to user JWT guard)
walletRouter.post('/webhooks/payment', async (req: Request, res: Response) => {
  if (!isPersistentFinanceEnabled()) {
    res.status(503).json({
      error: 'Payment webhook processing is unavailable until persistent ledger and PAYMENT_WEBHOOK_SECRET are configured.'
    });
    return;
  }

  const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;
  const isSignatureValid = verifyWebhookSignature({
    rawBody,
    bodyFallback: req.body,
    providedSignature: req.header('x-payment-signature') || req.header('x-webhook-signature'),
    providedSecretHeader: req.header('x-payment-secret'),
    authorizationHeader: req.header('authorization'),
    secret: backendEnv.paymentWebhookSecret
  });

  if (!isSignatureValid) {
    res.status(401).json({ error: 'Invalid or missing payment webhook signature.' });
    return;
  }

  const { authUid, amount, type, method, description, referenceId } = req.body || {};
  const idempotencyKey =
    (req.header('x-idempotency-key') || req.body?.idempotencyKey || referenceId || '').trim();

  if (!authUid || !idempotencyKey || !amount) {
    res.status(400).json({ error: 'authUid, amount, and idempotencyKey/referenceId are required.' });
    return;
  }

  const normalizedType =
    type === 'withdrawal' || type === 'cashback' ? type : 'deposit';

  try {
    const result = await applyVerifiedPaymentWebhook({
      idempotencyKey,
      authUid: String(authUid),
      amount: Number(amount),
      type: normalizedType,
      method: typeof method === 'string' ? method : undefined,
      description: typeof description === 'string' ? description : undefined,
      referenceId: typeof referenceId === 'string' ? referenceId : undefined
    });
    res.json({ success: true, ...result });
  } catch (err: any) {
    const code = err?.message || 'LEDGER_ERROR';
    if (code === 'FINANCE_UNAVAILABLE') {
      financeUnavailable(req, res);
      return;
    }
    if (code === 'PROFILE_NOT_FOUND') {
      res.status(404).json({ error: 'Target user profile not found.' });
      return;
    }
    if (code === 'INSUFFICIENT_BALANCE' || code === 'INVALID_AMOUNT') {
      res.status(400).json({ error: code });
      return;
    }
    if (code === 'CONCURRENT_LEDGER_CONFLICT') {
      res.status(409).json({ error: 'Concurrent balance update detected. Please retry webhook.' });
      return;
    }
    res.status(500).json({ error: 'Failed to record verified wallet ledger transaction.' });
  }
});

walletRouter.use(requireFirebaseAuth);

walletRouter.get('/', async (_req: Request, res: Response) => {
  const userId = String(res.locals.auth.uid);
  const overview = await getPersistentWalletOverview(userId);

  res.json({
    success: true,
    source: overview.source,
    persistenceReady: isPersistentFinanceEnabled(),
    wallet: overview.wallet,
    escrowSummary: overview.escrowSummary,
    escrows: overview.escrows
  });
});

// Direct client deposits/withdrawals/transfers stay fail-closed; deposits credit only via signed gateway webhook
walletRouter.post('/deposit', financeUnavailable);
walletRouter.post('/withdraw', financeUnavailable);
walletRouter.post('/transfer', financeUnavailable);

walletRouter.post('/redeem-coins', async (req: Request, res: Response) => {
  if (!isPersistentFinanceEnabled()) {
    financeUnavailable(req, res);
    return;
  }

  const userId = String(res.locals.auth.uid);
  const coinsToRedeem = Number(req.body?.coinsToRedeem ?? req.body?.coins ?? 0);

  try {
    const result = await redeemPersistentWalletCoins(userId, coinsToRedeem);
    res.json({ success: true, ...result });
  } catch (err: any) {
    const code = err?.message || 'REDEEM_ERROR';
    if (code === 'FINANCE_UNAVAILABLE') {
      financeUnavailable(req, res);
      return;
    }
    if (code === 'INVALID_COINS' || code === 'INSUFFICIENT_COINS') {
      res.status(400).json({ error: code });
      return;
    }
    if (code === 'CONCURRENT_LEDGER_CONFLICT') {
      res.status(409).json({ error: 'Concurrent ledger conflict. Please retry.' });
      return;
    }
    res.status(500).json({ error: 'Failed to redeem reward coins.' });
  }
});
