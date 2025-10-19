import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, message, Modal, Table } from 'antd';
import apiClient from '../../../api/apiClient';

const { Option } = Select;

const CrearPago = () => {
  const [form] = Form.useForm();
  const [alumnos, setAlumnos] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [tiposPago, setTiposPago] = useState([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); // Usamos open en lugar de visible
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Usamos open en lugar de visible
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [cicloEscolar, setCicloEscolar] = useState('2026'); // Ajustado a octubre 2025 como inicio del ciclo 2026
  const [alumnoData, setAlumnoData] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Para forzar re-renderizado
  const user = JSON.parse(localStorage.getItem('user')) || { IdUsuario: null, rol: null };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alumnosResponse, metodosPagoResponse, tiposPagoResponse] = await Promise.all([
          apiClient.get('/alumnos'),
          apiClient.get('/metodopagos'),
          apiClient.get('/tipopagos'),
        ]);

        // Procesar cada respuesta individualmente
        if (alumnosResponse.data) {
          console.log('Respuesta de alumnos:', alumnosResponse.data);
          if (Array.isArray(alumnosResponse.data)) {
            setAlumnos(alumnosResponse.data);
          } else if (alumnosResponse.data && Array.isArray(alumnosResponse.data.data)) {
            setAlumnos(alumnosResponse.data.data);
          } else {
            setAlumnos([]);
            message.warning('Formato de datos de alumnos inválido');
          }
        }

        if (metodosPagoResponse.data) {
          console.log('Respuesta de métodos de pago:', metodosPagoResponse.data);
          if (Array.isArray(metodosPagoResponse.data)) {
            setMetodosPago(metodosPagoResponse.data);
          } else if (metodosPagoResponse.data && Array.isArray(metodosPagoResponse.data.data)) {
            setMetodosPago(metodosPagoResponse.data.data);
          } else {
            setMetodosPago([]);
            message.warning('Formato de datos de métodos de pago inválido');
          }
        }

        if (tiposPagoResponse.data) {
          console.log('Respuesta de tipos de pago:', tiposPagoResponse.data);
          if (Array.isArray(tiposPagoResponse.data)) {
            setTiposPago(tiposPagoResponse.data);
          } else if (tiposPagoResponse.data && Array.isArray(tiposPagoResponse.data.data)) {
            setTiposPago(tiposPagoResponse.data.data);
          } else {
            setTiposPago([]);
            message.warning('Formato de datos de tipos de pago inválido');
          }
        }
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        if (error.response?.status === 500) {
          message.error('Error 500 al cargar datos: Verifica el backend. Algunos datos pueden no estar disponibles.');
        } else {
          message.error('Error al cargar datos: Revisa la conexión.');
        }
      }
    };

    fetchData();
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
        console.log('Pago exitoso, mostrando PopUp de éxito');
        setIsSuccessModalOpen(true); // Mostramos el PopUp de éxito
        form.resetFields();
      })
      .catch((error) => {
        console.error('Error al crear pago:', error.response ? error.response.data : error.message);
        message.error('Error al crear el pago: ' + (error.response?.data?.message || 'Revisa los datos'));
      });
  };

  const handleSearchModalOk = () => {
    setIsSearchModalOpen(false);
  };

  const handleSuccessModalOk = () => {
    setIsSuccessModalOpen(false);
  };

  const handleSearchAlumno = () => {
    if (!selectedAlumno) {
      message.warning('Por favor selecciona un alumno.');
      return;
    }
    apiClient.get(`/inscripciones/buscar-alumno?IdAlumno=${selectedAlumno}&CicloEscolar=${cicloEscolar}`)
      .then((response) => {
        console.log('Respuesta de búsqueda de alumno:', response.data);
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          setAlumnoData(response.data.data);
        } else {
          setAlumnoData([]);
          message.warning('No se encontraron datos para el alumno.');
        }
      })
      .catch((error) => {
        console.error('Error al buscar alumno:', error);
        message.error('Error al buscar alumno: ' + (error.response?.status === 404 ? 'Endpoint no encontrado. Verifica la URL.' : 'El servidor devolvió un error.'));
        setAlumnoData([]);
      });
  };

  const handleRowDoubleClick = (record) => {
    console.log('Doble clic en:', record); // Depuración
    const montoValue = parseFloat(record[0].Mensualidad) || 0; // Aseguramos un número
    console.log('Valor asignado a Monto:', montoValue); // Depuración adicional
    form.setFieldsValue({
      IdAlumno: record[0].IdAlumno,
      Nombres: `${record[0].Nombres} ${record[0].Apellidos}`, // Mostrado como texto no editable
      Monto: montoValue, // Asignamos el número
    });
    // Forzamos la actualización del campo Monto
    setTimeout(() => {
      form.setFieldsValue({ Monto: montoValue });
      form.validateFields(['Monto']); // Validamos el campo
      console.log('Valor de Monto en formulario:', form.getFieldValue('Monto')); // Depuración
      setRefreshTrigger((prev) => prev + 1); // Forzar re-renderizado
    }, 0);
    setIsSearchModalOpen(false); // Cerramos el PopUp de búsqueda
  };

  const columns = [
    { title: 'Carnet', dataIndex: ['0', 'IdAlumno'], key: 'IdAlumno', width: 120 }, // Aumentamos el tamaño de Carnet
    { title: 'Matrícula', dataIndex: ['0', 'Matricula'], key: 'Matricula' },
    { title: 'Nombres', dataIndex: ['0', 'Nombres'], key: 'Nombres', width: 150 },
    { title: 'Apellidos', dataIndex: ['0', 'Apellidos'], key: 'Apellidos', width: 150 },
    { title: 'Grado', dataIndex: ['0', 'NombreGrado'], key: 'NombreGrado' },
    { title: 'Mensualidad', dataIndex: ['0', 'Mensualidad'], key: 'Mensualidad' }, // Corrección de "Mensuali-dad" a "Mensualidad"
    { title: 'Sección', dataIndex: ['0', 'NombreSeccion'], key: 'NombreSeccion' },
    { title: 'Jornada', dataIndex: ['0', 'NombreJornada'], key: 'NombreJornada', width: 100 },
    { title: 'Ciclo Escolar', dataIndex: ['0', 'CicloEscolar'], key: 'CicloEscolar' },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 24 }}>
      <h2>Ingresar Pago</h2>
      <Form form={form} name="createPago" onFinish={onFinish} layout="vertical" key={refreshTrigger}>
        <Form.Item
          name="Fecha"
          label="Fecha"
          rules={[{ required: true, message: 'Por favor selecciona la fecha' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Alumno">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Input.Group compact style={{ display: 'flex', flex: 1 }}>
              <Form.Item name="Nombres" noStyle>
                <Input readOnly style={{ flex: 2, minWidth: '250px' }} placeholder="Nombre del Alumno" />
              </Form.Item>
              <Form.Item name="IdAlumno" noStyle>
                <Input readOnly style={{ flex: 1, minWidth: '150px' }} placeholder="Carnet" />
              </Form.Item>
            </Input.Group>
            <Button type="primary" onClick={() => setIsSearchModalOpen(true)} style={{ background: '#003366', borderColor: '#003366', marginLeft: '10px' }}>
              Buscar Alumno
            </Button>
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
          <Input
            value={form.getFieldValue('Monto') || ''} // Controlado manualmente
            onChange={(e) => form.setFieldsValue({ Monto: e.target.value })}
            step="0.01"
          />
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

      {/* PopUp de búsqueda de alumno */}
      <Modal
        title="Buscar Alumno"
        open={isSearchModalOpen} // Usamos open en lugar de visible
        onOk={handleSearchModalOk}
        onCancel={handleSearchModalOk}
        footer={[
          <Button key="search" type="primary" onClick={handleSearchAlumno} style={{ background: '#003366', borderColor: '#003366' }}>
            Buscar
          </Button>,
          <Button key="ok" type="primary" onClick={handleSearchModalOk} style={{ background: '#003366', borderColor: '#003366' }}>
            Cerrar
          </Button>,
        ]}
        width={1000} // Ancho de la tabla
      >
        <div style={{ marginBottom: '16px' }}>
          <Select
            showSearch
            placeholder="Selecciona un alumno"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={(value) => setSelectedAlumno(value)}
            style={{ width: '300px', marginRight: '16px' }}
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
          <Input
            placeholder="Ciclo Escolar (ej. 2026)"
            value={cicloEscolar}
            onChange={(e) => setCicloEscolar(e.target.value)}
            style={{ width: '200px' }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={alumnoData}
          rowKey={(record) => record[0]?.IdAlumno || Math.random()} // Usamos IdAlumno como clave
          onRow={(record) => ({
            onDoubleClick: () => handleRowDoubleClick(record),
          })}
          pagination={false}
          scroll={{ y: 300 }} // Altura de la tabla
        />
      </Modal>

      {/* PopUp de éxito */}
      <Modal
        title="Éxito"
        open={isSuccessModalOpen} // Usamos open en lugar de visible
        onOk={handleSuccessModalOk}
        onCancel={handleSuccessModalOk}
        footer={[
          <Button key="ok" type="primary" onClick={handleSuccessModalOk} style={{ background: '#003366', borderColor: '#003366' }}>
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