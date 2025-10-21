// src/pages/dashboard/Inscripciones/Inscripciones.jsx
import React, { useState } from 'react';
import { Card, Steps, Button, Modal, Radio, Space } from 'antd';
import Paso1_Alumno from './components/Paso1_Alumno';
import Paso2_Inscripcion from './components/Paso2_Inscripcion';
import Paso3_Pago from './components/Paso3_Pago';
import PopUpInicial from './components/PopUpInicial';

const { Step } = Steps;

const Inscripciones = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [modo, setModo] = useState(null); // 'nuevo' o 'reinscribir'

  const handleModalOk = (value) => {
    setModo(value);
    setIsModalOpen(false);
  };

  const next = () => setCurrentStep(currentStep + 1);
  const prev = () => setCurrentStep(currentStep - 1);

  const steps = [
    { title: 'Información del Alumno', content: <Paso1_Alumno /> },
    { title: 'Datos de Inscripción', content: <Paso2_Inscripcion /> },
    { title: 'Pago de Inscripción y Enero', content: <Paso3_Pago /> },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <h2>Inscripción de Alumno</h2>

      {/* PopUp inicial */}
      <PopUpInicial open={isModalOpen} onOk={handleModalOk} />

      {/* Solo mostrar si ya eligió modo */}
      {!isModalOpen && modo && (
        <>
          <Steps current={currentStep} style={{ marginBottom: 24 }}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>

          <Card>
            {steps[currentStep].content}
          </Card>

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            {currentStep > 0 && (
              <Button style={{ marginRight: 8 }} onClick={prev}>
                Atrás
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Siguiente
              </Button>
            )}
            {currentStep === steps.length - 1 && (
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