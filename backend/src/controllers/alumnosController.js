const Alumno = require('../models/Alumno');

// Obtener todos los alumnos con estado activo
exports.getAll = async (req, res) => {
  try {
    const alumnos = await Alumno.findAll({ where: { Estado: true } });
    res.json({ success: true, data: alumnos });
  } catch (error) {
    console.error('Error en getAll:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener un alumno por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const alumno = await Alumno.findByPk(id);

    if (!alumno) {
      return res.status(404).json({ success: false, error: 'Alumno no encontrado' });
    }

    res.json({ success: true, data: alumno });
  } catch (error) {
    console.error('Error en getById:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Crear un nuevo alumno
exports.create = async (req, res) => {
  try {
    const { IdColaborador, ComunidadLinguistica } = req.body;

    // Validar IdColaborador
    if (!IdColaborador || !Number.isInteger(Number(IdColaborador))) {
      return res.status(400).json({
        success: false,
        error: 'IdColaborador es requerido y debe ser un número entero'
      });
    }

    // Validar ComunidadLinguistica
    if (!ComunidadLinguistica || !Number.isInteger(Number(ComunidadLinguistica)) || Number(ComunidadLinguistica) <= 0) {
      return res.status(400).json({
        success: false,
        error: 'ComunidadLinguistica es requerida y debe ser un número entero positivo'
      });
    }

    const nuevoAlumno = await Alumno.create({
      ...req.body,
      ComunidadLinguistica: Number(ComunidadLinguistica), // Asegurar tipo entero
      CreadoPor: Number(IdColaborador),
      FechaCreado: new Date(),
    });

    res.status(201).json({ success: true, data: nuevoAlumno });
  } catch (error) {
    console.error('Error en create:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// Actualizar un alumno
exports. update = async (req, res) => {
  try {
    const { id } = req.params;
    const { IdColaborador, ComunidadLinguistica } = req.body;

    // Validar IdColaborador
    if (!IdColaborador || !Number.isInteger(Number(IdColaborador))) {
      return res.status(400).json({
        success: false,
        error: 'IdColaborador es requerido y debe ser un número entero'
      });
    }

    const alumno = await Alumno.findByPk(id);
    if (!alumno) {
      return res.status(404).json({ success: false, error: 'Alumno no encontrado' });
    }

    // Validar ComunidadLinguistica solo si se envía
    if (ComunidadLinguistica !== undefined) {
      if (!Number.isInteger(Number(ComunidadLinguistica)) || Number(ComunidadLinguistica) <= 0) {
        return res.status(400).json({
          success: false,
          error: 'ComunidadLinguistica debe ser un número entero positivo'
        });
      }
    }

    await alumno.update({
      ...req.body,
      ComunidadLinguistica: ComunidadLinguistica ? Number(ComunidadLinguistica) : alumno.ComunidadLinguistica,
      ModificadoPor: Number(IdColaborador),
      FechaModificado: new Date(),
    });

    res.json({ success: true, data: alumno });
  } catch (error) {
    console.error('Error en update:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// "Eliminar" un alumno (cambiar Estado a false)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const { IdColaborador } = req.body;

    if (!IdColaborador || !Number.isInteger(Number(IdColaborador))) {
      return res.status(400).json({
        success: false,
        error: 'IdColaborador es requerido y debe ser un número entero'
      });
    }

    const alumno = await Alumno.findByPk(id);
    if (!alumno) {
      return res.status(404).json({ success: false, error: 'Alumno no encontrado' });
    }

    await alumno.update({
      Estado: false,
      ModificadoPor: Number(IdColaborador),
      FechaModificado: new Date(),
    });

    res.json({ success: true, message: 'Alumno marcado como inactivo' });
  } catch (error) {
    console.error('Error en delete:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};