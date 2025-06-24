import express from 'express';
import { getAvailableSections, createPersonalizedAgenda } from '../controllers/agendaController.js';

const router = express.Router();

// Ruta para obtener la estructura de personalización
// GET /api/sections
router.get('/sections', getAvailableSections);

// Ruta para generar el PDF de la agenda y crear el pedido
// POST /api/generate-agenda
router.post('/generate-agenda', createPersonalizedAgenda);

export default router;