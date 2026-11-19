import { Router } from 'express';
import { getSystemIntelligence } from './intelligence.controller';

const router = Router();

router.get('/summary', getSystemIntelligence);

export const intelligenceRoutes = router;
