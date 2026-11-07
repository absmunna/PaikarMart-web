import { Router } from 'express';
import { getCart, addCartItem, updateCartItemQty, deleteCartItem, clearCart } from './cart.controller';

const router = Router();

router.get('/', getCart);
router.post('/', addCartItem);
router.post('/add', addCartItem);
router.patch('/:id', updateCartItemQty);
router.delete('/:id', deleteCartItem);
router.delete('/', clearCart);

export const cartRoutes = router;
