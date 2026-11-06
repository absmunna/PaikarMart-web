import { Router } from 'express';
import { initiatePayment, verifyPayment, handlePaymentCallback, getPaymentProviders } from './payment.controller';

const router = Router();

router.get('/providers', getPaymentProviders);
router.post('/initiate', initiatePayment);
router.post('/verify', verifyPayment);
router.post('/callback/:provider', handlePaymentCallback);

export const paymentRoutes = router;
