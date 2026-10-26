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
  getProductPricing
} from './product.controller';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/:id/pricing', getProductPricing);
router.get('/:id/seller', getProductSeller);
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', addProductReview);
router.get('/:id/qna', getProductQnA);
router.post('/:id/questions', addQuestion);
router.post('/', addProduct);
router.delete('/:id', deleteProduct);

export const productRoutes = router;
