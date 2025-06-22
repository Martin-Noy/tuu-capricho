const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pdfController = require('../controllers/pdfController');

// Configura Multer para guardar imágenes de portada
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/covers'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Endpoint real para generar PDF
router.post(
  '/generate',
  upload.single('coverImage'), // 'coverImage' debe coincidir con el nombre en el FormData del frontend
  pdfController.generateAgendaPdf
);

module.exports = router;