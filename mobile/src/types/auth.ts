export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  username: string;
  userType: string;
  id: number;
}

export interface MotoristaData {
  id: number;
  username: string;
  token: string;
  userType: string;
}
