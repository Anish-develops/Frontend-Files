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
            className="block text-xs font-bold text-lilac-200 tracking-wider uppercase"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={generatedId}
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-xl border border-lilac-300/20 bg-[#071322] px-3.5 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-flame-500/30 focus:border-flame-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-inner',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-lilac-200/60">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
