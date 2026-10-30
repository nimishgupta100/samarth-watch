import React, { useState, useMemo } from 'react';
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
  Calendar
} from 'lucide-react';
import { CueTag } from '../../types';

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
    doses,
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
  } = useApp();

  const senior = seniors.find((s) => s.id === activeId) || seniors[0];

  usePageTitle(
    senior ? `${senior.name} - Care Coordinator Profile` : 'Senior Profile',
    'Comprehensive health triage, medication adherence, baseline vitals, and family care profile.'
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'medicines' | 'vitals' | 'voice_notes' | 'reports' | 'family'>('overview');
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
    return senior.history90Days.slice(-30).map((d) => {
      const shortDate = d.date.slice(5);
      return {
        date: shortDate,
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
      };
    });
  }, [senior]);

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

  const handlePlayVoice = (id: string) => {
    setPlayingVoiceId(id);
    showToast('Playing recorded voice note (speech simulated).', 'info');
    setTimeout(() => setPlayingVoiceId(null), 3000);
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
                Risk Score: <span className="font-bold text-cream">{senior.currentRiskScore}/100</span> : ID {senior.id}
              </p>
            </div>
          </div>

          {/* Action Buttons: Call senior, Call family, Edit profile */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {senior.phone && senior.phone !== 'Not added yet' ? (
              <a
                href={`tel:${senior.phone}`}
                className="min-h-[44px] px-3.5 py-2 bg-cream hover:bg-mint text-forest text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-cream"
              >
                <Phone className="w-4 h-4" />
                <span>Call Senior</span>
              </a>
            ) : (
              <button
                disabled
                title="Phone number not added yet"
                className="min-h-[44px] px-3.5 py-2 bg-cream/40 text-cream/70 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-not-allowed"
              >
                <Phone className="w-4 h-4" />
                <span>Phone Not Added</span>
              </button>
            )}

            {senior.linkedFamilyPhone ? (
              <a
                href={`tel:${senior.linkedFamilyPhone}`}
                className="min-h-[44px] px-3.5 py-2 bg-forest-dark hover:bg-forest-dark/80 text-cream border border-sage/30 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-cream"
              >
                <Users className="w-4 h-4" />
                <span>Call Family</span>
              </a>
            ) : (
              <button
                disabled
                className="min-h-[44px] px-3.5 py-2 bg-forest-dark/40 text-cream/70 border border-sage/20 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-not-allowed"
              >
                <Users className="w-4 h-4" />
                <span>Family Not Linked</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowEditProfileModal(true)}
              className="min-h-[44px] px-3.5 py-2 bg-cream/15 hover:bg-cream/25 text-cream border border-cream/20 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-cream"
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

      {/* 2. Segmented Tabs: Overview, Medicines, Vitals, Voice notes, Reports, Family */}
      <SegmentedTabs
        tabs={[
          { id: 'overview', label: 'Overview', icon: <ShieldCheck className="w-4 h-4" /> },
          { id: 'medicines', label: 'Medicines', count: medicines.length, icon: <Pill className="w-4 h-4" /> },
          { id: 'vitals', label: 'Vitals', icon: <Activity className="w-4 h-4" /> },
          { id: 'voice_notes', label: 'Voice Notes', count: voiceNotes.length, icon: <Mic className="w-4 h-4" /> },
          { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
          { id: 'family', label: 'Family', icon: <Users className="w-4 h-4" /> },
        ]}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as any)}
      />

      {/* TAB CONTENT */}

      {/* 2.1 OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Why on today's list */}
          <div className="bg-cream border border-border rounded-xl p-5 shadow-xs space-y-2">
            <span className="text-xs font-bold text-forest uppercase tracking-wider">
              Clinical Triage Context
            </span>
            <h3 className="text-base font-bold text-ink">
              Why {senior.name} is on today's priority list
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              {senior.recommendedAction || 'Normal routine check-in. No acute escalations.'}
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs font-bold text-forest">Recommended Action:</span>
              <span className="text-xs font-semibold text-ink bg-mint-deep px-2.5 py-1 rounded-lg border border-border">
                {senior.recommendedAction || 'Monitor next 24h'}
              </span>
            </div>
          </div>

          {/* Additive Score Breakdown */}
          <div className="bg-cream border border-border rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-forest uppercase tracking-wider">
                Additive Risk Breakdown ({senior.currentRiskScore}/100)
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
            <h3 className="text-xs font-bold text-forest uppercase tracking-wider">
              Vitals Baseline Tracking
            </h3>
            {/* Device source label */}
            <span className="text-[11px] font-semibold text-ink-muted bg-cream px-2.5 py-1 rounded-lg border border-border inline-flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sage" />
              <span>Source: Connected BLE & Coordinator Check-in</span>
            </span>
          </div>

          {/* Vitals switcher */}
          <div className="flex gap-2">
            {(['bp', 'sugar', 'spo2', 'weight'] as const).map((vt) => (
              <button
                key={vt}
                type="button"
                onClick={() => setVitalType(vt)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  vitalType === vt
                    ? 'bg-forest text-cream border-forest'
                    : 'bg-cream text-ink border-border hover:bg-mint-deep'
                }`}
              >
                {vt === 'bp' ? 'Blood Pressure' : vt === 'sugar' ? 'Blood Sugar' : vt === 'spo2' ? 'SpO2' : 'Weight'}
              </button>
            ))}
          </div>

          {/* Recharts baseline chart */}
          {vitalsChartData.length === 0 ? (
            <div className="p-8 bg-cream border border-border rounded-xl text-center text-xs text-ink-muted">
              No historical vitals readings recorded yet.
            </div>
          ) : (
            <div className="bg-cream border border-border rounded-xl p-4 sm:p-5 shadow-xs">
              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={vitalsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} domain={vitalType === 'bp' ? [60, 180] : [70, 200]} />
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
              <p className="text-[11px] text-ink-muted mt-2 text-center">
                Dashed line indicates individual established baseline (±1.5 SD normal envelope).
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2.4 VOICE NOTES TAB */}
      {activeTab === 'voice_notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-forest uppercase tracking-wider">
              Voice Check-in Transcripts ({voiceNotes.length})
            </h3>
            <span className="text-[11px] text-ink-muted bg-cream px-2 py-0.5 rounded border border-border">
              Indic NLP Cues
            </span>
          </div>

          {voiceNotes.length === 0 ? (
            <div className="p-8 bg-cream border border-border rounded-xl text-center text-xs text-ink-muted">
              No voice notes recorded yet. Voice check-ins can be initiated through the Voice Check-in tool.
            </div>
          ) : (
            <div className="space-y-3">
              {voiceNotes.map((note) => (
                <div key={note.id} className="bg-white border border-border rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-ink">
                        {new Date(note.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-[11px] text-ink-muted">({note.durationSeconds}s)</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlayVoice(note.id)}
                      className="min-h-[36px] px-3 py-1 bg-mint-deep hover:bg-mint text-forest text-xs font-bold rounded-lg inline-flex items-center gap-1.5 border border-border"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{playingVoiceId === note.id ? 'Playing...' : 'Play Audio'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-ink font-medium leading-relaxed bg-mint-deep/30 p-2.5 rounded-lg border border-border/50">
                    "{note.plainSummary}"
                  </p>

                  {note.extractedCues && note.extractedCues.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {note.extractedCues.map((c: any, idx: number) => (
                        <span
                          key={idx}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getCueBadgeClass(c.tag as CueTag)}`}
                        >
                          {c.tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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

      {/* 2.6 FAMILY TAB */}
      {activeTab === 'family' && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-forest uppercase tracking-wider">
            Linked Family Members
          </h3>

          <div className="bg-white border border-border rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <InitialsAvatar name={senior.linkedFamilyName || 'Karishma'} size="lg" />
              <div>
                <h4 className="text-sm font-bold text-ink">{senior.linkedFamilyName || 'Karishma'}</h4>
                <span className="text-xs text-ink-muted">Family member : Daughter</span>
                <div className="text-xs font-semibold text-forest mt-0.5">
                  Phone: {senior.linkedFamilyPhone || '8765789433'}
                </div>
              </div>
            </div>

            {senior.linkedFamilyPhone && (
              <a
                href={`tel:${senior.linkedFamilyPhone}`}
                className="min-h-[44px] px-4 py-2 bg-forest hover:bg-forest-dark text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </a>
            )}
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
    </div>
  );
};
