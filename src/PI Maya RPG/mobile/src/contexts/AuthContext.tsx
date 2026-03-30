import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, logout as apiLogout, getMe } from '../api/client';
import type { User } from '../types';

// ── Tipagem do Contexto ──────────────────────────────────────

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// ── Provider ─────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega sessão salva no boot
  useEffect(() => {
    async function loadStoredSession() {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem('access_token'),
          AsyncStorage.getItem('user'),
        ]);

        if (storedToken && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        // Storage corrompido — desloga
        await AsyncStorage.multiRemove(['access_token', 'user']);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredSession();
  }, []);

  // Mapeamento de fallback dos pacientes de teste (seed.sql)
  // Usado quando o backend não retorna paciente_id
  const SEED_PACIENTE_MAP: Record<string, string> = {
    'c0000000-0000-0000-0000-000000000001': 'p0000000-0000-0000-0000-000000000001', // Carlos
    'c0000000-0000-0000-0000-000000000002': 'p0000000-0000-0000-0000-000000000002', // Ana
    'c0000000-0000-0000-0000-000000000003': 'p0000000-0000-0000-0000-000000000003', // Roberto
    'd0000000-0000-0000-0000-000000000002': 'p0000000-0000-0000-0000-000000000004', // Teste
  };

  const login = useCallback(async (email: string, senha: string) => {
    const response = await apiLogin(email, senha);

    // Salvar token primeiro (necessário para o interceptor do axios)
    await AsyncStorage.setItem('access_token', response.access_token);

    let userData = response.user;

    // Se paciente_id não veio no login, buscar via /auth/me
    if (!userData.paciente_id && userData.role === 'paciente') {
      try {
        const meData = await getMe();
        if (meData.paciente_id) {
          userData = { ...userData, paciente_id: meData.paciente_id };
        }
      } catch {
        // Se /auth/me falhar, segue para o fallback
      }
    }

    // Fallback: usar mapeamento do seed se ainda não tiver paciente_id
    if (!userData.paciente_id && userData.role === 'paciente' && SEED_PACIENTE_MAP[userData.id]) {
      userData = { ...userData, paciente_id: SEED_PACIENTE_MAP[userData.id] };
    }

    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    await AsyncStorage.multiRemove(['access_token', 'user']);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context || Object.keys(context).length === 0) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
