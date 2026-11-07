import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { 
  getOrders, 
  getOrderById, 
  trackOrder, 
  addOrder, 
  guestCheckout,
  reorder, 
  updateOrderStatus 
} from './order.controller';

const router = Router();

// Unauthenticated Guest Checkout with server validation
router.post('/guest-checkout', guestCheckout);

// Authenticated order management endpoints
router.get('/', requireAuth, getOrders);
router.get('/:id', requireAuth, getOrderById);
router.get('/:id/track', requireAuth, trackOrder);
router.post('/', requireAuth, addOrder);
router.post('/:id/reorder', requireAuth, reorder);
router.patch('/:id/status', requireAuth, updateOrderStatus);
router.put('/:id/status', requireAuth, updateOrderStatus);

export const orderRoutes = router;

