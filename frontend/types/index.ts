export interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  userType: string;
  user_type_name?: string;
  user_type_id?: number;
  first_name?: string;
  last_name?: string;
  active?: boolean;
  cpf?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
}

export interface Paciente {
  id: number;
  user_id?: number;
  patient_number?: string;
  first_name: string;
  last_name: string;
  nome?: string; // Para compatibilidade com antigo
  sobrenome?: string; // Para compatibilidade com antigo
  email: string;
  symptoms?: string[] | null;
  risk_score?: RiskLevel | null;
  blood_type?: string;
  sus_card?: string;
  health_plan?: string;
  allergies?: string;
  chronic_conditions?: string;
  created_at?: string;
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
  cpf?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
}

export interface NovoPacienteResponse {
  id?: number;
  user_id?: number;
  patient_number?: string;
  message?: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  riskScore?: string;
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

