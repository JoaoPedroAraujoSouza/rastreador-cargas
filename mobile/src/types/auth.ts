export interface LoginRequest {
  login: string;
  senha: string;
}

export interface LoginResponse {
  id: number;
  nome: string;
  token: string;
}

export interface MotoristaData {
  id: number;
  nome: string;
  token: string;
}
