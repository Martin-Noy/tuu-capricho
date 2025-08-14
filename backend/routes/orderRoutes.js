import express from 'express';
import Order from '../models/order.js';
import CartItem from '../models/cartItem.js';
import Product from '../models/product.js';
import { Op } from 'sequelize';

//TO-DO: Agregar endpoint para historial de órdenes, filtros por fecha y exportar órdenes a CSV.
const router = express.Router();

// Crear una orden de compra desde el carrito
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, items, userId, addresses } = req.body;
    // Buscar agendaType en detalles de agenda personalizada si existe
    let agendaType = null;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío.' });
    }
    let agendaDetails = null;
    let generatedPdfFilename = null;
    // Buscar si hay una agenda personalizada en el carrito
    for (const item of items) {
      if (item.product && item.product.isCustom) {
        agendaDetails = item.product.details;
        agendaType = item.product.details?.customerDetails?.agendaType || null;
        // Simulación: nombre de PDF generado
        generatedPdfFilename = `agenda-personalizada-${Date.now()}.pdf`;
      }
    }
    // Validar stock y actualizarlo para productos normales
    for (const item of items) {
      if (item.product && item.product.isCustom) continue;
      const product = await Product.findByPk(item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuficiente para ${product?.name || 'producto'}` });
      }
    }
    // Descontar stock para productos normales
    for (const item of items) {
      if (item.product && item.product.isCustom) continue;
      const product = await Product.findByPk(item.productId);
      await product.decrement('stock', { by: item.quantity });
    }
    // Guardar la orden con detalles de agenda personalizada y PDF si corresponde
    const order = await Order.create({
      customerName,
      customerEmail,
      agendaDefinition: items,
      userId,
      generatedPdfFilename,
      agendaDetails,
      agendaType,
      addresses
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la orden', error });
  }
});

export default router;
