'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role === 'paciente') router.replace('/inicio');
    else router.replace('/dashboard');
  }, [user, isLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-maya-off-white">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-maya-teal border-t-transparent" />
    </div>
  );
}
