import React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
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
        <textarea
          id={generatedId}
          ref={ref}
          className={cn(
            'flex min-h-[90px] w-full rounded-xl border border-lilac-300/20 bg-[#071322] p-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-flame-500/30 focus:border-flame-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-inner',
            error && 'border-rose-500 focus:border-rose-500',
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

Textarea.displayName = 'Textarea';
