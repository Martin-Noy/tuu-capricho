// backend/src/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');
const sequelize = require('./config/sequelize');
const Order = require('./models/order');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.SERVER_PORT || 8000;
const PDFS_DIR = path.join(__dirname, '..', 'pdfs');

// Endpoint para listar PDFs
app.get('/api/pdfs', async (req, res) => {
  try {
    const files = await fs.readdir(PDFS_DIR);
    res.json({ files });
  } catch (error) {
    res.status(500).send('Error al leer el directorio de PDFs');
  }
});

// Endpoint para previsualizar un PDF
app.get('/api/pdfs/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(PDFS_DIR, filename);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  res.sendFile(filePath, (err) => {
      if (err) {
          res.status(404).send('Archivo no encontrado');
      }
  });
});

// Endpoint para crear una orden
app.post('/api/orders', async (req, res) => {
  try {
    const { orderType, customerDetails, pdfFilename } = req.body;
    // Aquí iría la validación de datos
    
    const newOrder = await Order.create({
      order_type: orderType,
      customer_details: customerDetails,
      pdf_filename: pdfFilename,
    });
    
    // Si es digital, aquí se llamaría al servicio de email
    // await emailService.sendPdfByEmail(...)

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Sincronizar con la DB e iniciar servidor
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}).catch(err => {
  console.error('No se pudo conectar a la base de datos:', err);
});
