// backend/src/models/Order.js
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
});

module.exports = Order;