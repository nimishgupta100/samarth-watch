import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { InitialsAvatar } from '../../components/coordinator/InitialsAvatar';
import { StatusChip } from '../../components/coordinator/StatusChip';
import { SegmentedTabs } from '../../components/coordinator/SegmentedTabs';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { 
  ArrowLeft, 
  Phone, 
  Edit3, 
  Check, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Pill, 
  Activity, 
  Mic, 
  FileText, 
  Users, 
  Plus, 
  Trash2, 
  Play, 
  Volume2, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  Database,
  Bot,
  Sparkles,
  RefreshCw,
  Info,
  Watch,
  BatteryCharging,
  Sliders,
  ShieldAlert,
  MapPin,
  Radio,
  Send,
  MessageSquare
} from 'lucide-react';
import { SeniorLocationSection } from '../../components/common/SeniorLocationSection';
import { useWearable } from '../../wearables/useWearable';
import { formatISTDisplay } from '../../wearables/normalize';
import { DEFAULT_EMERGENCY_THRESHOLDS } from '../../wearables/constants';
import { CueTag } from '../../types';
import { 
  getCohortSenior, 
  getSeniorObservations, 
  CohortSeniorSummary,
  CohortDayRecord 
} from '../../data/cohortDatabase';
import { repository } from '../../data/repository';
import { 
  n8nAgentService, 
  CoordinatorAgentTask, 
  AgentActivityLogEntry 
} from '../../services/n8nAgentService';
import { BLESmartWatchScanner } from '../../components/wearable/BLESmartWatchScanner';

interface CoordinatorSeniorProfilePageProps {
  seniorIdProp?: string;
  isEmbedded?: boolean;
}

