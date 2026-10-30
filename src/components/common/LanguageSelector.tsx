import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../i18n';
import { Languages, ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'compact' | 'expanded';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { language, setLanguage } = useApp();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const activeLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-forest border border-teal-200/80 shadow-xs flex items-center gap-2 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-teal-600 active:scale-95"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Languages className="w-4 h-4 text-teal-700 shrink-0" />
        <span className="font-semibold">{activeLang.nameInScript}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-teal-700 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-48 rounded-2xl bg-white border border-teal-100 shadow-xl py-1.5 z-50 animate-fadeIn text-xs">
          <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Choose Language / भाषा चुनें
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code as SupportedLanguage);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-teal-50 transition-colors ${
                  isSelected ? 'bg-teal-50/70 text-teal-900 font-bold' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold">{lang.nameInScript}</div>
                  <div className="text-[10px] text-slate-400">{lang.englishName}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-teal-700 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
