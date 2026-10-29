import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Activity, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Globe, 
  Lock, 
  FileText 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = 2026;

  return (
    <footer className="mt-16 bg-white border-t border-slate-200 text-xs">
      
      {/* Clinical Guardrail Banner */}
      <div className="bg-amber-50 border-b border-amber-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <p className="text-amber-900 leading-relaxed font-medium">
              <strong>Clinical Guardrail:</strong> Samarth Watch is a probabilistic risk-flagging queue for human Care Coordinators. It never diagnoses medical conditions.
            </p>
          </div>
          <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[11px] shrink-0 border border-amber-300">
            Rule 1 Compliance
          </span>
        </div>
      </div>

      {/* Main Footer Links Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Clinical Mission */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center text-white">
                <Activity className="w-4 h-4 text-teal-400" />
              </div>
              <span className="font-bold text-slate-900 text-base">Samarth Watch</span>
            </Link>
            
            <p className="text-slate-500 leading-relaxed">
              Early-warning care intelligence supporting Care Coordinators who watch over Indian seniors living independently at home.
            </p>

            <div className="text-[11px] text-slate-400 pt-1">
              Samarth Life Management Pvt Ltd<br />
              Registered Health Services Network (350+ Cities)
            </div>
          </div>

          {/* Col 2: Coordinator & Operations Navigation */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Triage & Analytics
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <Link to="/" className="hover:text-teal-700 transition-colors">
                  Today's Priorities (Hero Queue)
                </Link>
              </li>
              <li>
                <Link to="/senior/senior-001" className="hover:text-teal-700 transition-colors">
                  Senior Baseline & Calibrated Vitals
                </Link>
              </li>
              <li>
                <Link to="/operations" className="hover:text-teal-700 transition-colors">
                  Operations & Coordinator Caseload
                </Link>
              </li>
              <li>
                <Link to="/voice-checkin" className="hover:text-teal-700 transition-colors">
                  Voice & IVR Check-in Simulator
                </Link>
              </li>
              <li>
                <Link to="/family-summary" className="hover:text-teal-700 transition-colors">
                  Family Companion Weekly Letter
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Technical Governance & Legal */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Governance & Compliance
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <Link to="/model-evaluation" className="hover:text-teal-700 transition-colors">
                  Model Benchmarking & Evaluation
                </Link>
              </li>
              <li>
                <Link to="/privacy-safety" className="hover:text-teal-700 transition-colors">
                  Privacy & Data Masking Architecture
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-teal-700 transition-colors">
                  Privacy Policy (DPDP Act 2023)
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-teal-700 transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/custom-domain" className="hover:text-teal-700 transition-colors">
                  Custom Domain Settings (care.samarth.in)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contact & Emergency */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Coordinator Support Hub
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <a 
                  href="tel:+919811044211" 
                  className="font-medium text-slate-800 hover:text-teal-700 transition-colors"
                >
                  +91 98110 44211
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <a 
                  href="mailto:support@samarth.life" 
                  className="font-medium text-slate-800 hover:text-teal-700 transition-colors"
                >
                  support@samarth.life
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>Operational Headquarters: New Delhi, India</span>
              </li>
              <li className="pt-2 text-[11px] text-rose-700 font-semibold">
                Medical Emergencies: Dial <a href="tel:112" className="underline font-bold">112</a> (National Emergency Helpline)
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Status */}
        <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            &copy; {currentYear} Samarth Life Management Pvt Ltd. All rights reserved.
          </div>
          
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-500">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              DPDP Act 2023 Compliant
            </span>
            <span>•</span>
            <span>TLS 1.3 Encrypted</span>
            <span>•</span>
            <Link to="/custom-domain" className="hover:underline text-teal-700 font-semibold">
              care.samarth.in
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
