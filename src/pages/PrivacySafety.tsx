import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  UserCheck, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const PrivacySafety: React.FC = () => {
  const [isMasked, setIsMasked] = useState(true);

  // Raw vs Masked demo text for the interactive data masking demo
  const rawDataPayload = {
    patientName: 'Smt. Kamala Devi (W/o Late Shri B. N. Sharma)',
    aadhaarNumber: 'XXXX-XXXX-8921',
    mobileNumber: '+91 98711 00234',
    homeAddress: 'House 412, Gomti Nagar Extension, Lucknow - 226010',
    emergencyContact: 'Rohit Verma (Son, Gurgaon) - +91 98112 34567',
    callTranscriptRaw: 'कमला जी (पता: गोमती नगर, लखनऊ, फोन 9871100234) ने बताया कि कल रात उनके दामाद रोहित वर्मा का फोन आया था। आज सुबह 10 बजे बीपी 154/92 आया और सर घूम रहा था।'
  };

  const maskedDataPayload = {
    patientName: 'SENIOR_ID_LKO_001 [ANONYMIZED_RESIDENT]',
    aadhaarNumber: '[REDACTED_AADHAAR_HASH]',
    mobileNumber: '+91 ••••• ••234',
    homeAddress: '[ZONE: LUCKNOW_SECTOR_4] (Street level redacted)',
    emergencyContact: 'RELATION_SON [CONTACT_PROXY_HASH_#78]',
    callTranscriptRaw: '[RESIDENT_TOKEN] (पता: [ZONE_LKO], फोन [PHONE_MASKED]) ने बताया कि कल रात उनके [FAMILY_PROXY] का फोन आया था। आज सुबह 10 बजे बीपी 154/92 आया और सर घूम रहा था।'
  };

  const rbacMatrix = [
    {
      resource: 'Full Name, Phone & Exact Street Address',
      coordinator: { allowed: true, note: 'Direct physical/phone care' },
      manager: { allowed: false, note: 'Anonymized City-level only' },
      family: { allowed: true, note: 'Their own parent only' },
      externalCloud: { allowed: false, note: 'Strictly local redact before API' }
    },
    {
      resource: 'Personal Baseline & Continuous Vitals',
      coordinator: { allowed: true, note: 'For trend & safety triage' },
      manager: { allowed: false, note: 'Cohort statistical aggregates' },
      family: { allowed: false, note: 'Hidden to avoid clinical panic' },
      externalCloud: { allowed: true, note: 'Z-scores only, no PII' }
    },
    {
      resource: 'Full Audio Call Recordings & Transcripts',
      coordinator: { allowed: true, note: 'Listening for wellbeing cues' },
      manager: { allowed: false, note: 'NLP sentiment tags only' },
      family: { allowed: false, note: 'Senior privacy protected' },
      externalCloud: { allowed: false, note: 'Local Whisper on-prem' }
    },
    {
      resource: 'Non-Alarmist Weekly Wellbeing Letter',
      coordinator: { allowed: true, note: 'Reviews and signs off' },
      manager: { allowed: true, note: 'Quality audit' },
      family: { allowed: true, note: 'Only if active consent' },
      externalCloud: { allowed: true, note: 'Formatted letter text' }
    },
    {
      resource: 'Additive Risk Score Breakdown (0-100)',
      coordinator: { allowed: true, note: 'Actionable reason chips' },
      manager: { allowed: true, note: 'Queue balance and triage' },
      family: { allowed: false, note: 'Never shown numeric score' },
      externalCloud: { allowed: true, note: 'Score computation' }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Digital Personal Data Protection (DPDP) Act 2023 Compliance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Privacy, Consent & Safety Architecture
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Indian elderly care demands strict ethical guardrails. Seniors are individuals with autonomy, not passive subjects.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-xl text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero Unmasked Cloud Exfiltration</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Interactive Data Masking Demonstration */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-indigo-600" />
              Interactive PII Masking Demonstration
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              See what external models and cloud processors see versus what is guarded locally.
            </p>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsMasked(!isMasked)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
              isMasked
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 text-white animate-pulse'
            }`}
          >
            {isMasked ? <ShieldCheck className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{isMasked ? 'Privacy Masking Active (Safe)' : 'Showing Raw PII (Unsafe Mode)'}</span>
          </button>
        </div>

        {/* Masked Data Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          <div className="space-y-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Resident Identity</div>
              <div className="text-slate-900 font-mono font-bold mt-1">
                {isMasked ? maskedDataPayload.patientName : rawDataPayload.patientName}
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Contact & Phone</div>
              <div className="text-slate-900 font-mono font-bold mt-1">
                {isMasked ? maskedDataPayload.mobileNumber : rawDataPayload.mobileNumber}
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Physical Address</div>
              <div className="text-slate-900 font-mono font-bold mt-1">
                {isMasked ? maskedDataPayload.homeAddress : rawDataPayload.homeAddress}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs h-full flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Check-in Voice Note Payload</div>
                <div className="text-slate-900 font-hindi text-sm leading-relaxed mt-2 p-3 bg-white rounded-lg border border-slate-200/80">
                  "{isMasked ? maskedDataPayload.callTranscriptRaw : rawDataPayload.callTranscriptRaw}"
                </div>
              </div>
              <div className="text-[10px] text-slate-500 mt-2">
                {isMasked 
                  ? '✓ PII redacted locally via on-device regex prior to external vectorization or LLM prompt.' 
                  : '⚠️ Raw identifiable health information exposed! Masking required.'}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: Role-Based Access Control (RBAC) Matrix */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-teal-600" />
            Role-Based Access Control (RBAC) Governance Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict perimeter boundaries separating Coordinators, Operations, Families, and Cloud APIs.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Protected Data Resource</th>
                <th className="py-3 px-4">Care Coordinator</th>
                <th className="py-3 px-4">Operations Manager</th>
                <th className="py-3 px-4">Family Member</th>
                <th className="py-3 px-4">External Cloud APIs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {rbacMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{row.resource}</td>
                  
                  {/* Coordinator */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Granted
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{row.coordinator.note}</div>
                  </td>

                  {/* Manager */}
                  <td className="py-3.5 px-4">
                    {row.manager.allowed ? (
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Granted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-bold text-[11px]">
                        <XCircle className="w-3 h-3 text-slate-400" /> Restricted
                      </span>
                    )}
                    <div className="text-[10px] text-slate-400 mt-0.5">{row.manager.note}</div>
                  </td>

                  {/* Family */}
                  <td className="py-3.5 px-4">
                    {row.family.allowed ? (
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Consent Only
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-800 bg-red-50 px-2 py-0.5 rounded font-bold text-[11px]">
                        <XCircle className="w-3 h-3 text-red-500" /> Blocked
                      </span>
                    )}
                    <div className="text-[10px] text-slate-400 mt-0.5">{row.family.note}</div>
                  </td>

                  {/* External Cloud */}
                  <td className="py-3.5 px-4">
                    {row.externalCloud.allowed ? (
                      <span className="inline-flex items-center gap-1 text-blue-800 bg-blue-50 px-2 py-0.5 rounded font-bold text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" /> Anonymized
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-800 bg-red-50 px-2 py-0.5 rounded font-bold text-[11px]">
                        <XCircle className="w-3 h-3 text-red-500" /> Never
                      </span>
                    )}
                    <div className="text-[10px] text-slate-400 mt-0.5">{row.externalCloud.note}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Senior-First Consent Lifecycle Flow */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Senior Consent Lifecycle Protocol
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-sm">1. Explicit Voice Consent</div>
            <p className="text-slate-600 leading-relaxed">
              During enrollment, seniors are asked in Hindi/English if they wish routine weekly summaries shared with designated family contacts.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-sm">2. Instant Granular Revoke</div>
            <p className="text-slate-600 leading-relaxed">
              At any point during a check-in call, saying <em>"Bache ko mat bataiye"</em> instantly pauses the family companion feed without coordinator override.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-sm">3. Zero Medical Labeling</div>
            <p className="text-slate-600 leading-relaxed">
              No family member ever receives medical jargon (e.g. "hypertensive crisis" or "dementia"). Messages focus strictly on human comfort and social presence.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
