import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-bold rounded-lg transition-colors active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none';
  const variants = {
    primary: 'bg-forest text-cream hover:bg-forest-dark active:bg-forest-dark shadow-xs',
    secondary: 'bg-cream text-forest border border-mint-border hover:bg-mint active:bg-mint-deep shadow-xs',
    danger: 'bg-alert-red text-cream hover:bg-red-700 active:bg-red-800 shadow-xs',
    ghost: 'bg-transparent text-ink hover:bg-mint-deep active:bg-mint',
  };
  const sizes = {
    sm: 'px-3.5 py-2 text-xs min-h-[44px]',
    md: 'px-5 py-2.5 text-xs min-h-[44px]',
    lg: 'px-6 py-3 text-sm min-h-[48px]',
  };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
};
