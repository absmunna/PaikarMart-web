import { Router } from 'express';
import { getDemands, getDemandById, createDemand } from './demand.controller';

const router = Router();

router.get('/', getDemands);
router.get('/:id', getDemandById);
router.post('/', createDemand);

export const demandRoutes = router;
