export const MESSAGES = {
  AUTH: {
    EMPTY_FIELDS: 'Por favor, preencha todos os campos!',
    LOGIN_SUCCESS: 'Bem-vindo, {nome}!',
    INVALID_CREDENTIALS: 'Credenciais inválidas!',
    CONNECTION_ERROR: 'Não foi possível conectar ao servidor. Verifique se o backend está rodando e se você configurou o IP correto no arquivo api.ts!',
    UNEXPECTED_ERROR: 'Ocorreu um erro inesperado. Tente novamente.',
  },
  TITLES: {
    ATTENTION: 'Atenção',
    SUCCESS: 'Sucesso!',
    LOGIN_ERROR: 'Erro de Login',
    CONNECTION_ERROR: 'Erro de Conexão',
    ERROR: 'Erro',
  },
} as const;

export const STORAGE_KEYS = {
  MOTORISTA_ID: '@rastreador:motorista_id',
  MOTORISTA_NOME: '@rastreador:motorista_nome',
  MOTORISTA_TOKEN: '@rastreador:motorista_token',
} as const;

export const API_CONFIG = {
  TIMEOUT: 10000,
  BASE_URL_PLACEHOLDER: 'http://SEU_IP_AQUI:8080',
} as const;
