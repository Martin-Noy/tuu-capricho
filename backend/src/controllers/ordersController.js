const db = require('../config/db');
const orderUtils = require('../utils/orderUtils');

exports.createOrder = async (req, res) => {
  const { userId, items, totalPrice, orderType, coverImageInfo, textColor } = req.body;
  try {
    await db.query('BEGIN');
    const orderId = await orderUtils.insertOrder({ userId, totalPrice, orderType, coverImageInfo, textColor });
    await orderUtils.insertOrderDetails(orderId, items);
    await db.query('COMMIT');
    res.status(201).json({ message: 'Pedido creado exitosamente', orderId });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Error al crear pedido' });
  }
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await orderUtils.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener pedido' });
  }
};

// Puedes añadir exports.updateOrder, exports.cancelOrder, etc.