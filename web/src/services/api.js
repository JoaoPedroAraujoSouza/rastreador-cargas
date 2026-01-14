import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getMotoristas = async () => {
  const response = await api.get('/usuarios');
  return response.data;
};

export const getLocalizacaoHistorico = async (motoristaId) => {
  const response = await api.get(`/localizacoes/historico/${motoristaId}`);
  return response.data;
};

export default api;
