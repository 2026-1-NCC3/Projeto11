'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { buscarPaciente, listarPrescricoes, listarExercicios, criarPrescricao } from '@/lib/api/client';
import type { Paciente, Prescricao, Exercicio } from '@/lib/types';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/shared/Badges';

export default function PacienteDetalhesPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [prescricoes, setPrescricoes] = useState<Prescricao[]>([]);
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para o formulário de nova prescrição
  const [showForm, setShowForm] = useState(false);
  const [prescricaoForm, setPrescricaoForm] = useState({
    exercicio_id: '',
    series: 3,
    repeticoes: 10,
    duracao_seg: 0,
    frequencia: 'Diário',
    observacoes: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [pacienteData, prescricoesData, exerciciosData] = await Promise.all([
          buscarPaciente(params.id),
          listarPrescricoes(params.id),
          listarExercicios()
        ]);
        setPaciente(pacienteData);
        setPrescricoes(prescricoesData);
        setExercicios(exerciciosData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.id]);

  async function handlePrescrever(e: React.FormEvent) {
    e.preventDefault();
    if (!prescricaoForm.exercicio_id) return alert('Selecione um exercício');
    
    setFormLoading(true);
    try {
      await criarPrescricao({
        paciente_id: params.id,
        exercicio_id: prescricaoForm.exercicio_id,
        series: prescricaoForm.series,
        repeticoes: prescricaoForm.repeticoes,
        duracao_seg: prescricaoForm.duracao_seg || undefined,
        frequencia: prescricaoForm.frequencia,
        observacoes: prescricaoForm.observacoes
      });
      // Atualiza a lista
      const atualizadas = await listarPrescricoes(params.id);
      setPrescricoes(atualizadas);
      setShowForm(false);
      alert('Exercício prescrito com sucesso! Verifique no App Mobile.');
    } catch (err) {
      console.error(err);
      alert('Erro ao prescrever exercício');
    } finally {
      setFormLoading(false);
    }
  }

  if (loading) return <div className="p-8 text-center">Carregando dados...</div>;
  if (!paciente) return <div className="p-8 text-center text-red-500">Paciente não encontrado</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/pacientes" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-maya-teal-dark">{paciente.nome}</h1>
          <p className="text-maya-gray-soft mt-1">{paciente.email} | {paciente.telefone}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info lateral */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Informações" />
            <div className="space-y-4 p-5 pt-0">
              <div>
                <span className="block text-xs text-gray-500 mb-1">Status</span>
                <StatusBadge status={paciente.ativo ? 'ativo' : 'inativo'} />
              </div>
              <div>
                <span className="block text-xs text-gray-500 mb-1">Queixa Principal</span>
                <p className="text-sm text-gray-800">{paciente.queixa_principal || 'Nenhuma registrada'}</p>
              </div>
              <div>
                <span className="block text-xs text-gray-500 mb-1">Objetivos</span>
                <p className="text-sm text-gray-800">{paciente.objetivos || '-'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Área principal - Prescrições */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="flex justify-between items-center p-5 pb-0 mb-4">
              <h2 className="font-semibold text-lg">Prescrições Ativas ({prescricoes.length})</h2>
              <Button size="sm" onClick={() => setShowForm(!showForm)}>
                <Plus className="w-4 h-4 mr-1" /> Prescrever
              </Button>
            </div>

            {showForm && (
              <div className="mx-5 mb-6 p-4 border border-maya-teal/30 bg-maya-teal/5 rounded-xl">
                <h3 className="font-medium text-maya-teal-dark mb-3">Nova Prescrição</h3>
                <form onSubmit={handlePrescrever} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1 text-gray-700">Selecione o Exercício</label>
                    <select
                      className="w-full p-2 border rounded"
                      required
                      value={prescricaoForm.exercicio_id}
                      onChange={e => setPrescricaoForm({...prescricaoForm, exercicio_id: e.target.value})}
                    >
                      <option value="">-- Escolha --</option>
                      {exercicios.map(ex => (
                        <option key={ex.id} value={ex.id}>{ex.nome} ({ex.tipo})</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Séries" type="number" required value={prescricaoForm.series} onChange={e => setPrescricaoForm({...prescricaoForm, series: parseInt(e.target.value)})} />
                    <Input label="Repetições" type="number" required value={prescricaoForm.repeticoes} onChange={e => setPrescricaoForm({...prescricaoForm, repeticoes: parseInt(e.target.value)})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Duração (segundos, 0 se não houver)" type="number" value={prescricaoForm.duracao_seg} onChange={e => setPrescricaoForm({...prescricaoForm, duracao_seg: parseInt(e.target.value)})} />
                    <Input label="Frequência" value={prescricaoForm.frequencia} onChange={e => setPrescricaoForm({...prescricaoForm, frequencia: e.target.value})} />
                  </div>
                  <Input label="Observações / Dicas" value={prescricaoForm.observacoes} onChange={e => setPrescricaoForm({...prescricaoForm, observacoes: e.target.value})} />
                  
                  <div className="flex justify-end pt-2">
                    <Button type="submit" loading={formLoading}>Salvar e Enviar para App</Button>
                  </div>
                </form>
              </div>
            )}

            <div className="p-5 pt-0 space-y-3">
              {prescricoes.length === 0 ? (
                <p className="text-gray-500 text-sm italic">Nenhum exercício prescrito para este paciente.</p>
              ) : (
                prescricoes.map((p: any) => (
                  <div key={p.id} className="p-3 bg-gray-50 border border-gray-100 rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-maya-dark">{p.exercicio_nome || 'Exercício ' + p.exercicio_id.substring(0,4)}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {p.series}x{p.repeticoes} {p.duracao_seg ? `| ${p.duracao_seg}s` : ''} | {p.frequencia}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
