import { Router } from 'express';
import { createEscrow, releaseEscrow } from './escrow.controller';
import { requireAuth } from '../../middleware/auth';
import { requirePermission } from '../../middleware/permission';

const router = Router();

// Assuming only admins can handle creation/release or business owners
router.post('/create', requireAuth, requirePermission("CAN_MANAGE_ESCROWS"), createEscrow);
router.post('/release/:escrowId', requireAuth, requirePermission("CAN_MANAGE_ESCROWS"), releaseEscrow);

export const escrowRoutes = router;
