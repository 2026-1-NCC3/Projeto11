'use client';

import { Card, CardHeader } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { usePacientes } from '@/lib/hooks';
import Link from 'next/link';
import { Plus, Search, UserCircle, Phone } from 'lucide-react';
import { Input } from '@/components/shared/Input';
import { useState } from 'react';
import { StatusBadge } from '@/components/shared/Badges';

export default function PacientesPage() {
  const { data: pacientes, isLoading } = usePacientes();
  const [busca, setBusca] = useState('');

  const filtrados = pacientes?.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) || 
    p.email.toLowerCase().includes(busca.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-maya-teal-dark">Pacientes</h1>
          <p className="text-maya-gray-soft mt-1">Gerencie os prontuários e prescrições</p>
        </div>
        <Button asChild>
          <Link href="/pacientes/novo">
            <Plus className="w-4 h-4" /> Novo Paciente
          </Link>
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-maya-gray-soft" />
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-maya focus:outline-none focus:ring-2 focus:ring-maya-teal text-sm"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-maya-teal border-t-transparent" />
          </div>
        ) : filtrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtrados.map((p) => (
              <Link key={p.id} href={`/pacientes/${p.id}`} className="block">
                <div className="p-4 rounded-xl border border-gray-100 hover:border-maya-teal hover:shadow-maya transition-all bg-gray-50/50 hover:bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-maya-teal/10 flex items-center justify-center text-maya-teal-dark font-bold">
                        {p.nome.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-maya-dark">{p.nome}</h3>
                        <StatusBadge status={p.ativo ? 'ativo' : 'inativo'} className="mt-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-maya-gray-soft">
                      <Phone className="w-4 h-4" />
                      <span>{p.telefone || 'Sem telefone'}</span>
                    </div>
                    {p.queixa_principal && (
                      <p className="text-xs text-maya-gray-soft line-clamp-2 mt-2">
                        <span className="font-medium mr-1">Queixa:</span>
                        {p.queixa_principal}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-maya-dark">Nenhum paciente encontrado</h3>
            <p className="text-sm text-maya-gray-soft mt-1">Tente buscar por outro termo ou cadastre um novo paciente.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
