import { Router } from 'express';
import {
  createEscrow,
  releaseEscrow,
  disputeEscrow,
  getEscrowStatus
} from './escrow.controller';

const router = Router();

router.post('/hold', createEscrow);
router.post('/create', createEscrow);
router.post('/release/:escrowId', releaseEscrow);
router.post('/dispute/:escrowId', disputeEscrow);
router.get('/status/:orderId', getEscrowStatus);

export const escrowRoutes = router;
