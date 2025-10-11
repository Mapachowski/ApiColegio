import React from 'react';
import { Layout } from 'antd';
import { Routes, Route } from 'react-router-dom'; // Importa Route y Routes
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Home from '../../components/Home'; // Ajustado desde components
import Preferencias from './Preferencias';
import InscribirEstudiante from './InscribirEstudiante';
import './Dashboard.css';

const { Content } = Layout;

const Dashboard = ({ user }) => {
  // Si no hay usuario, el App.jsx manejará la redirección
  if (!user) return null; // O un mensaje: <div>Acceso denegado</div>

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar user={user} />
      <Layout>
        <Header user={user} />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/preferencias" element={<Preferencias />} />
            <Route path="/inscribir-estudiante" element={<InscribirEstudiante />} />
            {/* Agrega más rutas para otras subopciones a medida que las crees */}
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;