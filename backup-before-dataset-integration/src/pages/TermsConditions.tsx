import React from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ShieldAlert, FileText, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsConditions: React.FC = () => {
  useDocumentTitle('Terms and Conditions');

  return (
    <div className="min-h-dvh bg-mint text-ink font-sans py-8 px-4 sm:px-6 lg:px-8 pb-safe pt-safe">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-dark transition-colors bg-cream px-3.5 py-2 rounded-lg border border-mint-border shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>

        <div className="bg-cream rounded-xl p-6 sm:p-8 border border-mint-border shadow-xs space-y-6">
          <div className="border-b border-mint-border pb-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Clinical Software Terms of Service</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-forest tracking-tight">
              Terms and Conditions
            </h1>
          <p className="text-xs text-slate-500 mt-1">
            Last Updated: October 29, 2026 • Version 2.1 • Samarth Life Management Pvt Ltd
          </p>
        </div>

        {/* Primary Guardrail Disclaimer */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold">Important Clinical Safety Notice</div>
            <p className="leading-relaxed">
              Samarth Watch is a mathematical early-warning and queue prioritization system designed exclusively to assist human Care Coordinators. <strong>It does not provide medical diagnoses, treatment plans, or emergency dispatch services.</strong> In life-threatening emergencies, dial 112 (India Emergency Services) immediately.
            </p>
          </div>
        </div>

        <section className="space-y-3 text-xs leading-relaxed text-slate-700">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            1. Authorized Intended Use
          </h2>
          <p>
            The software is licensed to certified Care Coordinators and healthcare operators employed by or affiliated with Samarth Life Management. The system generates probabilistic risk signals by identifying statistical deviations from an individual’s historical baseline.
          </p>
        </section>

        <section className="space-y-3 text-xs leading-relaxed text-slate-700">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            2. Coordinator Duties & Human Oversight
          </h2>
          <p>
            Care Coordinators are required to verify flagged signals through direct conversational engagement before initiating escalations. Automated risk scores (0 to 100) must never be presented to patients or their families as a clinical pronouncement.
          </p>
        </section>

        <section className="space-y-3 text-xs leading-relaxed text-slate-700">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            3. Limitation of Liability
          </h2>
          <p>
            While our algorithms demonstrate 91.7% recall on planted clinical decline scenarios, no predictive model can guarantee detection of all impending adverse events. Samarth Life Management Pvt Ltd disclaims liability for sudden events occurring without prior vitals or voice manifestations.
          </p>
        </section>

        <section className="space-y-3 text-xs leading-relaxed text-slate-700">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            4. Governing Law
          </h2>
          <p>
            These terms are governed by the laws of India. Any disputes arising out of the use of this software shall be subject to the exclusive jurisdiction of the courts of New Delhi, India.
          </p>
        </section>

      </div>
    </div>
  </div>
  );
};
