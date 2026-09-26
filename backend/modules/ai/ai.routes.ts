import { Router } from 'express';
import { handleAIChat, handleMarketSearch } from './ai.controller';
import { requireAuth, optionalAuth } from '../../middleware/auth';

const router = Router();

router.post('/chat', optionalAuth, handleAIChat);
router.post('/search', requireAuth, handleMarketSearch);

export const aiRoutes = router;
