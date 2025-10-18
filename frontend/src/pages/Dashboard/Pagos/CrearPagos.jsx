import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, message, Modal } from 'antd';
import apiClient from '../../../api/apiClient';

const { Option } = Select;

const CrearPago = () => {
  const [form] = Form.useForm();
  const [alumnos, setAlumnos] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [tiposPago, setTiposPago] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Estado para el PopUp
  const user = JSON.parse(localStorage.getItem('user')) || { IdUsuario: null, rol: null }; // Fallback si no hay usuario

  useEffect(() => {
    // Cargar alumnos
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
        message.error('Error al cargar alumnos: El servidor devolvió un error 500. Contacta al administrador.');
        setAlumnos([]);
      });

    // Cargar métodos de pago
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

    // Cargar tipos de pago
    apiClient.get('/tipopagos')
      .then((response) => {
        console.log('Respuesta de tipos de pago:', response.data);
        if (Array.isArray(response.data)) {
          setTiposPago(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setTiposPago(response.data.data);
        } else {
          setTiposPago([]);
          message.warning('Formato de datos de tipos de pago inválido');
        }
      })
      .catch((error) => {
        console.error('Error al cargar tipos de pago:', error);
        message.error('Error al cargar tipos de pago: El servidor devolvió un error 500. Contacta al administrador.');
        setTiposPago([]);
      });
  }, []);

  const onFinish = (values) => {
    if (!user.IdUsuario) {
      message.error('No hay usuario logueado. Por favor, inicia sesión.');
      return;
    }

    const payload = {
      IdColaborador: user.IdUsuario,
      IdUsuario: user.IdUsuario,
      Fecha: values.Fecha.format('YYYY-MM-DD'),
      IdAlumno: values.IdAlumno,
      IdTipoPago: values.IdTipoPago,
      Concepto: values.Concepto,
      IdMetodoPago: values.IdMetodoPago,
      Monto: parseFloat(values.Monto),
      NumeroRecibo: values.NumeroRecibo || null,
      Estado: true,
    };

    console.log('Payload enviado:', payload);

    apiClient.post('/pagos', payload)
      .then((response) => {
        console.log('Pago exitoso, mostrando PopUp'); // Depuración
        setIsModalVisible(true); // Mostramos el PopUp
        form.resetFields();
      })
      .catch((error) => {
        console.error('Error al crear pago:', error.response ? error.response.data : error.message);
        message.error('Error al crear el pago: ' + (error.response?.data?.message || 'Revisa los datos'));
      });
  };

  const handleModalOk = () => {
    setIsModalVisible(false); // Cerrar el PopUp al hacer clic en "Aceptar"
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
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Select
              showSearch
              placeholder="Busca por nombre"
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
                    message.error('Error al buscar alumnos: El servidor devolvió un error 500.');
                    setAlumnos([]);
                  });
              }}
              onChange={(value) => {
                const selectedAlumno = alumnos.find((alumno) => alumno.IdAlumno === value);
                console.log('Alumno seleccionado:', selectedAlumno);
                if (selectedAlumno && selectedAlumno.Matricula) {
                  form.setFieldsValue({ Matricula: selectedAlumno.Matricula });
                } else {
                  form.setFieldsValue({ Matricula: undefined });
                }
              }}
              style={{ flex: 2, minWidth: '200px' }}
              value={form.getFieldValue('IdAlumno')} // Aseguramos que refleje el valor del formulario
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
            <Form.Item name="Matricula" noStyle>
              <Select
                showSearch // Permitimos escribir para buscar
                placeholder="Busca por matrícula"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onSearch={(value) => {
                  apiClient.get(`/alumnos?search=${value}`)
                    .then((response) => {
                      console.log('Búsqueda de matrículas:', response.data);
                      if (Array.isArray(response.data)) {
                        setAlumnos(response.data);
                      } else if (response.data && Array.isArray(response.data.data)) {
                        setAlumnos(response.data.data);
                      } else {
                        setAlumnos([]);
                      }
                    })
                    .catch((error) => {
                      console.error('Error en búsqueda de matrículas:', error);
                      message.error('Error al buscar matrículas: El servidor devolvió un error 500.');
                      setAlumnos([]);
                    });
                }}
                value={form.getFieldValue('Matricula')} // Sincroniza con el valor del formulario
                onChange={(value) => {
                  const selectedAlumno = alumnos.find((alumno) => alumno.Matricula === value);
                  console.log('Matrícula seleccionada:', selectedAlumno, 'Valor:', value);
                  if (selectedAlumno && selectedAlumno.IdAlumno) {
                    form.setFieldsValue({ IdAlumno: selectedAlumno.IdAlumno });
                    form.setFields([{ name: 'IdAlumno', value: selectedAlumno.IdAlumno }]);
                    form.resetFields(['IdAlumno']); // Forzamos la actualización visual
                  } else {
                    form.setFieldsValue({ IdAlumno: undefined });
                    message.warning('Matrícula no encontrada. Selecciona un alumno primero.');
                  }
                }}
                style={{ flex: 1, minWidth: '100px' }}
                disabled={!alumnos.length}
              >
                {Array.isArray(alumnos) ? (
                  alumnos.map((alumno) => (
                    <Option key={alumno.Matricula} value={alumno.Matricula}>
                      {alumno.Matricula}
                    </Option>
                  ))
                ) : (
                  <Option disabled>Sin matrícula</Option>
                )}
              </Select>
            </Form.Item>
          </div>
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
          name="IdTipoPago"
          label="Tipo de Pago"
          rules={[{ required: true, message: 'Por favor selecciona un tipo de pago' }]}
        >
          <Select placeholder="Selecciona un tipo de pago">
            {Array.isArray(tiposPago) ? (
              tiposPago.map((tipo) => (
                <Option key={tipo.IdTipoPago} value={tipo.IdTipoPago}>
                  {tipo.NombreTipoPago}
                </Option>
              ))
            ) : (
              <Option disabled>No hay tipos de pago disponibles</Option>
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

      {/* PopUp de éxito */}
      <Modal
        title="Éxito"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        footer={[
          <Button key="ok" type="primary" onClick={handleModalOk} style={{ background: '#003366', borderColor: '#003366' }}>
            Aceptar
          </Button>,
        ]}
      >
        <p>Pago realizado con éxito</p>
      </Modal>
    </div>
  );
};

export default CrearPago;