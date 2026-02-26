import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';
import { API_CONFIG, STORAGE_KEYS } from '../constants/config';

const BASE_URL = API_CONFIG.BASE_URL;

let _unauthorizedCallback: (() => void) | null = null;

export const setUnauthorizedCallback = (cb: () => void) => {
  _unauthorizedCallback = cb;
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.MOTORISTA_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
      if (error.response.status === 401 && _unauthorizedCallback) {
        _unauthorizedCallback();
      }
    } else if (error.request) {
      logger.error('Erro de conexão:', error.message);
    } else {
      logger.error('Erro:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
