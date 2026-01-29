import axios from 'axios';
import { logger } from '../utils/logger';
import { API_CONFIG } from '../constants/config';

const BASE_URL = API_CONFIG.BASE_URL_PLACEHOLDER;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      logger.error('Erro da API:', error.response.data);
    } else if (error.request) {
      logger.error('Erro de conexão:', error.message);
    } else {
      logger.error('Erro:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
