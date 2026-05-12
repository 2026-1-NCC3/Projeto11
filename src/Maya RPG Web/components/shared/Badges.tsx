// Badges — etiquetas visuais coloridas pra status e dificuldade.
// Usamos em listas de pacientes, exercícios e cards do sistema.

import { cn } from '@/lib/utils';

// ── Badge de Status (ativo/inativo/pendente) ─────────────────

interface StatusBadgeProps {
  status: 'ativo' | 'inativo' | 'pendente';
  className?: string;
}

// Mostra uma bolinha colorida + texto (ex: 🟢 Ativo, ⚫ Inativo)
export function StatusBadge({ status, className }: StatusBadgeProps) {
  // Cada status tem suas cores de fundo, texto e borda
  const styles: Record<string, string> = {
    ativo: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    inativo: 'bg-gray-50 text-gray-500 border-gray-200',
    pendente: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  const labels: Record<string, string> = {
    ativo: 'Ativo',
    inativo: 'Inativo',
    pendente: 'Pendente',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        styles[status],
        className
      )}
    >
      {/* Bolinha indicadora de cor */}
      <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', {
        'bg-emerald-500': status === 'ativo',
        'bg-gray-400': status === 'inativo',
        'bg-amber-500': status === 'pendente',
      })} />
      {labels[status]}
    </span>
  );
}

// ── Badge de Dificuldade (fácil/moderado/difícil) ────────────

interface DificuldadeBadgeProps {
  dificuldade: string;
  className?: string;
}

// Mostra o nível do exercício com cor adequada (verde, amarelo, vermelho)
export function DificuldadeBadge({ dificuldade, className }: DificuldadeBadgeProps) {
  const styles: Record<string, string> = {
    facil: 'bg-green-50 text-green-700 border-green-200',
    moderado: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    dificil: 'bg-red-50 text-red-700 border-red-200',
  };

  const labels: Record<string, string> = {
    facil: 'Fácil',
    moderado: 'Moderado',
    dificil: 'Difícil',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        styles[dificuldade] || styles.moderado,
        className
      )}
    >
      {labels[dificuldade] || dificuldade}
    </span>
  );
}
