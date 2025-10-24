// src/pages/dashboard/Inscripciones/hooks/useInscripcionForm.js
import { useReducer, useEffect } from 'react';
import apiClient from '../../../../api/apiClient'; // Ajusta la ruta

const user = JSON.parse(localStorage.getItem('user')) || { IdUsuario: null };

const initialState = {
  paso: 0,
  modo: null,
  user: { IdColaborador: user?.IdUsuario || null },
  alumno: {
    Carnet: '',
    Matricula: '',
    Nombres: '',
    Apellidos: '',
    FechaNacimiento: null,
    Genero: '',
    ComunidadLinguistica: '',
    IdFamilia: null,
  },
  inscripcion: {
    IdGrado: null,
    IdSeccion: null,
    IdJornada: null,
    FechaInscripcion: null,
    Mensualidad: 0,
  },
  pago: {
    pagarInscripcion: true,
    pagarEnero: true,
    NumeroRecibo: '',
  },
  catalogos: {
    grados: [],
    secciones: [],
    jornadas: [],
    familias: [],
  },
  loading: false,
  modales: {
    buscarAlumno: false,
    familia: false,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_MODO':
      return { ...state, modo: action.payload, paso: 0 };
    case 'NEXT_STEP':
      return { ...state, paso: state.paso + 1 };
    case 'PREV_STEP':
      return { ...state, paso: state.paso - 1 };
    case 'UPDATE_ALUMNO':
      return { ...state, alumno: { ...state.alumno, ...action.payload } };
    case 'UPDATE_INSCRIPCION':
      return { ...state, inscripcion: { ...state.inscripcion, ...action.payload } };
    case 'UPDATE_PAGO':
      return { ...state, pago: { ...state.pago, ...action.payload } };
    case 'SET_CATALOGOS':
      return { ...state, catalogos: { ...state.catalogos, ...action.payload } };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'RESET':
      return initialState;
    case 'OPEN_MODAL':
      return { ...state, modales: { ...state.modales, [action.payload]: true } };
    case 'CLOSE_MODAL':
      return { ...state, modales: { ...state.modales, [action.payload]: false } };
    case 'SET_PASO':
      return { ...state, paso: action.payload };
    default:
      return state;
  }
}

export const useInscripcionForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  

useEffect(() => {
  const fetchCatalogos = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [gradosRes, seccionesRes, jornadasRes, familiasRes] = await Promise.all([
        apiClient.get('/grados').catch(() => ({ data: { data: [] } })),
        apiClient.get('/secciones').catch(() => ({ data: { data: [] } })),
        apiClient.get('/jornadas').catch(() => ({ data: { data: [] } })),
        apiClient.get('/familias').catch(() => ({ data: { data: [] } })),
      ]);

      // MOCK SI FALLA
      const mock = {
        grados: [{ IdGrado: 1, NombreGrado: 'Primero Primaria', CostoMensual: 150 }],
        secciones: [{ IdSeccion: 1, NombreSeccion: 'A' }],
        jornadas: [{ IdJornada: 1, NombreJornada: 'Matutina' }],
        familias: [],
      };

      dispatch({
        type: 'SET_CATALOGOS',
        payload: {
          grados: gradosRes.data.data?.length ? gradosRes.data.data : mock.grados,
          secciones: seccionesRes.data.data?.length ? seccionesRes.data.data : mock.secciones,
          jornadas: jornadasRes.data.data?.length ? jornadasRes.data.data : mock.jornadas,
          familias: familiasRes.data.data || [],
        },
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  fetchCatalogos();
}, []);

// RECARGAR FAMILIAS DESPUÉS DE CREAR
useEffect(() => {
  if (state.alumno.IdFamilia && !state.catalogos.familias.find(f => f.IdFamilia === state.alumno.IdFamilia)) {
    const fetchFamilia = async () => {
      try {
        const res = await apiClient.get('/familias');
        const nuevas = Array.isArray(res.data.data) ? res.data.data : res.data;
        dispatch({
          type: 'SET_CATALOGOS',
          payload: { familias: nuevas },
        });
      } catch (error) {}
    };
    fetchFamilia();
  }
}, [state.alumno.IdFamilia]);

  return { state, dispatch };
};