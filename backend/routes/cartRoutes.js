import express from 'express';
import {
  getCartItems,
  addToCart,
  updateCartItem,
  removeCartItem
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/', getCartItems);
router.post('/', addToCart);
router.put('/:id', updateCartItem);
router.delete('/:id', removeCartItem);

export default router;
