// src/pages/dashboard/Inscripciones/Inscripciones.jsx
import React, { useState } from 'react';
import { Card, Steps, Button, Modal, Radio, Space, Spin } from 'antd';
import { useInscripcionForm } from './hooks/useInscripcionForm';
import Paso1_Alumno from './components/Paso1_Alumno';
import Paso2_Inscripcion from './components/Paso2_Inscripcion';
import Paso3_Pago from './components/Paso3_Pago';
import PopUpInicial from './components/PopUpInicial';
import BuscarAlumnoModal from './components/BuscarAlumnoModal';
import FamiliaModal from './components/FamiliaModal';

const { Step } = Steps;

const Inscripciones = () => {
  const { state, dispatch } = useInscripcionForm();
  const { modales } = state;
  const { paso, modo, catalogos, loading } = state;
  const [buscarOpen, setBuscarOpen] = useState(false);
  const [familiaOpen, setFamiliaOpen] = useState(false);

const steps = [
  // Solo mostrar Paso 1 si es "nuevo"
  ...(modo === 'nuevo'
    ? [{
        title: 'Información del Alumno',
        content: <Paso1_Alumno state={state} dispatch={dispatch} />
      }]
    : []
  ),
  {
    title: 'Datos de Inscripción',
    content: <Paso2_Inscripcion state={state} dispatch={dispatch} />
  },
  {
    title: 'Pago de Inscripción y Enero',
    content: <Paso3_Pago state={state} dispatch={dispatch} />
  },
];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" />
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <h2>Inscripción de Alumno</h2>

      <PopUpInicial
        open={!modo}
        onOk={(value) => {
          dispatch({ type: 'SET_MODO', payload: value });
          if (value === 'reinscribir') {
            dispatch({ type: 'OPEN_MODAL', payload: 'buscarAlumno' });
          }
        }}
      />
      <BuscarAlumnoModal
        open={modales.buscarAlumno}
        state={state}
        dispatch={dispatch}
        onCancel={() => dispatch({ type: 'CLOSE_MODAL', payload: 'buscarAlumno' })}
      />

      <FamiliaModal
        open={modales.familia}
        state={state}
        dispatch={dispatch}
        onSelect={(familia) => {
          dispatch({
            type: 'UPDATE_ALUMNO',
            payload: {
              IdFamilia: familia.IdFamilia,
              // Si quieres mostrar el nombre:
              NombreFamilia: familia.NombreFamilia
            }
          });
          dispatch({ type: 'CLOSE_MODAL', payload: 'familia' });
        }}
        onCancel={() => dispatch({ type: 'CLOSE_MODAL', payload: 'familia' })}
      />
      {modo && (
        <>
          <Steps current={paso} style={{ marginBottom: 24 }}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>

          <Card>{steps[paso].content}</Card>

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            {paso > 0 && (
              <Button style={{ marginRight: 8 }} onClick={() => dispatch({ type: 'PREV_STEP' })}>
                Atrás
              </Button>
            )}
            {paso < steps.length - 1 && (
              <Button type="primary" onClick={() => dispatch({ type: 'NEXT_STEP' })}>
                Siguiente
              </Button>
            )}
            {paso === steps.length - 1 && (
              <Button type="primary" style={{ background: '#003366', borderColor: '#003366' }}>
                Finalizar Inscripción
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Inscripciones;