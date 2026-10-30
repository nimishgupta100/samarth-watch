import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  ShieldAlert, 
  Info 
} from 'lucide-react';

export type StatusVariant = 
  | 'critical' 
  | 'warning' 
  | 'success' 
  | 'neutral' 
  | 'info';

interface StatusChipProps {
  label: string;
  variant?: StatusVariant;
  icon?: React.ReactNode;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  label,
  variant = 'neutral',
  icon,
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'critical':
        return {
          wrapper: 'bg-red-50 text-alert-red border-red-200',
          defaultIcon: <ShieldAlert className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />,
        };
      case 'warning':
        return {
          wrapper: 'bg-amber-50 text-alert-amber border-amber-200',
          defaultIcon: <AlertTriangle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />,
        };
      case 'success':
        return {
          wrapper: 'bg-emerald-50 text-alert-green border-emerald-200',
          defaultIcon: <CheckCircle2 className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />,
        };
      case 'info':
        return {
          wrapper: 'bg-mint-deep text-forest border-border',
          defaultIcon: <Info className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />,
        };
      case 'neutral':
      default:
        return {
          wrapper: 'bg-cream text-ink-muted border-border',
          defaultIcon: <Clock className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />,
        };
    }
  };

  const { wrapper, defaultIcon } = getVariantStyles();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${wrapper} ${className}`}
    >
      {icon || defaultIcon}
      <span>{label}</span>
    </span>
  );
};
