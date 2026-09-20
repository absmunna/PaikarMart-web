import { Router } from 'express';
import { recordContentView, getContentAnalyticsStats } from './analytics.controller';

const router = Router();

router.post('/view', recordContentView);
router.get('/stats/:contentItemId', getContentAnalyticsStats);

export const analyticsRoutes = router;
