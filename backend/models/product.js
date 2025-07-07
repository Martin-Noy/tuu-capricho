import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Product extends Model {}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  photos: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Array de URLs o paths de fotos
    allowNull: false
  },
  basePrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'base_price'
  },
  percentage: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'productos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
export default Product;