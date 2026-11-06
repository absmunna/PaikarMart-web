import { Router } from 'express';
import {
  getAdminMetrics,
  getAdminEscrows,
  releaseAdminEscrow,
  refundAdminEscrow,
  getAdminModerationQueue,
  resolveAdminModeration,
  getAdminFeatureFlags,
  updateAdminFeatureFlag,
  getAdminAuditLogs
} from './admin.controller';

const router = Router();

// Platform Health & Executive Metrics
router.get('/metrics', getAdminMetrics);

// Escrow & Dispute Governance
router.get('/escrow', getAdminEscrows);
router.post('/escrow/:escrowId/release', releaseAdminEscrow);
router.post('/escrow/:escrowId/refund', refundAdminEscrow);

// Content & Reverse-Auction Social Moderation
router.get('/moderation', getAdminModerationQueue);
router.post('/moderation/:id/resolve', resolveAdminModeration);

// DevOps & Dynamic Feature Flags
router.get('/flags', getAdminFeatureFlags);
router.patch('/flags/:key', updateAdminFeatureFlag);

// Immutable System Audit Logs
router.get('/audit-logs', getAdminAuditLogs);

export const adminRoutes = router;
export default router;
