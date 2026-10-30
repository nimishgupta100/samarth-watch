import React from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { useApp } from '../context/AppContext';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  const { language } = useApp();
  const isHi = language === 'hi';

  usePageTitle(
    isHi ? '404 पृष्ठ नहीं मिला - समर्थ वॉच' : '404 Page Not Found - Samarth Watch',
    isHi ? 'अनुरोधित पृष्ठ समर्थ वॉच पर उपलब्ध नहीं है।' : 'The requested page was not found on Samarth Watch.'
  );

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 sm:p-6 bg-mint text-ink font-sans pb-safe pt-safe">
      <div className="w-full max-w-md bg-cream rounded-xl border border-mint-border p-6 sm:p-8 shadow-xs text-center space-y-5">
        <div className="w-14 h-14 rounded-full bg-mint-deep text-forest flex items-center justify-center mx-auto border border-mint-border">
          <FileQuestion className="w-7 h-7" strokeWidth={1.5} />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest bg-mint px-2.5 py-0.5 rounded border border-mint-border inline-block">
            {isHi ? '404 त्रुटि' : 'HTTP 404 Error'}
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-forest tracking-tight">
            {isHi ? 'पृष्ठ या रिकॉर्ड नहीं मिला' : 'Page Not Found'}
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            {isHi
              ? 'अनुरोधित पता या पृष्ठ उपलब्ध नहीं है। कृपया मुख्य पृष्ठ पर वापस जाएँ।'
              : 'The requested link does not exist. Please return to the homepage or sign in.'}
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] bg-forest hover:bg-forest-dark active:bg-forest-dark text-cream text-sm font-bold rounded-lg transition-colors shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>{isHi ? 'मुख्य पृष्ठ पर जाएँ' : 'Back to Home'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
