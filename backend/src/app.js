const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const routes = require('./routes/index');

dotenv.config();

const app = express();
app.use(express.json());

// Prueba de conexión a la base de datos
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    await sequelize.sync({ alter: true }); // Sincroniza modelos
    console.log('Modelos sincronizados con la base de datos.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

testConnection();

// Monta las rutas bajo /api
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));