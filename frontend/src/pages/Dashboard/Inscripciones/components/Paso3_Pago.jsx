// src/pages/dashboard/Inscripciones/components/Paso3_Pago.jsx
import React from 'react';
import { Form, Input, Checkbox } from 'antd';

const Paso3_Pago = ({ state, dispatch }) => {
  const { inscripcion, pago } = state;

  return (
    <Form layout="vertical">
      <Form.Item>
        <Checkbox
          checked={pago.pagarInscripcion}
          onChange={(e) =>
            dispatch({
              type: 'UPDATE_PAGO',
              payload: { pagarInscripcion: e.target.checked },
            })
          }
        >
          Pagar inscripción ahora
        </Checkbox>
      </Form.Item>

      <Form.Item>
        <Checkbox
          checked={pago.pagarEnero}
          onChange={(e) =>
            dispatch({
              type: 'UPDATE_PAGO',
              payload: { pagarEnero: e.target.checked },
            })
          }
        >
          Pagar enero ahora
        </Checkbox>
      </Form.Item>

      <Form.Item label="Pago de Enero">
        <Input
          value={`Q ${inscripcion.Mensualidad?.toFixed(2) || '0.00'}`}
          readOnly
          style={{ color: '#003366', fontWeight: 'bold' }}
        />
      </Form.Item>

      <Form.Item label="Número de Recibo (común para ambos pagos)">
        <Input
          placeholder="Ej: REC-2025-001"
          value={pago.NumeroRecibo}
          onChange={(e) =>
            dispatch({
              type: 'UPDATE_PAGO',
              payload: { NumeroRecibo: e.target.value },
            })
          }
        />
      </Form.Item>

      <p>
        <strong>Se generarán 2 pagos automáticamente:</strong>
        <br />
        • Pago de inscripción
        <br />
        • Pago de enero (mensualidad)
      </p>
    </Form>
  );
};

export default Paso3_Pago;