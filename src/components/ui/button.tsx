import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'destructive' | 'pill' | 'subtle';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none rounded-[10px]';

    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover shadow-subtle active:scale-[0.99]',
      secondary: 'bg-surface text-text-primary hover:bg-surface-muted border border-border shadow-subtle active:scale-[0.99]',
      accent: 'bg-text-primary text-surface hover:bg-[#3A3B37] shadow-subtle active:scale-[0.99]',
      outline: 'border border-border bg-surface text-text-primary hover:bg-surface-muted',
      ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-muted',
      destructive: 'bg-danger text-white hover:bg-[#8E452E]',
      pill: 'rounded-full border border-border bg-surface text-text-primary hover:bg-surface-muted',
      subtle: 'bg-primary-soft text-primary-hover hover:bg-[#E2C8B8] border border-border',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-4 py-2 gap-2 h-10',
      lg: 'text-sm sm:text-base px-5 py-2.5 gap-2 h-11',
      icon: 'h-9 w-9 p-0 rounded-[9px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
