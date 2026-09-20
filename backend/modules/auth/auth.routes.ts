import { Router } from 'express';
import { login, register, forgotPassword, sendEmailOtp, verifyEmailOtp, getMe, logout, getRbacProfile } from './auth.controller';
import { requireAuth } from '@backend/middleware/auth';
import { requireCustomer, requireVendor, requireAdmin, requirePermission } from '@backend/middleware/permission';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/send-otp', sendEmailOtp);
router.post('/verify-otp', verifyEmailOtp);
router.get('/me', getMe);
router.get('/rbac-profile', getRbacProfile);
router.get('/rbac/profile', getRbacProfile);

// RBAC Protected Testing & Verification Gates
router.get('/customer-gate', requireAuth, requireCustomer, (req, res) => {
  res.json({
    status: 'granted',
    persona: 'customer',
    message: 'Access granted: Customer scope verified',
    user: (req as any).user
  });
});

router.get('/vendor-gate', requireAuth, requireVendor, (req, res) => {
  res.json({
    status: 'granted',
    persona: 'vendor',
    message: 'Access granted: Vendor / Merchant scope verified',
    user: (req as any).user
  });
});

router.get('/admin-gate', requireAuth, requireAdmin, (req, res) => {
  res.json({
    status: 'granted',
    persona: 'admin',
    message: 'Access granted: Administrator scope verified',
    user: (req as any).user
  });
});

export const authRoutes = router;
