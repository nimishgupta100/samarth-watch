import React from 'react';
import { ShieldAlert, Heart, CheckCircle, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Prominent Audit Guardrail Banner */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                Clinical Safety & Audit Standard
                <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded uppercase font-semibold">
                  Rule 1 Compliance
                </span>
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>This is a risk signal, not a diagnosis.</strong> Samarth Watch flags multivariate trends (vitals baseline shifts, missed doses, speech sentiment cues) and routes them directly to human Care Coordinators. It never issues diagnostic conclusions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs font-semibold text-amber-900 bg-white/80 px-3 py-1.5 rounded-lg border border-amber-200">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Human-in-the-Loop Verified
          </div>
        </div>

        {/* Footer info & Hackathon attribution */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Samarth Watch</span>
            <span>•</span>
            <span>AI Early-Warning for Seniors Living at Home</span>
            <span>•</span>
            <span>Built for Samarth Life Management Pvt Ltd</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-600">
              <Info className="w-3.5 h-3.5" /> Seeded Cohort: 200 seniors, 90-day history
            </span>
            <span>•</span>
            <span className="text-slate-400">Vite + React 18 + TypeScript + Tailwind</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
