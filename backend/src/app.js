const express = require('express');
const cors = require('cors');
const multer = require('multer'); // Para subida de archivos
const path = require('path');
require('dotenv').config(); // Cargar variables de entorno

const sectionsRoutes = require('./routes/sections'); //
const templatesRoutes = require('./routes/templates'); //
const pricesRoutes = require('./routes/prices'); //
const pdfRoutes = require('./routes/pdf'); //
const ordersRoutes = require('./routes/orders'); //

const app = express(); //

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend de React
app.use(express.json()); // Para parsear JSON en el cuerpo de las peticiones

// Configuración de Multer para la subida de imágenes (carátulas)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Asegúrate de que esta carpeta exista en tu servidor
    cb(null, path.join(__dirname, '../uploads/covers'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage }); //

// Rutas de la API
app.use('/api/sections', sectionsRoutes); //
app.use('/api/templates', templatesRoutes); // Nueva ruta para templates
app.use('/api/prices', pricesRoutes); // Nueva ruta para precios
app.use('/api/pdf', upload.single('coverImage'), pdfRoutes); // Middleware de Multer aquí
app.use('/api/orders', ordersRoutes); // Nueva ruta para pedidos

// Servir archivos estáticos (ej. PDFs de templates, imágenes de carátulas subidas)
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); //
app.use('/templates', express.static(path.join(__dirname, '../templates'))); // Si tienes PDFs de templates predefinidos

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Tuu Capricho funcionando!');
});

// Manejo de errores (opcional, pero recomendado)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal en el servidor!');
});

const PORT = process.env.PORT || 3001; //
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});