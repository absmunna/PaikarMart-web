import { Router } from 'express';
import { 
  getCategoryConfigs, 
  updateCategoryConfig, 
  getSellerProfile, 
  createOrUpdateSellerProfile, 
  submitRefundRequest, 
  getRefundTickets, 
  fileComplaint, 
  getComplaints 
} from './compliance.controller';

const router = Router();

// Category guidelines configs
router.get('/categories', getCategoryConfigs);
router.put('/categories/:id', updateCategoryConfig);

// KYC and verification application
router.get('/seller/profile', getSellerProfile);
router.post('/seller/profile', createOrUpdateSellerProfile);

// Escrow settlement and Bangladesh guidelines SLA
router.get('/refunds', getRefundTickets);
router.post('/refunds', submitRefundRequest);

// Consumer protection complaints queue
router.get('/complaints', getComplaints);
router.post('/complaints', fileComplaint);

export { router as complianceRoutes };
