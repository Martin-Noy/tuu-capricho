import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import agendaRoutes from './routes/agendaRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import Order from './models/order.js';
import Product from './models/product.js';
import CartItem from './models/cartItem.js';
import cartRoutes from './routes/cartRoutes.js';
import User from './models/user.js';
import path from 'path';
import { seedProducts } from './services/seedProducts.js';
import orderRoutes from './routes/orderRoutes.js';
import adminOrdersRoutes from './routes/adminOrdersRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', agendaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/PDFs', express.static(path.resolve(process.cwd(), 'PDFs')));
app.use('/api/orders', orderRoutes);
app.use('/api/admin/orders', adminOrdersRoutes);

// Database connection
const connectToDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection has been established successfully.');
    
    // Sincronizar modelos con la base de datos
  await User.sync({ alter: true }); // Sincronizar el modelo User primero
  await Order.sync({ alter: true }); // Luego sincronizar el modelo Order
  await Product.sync({ alter: true }); // Sincronizar también el modelo Product
  await CartItem.sync({ alter: true }); // Sincronizar el modelo CartItem
  console.log("Las tablas 'usuarios', 'pedidos', 'productos' y 'cart_items' han sido sincronizadas correctamente.");

    await seedProducts();
    app.listen(PORT, () => {
      console.log(`Backend server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Salir si no se puede conectar a la BD
  }
};

connectToDb();