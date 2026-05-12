// Layout do painel administrativo.
// Envolve todas as páginas da área admin/profissional (/dashboard, /pacientes, /exercicios, etc).
// Inclui a sidebar lateral e o ProtectedRoute que bloqueia acesso de pacientes.

import { AdminSidebar } from '@/components/shared/AdminSidebar';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // Só admin e profissional podem acessar essa área
    <ProtectedRoute allowedRoles={['admin', 'profissional']}>
      <div className="flex min-h-screen bg-maya-off-white">
        <AdminSidebar />
        {/* Conteúdo principal — a página renderizada ao lado da sidebar */}
        <main className="flex-1 overflow-x-hidden pt-16 lg:pt-0 pb-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
