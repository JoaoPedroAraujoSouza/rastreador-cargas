import api from './api';

export interface LocalizationPayload {
  latitude: number;
  longitude: number;
  userId: number;
  timestamp: string;
}

export interface LocalizationResponse {
  id: number;
  latitude: number;
  longitude: number;
  userId: number;
  timestamp: string;
  username: string;
}

export const sendLocalization = async (
  payload: LocalizationPayload
): Promise<LocalizationResponse> => {
  const response = await api.post<LocalizationResponse>('/localizations', payload);
  return response.data;
};
