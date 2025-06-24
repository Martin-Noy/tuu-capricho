const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');
const sequelize = require('./config/sequelize');
const Order = require('./models/Order');

// Carga las variables de entorno
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.SERVER_PORT || 8000;
// __dirname se refiere a /usr/src/app/src, por eso subimos dos niveles
const PDFS_DIR = path.join(__dirname, '..', '..', 'pdfs');

// Endpoint para listar PDFs
app.get('/api/pdfs', async (req, res) => {
  try {
    const files = await fs.readdir(PDFS_DIR);
    res.json({ files: files.filter(f => f.endsWith('.pdf')) });
  } catch (error) {
    console.error('Error al leer el directorio de PDFs:', error);
    res.status(500).send('Error al leer el directorio de PDFs');
  }
});

// Endpoint para previsualizar un PDF
app.get('/api/pdfs/:filename', (req, res) => {
  const { filename } = req.params;
  // Validación de seguridad básica para evitar path traversal
  if (filename.includes('..')) {
      return res.status(400).send('Nombre de archivo no válido.');
  }

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
    
    if (!orderType || !customerDetails || !pdfFilename) {
        return res.status(400).json({ error: "Faltan datos en la petición." });
    }

    const newOrder = await Order.create({
      order_type: orderType,
      customer_details: customerDetails,
      pdf_filename: pdfFilename,
    });
    
    // Aquí se podría integrar la lógica de envío de email para órdenes digitales
    // if (orderType === 'digital') {
    //   await sendEmail(customerDetails.email, pdfFilename);
    // }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(400).json({ error: error.message });
  }
});

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión con la base de datos establecida correctamente.');
        
        await sequelize.sync(); // Sincroniza los modelos con la base de datos
        console.log('Modelos sincronizados con la base de datos.');

        app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('No se pudo conectar a la base de datos:', err);
        process.exit(1); // Termina el proceso si no se puede conectar a la DB
    }
};

startServer();