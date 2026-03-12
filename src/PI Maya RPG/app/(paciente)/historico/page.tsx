'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/shared/Card';
import { useCheckins, useEvolucao } from '@/lib/hooks';
import { Activity, Calendar as CalendarIcon, CheckCircle2, TrendingUp } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { useState } from 'react';

export default function HistoricoPage() {
  const { user } = useAuth();
  const pacienteId = user?.id || '';
  
  const { data: checkins, isLoading: loadingCheckins } = useCheckins(pacienteId);
  const { data: evolucao, isLoading: loadingEvolucao } = useEvolucao(pacienteId);

  const [tab, setTab] = useState<'checkins' | 'evolucao'>('checkins');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-maya-teal-dark">Histórico e Evolução</h1>
        <p className="text-maya-gray-soft mt-1">Acompanhe seu progresso no tratamento</p>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            tab === 'checkins' 
              ? 'border-maya-teal text-maya-teal-dark' 
              : 'border-transparent text-maya-gray-soft hover:text-maya-dark'
          }`}
          onClick={() => setTab('checkins')}
        >
          Check-ins Recentes
        </button>
        <button
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            tab === 'evolucao' 
              ? 'border-maya-teal text-maya-teal-dark' 
              : 'border-transparent text-maya-gray-soft hover:text-maya-dark'
          }`}
          onClick={() => setTab('evolucao')}
        >
          Resumo Semanal
        </button>
      </div>

      {tab === 'checkins' && (
        <Card className="p-0 overflow-hidden">
          {loadingCheckins ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-maya-teal border-t-transparent" />
            </div>
          ) : checkins && checkins.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {checkins.map((c) => (
                <div key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-2 rounded-full ${c.executado ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                      {c.executado ? <CheckCircle2 className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-maya-dark">{c.exercicio_nome}</h4>
                      <p className="text-xs text-maya-gray-soft flex items-center gap-1 mt-1">
                        <CalendarIcon className="w-3 h-3" />
                        {c.data.split('T')[0].split('-').reverse().join('/')} 
                        {' • '}
                        Registrado às {formatDateTime(c.created_at).split(' ')[1]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    {c.executado ? (
                      <span className="text-emerald-600 font-medium">Executado</span>
                    ) : (
                      <span className="text-red-500 font-medium">Não executado</span>
                    )}
                    
                    {c.nivel_dor !== undefined && c.nivel_dor !== null && (
                      <div className="flex items-center gap-1">
                        <Activity className={`w-4 h-4 ${c.nivel_dor > 6 ? 'text-red-500' : c.nivel_dor > 3 ? 'text-amber-500' : 'text-emerald-500'}`} />
                        <span className="font-medium text-maya-dark">Dor: {c.nivel_dor}/10</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-12">
               <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
               <h3 className="text-lg font-medium text-maya-dark">Nenhum check-in registrado</h3>
               <p className="text-sm text-maya-gray-soft mt-1">Quando você começar a fazer seus exercícios, o histórico aparecerá aqui.</p>
             </div>
          )}
        </Card>
      )}

      {tab === 'evolucao' && (
        <Card>
          {loadingEvolucao ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-maya-teal border-t-transparent" />
            </div>
          ) : evolucao && evolucao.length > 0 ? (
            <div className="space-y-6">
              {evolucao.map((ev, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-maya-teal-dark text-white flex flex-col items-center justify-center">
                      <span className="text-xs font-medium uppercase opacity-80">Semana</span>
                      <span className="text-lg font-bold">{ev.semana.split('-')[1]}/{ev.semana.split('-')[2].substring(0,2)}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-maya-dark">Semana de {ev.semana.split('T')[0].split('-').reverse().join('/')}</h4>
                      <p className="text-sm text-maya-gray-soft">{ev.executados} de {ev.total} check-ins concluídos</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-xs text-maya-gray-soft font-medium uppercase">Adesão</p>
                      <p className="text-xl font-bold text-maya-teal">{ev.taxa_execucao}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-maya-gray-soft font-medium uppercase">Dor Média</p>
                      <p className={`text-xl font-bold ${ev.media_dor > 6 ? 'text-red-500' : ev.media_dor > 3 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {ev.media_dor}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
               <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
               <h3 className="text-lg font-medium text-maya-dark">Sem dados de evolução</h3>
               <p className="text-sm text-maya-gray-soft mt-1">Acompanhe pelo menos uma semana de exercícios para ver sua evolução.</p>
             </div>
          )}
        </Card>
      )}
    </div>
  );
}
