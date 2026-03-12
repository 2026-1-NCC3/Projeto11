'use client';

import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : 'button';
    const base =
      'inline-flex items-center justify-center font-medium rounded-maya transition-all duration-200 focus-maya disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<string, string> = {
      primary: 'bg-maya-teal text-white hover:bg-maya-teal-dark shadow-maya hover:shadow-maya-hover',
      secondary: 'bg-maya-beige text-maya-brown hover:bg-maya-beige/80',
      danger: 'bg-red-500 text-white hover:bg-red-600',
      ghost: 'text-maya-gray-soft hover:bg-gray-100 hover:text-maya-dark',
      outline: 'border-2 border-maya-teal text-maya-teal hover:bg-maya-teal hover:text-white',
    };

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
        {loading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';
export { Button };
