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
      'inline-flex items-center justify-center font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame-500 disabled:opacity-50 disabled:pointer-events-none select-none rounded-xl';

    const variants = {
      primary: 'bg-[#ea3a18] bg-gradient-to-r from-[#ff6b4d] via-[#f95738] to-[#c5280b] text-white hover:brightness-110 shadow-flame active:scale-[0.98]',
      secondary: 'bg-purple-200 text-[#0c1e34] hover:bg-purple-100 font-bold border border-purple-300 shadow-sm active:scale-[0.98]',
      accent: 'bg-[#0c1e34] text-white hover:bg-[#132c4b] border border-purple-300/25 shadow-sm active:scale-[0.98]',
      outline: 'border border-purple-300/30 bg-white/5 text-white hover:bg-white/10 hover:border-purple-300/60',
      ghost: 'text-purple-200 hover:bg-white/10 hover:text-white',
      destructive: 'bg-rose-600 text-white hover:bg-rose-700',
      pill: 'rounded-full border border-purple-300/30 bg-[#0c1e34] text-white hover:bg-white/10 transition-colors',
      subtle: 'bg-flame-950/70 text-flame-300 hover:bg-flame-900/80 border border-flame-500/30',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-4 py-2 gap-2 h-10',
      lg: 'text-base px-6 py-3 gap-2.5 h-12',
      icon: 'h-10 w-10 p-0 rounded-xl',
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
