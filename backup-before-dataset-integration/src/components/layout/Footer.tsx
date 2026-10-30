import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Activity, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-cream border-t border-mint-border text-xs text-ink-muted pb-safe">
      {/* Clinical Guardrail Banner */}
      <div className="bg-mint-deep border-b border-mint-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-forest shrink-0" />
            <p className="text-forest leading-relaxed font-medium">
              <strong>Clinical Guardrail:</strong> Samarth Watch is a probabilistic risk-flagging queue for human Care Coordinators. It never diagnoses medical conditions.
            </p>
          </div>
          <span className="font-bold text-forest bg-mint px-2.5 py-0.5 rounded text-[11px] shrink-0 border border-mint-border">
            Assistive Triage Only
          </span>
        </div>
      </div>

      {/* Main Footer Links Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Clinical Mission */}
          <div className="space-y-3">
            <Link to="/coordinator" className="flex items-center gap-2">
              <div className="bg-forest p-2 rounded-lg text-cream font-bold shadow-xs">
                <Activity className="w-4 h-4 text-cream" />
              </div>
              <span className="font-bold text-forest text-base">Samarth Watch</span>
            </Link>
            
            <p className="text-ink-muted leading-relaxed text-xs">
              Early-warning care intelligence supporting Care Coordinators who watch over Indian seniors living independently at home.
            </p>

            <div className="text-[11px] text-ink-faint pt-1">
              Samarth Life Management Pvt Ltd<br />
              Registered Health Services Network (350+ Cities)
            </div>
          </div>

          {/* Col 2: Platform Experiences */}
          <div className="space-y-2">
            <h4 className="font-bold text-forest uppercase tracking-wider text-[11px]">
              Platform Experiences
            </h4>
            <ul className="space-y-1.5 text-ink-muted">
              <li>
                <Link to="/coordinator" className="hover:text-forest transition-colors">
                  Today's Priorities (Coordinator Queue)
                </Link>
              </li>
              <li>
                <Link to="/senior-home" className="hover:text-forest transition-colors">
                  Senior View (Distraction-Free Mode)
                </Link>
              </li>
              <li>
                <Link to="/family" className="hover:text-forest transition-colors">
                  Family Companion Portal
                </Link>
              </li>
              <li>
                <Link to="/ops" className="hover:text-forest transition-colors">
                  Operations & Caseload Overview
                </Link>
              </li>
              <li>
                <Link to="/coordinator/voice-checkin" className="hover:text-forest transition-colors">
                  Voice & Check-in Simulator
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Governance & Legal */}
          <div className="space-y-2">
            <h4 className="font-bold text-forest uppercase tracking-wider text-[11px]">
              Governance & Legal
            </h4>
            <ul className="space-y-1.5 text-ink-muted">
              <li>
                <Link to="/coordinator/model-evaluation" className="hover:text-forest transition-colors">
                  Model Benchmarking & Evaluation
                </Link>
              </li>
              <li>
                <Link to="/coordinator/privacy-safety" className="hover:text-forest transition-colors">
                  Privacy & Data Masking Architecture
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-forest transition-colors">
                  Privacy Policy (DPDP Act 2023)
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-forest transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/credits" className="hover:text-forest transition-colors">
                  Image Credits & Slots
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contact & Emergency */}
          <div className="space-y-2">
            <h4 className="font-bold text-forest uppercase tracking-wider text-[11px]">
              Coordinator Support Hub
            </h4>
            <ul className="space-y-2 text-ink-muted">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-forest shrink-0" />
                <a 
                  href="tel:+919811044211" 
                  className="font-medium text-ink hover:text-forest transition-colors"
                >
                  +91 98110 44211
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-forest shrink-0" />
                <a 
                  href="mailto:support@samarth.life" 
                  className="font-medium text-ink hover:text-forest transition-colors"
                >
                  support@samarth.life
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-ink-faint shrink-0 mt-0.5" />
                <span>Operational Headquarters: New Delhi, India</span>
              </li>
              <li className="pt-2 text-[11px] text-alert-red font-semibold">
                Medical Emergencies: Dial <a href="tel:112" className="underline font-bold text-alert-red">112</a> (National Emergency Helpline)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Status */}
        <div className="pt-8 mt-8 border-t border-mint-border flex flex-col sm:flex-row items-center justify-between gap-3 text-ink-faint text-[11px]">
          <div>
            &copy; {currentYear} Samarth Life Management Pvt Ltd. All rights reserved.
          </div>
          
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-forest">
              <CheckCircle2 className="w-3 h-3 text-forest" />
              DPDP Act 2023 Compliant
            </span>
            <span>:</span>
            <span>TLS 1.3 Encrypted</span>
            <span>:</span>
            <span className="text-forest font-semibold">
              care.samarth.in
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
