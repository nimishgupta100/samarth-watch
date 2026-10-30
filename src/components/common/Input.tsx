import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm bg-cream text-ink border border-mint-border rounded-lg placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-colors',
            error && 'border-alert-red focus:ring-alert-red focus:border-alert-red',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-alert-red font-medium">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-ink-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
