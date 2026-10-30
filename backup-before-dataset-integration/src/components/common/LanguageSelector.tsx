import React from 'react';
import { useApp } from '../../context/AppContext';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'compact' | 'expanded';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
}) => {
  const { language, setLanguage } = useApp();

  return (
    <div className={`flex items-center bg-mint p-1 rounded-lg border border-mint-border gap-1 text-xs font-semibold ${className}`}>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 min-h-[38px] rounded-md transition-colors active:scale-95 flex items-center justify-center ${
          language === 'en'
            ? 'bg-forest text-cream shadow-xs font-bold'
            : 'text-ink-muted hover:text-forest'
        }`}
        aria-pressed={language === 'en'}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        className={`px-3 py-1.5 min-h-[38px] rounded-md transition-colors font-hindi active:scale-95 flex items-center justify-center ${
          language === 'hi'
            ? 'bg-forest text-cream shadow-xs font-bold'
            : 'text-ink-muted hover:text-forest'
        }`}
        aria-pressed={language === 'hi'}
      >
        हिंदी
      </button>
    </div>
  );
};
