import axios from 'axios';
import { Sensor, EventoOperacional, Alerta } from '../types';

// =============================================
// Configuração da API
// Para emulador Android: http://10.0.2.2:8080
// Para dispositivo físico: use o IP da máquina, ex: http://192.168.1.100:8080
// Para iOS Simulator: http://localhost:8080
// =============================================
const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para log de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// =============================================
// Sensores
// =============================================
export const SensorAPI = {
  listar: () => api.get<Sensor[]>('/sensores'),
  buscarPorId: (id: number) => api.get<Sensor>(`/sensores/${id}`),
  criar: (sensor: Sensor) => api.post<Sensor>('/sensores', sensor),
  atualizar: (id: number, sensor: Sensor) => api.put<Sensor>(`/sensores/${id}`, sensor),
  deletar: (id: number) => api.delete(`/sensores/${id}`),
};

// =============================================
// Eventos Operacionais
// =============================================
export const EventoAPI = {
  listar: () => api.get<EventoOperacional[]>('/eventos'),
  buscarPorId: (id: number) => api.get<EventoOperacional>(`/eventos/${id}`),
  criar: (evento: EventoOperacional) => api.post<EventoOperacional>('/eventos', evento),
  deletar: (id: number) => api.delete(`/eventos/${id}`),
};

// =============================================
// Alertas
// =============================================
export const AlertaAPI = {
  listar: () => api.get<Alerta[]>('/alertas'),
  listarNaoResolvidos: () => api.get<Alerta[]>('/alertas/nao-resolvidos'),
  buscarPorId: (id: number) => api.get<Alerta>(`/alertas/${id}`),
  criar: (alerta: Alerta) => api.post<Alerta>('/alertas', alerta),
  resolver: (id: number, resolucao: string) =>
    api.patch<Alerta>(`/alertas/${id}/resolver`, { resolucao }),
  deletar: (id: number) => api.delete(`/alertas/${id}`),
};

export default api;
