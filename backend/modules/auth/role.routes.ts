import { Router } from 'express';
import { createRole, getRoles } from './role.controller';

const router = Router();

router.post('/', createRole);
router.get('/', getRoles);

export const roleRoutes = router;
