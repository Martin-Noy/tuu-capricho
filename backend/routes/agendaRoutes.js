import express from 'express';
import { getAvailableSections, createPersonalizedAgenda, previewPersonalizedAgenda } from '../controllers/agendaController.js';
import { getAllProducts } from '../controllers/productController.js';

const router = express.Router();

// Ruta para obtener la estructura de personalización
// GET /api/sections
router.get('/sections', getAvailableSections);
router.get('/products', getAllProducts);

// Ruta para previsualizar la agenda personalizada
// POST /api/preview-agenda
router.post('/preview-agenda', previewPersonalizedAgenda);

// Ruta para generar el PDF de la agenda y crear el pedido
// POST /api/generate-agenda
router.post('/generate-agenda', createPersonalizedAgenda);

export default router;