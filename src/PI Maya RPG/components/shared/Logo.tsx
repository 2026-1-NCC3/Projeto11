import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'full' | 'icon';
}

/**
 * Componente de Logo oficial da Maya RPG.
 * Seguindo o Manual de Identidade Visual.
 */
export function Logo({ className, width = 180, height = 60, variant = 'full' }: LogoProps) {
  // Nota: A logo deve ser colocada em /public/logo_maya.png pelo usuário
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <Image
        src="/logo_maya.png"
        alt="Maya RPG"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  );
}
