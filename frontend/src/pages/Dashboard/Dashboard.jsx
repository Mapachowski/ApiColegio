import React from 'react';

const Dashboard = ({ user }) => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Bienvenido</h1>
      <p><strong>Nombre:</strong> {user.nombre}</p>
      <p><strong>Rol:</strong> {user.rol === 1 ? 'Administrador' : 'Usuario'}</p>
      {/* Aquí puedes agregar más lógica o contenido según el rol */}
    </div>
  );
};

export default Dashboard;