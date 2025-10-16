import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, message } from 'antd';
import apiClient from '../../../api/apiClient';

const { Option } = Select;

const CrearPago = () => {
  const [form] = Form.useForm();
  const [alumnos, setAlumnos] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')) || { IdUsuario: null, rol: null }; // Fallback si no hay usuario

  useEffect(() => {
    apiClient.get('/alumnos')
      .then((response) => {
        console.log('Respuesta de alumnos:', response.data);
        if (Array.isArray(response.data)) {
          setAlumnos(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setAlumnos(response.data.data);
        } else {
          setAlumnos([]);
          message.warning('Formato de datos de alumnos inválido');
        }
      })
      .catch((error) => {
        console.error('Error al cargar alumnos:', error);
        message.error('Error al cargar alumnos');
        setAlumnos([]);
      });

    apiClient.get('/metodopagos')
      .then((response) => {
        console.log('Respuesta de métodos de pago:', response.data);
        if (Array.isArray(response.data)) {
          setMetodosPago(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setMetodosPago(response.data.data);
        } else {
          setMetodosPago([]);
          message.warning('Formato de datos de métodos de pago inválido');
        }
      })
      .catch((error) => {
        console.error('Error al cargar métodos de pago:', error);
        message.error('Error al cargar métodos de pago');
        setMetodosPago([]);
      });
  }, []);

  const onFinish = (values) => {
    if (!user.IdUsuario) {
      message.error('No hay usuario logueado. Por favor, inicia sesión.');
      return;
    }

    const payload = {
      IdColaborador: user.IdUsuario, // Usuario logueado que crea el pago (CreadoPor)
      IdUsuario: user.IdUsuario,     // Quien usa el sistema (requerido por el backend)
      Fecha: values.Fecha.format('YYYY-MM-DD'),
      IdAlumno: values.IdAlumno,
      IdTipoPago: 1, // Ajusta según tu lógica
      Concepto: values.Concepto,
      IdMetodoPago: values.IdMetodoPago,
      Monto: parseFloat(values.Monto), // Asegurar que sea un número
      NumeroRecibo: values.NumeroRecibo || null,
      Estado: true,
    };

    console.log('Payload enviado:', payload); // Depuración

    apiClient.post('/pagos', payload)
      .then((response) => {
        message.success('Pago creado exitosamente');
        form.resetFields();
      })
      .catch((error) => {
        console.error('Error al crear pago:', error.response ? error.response.data : error.message);
        message.error('Error al crear el pago: ' + (error.response?.data?.message || 'Revisa los datos'));
      });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 24 }}>
      <h2>Ingresar Pago</h2>
      <Form form={form} name="createPago" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="Fecha"
          label="Fecha"
          rules={[{ required: true, message: 'Por favor selecciona la fecha' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="IdAlumno"
          label="Alumno"
          rules={[{ required: true, message: 'Por favor selecciona un alumno' }]}
        >
          <Select
            showSearch
            placeholder="Busca un alumno"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onSearch={(value) => {
              apiClient.get(`/alumnos?search=${value}`)
                .then((response) => {
                  console.log('Búsqueda de alumnos:', response.data);
                  if (Array.isArray(response.data)) {
                    setAlumnos(response.data);
                  } else if (response.data && Array.isArray(response.data.data)) {
                    setAlumnos(response.data.data);
                  } else {
                    setAlumnos([]);
                  }
                })
                .catch((error) => {
                  console.error('Error en búsqueda de alumnos:', error);
                  setAlumnos([]);
                });
            }}
          >
            {Array.isArray(alumnos) ? (
              alumnos.map((alumno) => (
                <Option key={alumno.IdAlumno} value={alumno.IdAlumno}>
                  {`${alumno.Nombres} ${alumno.Apellidos}`}
                </Option>
              ))
            ) : (
              <Option disabled>No hay alumnos disponibles</Option>
            )}
          </Select>
        </Form.Item>
        <Form.Item
          name="IdMetodoPago"
          label="Método de Pago"
          rules={[{ required: true, message: 'Por favor selecciona un método' }]}
        >
          <Select placeholder="Selecciona un método de pago">
            {Array.isArray(metodosPago) ? (
              metodosPago.map((metodo) => (
                <Option key={metodo.IdMetodoPago} value={metodo.IdMetodoPago}>
                  {metodo.NombreMetodoPago}
                </Option>
              ))
            ) : (
              <Option disabled>No hay métodos de pago disponibles</Option>
            )}
          </Select>
        </Form.Item>
        <Form.Item
          name="Concepto"
          label="Concepto"
          rules={[{ required: true, message: 'Por favor ingresa el concepto' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="Monto"
          label="Monto"
          rules={[{ required: true, message: 'Por favor ingresa el monto' }]}
        >
          <Input type="number" step="0.01" />
        </Form.Item>
        <Form.Item
          name="NumeroRecibo"
          label="Número de Recibo"
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ background: '#003366', borderColor: '#003366' }}>
            Ingresar Pago
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CrearPago;