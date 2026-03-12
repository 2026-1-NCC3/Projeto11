import { PacienteSidebar } from '@/components/shared/PacienteSidebar';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

export default function PacienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['paciente']}>
      <div className="flex min-h-screen bg-maya-off-white">
        <PacienteSidebar />
        <main className="flex-1 w-full lg:pl-64 pb-20 lg:pb-8">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
