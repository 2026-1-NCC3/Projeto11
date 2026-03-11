'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import type { Usuario } from '@/lib/types';
import { login as apiLogin, logout as apiLogout } from '@/lib/api/client';

const USER_KEY = 'user';
const TOKEN_KEY = 'access_token';

function getStoredUser(): Usuario | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  } catch {
    return null;
  }
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isProfissional: boolean;
  isPaciente: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setToken(getStoredToken());
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, senha: string) => {
      const res = await apiLogin(email, senha);
      localStorage.setItem(TOKEN_KEY, res.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      setToken(res.access_token);
      setUser(res.user);
      if (res.user.role === 'paciente') {
        router.push('/inicio');
      } else {
        router.push('/dashboard');
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    apiLogout();
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      login,
      logout,
      isLoading,
      isProfissional:
        user?.role === 'admin' || user?.role === 'profissional' || false,
      isPaciente: user?.role === 'paciente' || false,
      isAdmin: user?.role === 'admin' || false,
    }),
    [user, token, login, logout, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
