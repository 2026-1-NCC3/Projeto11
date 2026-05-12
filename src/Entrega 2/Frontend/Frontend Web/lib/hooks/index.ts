// Hooks personalizados do projeto — simplificam o uso do React Query.
// Em vez de escrever toda a config do useQuery em cada página,
// a gente centraliza aqui e só chama: const { data } = usePacientes()

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listarPacientes,
  buscarPaciente,
  criarPaciente,
  atualizarPaciente,
  deletarPaciente,
  listarExercicios,
  buscarExercicio,
  criarExercicio,
  atualizarExercicio,
  deletarExercicio,
  listarPrescricoes,
  criarPrescricao,
  registrarCheckin,
  listarCheckins,
  buscarEvolucao,
  listarSessoes,
  criarSessao,
} from '@/lib/api/client';
import type { PacienteFormData, ExercicioFormData } from '@/lib/types';

// ── Pacientes ────────────────────────────────────────────────

// Lista todos os pacientes (só admin/profissional vê)
export function usePacientes() {
  return useQuery({
    queryKey: ['pacientes'],
    queryFn: listarPacientes,
  });
}

// Busca um paciente específico pelo id
export function usePaciente(id: string) {
  return useQuery({
    queryKey: ['pacientes', id],
    queryFn: () => buscarPaciente(id),
    enabled: !!id, // só busca se tiver um id de verdade
  });
}

// Cria um paciente novo e invalida a lista pra atualizar
export function useCriarPaciente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PacienteFormData) => criarPaciente(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pacientes'] }),
  });
}

// Atualiza os dados de um paciente existente
export function useAtualizarPaciente(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PacienteFormData>) => atualizarPaciente(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pacientes'] });
      qc.invalidateQueries({ queryKey: ['pacientes', id] });
    },
  });
}

// Remove um paciente (só admin pode)
export function useDeletarPaciente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletarPaciente,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pacientes'] }),
  });
}

// ── Exercícios ───────────────────────────────────────────────

// Lista exercícios com filtros opcionais (tipo, dificuldade, busca)
export function useExercicios(params?: { tipo?: string; dificuldade?: string; busca?: string }) {
  return useQuery({
    queryKey: ['exercicios', params],
    queryFn: () => listarExercicios(params),
  });
}

// Busca um exercício específico
export function useExercicio(id: string) {
  return useQuery({
    queryKey: ['exercicios', id],
    queryFn: () => buscarExercicio(id),
    enabled: !!id,
  });
}

// Cadastra um exercício novo no banco
export function useCriarExercicio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ExercicioFormData) => criarExercicio(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exercicios'] }),
  });
}

// Atualiza um exercício existente
export function useAtualizarExercicio(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ExercicioFormData>) => atualizarExercicio(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['exercicios'] });
      qc.invalidateQueries({ queryKey: ['exercicios', id] });
    },
  });
}

// Desativa um exercício (soft delete — não apaga do banco)
export function useDeletarExercicio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletarExercicio,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exercicios'] }),
  });
}

// ── Prescrições ──────────────────────────────────────────────

// Lista os exercícios prescritos pra um paciente
export function usePrescricoes(pacienteId: string) {
  return useQuery({
    queryKey: ['prescricoes', pacienteId],
    queryFn: () => listarPrescricoes(pacienteId),
    enabled: !!pacienteId,
  });
}

// Prescreve um novo exercício pra um paciente
export function useCriarPrescricao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: criarPrescricao,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['prescricoes', variables.paciente_id] });
    },
  });
}

// ── Check-ins ────────────────────────────────────────────────

// Lista os check-ins (registros de exercício) de um paciente
export function useCheckins(pacienteId: string) {
  return useQuery({
    queryKey: ['checkins', pacienteId],
    queryFn: () => listarCheckins(pacienteId),
    enabled: !!pacienteId,
  });
}

// Busca a evolução semanal do paciente (média de dor, taxa de execução)
export function useEvolucao(pacienteId: string) {
  return useQuery({
    queryKey: ['evolucao', pacienteId],
    queryFn: () => buscarEvolucao(pacienteId),
    enabled: !!pacienteId,
  });
}

// Registra um check-in (paciente marcou que fez o exercício hoje)
export function useRegistrarCheckin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: registrarCheckin,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['checkins', variables.paciente_id] });
      qc.invalidateQueries({ queryKey: ['evolucao', variables.paciente_id] });
    },
  });
}

// ── Prontuário ───────────────────────────────────────────────

// Lista as sessões de atendimento de um paciente
export function useSessoes(pacienteId: string) {
  return useQuery({
    queryKey: ['sessoes', pacienteId],
    queryFn: () => listarSessoes(pacienteId),
    enabled: !!pacienteId,
  });
}

// Registra uma nova sessão no prontuário do paciente
export function useCriarSessao(pacienteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof criarSessao>[1]) => criarSessao(pacienteId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sessoes', pacienteId] }),
  });
}
