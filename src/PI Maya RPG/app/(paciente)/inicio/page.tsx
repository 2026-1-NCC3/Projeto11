'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/shared/Card';
import { useCheckins, usePrescricoes } from '@/lib/hooks';
import Link from 'next/link';
import { Dumbbell, Calendar, Activity, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/shared/Button';

export default function PacienteInicioPage() {
  const { user } = useAuth();
  
  // Como estamos no portal do paciente, o id do usuario é o paciente_id nas tabelas (na vdd paciente tem seu proprio id apontando pro usuario)
  // No mock do backend, a gente assume que o patient-id tá amarrado ou pegamos do contexto.
  // Para MVP, vamos assumir que user.id seja o paciente_id ou a API filtra pelo token.
  // Pelo design da API, a rota de paciente exige pacienteId. Vamos usar o ID do usuario logado (em um app real a API faria `WHERE paciente.usuario_id = req.user.id`).
  
  const pacienteId = user?.id || '';
  
  const { data: prescricoes } = usePrescricoes(pacienteId);
  const { data: checkins } = useCheckins(pacienteId);

  const checkinsHoje = checkins?.filter(c => {
    const hoje = new Date().toISOString().split('T')[0];
    return c.data.startsWith(hoje);
  }) || [];

  const pendentesHoje = (prescricoes?.length || 0) - checkinsHoje.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-maya-teal-dark">
            Olá, {user?.nome?.split(' ')[0]} 👋
          </h1>
          <p className="text-maya-gray-soft mt-1">Como você está se sentindo hoje?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-maya-teal text-white border-0 shadow-lg">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white/90">Tarefas de Hoje</h3>
              <Calendar className="w-5 h-5 text-white/80" />
            </div>
            <div className="mt-auto">
              <p className="text-3xl font-bold">{pendentesHoje > 0 ? pendentesHoje : '0'}</p>
              <p className="text-sm text-white/80 mt-1">
                {pendentesHoje === 0 
                  ? 'Tudo concluído!' 
                  : pendentesHoje === 1 ? 'exercício pendente' : 'exercícios pendentes'}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-maya-dark">Check-ins</h3>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="mt-auto">
              <p className="text-3xl font-bold text-maya-dark">{checkinsHoje.length}</p>
              <p className="text-sm text-maya-gray-soft mt-1">realizados hoje</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-maya-dark">Dor Média</h3>
              <Activity className="w-5 h-5 text-maya-coral" />
            </div>
            <div className="mt-auto">
              <p className="text-3xl font-bold text-maya-dark">
                {checkinsHoje.length > 0 
                  ? (checkinsHoje.reduce((acc, c) => acc + (c.nivel_dor || 0), 0) / checkinsHoje.length).toFixed(1)
                  : '--'}
              </p>
              <p className="text-sm text-maya-gray-soft mt-1">nível hoje (0-10)</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-maya-dark">Seus Exercícios</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/meus-exercicios">Ver todos</Link>
          </Button>
        </div>

        {prescricoes && prescricoes.length > 0 ? (
          <div className="space-y-3">
            {prescricoes.slice(0, 3).map((p) => {
              const feitoHoje = checkinsHoje.some(c => c.prescricao_id === p.id);
              
              return (
                <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-maya-teal/10 flex items-center justify-center text-maya-teal">
                      <Dumbbell className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-maya-dark">{p.exercicio_nome}</h4>
                      <p className="text-xs text-maya-gray-soft mt-0.5">
                        {p.series}x {p.repeticoes} rep • {p.frequencia}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    {feitoHoje ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100">
                        <CheckCircle2 className="w-4 h-4" /> Concluído
                      </span>
                    ) : (
                      <Button asChild size="sm">
                        <Link href={`/meus-exercicios/${p.id}`}>Fazer agora</Link>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-maya-gray-soft">Nenhum exercício prescrito no momento.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
