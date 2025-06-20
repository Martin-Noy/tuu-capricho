const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false // Para Render/Heroku, puede ser necesario para conexiones SSL
  }
});

pool.on('error', (err, client) => {
  console.error('Error inesperado en el cliente ocioso', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool, // Exporta el pool directamente si necesitas operaciones más avanzadas
};