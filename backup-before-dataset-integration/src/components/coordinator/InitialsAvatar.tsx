import React from 'react';

interface InitialsAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  shape?: 'rounded' | 'square';
}

/**
 * Returns 1 to 2 uppercase initials for a person's name.
 * Example: "Kamla Devi" -> "KD", "Nimish Gupta" -> "NG"
 */
function getInitials(name: string): string {
  if (!name || !name.trim()) return 'SW';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Avatar displaying person's initials on a flat tint (pale sage/mint).
 * Never uses stock or AI-generated photos.
 */
export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  name,
  size = 'md',
  className = '',
  shape = 'rounded',
}) => {
  const initials = getInitials(name);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  }[size];

  const shapeClass = shape === 'square' ? 'rounded-lg' : 'rounded-lg';

  return (
    <div
      className={`inline-flex items-center justify-center font-bold tracking-tight select-none bg-mint-deep text-forest border border-border shadow-xs ${sizeClasses} ${shapeClass} ${className}`}
      aria-label={name}
      role="img"
    >
      <span>{initials}</span>
    </div>
  );
};
