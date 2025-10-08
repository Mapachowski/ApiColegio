const Pago = require('../models/Pago'); // Importa el modelo de Pago

// Obtener todos los pagos
exports.getAll = async (req, res) => {
  try {
    const pagos = await Pago.findAll({ where: { Estado: true } }); // Solo activos
    res.json({ success: true, data: pagos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener un pago por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({ success: false, error: 'Pago no encontrado' });
    }
    res.json({ success: true, data: pago });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Crear un nuevo pago
exports.create = async (req, res) => {
  try {
    const { IdUsuario } = req.body; // Obtener IdUsuario del body
    if (!IdUsuario || isNaN(IdUsuario)) {
      return res.status(400).json({ success: false, error: 'IdUsuario es requerido y debe ser un número' });
    }
    const nuevoPago = await Pago.create({
      ...req.body, // Copia los datos del body
      CreadoPor: IdUsuario, // Usar el IdUsuario del body
      FechaCreado: new Date(), // Fecha actual (05:31 PM CST, 07/10/2025)
    });
    res.status(201).json({ success: true, data: nuevoPago });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Actualizar un pago
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { IdUsuario } = req.body; // Obtener IdUsuario del body
    if (!IdUsuario || isNaN(IdUsuario)) {
      return res.status(400).json({ success: false, error: 'IdUsuario es requerido y debe ser un número' });
    }
    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({ success: false, error: 'Pago no encontrado' });
    }
    await pago.update({
      ...req.body, // Copia los datos del body
      ModificadoPor: IdUsuario, // Usar el IdUsuario del body
      FechaModificado: new Date(), // Fecha actual
    });
    res.json({ success: true, data: pago });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// "Eliminar" un pago (cambiar Estado a 0)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const { IdUsuario } = req.body; // Obtener IdUsuario del body
    if (!IdUsuario || isNaN(IdUsuario)) {
      return res.status(400).json({ success: false, error: 'IdUsuario es requerido y debe ser un número' });
    }
    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({ success: false, error: 'Pago no encontrado' });
    }
    await pago.update({
      Estado: false,
      ModificadoPor: IdUsuario, // Usar el IdUsuario del body
      FechaModificado: new Date(), // Fecha actual
    });
    res.json({ success: true, message: 'Pago marcado como inactivo' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};