// Proteção de rota — impede que usuários não autorizados acessem páginas restritas.
// Ex: um paciente não pode entrar no /dashboard (que é só pra admin/profissional).
// Se não tiver logado, redireciona pro login. Se não tiver permissão, redireciona pra home.
'use client';

import { type ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { Role } from '@/lib/types';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];   // quais roles podem ver essa página (ex: ['admin', 'profissional'])
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // ainda carregando, não faz nada

    // Sem usuário logado? Manda pro login
    if (!user) {
      router.replace('/login');
      return;
    }

    // Logado mas sem permissão? Redireciona pra home certa
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      if (user.role === 'paciente') router.replace('/inicio');
      else router.replace('/dashboard');
    }
  }, [user, isLoading, allowedRoles, router]);

  // Enquanto verifica, mostra um spinner
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-maya-off-white">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-maya-teal border-t-transparent" />
      </div>
    );
  }

  // Sem usuário ou sem permissão: não renderiza nada (o redirect já tá acontecendo)
  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  // Tudo certo: renderiza a página
  return <>{children}</>;
}
