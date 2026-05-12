// Componente de Card — caixa branca com sombra que usamos em quase toda tela.
// Serve pra agrupar informações visualmente (tabelas, formulários, stats, etc).

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;   // por padrão vem com padding, mas dá pra desligar
}

// Card básico: fundo branco, borda sutil, sombra leve
export function Card({ children, className, padding = true }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-maya bg-white shadow-maya border border-gray-100',
        padding && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
}

// CardHeader: cabeçalho padronizado dentro de um Card (título + subtítulo + ação)
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;   // botão ou link no canto direito (ex: "Ver todos")
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-maya-dark">{title}</h3>
        {subtitle && <p className="text-sm text-maya-gray-soft mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
