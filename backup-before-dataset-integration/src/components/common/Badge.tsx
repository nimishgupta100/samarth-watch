import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'red' | 'amber' | 'green' | 'blue' | 'teal' | 'sage' | 'forest';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-mint-deep text-ink border border-mint-border',
    red: 'bg-red-50 text-alert-red border border-red-200',
    amber: 'bg-amber-50 text-alert-amber border border-amber-200',
    green: 'bg-emerald-50 text-alert-green border border-emerald-200',
    blue: 'bg-mint-deep text-forest border border-mint-border',
    teal: 'bg-mint-deep text-forest border border-mint-border',
    sage: 'bg-mint text-forest border border-sage/40',
    forest: 'bg-forest text-cream',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-md',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
