const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rol = sequelize.define('Roles', {
  IdRol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  NombreRol: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'Roles',
  timestamps: false,
});

module.exports = Rol;