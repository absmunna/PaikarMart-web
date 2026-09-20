import { Router } from 'express';
import { getModerationQueue } from './governance.controller';

const router = Router();

router.get('/moderation-queue', getModerationQueue);

export const governanceRoutes = router;
