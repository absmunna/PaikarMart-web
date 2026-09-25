import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  getProductSeller, 
  getProductReviews, 
  getProductQnA, 
  addQuestion, 
  addProduct, 
  deleteProduct 
} from './product.controller';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/:id/seller', getProductSeller);
router.get('/:id/reviews', getProductReviews);
router.get('/:id/qna', getProductQnA);
router.post('/:id/questions', addQuestion);
router.post('/', addProduct);
router.delete('/:id', deleteProduct);

export const productRoutes = router;

