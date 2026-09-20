import { Router } from 'express';
import { uploadFile, getFile } from './storage.controller';

const router = Router();

router.post('/upload', uploadFile);
router.get('/file/:id', getFile);

export const storageRoutes = router;
