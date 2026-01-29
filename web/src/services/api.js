import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (credentials) => {
  // Credentials espera: { username, password }
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  // UserData espera: { username, password, email, document, userType }
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const createVehicle = async (vehicleData) => {
  // VehicleData espera: { name, licensePlate, ownerId }
  const response = await api.post('/vehicles', vehicleData);
  return response.data;
};

export const getMotoristas = async () => {
  const response = await api.get('/users');
  // Filtra apenas motoristas no front (ou criar endpoint específico no back)
  return response.data.filter(u => u.userType === 'DRIVER');
};

export const getLocalizacaoHistorico = async (motoristaId) => {
  const response = await api.get(`/localizations/user/${motoristaId}`);
  return response.data.content || response.data;
};

export default api;