import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/auth';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  createNotification
} from './notification.controller';

const router = Router();

// Retrieve notifications for authenticated user (or dev fallback)
router.get('/', optionalAuth, getNotifications);

// Mark a specific notification as read
router.patch('/:id/read', optionalAuth, markAsRead);

// Mark all notifications as read
router.patch('/read-all', optionalAuth, markAllAsRead);

// Delete single notification
router.delete('/:id', optionalAuth, deleteNotification);

// Clear all notifications
router.delete('/clear-all', optionalAuth, clearAllNotifications);

// Create custom notification (for testing or internal service calls)
router.post('/', optionalAuth, createNotification);

export const notificationRoutes = router;
export default router;
