import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';

const router = Router();
router.use(requireAuth);

const escrowUnavailable = (_req: any, res: any) => res.status(501).json({
  error: 'Escrow operation is temporarily disabled until buyer/seller ownership, admin dispute review, and atomic settlement are implemented.'
});

// Keep existing URLs stable, but fail closed instead of mutating financial state.
router.post('/hold', escrowUnavailable);
router.post('/create', escrowUnavailable);
router.post('/release/:escrowId', escrowUnavailable);
router.post('/dispute/:escrowId', escrowUnavailable);
router.get('/status/:orderId', escrowUnavailable);

export const escrowRoutes = router;
