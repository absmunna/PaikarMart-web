import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  getProductSeller, 
  getProductReviews, 
  getProductQnA, 
  addQuestion, 
  addProduct, 
  deleteProduct,
  addProductReview,
  getProductPricing,
  updateProduct,
  featureProductOnBanner
} from './product.controller';

import { requireAuth } from '../../middleware/auth';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/:id/pricing', getProductPricing);
router.get('/:id/seller', getProductSeller);
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', requireAuth, addProductReview);
router.get('/:id/qna', getProductQnA);
router.post('/:id/questions', addQuestion);
router.post('/', requireAuth, addProduct);
router.put('/:id', requireAuth, updateProduct);
router.patch('/:id/feature', requireAuth, featureProductOnBanner);
router.delete('/:id', requireAuth, deleteProduct);

export const productRoutes = router;


