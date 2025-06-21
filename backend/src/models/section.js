const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').pool;

const Section = sequelize.define('Section', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING
  },
  es_paginas_variables: {
    type: DataTypes.BOOLEAN
  },
  porcentaje_adicional: {
    type: DataTypes.FLOAT
  },
  precio_base_seccion: {
    type: DataTypes.FLOAT
  }
}, {
  tableName: 'Secciones',
  timestamps: false
});

module.exports = Section;