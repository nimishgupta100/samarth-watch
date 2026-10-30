import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Card: React.FC<CardProps> = ({ children, className, as: Tag = 'div' }) => (
  <Tag
    className={cn(
      'bg-cream rounded-xl border border-mint-border p-6 shadow-xs',
      className
    )}
  >
    {children}
  </Tag>
);
