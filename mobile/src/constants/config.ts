export const MESSAGES = {
  AUTH: {
    EMPTY_FIELDS: 'Please fill in all fields.',
    LOGIN_SUCCESS: 'Welcome, {nome}!',
    INVALID_CREDENTIALS: 'Invalid credentials.',
    DRIVER_ONLY: 'Access restricted to drivers only.',
    CONNECTION_ERROR: 'Could not connect to the server. Make sure the backend is running and the IP is correctly set in your .env file.',
    UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.',
  },
  TITLES: {
    ATTENTION: 'Attention',
    SUCCESS: 'Success',
    LOGIN_ERROR: 'Login Failed',
    CONNECTION_ERROR: 'Connection Error',
    ERROR: 'Error',
  },
} as const;

export const STORAGE_KEYS = {
  MOTORISTA_ID: '@rastreador:motorista_id',
  MOTORISTA_USERNAME: '@rastreador:motorista_username',
  MOTORISTA_TOKEN: '@rastreador:motorista_token',
  MOTORISTA_USER_TYPE: '@rastreador:motorista_user_type',
} as const;

if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
  console.warn('[config] EXPO_PUBLIC_API_BASE_URL não definida no .env');
}

export const API_CONFIG = {
  TIMEOUT: Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 10000,
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://SEU_IP_AQUI:8080/api',
} as const;
