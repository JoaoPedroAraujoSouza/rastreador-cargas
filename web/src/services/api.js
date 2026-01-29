import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const createVehicle = async (vehicleData) => {
  const response = await api.post('/vehicles', vehicleData);
  return response.data;
};

// Busca genérica de usuários
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getLocalizacaoHistorico = async (userId) => {
  try {
    const response = await api.get(`/localizations/user/${userId}`);
    return response.data.content || [];
  } catch (error) {
    console.error("Erro ao buscar histórico", error);
    return [];
  }
};

export default api;