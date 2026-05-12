'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { usePacientes } from '@/lib/hooks';
import { ClipboardList, Plus, User, Calendar, Activity, CheckCircle2 } from 'lucide-react';

interface Avaliacao {
  id: string;
  pacienteNome: string;
  data: string;
  nivelDor: number;
  evolucao: 'Piorou' | 'Estável' | 'Melhorou';
  anotacoes: string;
}

export default function AvaliacoesPage() {
  const { data: pacientes, isLoading } = usePacientes();
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [novaAvaliacao, setNovaAvaliacao] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [form, setForm] = useState({
    pacienteId: '',
    pacienteNome: '',
    nivelDor: 5,
    evolucao: 'Estável' as 'Piorou' | 'Estável' | 'Melhorou',
    anotacoes: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('maya_avaliacoes');
    if (saved) {
      setAvaliacoes(JSON.parse(saved));
    }
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.pacienteId) return alert('Selecione um paciente!');

    setLoading(true);
    
    // Simula API delay
    setTimeout(() => {
      const nova: Avaliacao = {
        id: Date.now().toString(),
        pacienteNome: form.pacienteNome,
        data: new Date().toLocaleDateString('pt-BR'),
        nivelDor: form.nivelDor,
        evolucao: form.evolucao,
        anotacoes: form.anotacoes
      };

      const atualizadas = [nova, ...avaliacoes];
      setAvaliacoes(atualizadas);
      localStorage.setItem('maya_avaliacoes', JSON.stringify(atualizadas));
      
      setNovaAvaliacao(false);
      setForm({ pacienteId: '', pacienteNome: '', nivelDor: 5, evolucao: 'Estável', anotacoes: '' });
      setLoading(false);
    }, 600);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-maya-teal-dark">Avaliações e Evolução</h1>
          <p className="text-maya-gray-soft mt-1">Registre o progresso clínico e nível de dor dos pacientes</p>
        </div>
        <Button onClick={() => setNovaAvaliacao(!novaAvaliacao)}>
          {novaAvaliacao ? 'Cancelar' : <><Plus className="w-4 h-4 mr-1" /> Nova Avaliação</>}
        </Button>
      </div>

      {novaAvaliacao && (
        <Card className="border-maya-teal/30 shadow-sm">
          <CardHeader title="Registrar Nova Avaliação" />
          <form onSubmit={handleSave} className="p-6 pt-0 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-maya-dark mb-1">Paciente</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-maya focus:outline-none focus:ring-2 focus:ring-maya-teal bg-white"
                  value={form.pacienteId}
                  onChange={(e) => {
                    const id = e.target.value;
                    const nome = pacientes?.find(p => p.id === id)?.nome || '';
                    setForm({ ...form, pacienteId: id, pacienteNome: nome });
                  }}
                  required
                >
                  <option value="">Selecione um paciente...</option>
                  {pacientes?.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-maya-dark mb-1">Status de Evolução</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-maya focus:outline-none focus:ring-2 focus:ring-maya-teal bg-white"
                  value={form.evolucao}
                  onChange={(e) => setForm({ ...form, evolucao: e.target.value as any })}
                >
                  <option value="Melhorou">Melhorou</option>
                  <option value="Estável">Estável</option>
                  <option value="Piorou">Piorou</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-maya-dark mb-1 flex justify-between">
                <span>Nível de Dor Atual (Escala EVA)</span>
                <span className="font-bold text-maya-teal">{form.nivelDor} / 10</span>
              </label>
              <input
                type="range"
                min="0" max="10"
                value={form.nivelDor}
                onChange={(e) => setForm({...form, nivelDor: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-maya-teal"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Sem Dor (0)</span>
                <span>Dor Extrema (10)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-maya-dark mb-1">Anotações Clínicas</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-200 rounded-maya focus:outline-none focus:ring-2 focus:ring-maya-teal min-h-[100px]"
                placeholder="Descreva as queixas relatadas, testes ortopédicos realizados ou progresso nos exercícios..."
                value={form.anotacoes}
                onChange={(e) => setForm({...form, anotacoes: e.target.value})}
                required
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" loading={loading}>
                Salvar Avaliação
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="p-6">
          <h3 className="font-medium text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-3 text-maya-dark">
            <ClipboardList className="w-5 h-5 text-maya-teal" /> Histórico de Avaliações
          </h3>

          {avaliacoes.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <h3 className="text-gray-500">Nenhuma avaliação registrada ainda.</h3>
              <p className="text-sm text-gray-400 mt-1">Clique em "Nova Avaliação" para registrar.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {avaliacoes.map((av) => (
                <div key={av.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex flex-col lg:flex-row justify-between gap-4 hover:border-maya-teal/30 transition-colors">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-maya-teal/10 flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-maya-teal" />
                        </div>
                        <span className="font-semibold text-maya-dark">{av.pacienteNome}</span>
                      </div>
                      <span className="text-gray-300 hidden sm:inline">|</span>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {av.data}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-100 italic shadow-sm">
                      "{av.anotacoes}"
                    </p>
                  </div>
                  
                  <div className="lg:w-56 shrink-0 flex flex-col gap-2 justify-center">
                    <div className="bg-white px-3 py-2 rounded-lg border border-gray-100 flex justify-between items-center text-sm shadow-sm">
                      <span className="text-gray-500">Dor:</span>
                      <span className={`font-bold ${av.nivelDor > 7 ? 'text-red-500' : av.nivelDor > 3 ? 'text-orange-500' : 'text-emerald-500'}`}>
                        {av.nivelDor}/10
                      </span>
                    </div>
                    <div className="bg-white px-3 py-2 rounded-lg border border-gray-100 flex justify-between items-center text-sm shadow-sm">
                      <span className="text-gray-500">Evolução:</span>
                      <span className={`font-medium flex items-center gap-1.5 ${
                        av.evolucao === 'Melhorou' ? 'text-emerald-600' :
                        av.evolucao === 'Piorou' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {av.evolucao === 'Melhorou' && <CheckCircle2 className="w-4 h-4" />}
                        {av.evolucao}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
