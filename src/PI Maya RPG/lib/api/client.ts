import axios from 'axios';
import type {
  LoginResponse,
  Paciente,
  PacienteFormData,
  Exercicio,
  ExercicioFormData,
  Prescricao,
  Checkin,
  EvolucaoSemanal,
  SessaoProntuario,
} from '@/lib/types';

// ── Instância Axios ──────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: adiciona token JWT em todas as requisições
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor: se receber 401, limpa o token e redireciona
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================================
// MOCK — Login de desenvolvimento (sem backend)
// ============================================================

const DEV_USERS: Record<string, LoginResponse> = {
  'teste@maya.com': {
    access_token: 'dev-token-admin',
    user: {
      id: 'd0000000-0000-0000-0000-000000000001',
      nome: 'Teste Admin',
      email: 'teste@maya.com',
      role: 'admin',
    },
  },
  'paciente@maya.com': {
    access_token: 'dev-token-paciente',
    user: {
      id: 'd0000000-0000-0000-0000-000000000002',
      nome: 'Teste Paciente',
      email: 'paciente@maya.com',
      role: 'paciente',
    },
  },
};

// ── Auth ─────────────────────────────────────────────────────

export async function login(email: string, senha: string): Promise<LoginResponse> {
  // Modo desenvolvimento: login mock se o backend não responder
  if (process.env.NODE_ENV === 'development') {
    const mockUser = DEV_USERS[email.toLowerCase().trim()];
    if (mockUser && senha === '123456') {
      return mockUser;
    }
  }

  const { data } = await api.post<LoginResponse>('/auth/login', { email, senha });
  return data;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
  // Fire-and-forget ao backend
  api.post('/auth/logout').catch(() => {});
}

// ── Pacientes ────────────────────────────────────────────────

export async function listarPacientes(): Promise<Paciente[]> {
  const { data } = await api.get<Paciente[]>('/pacientes');
  return data;
}

export async function buscarPaciente(id: string): Promise<Paciente> {
  const { data } = await api.get<Paciente>(`/pacientes/${id}`);
  return data;
}

export async function criarPaciente(formData: PacienteFormData): Promise<Paciente> {
  const { data } = await api.post<Paciente>('/pacientes', formData);
  return data;
}

export async function atualizarPaciente(id: string, formData: Partial<PacienteFormData>): Promise<Paciente> {
  const { data } = await api.put<Paciente>(`/pacientes/${id}`, formData);
  return data;
}

export async function deletarPaciente(id: string): Promise<void> {
  await api.delete(`/pacientes/${id}`);
}

// ── Exercícios ───────────────────────────────────────────────

export async function listarExercicios(params?: {
  tipo?: string;
  dificuldade?: string;
  busca?: string;
}): Promise<Exercicio[]> {
  const { data } = await api.get<Exercicio[]>('/exercicios', { params });
  return data;
}

export async function buscarExercicio(id: string): Promise<Exercicio> {
  const { data } = await api.get<Exercicio>(`/exercicios/${id}`);
  return data;
}

export async function criarExercicio(formData: ExercicioFormData): Promise<Exercicio> {
  const { data } = await api.post<Exercicio>('/exercicios', formData);
  return data;
}

export async function atualizarExercicio(id: string, formData: Partial<ExercicioFormData>): Promise<Exercicio> {
  const { data } = await api.put<Exercicio>(`/exercicios/${id}`, formData);
  return data;
}

export async function deletarExercicio(id: string): Promise<void> {
  await api.delete(`/exercicios/${id}`);
}

// ── Prescrições ──────────────────────────────────────────────

export async function listarPrescricoes(pacienteId: string): Promise<Prescricao[]> {
  const { data } = await api.get<Prescricao[]>(`/prescricoes/paciente/${pacienteId}`);
  return data;
}

export async function criarPrescricao(payload: {
  paciente_id: string;
  exercicio_id: string;
  series?: number;
  repeticoes?: number;
  duracao_seg?: number;
  frequencia?: string;
  observacoes?: string;
}): Promise<Prescricao> {
  const { data } = await api.post<Prescricao>('/prescricoes', payload);
  return data;
}

// ── Check-ins ────────────────────────────────────────────────

export async function registrarCheckin(payload: {
  paciente_id: string;
  prescricao_id: string;
  executado: boolean;
  nivel_dor?: number;
  observacoes?: string;
}): Promise<Checkin> {
  const { data } = await api.post<Checkin>('/checkins', payload);
  return data;
}

export async function listarCheckins(pacienteId: string): Promise<Checkin[]> {
  const { data } = await api.get<Checkin[]>(`/checkins/paciente/${pacienteId}`);
  return data;
}

export async function buscarEvolucao(pacienteId: string): Promise<EvolucaoSemanal[]> {
  const { data } = await api.get<EvolucaoSemanal[]>(`/checkins/paciente/${pacienteId}/evolucao`);
  return data;
}

// ── Prontuário ───────────────────────────────────────────────

export async function listarSessoes(pacienteId: string): Promise<SessaoProntuario[]> {
  const { data } = await api.get<SessaoProntuario[]>(`/prontuario/paciente/${pacienteId}/sessoes`);
  return data;
}

export async function criarSessao(pacienteId: string, payload: {
  data_sessao?: string;
  notas?: string;
  evolucao?: string;
  condutas?: string;
  nivel_dor_inicio?: number;
  nivel_dor_fim?: number;
}): Promise<SessaoProntuario> {
  const { data } = await api.post<SessaoProntuario>(`/prontuario/paciente/${pacienteId}/sessoes`, payload);
  return data;
}

export default api;
