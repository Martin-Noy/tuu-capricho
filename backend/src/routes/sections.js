const express = require('express');
const router = express.Router();
const sectionsController = require('../controllers/sectionsController');

router.get('/', sectionsController.getAllSections);
router.post('/', sectionsController.createSection);
// Añade rutas para PUT y DELETE si las necesitas
// router.put('/:id', sectionsController.updateSection);
// router.delete('/:id', sectionsController.deleteSection);

module.exports = router;