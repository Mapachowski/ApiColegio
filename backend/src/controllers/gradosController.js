const Grado = require('../models/Grado'); // Importa el modelo de Grado

// Obtener todos los grados
exports.getAll = async (req, res) => {
  try {
    const grados = await Grado.findAll({ where: { Estado: true } }); // Solo activos
    res.json({ success: true, data: grados });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener un grado por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const grado = await Grado.findByPk(id);
    if (!grado) {
      return res.status(404).json({ success: false, error: 'Grado no encontrado' });
    }
    res.json({ success: true, data: grado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Crear un nuevo grado
exports.create = async (req, res) => {
  try {
    const { IdUsuario } = req.body; // Obtener IdUsuario del body
    if (!IdUsuario || isNaN(IdUsuario)) {
      return res.status(400).json({ success: false, error: 'IdUsuario es requerido y debe ser un número' });
    }
    const nuevoGrado = await Grado.create({
      ...req.body, // Copia los datos del body
      CreadoPor: IdUsuario, // Usar el IdUsuario del body
      FechaCreado: new Date(), // Fecha actual
    });
    res.status(201).json({ success: true, data: nuevoGrado });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Actualizar un grado
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { IdUsuario } = req.body; // Obtener IdUsuario del body
    if (!IdUsuario || isNaN(IdUsuario)) {
      return res.status(400).json({ success: false, error: 'IdUsuario es requerido y debe ser un número' });
    }
    const grado = await Grado.findByPk(id);
    if (!grado) {
      return res.status(404).json({ success: false, error: 'Grado no encontrado' });
    }
    await grado.update({
      ...req.body, // Copia los datos del body
      ModificadoPor: IdUsuario, // Usar el IdUsuario del body
      FechaModificado: new Date(), // Fecha actual
    });
    res.json({ success: true, data: grado });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// "Eliminar" un grado (cambiar Estado a 0)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const { IdUsuario } = req.body; // Obtener IdUsuario del body
    if (!IdUsuario || isNaN(IdUsuario)) {
      return res.status(400).json({ success: false, error: 'IdUsuario es requerido y debe ser un número' });
    }
    const grado = await Grado.findByPk(id);
    if (!grado) {
      return res.status(404).json({ success: false, error: 'Grado no encontrado' });
    }
    await grado.update({
      Estado: false,
      ModificadoPor: IdUsuario, // Usar el IdUsuario del body
      FechaModificado: new Date(), // Fecha actual
    });
    res.json({ success: true, message: 'Grado marcado como inactivo' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};