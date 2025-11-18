export interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  userType: string;
  user_type_name?: string;
  first_name?: string;
  last_name?: string;
  active?: boolean;
}

export interface Paciente {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  symptoms?: string[] | null;
  risk_score?: RiskLevel | null;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userTypeId?: number;
}

export interface NovoPacienteRequest {
  firstName: string;
  lastName: string;
  email?: string;
  symptoms?: string[];
}

export interface NovoPacienteResponse {
  message: string;
  firstName: string;
  lastName: string;
  riskScore: string;
  username?: string;
  email?: string;
}

export interface NovoUsuarioRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  user_type_id: number;
  active: boolean;
}

export type RiskLevel = 'Alta' | 'Média' | 'Baixa';

