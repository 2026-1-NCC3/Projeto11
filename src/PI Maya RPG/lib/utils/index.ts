import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Combina classes Tailwind sem conflitos */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formata data para pt-BR */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

/** Formata data e hora para pt-BR */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/** Mapas de labels em português */
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
