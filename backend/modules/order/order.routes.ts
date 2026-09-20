import { Router } from 'express';
import { getOrders, getOrderById, addOrder, updateOrderStatus } from './order.controller';
import { requireAuth } from '@backend/middleware/auth';
import { requirePermission } from '@backend/middleware/permission';

const router = Router();

router.get('/', requireAuth, getOrders);
router.get('/:id', requireAuth, getOrderById);
router.post('/', requireAuth, requirePermission("CAN_PURCHASE"), addOrder);
router.patch('/:id/status', requireAuth, requirePermission("CAN_MANAGE_ORDERS"), updateOrderStatus);

export const orderRoutes = router;

