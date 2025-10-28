// src/pages/dashboard/Inscripciones/components/Paso2_Inscripcion.jsx
import React from 'react';
import { Form, Input, Select, DatePicker } from 'antd';

const Paso2_Inscripcion = () => {
  return (
    <Form layout="vertical">
      <Form.Item label="Carnet"><Input readOnly /></Form.Item>
      <Form.Item label="Nombre Completo"><Input readOnly /></Form.Item>
      <Form.Item label="Grado">
        <Select placeholder="Seleccione grado" />
      </Form.Item>
      <Form.Item label="Sección">
        <Select placeholder="Seleccione sección" />
      </Form.Item>
      <Form.Item label="Jornada">
        <Select placeholder="Seleccione jornada" />
      </Form.Item>
      <Form.Item label="Ciclo Escolar">
        <Input value="2026" readOnly />
      </Form.Item>
      <Form.Item label="Fecha de Inscripción">
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
    </Form>
  );
};

export default Paso2_Inscripcion;