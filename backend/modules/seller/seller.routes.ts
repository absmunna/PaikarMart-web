import { Router } from 'express';
import {
  listSellerProducts,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  listSellerOrders,
  updateSellerOrderStatus,
  submitSellerVerification,
} from './seller.controller';

const router = Router();

// Product endpoints
router.get('/products', listSellerProducts);
router.post('/products', createSellerProduct);
router.put('/products/:id', updateSellerProduct);
router.delete('/products/:id', deleteSellerProduct);

// Order endpoints
router.get('/orders', listSellerOrders);
router.put('/orders/:id/status', updateSellerOrderStatus);

// Verification
router.post('/verification', submitSellerVerification);

export const sellerRoutes = router;
