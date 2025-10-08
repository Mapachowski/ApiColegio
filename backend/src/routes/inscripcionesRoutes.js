const express = require('express');
const router = express.Router();
const inscripcionesController = require('../controllers/inscripcionesController'); // Importa el controlador

// Rutas para inscripciones
router.get('/', inscripcionesController.getAll);          // GET /api/inscripciones
router.get('/:id', inscripcionesController.getById);      // GET /api/inscripciones/:id
router.post('/', inscripcionesController.create);         // POST /api/inscripciones
router.put('/:id', inscripcionesController.update);       // PUT /api/inscripciones/:id
router.delete('/:id', inscripcionesController.delete);    // DELETE /api/inscripciones/:id

module.exports = router;