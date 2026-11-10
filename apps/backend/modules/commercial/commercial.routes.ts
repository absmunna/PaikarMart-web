import { Router } from 'express';
import { CommercialController } from './commercial.controller';
import { requireAuth } from '../../middleware/auth';
import { requireRoleGroup } from '../../middleware/permission';

const router = Router();

// Hub Overview
router.get('/portals', CommercialController.getCommercialPortalsHub);

// 1. B2C Retail & B2B Wholesale Logic (Tiered Bulk Pricing & MOQ)
router.post('/pricing/calculate', CommercialController.calculateTieredPricing);
router.get('/pricing/:productId/tiers', CommercialController.getProductTiers);
router.post('/pricing/validate-cart', CommercialController.validateCartMoq);

// 2. Hyperlocal / Nearby Stores Logic (GPS Geofencing & ETA)
router.post('/hyperlocal/check-geofence', CommercialController.checkStoreGeofence);
router.get('/hyperlocal/nearby-stores', CommercialController.getNearbyStores);
router.patch('/hyperlocal/stores/:storeId/status', requireAuth, requireRoleGroup(['vendor', 'admin']), CommercialController.toggleStoreStatus);

// 3. Logistics & Service Providers (Rider Allocation & Slot Booking)
router.post('/logistics/dispatch', requireAuth, CommercialController.allocateRider);
router.post('/logistics/book-service', requireAuth, CommercialController.bookService);
router.get('/logistics/riders/available', CommercialController.getAvailableRiders);
router.patch('/logistics/assignments/:assignmentId/status', requireAuth, CommercialController.updateRiderStatus);

// 4. Digital Goods & OTT Content Engine (Instant Automated Delivery)
router.post('/digital/verify-and-deliver', requireAuth, CommercialController.verifyAndDeliverDigital);
router.get('/digital/orders/:orderId/access', requireAuth, CommercialController.getDigitalDelivery);
router.post('/digital/assets', requireAuth, requireRoleGroup(['vendor', 'admin']), CommercialController.registerDigitalAsset);

export const commercialRoutes = router;
export default router;
