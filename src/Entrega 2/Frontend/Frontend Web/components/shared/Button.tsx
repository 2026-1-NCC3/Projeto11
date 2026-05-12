// Componente de Botão reutilizável — padroniza os botões em todo o sistema.
// Suporta variantes visuais (primary, secondary, danger...) e tamanhos.
// Também aceita o padrão "asChild" do Radix pra transformar um Link em botão.
'use client';

import { Slot, Slottable } from '@radix-ui/react-slot';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;   // mostra spinner e desabilita quando tá carregando
  asChild?: boolean;   // quando true, renderiza o filho direto (ex: Link do Next)
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, asChild = false, ...props }, ref) => {
    // Se asChild, usa o Slot do Radix pra "mesclar" com o componente filho
    const Component = asChild ? Slot : 'button';

    // Estilo base que todos os botões compartilham
    const base =
      'inline-flex items-center justify-center font-medium rounded-maya transition-all duration-200 focus-maya disabled:opacity-50 disabled:cursor-not-allowed';

    // Cada variante tem suas cores e efeitos
    const variants: Record<string, string> = {
      primary: 'bg-maya-teal text-white hover:bg-maya-teal-dark shadow-maya hover:shadow-maya-hover',
      secondary: 'bg-maya-beige text-maya-brown hover:bg-maya-beige/80',
      danger: 'bg-red-500 text-white hover:bg-red-600',
      ghost: 'text-maya-gray-soft hover:bg-gray-100 hover:text-maya-dark',
      outline: 'border-2 border-maya-teal text-maya-teal hover:bg-maya-teal hover:text-white',
    };

    // Tamanhos com padding e gaps diferentes
    const sizes: Record<string, string> = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-7 py-3 text-base gap-2.5',
    };

    return (
      <Component
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {/* Spinner de carregamento */}
        {loading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        <Slottable>{children}</Slottable>
      </Component>
    );
  }
);

Button.displayName = 'Button';
export { Button };
