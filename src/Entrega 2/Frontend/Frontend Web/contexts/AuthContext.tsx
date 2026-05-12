// Contexto de autenticação — controla quem tá logado no sistema.
// Salva o token JWT e os dados do usuário no localStorage,
// e fornece pra toda a aplicação via React Context (useAuth).
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

// Chaves usadas pra guardar os dados no localStorage do navegador
const USER_KEY = 'user';
const TOKEN_KEY = 'access_token';

// Recupera o usuário salvo no navegador (se tiver)
function getStoredUser(): Usuario | null {
  if (typeof window === 'undefined') return null; // roda no servidor? ignora
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  } catch {
    return null; // se o JSON tiver corrompido, retorna null
  }
}

// Recupera o token JWT salvo no navegador
function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

// Tipos do contexto — o que vai ficar disponível pra quem chamar useAuth()
export interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;       // true enquanto verifica se tem sessão salva
  isProfissional: boolean;  // atalho: admin ou profissional
  isPaciente: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Provider principal — "envolve" toda a aplicação com os dados de autenticação
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Na primeira vez que abre o site, verifica se já tem sessão salva
  useEffect(() => {
    setUser(getStoredUser());
    setToken(getStoredToken());
    setIsLoading(false);
  }, []);

  // Faz o login: chama a API, salva os dados e redireciona
  const login = useCallback(
    async (email: string, senha: string) => {
      const res = await apiLogin(email, senha);
      localStorage.setItem(TOKEN_KEY, res.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      setToken(res.access_token);
      setUser(res.user);
      // Paciente vai pro portal dele, admin/profissional pro dashboard
      if (res.user.role === 'paciente') {
        router.push('/inicio');
      } else {
        router.push('/dashboard');
      }
    },
    [router]
  );

  // Faz o logout: limpa tudo e manda pro login
  const logout = useCallback(() => {
    apiLogout();
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  // Monta o objeto do contexto com atalhos úteis (isPaciente, isAdmin, etc)
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

// Hook pra usar em qualquer componente: const { user, login, logout } = useAuth()
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
