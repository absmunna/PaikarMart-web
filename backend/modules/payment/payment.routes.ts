import { Router } from 'express';
import { initiatePayment, verifyPayment, handlePaymentCallback } from './payment.controller';
import { requireAuth } from '../../middleware/auth';
import { requirePermission } from '../../middleware/permission';

const router = Router();

router.post('/initiate', requireAuth, requirePermission("CAN_PURCHASE"), initiatePayment);
router.post('/verify', requireAuth, requirePermission("CAN_PURCHASE"), verifyPayment);
router.post('/callback/:provider', handlePaymentCallback);

export const paymentRoutes = router;
