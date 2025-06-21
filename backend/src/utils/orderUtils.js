const db = require('../config/db');

// Inserta un pedido y retorna el id
async function insertOrder({ userId, totalPrice, orderType, coverImageInfo, textColor }) {
  const result = await db.query(
    'INSERT INTO Pedidos (user_id, total_price, order_type, order_date, status, cover_image_info, text_color) VALUES ($1, $2, $3, NOW(), $4, $5, $6) RETURNING id',
    [userId, totalPrice, orderType, 'pending', coverImageInfo, textColor]
  );
  return result.rows[0].id;
}

// Inserta los detalles del pedido
async function insertOrderDetails(orderId, items) {
  for (const item of items) {
    const { sectionId, pages, templateId, sectionPrice } = item;
    await db.query(
      'INSERT INTO DetallePedido (order_id, section_id, pages, template_id, section_price) VALUES ($1, $2, $3, $4, $5)',
      [orderId, sectionId, pages, templateId, sectionPrice]
    );
  }
}

// Obtiene un pedido por id
async function getOrderById(id) {
  const result = await db.query('SELECT * FROM Pedidos WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  const order = result.rows[0];
  const detailsResult = await db.query('SELECT * FROM DetallePedido WHERE order_id = $1', [id]);
  order.details = detailsResult.rows;
  return order;
}

module.exports = {
  insertOrder,
  insertOrderDetails,
  getOrderById,
};