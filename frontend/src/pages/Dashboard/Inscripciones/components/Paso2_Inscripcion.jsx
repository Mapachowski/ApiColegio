// src/pages/dashboard/Inscripciones/components/Paso2_Inscripcion.jsx
import React, { useEffect } from 'react';
import { Form, Select, Input, DatePicker } from 'antd';
import moment from 'moment';

const { Option } = Select;

const Paso2_Inscripcion = ({ state, dispatch }) => {
  const { inscripcion, catalogos, alumno } = state;

  // Establecer fecha de hoy por defecto
  useEffect(() => {
    if (!inscripcion.FechaInscripcion) {
      dispatch({
        type: 'UPDATE_INSCRIPCION',
        payload: { FechaInscripcion: moment().format('YYYY-MM-DD') },
      });
    }
  }, [inscripcion.FechaInscripcion, dispatch]);

  const handleGradoChange = (IdGrado) => {
    const grado = catalogos.grados.find(g => g.IdGrado === IdGrado);
    dispatch({
      type: 'UPDATE_INSCRIPCION',
      payload: {
        IdGrado,
        Mensualidad: grado?.CostoMensual || 0,
      },
    });
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Nombre Completo">
        <Input value={`${alumno.Nombres} ${alumno.Apellidos}`} readOnly />
      </Form.Item>

      <Form.Item label="Carnet">
        <Input value={alumno.IdAlumno || alumno.Carnet} readOnly />
      </Form.Item>

      <Form.Item label="Grado">
        <Select
          value={inscripcion.IdGrado}
          onChange={handleGradoChange}
          placeholder="Seleccione grado"
        >
          {catalogos.grados.map(g => (
            <Option key={g.IdGrado} value={g.IdGrado}>
              {g.NombreGrado} (Q {g.CostoMensual?.toFixed(2)})
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Sección">
        <Select
          value={inscripcion.IdSeccion}
          onChange={(value) => dispatch({ type: 'UPDATE_INSCRIPCION', payload: { IdSeccion: value } })}
        >
          {catalogos.secciones.map(s => (
            <Option key={s.IdSeccion} value={s.IdSeccion}>
              {s.NombreSeccion}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Jornada">
        <Select
          value={inscripcion.IdJornada}
          onChange={(value) => dispatch({ type: 'UPDATE_INSCRIPCION', payload: { IdJornada: value } })}
        >
          {catalogos.jornadas.map(j => (
            <Option key={j.IdJornada} value={j.IdJornada}>
              {j.NombreJornada}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Ciclo Escolar">
        <Input value="2026" readOnly />
      </Form.Item>

      <Form.Item label="Fecha de Inscripción">
        <DatePicker
          style={{ width: '100%' }}
          value={inscripcion.FechaInscripcion ? moment(inscripcion.FechaInscripcion) : null}
          onChange={(date) => {
            dispatch({
              type: 'UPDATE_INSCRIPCION',
              payload: { FechaInscripcion: date?.format('YYYY-MM-DD') },
            });
          }}
        />
      </Form.Item>

      <Form.Item label="Mensualidad (Enero)">
        <Input
          value={`Q ${inscripcion.Mensualidad?.toFixed(2) || '0.00'}`}
          readOnly
          style={{ color: '#003366', fontWeight: 'bold' }}
        />
      </Form.Item>
    </Form>
  );
};

export default Paso2_Inscripcion;