import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, logout as apiLogout } from '../api/client';
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

  const login = useCallback(async (email: string, senha: string) => {
    const response = await apiLogin(email, senha);

    // Salvar token e user no AsyncStorage
    await Promise.all([
      AsyncStorage.setItem('access_token', response.access_token),
      AsyncStorage.setItem('user', JSON.stringify(response.user)),
    ]);

    setUser(response.user);
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
