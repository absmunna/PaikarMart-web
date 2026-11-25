import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/auth';
import {
  createMaster,
  upsertOffer,
  getByPmin,
  searchCatalog,
  recalcBuyBox,
  patchOffer,
  myOffers,
} from './catalog.controller';

const router = Router();

// Public read
router.get('/search', optionalAuth, searchCatalog);
router.get('/pmin/:pmin', optionalAuth, getByPmin);

// Seller / auth writes
router.post('/masters', requireAuth, createMaster);
router.post('/offers', requireAuth, upsertOffer);
router.patch('/offers/:id', requireAuth, patchOffer);
router.get('/my-offers', requireAuth, myOffers);
router.post('/pmin/:pmin/buy-box', requireAuth, recalcBuyBox);

export const catalogRoutes = router;
