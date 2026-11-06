import { Router } from 'express';
import { requireRole } from '../../middleware/permission';
import {
  listSellerProducts,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  listSellerOrders,
  updateSellerOrderStatus,
  submitSellerVerification,
  getPendingVendors,
  approveVendor,
  rejectVendor,
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

// Pending Vendor Management for Admin
router.get('/pending-vendors', requireRole(['admin', 'super_admin']), getPendingVendors);
router.post('/vendors/:id/approve', requireRole(['admin', 'super_admin']), approveVendor);
router.post('/vendors/:id/reject', requireRole(['admin', 'super_admin']), rejectVendor);

export const sellerRoutes = router;
