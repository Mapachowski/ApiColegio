// src/pages/dashboard/Inscripciones/components/Paso1_Alumno.jsx
import React from 'react';
import { Form, Input, DatePicker, Select, Button, Space } from 'antd';

const Paso1_Alumno = () => {
  return (
    <Form layout="vertical">
      <Form.Item label="Carnet">
        <Input placeholder="Ej: 2025001" />
      </Form.Item>
      <Form.Item label="Matrícula">
        <Input placeholder="Ej: MAT-2025-001" />
      </Form.Item>
      <Form.Item label="Nombres">
        <Input />
      </Form.Item>
      <Form.Item label="Apellidos">
        <Input />
      </Form.Item>
      <Form.Item label="Fecha de Nacimiento">
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="Género">
        <Select placeholder="Seleccione">
          <Select.Option value="M">Masculino</Select.Option>
          <Select.Option value="F">Femenino</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Comunidad Lingüística">
        <Select placeholder="Seleccione">
          <Select.Option value="08">08</Select.Option>
          <Select.Option value="28">28</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Familia">
        <Space.Compact style={{ width: '100%' }}>
          <Select placeholder="Buscar familia" style={{ width: '80%' }} />
          <Button type="primary">Familias</Button>
        </Space.Compact>
      </Form.Item>
    </Form>
  );
};

export default Paso1_Alumno;