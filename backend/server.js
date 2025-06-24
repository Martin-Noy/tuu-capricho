import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import agendaRoutes from './routes/agendaRoutes.js';
import Order from './models/order.js';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', agendaRoutes);

// Database connection
const connectToDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection has been established successfully.');
    
    // Sincronizar modelos con la base de datos
    await Order.sync({ alter: true }); // 'alter: true' puede modificar la tabla si el modelo cambia
    console.log("The 'pedidos' table has been successfully synced.");

    app.listen(PORT, () => {
      console.log(`Backend server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Salir si no se puede conectar a la BD
  }
};

connectToDb();