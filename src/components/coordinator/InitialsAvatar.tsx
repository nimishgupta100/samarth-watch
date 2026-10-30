import React from 'react';

interface InitialsAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  shape?: 'rounded' | 'square';
  imageUrl?: string;
}

export function getKnownPhoto(name?: string | null): string | undefined {
  if (!name) return undefined;
  const lower = name.toLowerCase();
  if (lower.includes('kamla') || lower.includes('कमला')) return '/images/senior-indian.jpg';
  if (lower.includes('nimish') || lower.includes('निमिष')) return '/images/coordinator-male.jpg';
  if (lower.includes('karishma') || lower.includes('करिश्मा')) return '/images/family-daughter.jpg';
  if (lower.includes('ramanathan') || lower.includes('doctor') || lower.includes('डॉ.')) return '/images/doctor-male.jpg';
  return undefined;
}

/**
 * Returns 1 to 2 uppercase initials for a person's name.
 * Robust implementation:
 * - Trims punctuation, brackets, and symbols
 * - Supports Latin and Devanagari Unicode scripts (\p{L})
 * - Filters out honorifics (Dr, Col, Smt, Shri, Mr, Mrs, Senior) when additional name parts exist
 * - For single words (e.g. "Kamla"), returns single initial ("K")
 * - For multi-word (e.g. "Doctor Raman"), returns "DR"
 * - For Devanagari (e.g. "कमला देवी"), returns "कद"
 * - For empty or punctuation-only input, returns safe fallback "K", never symbols!
 */
export function getInitials(name?: string | null): string {
  if (!name || typeof name !== 'string') return 'K';

  // Strip all non-letter and non-combining-mark Unicode characters except spaces
  const cleaned = name.replace(/[^\p{L}\p{M}\s]/gu, ' ').trim();
  if (!cleaned) return 'K';

  const rawWords = cleaned.split(/\s+/).filter(Boolean);
  if (rawWords.length === 0) return 'K';

  // Filter out common titles/honorifics if other words exist
  const honorifics = new Set([
    'dr', 'doctor', 'col', 'colonel', 'smt', 'shrimati',
    'shri', 'mr', 'mrs', 'ms', 'prof', 'professor', 'senior'
  ]);

  let words = rawWords.filter(w => !honorifics.has(w.toLowerCase()));
  if (words.length === 0) {
    words = rawWords;
  }

  if (words.length === 1) {
    // Single word: return 1st character uppercase
    const chars = Array.from(words[0]);
    return chars[0] ? chars[0].toUpperCase() : 'K';
  }

  // Multi-word: first letter of first word + first letter of last word
  const firstWordChars = Array.from(words[0]);
  const lastWordChars = Array.from(words[words.length - 1]);
  const firstChar = firstWordChars[0] ? firstWordChars[0].toUpperCase() : '';
  const lastChar = lastWordChars[0] ? lastWordChars[0].toUpperCase() : '';

  const result = `${firstChar}${lastChar}`;
  return result || 'K';
}

/**
 * Avatar displaying person's photo or initials with clean fallback.
 */
export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  name,
  size = 'md',
  className = '',
  shape = 'rounded',
  imageUrl,
}) => {
  const [imgError, setImgError] = React.useState(false);
  const initials = getInitials(name);
  const photo = imageUrl || getKnownPhoto(name);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  }[size];

  const shapeClass = shape === 'square' ? 'rounded-xl' : 'rounded-2xl';

  return (
    <div
      className={`relative inline-flex items-center justify-center font-bold tracking-tight select-none overflow-hidden bg-mint-deep text-forest border border-border shadow-xs ${sizeClasses} ${shapeClass} ${className}`}
      aria-label={name || 'Avatar'}
      role="img"
    >
      {photo && !imgError ? (
        <img
          src={photo}
          alt={name || 'Avatar'}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
