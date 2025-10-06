const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MetodoPago = sequelize.define('MetodosPago', {
  IdMetodoPago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  NombreMetodoPago: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'MetodosPago',
  timestamps: false,
});

module.exports = MetodoPago;