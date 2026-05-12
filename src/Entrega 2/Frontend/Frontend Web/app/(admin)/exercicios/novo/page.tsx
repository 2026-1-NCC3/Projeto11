'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { criarExercicio } from '@/lib/api/client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NovoExercicioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    instrucoes: '',
    musculo_alvo: '',
    tipo: 'alongamento' as const,
    dificuldade: 'facil' as const,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await criarExercicio(formData);
      router.push('/exercicios');
    } catch (err) {
      console.error(err);
      alert('Erro ao criar exercício');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/exercicios" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-maya-teal-dark">Novo Exercício</h1>
          <p className="text-maya-gray-soft mt-1">Adicione um novo exercício ao banco</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Nome do Exercício"
            required
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />
          <Input
            label="Descrição Curta"
            required
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-maya-dark mb-1">Instruções Passo a Passo</label>
            <textarea
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-maya focus:outline-none focus:ring-2 focus:ring-maya-teal min-h-[100px]"
              value={formData.instrucoes}
              onChange={(e) => setFormData({ ...formData, instrucoes: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Músculo Alvo"
              required
              value={formData.musculo_alvo}
              onChange={(e) => setFormData({ ...formData, musculo_alvo: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-maya-dark mb-1">Dificuldade</label>
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-maya focus:outline-none focus:ring-2 focus:ring-maya-teal"
                value={formData.dificuldade}
                onChange={(e) => setFormData({ ...formData, dificuldade: e.target.value as any })}
              >
                <option value="facil">Fácil</option>
                <option value="moderado">Moderado</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-maya-dark mb-1">Categoria</label>
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-maya focus:outline-none focus:ring-2 focus:ring-maya-teal"
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
            >
              <option value="alongamento">Alongamento</option>
              <option value="fortalecimento">Fortalecimento</option>
              <option value="mobilidade">Mobilidade</option>
              <option value="respiratorio">Respiratório</option>
              <option value="postural">Postural</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push('/exercicios')}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              Salvar Exercício
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
