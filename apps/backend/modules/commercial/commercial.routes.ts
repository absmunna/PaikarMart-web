import { Router } from 'express';
import { CommercialController } from './commercial.controller';

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
router.patch('/hyperlocal/stores/:storeId/status', CommercialController.toggleStoreStatus);

// 3. Logistics & Service Providers (Rider Allocation & Slot Booking)
router.post('/logistics/dispatch', CommercialController.allocateRider);
router.post('/logistics/book-service', CommercialController.bookService);
router.get('/logistics/riders/available', CommercialController.getAvailableRiders);
router.patch('/logistics/assignments/:assignmentId/status', CommercialController.updateRiderStatus);

// 4. Digital Goods & OTT Content Engine (Instant Automated Delivery)
router.post('/digital/verify-and-deliver', CommercialController.verifyAndDeliverDigital);
router.get('/digital/orders/:orderId/access', CommercialController.getDigitalDelivery);
router.post('/digital/assets', CommercialController.registerDigitalAsset);

export const commercialRoutes = router;
export default router;
