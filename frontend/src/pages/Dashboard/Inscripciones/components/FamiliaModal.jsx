// src/pages/dashboard/Inscripciones/components/FamiliaModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Select, Form, Input, Button, Radio, message, Row, Col } from 'antd';
import apiClient from '../../../../api/apiClient';

const { Option } = Select;

const FamiliaModal = ({ open, onSelect, onCancel, state }) => {
  const [form] = Form.useForm();
  const [familias, setFamilias] = useState([]);
  const [modo, setModo] = useState('buscar');
  const [responsableSeleccionado, setResponsableSeleccionado] = useState(null);

  useEffect(() => {
    const fetchFamilias = async () => {
      try {
        const res = await apiClient.get('/familias');
        setFamilias(Array.isArray(res.data.data) ? res.data.data : res.data);
      } catch (error) {
        console.error('Error cargando familias:', error);
      }
    };
    if (open && modo === 'buscar') fetchFamilias();
  }, [open, modo]);

  const handleCrear = async () => {
    try {
      const values = await form.validateFields();

      // Validar al menos un responsable
      if (!values.PadreNombre && !values.MadreNombre) {
        message.error('Debe ingresar al menos un responsable');
        return;
      }

      // Crear familia
      const familiaRes = await apiClient.post('/familias', {
        NombreFamilia: values.NombreFamilia,
        Direccion: values.Direccion,
        TelefonoContacto: values.TelefonoContacto,
        EmailContacto: values.EmailContacto,
        IdColaborador: state.user.IdColaborador,
      });
      const nuevaFamilia = familiaRes.data.data || familiaRes.data;
      onSelect({
        IdFamilia: nuevaFamilia.IdFamilia,
        NombreFamilia: nuevaFamilia.NombreFamilia // opcional, pero útil para mostrar
      });
      // Crear responsables
      if (values.PadreNombre) {
        await apiClient.post('/responsables', {
          NombreResponsable: values.PadreNombre,
          DPI: values.PadreDPI,
          NIT: values.PadreNIT,
          IdFamilia: nuevaFamilia.IdFamilia,
          EsResponsable: responsableSeleccionado === 'padre',
          IdColaborador: state.user.IdColaborador,
        });
      }
      if (values.MadreNombre) {
        await apiClient.post('/responsables', {
          NombreResponsable: values.MadreNombre,
          DPI: values.MadreDPI,
          NIT: values.MadreNIT,
          IdFamilia: nuevaFamilia.IdFamilia,
          EsResponsable: responsableSeleccionado === 'madre',
          IdColaborador: state.user.IdColaborador,
        });
      }

      message.success('Familia y responsables creados');
      form.resetFields(); // LIMPIAR
      setResponsableSeleccionado(null);
      onSelect(nuevaFamilia);
      onCancel(); // CERRAR
    } catch (error) {
      console.error('Error:', error);
      message.error('Error al crear familia');
    }
  };

  return (
    <Modal
      title="Gestión de Familia"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <div style={{ marginBottom: 16 }}>
        <Button
          onClick={() => {
            setModo('buscar');
            form.resetFields();
          }}
          type={modo === 'buscar' ? 'primary' : 'default'}
        >
          Buscar
        </Button>
        <Button
          onClick={() => {
            setModo('nueva');
            form.resetFields();
            setResponsableSeleccionado(null);
          }}
          style={{ marginLeft: 8 }}
          type={modo === 'nueva' ? 'primary' : 'default'}
        >
          Nueva Familia
        </Button>
      </div>

      {modo === 'buscar' ? (
        <>
          <Select
            showSearch
            placeholder="Buscar familia"
            style={{ width: '100%' }}
            onChange={(id) => {
              const fam = familias.find((f) => f.IdFamilia === id);
              if (fam) {
                onSelect(fam);
                onCancel();
              }
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {familias.map((f) => (
              <Option key={f.IdFamilia} value={f.IdFamilia}>
                {f.NombreFamilia} - {f.Direccion}
              </Option>
            ))}
          </Select>
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button onClick={onCancel}>Cancelar</Button>
          </div>
        </>
      ) : (
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="NombreFamilia"
                label="Nombre de la Familia"
                rules={[{ required: true, message: 'Requerido' }]}
              >
                <Input placeholder="Ej: Familia López Figueroa" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Direccion"
                label="Dirección"
                rules={[{ required: true, message: 'Requerido' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="TelefonoContacto" label="Teléfono">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="EmailContacto" label="Email">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ margin: '16px 0', fontWeight: 'bold' }}>Responsables</div>

          {/* Padre */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="PadreNombre" label="Nombre del Padre">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="PadreDPI" label="DPI">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="PadreNIT" label="NIT">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* Madre */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="MadreNombre" label="Nombre de la Madre">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="MadreDPI" label="DPI">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="MadreNIT" label="NIT">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="¿Quién es el responsable principal?">
            <Radio.Group
              onChange={(e) => setResponsableSeleccionado(e.target.value)}
              value={responsableSeleccionado}
            >
              <Radio value="padre" disabled={!form.getFieldValue('PadreNombre')}>
                Padre
              </Radio>
              <Radio value="madre" disabled={!form.getFieldValue('MadreNombre')}>
                Madre
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Button
            type="primary"
            onClick={handleCrear}
            style={{ background: '#003366', borderColor: '#003366' }}
          >
            Crear Familia y Responsables
          </Button>
        </Form>
      )}
    </Modal>
  );
};

export default FamiliaModal;