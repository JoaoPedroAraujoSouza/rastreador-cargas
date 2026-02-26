import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotoristaData } from '../types/auth';
import { STORAGE_KEYS } from '../constants/config';

export const saveMotoristaData = async (data: MotoristaData): Promise<void> => {
  await AsyncStorage.multiSet([
    [STORAGE_KEYS.MOTORISTA_ID, data.id.toString()],
    [STORAGE_KEYS.MOTORISTA_USERNAME, data.username],
    [STORAGE_KEYS.MOTORISTA_TOKEN, data.token],
    [STORAGE_KEYS.MOTORISTA_USER_TYPE, data.userType],
  ]);
};

export const getMotoristaData = async (): Promise<MotoristaData | null> => {
  const values = await AsyncStorage.multiGet([
    STORAGE_KEYS.MOTORISTA_ID,
    STORAGE_KEYS.MOTORISTA_USERNAME,
    STORAGE_KEYS.MOTORISTA_TOKEN,
    STORAGE_KEYS.MOTORISTA_USER_TYPE,
  ]);

  const id = values[0][1];
  const username = values[1][1];
  const token = values[2][1];
  const userType = values[3][1];

  if (!id || !username || !token || !userType) {
    return null;
  }

  return {
    id: parseInt(id, 10),
    username,
    token,
    userType,
  };
};

export const clearMotoristaData = async (): Promise<void> => {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.MOTORISTA_ID,
    STORAGE_KEYS.MOTORISTA_USERNAME,
    STORAGE_KEYS.MOTORISTA_TOKEN,
    STORAGE_KEYS.MOTORISTA_USER_TYPE,
  ]);
};
