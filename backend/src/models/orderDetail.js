const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').pool;

const OrderDetail = sequelize.define('OrderDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  section_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pages: {
    type: DataTypes.INTEGER
  },
  template_id: {
    type: DataTypes.INTEGER
  },
  section_price: {
    type: DataTypes.FLOAT
  }
}, {
  tableName: 'DetallePedido',
  timestamps: false
});

module.exports = OrderDetail;