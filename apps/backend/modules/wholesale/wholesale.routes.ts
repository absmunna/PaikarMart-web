import { Router } from 'express';
import { 
  getWholesaleProducts, 
  submitRFQ, 
  getRFQs, 
  respondToRFQ 
} from './wholesale.controller';

const router = Router();

// GET /api/wholesale/products?portal=[PORTAL_ID]
router.get('/products', getWholesaleProducts);

// B2B Trading & Invoicing Flow
router.post('/rfq', submitRFQ);
router.get('/rfq', getRFQs);
router.get('/rfqs', getRFQs);
router.post('/rfq/:id/respond', respondToRFQ);

export const wholesaleRoutes = router;
