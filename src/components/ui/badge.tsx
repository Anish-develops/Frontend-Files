import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' | 'flame' | 'lilac' | 'seal' | 'brand';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-white/10 text-white border-white/20',
    secondary: 'bg-purple-950/60 text-purple-200 border-purple-400/30',
    outline: 'border border-lilac-300/30 text-lilac-100 bg-transparent',
    success: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40',
    warning: 'bg-amber-950/70 text-amber-300 border-amber-500/40',
    destructive: 'bg-rose-950/70 text-rose-300 border-rose-500/40',
    flame: 'bg-flame-950/70 text-flame-300 border-flame-500/40 font-bold',
    lilac: 'bg-purple-950/60 text-purple-200 border-purple-400/40 font-bold',
    seal: 'bg-[#071322] text-lilac-100 border-lilac-300/30 font-bold',
    brand: 'bg-flame-950/70 text-flame-300 border-flame-500/40',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-bold border rounded-md',
    md: 'text-xs px-2.5 py-1 font-bold border rounded-md',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 leading-none tracking-tight',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
