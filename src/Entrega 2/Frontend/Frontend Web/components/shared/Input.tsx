// Componente de Input reutilizável — campo de texto padronizado.
// Suporta label, mensagem de erro e todos os atributos nativos de <input>.
'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;   // texto que aparece acima do campo
  error?: string;   // mensagem de erro (fica vermelho quando tem)
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {/* Label do campo (se tiver) */}
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-maya-dark">
            {label}
          </label>
        )}
        {/* Campo de input com estilo condicional (vermelho se tiver erro) */}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-maya border bg-white px-4 py-2.5 text-sm text-maya-dark placeholder:text-maya-gray-soft/60',
            'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-maya-teal focus:border-transparent',
            error ? 'border-red-400 focus:ring-red-400' : 'border-gray-200',
            className
          )}
          {...props}
        />
        {/* Mensagem de erro (aparece embaixo do campo) */}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };
