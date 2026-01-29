import api from './api';
import { LoginRequest, LoginResponse } from '../types/auth';

export const loginMotorista = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  return response.data;
};
