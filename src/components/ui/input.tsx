import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, id, ...props }, ref) => {
    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={generatedId}
            className="block text-xs font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={generatedId}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-[9px] border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-subtle',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-text-secondary">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
