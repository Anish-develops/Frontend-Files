import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' | 'flame' | 'lilac' | 'seal' | 'brand' | 'accent' | 'peach' | 'lavender';
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
    success: 'bg-success-soft text-success border-success/30 font-semibold',
    warning: 'bg-warning-soft text-warning border-warning/35 font-semibold',
    destructive: 'bg-danger-soft text-danger border-danger-border font-medium',
    accent: 'bg-accent text-accent-fg border-accent/40 font-semibold',
    peach: 'bg-peach/15 text-[#E06A45] dark:text-peach border-peach/30 font-medium',
    lavender: 'bg-lavender/20 text-[#6B4AA8] dark:text-lavender border-lavender/35 font-medium',
    flame: 'bg-accent text-accent-fg border-accent/30 font-semibold',
    lilac: 'bg-lavender/20 text-[#6B4AA8] dark:text-lavender border-lavender/30 font-medium',
    seal: 'bg-surface-muted text-text-primary border-border font-medium',
    brand: 'bg-primary-soft text-text-primary border-primary/30 font-semibold',
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
