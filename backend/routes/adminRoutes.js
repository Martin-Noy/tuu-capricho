import Product from '../models/product.js';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
// Endpoint para agregar producto individual
router.post('/products', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { name, basePrice, percentage, description, stock, photos } = req.body;
    const product = await Product.create({
      name,
      basePrice,
      percentage,
      description,
      stock,
      photos
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear producto', error: err });
  }
});

// Endpoint para subir productos por CSV
const upload = multer({ dest: 'uploads/' });
router.post('/products/csv', authenticate, authorizeAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No se subió archivo CSV.' });
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const row of results) {
          await Product.create({
            name: row.name,
            basePrice: parseFloat(row.basePrice),
            percentage: parseFloat(row.percentage),
            description: row.description,
            stock: parseInt(row.stock),
            photos: row.photos ? row.photos.split(',') : []
          });
        }
        fs.unlinkSync(req.file.path);
        res.json({ message: 'Productos agregados correctamente.' });
      } catch (err) {
        res.status(500).json({ message: 'Error al procesar CSV', error: err });
      }
    });
});
import express from 'express';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';

//TO-DO: Agregar gestión de usuarios, edición/eliminación de productos y reportes avanzados.
const router = express.Router();


import Order from '../models/order.js';
import Product from '../models/product.js';

// Resumen de ventas y productos para el panel admin
router.get('/dashboard', authenticate, authorizeAdmin, async (req, res) => {
  try {
    // Todas las órdenes
    const orders = await Order.findAll();

    // Contar agendas físicas y digitales
    let fisicas = 0;
    let digitales = 0;
    let productosVendidos = {};
    let totalGanancia = 0;

    for (const order of orders) {
      if (order.agendaType === 'fisica') fisicas++;
      if (order.agendaType === 'digital') digitales++;
      // Recorrer productos vendidos en la orden
      if (order.agendaDefinition && Array.isArray(order.agendaDefinition)) {
        for (const item of order.agendaDefinition) {
          const pid = item.productId;
          const cantidad = item.quantity;
          // Buscar precio y porcentaje
          let precio = 0;
          let porcentaje = 0;
          if (item.product && item.product.basePrice) {
            precio = item.product.basePrice;
            porcentaje = item.product.percentage || 0;
          } else {
            // Buscar en la base si no está en el objeto
            const prod = await Product.findByPk(pid);
            if (prod) {
              precio = prod.basePrice;
              porcentaje = prod.percentage;
            }
          }
          if (!productosVendidos[pid]) {
            productosVendidos[pid] = { cantidad: 0, valor: 0, ganancia: 0, nombre: item.product?.name || pid };
          }
          productosVendidos[pid].cantidad += cantidad;
          productosVendidos[pid].valor += precio * cantidad;
          productosVendidos[pid].ganancia += (precio * cantidad * (porcentaje / 100));
          totalGanancia += (precio * cantidad * (porcentaje / 100));
        }
      }
    }

    res.json({
      agendasFisicas: fisicas,
      agendasDigitales: digitales,
      productosVendidos,
      totalGanancia
    });
  } catch (err) {
    res.status(500).json({ message: 'Error en dashboard', error: err });
  }
});

export default router;