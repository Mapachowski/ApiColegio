const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController'); // Importa el controlador

// Rutas para pagos
router.get('/', pagosController.getAll);          // GET /api/pagos
router.get('/:id', pagosController.getById);      // GET /api/pagos/:id
router.post('/', pagosController.create);         // POST /api/pagos
router.put('/:id', pagosController.update);       // PUT /api/pagos/:id
router.delete('/:id', pagosController.delete);    // DELETE /api/pagos/:id

module.exports = router;