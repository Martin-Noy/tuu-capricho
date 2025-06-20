const db = require('../config/db');

exports.createOrder = async (req, res) => {
  const { userId, items, totalPrice, orderType, coverImageInfo, textColor } = req.body;
  try {
    // Iniciar una transacción para asegurar la consistencia si involucra varias tablas
    await db.query('BEGIN');

    // 1. Insertar el pedido principal
    const orderResult = await db.query(
      'INSERT INTO Pedidos (user_id, total_price, order_type, order_date, status, cover_image_info, text_color) VALUES ($1, $2, $3, NOW(), $4, $5, $6) RETURNING id',
      [userId, totalPrice, orderType, 'pending', coverImageInfo, textColor]
    );
    const orderId = orderResult.rows[0].id;

    // 2. Insertar los detalles del pedido (secciones seleccionadas)
    for (const item of items) {
      const { sectionId, pages, templateId, sectionPrice } = item;
      await db.query(
        'INSERT INTO DetallePedido (order_id, section_id, pages, template_id, section_price) VALUES ($1, $2, $3, $4, $5)',
        [orderId, sectionId, pages, templateId, sectionPrice]
      );
    }

    await db.query('COMMIT');
    res.status(201).json({ message: 'Pedido creado exitosamente', orderId });
  } catch (err) {
    await db.query('ROLLBACK'); // Deshacer si hay un error
    console.error(err);
    res.status(500).json({ message: 'Error al crear pedido' });
  }
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM Pedidos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    const order = result.rows[0];

    // Opcional: Obtener los detalles del pedido también
    const detailsResult = await db.query('SELECT * FROM DetallePedido WHERE order_id = $1', [id]);
    order.details = detailsResult.rows;

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener pedido' });
  }
};

// Puedes añadir exports.updateOrder, exports.cancelOrder, etc.