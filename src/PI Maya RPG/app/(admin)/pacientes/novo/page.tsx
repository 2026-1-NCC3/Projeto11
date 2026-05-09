'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { criarPaciente } from '@/lib/api/client';
import type { PacienteFormData } from '@/lib/types';
import { ArrowLeft, UserPlus, Stethoscope, FileText } from 'lucide-react';
import Link from 'next/link';

export default function NovoPacientePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PacienteFormData>({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    cpf: '',
    data_nascimento: '',
    queixa_principal: '',
    historico_medico: '',
    medicamentos: '',
    objetivos: '',
    observacoes: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await criarPaciente(formData);
      router.push('/pacientes');
      alert('Paciente cadastrado com sucesso!');
    } catch (err: any) {
      console.error(err);
      alert('Erro ao cadastrar paciente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/pacientes" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-maya-teal-dark">Novo Paciente</h1>
          <p className="text-maya-gray-soft mt-1">Cadastre um novo paciente para iniciar o acompanhamento</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Pessoais */}
        <Card>
          <div className="p-6">
            <h3 className="font-medium text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-3 text-maya-dark">
              <UserPlus className="w-5 h-5 text-maya-teal" /> Dados Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Nome Completo"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
              <Input
                label="E-mail (usado para login no app)"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Senha Inicial (para login no app)"
                type="password"
                required
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              />
              <Input
                label="Telefone / WhatsApp"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
              <Input
                label="CPF"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
              />
              <Input
                label="Data de Nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
              />
            </div>
          </div>
        </Card>

        {/* Informações Clínicas */}
        <Card>
          <div className="p-6">
            <h3 className="font-medium text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-3 text-maya-dark">
              <Stethoscope className="w-5 h-5 text-maya-teal" /> Perfil Clínico
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-maya-dark mb-1">Queixa Principal</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-maya focus:outline-none focus:ring-2 focus:ring-maya-teal"
                  rows={2}
                  placeholder="Ex: Dor crônica na região lombar ao ficar muito tempo sentado..."
                  value={formData.queixa_principal}
                  onChange={(e) => setFormData({ ...formData, queixa_principal: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-maya-dark mb-1">Histórico Médico</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-200 rounded-maya focus:outline-none focus:ring-2 focus:ring-maya-teal"
                    rows={3}
                    placeholder="Cirurgias prévias, comorbidades..."
                    value={formData.historico_medico}
                    onChange={(e) => setFormData({ ...formData, historico_medico: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-maya-dark mb-1">Medicamentos em Uso</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-200 rounded-maya focus:outline-none focus:ring-2 focus:ring-maya-teal"
                    rows={3}
                    value={formData.medicamentos}
                    onChange={(e) => setFormData({ ...formData, medicamentos: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Metas e Observações */}
        <Card>
          <div className="p-6">
            <h3 className="font-medium text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-3 text-maya-dark">
              <FileText className="w-5 h-5 text-maya-teal" /> Objetivos e Notas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-maya-dark mb-1">Objetivos do Tratamento</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-maya focus:outline-none focus:ring-2 focus:ring-maya-teal"
                  rows={3}
                  placeholder="Ex: Melhorar postura no trabalho, aliviar dores ao dormir..."
                  value={formData.objetivos}
                  onChange={(e) => setFormData({ ...formData, objetivos: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-maya-dark mb-1">Observações Gerais</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-maya focus:outline-none focus:ring-2 focus:ring-maya-teal"
                  rows={3}
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                />
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.push('/pacientes')}>
                Cancelar
              </Button>
              <Button type="submit" loading={loading}>
                Salvar e Cadastrar Paciente
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
