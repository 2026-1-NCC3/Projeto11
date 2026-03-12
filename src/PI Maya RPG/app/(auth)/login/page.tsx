'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Dumbbell } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, senha);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-maya-off-white p-4">
      <div className="w-full max-w-md bg-white rounded-maya shadow-maya p-8 border border-gray-100">
        
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-maya-teal/10 text-maya-teal rounded-full flex items-center justify-center mb-4">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h1 className="font-display text-2xl font-bold text-maya-dark">Maya RPG</h1>
          <p className="text-sm text-maya-gray-soft mt-1">
            Sistema de Gestão e Portal do Paciente
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="E-mail"
            type="email"
            required
            placeholder="Seu e-mail cadastrado"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Senha"
            type="password"
            required
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              Entrar no sistema
            </Button>
          </div>
        </form>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-xs text-gray-500 border border-gray-200">
            <p className="font-semibold mb-2">Logins de teste (Dev):</p>
            <ul className="space-y-1">
              <li>Admin: <code className="bg-gray-200 px-1 py-0.5 rounded">teste@maya.com</code> / 123456</li>
              <li>Paciente: <code className="bg-gray-200 px-1 py-0.5 rounded">paciente@maya.com</code> / 123456</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
