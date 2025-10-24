// src/pages/dashboard/Inscripciones/components/Paso1_Alumno.jsx
import React, { useState } from 'react';
import { Form, Input, DatePicker, Select, Button, Space } from 'antd';

const { Option } = Select;

const Paso1_Alumno = ({ state, dispatch }) => {
const { alumno, catalogos } = state; // RECIBIR catalogos

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
      <Form.Item label="Comunidad Lingüística" name="ComunidadLinguistica">
        <Select placeholder="Seleccione">
          <Select.Option value="08">08</Select.Option>
          <Select.Option value="28">28</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Familia">
        <Space.Compact style={{ width: '100%' }}>
          <Select
            placeholder="Familia seleccionada"
            value={alumno.IdFamilia}
            style={{ width: '80%' }}
            disabled
          >
            <Option value={alumno.IdFamilia}>
              {catalogos.familias.find(f => f.IdFamilia === alumno.IdFamilia)?.NombreFamilia || 'Ninguna'}
            </Option>
          </Select>
          <Button
            type="primary"
            onClick={() => dispatch({ type: 'OPEN_MODAL', payload: 'familia' })}
          >
            Familias
          </Button>
        </Space.Compact>
      </Form.Item>
    </Form>
  );
};

export default Paso1_Alumno;