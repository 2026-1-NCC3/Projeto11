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

export function usePacientes() {
  return useQuery({
    queryKey: ['pacientes'],
    queryFn: listarPacientes,
  });
}

export function usePaciente(id: string) {
  return useQuery({
    queryKey: ['pacientes', id],
    queryFn: () => buscarPaciente(id),
    enabled: !!id,
  });
}

export function useCriarPaciente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PacienteFormData) => criarPaciente(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pacientes'] }),
  });
}

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

export function useDeletarPaciente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletarPaciente,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pacientes'] }),
  });
}

// ── Exercícios ───────────────────────────────────────────────

export function useExercicios(params?: { tipo?: string; dificuldade?: string; busca?: string }) {
  return useQuery({
    queryKey: ['exercicios', params],
    queryFn: () => listarExercicios(params),
  });
}

export function useExercicio(id: string) {
  return useQuery({
    queryKey: ['exercicios', id],
    queryFn: () => buscarExercicio(id),
    enabled: !!id,
  });
}

export function useCriarExercicio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ExercicioFormData) => criarExercicio(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exercicios'] }),
  });
}

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

export function useDeletarExercicio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletarExercicio,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exercicios'] }),
  });
}

// ── Prescrições ──────────────────────────────────────────────

export function usePrescricoes(pacienteId: string) {
  return useQuery({
    queryKey: ['prescricoes', pacienteId],
    queryFn: () => listarPrescricoes(pacienteId),
    enabled: !!pacienteId,
  });
}

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

export function useCheckins(pacienteId: string) {
  return useQuery({
    queryKey: ['checkins', pacienteId],
    queryFn: () => listarCheckins(pacienteId),
    enabled: !!pacienteId,
  });
}

export function useEvolucao(pacienteId: string) {
  return useQuery({
    queryKey: ['evolucao', pacienteId],
    queryFn: () => buscarEvolucao(pacienteId),
    enabled: !!pacienteId,
  });
}

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

export function useSessoes(pacienteId: string) {
  return useQuery({
    queryKey: ['sessoes', pacienteId],
    queryFn: () => listarSessoes(pacienteId),
    enabled: !!pacienteId,
  });
}

export function useCriarSessao(pacienteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof criarSessao>[1]) => criarSessao(pacienteId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sessoes', pacienteId] }),
  });
}
