const express = require('express');
const router = express.Router();

const alumnosRoutes = require('./alumnosRoutes');
const gradosRoutes = require('./gradosRoutes');
const inscripcionesRoutes = require('./inscripcionesRoutes');
const familiasRoutes = require('./familiasRoutes');
const pagosRoutes = require('./pagosRoutes');
const usuariosRoutes = require('./usuariosRoutes');
const responsablesRoutes = require('./responsablesRoutes');
const bitacorasRoutes = require('./bitacorasRoutes');
const jornadasRoutes = require('./jornadasRoutes');
const metodoPagosRoutes = require('./metodoPagosRoutes');
const nivelesRoutes = require('./nivelesRoutes');
const rolesRoutes = require('./rolesRoutes');
const seccionesRoutes = require('./seccionesRoutes');
const tipoPagosRoutes = require('./tipoPagosRoutes');
const loginRoutes = require('./loginRoutes');

router.use('/alumnos', alumnosRoutes);
router.use('/grados', gradosRoutes);
router.use('/inscripciones', inscripcionesRoutes);
router.use('/familias', familiasRoutes);
router.use('/pagos', pagosRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/responsables', responsablesRoutes);
router.use('/bitacoras',bitacorasRoutes);
router.use('/jornadas',jornadasRoutes);
router.use('/metodopagos', metodoPagosRoutes);
router.use('/niveles', nivelesRoutes);
router.use('/roles', rolesRoutes);
router.use('/secciones', seccionesRoutes);
router.use('/tipopagos', tipoPagosRoutes);
router.post('/login', loginRoutes);

module.exports = router;