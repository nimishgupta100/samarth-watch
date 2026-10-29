import React from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  useDocumentTitle('404 Page Not Found');

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto border border-slate-200">
        <FileQuestion className="w-8 h-8 text-teal-600" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
          HTTP 404 Error
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Page or Record Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          The requested URL, senior identifier, or dashboard resource does not exist in the active Samarth Watch cohort.
        </p>
      </div>

      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
        >
          <Home className="w-4 h-4 text-teal-400" />
          <span>Return to Today's Priorities</span>
        </Link>
      </div>
    </div>
  );
};
