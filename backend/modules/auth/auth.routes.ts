import { Router } from 'express';
import { login, register, forgotPassword, sendOtp, verifyOtp, getCurrentUser } from './auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/send-otp', sendOtp);
router.post('/request-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', getCurrentUser);

export const authRoutes = router;

