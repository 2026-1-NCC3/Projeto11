// Página raiz do site ("/"). 
// Ela não exibe nada — só redireciona o usuário pro lugar certo.
// Se não tiver logado, manda pro /login.
// Se for paciente, manda pro /inicio. Se for admin/profissional, manda pro /dashboard.
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Assim que a autenticação terminar de carregar, redireciona automaticamente
  useEffect(() => {
    if (isLoading) return; // ainda verificando o token no localStorage
    if (!user) {
      router.replace('/login');
      return;
    }
    // Paciente vai pra tela inicial dele, admin/profissional pro dashboard
    if (user.role === 'paciente') router.replace('/inicio');
    else router.replace('/dashboard');
  }, [user, isLoading, router]);

  // Enquanto decide pra onde mandar, mostra só um spinner de carregamento
  return (
    <div className="flex min-h-screen items-center justify-center bg-maya-off-white">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-maya-teal border-t-transparent" />
    </div>
  );
}