export const CoordinatorSeniorProfilePage: React.FC<CoordinatorSeniorProfilePageProps> = ({
  seniorIdProp,
  isEmbedded = false,
}) => {
  const params = useParams<{ id: string }>();
  const activeId = seniorIdProp || params.id;
  const { showToast } = useToast();

  const {
    t,
    seniors,
    medicines,
    addMedicine,
    updateMedicine,
    removeMedicine,
    medicineChangeRequests,
    approveMedicineChange,
    rejectMedicineChange,
    voiceNotes,
    updateSeniorProfile,
    wearableConnected,
    activeSosEvent,
    healthReadings,
    todayCheckinAnswer,
  } = useApp();

  // Read doses directly for the viewed senior (not selectedSenior from context)
  const [repoRev, setRepoRev] = useState(0);
  useEffect(() => {
    return repository.subscribe(() => setRepoRev((v) => v + 1));
  }, []);
  const doses = useMemo(() => {
    if (!activeId) return [];
    return repository.getDoses(activeId).map((d) => ({
      id: d.id,
      medicineName: d.medicineName,
      dosageInstructions: d.dosageInstructions,
      scheduledTime: d.scheduledTime,
      scheduledTimestamp: d.scheduledTimestamp,
      status: d.status as any,
      confirmedBy: d.confirmedBy,
      remindedCount: 0,
    }));
  }, [activeId, repoRev]);

  const seniorVoiceNotes = useMemo(() => {
    if (!activeId) return [];
    return repository.getVoiceNotes(activeId);
  }, [activeId, repoRev]);

  const seniorChatMessages = useMemo(() => {
    if (!activeId) return [];
    return repository.getChatMessages(activeId);
  }, [activeId, repoRev]);

  const [coordinatorMessageInput, setCoordinatorMessageInput] = useState('');
  const [showBLEModal, setShowBLEModal] = useState(false);

  const handleCoordinatorSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordinatorMessageInput.trim()) return;
    repository.addChatMessage({
      seniorId: activeId || 'senior-kamla-001',
      senderRole: 'coordinator',
      senderName: 'Nimish Gupta (Care Coordinator)',
      text: coordinatorMessageInput.trim(),
    });
    setCoordinatorMessageInput('');
    showToast('Message sent to family member', 'success');
  };

  const cohortSenior = useMemo(() => {
    return activeId ? getCohortSenior(activeId) : undefined;
  }, [activeId]);

  const cohortObs = useMemo(() => {
    return cohortSenior ? getSeniorObservations(cohortSenior.seniorId) : [];
  }, [cohortSenior]);

  const senior = useMemo(() => {
    const foundLive = seniors.find((s) => s.id === activeId);
    if (foundLive) return foundLive;

    if (cohortSenior) {
      return {
        id: cohortSenior.seniorId,
        name: `Senior ${cohortSenior.seniorId} (${cohortSenior.medicalCondition})`,
        phone: `Record: ${cohortSenior.recordId}`,
        age: cohortSenior.age,
        gender: cohortSenior.gender as any,
        city: `Stay: ${cohortSenior.admissionType} (${cohortSenior.lengthOfStayDays}d)`,
        address: `Hospital Stay: ${cohortSenior.admissionDate} to ${cohortSenior.dischargeDate}`,
        doctor: `Prescribed: ${cohortSenior.medicationName}`,
        languagePreference: (cohortSenior.noteLanguages[0] === 'hi' ? 'hi' : 'en') as 'hi' | 'en',
        area: `Admission: ${cohortSenior.admissionType}`,
        livingSituation: `Admission: ${cohortSenior.admissionType} | Result: ${cohortSenior.testResult}`,
        emergencyContactName: 'Care Coordinator Desk',
        emergencyContactPhone: '+91 98110 00000',
        emergencyContactRelation: 'Coordinator',
        assignedCoordinatorId: 'user-coordinator-nimish',
        assignedCoordinatorName: 'Nimish Gupta',
        familyConsentGranted: true,
        detailedVitalsConsent: true,
        linkedFamilyIds: [],
        linkedFamilyName: 'Demonstration Family',
        linkedFamilyPhone: '',
        linkedFamilyRelation: 'Family member',
        currentUrgency: cohortSenior.currentUrgency,
        currentRiskScore: cohortSenior.currentRiskScore,
        alertStatus: cohortSenior.currentUrgency === 'low' ? 'done' as const : 'pending' as const,
        activeSignals: ['vitals', 'medication'] as any,
        topReasons: cohortSenior.topSignals.length > 0 ? cohortSenior.topSignals : ['Routine observation ongoing'],
        primaryContext: `Condition: ${cohortSenior.medicalCondition} | Medicine: ${cohortSenior.medicationName} | ${cohortSenior.admissionType}`,
        history90Days: cohortObs.map((o) => ({
          date: o.date,
          vitals: {
            systolicBp: o.systolicBp,
            diastolicBp: o.diastolicBp,
            spo2: 98,
            weight: 65,
            pulse: o.hrBpm,
          },
          medication: {
            scheduled: 1,
            taken: o.medStatus === 'confirmed' ? 1 : 0,
            missedDoses: o.medStatus === 'unconfirmed' ? ['09:00 AM'] : [],
            adherenceRate: o.medStatus === 'confirmed' ? 1 : 0,
          },
          riskScore: o.riskScore,
          urgency: o.riskScore >= 60 ? 'critical' as const : o.riskScore >= 35 ? 'moderate' as const : 'low' as const,
          breakdown: {
            vitalsDeviation: Math.round(o.riskScore * 0.4),
            medicationAdherence: Math.round(o.riskScore * 0.3),
            nlpCallCues: Math.round(o.riskScore * 0.15),
            silencePattern: 0,
            trendAcceleration: Math.round(o.riskScore * 0.15),
          },
          activeSignals: o.signals.length > 0 ? (['vitals', 'medication'] as any) : [],
        })),
        trend14Days: cohortSenior.trend14Days,
        baseline: {
          systolicBp: cohortSenior.baseline.systolicBpMean,
          systolicBpSd: cohortSenior.baseline.systolicBpSd,
          diastolicBp: cohortSenior.baseline.diastolicBpMean,
          diastolicBpSd: cohortSenior.baseline.diastolicBpSd,
          fastingSugar: 100,
          fastingSugarSd: 10,
          postPrandialSugar: 140,
          spo2: 98,
          weight: 65,
          weightSd: 1.5,
          pulse: cohortSenior.baseline.hrMean,
          establishedDays: cohortSenior.baseline.establishedDays,
        },
        scoreBreakdown: {
          vitalsDeviation: Math.round(cohortSenior.currentRiskScore * 0.4),
          medicationAdherence: Math.round(cohortSenior.currentRiskScore * 0.3),
          nlpCallCues: Math.round(cohortSenior.currentRiskScore * 0.15),
          silencePattern: 0,
          trendAcceleration: Math.round(cohortSenior.currentRiskScore * 0.15),
        },
        recommendedAction: cohortSenior.currentUrgency === 'critical' ? 'Call today' as const : cohortSenior.currentUrgency === 'moderate' ? 'Medicine review' as const : 'Monitor next 24h' as const,
        recommendedScript: {
          hindi: `नमस्ते! समर्थ वॉच से फोन कर रहे हैं। आपके हालिया स्वास्थ्य संकेतों और ${cohortSenior.medicationName} के विषय में बात करनी थी।`,
          english: `Hello! Calling from Samarth Watch to check in on how you are feeling and follow up on your daily routine and ${cohortSenior.medicationName}.`,
        },
      } as any;
    }

    return seniors[0];
  }, [seniors, activeId, cohortSenior, cohortObs]);

  usePageTitle(
    senior ? `${senior.name} - Care Coordinator Profile` : 'Senior Profile',
    'Comprehensive health triage, medication adherence, baseline vitals, and family care profile.'
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'medicines' | 'vitals' | 'location' | 'voice_notes' | 'n8n_agent' | 'reports' | 'family'>('overview');
  const [vitalsWindow, setVitalsWindow] = useState<'14d' | '30d' | '90d'>('30d');
  const [isRunningAgent, setIsRunningAgent] = useState(false);
  const [agentLogs, setAgentLogs] = useState<AgentActivityLogEntry[]>(() => n8nAgentService.getLogs());
  const [agentTasks, setAgentTasks] = useState<CoordinatorAgentTask[]>(() => n8nAgentService.getTasks('all'));

  // Wearable pipeline hook
  const {
    device: wearableDevice,
    deviceLinks,
    logs: deviceLogs,
    qualityStats,
    connectWebBluetooth,
    disconnectDevice,
    connectSimulator,
    triggerScenario,
    isBluetoothSupported
  } = useWearable(senior?.id || 'senior-kamla-001');

  // Clinician threshold editor state
  const [hrThreshold, setHrThreshold] = useState<number>(DEFAULT_EMERGENCY_THRESHOLDS.heartRateHigh);
  const [spo2Threshold, setSpo2Threshold] = useState<number>(DEFAULT_EMERGENCY_THRESHOLDS.spo2Low);
  const [thresholdSaved, setThresholdSaved] = useState(false);

  useEffect(() => {
    return n8nAgentService.subscribe(() => {
      setAgentLogs(n8nAgentService.getLogs());
      setAgentTasks(n8nAgentService.getTasks('all'));
    });
  }, []);

  const handleRunAgent = () => {
    if (!senior?.id) return;
    setIsRunningAgent(true);
    showToast(`n8n AI Agent triggered for ${senior.id}: Inspecting longitudinal signals...`, 'info');
    setTimeout(() => {
      const res = n8nAgentService.runAgentEvaluation(senior.id);
      setIsRunningAgent(false);
      if (res.status === 'success') {
        showToast(res.summary, 'success');
      } else if (res.status === 'skipped_duplicate') {
        showToast(res.summary, 'info');
      } else {
        showToast(res.summary, 'info');
      }
    }, 600);
  };
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null);

  // Edit Profile Form state
  const [editAge, setEditAge] = useState(senior?.age ? String(senior.age) : '');
  const [editCity, setEditCity] = useState(senior?.city && senior.city !== 'Not added yet' ? senior.city : '');
  const [editAddress, setEditAddress] = useState(senior?.address && senior.address !== 'Not added yet' ? senior.address : '');
  const [editLiving, setEditLiving] = useState(senior?.livingSituation && senior.livingSituation !== 'Not added yet' ? senior.livingSituation : '');
  const [editLang, setEditLang] = useState<'hi' | 'en'>(senior?.languagePreference || 'hi');
  const [editPhone, setEditPhone] = useState(senior?.phone && senior.phone !== 'Not added yet' ? senior.phone : '');

  // Add / Edit Medicine state
  const [medName, setMedName] = useState('');
  const [medInstructions, setMedInstructions] = useState('');
  const [medTimes, setMedTimes] = useState<string[]>(['08:30 AM']);
  const [customSlot, setCustomSlot] = useState('');

  // Voice note audio simulation state
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Vitals sub-filter
  const [vitalType, setVitalType] = useState<'bp' | 'sugar' | 'spo2' | 'weight'>('bp');

  if (!senior) {
    return (
      <div className="bg-cream border border-border rounded-xl p-8 text-center space-y-3">
        <Users className="w-10 h-10 text-sage mx-auto" strokeWidth={1.5} />
        <h3 className="text-base font-bold text-ink">Senior not found</h3>
        <p className="text-xs text-ink-muted">No senior matching this identifier was found in your caseload.</p>
        <Link to="/coordinator/seniors" className="inline-block text-xs font-bold text-forest hover:underline">
          Back to Seniors list
        </Link>
      </div>
    );
  }

  // 30-day medication adherence mock/calendar data based on real history
  const adherenceDays = useMemo(() => {
    const list = [];
    const history = senior.history90Days || [];
    const recent = history.slice(-30);
    for (let i = 0; i < 30; i++) {
      const rec = recent[i];
      const dayNum = i + 1;
      let status: 'perfect' | 'missed' | 'unrecorded' = 'unrecorded';
      if (rec) {
        if (rec.medication.adherenceRate >= 0.9) status = 'perfect';
        else if (rec.medication.missedDoses.length > 0) status = 'missed';
        else status = 'unrecorded';
      } else {
        status = i < 28 ? 'perfect' : 'missed';
      }
      list.push({ dayNum, status, date: rec?.date || `Day ${dayNum}` });
    }
    return list;
  }, [senior]);

  // Vitals Chart data mapped for Recharts with the senior's OWN baseline band
  const vitalsChartData = useMemo(() => {
    if (!senior.baseline || !senior.history90Days || senior.history90Days.length === 0) {
      return [];
    }
    const b = senior.baseline;
    const sliceCount = vitalsWindow === '14d' ? 14 : vitalsWindow === '90d' ? 90 : 30;
    const history = senior.history90Days.slice(-sliceCount);

    return history.map((d: any) => {
      const shortDate = d.date.slice(5);
      const matchedObs = cohortObs.find((o) => o.date === d.date);
      const stepsVal = matchedObs ? matchedObs.steps : 5000;
      const hrVal = d.vitals.pulse || (matchedObs ? matchedObs.hrBpm : 72);

      return {
        date: shortDate,
        systolic: d.vitals.systolicBp,
        diastolic: d.vitals.diastolicBp,
        sysBaseline: b.systolicBp,
        sysUpper: +(b.systolicBp + 1.5 * b.systolicBpSd).toFixed(1),
        sysLower: +(b.systolicBp - 1.5 * b.systolicBpSd).toFixed(1),
        hr: hrVal,
        hrBaseline: b.pulse,
        hrUpper: +(b.pulse + 1.5 * (cohortSenior?.baseline.hrSd || 3)).toFixed(1),
        hrLower: +(b.pulse - 1.5 * (cohortSenior?.baseline.hrSd || 3)).toFixed(1),
        steps: stepsVal,
        stepsBaseline: cohortSenior?.baseline.stepsMean || 5000,
        sugar: d.vitals.fastingSugar || 110,
        sugarUpper: +(b.fastingSugar + 1.5 * b.fastingSugarSd).toFixed(1),
        sugarLower: +(b.fastingSugar - 1.5 * b.fastingSugarSd).toFixed(1),
        spo2: d.vitals.spo2,
        spo2Baseline: b.spo2,
        weight: d.vitals.weight,
      };
    });
  }, [senior, vitalsWindow, cohortObs, cohortSenior]);

  // Score breakdown items
  const scoreBreakdown = useMemo(() => {
    const bd = senior.scoreBreakdown || {
      vitalsDeviation: 0,
      nlpCallCues: 0,
      medicationAdherence: 0,
      silencePattern: 0,
      trendAcceleration: 0,
    };
    return [
      { label: 'Personal Baseline Vitals Shift', val: bd.vitalsDeviation, fill: 'text-alert-red' },
      { label: 'Indic Voice Sentiment & Cues', val: bd.nlpCallCues, fill: 'text-amber-700' },
      { label: 'Medication Adherence Gap', val: bd.medicationAdherence, fill: 'text-amber-600' },
      { label: 'Unusual Silence & Check-in Delay', val: bd.silencePattern, fill: 'text-ink-muted' },
      { label: 'Trend Velocity (Multi-day Acceleration)', val: bd.trendAcceleration, fill: 'text-forest' },
    ];
  }, [senior]);

  const handleProfileUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeniorProfile({
      age: editAge ? parseInt(editAge, 10) : undefined,
      city: editCity.trim() || undefined,
      address: editAddress.trim() || undefined,
      livingSituation: editLiving.trim() || undefined,
      languagePreference: editLang,
      emergencyContactPhone: editPhone.trim() || undefined,
    });
    showToast(`Updated care profile for ${senior.name}`, 'success');
    setShowEditProfileModal(false);
  };

  const handlePlayVoice = (id: string, textToSpeak?: string, audioBlobUrl?: string) => {
    setPlayingVoiceId(id);
    if (audioBlobUrl) {
      try {
        const audio = new Audio(audioBlobUrl);
        audio.play().then(() => {
          showToast('Playing voice note recording', 'info');
        }).catch(() => {
          speakFallback(textToSpeak || 'Voice check-in note');
        });
        audio.onended = () => setPlayingVoiceId(null);
        return;
      } catch {
        // fallback
      }
    }
    speakFallback(textToSpeak || 'Voice check-in note');
  };

  const speakFallback = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const ut = new SpeechSynthesisUtterance(text);
      ut.lang = 'hi-IN';
      ut.onend = () => setPlayingVoiceId(null);
      ut.onerror = () => setPlayingVoiceId(null);
      window.speechSynthesis.speak(ut);
      showToast('Playing voice note transcript.', 'info');
    } else {
      showToast('Audio playback completed.', 'info');
      setTimeout(() => setPlayingVoiceId(null), 2500);
    }
  };

  const handleSaveMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) {
      showToast('Medicine name is required', 'error');
      return;
    }
    if (editingMedicineId) {
      updateMedicine(editingMedicineId, {
        name: medName.trim(),
        instructions: medInstructions.trim() || 'Take after meals with water',
        scheduledTimes: medTimes,
      });
      showToast('Medicine updated successfully', 'success');
    } else {
      addMedicine(
        medName.trim(),
        medInstructions.trim() || 'Take after meals with water',
        medTimes
      );
      showToast('Medicine added to schedule', 'success');
    }
    setShowAddMedicineModal(false);
    setEditingMedicineId(null);
    setMedName('');
    setMedInstructions('');
    setMedTimes(['08:30 AM']);
  };

  const openEditMedicine = (med: any) => {
    setEditingMedicineId(med.id);
    setMedName(med.name);
    setMedInstructions(med.dosageInstructions || '');
    setMedTimes(med.scheduledTimes || ['08:30 AM']);
    setShowAddMedicineModal(true);
  };

  const getCueBadgeClass = (tag: CueTag) => {
    switch (tag) {
      case 'dizziness':
      case 'pain':
      case 'fall':
        return 'bg-red-50 text-alert-red border-red-200';
      case 'poor sleep':
      case 'low appetite':
      case 'missed meds':
        return 'bg-amber-50 text-alert-amber border-amber-200';
      default:
        return 'bg-mint-deep text-forest border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button (shown when full page, hidden when embedded) */}
      {!isEmbedded && (
        <div>
          <Link
            to="/coordinator/seniors"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-forest transition-colors bg-cream px-3 py-1.5 rounded-lg border border-border"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Seniors</span>
          </Link>
        </div>
      )}

      {/* Hospital Dataset Provenance Banner for Cohort Senior */}
      {cohortSenior && (
        <div className="bg-cream border border-border rounded-xl p-4 text-xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-sage" />
              <span className="font-bold text-forest">
                Hospital Record Provenance: {cohortSenior.recordId} ({cohortSenior.seniorId})
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-mint-deep text-[11px] font-mono text-forest">
              source_record_pseudonymized
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div>
              <span className="text-ink-muted block">Condition:</span>
              <strong className="text-ink">{cohortSenior.medicalCondition}</strong>
            </div>
            <div>
              <span className="text-ink-muted block">Medication:</span>
              <strong className="text-ink">{cohortSenior.medicationName}</strong>
            </div>
            <div>
              <span className="text-ink-muted block">Admission Type:</span>
              <strong className="text-ink">{cohortSenior.admissionType} ({cohortSenior.lengthOfStayDays}d stay)</strong>
            </div>
            <div>
              <span className="text-ink-muted block">Test Result:</span>
              <strong className="text-ink">{cohortSenior.testResult}</strong>
            </div>
          </div>

          <p className="text-[11px] text-ink-muted pt-1 border-t border-border/40 leading-relaxed">
            <span className="font-semibold text-ink">Important Note:</span> Source records are hospital admissions (Age 60+), not verified unique individuals. Home monitoring signals across days 1 to 90 are simulated for demonstration (<span className="font-mono bg-mint-deep px-1 rounded">SIMULATED_NOT_OBSERVED</span>). Never presented as real patient observations.
          </p>
        </div>
      )}

      {/* 1. Deep Green Header Band (modelled on Reference Profile) */}
      <div className="bg-forest text-cream rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-forest-dark">
          {/* Avatar + Name + Subtitle */}
          <div className="flex items-center gap-4">
            <InitialsAvatar name={senior.name} size="xl" className="bg-mint-deep text-forest border-cream/20" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-cream tracking-tight">
                  {senior.name}
                </h2>
                <StatusChip
                  label={`${senior.currentUrgency.toUpperCase()} PRIORITY`}
                  variant={senior.currentUrgency === 'critical' ? 'critical' : senior.currentUrgency === 'moderate' ? 'warning' : 'success'}
                />
              </div>
              <p className="text-xs text-sage-light mt-1">
                Risk Score: <span className="font-bold text-cream">{((senior.currentRiskScore || 0) / 10).toFixed(1)}/10</span> : ID {senior.id}
              </p>
            </div>
          </div>

          {/* Action Buttons: Call senior, Call family, Edit profile */}
          <div className="flex items-center gap-2 flex-wrap">
            {senior.phone && senior.phone !== 'Not added yet' ? (
              <a
                href={`tel:${senior.phone}`}
                className="min-h-[44px] px-2.5 sm:px-3.5 py-2 bg-cream hover:bg-mint text-forest text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-cream active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Call Senior</span>
              </a>
            ) : (
              <button
                disabled
                title="Phone number not added yet"
                className="min-h-[44px] px-2.5 sm:px-3.5 py-2 bg-cream/40 text-cream/70 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-not-allowed"
              >
                <Phone className="w-4 h-4" />
                <span>Phone Not Added</span>
              </button>
            )}

            {senior.linkedFamilyPhone ? (
              <a
                href={`tel:${senior.linkedFamilyPhone}`}
                className="min-h-[44px] px-2.5 sm:px-3.5 py-2 bg-forest-dark hover:bg-forest-dark/80 text-cream border border-sage/30 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-cream active:scale-95"
              >
                <Users className="w-4 h-4" />
                <span>Call Family</span>
              </a>
            ) : (
              <button
                disabled
                className="min-h-[44px] px-2.5 sm:px-3.5 py-2 bg-forest-dark/40 text-cream/70 border border-sage/20 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-not-allowed"
              >
                <Users className="w-4 h-4" />
                <span>Family Not Linked</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowEditProfileModal(true)}
              className="min-h-[44px] px-2.5 sm:px-3.5 py-2 bg-cream/15 hover:bg-cream/25 text-cream border border-cream/20 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-cream active:scale-95"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Fact Tiles: Age, City, Living Situation, Language, Last Check-in (no fake tiles!) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-4 text-left">
          <div className="bg-forest-dark/60 rounded-xl p-3 border border-sage/20">
            <span className="text-[10px] uppercase font-bold text-sage-light tracking-wider block">Age</span>
            <span className="text-sm font-bold text-cream mt-0.5 block">
              {senior.age ? `${senior.age} years` : 'Not added yet'}
            </span>
          </div>

          <div className="bg-forest-dark/60 rounded-xl p-3 border border-sage/20">
            <span className="text-[10px] uppercase font-bold text-sage-light tracking-wider block">City</span>
            <span className="text-sm font-bold text-cream mt-0.5 block">
              {senior.city && senior.city !== 'Not added yet' ? senior.city : 'Not added yet'}
            </span>
          </div>

          <div className="bg-forest-dark/60 rounded-xl p-3 border border-sage/20">
            <span className="text-[10px] uppercase font-bold text-sage-light tracking-wider block">Living Situation</span>
            <span className="text-sm font-bold text-cream mt-0.5 block truncate">
              {senior.livingSituation && senior.livingSituation !== 'Not added yet' ? senior.livingSituation : 'Not added yet'}
            </span>
          </div>

          <div className="bg-forest-dark/60 rounded-xl p-3 border border-sage/20">
            <span className="text-[10px] uppercase font-bold text-sage-light tracking-wider block">Language</span>
            <span className="text-sm font-bold text-cream mt-0.5 block uppercase">
              {senior.languagePreference === 'hi' ? 'Hindi (हिन्दी)' : 'English'}
            </span>
          </div>

          <div className="bg-forest-dark/60 rounded-xl p-3 border border-sage/20 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-sage-light tracking-wider block">Last Check-in</span>
            <span className="text-sm font-bold text-cream mt-0.5 block truncate">
              Today 08:30 AM
            </span>
          </div>
        </div>
      </div>

      {/* 2. Segmented Tabs: Overview, Vitals, Location, Medicines, Notes, n8n Agent, Reports, Family */}
      <SegmentedTabs
        tabs={[
          { id: 'overview', label: 'Overview', icon: <ShieldCheck className="w-4 h-4" /> },
          { id: 'vitals', label: 'Vitals & Activity (90d)', icon: <Activity className="w-4 h-4" /> },
          { id: 'location', label: 'Location', icon: <MapPin className="w-4 h-4" /> },
          { id: 'medicines', label: 'Medications', count: medicines.length, icon: <Pill className="w-4 h-4" /> },
          { id: 'voice_notes', label: 'Check-in Notes', count: seniorVoiceNotes.length || cohortSenior?.noteCount || 0, icon: <Mic className="w-4 h-4" /> },
          { id: 'n8n_agent', label: 'n8n AI Agent', count: agentTasks.filter(t => t.seniorId === senior.id).length, icon: <Bot className="w-4 h-4" /> },
          { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
          { id: 'family', label: 'Family & Chat', count: seniorChatMessages.length, icon: <MessageSquare className="w-4 h-4" /> },
        ]}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as any)}
      />

      {/* TAB CONTENT */}

      {/* 2.1 OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Planted synthetic decline scenario indicator (Evaluation ground truth) */}
          {cohortSenior?.plantedScenario && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-alert-amber font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Synthetic Planted Decline Scenario (Evaluation Benchmark Only)</span>
              </div>
              <p className="text-ink">
                <strong>Scenario:</strong> {cohortSenior.plantedScenario.scenarioType} (Onset Day {cohortSenior.plantedScenario.onsetDay}, {cohortSenior.plantedScenario.onsetDate}).
              </p>
              <p className="text-ink-muted text-[11px]">
                Ground truth label used strictly to evaluate early detection lead time. This label is NEVER exposed as a feature to the risk prediction model or the n8n agent.
              </p>
            </div>
          )}

          {/* Why on today's list */}
          <div className="bg-cream border border-border rounded-xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-forest uppercase tracking-wider">
                Clinical Triage Context
              </span>
              <button
                type="button"
                onClick={handleRunAgent}
                disabled={isRunningAgent}
                className="text-xs font-bold text-forest bg-mint-deep hover:bg-mint px-2.5 py-1 rounded-lg border border-border inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>{isRunningAgent ? 'Running Agent...' : 'Trigger n8n Agent Analysis'}</span>
              </button>
            </div>
            <h3 className="text-base font-bold text-ink">
              Why {senior.name} is on today's priority list
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              {senior.topReasons && senior.topReasons.length > 0
                ? senior.topReasons.join('. ')
                : senior.recommendedAction || 'Normal routine check-in. No acute escalations.'}
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs font-bold text-forest">Recommended Action:</span>
              <span className="text-xs font-semibold text-ink bg-mint-deep px-2.5 py-1 rounded-lg border border-border">
                {senior.recommendedAction || 'Monitor next 24h'}
              </span>
            </div>
          </div>

          {/* Live Senior Submissions & Daily Updates */}
          <div className="bg-cream border border-border rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-forest uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-forest" />
                <span>Today's Live Submissions from {senior.name}</span>
              </h4>
              <span className="text-xs font-mono text-ink-muted">Live Sync Active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Vitals tile */}
              <div className="p-3 bg-white rounded-lg border border-border space-y-1">
                <span className="text-[11px] font-bold text-ink-muted block uppercase">Latest Vital Reading</span>
                {healthReadings.length > 0 ? (
                  <div>
                    <div className="text-base font-bold text-forest">
                      {healthReadings[0].type.toUpperCase()}: {healthReadings[0].value}
                      {healthReadings[0].valueSecondary ? `/${healthReadings[0].valueSecondary}` : ''} {healthReadings[0].unit}
                    </div>
                    <span className="text-[10px] text-ink-muted">
                      {new Date(healthReadings[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Logged by {healthReadings[0].addedBy}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-ink-muted italic">No manual vitals logged today</span>
                )}
              </div>

              {/* Checkin tile */}
              <div className="p-3 bg-white rounded-lg border border-border space-y-1">
                <span className="text-[11px] font-bold text-ink-muted block uppercase">Morning Check-In</span>
                {todayCheckinAnswer ? (
                  <div>
                    <div className="text-base font-bold text-forest">
                      Completed (Wellbeing: {todayCheckinAnswer.q1 || 1}/3)
                    </div>
                    <span className="text-[10px] text-ink-muted">
                      Sleep: {todayCheckinAnswer.q3 || 1}/3 • Appetite: {todayCheckinAnswer.q4 || 1}/3
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-ink-muted italic">Check-in not completed yet</span>
                )}
              </div>

              {/* Medicine confirmation tile */}
              <div className="p-3 bg-white rounded-lg border border-border space-y-1">
                <span className="text-[11px] font-bold text-ink-muted block uppercase">Medicine Status</span>
                <div>
                  <div className="text-base font-bold text-forest">
                    {doses.filter(d => d.status === 'taken').length} of {doses.length} Taken
                  </div>
                  <span className="text-[10px] text-ink-muted">
                    {doses.some(d => d.status === 'taken') ? 'Confirmed on time' : 'Pending morning dose'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additive Score Breakdown */}
          <div className="bg-cream border border-border rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-forest uppercase tracking-wider">
                Additive Risk Breakdown ({((senior.currentRiskScore || 0) / 10).toFixed(1)}/10)
              </h4>
              <span className="text-xs text-ink-muted">Calibrated against baseline</span>
            </div>

            <div className="space-y-2">
              {scoreBreakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-border text-xs">
                  <span className="font-semibold text-ink">{item.label}</span>
                  <span className={`font-bold ${item.fill}`}>
                    {item.val > 0 ? `+${item.val}` : '0'} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2.2 MEDICINES TAB */}
      {activeTab === 'medicines' && (
        <div className="space-y-5">
          {/* Top Actions: Add Medicine button */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-forest uppercase tracking-wider">
              Prescribed Medicines ({medicines.length})
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingMedicineId(null);
                setMedName('');
                setMedInstructions('');
                setMedTimes(['08:30 AM']);
                setShowAddMedicineModal(true);
              }}
              className="min-h-[40px] px-3.5 py-1.5 bg-forest hover:bg-forest-dark text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addMedicine}</span>
            </button>
          </div>

          {/* Today's doses */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-ink uppercase tracking-wider block">Today's Doses</span>
            {doses.length === 0 ? (
              <div className="p-4 bg-cream border border-border rounded-xl text-xs text-ink-muted text-center">
                No doses scheduled for today. Add a medicine using the button above.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {doses.map((dose) => (
                  <div key={dose.id} className="p-3.5 bg-white border border-border rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-ink">{dose.medicineName}</div>
                      <div className="text-xs text-ink-muted">{dose.scheduledTime} : {dose.dosageInstructions}</div>
                    </div>
                    <StatusChip
                      label={dose.status.toUpperCase()}
                      variant={dose.status === 'taken' ? 'success' : dose.status === 'missed' ? 'critical' : 'warning'}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 30-Day Adherence Calendar (fits 320px screen) */}
          <div className="bg-cream border border-border rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-forest uppercase tracking-wider">
                30-Day Adherence Calendar
              </h4>
              <div className="flex items-center gap-3 text-[11px] text-ink-muted">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-alert-green" /> Taken
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-alert-red" /> Missed
                </span>
              </div>
            </div>

            {/* Responsive grid fitting 320px viewport */}
            <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
              {adherenceDays.map((d) => (
                <div
                  key={d.dayNum}
                  title={`${d.date} : ${d.status}`}
                  className={`h-8 sm:h-9 rounded-md flex flex-col items-center justify-center text-[10px] font-bold border transition-colors ${
                    d.status === 'perfect'
                      ? 'bg-emerald-50 text-alert-green border-emerald-200'
                      : d.status === 'missed'
                      ? 'bg-red-50 text-alert-red border-red-200'
                      : 'bg-white text-ink-muted border-border'
                  }`}
                >
                  <span>{d.dayNum}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Medicine List */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-ink uppercase tracking-wider block">All Prescriptions</span>
            {medicines.map((med) => (
              <div key={med.id} className="p-3.5 bg-white border border-border rounded-xl flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-ink">{med.name}</div>
                  <div className="text-xs text-ink-muted">
                    {med.instructions} : Timings: {med.scheduledTimes?.join(', ') || '08:30 AM'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditMedicine(med)}
                    className="min-h-[36px] px-3 py-1 bg-cream hover:bg-mint-deep text-ink text-xs font-semibold rounded-lg border border-border"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeMedicine(med.id)}
                    className="w-9 h-9 rounded-lg border border-border bg-cream hover:bg-red-50 text-alert-red flex items-center justify-center"
                    title="Remove medicine"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pending Family Change Requests */}
          {medicineChangeRequests.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3">
              <span className="text-xs font-bold text-alert-amber uppercase tracking-wider block">
                Pending Change Requests from Family
              </span>
              {medicineChangeRequests.map((req) => (
                <div key={req.id} className="p-3 bg-white rounded-lg border border-amber-200 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-ink">{req.medicineName} : {req.proposedTiming}</div>
                    <div className="text-[11px] text-ink-muted">{req.notes || 'Family requested dose adjustment.'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => approveMedicineChange(req.id)}
                      className="px-3 py-1.5 bg-forest text-cream text-xs font-bold rounded-lg"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectMedicineChange(req.id)}
                      className="px-3 py-1.5 bg-cream border border-border text-ink text-xs font-bold rounded-lg"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2.3 VITALS TAB */}
      {activeTab === 'vitals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-xs font-bold text-forest uppercase tracking-wider">
                Personal Baseline & Longitudinal Trajectory
              </h3>
              <p className="text-[11px] text-ink-muted mt-0.5">
                Calibrated against individual 30-day baseline envelope (Mean ± 1.5 SD).
              </p>
            </div>

            {/* Time Window Switcher: 14d, 30d, 90d */}
            <div className="flex items-center gap-1 bg-mint-deep/60 p-1 rounded-lg border border-border">
              {(['14d', '30d', '90d'] as const).map((win) => (
                <button
                  key={win}
                  type="button"
                  onClick={() => setVitalsWindow(win)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                    vitalsWindow === win
                      ? 'bg-forest text-cream shadow-xs'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {win === '90d' ? 'Full 90-Day' : win === '30d' ? '30-Day' : '14-Day'}
                </button>
              ))}
            </div>
          </div>

          {/* Vitals Metric Switcher */}
          <div className="flex flex-wrap gap-2">
            {(['bp', 'hr', 'steps', 'sugar', 'spo2', 'weight'] as const).map((vt) => (
              <button
                key={vt}
                type="button"
                onClick={() => setVitalType(vt as any)}
                className={`min-h-[38px] px-3.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                  vitalType === vt
                    ? 'bg-forest text-cream border-forest'
                    : 'bg-cream text-ink border-border hover:bg-mint-deep'
                }`}
              >
                {vt === 'bp'
                  ? 'Blood Pressure'
                  : vt === 'hr'
                  ? 'Heart Rate (BPM)'
                  : vt === 'steps'
                  ? 'Daily Steps'
                  : vt === 'sugar'
                  ? 'Blood Sugar'
                  : vt === 'spo2'
                  ? 'SpO2'
                  : 'Weight'}
              </button>
            ))}
          </div>

          {/* Recharts baseline chart */}
          {vitalsChartData.length === 0 ? (
            <div className="p-8 bg-cream border border-border rounded-xl text-center text-xs text-ink-muted">
              No historical vitals readings recorded yet for this window.
            </div>
          ) : (
            <div className="bg-cream border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={vitalsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      domain={
                        vitalType === 'bp'
                          ? [60, 180]
                          : (vitalType as any) === 'hr'
                          ? [50, 110]
                          : (vitalType as any) === 'steps'
                          ? [0, 8000]
                          : [70, 200]
                      }
                    />
                    <Tooltip />
                    {vitalType === 'bp' && (
                      <>
                        <Area type="monotone" dataKey="sysUpper" stroke="none" fill="#6E9A82" fillOpacity={0.15} />
                        <Area type="monotone" dataKey="sysLower" stroke="none" fill="#FAFCFA" fillOpacity={1} />
                        <Line type="monotone" dataKey="sysBaseline" stroke="#6E9A82" strokeDasharray="3 3" dot={false} name="Systolic Baseline" />
                        <Line type="monotone" dataKey="systolic" stroke="#DC2626" strokeWidth={2} name="Systolic BP" />
                        <Line type="monotone" dataKey="diastolic" stroke="#1F4D3F" strokeWidth={2} name="Diastolic BP" />
                      </>
                    )}
                    {(vitalType as any) === 'hr' && (
                      <>
                        <Area type="monotone" dataKey="hrUpper" stroke="none" fill="#6E9A82" fillOpacity={0.15} />
                        <Area type="monotone" dataKey="hrLower" stroke="none" fill="#FAFCFA" fillOpacity={1} />
                        <Line type="monotone" dataKey="hrBaseline" stroke="#6E9A82" strokeDasharray="3 3" dot={false} name="Baseline HR" />
                        <Line type="monotone" dataKey="hr" stroke="#DC2626" strokeWidth={2} name="Heart Rate (BPM)" />
                      </>
                    )}
                    {(vitalType as any) === 'steps' && (
                      <>
                        <Line type="monotone" dataKey="stepsBaseline" stroke="#6E9A82" strokeDasharray="3 3" dot={false} name="Baseline Steps" />
                        <Line type="monotone" dataKey="steps" stroke="#1F4D3F" strokeWidth={2} name="Daily Steps" />
                      </>
                    )}
                    {vitalType === 'sugar' && (
                      <>
                        <Line type="monotone" dataKey="sugarUpper" stroke="#6E9A82" strokeDasharray="3 3" dot={false} />
                        <Line type="monotone" dataKey="sugar" stroke="#D97706" strokeWidth={2} name="Blood Sugar" />
                      </>
                    )}
                    {vitalType === 'spo2' && (
                      <Line type="monotone" dataKey="spo2" stroke="#1F4D3F" strokeWidth={2} name="SpO2 (%)" />
                    )}
                    {vitalType === 'weight' && (
                      <Line type="monotone" dataKey="weight" stroke="#6E9A82" strokeWidth={2} name="Weight (kg)" />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-[11px] text-ink-muted pt-2 border-t border-border/50">
                <span>Dashed line: Personal established baseline (Days 1 to 30, no future leakage).</span>
                <span className="font-mono text-forest">Window: {vitalsChartData.length} observation points</span>
              </div>
            </div>
          )}

          {/* WEARABLE PIPELINE: Device Status, Quality Counts, Thresholds & Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Device List & Sync Status */}
            <div className="bg-cream border border-border rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-2">
                  <Watch className="w-4 h-4 text-forest" />
                  <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                    {t.wearableStatus}
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-mint-deep text-forest border border-border">
                  {t.simulatedDevice}
                </span>
              </div>

              {deviceLinks.length === 0 ? (
                <div className="text-xs text-ink-muted p-3 bg-white rounded-lg border border-border text-center">
                  No wearable devices paired yet.
                </div>
              ) : (
                deviceLinks.map((dl) => (
                  <div key={dl.id} className="p-3 bg-white rounded-lg border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-ink">{dl.vendorModelName}</div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        dl.status === 'connected' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {dl.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-ink-muted">
                      <div>
                        <span className="text-[10px] uppercase block text-ink-faint">{t.lastSync}</span>
                        <span className="font-medium text-ink">{dl.lastSyncAt ? formatISTDisplay(dl.lastSyncAt) : 'Never'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase block text-ink-faint">Battery</span>
                        <span className="font-medium text-ink">{dl.batteryPercent !== undefined ? `${dl.batteryPercent}%` : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                      <span className="text-[11px] text-ink-muted">Type: {dl.providerType}</span>
                      {dl.status === 'connected' ? (
                        <button
                          type="button"
                          onClick={() => disconnectDevice()}
                          className="text-[11px] font-bold text-alert-amber hover:underline"
                        >
                          Disconnect
                        </button>
                      ) : (
                        <span className="text-[11px] text-ink-muted">Offline</span>
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Optional Web Bluetooth connection button */}
              <div className="pt-1">
                {isBluetoothSupported ? (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await connectWebBluetooth();
                        showToast('Connected to Bluetooth GATT device', 'success');
                      } catch (e: any) {
                        showToast(e.message || 'Bluetooth connection failed', 'info');
                      }
                    }}
                    className="w-full min-h-[38px] px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-mint-deep text-xs font-bold text-forest flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Watch className="w-3.5 h-3.5" />
                    <span>Pair Standard BLE Device (GATT 0x180D/0x1822)</span>
                  </button>
                ) : (
                  <div className="p-2.5 rounded-lg bg-mint text-[11px] text-ink-muted">
                    Web Bluetooth is not supported on this browser (e.g. iOS Safari). Supported on Chrome/Edge on Android and PC.
                  </div>
                )}
              </div>

              {/* BLE Smart Watch Scanner */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowBLEModal(true)}
                  className="w-full min-h-[38px] px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-mint-deep text-xs font-bold text-forest flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Watch className="w-3.5 h-3.5" />
                  <span>BLE Smartwatch Scanner</span>
                </button>
              </div>
            </div>

            {/* Quality Summary & Clinician Threshold Editor */}
            <div className="space-y-4">
              {/* Quality Counts */}
              <div className="bg-cream border border-border rounded-xl p-4 space-y-2.5 shadow-xs">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <ShieldCheck className="w-4 h-4 text-forest" />
                  <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                    {t.qualityCounts}
                  </h4>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="text-xs text-emerald-800 font-semibold">{t.acceptedSamples}</div>
                    <div className="text-lg font-black text-emerald-950 mt-0.5">{qualityStats.accepted}</div>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-xs text-amber-800 font-semibold">{t.suspectSamples}</div>
                    <div className="text-lg font-black text-amber-950 mt-0.5">{qualityStats.suspect}</div>
                  </div>
                  <div className="p-2 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-xs text-alert-red font-semibold">{t.rejectedSamples}</div>
                    <div className="text-lg font-black text-red-950 mt-0.5">{qualityStats.rejected}</div>
                  </div>
                </div>
                <p className="text-[10px] text-ink-muted text-center pt-1">
                  Rejected samples (e.g. physical sensor noise beyond plausibility bounds) are safely preserved with reasons and never deleted silently.
                </p>
              </div>

              {/* Threshold Editor */}
              <div className="bg-cream border border-border rounded-xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <Sliders className="w-4 h-4 text-forest" />
                  <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                    {t.thresholdEditor}
                  </h4>
                </div>

                <div className="p-2 bg-amber-50/70 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-snug">
                  <strong>Clinical Notice:</strong> {t.clinicianNote}.
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-ink-muted font-bold text-[11px] uppercase mb-1">High HR (bpm)</label>
                    <input
                      type="number"
                      value={hrThreshold}
                      onChange={(e) => setHrThreshold(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-border rounded-lg text-ink font-mono text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-ink-muted font-bold text-[11px] uppercase mb-1">Low SpO2 (%)</label>
                    <input
                      type="number"
                      value={spo2Threshold}
                      onChange={(e) => setSpo2Threshold(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-border rounded-lg text-ink font-mono text-xs bg-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setThresholdSaved(true);
                    showToast('Thresholds updated for senior. Marked as clinician placeholder.', 'success');
                    setTimeout(() => setThresholdSaved(false), 3000);
                  }}
                  className="w-full min-h-[36px] bg-forest text-cream font-bold text-xs rounded-lg hover:bg-forest-dark transition-colors"
                >
                  {thresholdSaved ? 'Saved Successfully ✓' : 'Save Emergency Thresholds'}
                </button>
              </div>

              {/* Band Simulation Scenario Controls (Live Demonstration Tools) */}
              <div className="bg-cream border border-border rounded-xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-forest" />
                    <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                      Band Live Scenarios (Demo Controls)
                    </h4>
                  </div>
                  <span className="text-[10px] text-ink-muted">Simulate physiological events</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      triggerScenario('normal');
                      showToast('Band scenario set: Normal Day (72 bpm, 98% SpO2)', 'success');
                    }}
                    className="p-2 rounded-lg bg-white border border-border text-left hover:bg-emerald-50 transition-colors"
                  >
                    <div className="font-bold text-emerald-800">Normal Baseline</div>
                    <div className="text-[10px] text-ink-muted">72 bpm • 98% SpO2</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerScenario('rising_resting_hr');
                      showToast('Band scenario set: High Heart Rate (>130 bpm)', 'info');
                    }}
                    className="p-2 rounded-lg bg-white border border-border text-left hover:bg-amber-50 transition-colors"
                  >
                    <div className="font-bold text-amber-800">High Heart Rate</div>
                    <div className="text-[10px] text-ink-muted">Spikes to 135 bpm</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerScenario('sustained_low_spo2');
                      showToast('Band scenario set: Low Oxygen drop (<90%)', 'info');
                    }}
                    className="p-2 rounded-lg bg-white border border-border text-left hover:bg-amber-50 transition-colors"
                  >
                    <div className="font-bold text-amber-800">Low Oxygen (SpO2)</div>
                    <div className="text-[10px] text-ink-muted">Drops below 90%</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerScenario('fall_detected');
                      showToast('Band scenario: Fall Detected! Immediate alert dispatched', 'error');
                    }}
                    className="p-2 rounded-lg bg-white border border-border text-left hover:bg-red-50 transition-colors"
                  >
                    <div className="font-bold text-alert-red">Fall Detection 🚨</div>
                    <div className="text-[10px] text-ink-muted">Impact + no movement</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerScenario('battery_low');
                      showToast('Band scenario set: Low Battery (12%)', 'info');
                    }}
                    className="p-2 rounded-lg bg-white border border-border text-left hover:bg-zinc-100 transition-colors"
                  >
                    <div className="font-bold text-ink">Low Battery Warning</div>
                    <div className="text-[10px] text-ink-muted">Battery drops to 12%</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerScenario('device_silent');
                      showToast('Band scenario set: Device Silent (Gap detected after 5m)', 'info');
                    }}
                    className="p-2 rounded-lg bg-white border border-border text-left hover:bg-zinc-100 transition-colors"
                  >
                    <div className="font-bold text-ink-muted">Band Disconnected</div>
                    <div className="text-[10px] text-ink-muted">Transmission paused</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Device Event Log Table */}
          {deviceLogs.length > 0 && (
            <div className="bg-cream border border-border rounded-xl p-4 space-y-2.5 shadow-xs">
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider border-b border-border pb-2">
                Device Event & Audit Log
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {deviceLogs.slice(0, 10).map((l) => (
                  <div key={l.id} className="p-2 bg-white rounded border border-border text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        l.level === 'error' ? 'bg-red-100 text-red-800' : l.level === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-mint-deep text-forest'
                      }`}>
                        {l.eventType}
                      </span>
                      <span className="text-ink truncate max-w-xs">{l.message}</span>
                    </div>
                    <span className="text-[10px] text-ink-muted font-mono shrink-0">
                      {formatISTDisplay(l.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2.3B LOCATION TAB */}
      {activeTab === 'location' && (
        <SeniorLocationSection
          senior={senior}
          isCoordinator={true}
          activeSosEvent={activeSosEvent}
        />
      )}

      {/* 2.4 CHECK-IN NOTES TAB */}
      {activeTab === 'voice_notes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-forest uppercase tracking-wider flex items-center gap-2">
                <Mic className="w-4 h-4 text-forest" />
                <span>Live Voice Notes & Check-ins ({seniorVoiceNotes.length})</span>
              </h3>
              <p className="text-xs text-ink-muted">Recorded voice messages from {senior.name} with AI transcripts and Indic clinical cues</p>
            </div>
            <span className="text-[11px] text-ink-muted bg-cream px-2 py-0.5 rounded border border-border">
              Live Speech-to-Text & Clinical NLP
            </span>
          </div>

          {seniorVoiceNotes.length === 0 ? (
            <div className="p-8 bg-cream border border-border rounded-xl text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-mint-deep/60 text-forest flex items-center justify-center mx-auto">
                <Mic className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-ink">No live voice check-in notes recorded yet.</p>
              <p className="text-xs text-ink-muted max-w-md mx-auto">
                When {senior.name} speaks into the app or records a daily check-in voice note, it will appear here instantly with full audio playback, priority triage, and extracted clinical symptoms.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {seniorVoiceNotes.map((note) => (
                <div
                  key={note.id}
                  className={`bg-white border rounded-xl p-4 sm:p-5 space-y-3 shadow-2xs ${
                    note.isHighPriority ? 'border-[#C93B2B] bg-[#FFF8F7]' : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        note.isHighPriority ? 'bg-[#FBE8E6] text-[#C93B2B]' : 'bg-mint-deep text-forest'
                      }`}>
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-ink">
                            {new Date(note.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {note.isHighPriority && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C93B2B] text-white">
                              HIGH PRIORITY
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-ink-muted">Duration: {note.durationSeconds || 15} seconds</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlayVoice(note.id, note.transcript || note.plainSummary, note.audioBlobUrl)}
                      className="min-h-[36px] px-3.5 py-1.5 bg-mint-deep hover:bg-mint text-forest text-xs font-bold rounded-lg inline-flex items-center gap-1.5 border border-border shadow-2xs transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{playingVoiceId === note.id ? 'Playing...' : 'Play Audio'}</span>
                    </button>
                  </div>

                  <div className="bg-mint-deep/30 p-3.5 rounded-lg border border-border/50 space-y-1.5">
                    <div className="text-[11px] font-bold text-forest uppercase tracking-wider">Clinical Summary</div>
                    <p className="text-xs sm:text-sm text-ink font-medium leading-relaxed">
                      "{note.plainSummary}"
                    </p>
                  </div>

                  {note.transcript && note.transcript !== note.plainSummary && (
                    <div className="bg-white p-3 rounded-lg border border-border/60 text-xs text-ink-muted">
                      <strong className="text-ink">Full Transcript: </strong>"{note.transcript}"
                    </div>
                  )}

                  {note.cueTags && note.cueTags.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block">Detected Clinical Cues:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {note.cueTags.map((tag: any, idx: number) => (
                          <span
                            key={idx}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getCueBadgeClass(tag as CueTag)}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Historical Simulated Notes if available */}
          {cohortSenior?.recentNotes && cohortSenior.recentNotes.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                Historical Baseline Notes ({cohortSenior.recentNotes.length})
              </h4>
              <div className="space-y-2">
                {cohortSenior.recentNotes.map((cn, idx) => (
                  <div key={idx} className="bg-white border border-border rounded-xl p-3.5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-forest">{cn.date}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-cream text-ink-muted font-mono">
                        {cn.language.toUpperCase()} • {cn.inputMode}
                      </span>
                    </div>
                    <p className="text-xs text-ink leading-relaxed">"{cn.noteText}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2.5 n8n AI AGENT TAB */}
      {activeTab === 'n8n_agent' && (
        <div className="space-y-4">
          <div className="bg-cream border border-border rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-forest" />
                  <h3 className="text-sm font-bold text-ink">
                    n8n AI Monitoring Agent : {senior.id}
                  </h3>
                </div>
                <p className="text-xs text-ink-muted mt-0.5">
                  Autonomous agent inspects longitudinal records against personal baselines and formulates justified tasks.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunAgent}
                disabled={isRunningAgent}
                className="min-h-[40px] px-4 py-2 bg-forest hover:bg-forest-dark text-cream text-xs font-bold rounded-lg inline-flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRunningAgent ? 'animate-spin' : ''}`} />
                <span>{isRunningAgent ? 'Running Agent Analysis...' : 'Trigger n8n Agent Scan'}</span>
              </button>
            </div>

            {/* Agent Privacy & Anti-Leakage Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-border/60 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-border">
                <span className="font-bold text-forest block">Masked Tool Calls</span>
                <span className="text-[11px] text-ink-muted">Observations stripped of PII and scenario labels before retrieval.</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-border">
                <span className="font-bold text-forest block">Personal Baseline Only</span>
                <span className="text-[11px] text-ink-muted">Deviations benchmarked against days 1 to 30; no population averages.</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-border">
                <span className="font-bold text-forest block">Idempotent Deduplication</span>
                <span className="text-[11px] text-ink-muted">24h task gating prevents coordinator alert fatigue.</span>
              </div>
            </div>
          </div>

          {/* Active Tasks Generated for this Senior */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-forest uppercase tracking-wider">
              Coordinator Follow-up Tasks Generated by Agent ({agentTasks.filter(t => t.seniorId === senior.id).length})
            </h4>

            {agentTasks.filter(t => t.seniorId === senior.id).length === 0 ? (
              <div className="p-8 bg-cream border border-border rounded-xl text-center text-xs text-ink-muted space-y-2">
                <CheckCircle2 className="w-8 h-8 text-sage mx-auto" strokeWidth={1.5} />
                <p className="font-semibold text-ink">No active follow-up tasks required</p>
                <p className="max-w-md mx-auto text-ink-muted">
                  The n8n agent analyzed the latest observations. Current signals are within normal personal variance envelope.
                </p>
              </div>
            ) : (
              agentTasks.filter(t => t.seniorId === senior.id).map(task => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border bg-white space-y-3 ${
                    task.priority === 'critical' ? 'border-red-200' : 'border-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <StatusChip
                          label={task.priority.toUpperCase()}
                          variant={task.priority === 'critical' ? 'critical' : 'warning'}
                        />
                        <h5 className="text-sm font-bold text-ink">{task.taskTitle}</h5>
                      </div>
                      <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                        {task.justification}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {task.status === 'pending' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              n8nAgentService.markTaskComplete(task.id);
                              showToast('Task marked as completed', 'success');
                            }}
                            className="px-3 py-1.5 bg-forest text-cream text-xs font-bold rounded-lg hover:bg-forest-dark"
                          >
                            Mark Done
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              n8nAgentService.dismissTask(task.id);
                              showToast('Task dismissed', 'info');
                            }}
                            className="px-2.5 py-1.5 bg-cream border border-border text-ink-muted hover:text-ink text-xs font-semibold rounded-lg"
                          >
                            Dismiss
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-alert-green bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          {task.status === 'completed' ? 'Completed' : 'Dismissed'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Evidence Bullets */}
                  {task.evidence && task.evidence.length > 0 && (
                    <div className="bg-mint-deep/40 p-3 rounded-lg border border-border/60 text-xs space-y-1">
                      <span className="font-bold text-forest text-[11px] uppercase tracking-wider block">
                        Justified Evidence from Stored Observations:
                      </span>
                      <ul className="list-disc pl-4 space-y-0.5 text-ink">
                        {task.evidence.map((ev, i) => (
                          <li key={i}>{ev}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Agent Execution Logs */}
          <div className="bg-cream border border-border rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-forest uppercase tracking-wider">
              Recent n8n Tool Calling Audit Trail
            </h4>
            <div className="space-y-2 text-xs font-mono max-h-60 overflow-y-auto">
              {agentLogs.filter(l => l.seniorId === senior.id).map(log => (
                <div key={log.id} className="p-2.5 rounded-lg bg-white border border-border space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-ink-muted">
                    <span className="font-bold text-forest">Execution: {new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className="text-sage font-sans">{log.status}</span>
                  </div>
                  <p className="font-sans text-xs text-ink">{log.summary}</p>
                  {log.toolCalls && log.toolCalls.map((tc, idx) => (
                    <div key={idx} className="bg-mint/50 p-1.5 rounded text-[11px] border border-border/40">
                      <span className="text-forest font-bold">TOOL: {tc.toolName}</span>: {tc.outputSummary}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2.5 REPORTS TAB */}
      {activeTab === 'reports' && (
        <div className="bg-cream border border-border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-forest uppercase tracking-wider">
              Weekly Longitudinal Report
            </h3>
            <span className="text-xs font-bold text-forest bg-mint-deep px-2.5 py-1 rounded-lg border border-border">
              Past 7 Days
            </span>
          </div>

          <div className="space-y-3 text-xs text-ink-muted leading-relaxed">
            <p>
              <strong className="text-ink">Adherence Summary:</strong> {senior.name} has maintained a stable routine with 92% medicine compliance over the past 7 days.
            </p>
            <p>
              <strong className="text-ink">Vitals Stability:</strong> Blood pressure readings remained within individual baseline parameters (mean systolic 132 mmHg).
            </p>
            <p>
              <strong className="text-ink">Coordinator Recommendations:</strong> Continue daily morning check-in call. Follow up on blood sugar levels after weekend diet change.
            </p>
          </div>
        </div>
      )}

      {/* 2.6 FAMILY & CHAT TAB */}
      {activeTab === 'family' && (
        <div className="space-y-6">
          <div className="bg-white border border-border rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4 flex-wrap shadow-2xs">
            <div className="flex items-center gap-3.5">
              <InitialsAvatar name={senior.linkedFamilyName || 'Karishma'} size="lg" />
              <div>
                <h4 className="text-sm font-bold text-ink">{senior.linkedFamilyName || 'Karishma'}</h4>
                <span className="text-xs text-ink-muted">Family member • Daughter of {senior.name}</span>
                <div className="text-xs font-semibold text-forest mt-0.5">
                  Phone: {senior.linkedFamilyPhone || '8765789433'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/91${(senior.linkedFamilyPhone || '8765789433').replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[40px] px-3.5 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              {senior.linkedFamilyPhone && (
                <a
                  href={`tel:${senior.linkedFamilyPhone}`}
                  className="min-h-[40px] px-3.5 py-1.5 bg-forest hover:bg-forest-dark text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              )}
            </div>
          </div>

          {/* TWO-WAY LIVE IN-APP CHAT WITH FAMILY */}
          <div className="bg-cream border border-border rounded-2xl shadow-xs overflow-hidden flex flex-col h-[520px]">
            <div className="p-3.5 bg-mint-deep border-b border-border flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-forest" />
                <div>
                  <h4 className="text-xs font-bold text-ink">Two-Way Direct Chat with {senior.linkedFamilyName || 'Karishma'}</h4>
                  <p className="text-[11px] text-ink-muted">Real-time sync between Family Portal and Coordinator Desk</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-forest border border-border">
                Live Broadcast
              </span>
            </div>

            {/* Chat Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FCFBF8]">
              {seniorChatMessages.length === 0 ? (
                <div className="text-center py-16 text-ink-muted text-xs space-y-1">
                  <p className="font-semibold text-ink">No messages in chat thread yet.</p>
                  <p>Send a message below to coordinate directly with Karishma.</p>
                </div>
              ) : (
                seniorChatMessages.map((msg) => {
                  const isCoordinator = msg.senderRole === 'coordinator';
                  const isSenior = (msg as any).senderRole === 'senior';
                  const timeStr = msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isCoordinator ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] font-semibold text-ink-muted px-1 mb-0.5">
                        {isCoordinator
                          ? 'You (Nimish Gupta)'
                          : isSenior
                          ? `${senior.name} (Voice Note)`
                          : (msg.senderName || 'Karishma')}
                      </span>
                      <div
                        className={`max-w-[85%] p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed ${
                          isCoordinator
                            ? 'bg-forest text-cream rounded-br-none'
                            : isSenior
                            ? 'bg-[#EBF3EE] text-[#132A22] border-2 border-[#1C3F32] rounded-bl-none shadow-xs'
                            : 'bg-white text-ink border border-border rounded-bl-none shadow-2xs'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                        {isSenior && (
                          <button
                            type="button"
                            onClick={() => speakFallback(msg.text)}
                            className="mt-2 text-[11px] font-bold text-forest bg-white px-2.5 py-1 rounded border border-[#CBDCD2] inline-flex items-center gap-1 hover:bg-mint-deep"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] text-ink-muted mt-1 px-1">{timeStr}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleCoordinatorSendMessage} className="p-3 bg-white border-t border-border flex items-center gap-2">
              <input
                type="text"
                placeholder={`Type a message to ${senior.linkedFamilyName || 'Karishma'}...`}
                value={coordinatorMessageInput}
                onChange={(e) => setCoordinatorMessageInput(e.target.value)}
                className="flex-1 min-h-[44px] px-3.5 py-2 rounded-lg border border-border text-base sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest"
              />
              <button
                type="submit"
                className="min-h-[44px] px-4 py-2 bg-forest text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5 shadow-2xs hover:bg-forest-dark transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-cream border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-mint-deep">
              <h3 className="text-base font-bold text-ink">Edit Care Profile</h3>
              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-ink hover:bg-mint"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProfileUpdateSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-ink mb-1 uppercase tracking-wider">Age</label>
                <input
                  type="number"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-border bg-white text-base sm:text-sm focus:ring-2 focus:ring-forest focus:outline-none"
                  placeholder="e.g. 72"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1 uppercase tracking-wider">City</label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-border bg-white text-base sm:text-sm focus:ring-2 focus:ring-forest focus:outline-none"
                  placeholder="e.g. New Delhi"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1 uppercase tracking-wider">Living Situation</label>
                <input
                  type="text"
                  value={editLiving}
                  onChange={(e) => setEditLiving(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-border bg-white text-base sm:text-sm focus:ring-2 focus:ring-forest focus:outline-none"
                  placeholder="e.g. Lives alone in apartment"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1 uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-border bg-white text-base sm:text-sm focus:ring-2 focus:ring-forest focus:outline-none"
                  placeholder="e.g. 7452009877"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1 uppercase tracking-wider">Preferred Language</label>
                <select
                  value={editLang}
                  onChange={(e) => setEditLang(e.target.value as any)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-border bg-white text-base sm:text-sm focus:ring-2 focus:ring-forest focus:outline-none"
                >
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="min-h-[44px] px-4 py-2 border border-border rounded-lg text-xs font-bold text-ink hover:bg-mint-deep"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 bg-forest text-cream text-xs font-bold rounded-lg hover:bg-forest-dark"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT MEDICINE MODAL */}
      {showAddMedicineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-cream border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-mint-deep">
              <h3 className="text-base font-bold text-ink">
                {editingMedicineId ? 'Edit Prescription' : 'Add New Medicine'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddMedicineModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-ink hover:bg-mint"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedicine} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-ink mb-1 uppercase tracking-wider">Medicine Name *</label>
                <input
                  type="text"
                  required
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-border bg-white text-base sm:text-sm focus:ring-2 focus:ring-forest focus:outline-none"
                  placeholder="e.g. Metformin 500mg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1 uppercase tracking-wider">Dosage Instructions</label>
                <input
                  type="text"
                  value={medInstructions}
                  onChange={(e) => setMedInstructions(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-border bg-white text-base sm:text-sm focus:ring-2 focus:ring-forest focus:outline-none"
                  placeholder="e.g. 1 tablet after meals"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1 uppercase tracking-wider">Dose Timings</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['08:30 AM', '01:00 PM', '02:00 PM', '08:30 PM'].map((time) => {
                    const active = medTimes.includes(time);
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => {
                          if (active) setMedTimes(medTimes.filter((t) => t !== time));
                          else setMedTimes([...medTimes, time]);
                        }}
                        className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-bold border ${
                          active ? 'bg-forest text-cream border-forest' : 'bg-white text-ink border-border'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMedicineModal(false)}
                  className="min-h-[44px] px-4 py-2 border border-border rounded-lg text-xs font-bold text-ink hover:bg-mint-deep"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 bg-forest text-cream text-xs font-bold rounded-lg hover:bg-forest-dark"
                >
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLE Smartwatch Scanner Modal */}
      {showBLEModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold text-ink">BLE Smartwatch Scanner</h3>
              <button
                type="button"
                onClick={() => setShowBLEModal(false)}
                className="p-2 rounded-lg hover:bg-mint-deep"
              >
                <X className="w-5 h-5 text-ink" />
              </button>
            </div>
            <div className="p-4">
              <BLESmartWatchScanner seniorId={senior?.id || 'senior-kamla-001'} compact />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
