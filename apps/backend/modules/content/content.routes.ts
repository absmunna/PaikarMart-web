import { Router } from 'express';
import { createContentItem, getContentItems, promoteContentItem, deleteContentItem } from './content.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.post('/', requireAuth, createContentItem);
router.get('/', getContentItems);
router.post('/:id/promote', requireAuth, promoteContentItem);
router.delete('/:id', requireAuth, deleteContentItem);

export const contentRoutes = router;
