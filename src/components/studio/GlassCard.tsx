import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: 'blue' | 'violet' | 'cyan' | 'none';
  hover?: boolean;
}

export function GlassCard({ children, className, glow = 'none', hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-panel rounded-2xl p-6 transition-all duration-300',
        hover && 'glass-panel-hover neon-glow-hover',
        glow === 'blue' && 'glow-blue',
        glow === 'violet' && 'glow-violet',
        glow === 'cyan' && 'glow-cyan',
        className
      )}
    >
      {children}
    </div>
  );
}
