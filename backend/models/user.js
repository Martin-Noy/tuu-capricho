import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

//TO-DO: Agregar campos de perfil (foto, direcciones), validación de email y recuperación de contraseña.
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('client', 'admin'), defaultValue: 'client' }
}, {
  tableName: 'users',
  timestamps: true
});

export default User;