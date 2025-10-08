const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Alumno = require('./Alumno');
const TipoPago = require('./TipoPago');
const MetodoPago = require('./MetodoPago');

const Pago = sequelize.define('Pagos', {
  IdPago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  IdUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Usuarios', key: 'IdUsuario' },
  },
  IdAlumno: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Alumnos', key: 'IdAlumno' },
  },
  IdTipoPago: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'TiposPago', key: 'IdTipoPago' },
  },
  Concepto: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  IdMetodoPago: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'MetodosPago', key: 'IdMetodoPago' },
  },
  Monto: DataTypes.DECIMAL(10, 2),
  Estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // Activo por defecto
    allowNull: false,
  },
  CreadoPor: DataTypes.INTEGER,
  FechaCreado: DataTypes.DATE,
  ModificadoPor: DataTypes.INTEGER,
  FechaModificado: DataTypes.DATE,
}, {
  tableName: 'Pagos',
  timestamps: false,
});

// Relaciones
Pago.belongsTo(Usuario, { foreignKey: 'IdUsuario' });
Pago.belongsTo(Alumno, { foreignKey: 'IdAlumno' });
Pago.belongsTo(TipoPago, { foreignKey: 'IdTipoPago' });
Pago.belongsTo(MetodoPago, { foreignKey: 'IdMetodoPago' });

module.exports = Pago;