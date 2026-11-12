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
    default: 'bg-surface-muted text-text-primary border-border',
    secondary: 'bg-surface-muted text-text-secondary border-border',
    outline: 'border border-border text-text-secondary bg-transparent',
    success: 'bg-success-soft text-success border-success/25 font-semibold',
    warning: 'bg-primary-soft text-primary-hover border-border font-semibold',
    destructive: 'bg-danger-soft text-danger border-danger-border font-medium',
    flame: 'bg-primary-soft text-primary-hover border-border font-semibold',
    lilac: 'bg-surface-muted text-text-secondary border-border font-medium',
    seal: 'bg-surface-muted text-text-primary border-border font-medium',
    brand: 'bg-primary-soft text-primary-hover border-border font-semibold',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium border rounded-[6px]',
    md: 'text-xs px-2.5 py-1 font-medium border rounded-[6px]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 leading-none tracking-normal',
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
