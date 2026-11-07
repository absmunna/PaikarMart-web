import { Router } from 'express';
import { initiatePayment, verifyPayment, handlePaymentCallback, getPaymentProviders } from './payment.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.get('/providers', getPaymentProviders);

// 🔒 Mandate verified user authentication on payment initiation & verification
router.post('/initiate', requireAuth, initiatePayment);
router.post('/verify', requireAuth, verifyPayment);

// Payment provider webhook IPNs (server-to-server IPNs verify signatures internally)
router.post('/callback/:provider', handlePaymentCallback);

export const paymentRoutes = router;
