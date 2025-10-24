const Pago = require('../models/Pago');
const Alumno = require('../models/Alumno');
const Usuario = require('../models/Usuario');
const TipoPago = require('../models/TipoPago');
const MetodoPago = require('../models/MetodoPago');

// Obtener todos los pagos
exports.getAll = async (req, res) => {
  try {
    const pagos = await Pago.findAll({
      where: { Estado: true },
      include: [
        { model: Alumno, attributes: ['IdAlumno', 'Nombres', 'Apellidos'] },
        { model: Usuario, attributes: ['IdUsuario', 'NombreUsuario'] },
        { model: TipoPago, attributes: ['IdTipoPago', 'NombreTipoPago'] },
        { model: MetodoPago, attributes: ['IdMetodoPago', 'NombreMetodoPago'] },
      ],
    });
    res.json({ success: true, data: pagos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener un pago por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const pago = await Pago.findByPk(id, {
      include: [
        { model: Alumno, attributes: ['IdAlumno', 'Nombres', 'Apellidos'] },
        { model: Usuario, attributes: ['IdUsuario', 'NombreUsuario'] },
        { model: TipoPago, attributes: ['IdTipoPago', 'NombreTipoPago'] },
        { model: MetodoPago, attributes: ['IdMetodoPago', 'NombreMetodoPago'] },
      ],
    });
    if (!pago) {
      return res.status(404).json({ success: false, error: 'Pago no encontrado' });
    }
    res.json({ success: true, data: pago });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener pagos por NumeroRecibo
exports.getByNumeroRecibo = async (req, res) => {
  try {
    const { numero } = req.params;
    const pagos = await Pago.findAll({
      where: {
        NumeroRecibo: numero,
        Estado: true,
      },
      include: [
        { model: Alumno, attributes: ['IdAlumno', 'Nombres', 'Apellidos'] },
        { model: Usuario, attributes: ['IdUsuario', 'NombreUsuario'] },
        { model: TipoPago, attributes: ['IdTipoPago', 'NombreTipoPago'] },
        { model: MetodoPago, attributes: ['IdMetodoPago', 'NombreMetodoPago'] },
      ],
    });
    if (!pagos || pagos.length === 0) {
      return res.status(404).json({ success: false, error: 'No se encontraron pagos con ese número de recibo' });
    }
    res.json({ success: true, data: pagos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Crear un nuevo pago
exports.create = async (req, res) => {
  try {
    const { IdColaborador, Fecha, IdUsuario, IdAlumno, IdTipoPago, Concepto, IdMetodoPago, Monto, NumeroRecibo } = req.body;

    // Validar campos requeridos
    if (!IdColaborador || isNaN(IdColaborador)) {
      return res.status(400).json({ success: false, error: 'IdColaborador es requerido y debe ser un número' });
    }
    if (!Fecha) {
      return res.status(400).json({ success: false, error: 'Fecha es requerida' });
    }
    if (!IdUsuario || isNaN(IdUsuario)) {
      return res.status(400).json({ success: false, error: 'IdUsuario es requerido y debe ser un número' });
    }
    if (!IdAlumno || isNaN(IdAlumno)) {
      return res.status(400).json({ success: false, error: 'IdAlumno es requerido y debe ser un número' });
    }
    if (!IdTipoPago || isNaN(IdTipoPago)) {
      return res.status(400).json({ success: false, error: 'IdTipoPago es requerido y debe ser un número' });
    }
    if (!Concepto) {
      return res.status(400).json({ success: false, error: 'Concepto es requerido' });
    }
    if (!IdMetodoPago || isNaN(IdMetodoPago)) {
      return res.status(400).json({ success: false, error: 'IdMetodoPago es requerido y debe ser un número' });
    }
    if (!Monto || isNaN(Monto)) {
      return res.status(400).json({ success: false, error: 'Monto es requerido y debe ser un número' });
    }

    const nuevoPago = await Pago.create({
      Fecha,
      IdUsuario,
      IdAlumno,
      IdTipoPago,
      Concepto,
      IdMetodoPago,
      Monto,
      NumeroRecibo,
      Estado: true,
      CreadoPor: IdColaborador,
      FechaCreado: new Date(),
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
    const { IdColaborador, Fecha, IdUsuario, IdAlumno, IdTipoPago, Concepto, IdMetodoPago, Monto, NumeroRecibo, Estado } = req.body;

    // Validar IdColaborador
    if (!IdColaborador || isNaN(IdColaborador)) {
      return res.status(400).json({ success: false, error: 'IdColaborador es requerido y debe ser un número' });
    }

    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({ success: false, error: 'Pago no encontrado' });
    }

    await pago.update({
      Fecha: Fecha || pago.Fecha,
      IdUsuario: IdUsuario || pago.IdUsuario,
      IdAlumno: IdAlumno || pago.IdAlumno,
      IdTipoPago: IdTipoPago || pago.IdTipoPago,
      Concepto: Concepto || pago.Concepto,
      IdMetodoPago: IdMetodoPago || pago.IdMetodoPago,
      Monto: Monto !== undefined ? Monto : pago.Monto,
      NumeroRecibo: NumeroRecibo !== undefined ? NumeroRecibo : pago.NumeroRecibo,
      Estado: Estado !== undefined ? Estado : pago.Estado,
      ModificadoPor: IdColaborador,
      FechaModificado: new Date(),
    });

    res.json({ success: true, data: pago });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// "Eliminar" un pago (cambiar Estado a false)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const { IdColaborador } = req.body;

    // Validar IdColaborador
    if (!IdColaborador || isNaN(IdColaborador)) {
      return res.status(400).json({ success: false, error: 'IdColaborador es requerido y debe ser un número' });
    }

    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({ success: false, error: 'Pago no encontrado' });
    }

    await pago.update({
      Estado: false,
      ModificadoPor: IdColaborador,
      FechaModificado: new Date(),
    });

    res.json({ success: true, message: 'Pago marcado como inactivo' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};