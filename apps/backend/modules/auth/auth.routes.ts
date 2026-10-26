import { Router } from 'express';
import {
  login,
  register,
  forgotPassword,
  sendOtp,
  verifyOtp,
  getCurrentUser,
  syncUser,
  getDbStatus
} from './auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/send-otp', sendOtp);
router.post('/request-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/sync', syncUser);
router.get('/db-status', getDbStatus);
router.get('/me', getCurrentUser);

export const authRoutes = router;
