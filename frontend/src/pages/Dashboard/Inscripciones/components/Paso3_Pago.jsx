// src/pages/dashboard/Inscripciones/components/Paso3_Pago.jsx
import React from 'react';
import { Form, Input, Checkbox } from 'antd';

const Paso3_Pago = () => {
  return (
    <Form layout="vertical">
      <Form.Item>
        <Checkbox>Pagar inscripción ahora</Checkbox>
      </Form.Item>
      <Form.Item>
        <Checkbox>Pagar enero ahora</Checkbox>
      </Form.Item>
      <Form.Item label="Número de Recibo (común para ambos pagos)">
        <Input placeholder="Ej: REC-2025-001" />
      </Form.Item>
      <p><strong>Se generarán 2 pagos automáticamente:</strong><br />
         • Pago de inscripción<br />
         • Pago de enero (mensualidad)</p>
    </Form>
  );
};

export default Paso3_Pago;