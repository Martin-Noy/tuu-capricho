import express from 'express';
import Order from '../models/order.js';
import User from '../models/user.js';

const router = express.Router();

// Obtener todas las órdenes
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({ include: User });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las órdenes', error });
  }
});

export default router;
