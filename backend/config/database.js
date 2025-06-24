import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: 'db', // El nombre del servicio de la BD en docker-compose.yml
    dialect: 'postgres',
    dialectModule: (await import('pg')).default,
    logging: false, // Poner en `console.log` para ver las queries SQL
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;