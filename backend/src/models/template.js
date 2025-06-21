const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').pool;

const Template = sequelize.define('Template', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  },
  image_url: {
    type: DataTypes.STRING
  },
  template_pdf_path: {
    type: DataTypes.STRING
  },
  section_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Templates',
  timestamps: false
});

module.exports = Template;