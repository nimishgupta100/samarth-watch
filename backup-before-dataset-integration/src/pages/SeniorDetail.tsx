import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
} from 'recharts';
import { 
  ArrowLeft, 
  Activity, 
  Pill, 
  MessageSquare, 
  Calendar, 
  PhoneCall, 
  ShieldAlert, 
  CheckCircle2, 
  MapPin, 
  Copy, 
  Check, 
  Sparkles, 
  Heart, 
  Languages, 
  ChevronRight,
  Play,
  Mic,
  Wifi,
  AlertTriangle,
} from 'lucide-react';
import { CueTag } from '../types';

export const SeniorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    seniors,
    toggleConsent,
    handleAlertAction,
    voiceNotes,
    wearableConnected,
    wearableReadings,
    connectWearable,
    disconnectWearable,
    injectWearableScenario,
  } = useApp();
  const { showToast } = useToast();

  const senior = seniors.find(s => s.id === id) || seniors[0];
  const history90Days = senior.history90Days || [];
  const recommendedScript = senior.recommendedScript || {
    hindi: `नमस्ते ${senior.name} जी! आशा है आप कुशल हैं।`,
    english: `Good day ${senior.name}! Calling to check in on you.`
  };
  useDocumentTitle(`${senior.name} - Baseline & Triage`);

  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'medication' | 'calls' | 'timeline'>('overview');
  const [scriptLang, setScriptLang] = useState<'hindi' | 'english'>('hindi');
  const [copiedScript, setCopiedScript] = useState(false);
  const [showEnglishTranslation, setShowEnglishTranslation] = useState(false);
  const [vitalsRange, setVitalsRange] = useState<14 | 30 | 90>(30);
  const [selectedVital, setSelectedVital] = useState<'bp' | 'sugar' | 'spo2' | 'weight'>('bp');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const handlePlayVoiceNote = (noteId: string, audioBlobUrl?: string) => {
    if (audioBlobUrl) {
      const audio = new Audio(audioBlobUrl);
      setPlayingAudioId(noteId);
      audio.onended = () => setPlayingAudioId(null);
      audio.onerror = () => setPlayingAudioId(null);
      audio.play().catch(() => setPlayingAudioId(null));
    } else {
      showToast('Playing simulated recording.', 'info');
      setPlayingAudioId(noteId);
      setTimeout(() => setPlayingAudioId(null), 2500);
    }
  };

  const copyScriptToClipboard = () => {
    const text = scriptLang === 'hindi' ? recommendedScript.hindi : recommendedScript.english;
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    showToast('Call script copied to clipboard', 'success');
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleConsentToggle = () => {
    const nextVal = !senior.familyConsentGranted;
    toggleConsent(senior.id, nextVal);
    showToast(
      nextVal 
        ? `Family portal sharing enabled for ${senior.linkedFamilyName}.` 
        : `Family portal sharing paused. Senior autonomy preserved.`,
      'info'
    );
  };

  // Vitals data mapped for Recharts with the senior's OWN baseline band
  const vitalsChartData = useMemo(() => {
    if (!senior.baseline || !senior.history90Days || senior.history90Days.length === 0) {
      return [];
    }
    const sliceDays = senior.history90Days.slice(-vitalsRange);
    const b = senior.baseline;

    return sliceDays.map(d => {
      const shortDate = d.date.slice(5);
      return {
        date: shortDate,
        fullDate: d.date,
        systolic: d.vitals.systolicBp,
        diastolic: d.vitals.diastolicBp,
        sysBaseline: b.systolicBp,
        sysUpper: +(b.systolicBp + 1.5 * b.systolicBpSd).toFixed(1),
        sysLower: +(b.systolicBp - 1.5 * b.systolicBpSd).toFixed(1),
        
        sugar: d.vitals.fastingSugar || 110,
        sugarUpper: +(b.fastingSugar + 1.5 * b.fastingSugarSd).toFixed(1),
        sugarLower: +(b.fastingSugar - 1.5 * b.fastingSugarSd).toFixed(1),
        
        spo2: d.vitals.spo2,
        spo2Baseline: b.spo2,
        
        weight: d.vitals.weight,
        weightUpper: +(b.weight + 1.5 * b.weightSd).toFixed(1),
        weightLower: +(b.weight - 1.5 * b.weightSd).toFixed(1),
      };
    });
  }, [senior, vitalsRange]);

  // "Why this score" additive horizontal data (Clean clinical colors, zero purple)
  const scoreBreakdownData = useMemo(() => {
    const bd = senior.scoreBreakdown || {
      vitalsDeviation: 0,
      nlpCallCues: 0,
      medicationAdherence: 0,
      silencePattern: 0,
      trendAcceleration: 0
    };
    return [
      { name: 'Personal Baseline Vitals Shift', value: bd.vitalsDeviation, fill: '#DC2626' },
      { name: 'Indic NLP Call Sentiment / Cues', value: bd.nlpCallCues, fill: '#EA580C' },
      { name: 'Medication Adherence Gap', value: bd.medicationAdherence, fill: '#D97706' },
      { name: 'Unusual Silence / Missed Check-ins', value: bd.silencePattern, fill: '#475569' },
      { name: 'Trend Velocity (Multi-day)', value: bd.trendAcceleration, fill: '#0F766E' },
    ];
  }, [senior]);

  const totalCalculatedScore = useMemo(() => {
    return scoreBreakdownData.reduce((acc, curr) => acc + curr.value, 0);
  }, [scoreBreakdownData]);

  const getCueBadge = (tag: CueTag) => {
    switch (tag) {
      case 'dizziness':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'pain':
        return 'bg-red-100 text-red-900 border-red-300';
      case 'fall':
        return 'bg-rose-100 text-rose-950 font-bold border-rose-400';
      case 'poor sleep':
        return 'bg-slate-200 text-slate-900 border-slate-300';
      case 'low appetite':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'confusion':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'loneliness':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'missed meds':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Back button */}
      <div>
        <Link 
          to="/coordinator"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Today's Priorities
        </Link>
      </div>

      {/* Senior Profile Summary Header Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          
          {/* Avatar, Name, Meta, Living situation */}
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white shrink-0 ${
              senior.currentUrgency === 'critical' ? 'bg-red-700' : 'bg-amber-600'
            }`}>
              <span className="text-2xl font-black">{senior.currentRiskScore}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-90">Score</span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {senior.name}
                </h1>
                <span className="text-sm font-semibold text-slate-600">
                  {senior.age} years : {senior.gender}
                </span>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border ${
                  senior.currentUrgency === 'critical'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {senior.currentUrgency} Urgency
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1.5 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {senior.city} ({senior.area})
                </span>
                <span>:</span>
                <span>{senior.livingSituation}</span>
                <span>:</span>
                <span>Coordinator: <strong className="text-slate-800">{senior.assignedCoordinatorName}</strong></span>
              </div>

              <div className="mt-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 inline-block">
                <strong>Contextual History:</strong> {senior.primaryContext}
              </div>
            </div>
          </div>

          {/* Consent Toggle & Quick Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:justify-end">
            
            {/* Consent Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-600" /> Family Portal Sharing
                </span>
                <button
                  onClick={handleConsentToggle}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-md border-2 border-transparent transition-colors focus:outline-hidden ${
                    senior.familyConsentGranted ? 'bg-teal-700' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle family sharing consent"
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-sm bg-white shadow-sm transition duration-200 ${
                      senior.familyConsentGranted ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="text-[11px] text-slate-500">
                {senior.familyConsentGranted ? (
                  <span className="text-green-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Shared with {senior.linkedFamilyName}
                  </span>
                ) : (
                  <span className="text-amber-700 font-semibold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Consent Paused (Coordinator View Only)
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const isDone = senior.alertStatus === 'done';
                  handleAlertAction(senior.id, isDone ? 'pending' : 'done');
                  showToast(isDone ? `Reopened alert for ${senior.name}` : `Resolved alert for ${senior.name}`, 'success');
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  senior.alertStatus === 'done'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-teal-700 hover:bg-teal-800 text-white shadow-2xs'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{senior.alertStatus === 'done' ? 'Resolved Today' : 'Mark as Done'}</span>
              </button>

              <button
                onClick={() => {
                  handleAlertAction(senior.id, 'snoozed');
                  showToast(`Snoozed alert for ${senior.name} for 24h`, 'info');
                }}
                className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              >
                Snooze 24h
              </button>
            </div>

          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 pt-4 overflow-x-auto no-scrollbar text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview & Call Script', icon: PhoneCall },
            { id: 'vitals', label: 'Vitals & Personal Baseline', icon: Activity },
            { id: 'medication', label: 'Medication Adherence Heatmap', icon: Pill },
            { id: 'calls', label: 'Call Notes & Indic NLP Cues', icon: MessageSquare },
            { id: 'timeline', label: '90-Day Event Timeline', icon: Calendar },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`min-h-[44px] px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* TAB 1: OVERVIEW & CALL SCRIPT */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* "Why this score" additive panel */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  "Why This Score": Additive Risk Attribution
                </h3>
                <span className="text-xs font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200">
                  Total: {totalCalculatedScore} / 100
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Exact point contributions that sum directly to the senior’s score. Fully auditable.
              </p>

              <div className="space-y-3.5">
                {scoreBreakdownData.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{item.name}</span>
                      <span className="font-bold text-slate-900 font-mono">+{item.value} pts</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-md h-2.5 overflow-hidden">
                      <div
                        className="h-2.5 rounded-md transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (item.value / 40) * 100)}%`,
                          backgroundColor: item.fill,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <strong>Calibrated Baseline:</strong> Established over 90 days. Deviations reflect departure from {senior.name}'s own normal, not arbitrary population averages.
              </div>
            </div>

            {/* Recommended Next Step & Call Script */}
            <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5" /> Coordinator Action Guide
                  </span>
                  <span className="text-xs font-bold bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-md border border-teal-400/30">
                    Recommended: {senior.recommendedAction}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  Suggested Call Script (Culturally Grounded)
                </h3>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Care Coordinators use this conversational guide to gently verify the flagged risk without causing alarm.
                </p>

                {/* Script Language Switcher */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setScriptLang('hindi')}
                    className={`min-h-[40px] px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                      scriptLang === 'hindi'
                        ? 'bg-teal-700 text-white'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    Hindi (हिंदी)
                  </button>
                  <button
                    onClick={() => setScriptLang('english')}
                    className={`min-h-[40px] px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                      scriptLang === 'english'
                        ? 'bg-teal-700 text-white'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    English
                  </button>
                </div>

                {/* Script Box */}
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-sm leading-relaxed font-hindi">
                  {scriptLang === 'hindi' ? recommendedScript.hindi : recommendedScript.english}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-800">
                <button
                  onClick={copyScriptToClipboard}
                  className={`min-h-[40px] px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors flex items-center gap-1.5 border border-slate-700`}
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Copied Script!' : 'Copy Script'}</span>
                </button>

                <a
                  href={`tel:${senior.phone}`}
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-slate-950" />
                  <span>Call {senior.phone}</span>
                </a>
              </div>

            </div>

          </div>

          {/* Vitals Summary & Latest Call Note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Vitals Summary Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-700" />
                  Today's Recorded Vitals vs Personal Baseline
                </h3>
                <button 
                  onClick={() => setActiveTab('vitals')}
                  className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-0.5"
                >
                  View 90d Charts <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {senior.history90Days && senior.history90Days.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="text-[11px] font-semibold text-slate-500">Blood Pressure</div>
                    <div className="text-base font-extrabold text-slate-900 mt-1">
                      {senior.history90Days[senior.history90Days.length - 1].vitals.systolicBp}/
                      {senior.history90Days[senior.history90Days.length - 1].vitals.diastolicBp}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Baseline: {senior.baseline ? `${senior.baseline.systolicBp}/${senior.baseline.diastolicBp}` : 'Not added yet'}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="text-[11px] font-semibold text-slate-500">Fasting Sugar</div>
                    <div className="text-base font-extrabold text-slate-900 mt-1">
                      {senior.history90Days[senior.history90Days.length - 1].vitals.fastingSugar} <span className="text-[11px] font-normal">mg/dL</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Baseline: {senior.baseline ? `${senior.baseline.fastingSugar} mg/dL` : 'Not added yet'}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="text-[11px] font-semibold text-slate-500">SpO2 Oxygen</div>
                    <div className="text-base font-extrabold text-slate-900 mt-1">
                      {senior.history90Days[senior.history90Days.length - 1].vitals.spo2}%
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Baseline: {senior.baseline ? `${senior.baseline.spo2}%` : 'Not added yet'}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="text-[11px] font-semibold text-slate-500">Weight</div>
                    <div className="text-base font-extrabold text-slate-900 mt-1">
                      {senior.history90Days[senior.history90Days.length - 1].vitals.weight} <span className="text-[11px] font-normal">kg</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Baseline: {senior.baseline ? `${senior.baseline.weight} kg` : 'Not added yet'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-600">
                  No vitals readings recorded yet. Baseline not established.
                </div>
              )}
            </div>

            {/* Latest Call Note Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-700" />
                  Latest Check-in Call Transcript
                </h3>
                <button 
                  onClick={() => setActiveTab('calls')}
                  className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-0.5"
                >
                  All Call Notes <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {senior.history90Days && senior.history90Days.length > 0 && senior.history90Days[senior.history90Days.length - 1].callNote ? (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-hindi text-slate-800 leading-relaxed">
                    "{senior.history90Days[senior.history90Days.length - 1].callNote?.originalText}"
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-400">Extracted Cues:</span>
                    {senior.history90Days[senior.history90Days.length - 1].callNote?.cues.map((cue, cIdx) => (
                      <span 
                        key={cIdx}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCueBadge(cue.tag)}`}
                      >
                        {cue.tag.toUpperCase()} ({cue.severity})
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                  No direct call recorded today; automated check-in pending.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: VITALS WITH PERSONAL BASELINE BAND SHADED */}
      {activeTab === 'vitals' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-700" />
                Personalized Baseline Vitals Trajectory
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                The shaded band represents <strong className="text-slate-800">{senior.name}'s OWN baseline band (Mean ± 1.5 SD)</strong>, NOT population averages.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setVitalsRange(14)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  vitalsRange === 14 ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                14 Days
              </button>
              <button
                onClick={() => setVitalsRange(30)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  vitalsRange === 30 ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setVitalsRange(90)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  vitalsRange === 90 ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                90 Days
              </button>
            </div>
          </div>

          {!senior.baseline ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm font-semibold text-slate-700">Baseline not established yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Personalized baseline trajectory and charts will appear here as health readings are logged.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'bp', label: `Blood Pressure (${senior.baseline.systolicBp}/${senior.baseline.diastolicBp} mmHg baseline)` },
                  { id: 'sugar', label: `Fasting Blood Glucose (${senior.baseline.fastingSugar} mg/dL baseline)` },
                  { id: 'spo2', label: `Pulse Oximetry SpO2 (${senior.baseline.spo2}% baseline)` },
                  { id: 'weight', label: `Body Weight (${senior.baseline.weight} kg baseline)` },
                ].map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVital(v.id as any)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      selectedVital === v.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={vitalsChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis 
                      domain={
                        selectedVital === 'bp' 
                          ? [100, 180] 
                          : selectedVital === 'sugar' 
                            ? [80, 220] 
                            : selectedVital === 'spo2'
                              ? [88, 100]
                              : [45, 90]
                      } 
                      tick={{ fontSize: 11 }} 
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-xs space-y-1">
                              <div className="font-bold border-b border-slate-700 pb-1">{data.fullDate}</div>
                              {selectedVital === 'bp' && (
                                <>
                                  <div className="text-red-300 font-bold">Systolic: {data.systolic} mmHg</div>
                                  <div className="text-slate-300">Diastolic: {data.diastolic} mmHg</div>
                                  <div className="text-teal-300">Baseline Mean: {data.sysBaseline} mmHg</div>
                                  <div className="text-slate-400">Normal Band: {data.sysLower} - {data.sysUpper} mmHg</div>
                                </>
                              )}
                              {selectedVital === 'sugar' && (
                                <>
                                  <div className="text-amber-300 font-bold">Sugar: {data.sugar} mg/dL</div>
                                  <div className="text-teal-300">Baseline Mean: {senior.baseline?.fastingSugar} mg/dL</div>
                                  <div className="text-slate-400">Normal Band: {data.sugarLower} - {data.sugarUpper} mg/dL</div>
                                </>
                              )}
                              {selectedVital === 'spo2' && (
                                <>
                                  <div className="text-blue-300 font-bold">SpO2: {data.spo2}%</div>
                                  <div className="text-teal-300">Baseline: {data.spo2Baseline}%</div>
                                </>
                              )}
                              {selectedVital === 'weight' && (
                                <>
                                  <div className="text-slate-200 font-bold">Weight: {data.weight} kg</div>
                                  <div className="text-teal-300">Baseline: {senior.baseline?.weight} kg</div>
                                </>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    {selectedVital === 'bp' && (
                      <>
                        <Area
                          type="monotone"
                          dataKey="sysUpper"
                          stroke="none"
                          fill="#0D9488"
                          fillOpacity={0.15}
                        />
                        <Line
                          type="monotone"
                          dataKey="sysBaseline"
                          stroke="#0D9488"
                          strokeDasharray="4 4"
                          strokeWidth={1.8}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="systolic"
                          stroke="#DC2626"
                          strokeWidth={2.5}
                          dot={{ r: 3.5, fill: '#DC2626' }}
                        />
                      </>
                    )}

                    {selectedVital === 'sugar' && (
                      <>
                        <Area
                          type="monotone"
                          dataKey="sugarUpper"
                          stroke="none"
                          fill="#D97706"
                          fillOpacity={0.18}
                        />
                        <Line
                          type="monotone"
                          dataKey="sugar"
                          stroke="#D97706"
                          strokeWidth={2.5}
                          dot={{ r: 3.5, fill: '#D97706' }}
                        />
                      </>
                    )}

                    {selectedVital === 'spo2' && (
                      <Line
                        type="monotone"
                        dataKey="spo2"
                        stroke="#2563EB"
                        strokeWidth={2.5}
                        dot={{ r: 3.5, fill: '#2563EB' }}
                      />
                    )}

                    {selectedVital === 'weight' && (
                      <>
                        <Area
                          type="monotone"
                          dataKey="weightUpper"
                          stroke="none"
                          fill="#475569"
                          fillOpacity={0.15}
                        />
                        <Line
                          type="monotone"
                          dataKey="weight"
                          stroke="#0D9488"
                          strokeWidth={2.5}
                          dot={{ r: 3.5, fill: '#0D9488' }}
                        />
                      </>
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-red-600 inline-block" /> Actual Measurement
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-teal-500/30 border border-teal-600 inline-block" /> Shaded: Senior's Personal Baseline Band
                  </span>
                </div>
                <span>Rolling Z-score deviations (N=30)</span>
              </div>
            </>
          )}

          {/* WEARABLE & SMART BAND CONTINUOUS TELEMETRY (Change 4) */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-3 h-3 rounded-full ${wearableConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-teal-700" />
                    Wearable Device Telemetry : Samarth Demo Band
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Status: {wearableConnected ? 'Connected & Streaming (simulated 30s intervals)' : 'Disconnected (Bluetooth standby)'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (wearableConnected) {
                      disconnectWearable();
                      showToast('Wearable simulator disconnected.', 'info');
                    } else {
                      connectWearable();
                      showToast('Wearable simulator connected. Streaming telemetry.', 'success');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    wearableConnected
                      ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                      : 'bg-teal-700 border-teal-700 text-white hover:bg-teal-800'
                  }`}
                >
                  {wearableConnected ? 'Disconnect Band' : 'Connect Demo Band'}
                </button>
              </div>
            </div>

            {/* Simulated Scenario Injectors (Demo Controls) */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Clinical Simulation Scenarios (Prototype Testing)
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!wearableConnected) connectWearable();
                    injectWearableScenario('rising_hr');
                    showToast('Injected scenario: Rising Heart Rate (>130 bpm).', 'info');
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
                >
                  Simulate Tachycardia (&gt;130 bpm)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!wearableConnected) connectWearable();
                    injectWearableScenario('low_spo2');
                    showToast('Injected scenario: Low SpO2 (&lt;90%).', 'info');
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-900 border border-blue-300 hover:bg-blue-200"
                >
                  Simulate Hypoxia (&lt;90% SpO2)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!wearableConnected) connectWearable();
                    injectWearableScenario('fall');
                    showToast('Injected scenario: Resident Fall Detected!', 'error');
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-red-100 text-red-900 border border-red-300 hover:bg-red-200"
                >
                  Simulate Fall Event
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!wearableConnected) connectWearable();
                    injectWearableScenario('device_sos');
                    showToast('Injected scenario: Smartwatch SOS Button Pressed!', 'error');
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-red-100 text-red-900 border border-red-300 hover:bg-red-200"
                >
                  Simulate Smartwatch SOS
                </button>
              </div>
            </div>

            {/* Latest Readings Stream */}
            {wearableReadings.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold text-slate-600 block">
                  Latest Wearable Telemetry Readings (Browser Local Simulation):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {wearableReadings.slice(0, 4).map((r) => (
                    <div
                      key={r.id}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs"
                    >
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        {r.type.replace('_', ' ')}
                      </span>
                      <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                        {r.value} {r.unit}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: MEDICATION ADHERENCE HEATMAP */}
      {activeTab === 'medication' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Pill className="w-5 h-5 text-amber-500" />
                90-Day Medication Adherence Calendar Heatmap
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily smart dispenser logs and call self-reports for prescribed schedule.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> 100% Taken
              </span>
              <span className="flex items-center gap-1 text-amber-700 font-semibold">
                <span className="w-3 h-3 rounded bg-amber-400 inline-block" /> Partial
              </span>
              <span className="flex items-center gap-1 text-red-700 font-semibold">
                <span className="w-3 h-3 rounded bg-red-500 inline-block" /> Missed
              </span>
            </div>
          </div>

          <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-18 gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            {history90Days.map((d, idx) => {
              const rate = d.medication.adherenceRate;
              const bg = rate === 1.0 ? 'bg-emerald-600 hover:bg-emerald-700' : rate >= 0.5 ? 'bg-amber-500 hover:bg-amber-600' : 'bg-red-600 hover:bg-red-700';
              return (
                <div
                  key={idx}
                  title={`${d.date}: ${d.medication.taken}/${d.medication.scheduled} doses taken (${Math.round(rate * 100)}%)`}
                  className={`h-8 rounded-md ${bg} transition-all cursor-pointer flex items-center justify-center text-[10px] text-white font-bold shadow-2xs`}
                >
                  {d.date.slice(8)}
                </div>
              );
            })}
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recent Missed Dose Observations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {history90Days.slice(-14).filter(d => d.medication.missedDoses.length > 0).length === 0 ? (
                <div className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                  No missed medications logged in the past 14 days. Adherence is optimal.
                </div>
              ) : (
                history90Days.slice(-14).filter(d => d.medication.missedDoses.length > 0).map((d, mIdx) => (
                  <div key={mIdx} className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-red-950 mb-1">
                      <span>{d.date}</span>
                      <span className="text-[10px] bg-red-200 text-red-900 px-1.5 py-0.2 rounded font-semibold">
                        Missed Dose
                      </span>
                    </div>
                    <ul className="list-disc list-inside text-red-800 space-y-0.5">
                      {d.medication.missedDoses.map((dose, dIdx) => (
                        <li key={dIdx}>{dose}</li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: CALL NOTES */}
      {activeTab === 'calls' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-700" />
                Multilingual Check-in Notes & Extracted Cues
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Indian code-mixed Hindi, Hinglish, and English call notes processed by Indic NLP engine.
              </p>
            </div>

            <button
              onClick={() => {
                setShowEnglishTranslation(!showEnglishTranslation);
                showToast(showEnglishTranslation ? 'Displaying original code-mixed transcripts' : 'Displaying English translations for coordinator', 'info');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                showEnglishTranslation
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{showEnglishTranslation ? 'Showing English Translation' : 'Translate all to English'}</span>
            </button>
          </div>

          {/* SENIOR INBOUND VOICE CHECK-IN INBOX (Change 1) */}
          <div className="space-y-3 pb-5 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Mic className="w-4 h-4 text-teal-700" />
                Senior Voice Notes (Routed to Assigned Coordinator Only)
              </h3>
              <span className="text-xs text-slate-500">
                Coordinator: <strong>{senior.assignedCoordinatorName}</strong>
              </span>
            </div>

            {voiceNotes.filter((vn) => vn.seniorId === senior.id && vn.coordinatorId === senior.assignedCoordinatorId).length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 italic">
                No voice check-in recordings from this resident yet.
              </div>
            ) : (
              <div className="space-y-3">
                {voiceNotes
                  .filter((vn) => vn.seniorId === senior.id && vn.coordinatorId === senior.assignedCoordinatorId)
                  .map((vn) => (
                    <div
                      key={vn.id}
                      className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                        vn.isHighPriority
                          ? 'bg-red-50/70 border-red-300'
                          : 'bg-teal-50/40 border-teal-200'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-slate-900">
                            {new Date(vn.timestamp).toLocaleDateString()} at{' '}
                            {new Date(vn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-slate-400">:</span>
                          <span className="text-slate-500">{vn.durationSeconds}s audio recording</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {vn.isHighPriority ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300">
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                              Urgent Voice Note
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-300">
                              Routine Voice Note
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handlePlayVoiceNote(vn.id, vn.audioBlobUrl)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>{playingAudioId === vn.id ? 'Playing...' : 'Play Audio'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Plain-language Summary */}
                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-900 leading-relaxed">
                        <strong className="text-slate-800">Coordinator Summary:</strong> {vn.plainSummary}
                      </div>

                      {/* Extracted Cues with severity */}
                      {vn.extractedCues && vn.extractedCues.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Extracted Health Cues (Coordinator Triage):
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {vn.extractedCues.map((cue, idx) => (
                              <span
                                key={idx}
                                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${
                                  cue.severity === 'severe'
                                    ? 'bg-red-100 text-red-900 border-red-300'
                                    : cue.severity === 'moderate'
                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                    : 'bg-slate-100 text-slate-800 border-slate-200'
                                }`}
                              >
                                <span className="uppercase text-[10px] font-bold">{cue.tag}</span>
                                <span className="opacity-80 font-normal">"{cue.quote}"</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Transcript */}
                      {vn.transcript && (
                        <div className="text-[11px] text-slate-600 bg-slate-100/70 p-2.5 rounded border border-slate-200 font-hindi">
                          <span className="font-bold text-slate-700 font-sans">Transcript:</span> "{vn.transcript}"
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {history90Days.slice(-10).reverse().filter(d => d.callNote).map((d, cIdx) => {
              const note = d.callNote!;
              return (
                <div 
                  key={cIdx} 
                  className={`p-5 rounded-xl border transition-all ${
                    note.sentiment === 'concerning' || note.sentiment === 'critical'
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-900">{note.date} at {note.time}</span>
                      <span className="text-slate-400">:</span>
                      <span className="text-slate-500">{note.durationMinutes} mins call</span>
                      <span className="text-slate-400">:</span>
                      <span className="uppercase text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {note.language}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                      note.sentiment === 'critical'
                        ? 'bg-red-100 text-red-800 border-red-300'
                        : note.sentiment === 'concerning'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-teal-100 text-teal-800 border-teal-300'
                    }`}>
                      {note.sentiment} Sentiment
                    </span>
                  </div>

                  <div className="text-xs text-slate-800 leading-relaxed font-hindi bg-white p-3.5 rounded-xl border border-slate-200 mb-3">
                    {showEnglishTranslation ? note.englishTranslation : note.originalText}
                  </div>

                  {note.cues.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Extracted Health & Wellbeing Cues
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {note.cues.map((cue, qIdx) => (
                          <div 
                            key={qIdx}
                            className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${getCueBadge(cue.tag)}`}
                          >
                            <span className="font-bold uppercase text-[10px]">{cue.tag}</span>
                            <span className="text-[11px] opacity-80">"{cue.quote}"</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {note.coordinatorNotes && (
                    <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                      <strong>Coordinator Follow-up Note:</strong> {note.coordinatorNotes}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 5: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-700" />
            Chronological Care & Signal Timeline
          </h2>

          <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
            {history90Days.slice(-14).reverse().map((d, tIdx) => (
              <div key={tIdx} className="relative">
                <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-md border-2 border-white shadow-2xs ${
                  d.urgency === 'critical' ? 'bg-red-600' : d.urgency === 'moderate' ? 'bg-amber-500' : 'bg-teal-600'
                }`} />

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                    <span>{d.date}</span>
                    <span className="text-[11px] font-mono text-slate-600">Risk Score: {d.riskScore}/100</span>
                  </div>
                  <div className="text-slate-600 space-y-1">
                    <div>Systolic BP: <strong>{d.vitals.systolicBp} mmHg</strong> : Sugar: <strong>{d.vitals.fastingSugar} mg/dL</strong></div>
                    {d.callNote && (
                      <div className="text-slate-800 font-hindi italic">
                        "{d.callNote.englishTranslation}"
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strict Audit Footer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
        <span className="flex items-center gap-2 font-medium">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <strong>Audit Safeguard:</strong> This alert is a probabilistic risk signal, not a diagnosis. Human coordinator assessment is required prior to contacting families or clinicians.
        </span>
        <span className="font-mono text-[10px] text-amber-700 hidden sm:inline">
          System ID: SAMARTH-CORE-v2.4
        </span>
      </div>

    </div>
  );
};
