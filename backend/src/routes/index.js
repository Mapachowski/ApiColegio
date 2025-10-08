const express = require('express');
const router = express.Router();

const alumnosRoutes = require('./alumnosRoutes');
const gradosRoutes = require('./gradosRoutes');
const inscripcionesRoutes = require('./inscripcionesRoutes');
const familiasRoutes = require('./familiasRoutes');
const pagosRoutes = require('./pagosRoutes');
const usuariosRoutes = require('./usuariosRoutes');
const responsablesRoutes = require('./responsablesRoutes');

router.use('/alumnos', alumnosRoutes);
router.use('/grados', gradosRoutes);
router.use('/inscripciones', inscripcionesRoutes);
router.use('/familias', familiasRoutes);
router.use('/pagos', pagosRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/responsables', responsablesRoutes);

module.exports = router;