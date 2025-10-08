const Inscripcion = require('../models/Inscripcion'); // Importa el modelo de Inscripcion

// Obtener todas las inscripciones
exports.getAll = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.findAll({ where: { Estado: true } }); // Solo activos
    res.json({ success: true, data: inscripciones });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener una inscripción por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const inscripcion = await Inscripcion.findByPk(id);
    if (!inscripcion) {
      return res.status(404).json({ success: false, error: 'Inscripción no encontrada' });
    }
    res.json({ success: true, data: inscripcion });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Crear una nueva inscripción
exports.create = async (req, res) => {
  try {
    const { IdUsuario } = req.body; // Obtener IdUsuario del body
    if (!IdUsuario || isNaN(IdUsuario)) {
      return res.status(400).json({ success: false, error: 'IdUsuario es requerido y debe ser un número' });
    }
    const nuevaInscripcion = await Inscripcion.create({
      ...req.body, // Copia los datos del body
      CreadoPor: IdUsuario, // Usar el IdUsuario del body
      FechaCreado: new Date(), 
    });
    res.status(201).json({ success: true, data: nuevaInscripcion });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Actualizar una inscripción
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { IdUsuario } = req.body; // Obtener IdUsuario del body
    if (!IdUsuario || isNaN(IdUsuario)) {
      return res.status(400).json({ success: false, error: 'IdUsuario es requerido y debe ser un número' });
    }
    const inscripcion = await Inscripcion.findByPk(id);
    if (!inscripcion) {
      return res.status(404).json({ success: false, error: 'Inscripción no encontrada' });
    }
    await inscripcion.update({
      ...req.body, // Copia los datos del body
      ModificadoPor: IdUsuario, // Usar el IdUsuario del body
      FechaModificado: new Date(), // Fecha actual
    });
    res.json({ success: true, data: inscripcion });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// "Eliminar" una inscripción (cambiar Estado a 0)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const { IdUsuario } = req.body; // Obtener IdUsuario del body
    if (!IdUsuario || isNaN(IdUsuario)) {
      return res.status(400).json({ success: false, error: 'IdUsuario es requerido y debe ser un número' });
    }
    const inscripcion = await Inscripcion.findByPk(id);
    if (!inscripcion) {
      return res.status(404).json({ success: false, error: 'Inscripción no encontrada' });
    }
    await inscripcion.update({
      Estado: false,
      ModificadoPor: IdUsuario, // Usar el IdUsuario del body
      FechaModificado: new Date(), // Fecha actual
    });
    res.json({ success: true, message: 'Inscripción marcada como inactiva' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};