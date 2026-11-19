import { Router } from 'express';
import { 
  submitVerification, 
  getUserVerificationStatus, 
  getPendingVerifications, 
  reviewVerification 
} from './verification.controller';

const router = Router();

router.post('/submit', submitVerification);
router.get('/user/:userId', getUserVerificationStatus);
router.get('/pending', getPendingVerifications);
router.patch('/:id/review', reviewVerification);

export const verificationRoutes = router;
export default router;
