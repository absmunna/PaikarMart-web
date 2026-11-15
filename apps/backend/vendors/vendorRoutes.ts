import { Router } from 'express';
import type { Request, Response } from 'express';
import { type UserRole } from '../../../packages/shared/src/index.js';
import {
  decideKycApplication,
  getPublicProfileByHandle,
  getPublicStoreById,
  getVendorAnalytics,
  listKycQueue,
  listPublicStores,
  submitVendorKycApplication
} from './vendorService.js';
import { requireFirebaseAuth } from '../middleware/requireFirebaseAuth.js';

export const vendorRouter = Router();

function extractRequesterRole(res: Response): UserRole | undefined {
  const auth = res.locals.auth;
  const raw = String(auth?.role || auth?.roles?.find((role: string) => ['consumer', 'vendor', 'moderator', 'admin', 'super_admin'].includes(role)) || '').trim();
  if (['consumer', 'vendor', 'moderator', 'admin', 'super_admin'].includes(raw)) {
    return raw as UserRole;
  }
  return undefined;
}

vendorRouter.post('/register', requireFirebaseAuth, (req: Request, res: Response) => {
  try {
    const result = submitVendorKycApplication({ ...(req.body || {}), applicantId: res.locals.auth.uid });
    res.status(201).json({
      success: true,
      message:
        result.vendorProfile.kycStatus === 'approved'
          ? 'Merchant KYC verified and Seller Central activated.'
          : 'KYC documents submitted to Governance Queue for verification.',
      application: result.application,
      vendorProfile: result.vendorProfile,
      trustMeta: result.trustMeta
    });
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to register vendor KYC application.' });
  }
});

vendorRouter.get('/stores', (_req: Request, res: Response) => {
  res.json({ success: true, stores: listPublicStores() });
});

vendorRouter.get('/stores/:storeId', (req: Request, res: Response) => {
  const store = getPublicStoreById(req.params.storeId);
  if (!store) {
    res.status(404).json({ error: 'Storefront not found.' });
    return;
  }
  res.json({ success: true, store });
});

// Zero-PII Unified Public @handle Profile Endpoint
vendorRouter.get('/profile/:handle', (req: Request, res: Response) => {
  const profile = getPublicProfileByHandle(req.params.handle);
  if (!profile) {
    res.status(404).json({ error: 'Public handle profile not found.' });
    return;
  }
  res.json({ success: true, profile });
});

vendorRouter.get('/:vendorId/analytics', requireFirebaseAuth, (req: Request, res: Response) => {
  const userId = res.locals.auth.uid;
  const analytics = getVendorAnalytics(req.params.vendorId, userId);
  res.json({ success: true, analytics });
});

vendorRouter.get('/kyc/queue', requireFirebaseAuth, (req: Request, res: Response) => {
  const requesterRole = extractRequesterRole(res);
  const queueResult = listKycQueue(requesterRole);
  if (!queueResult.authorized) {
    res.status(403).json({
      error: 'Forbidden: Governance role (moderator, admin, or super_admin) required.'
    });
    return;
  }
  res.json({ success: true, applications: queueResult.applications });
});

vendorRouter.post('/kyc/:applicationId/decision', requireFirebaseAuth, (req: Request, res: Response) => {
  const requesterRole = extractRequesterRole(res);
  const decision = req.body?.decision;
  if (!['approved', 'rejected', 'suspended'].includes(decision)) {
    res.status(400).json({ error: 'Decision must be approved, rejected, or suspended.' });
    return;
  }

  const outcome = decideKycApplication({
    applicationId: req.params.applicationId,
    decision,
    reviewerEmail: String(res.locals.auth.email || res.locals.auth.uid),
    requesterRole,
    note: req.body?.note
  });

  if (!outcome.ok) {
    res.status(outcome.statusCode).json({ error: outcome.error });
    return;
  }

  res.json({ success: true, application: outcome.application });
});
