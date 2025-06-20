const express = require('express');
const router = express.Router();
const templatesController = require('../controllers/templatesController');

router.get('/', templatesController.getAllTemplates);
router.get('/:sectionId', templatesController.getTemplatesBySectionId); // Ruta para obtener templates por sección
router.post('/', templatesController.createTemplate);

module.exports = router;