import api from './api';
import { LoginRequest, LoginResponse, User, Paciente, NovoPacienteRequest } from '@/types';

/**
 * Serviço de API para o frontend
 * Centraliza todas as chamadas à API do backend com tratamento de erros e response padrão
 */

// ============================================
// AUTENTICAÇÃO
// ============================================

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<{ success: boolean; data: LoginResponse }>('/api/auth/login', credentials);
    return response.data.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<{ success: boolean; data: User }>('/api/auth/me');
    return response.data.data;
  },

  logout: (): void => {
    // Logout é local (remove token do localStorage)
    // Se houver blacklist de token no backend, adicione aqui
  },
};

// ============================================
// USUÁRIOS
// ============================================

export const usersAPI = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<{ success: boolean; data: User[] }>('/api/users');
    return response.data.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get<{ success: boolean; data: User }>(`/api/users/${id}`);
    return response.data.data;
  },
};

// ============================================
// PACIENTES
// ============================================

export const pacientesAPI = {
  getAll: async (search?: string): Promise<Paciente[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const response = await api.get<{ success: boolean; data: Paciente[] }>(
      `/api/pacientes${params.toString() ? '?' + params.toString() : ''}`
    );
    return response.data.data || [];
  },

  getById: async (id: number): Promise<Paciente> => {
    const response = await api.get<{ success: boolean; data: Paciente }>(`/api/pacientes/${id}`);
    return response.data.data;
  },

  create: async (data: NovoPacienteRequest): Promise<any> => {
    const response = await api.post<{ success: boolean; data: any }>('/api/pacientes', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<Paciente>): Promise<void> => {
    await api.put<{ success: boolean }>(`/api/pacientes/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<{ success: boolean }>(`/api/pacientes/${id}`);
  },
};

// ============================================
// AGENDAMENTOS
// ============================================

export const appointmentsAPI = {
  getAll: async (): Promise<any[]> => {
    const response = await api.get<{ success: boolean; data: any[] }>('/api/appointments');
    return response.data.data || [];
  },

  getById: async (id: number): Promise<any> => {
    const response = await api.get<{ success: boolean; data: any }>(`/api/appointments/${id}`);
    return response.data.data;
  },

  create: async (data: any): Promise<any> => {
    const response = await api.post<{ success: boolean; data: any }>('/api/appointments', data);
    return response.data.data;
  },

  update: async (id: number, data: any): Promise<void> => {
    await api.put<{ success: boolean }>(`/api/appointments/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<{ success: boolean }>(`/api/appointments/${id}`);
  },
};

// ============================================
// MÉDICOS/PROFISSIONAIS
// ============================================

export const doctorsAPI = {
  getAll: async (): Promise<any[]> => {
    const response = await api.get<{ success: boolean; data: any[] }>('/api/doctors');
    return response.data.data || [];
  },

  getById: async (id: number): Promise<any> => {
    const response = await api.get<{ success: boolean; data: any }>(`/api/doctors/${id}`);
    return response.data.data;
  },

  create: async (data: any): Promise<any> => {
    const response = await api.post<{ success: boolean; data: any }>('/api/doctors', data);
    return response.data.data;
  },

  update: async (id: number, data: any): Promise<void> => {
    await api.put<{ success: boolean }>(`/api/doctors/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<{ success: boolean }>(`/api/doctors/${id}`);
  },

  getStats: async (id: number): Promise<any> => {
    const response = await api.get<{ success: boolean; data: any }>(`/api/doctors/stats/${id}`);
    return response.data.data;
  },
};

// ============================================
// PRONTUÁRIO MÉDICO
// ============================================

export const medicalRecordsAPI = {
  getAll: async (): Promise<any[]> => {
    const response = await api.get<{ success: boolean; data: any[] }>('/api/medical-records');
    return response.data.data || [];
  },

  getById: async (id: number): Promise<any> => {
    const response = await api.get<{ success: boolean; data: any }>(`/api/medical-records/${id}`);
    return response.data.data;
  },

  getByPatient: async (patientId: number): Promise<any[]> => {
    const response = await api.get<{ success: boolean; data: any[] }>(`/api/medical-records/patient/${patientId}`);
    return response.data.data || [];
  },

  create: async (data: any): Promise<any> => {
    const response = await api.post<{ success: boolean; data: any }>('/api/medical-records', data);
    return response.data.data;
  },

  update: async (id: number, data: any): Promise<void> => {
    await api.put<{ success: boolean }>(`/api/medical-records/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<{ success: boolean }>(`/api/medical-records/${id}`);
  },
};

// ============================================
// MEDICAMENTOS
// ============================================

export const medicinesAPI = {
  getAll: async (): Promise<any[]> => {
    const response = await api.get<{ success: boolean; data: any[] }>('/api/medicines');
    return response.data.data || [];
  },

  getById: async (id: number): Promise<any> => {
    const response = await api.get<{ success: boolean; data: any }>(`/api/medicines/${id}`);
    return response.data.data;
  },

  create: async (data: any): Promise<any> => {
    const response = await api.post<{ success: boolean; data: any }>('/api/medicines', data);
    return response.data.data;
  },

  update: async (id: number, data: any): Promise<void> => {
    await api.put<{ success: boolean }>(`/api/medicines/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<{ success: boolean }>(`/api/medicines/${id}`);
  },
};

// ============================================
// TRIAGEM
// ============================================

export const triageAPI = {
  getQueue: async (): Promise<any[]> => {
    const response = await api.get<{ success: boolean; data: any[] }>('/api/triage/fila');
    return response.data.data || [];
  },

  getTicket: async (id: number): Promise<any> => {
    const response = await api.get<{ success: boolean; data: any }>(`/api/triage/tickets/${id}`);
    return response.data.data;
  },

  createTicket: async (data: any): Promise<any> => {
    const response = await api.post<{ success: boolean; data: any }>('/api/triage/tickets', data);
    return response.data.data;
  },

  updateTicket: async (id: number, data: any): Promise<void> => {
    await api.put<{ success: boolean }>(`/api/triage/tickets/${id}`, data);
  },

  deleteTicket: async (id: number): Promise<void> => {
    await api.delete<{ success: boolean }>(`/api/triage/tickets/${id}`);
  },

  getNextInQueue: async (): Promise<any> => {
    const response = await api.post<{ success: boolean; data: any }>('/api/triage/fila/proximo', {});
    return response.data.data;
  },
};

// ============================================
// SENHA
// ============================================

export const passwordAPI = {
  resetPassword: async (data: any): Promise<any> => {
    const response = await api.post<{ success: boolean; data: any }>('/api/password/reset', data);
    return response.data.data;
  },

  changePassword: async (data: any): Promise<any> => {
    const response = await api.post<{ success: boolean; data: any }>('/api/password/change', data);
    return response.data.data;
  },
};
