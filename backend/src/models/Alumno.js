const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Familia = require('./Familia');

const Alumno = sequelize.define('Alumnos', {
  IdAlumno: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Matricula: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  Nombres: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Apellidos: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  FechaNacimiento: DataTypes.DATE,
  Genero: DataTypes.STRING(50),
  IdFamilia: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Familias', key: 'IdFamilia' },
  },
  Estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, 
    allowNull: false,
  },
  CreadoPor: DataTypes.INTEGER,
  FechaCreado: DataTypes.DATE,
  ModificadoPor: DataTypes.INTEGER,
  FechaModificado: DataTypes.DATE,
}, {
  tableName: 'Alumnos',
  timestamps: false,
});

// Relación
Alumno.belongsTo(Familia, { foreignKey: 'IdFamilia' });

module.exports = Alumno;