import { useState } from 'react';
import { Alert } from 'react-native';
import { loginMotorista } from '../services/auth';
import { saveMotoristaData } from '../services/storage';
import { getErrorMessage, isAxiosError } from '../utils/error-handler';
import { logger } from '../utils/logger';
import { MESSAGES } from '../constants/config';

interface UseLoginReturn {
  login: string;
  senha: string;
  loading: boolean;
  setLogin: (value: string) => void;
  setSenha: (value: string) => void;
  handleLogin: () => Promise<void>;
}

export const useLogin = (onSuccess?: (nome: string) => void): UseLoginReturn => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!login.trim() || !senha.trim()) {
      Alert.alert(MESSAGES.TITLES.ATTENTION, MESSAGES.AUTH.EMPTY_FIELDS);
      return;
    }

    setLoading(true);

    try {
      const motoristaData = await loginMotorista({
        login: login.trim(),
        senha: senha,
      });

      await saveMotoristaData(motoristaData);

      if (onSuccess) {
        onSuccess(motoristaData.nome);
      }
    } catch (error: unknown) {
      logger.error('Erro no login:', error);

      const message = getErrorMessage(error);
      const title = isAxiosError(error) && error.response 
        ? MESSAGES.TITLES.LOGIN_ERROR
        : MESSAGES.TITLES.CONNECTION_ERROR;
      
      Alert.alert(title, message);
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    senha,
    loading,
    setLogin,
    setSenha,
    handleLogin,
  };
};
