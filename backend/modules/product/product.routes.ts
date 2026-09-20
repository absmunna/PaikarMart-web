import { Router } from 'express';
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from './product.controller';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/permission';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', requireAuth, requireRole('seller'), addProduct);
router.patch('/:id', requireAuth, requireRole('seller'), updateProduct);
router.delete('/:id', requireAuth, requireRole('seller'), deleteProduct);

export const productRoutes = router;

