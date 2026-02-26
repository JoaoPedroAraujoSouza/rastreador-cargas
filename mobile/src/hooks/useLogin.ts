import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { loginMotorista } from '../services/auth';
import { getErrorMessage, isAxiosError } from '../utils/error-handler';
import { logger } from '../utils/logger';
import { MESSAGES } from '../constants/config';
import { useAuth } from '../context/AuthContext';

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
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!login.trim() || !senha.trim()) {
      Toast.show({ type: 'error', text1: MESSAGES.TITLES.ATTENTION, text2: MESSAGES.AUTH.EMPTY_FIELDS });
      return;
    }

    setLoading(true);

    try {
      const motoristaData = await loginMotorista({
        username: login.trim(),
        password: senha,
      });

      if (motoristaData.userType !== 'DRIVER') {
        Toast.show({ type: 'error', text1: MESSAGES.TITLES.LOGIN_ERROR, text2: MESSAGES.AUTH.DRIVER_ONLY });
        return;
      }

      await signIn(motoristaData);

      if (onSuccess) {
        onSuccess(motoristaData.username);
      }
    } catch (error: unknown) {
      logger.error('Erro no login:', error);

      const message = getErrorMessage(error);
      const title = isAxiosError(error) && error.response
        ? MESSAGES.TITLES.LOGIN_ERROR
        : MESSAGES.TITLES.CONNECTION_ERROR;

      Toast.show({ type: 'error', text1: title, text2: message });
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
