import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Product from './product.js';

class CartItem extends Model {}

CartItem.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  sequelize,
  modelName: 'CartItem',
  tableName: 'cart_items',
  timestamps: false
});

export default CartItem;
