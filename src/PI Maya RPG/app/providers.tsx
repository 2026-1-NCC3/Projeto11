// Providers — onde a gente "embrulha" a aplicação com os contextos globais.
// Basicamente, aqui ficam as configurações que precisam estar disponíveis
// em qualquer página ou componente do sistema.
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  // Criando o cliente do React Query com cache de 5 minutos.
  // Isso evita ficar refazendo requisições toda vez que o usuário troca de aba.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 5 * 60 * 1000 }, // 5 min de cache
        },
      })
  );

  // QueryClientProvider: gerencia o cache das requisições à API
  // AuthProvider: gerencia login, logout e dados do usuário logado
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
