import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import {
  toggleReaction,
  createComment,
  getContentCommentsList,
  trackShare,
  toggleBookmark
} from './engagement.controller';

const router = Router();

router.post('/reaction', requireAuth, toggleReaction);
router.post('/comment', requireAuth, createComment);
router.get('/comment/:contentItemId', getContentCommentsList);
router.post('/share', trackShare); // Optional auth is handled in controller
router.post('/bookmark', requireAuth, toggleBookmark);

export const engagementRoutes = router;
