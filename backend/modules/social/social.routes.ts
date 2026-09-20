import { Router } from 'express';
import { followTarget, unfollowTarget, getFollowStats } from './social.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.post('/follow', requireAuth, followTarget);
router.post('/unfollow', requireAuth, unfollowTarget);
router.get('/stats', requireAuth, getFollowStats);
router.get('/stats/:userId', requireAuth, getFollowStats);

export const socialRoutes = router;
