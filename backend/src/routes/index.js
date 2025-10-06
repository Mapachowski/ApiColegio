const express = require('express');
const router = express.Router();

// Importa las rutas específicas (por ahora solo tienes alumnosRoutes.js)
const alumnosRoutes = require('./alumnosRoutes');

// Monta las rutas
router.use('/alumnos', alumnosRoutes);

// Exporta el router
module.exports = router;