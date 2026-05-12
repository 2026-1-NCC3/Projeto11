// Funções utilitárias e constantes usadas em todo o projeto.
// Nada de lógica de negócio aqui — só helpers genéricos.

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Junta classes do Tailwind sem conflito.
// Exemplo: cn('p-4 p-2') → 'p-2' (a segunda sobrescreve a primeira)
// Isso é útil quando componentes recebem className por prop.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formata uma data pro padrão brasileiro (dd/mm/aaaa)
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

// Formata data + hora pro padrão brasileiro (dd/mm/aaaa hh:mm)
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

// Labels em português para os enums que vêm do banco de dados.
// Evita ficar traduzindo manualmente em cada tela.

export const DIFICULDADE_LABELS: Record<string, string> = {
  facil: 'Fácil',
  moderado: 'Moderado',
  dificil: 'Difícil',
};

export const TIPO_LABELS: Record<string, string> = {
  alongamento: 'Alongamento',
  fortalecimento: 'Fortalecimento',
  mobilidade: 'Mobilidade',
  respiratorio: 'Respiratório',
  postural: 'Postural',
  outro: 'Outro',
};

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  profissional: 'Profissional',
  paciente: 'Paciente',
};
