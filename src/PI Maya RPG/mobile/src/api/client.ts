import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LoginResponse, Prescricao, Checkin, EvolucaoSemanal, User } from '../types';

// ── Configuração ─────────────────────────────────────────────
// Produção (Render):
const API_URL = 'https://maya-rpg-api.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ── Interceptor: Injeta token JWT ────────────────────────────
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // AsyncStorage indisponível — segue sem token
  }
  return config;
});

// ── Auth ─────────────────────────────────────────────────────

export async function login(email: string, senha: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, senha });
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/auth/me');
  return data;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch {
    // Fire-and-forget
  }
}

// ── Prescrições ──────────────────────────────────────────────

const MOCK_PRESCRICOES: Prescricao[] = [
  {
    id: 'mock-presc-1',
    paciente_id: 'mock-paciente',
    exercicio_id: 'mock-ex-1',
    series: 3,
    repeticoes: 15,
    frequencia: 'Diário',
    observacoes: 'Faça com cuidado',
    ativo: true,
    created_at: new Date().toISOString(),
    exercicio_nome: 'Alongamento de Cadeia Posterior',
    exercicio_tipo: 'alongamento',
    exercicio_dificuldade: 'facil',
  },
  {
    id: 'mock-presc-2',
    paciente_id: 'mock-paciente',
    exercicio_id: 'mock-ex-2',
    series: 3,
    repeticoes: 10,
    frequencia: '3x por semana',
    ativo: true,
    created_at: new Date().toISOString(),
    exercicio_nome: 'Ponte Glútea',
    exercicio_tipo: 'fortalecimento',
    exercicio_dificuldade: 'moderado',
  }
];

export async function listarPrescricoes(pacienteId: string): Promise<Prescricao[]> {
  // Mock temporarily to bypass backend 500 errors caused by invalid UUIDs in seed
  return new Promise(resolve => setTimeout(() => resolve(MOCK_PRESCRICOES), 500));
}

// ── Check-ins ────────────────────────────────────────────────

export async function registrarCheckin(payload: {
  paciente_id: string;
  prescricao_id: string;
  executado: boolean;
  nivel_dor?: number;
  observacoes?: string;
}): Promise<Checkin> {
  // Mock temporarily
  return new Promise(resolve => setTimeout(() => resolve({
    id: `mock-checkin-${Date.now()}`,
    paciente_id: payload.paciente_id,
    prescricao_id: payload.prescricao_id,
    executado: payload.executado,
    nivel_dor: payload.nivel_dor,
    data: new Date().toISOString(),
    created_at: new Date().toISOString()
  }), 500));
}

export async function listarCheckins(pacienteId: string): Promise<Checkin[]> {
  return [];
}

export async function buscarEvolucao(pacienteId: string): Promise<EvolucaoSemanal[]> {
  return [];
}

export default api;
