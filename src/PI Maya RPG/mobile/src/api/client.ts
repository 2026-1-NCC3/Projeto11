import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LoginResponse, Prescricao, Checkin, EvolucaoSemanal, User } from '../types';

// ── Configuração ─────────────────────────────────────────────
// Produção (Render):
const API_URL = 'https://maya-rpg-api.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
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

export async function listarPrescricoes(pacienteId: string): Promise<Prescricao[]> {
  const { data } = await api.get<Prescricao[]>(`/prescricoes/paciente/${pacienteId}`);
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

export default api;
