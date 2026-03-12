'use client';

import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { useExercicios } from '@/lib/hooks';
import Link from 'next/link';
import { Plus, Search, Dumbbell, PlayCircle } from 'lucide-react';
import { useState } from 'react';
import { DificuldadeBadge } from '@/components/shared/Badges';
import { TIPO_LABELS } from '@/lib/utils';

export default function ExerciciosPage() {
  const { data: exercicios, isLoading } = useExercicios();
  const [busca, setBusca] = useState('');

  const filtrados = exercicios?.filter(e => 
    e.nome.toLowerCase().includes(busca.toLowerCase()) || 
    (e.tags && e.tags.some(t => t.toLowerCase().includes(busca.toLowerCase())))
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-maya-teal-dark">Exercícios</h1>
          <p className="text-maya-gray-soft mt-1">Banco de posturas de RPG e fortalecimento</p>
        </div>
        <Button asChild>
          <Link href="/exercicios/novo">
            <Plus className="w-4 h-4" /> Novo Exercício
          </Link>
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-maya-gray-soft" />
            <input
              type="text"
              placeholder="Buscar por nome ou tag..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtrados.map((e) => (
              <div key={e.id} className="flex flex-col p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video w-full rounded-lg bg-gray-100 mb-4 flex items-center justify-center relative overflow-hidden group">
                  {e.midia_url ? (
                    <>
                      <img src={e.midia_url} alt={e.nome} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-10 h-10 text-white" />
                      </div>
                    </>
                  ) : (
                    <Dumbbell className="w-8 h-8 text-gray-300" />
                  )}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    <DificuldadeBadge dificuldade={e.dificuldade} />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-maya-dark line-clamp-1" title={e.nome}>{e.nome}</h3>
                  <p className="text-xs font-medium text-maya-teal mt-1">
                    {TIPO_LABELS[e.tipo] || e.tipo} • {e.musculo_alvo}
                  </p>
                  
                  {e.tags && e.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {e.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-[10px] border border-gray-100">
                          #{tag}
                        </span>
                      ))}
                      {e.tags.length > 3 && (
                        <span className="px-1 py-0.5 text-gray-400 text-[10px]">+{e.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-maya-dark">Nenhum exercício encontrado</h3>
            <p className="text-sm text-maya-gray-soft mt-1">Tente buscar por outro termo ou cadastre um novo exercício no banco de dados.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
