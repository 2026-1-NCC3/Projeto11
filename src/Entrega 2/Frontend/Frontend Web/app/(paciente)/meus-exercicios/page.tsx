'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/shared/Card';
import { usePrescricoes } from '@/lib/hooks';
import Link from 'next/link';
import { Dumbbell, PlayCircle } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { DificuldadeBadge } from '@/components/shared/Badges';

export default function MeusExerciciosPage() {
  const { user } = useAuth();
  const pacienteId = user?.id || '';
  
  const { data: prescricoes, isLoading } = usePrescricoes(pacienteId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-maya-teal-dark">Meus Exercícios</h1>
        <p className="text-maya-gray-soft mt-1">Sua rotina personalizada de RPG</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-maya-teal border-t-transparent" />
        </div>
      ) : prescricoes && prescricoes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prescricoes.map((p) => (
            <Card key={p.id} className="flex flex-col sm:flex-row gap-4 p-4">
              <div className="w-full sm:w-32 aspect-video sm:aspect-square rounded-lg bg-gray-100 flex-shrink-0 relative overflow-hidden flex items-center justify-center group">
                {p.exercicio_midia_url ? (
                  <>
                    <img src={p.exercicio_midia_url} alt={p.exercicio_nome} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="w-8 h-8 text-white" />
                    </div>
                  </>
                ) : (
                  <Dumbbell className="w-8 h-8 text-gray-300" />
                )}
                {p.exercicio_dificuldade && (
                  <div className="absolute top-2 left-2">
                    <DificuldadeBadge dificuldade={p.exercicio_dificuldade} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col">
                <h3 className="font-semibold text-maya-dark">{p.exercicio_nome}</h3>
                
                <div className="mt-2 text-sm text-maya-gray-soft space-y-1">
                  <p><span className="font-medium text-maya-dark">Objetivo:</span> {p.exercicio_musculo}</p>
                  <p><span className="font-medium text-maya-dark">Séries:</span> {p.series}</p>
                  <p><span className="font-medium text-maya-dark">Repetições:</span> {p.repeticoes}</p>
                  <p><span className="font-medium text-maya-dark">Frequência:</span> {p.frequencia}</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                  <Button asChild size="sm">
                    <Link href={`/meus-exercicios/${p.id}`}>Ver Detalhes</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-maya-dark">Nenhum exercício prescrito</h3>
          <p className="text-sm text-maya-gray-soft mt-1">Sua fisioterapeuta ainda não prescreveu exercícios para você.</p>
        </Card>
      )}
    </div>
  );
}
