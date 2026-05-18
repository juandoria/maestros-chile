import axios from 'axios';
import { auth } from './firebase';

// En Android con emulador, 10.0.2.2 apunta al localhost de tu PC.
// En iOS con simulador o dispositivo físico con Expo Go, usa tu IP local (ej: 192.168.4.77).
const API_URL = 'http://10.0.2.2:3000/api';

const api = axios.create({ baseURL: API_URL });

// Agrega el token de Firebase en cada request autenticado
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
