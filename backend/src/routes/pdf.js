// backend/src/routes/pdf.js

const express = require('express');
const router = express.Router();
// SOLUCIÓN: Usa la desestructuración para importar directamente la función 'generatePdf'.
const { generatePdf } = require('../controllers/pdfController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/* POST /api/pdf/generate */
// Ahora 'generatePdf' es la función en sí, no una propiedad de un objeto.
router.post('/generate', upload.single('coverImage'), generatePdf);

module.exports = router;