import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
});

// Agrega el token de Firebase en cada request que lo necesite
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMaestros = (oficio, comuna) =>
  api.get('/maestros', { params: { oficio, comuna } });

export const getMaestroById = (id) =>
  api.get(`/maestros/${id}`);

export const createMaestro = (datos) =>
  api.post('/maestros', datos);

export const updateMaestro = (id, datos) =>
  api.put(`/maestros/${id}`, datos);

export const getPerfil = () =>
  api.get('/usuarios/perfil');

export const createPerfil = (datos) =>
  api.post('/usuarios/perfil', datos);

export const getReseñas = (maestroId) =>
  api.get(`/maestros/${maestroId}/reseñas`);

export const createReseña = (maestroId, datos) =>
  api.post(`/maestros/${maestroId}/reseñas`, datos);

export const getMiPerfilMaestro = () =>
  api.get('/maestros/mi-perfil');
