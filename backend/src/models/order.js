const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_type: {
    type: DataTypes.ENUM('physical', 'digital'),
    allowNull: false,
  },
  customer_details: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  pdf_filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
  },
}, {
  // Opciones adicionales del modelo
  timestamps: true, // Habilita createdAt y updatedAt
});

module.exports = Order;