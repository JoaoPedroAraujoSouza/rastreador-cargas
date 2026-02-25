import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotoristaData } from '../types/auth';
import { STORAGE_KEYS } from '../constants/config';

export const saveMotoristaData = async (data: MotoristaData): Promise<void> => {
  await AsyncStorage.multiSet([
    [STORAGE_KEYS.MOTORISTA_ID, data.id.toString()],
    [STORAGE_KEYS.MOTORISTA_NOME, data.nome],
    [STORAGE_KEYS.MOTORISTA_TOKEN, data.token],
  ]);
};

export const getMotoristaData = async (): Promise<MotoristaData | null> => {
  const values = await AsyncStorage.multiGet([
    STORAGE_KEYS.MOTORISTA_ID,
    STORAGE_KEYS.MOTORISTA_NOME,
    STORAGE_KEYS.MOTORISTA_TOKEN,
  ]);

  const id = values[0][1];
  const nome = values[1][1];
  const token = values[2][1];

  if (!id || !nome || !token) {
    return null;
  }

  return {
    id: parseInt(id, 10),
    nome,
    token,
  };
};

export const clearMotoristaData = async (): Promise<void> => {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.MOTORISTA_ID,
    STORAGE_KEYS.MOTORISTA_NOME,
    STORAGE_KEYS.MOTORISTA_TOKEN,
  ]);
};
