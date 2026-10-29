import React from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ShieldCheck, Lock, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
  useDocumentTitle('Privacy Policy');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        
        <div className="border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Digital Personal Data Protection (DPDP) Act 2023 Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy & Health Data Governance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Effective Date: October 29, 2026 • Version 2.4 • Applicable to Samarth Life Management Pvt Ltd
          </p>
        </div>

        <section className="space-y-3 text-xs leading-relaxed text-slate-700">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            1. Core Privacy Commitments
          </h2>
          <p>
            Samarth Watch operates under a strict principle of <strong>Senior Data Autonomy</strong>. Seniors living at home entrust us with longitudinal health observations. We hold this data with fiduciary responsibility under India’s Digital Personal Data Protection Act, 2023.
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
            <li>We never sell, rent, or monetize elder health information.</li>
            <li>We do not transmit raw Personally Identifiable Information (PII) such as full names, Aadhaar numbers, or street addresses to third-party model inference endpoints without local cryptographic redaction.</li>
            <li>Senior consent for family sharing can be revoked at any moment verbally or in writing.</li>
          </ul>
        </section>

        <section className="space-y-3 text-xs leading-relaxed text-slate-700">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            2. Categories of Information Processed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">Objective Physiological Signals</h3>
              <p className="text-slate-600">
                Blood pressure readings, fasting glucose, post-prandial glucose, pulse oximetry (SpO2), weight measurements, and automated medication dispenser logs.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">Subjective Communication Signals</h3>
              <p className="text-slate-600">
                Audio check-in responses, keypad tele-triage answers, and coordinator consultation notes in Hindi, English, or regional code-mixed languages.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3 text-xs leading-relaxed text-slate-700">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            3. Role-Based Access Controls (RBAC)
          </h2>
          <p>
            Access is partitioned according to professional necessity:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
            <li><strong>Care Coordinators:</strong> Granted access to assigned seniors’ vitals, call notes, and emergency scripts for direct triage.</li>
            <li><strong>Operations Managers:</strong> Granted access to anonymized queue volumes, latency metrics, and precision aggregates.</li>
            <li><strong>Family Members:</strong> Granted access to plain-language wellbeing letters only when explicit elder consent is active.</li>
          </ul>
        </section>

        <section className="space-y-3 text-xs leading-relaxed text-slate-700">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            4. Data Retention & Erasure
          </h2>
          <p>
            Longitudinal vitals data is retained for a maximum rolling window of 90 days for personal baseline calibration. Upon service disenrollment, all identifiable telemetry is purged within 30 business days upon request to our Data Protection Officer.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600">
            <strong>Data Protection Officer Contact:</strong><br />
            Email: <a href="mailto:dpo@samarth.life" className="text-teal-700 font-semibold hover:underline">dpo@samarth.life</a><br />
            Phone: <a href="tel:+919811044211" className="text-teal-700 font-semibold hover:underline">+91 98110 44211</a><br />
            Samarth Life Management Pvt Ltd, New Delhi, India
          </div>
        </section>

      </div>
    </div>
  );
};
