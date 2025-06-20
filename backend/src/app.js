const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const sectionsRoutes = require('./routes/sections');
const templatesRoutes = require('./routes/templates');
const pricesRoutes = require('./routes/prices');
const pdfRoutes = require('./routes/pdf');
const ordersRoutes = require('./routes/orders');

const app = express();

// --- Middlewares globales ---
app.use(cors()); // Puedes personalizar el origen en producción
app.use(express.json());

// --- Asegurar carpetas necesarias ---
const coversDir = path.join(__dirname, '../uploads/covers');
const uploadsDir = path.join(__dirname, '../uploads');
const templatesDir = path.join(__dirname, '../templates');
[coversDir, uploadsDir, templatesDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// --- Configuración de Multer para subida de imágenes ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, coversDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// --- Rutas de la API ---
app.use('/api/sections', sectionsRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/prices', pricesRoutes);
// Solo aplica Multer en la ruta que lo necesita
app.use('/api/pdf', (req, res, next) => {
  upload.single('coverImage')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'Error al subir archivo.' });
    } else if (err) {
      return res.status(500).json({ error: 'Error interno de subida.' });
    }
    next();
  });
}, pdfRoutes);
app.use('/api/orders', ordersRoutes);

// --- Servir archivos estáticos ---
app.use('/uploads', express.static(uploadsDir));
app.use('/templates', express.static(templatesDir));

// --- Ruta de prueba ---
app.get('/', (req, res) => {
  res.send('API de Tuu Capricho funcionando!');
});

// --- Manejo de errores global ---
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send('Algo salió mal en el servidor!');
});

// --- Arranque del servidor ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});