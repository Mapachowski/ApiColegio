const Alumno = require('../models/Alumno');

exports.getAll = async (req, res) => {
  try {
    const alumnos = await Alumno.findAll();
    res.json(alumnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const nuevoAlumno = await Alumno.create(req.body);
    res.status(201).json(nuevoAlumno);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};