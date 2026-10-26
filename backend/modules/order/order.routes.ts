import { Router } from 'express';
import { getOrders, getOrderById, trackOrder, addOrder, reorder, updateOrderStatus } from './order.controller';

const router = Router();

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.get('/:id/track', trackOrder);
router.post('/', addOrder);
router.post('/:id/reorder', reorder);
router.patch('/:id/status', updateOrderStatus);
router.put('/:id/status', updateOrderStatus);

export const orderRoutes = router;

