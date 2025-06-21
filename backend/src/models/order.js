const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').pool; // Ajusta si usas otra instancia

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  order_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  order_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
  cover_image_info: {
    type: DataTypes.STRING
  },
  text_color: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'Pedidos',
  timestamps: false
});

module.exports = Order;