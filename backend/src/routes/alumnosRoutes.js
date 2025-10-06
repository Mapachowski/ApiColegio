const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Lista de alumnos (prueba)' });
});

module.exports = router;