'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader } from '@/components/shared/Card';
import { usePacientes, useExercicios } from '@/lib/hooks';
import { Users, Dumbbell, ClipboardList, Activity } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: pacientes, isLoading: loadingPacientes } = usePacientes();
  const { data: exercicios, isLoading: loadingExercicios } = useExercicios();

  const mockStats = [
    {
      title: 'Pacientes Ativos',
      value: loadingPacientes ? '...' : pacientes?.length || 0,
      icon: Users,
      trend: '+2 neste mês',
      color: 'text-maya-teal',
      bg: 'bg-maya-teal/10',
    },
    {
      title: 'Exercícios no Banco',
      value: loadingExercicios ? '...' : exercicios?.length || 0,
      icon: Dumbbell,
      trend: '+5 recentes',
      color: 'text-maya-coral',
      bg: 'bg-maya-coral/10',
    },
    {
      title: 'Avaliações Pendentes',
      value: '3',
      icon: ClipboardList,
      trend: 'Atenção necessária',
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      title: 'Check-ins Hoje',
      value: '12',
      icon: Activity,
      trend: '80% de adesão',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-maya-teal-dark">
            Olá, {user?.nome?.split(' ')[0]} 👋
          </h1>
          <p className="text-maya-gray-soft mt-1">
            Aqui está o resumo da clínica hoje.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/pacientes/novo">Novo Paciente</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/exercicios/novo">Novo Exercício</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {mockStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="flex flex-col">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-maya-gray-soft">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-maya-dark">{stat.value}</h3>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-xs text-maya-gray-soft">{stat.trend}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Pacientes Recentes" subtitle="Últimos pacientes cadastrados" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-maya-gray-soft">
              <thead className="text-xs text-maya-dark uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Nome</th>
                  <th className="px-4 py-3">Contato</th>
                  <th className="px-4 py-3 rounded-r-lg text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {loadingPacientes ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center">Carregando pacientes...</td>
                  </tr>
                ) : pacientes && pacientes.length > 0 ? (
                  pacientes.slice(0, 5).map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-maya-dark">{p.nome}</td>
                      <td className="px-4 py-3">{p.telefone || p.email}</td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/pacientes/${p.id}`} className="text-maya-teal hover:underline font-medium">
                          Ver Tabela
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center">Nenhum paciente cadastrado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="Ações Rápidas" />
          <div className="space-y-3">
            <Link
              href="/pacientes"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-maya-teal hover:bg-maya-teal/5 transition-colors group"
            >
              <div className="p-2 bg-gray-50 rounded-md group-hover:bg-white transition-colors">
                <Users className="w-5 h-5 text-maya-gray-soft group-hover:text-maya-teal" />
              </div>
              <div>
                <p className="font-medium text-maya-dark text-sm">Gerenciar Pacientes</p>
                <p className="text-xs text-maya-gray-soft">Ver todos os prontuários</p>
              </div>
            </Link>
            
            <Link
              href="/exercicios"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-maya-teal hover:bg-maya-teal/5 transition-colors group"
            >
              <div className="p-2 bg-gray-50 rounded-md group-hover:bg-white transition-colors">
                <Dumbbell className="w-5 h-5 text-maya-gray-soft group-hover:text-maya-teal" />
              </div>
              <div>
                <p className="font-medium text-maya-dark text-sm">Biblioteca de Exercícios</p>
                <p className="text-xs text-maya-gray-soft">Atualizar vídeos e fotos</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
