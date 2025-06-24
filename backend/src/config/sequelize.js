const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: 'db', // El nombre del servicio en docker-compose.yml
    dialect: 'postgres',
    port: 5432,
    logging: false, // Desactiva los logs de SQL en la consola
  }
);

module.exports = sequelize;