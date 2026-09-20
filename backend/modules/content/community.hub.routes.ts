import { Router } from 'express';
import { socialRoutes } from '../social/social.routes';
import { contentRoutes } from '../content/content.routes';

const router = Router();

// Sub-routes for Community Hub
router.use('/social', socialRoutes);
router.use('/content', contentRoutes);

// Placeholder for Offers
router.get('/offers', (req, res) => {
  res.json({ success: true, offers: [] });
});

// Placeholder for Live Streams
router.get('/live', (req, res) => {
  res.json({ success: true, streams: [] });
});

export default router;
