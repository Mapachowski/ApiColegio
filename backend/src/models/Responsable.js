const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Familia = require('./Familia'); // Importa el modelo de Familia

const Responsable = sequelize.define('Responsables', {
  IdResponsable: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  NombreResponsable: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  DPI: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  NIT: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  IdFamilia: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Familias', key: 'IdFamilia' },
  },
  EsResponsable: {
    type: DataTypes.BOOLEAN, // Mapea BIT a BOOLEAN en Sequelize
    allowNull: true, // O cambia a false si quieres obligatorio
  },
  Activo: {
    type: DataTypes.TINYINT,
    defaultValue: 1, // Activo por defecto (1 = true, 0 = false en MySQL)
    allowNull: false,
  },
  CreadoPor: DataTypes.INTEGER,
  FechaCreado: DataTypes.DATE,
  ModificadoPor: DataTypes.INTEGER,
  FechaModificado: DataTypes.DATE,
}, {
  tableName: 'Responsables',
  timestamps: false,
});

// Relación
Responsable.belongsTo(Familia, { foreignKey: 'IdFamilia' });

module.exports = Responsable;