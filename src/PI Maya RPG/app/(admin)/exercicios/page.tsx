'use client';

import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { useExercicios } from '@/lib/hooks';
import Link from 'next/link';
import {
  Plus,
  Search,
  Dumbbell,
  PlayCircle,
  StretchHorizontal,
  ShieldCheck,
  Move3d,
  Wind,
  Columns3,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { DificuldadeBadge } from '@/components/shared/Badges';
import { TIPO_LABELS } from '@/lib/utils';
import type { TipoExercicio } from '@/lib/types';

// ─── Mapeamento de ícone, cor e gradiente por categoria ───────────────
const CATEGORY_CONFIG: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
    iconColor: string;
    borderColor: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  alongamento: {
    icon: StretchHorizontal,
    gradient: 'from-teal-50 to-cyan-50',
    iconColor: 'text-teal-400',
    borderColor: 'border-teal-100',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-700',
  },
  fortalecimento: {
    icon: ShieldCheck,
    gradient: 'from-orange-50 to-amber-50',
    iconColor: 'text-orange-400',
    borderColor: 'border-orange-100',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
  },
  mobilidade: {
    icon: Move3d,
    gradient: 'from-blue-50 to-indigo-50',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-100',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
  },
  respiratorio: {
    icon: Wind,
    gradient: 'from-emerald-50 to-green-50',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-100',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
  },
  postural: {
    icon: Columns3,
    gradient: 'from-purple-50 to-fuchsia-50',
    iconColor: 'text-purple-400',
    borderColor: 'border-purple-100',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
  },
  outro: {
    icon: Sparkles,
    gradient: 'from-gray-50 to-slate-50',
    iconColor: 'text-gray-400',
    borderColor: 'border-gray-200',
    badgeBg: 'bg-gray-50',
    badgeText: 'text-gray-700',
  },
};

function getCategoryConfig(tipo: string) {
  return CATEGORY_CONFIG[tipo] || CATEGORY_CONFIG.outro;
}

// ─── Filtro de categorias ─────────────────────────────────────────────
const ALL_CATEGORIES: { key: string; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'alongamento', label: 'Alongamento' },
  { key: 'fortalecimento', label: 'Fortalecimento' },
  { key: 'mobilidade', label: 'Mobilidade' },
  { key: 'respiratorio', label: 'Respiratório' },
  { key: 'postural', label: 'Postural' },
];

export default function ExerciciosPage() {
  const { data: exercicios, isLoading } = useExercicios();
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');

  const filtrados =
    exercicios?.filter((e) => {
      const matchBusca =
        e.nome.toLowerCase().includes(busca.toLowerCase()) ||
        (e.tags &&
          e.tags.some((t) =>
            t.toLowerCase().includes(busca.toLowerCase())
          ));
      const matchCategoria =
        categoriaAtiva === 'todos' || e.tipo === categoriaAtiva;
      return matchBusca && matchCategoria;
    }) || [];

  // Conta exercícios por categoria para os badges no filtro
  const contagem: Record<string, number> = { todos: exercicios?.length || 0 };
  exercicios?.forEach((e) => {
    contagem[e.tipo] = (contagem[e.tipo] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-maya-teal-dark">
            Exercícios
          </h1>
          <p className="text-maya-gray-soft mt-1">
            Banco de posturas de RPG e fortalecimento
          </p>
        </div>
        <Button asChild>
          <Link href="/exercicios/novo">
            <Plus className="w-4 h-4" /> Novo Exercício
          </Link>
        </Button>
      </div>

      <Card>
        {/* Barra de busca */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
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

        {/* Filtro por categoria */}
        <div className="flex flex-wrap gap-2 mb-6">
          {ALL_CATEGORIES.map((cat) => {
            const isActive = categoriaAtiva === cat.key;
            const config =
              cat.key !== 'todos' ? getCategoryConfig(cat.key) : null;
            const IconComponent = config?.icon;

            return (
              <button
                key={cat.key}
                onClick={() => setCategoriaAtiva(cat.key)}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                  transition-all duration-200 border
                  ${
                    isActive
                      ? cat.key === 'todos'
                        ? 'bg-maya-teal text-white border-maya-teal shadow-sm'
                        : `${config!.badgeBg} ${config!.badgeText} ${config!.borderColor} shadow-sm ring-1 ring-offset-1 ${config!.borderColor}`
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-700'
                  }
                `}
              >
                {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
                {cat.label}
                {contagem[cat.key] !== undefined && (
                  <span
                    className={`ml-0.5 text-[10px] ${
                      isActive ? 'opacity-80' : 'text-gray-400'
                    }`}
                  >
                    ({contagem[cat.key] || 0})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-maya-teal border-t-transparent" />
          </div>
        ) : filtrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtrados.map((e) => {
              const config = getCategoryConfig(e.tipo);
              const IconComponent = config.icon;

              return (
                <div
                  key={e.id}
                  className={`flex flex-col p-4 rounded-xl border ${config.borderColor} bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
                >
                  {/* Área do ícone com gradiente da categoria */}
                  <div
                    className={`aspect-video w-full rounded-lg bg-gradient-to-br ${config.gradient} mb-4 flex items-center justify-center relative overflow-hidden group`}
                  >
                    {e.midia_url ? (
                      <>
                        <img
                          src={e.midia_url}
                          alt={e.nome}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="w-10 h-10 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className={`p-3 rounded-2xl bg-white/60 shadow-sm backdrop-blur-sm`}>
                          <IconComponent
                            className={`w-8 h-8 ${config.iconColor}`}
                          />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                      <DificuldadeBadge dificuldade={e.dificuldade} />
                    </div>
                    {/* Badge de categoria no canto superior direito */}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${config.badgeBg} ${config.badgeText} border ${config.borderColor}`}
                      >
                        <IconComponent className="w-3 h-3" />
                        {TIPO_LABELS[e.tipo] || e.tipo}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3
                      className="font-semibold text-maya-dark line-clamp-1"
                      title={e.nome}
                    >
                      {e.nome}
                    </h3>
                    <p className="text-xs font-medium text-maya-teal mt-1">
                      {TIPO_LABELS[e.tipo] || e.tipo} • {e.musculo_alvo}
                    </p>

                    {e.tags && e.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {e.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 rounded text-[10px] border ${config.badgeBg} ${config.badgeText} ${config.borderColor}`}
                          >
                            #{tag}
                          </span>
                        ))}
                        {e.tags.length > 3 && (
                          <span className="px-1 py-0.5 text-gray-400 text-[10px]">
                            +{e.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-maya-dark">
              Nenhum exercício encontrado
            </h3>
            <p className="text-sm text-maya-gray-soft mt-1">
              Tente buscar por outro termo ou cadastre um novo exercício no
              banco de dados.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
