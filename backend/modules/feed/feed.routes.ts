import { Router } from 'express';
import { assembleHomeFeed } from './feed.controller';
import { optionalAuth } from '../../middleware/auth';

const router = Router();

// Retrieve aggregate feed personalized with optional target weightings
router.get('/', optionalAuth, assembleHomeFeed);

export const feedRoutes = router;
