import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Order extends Model {}

Order.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_name'
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_email'
  },
  generatedPdfFilename: {
    type: DataTypes.STRING,
    field: 'generated_pdf_filename'
  },
  agendaDefinition: {
    type: DataTypes.JSONB, // Usar JSONB para eficiencia en consultas
    allowNull: true,
    field: 'agenda_definition'
  },
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'pedidos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Order;