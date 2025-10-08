const Responsable = require('../models/Responsable'); // Importa el modelo de Responsable
const Familia = require('../models/Familia'); // Importa el modelo de Familia

// Obtener todos los responsables
exports.getAll = async (req, res) => {
  try {
    const responsables = await Responsable.findAll({ where: { Activo: 1 }, include: [Familia] }); // Solo activos, con familias
    res.json({ success: true, data: responsables });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener un responsable por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const responsable = await Responsable.findByPk(id, { include: [Familia] });
    if (!responsable) {
      return res.status(404).json({ success: false, error: 'Responsable no encontrado' });
    }
    res.json({ success: true, data: responsable });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Crear un nuevo responsable
exports.create = async (req, res) => {
  try {
    const { IdUsuario } = req.body; // Obtener IdUsuario del body
    if (!IdUsuario || isNaN(IdUsuario)) {
      return res.status(400).json({ success: false, error: 'IdUsuario es requerido y debe ser un número' });
    }
    const nuevoResponsable = await Responsable.create({
      ...req.body, // Copia los datos del body, incluyendo EsResponsable
      CreadoPor: IdUsuario, // Usar el IdUsuario del body
      FechaCreado: new Date(), // Fecha actual (10:26 PM CST, 07/10/2025)
    });
    res.status(201).json({ success: true, data: nuevoResponsable });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Actualizar un responsable
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { IdUsuario } = req.body; // Obtener IdUsuario del body
    if (!IdUsuario || isNaN(IdUsuario)) {
      return res.status(400).json({ success: false, error: 'IdUsuario es requerido y debe ser un número' });
    }
    const responsable = await Responsable.findByPk(id);
    if (!responsable) {
      return res.status(404).json({ success: false, error: 'Responsable no encontrado' });
    }
    await responsable.update({
      ...req.body, // Copia los datos del body, incluyendo EsResponsable
      ModificadoPor: IdUsuario, // Usar el IdUsuario del body
      FechaModificado: new Date(), // Fecha actual
    });
    res.json({ success: true, data: responsable });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// "Eliminar" un responsable (cambiar Activo a 0)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const { IdUsuario } = req.body; // Obtener IdUsuario del body
    if (!IdUsuario || isNaN(IdUsuario)) {
      return res.status(400).json({ success: false, error: 'IdUsuario es requerido y debe ser un número' });
    }
    const responsable = await Responsable.findByPk(id);
    if (!responsable) {
      return res.status(404).json({ success: false, error: 'Responsable no encontrado' });
    }
    await responsable.update({
      Activo: 0,
      ModificadoPor: IdUsuario, // Usar el IdUsuario del body
      FechaModificado: new Date(), // Fecha actual
    });
    res.json({ success: true, message: 'Responsable marcado como inactivo' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};