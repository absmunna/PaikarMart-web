import { Router } from 'express';
import * as searchController from './search.controller';

const router = Router();

/**
 * @route GET /api/search
 * @desc Unified search across all hubs (Marketplace, Services, Community, Local)
 */
router.get('/', searchController.unifiedSearch);

export default router;
