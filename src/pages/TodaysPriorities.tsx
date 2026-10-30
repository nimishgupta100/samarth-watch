import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { SignalType, UrgencyLevel, RecommendedAction } from '../types';
import { Sparkline } from '../components/common/Sparkline';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  Activity, 
  Pill, 
  MessageSquare, 
  VolumeX, 
  PhoneCall, 
  Calendar, 
  Search, 
  Filter, 
  ChevronRight, 
  ShieldCheck,
  TrendingUp,
  MapPin,
  Flame,
  ShieldAlert,
  Users,
  Heart,
  Phone,
  Video,
  ExternalLink,
  Check,
  X,
  User,
  UserCheck,
  RotateCcw,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';

export const TodaysPriorities: React.FC = () => {
  usePageTitle(
    "Today's Priorities - Samarth Watch",
    "AI-powered early-warning caseload triage for Care Coordinators looking after seniors living at home in India."
  );

  const { showToast } = useToast();

  const { 
    seniors, 
    handleAlertAction, 
    handleFeedback, 
    precisionRate, 
    setCurrentSeniorId,
    activeSosEvent,
    resolveSosEvent,
    doses,
    takeDoseSenior,
    snoozeDoseSenior,
    medicineChangeRequests,
    approveMedicineChange,
    rejectMedicineChange,
    appointments,
    confirmAppointmentByCoordinator,
    cancelAppointment,
    setRole,
    // Coordinator tools
    coordinatorProfile,
    updateCoordinatorProfile,
    updateSeniorProfile,
    medicines,
    addMedicine,
    updateMedicine,
    removeMedicine,
    resetDemoData,
    selectedSenior
  } = useApp();

  // Modals
  const [showCoordProfileModal, setShowCoordProfileModal] = useState(false);
  const [showSeniorProfileModal, setShowSeniorProfileModal] = useState(false);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  // Coord form
  const [coordName, setCoordName] = useState(coordinatorProfile?.name || 'Nimish Gupta');
  const [coordPhone, setCoordPhone] = useState(coordinatorProfile?.phone || '9368059741');

  // Senior form
  const [seniorAge, setSeniorAge] = useState<string>(selectedSenior?.age ? String(selectedSenior.age) : '');
  const [seniorCity, setSeniorCity] = useState(selectedSenior?.city && selectedSenior.city !== 'Not added yet' ? selectedSenior.city : '');
  const [seniorAddress, setSeniorAddress] = useState(selectedSenior?.address && selectedSenior.address !== 'Not added yet' ? selectedSenior.address : '');
  const [seniorLivingSituation, setSeniorLivingSituation] = useState(selectedSenior?.livingSituation && selectedSenior.livingSituation !== 'Not added yet' ? selectedSenior.livingSituation : '');
  const [seniorLang, setSeniorLang] = useState<'hi' | 'en'>(selectedSenior?.languagePreference || 'hi');
  const [seniorEmergName, setSeniorEmergName] = useState(selectedSenior?.emergencyContactName && selectedSenior.emergencyContactName !== 'Not added yet' ? selectedSenior.emergencyContactName : '');
  const [seniorEmergPhone, setSeniorEmergPhone] = useState(selectedSenior?.emergencyContactPhone && selectedSenior.emergencyContactPhone !== 'Not added yet' ? selectedSenior.emergencyContactPhone : '');
  const [seniorDoctor, setSeniorDoctor] = useState(selectedSenior?.doctor && selectedSenior.doctor !== 'Not added yet' ? selectedSenior.doctor : '');

  // Medicine form inside medicine modal
  const [isAddingMed, setIsAddingMed] = useState(false);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [medNameInput, setMedNameInput] = useState('');
  const [medInstructionsInput, setMedInstructionsInput] = useState('');
  const [selectedTimes, setSelectedTimes] = useState<string[]>(['08:30 AM']);
  const [customTimeInput, setCustomTimeInput] = useState('');

  // Filters state
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | UrgencyLevel>('all');
  const [signalFilter, setSignalFilter] = useState<'all' | SignalType>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusTab, setStatusTab] = useState<'active' | 'all' | 'resolved'>('active');

  // Input state for appointment Google Meet link
  const [meetLinks, setMeetLinks] = useState<Record<string, string>>({});

  // Daily alert cap constant for alert fatigue prevention
  const DAILY_ALERT_CAP = 15;

  // The top alert seniors form the priority caseload
  const prioritySeniors = useMemo(() => {
    return seniors.slice(0, 15);
  }, [seniors]);

  // Unique cities from priority caseload
  const cities = useMemo(() => {
    const list = Array.from(new Set(prioritySeniors.map(s => s.city)));
    return ['all', ...list];
  }, [prioritySeniors]);

  // Filtered list
  const filteredSeniors = useMemo(() => {
    return prioritySeniors.filter(s => {
      // Status filter
      if (statusTab === 'active' && s.alertStatus !== 'pending') return false;
      if (statusTab === 'resolved' && s.alertStatus === 'pending') return false;

      // Urgency filter
      if (urgencyFilter !== 'all' && s.currentUrgency !== urgencyFilter) return false;

      // Signal filter
      if (signalFilter !== 'all' && (!s.activeSignals || !s.activeSignals.includes(signalFilter))) return false;

      // City filter
      if (cityFilter !== 'all' && s.city !== cityFilter) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(query);
        const matchCity = s.city ? s.city.toLowerCase().includes(query) : false;
        const matchReason = s.topReasons ? s.topReasons.some(r => r.toLowerCase().includes(query)) : false;
        if (!matchName && !matchCity && !matchReason) return false;
      }

      return true;
    });
  }, [prioritySeniors, urgencyFilter, signalFilter, cityFilter, searchQuery, statusTab]);

  const activeAlertsCount = prioritySeniors.filter(s => s.alertStatus === 'pending').length;
  const criticalCount = prioritySeniors.filter(s => s.currentUrgency === 'critical' && s.alertStatus === 'pending').length;
  const capPercentage = Math.round((prioritySeniors.length / DAILY_ALERT_CAP) * 100);

  // Active medicine escalations
  const escalatedDoses = useMemo(() => {
    return doses.filter(d => d.status === 'family_notified' || d.status === 'reminded');
  }, [doses]);

  // Pending change requests
  const pendingChangeRequests = useMemo(() => {
    return medicineChangeRequests.filter(r => r.status === 'pending');
  }, [medicineChangeRequests]);

  // Pending appointments
  const pendingAppointments = useMemo(() => {
    return appointments.filter(a => a.status === 'requested');
  }, [appointments]);

  const onResolveClick = (id: string, name: string, isCurrentlyDone: boolean) => {
    handleAlertAction(id, isCurrentlyDone ? 'pending' : 'done');
    if (!isCurrentlyDone) {
      showToast(`Resolved alert for ${name}. Log updated.`, 'success');
    } else {
      showToast(`Reopened alert for ${name}.`, 'info');
    }
  };

  const onSnoozeClick = (id: string, name: string, isCurrentlySnoozed: boolean) => {
    handleAlertAction(id, isCurrentlySnoozed ? 'pending' : 'snoozed');
    if (!isCurrentlySnoozed) {
      showToast(`Snoozed alert for ${name} for 24 hours.`, 'info');
    } else {
      showToast(`Alert unsnoozed for ${name}.`, 'info');
    }
  };

  const onFeedbackClick = (id: string, name: string, feedback: 'useful' | 'not_useful') => {
    handleFeedback(id, feedback);
    if (feedback === 'useful') {
      showToast(`Marked alert for ${name} as clinically actionable. Precision recalibrated.`, 'success');
    } else {
      showToast(`Marked alert for ${name} as non-actionable false positive. Model adjusted.`, 'info');
    }
  };

  const handleResolveSos = (id: string) => {
    resolveSosEvent(id, 'Spoke with resident and local guardian. Confirmed resident is safe and resting.');
    showToast('Emergency SOS marked as resolved. All parties updated.', 'success');
  };

  const handleConfirmAppointment = (apptId: string, type: 'In person' | 'Google Meet') => {
    const meetLink = type === 'Google Meet' ? (meetLinks[apptId] || 'https://meet.google.com/sam-arth-care') : undefined;
    confirmAppointmentByCoordinator(apptId, meetLink);
    showToast('Appointment confirmed. Calendar invitation and notification sent to family.', 'success');
  };

  const getActionChipStyle = (action: RecommendedAction) => {
    switch (action) {
      case 'Schedule doctor visit':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Call today':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'Medicine review':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Contact family':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const handleSaveCoordProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordName.trim()) {
      showToast('Coordinator name is required.', 'error');
      return;
    }
    updateCoordinatorProfile({
      name: coordName.trim(),
      phone: coordPhone.trim()
    });
    showToast('Coordinator profile updated successfully.', 'success');
    setShowCoordProfileModal(false);
  };

  const handleSaveSeniorProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAge = seniorAge.trim() ? parseInt(seniorAge.trim(), 10) : undefined;
    if (parsedAge !== undefined && (isNaN(parsedAge) || parsedAge < 40 || parsedAge > 120)) {
      showToast('Please enter a valid age between 40 and 120.', 'error');
      return;
    }
    updateSeniorProfile({
      age: parsedAge,
      city: seniorCity.trim(),
      address: seniorAddress.trim(),
      livingSituation: seniorLivingSituation.trim(),
      languagePreference: seniorLang,
      emergencyContactName: seniorEmergName.trim(),
      emergencyContactPhone: seniorEmergPhone.trim(),
      doctor: seniorDoctor.trim()
    });
    showToast("Senior Kamla's profile updated.", 'success');
    setShowSeniorProfileModal(false);
  };

  const handleToggleScheduleTime = (time: string) => {
    if (selectedTimes.includes(time)) {
      if (selectedTimes.length === 1) {
        showToast('At least one scheduled time is required.', 'error');
        return;
      }
      setSelectedTimes(selectedTimes.filter(t => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  const handleAddCustomTime = () => {
    if (!customTimeInput.trim()) return;
    if (!selectedTimes.includes(customTimeInput.trim())) {
      setSelectedTimes([...selectedTimes, customTimeInput.trim()]);
    }
    setCustomTimeInput('');
  };

  const handleSaveMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medNameInput.trim()) {
      showToast('Medicine name is required.', 'error');
      return;
    }
    if (selectedTimes.length === 0) {
      showToast('Please select at least one scheduled time.', 'error');
      return;
    }

    if (editingMedId) {
      updateMedicine(editingMedId, {
        name: medNameInput.trim(),
        instructions: medInstructionsInput.trim() || 'Take with water as directed',
        scheduledTimes: selectedTimes
      });
      showToast(`Updated medicine "${medNameInput.trim()}".`, 'success');
    } else {
      addMedicine(
        medNameInput.trim(),
        medInstructionsInput.trim() || 'Take with water as directed',
        selectedTimes
      );
      showToast(`Added "${medNameInput.trim()}". Today's doses scheduled.`, 'success');
    }

    setIsAddingMed(false);
    setEditingMedId(null);
    setMedNameInput('');
    setMedInstructionsInput('');
    setSelectedTimes(['08:30 AM']);
  };

  const handleStartEditMed = (med: any) => {
    setEditingMedId(med.id);
    setMedNameInput(med.name);
    setMedInstructionsInput(med.instructions);
    setSelectedTimes(med.scheduledTimes || ['08:30 AM']);
    setIsAddingMed(true);
  };

  const handleDeleteMed = (id: string, name: string) => {
    removeMedicine(id);
    showToast(`Removed medicine "${name}".`, 'info');
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setShowResetConfirmModal(false);
    showToast('Demo data reset to clean initial seed (3 users, 1 senior).', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* COORDINATOR WORKSPACE MANAGEMENT TOOLS */}
      <div className="bg-slate-900/90 backdrop-blur-md text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
              Care Coordinator Desk : {coordinatorProfile?.name || 'Nimish Gupta'}
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
              Caseload & Record Management Tools
            </h2>
          </div>
          <button
            onClick={() => setShowResetConfirmModal(true)}
            className="px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/60 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Demo Data
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          {/* Tool 1: My Profile */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-300">
                  <User className="w-4 h-4 text-teal-400" /> My Profile
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${coordinatorProfile?.phone ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50' : 'bg-amber-900/60 text-amber-300 border border-amber-700/50'}`}>
                  {coordinatorProfile?.phone ? 'Phone Set' : 'Phone Missing'}
                </span>
              </div>
              <p className="text-sm font-bold text-white mt-2">{coordinatorProfile?.name || 'Nimish Gupta'}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {coordinatorProfile?.phone ? `Phone: ${coordinatorProfile.phone}` : 'No phone number added yet. "Call coordinator" buttons remain disabled until added.'}
              </p>
            </div>
            <button
              onClick={() => {
                setCoordName(coordinatorProfile?.name || 'Nimish Gupta');
                setCoordPhone(coordinatorProfile?.phone || '');
                setShowCoordProfileModal(true);
              }}
              className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit My Profile
            </button>
          </div>

          {/* Tool 2: Kamla's Profile */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <UserCheck className="w-4 h-4 text-amber-400" /> Senior Profile
                </span>
                <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-bold">
                  Assigned Senior
                </span>
              </div>
              <p className="text-sm font-bold text-white mt-2">Kamla (7452009877)</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedSenior?.city && selectedSenior.city !== 'Not added yet' ? `${selectedSenior.city} • ${selectedSenior.age ? `${selectedSenior.age} yrs` : 'Age not set'}` : 'Profile fields not completed yet.'}
              </p>
            </div>
            <button
              onClick={() => {
                setSeniorAge(selectedSenior?.age ? String(selectedSenior.age) : '');
                setSeniorCity(selectedSenior?.city && selectedSenior.city !== 'Not added yet' ? selectedSenior.city : '');
                setSeniorAddress(selectedSenior?.address && selectedSenior.address !== 'Not added yet' ? selectedSenior.address : '');
                setSeniorLivingSituation(selectedSenior?.livingSituation && selectedSenior.livingSituation !== 'Not added yet' ? selectedSenior.livingSituation : '');
                setSeniorLang(selectedSenior?.languagePreference || 'hi');
                setSeniorEmergName(selectedSenior?.emergencyContactName && selectedSenior.emergencyContactName !== 'Not added yet' ? selectedSenior.emergencyContactName : '');
                setSeniorEmergPhone(selectedSenior?.emergencyContactPhone && selectedSenior.emergencyContactPhone !== 'Not added yet' ? selectedSenior.emergencyContactPhone : '');
                setSeniorDoctor(selectedSenior?.doctor && selectedSenior.doctor !== 'Not added yet' ? selectedSenior.doctor : '');
                setShowSeniorProfileModal(true);
              }}
              className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Kamla's Profile
            </button>
          </div>

          {/* Tool 3: Medicine Manager */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-300">
                  <Pill className="w-4 h-4 text-rose-400" /> Medicine Manager
                </span>
                <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-bold">
                  {medicines.length} Prescribed
                </span>
              </div>
              <p className="text-sm font-bold text-white mt-2">Kamla's Medications</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {medicines.length === 0 ? 'No medicines added yet. Adding one schedules today’s doses for Kamla.' : `${medicines.length} medicine(s) active on schedule.`}
              </p>
            </div>
            <button
              onClick={() => {
                setIsAddingMed(false);
                setEditingMedId(null);
                setMedNameInput('');
                setMedInstructionsInput('');
                setSelectedTimes(['08:30 AM']);
                setShowMedicineModal(true);
              }}
              className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Pill className="w-3.5 h-3.5" /> Manage Medicines ({medicines.length})
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE EMERGENCY SOS ALERT (TOP PRIORITY BANNER) */}
      {activeSosEvent && (
        <div
          className={`border-2 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md animate-fadeIn ${
            activeSosEvent.cancelledBySenior
              ? 'bg-amber-50/95 border-amber-400'
              : 'bg-red-50/95 border-red-600'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`w-12 h-12 text-white rounded-xl flex items-center justify-center shrink-0 ${
                  activeSosEvent.cancelledBySenior ? 'bg-amber-600' : 'bg-red-600'
                }`}
              >
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                      activeSosEvent.cancelledBySenior
                        ? 'text-amber-800 bg-amber-100 border-amber-300'
                        : 'text-red-700 bg-red-100 border-red-300'
                    }`}
                  >
                    {activeSosEvent.cancelledBySenior
                      ? 'SOS Cancelled by Resident (False Alarm)'
                      : 'Active Emergency Help Request'}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      activeSosEvent.cancelledBySenior ? 'text-amber-900' : 'text-red-900'
                    }`}
                  >
                    Triggered at {new Date(activeSosEvent.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3
                  className={`text-lg font-black mt-1 ${
                    activeSosEvent.cancelledBySenior ? 'text-amber-950' : 'text-red-950'
                  }`}
                >
                  Senior: {activeSosEvent.seniorName} {activeSosEvent.cancelledBySenior ? 'cancelled the SOS call' : 'pressed the SOS Help Button'}
                </h3>
                <p
                  className={`text-xs mt-0.5 leading-relaxed ${
                    activeSosEvent.cancelledBySenior ? 'text-amber-900' : 'text-red-900'
                  }`}
                >
                  {activeSosEvent.cancelledBySenior
                    ? 'Resident indicated accidental press within the 60-second cancellation window. Immediate threat dismissed.'
                    : `Status: ${activeSosEvent.status}. Please contact senior immediately via phone line to triage physical safety.`}
                </p>

                {/* Location Display & Google Maps Link */}
                {activeSosEvent.location && (
                  <div className="mt-2.5 p-2.5 bg-white/80 border border-slate-300 rounded-lg text-xs text-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 font-bold">
                      <MapPin className="w-4 h-4 text-red-600" />
                      Location ({activeSosEvent.location.source.replace('_', ' ')}): {activeSosEvent.location.lat.toFixed(4)}, {activeSosEvent.location.lng.toFixed(4)}
                      {activeSosEvent.location.homeAddress && ` (${activeSosEvent.location.homeAddress})`}
                    </span>
                    <a
                      href={`https://maps.google.com/?q=${activeSosEvent.location.lat},${activeSosEvent.location.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-bold text-teal-800 hover:text-teal-900"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href="tel:+919820011111"
                className="px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Phone className="w-4 h-4" /> Call Senior
              </a>
              <button
                onClick={() => handleResolveSos(activeSosEvent.id)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <CheckCircle2 className="w-4 h-4 text-teal-400" /> Mark SOS Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE 30-MINUTE MEDICINE ESCALATION ALERTS */}
      {escalatedDoses.length > 0 && (
        <div className="bg-white/95 backdrop-blur-md border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900">
            <Pill className="w-4 h-4 text-amber-700" />
            <span>Medication Adherence Escalation Desk (30-Minute Threshold)</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {escalatedDoses.map(dose => (
              <div key={dose.id} className="bg-slate-50 p-4 rounded-2xl border border-amber-200 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{dose.medicineName}</span>
                    <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      Unconfirmed {dose.scheduledTime}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Senior has not confirmed dose. Automated family escalation notification was delivered at {dose.familyNotifiedTimestamp ? new Date(dose.familyNotifiedTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '30 mins post-schedule'}.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      takeDoseSenior(dose.id);
                      showToast(`Marked ${dose.medicineName} as taken by senior. Family notification resolved.`, 'success');
                    }}
                    className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-600/20 transition-colors"
                  >
                    Mark Dose Taken
                  </button>
                  <button
                    onClick={() => {
                      snoozeDoseSenior(dose.id);
                      showToast(`Snoozed dose reminder for 15 minutes.`, 'info');
                    }}
                    className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200"
                  >
                    Snooze
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PENDING MEDICINE SCHEDULE CHANGE REQUESTS FROM FAMILY */}
      {pendingChangeRequests.length > 0 && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100/20 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Pending Medicine Schedule Change Requests (from Family)
              </h3>
            </div>
            <span className="text-xs bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg font-bold">
              {pendingChangeRequests.length} Pending Doctor Review
            </span>
          </div>

          <div className="space-y-2.5">
            {pendingChangeRequests.map(req => (
              <div key={req.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-slate-900">
                    {req.medicineName} : Proposed Timing: <span className="text-blue-700">{req.proposedTiming}</span>
                  </p>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Requested by: <strong>{req.requestedBy}</strong> • Notes: "{req.notes}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      approveMedicineChange(req.id);
                      showToast(`Approved schedule change for ${req.medicineName}. Updated in senior schedule.`, 'success');
                    }}
                    className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-600/20 transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve Schedule
                  </button>
                  <button
                    onClick={() => {
                      rejectMedicineChange(req.id);
                      showToast(`Schedule change rejected. Family will be informed.`, 'info');
                    }}
                    className="px-3.5 py-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 font-semibold rounded-xl"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PENDING APPOINTMENT REQUESTS (IN-PERSON & GOOGLE MEET) */}
      {pendingAppointments.length > 0 && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100/20 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Pending Visit / Appointment Confirmations
              </h3>
            </div>
            <span className="text-xs bg-teal-50 text-teal-800 px-2.5 py-1 rounded-lg font-bold">
              {pendingAppointments.length} Requested
            </span>
          </div>

          <div className="space-y-3">
            {pendingAppointments.map(appt => (
              <div key={appt.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-900">
                      {appt.type} Visit for {appt.seniorName}
                    </span>
                    <span className="text-slate-500 ml-2">
                      {appt.date} at {appt.slotTime} (Requested by {appt.requestedBy})
                    </span>
                  </div>

                  {appt.homeAddress && (
                    <span className="text-slate-600 text-[11px] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {appt.homeAddress}
                    </span>
                  )}
                </div>

                {appt.type === 'Google Meet' && (
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-semibold text-slate-700 shrink-0">
                      Google Meet URL:
                    </label>
                    <input
                      type="url"
                      placeholder="https://meet.google.com/xxx-yyyy-zzz"
                      value={meetLinks[appt.id] || ''}
                      onChange={(e) => setMeetLinks({ ...meetLinks, [appt.id]: e.target.value })}
                      className="flex-1 p-2 text-xs bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200">
                  <button
                    onClick={() => handleConfirmAppointment(appt.id, appt.type)}
                    className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-600/20 transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Confirm Appointment
                  </button>
                  <button
                    onClick={() => {
                      cancelAppointment(appt.id);
                      showToast('Appointment request cancelled.', 'info');
                    }}
                    className="px-3.5 py-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hero Header Section */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Thursday, October 29, 2026 : Morning Triage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Good morning, {coordinatorProfile?.name || 'Care Coordinator'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              <strong className="text-red-700 font-bold">{activeAlertsCount} seniors</strong> need attention today out of your {seniors.length} assigned senior{seniors.length === 1 ? '' : 's'}.
              Prioritized by multi-modal personal baseline deviation score.
            </p>
          </div>

          {/* Daily Alert Cap Meter & Precision Stat Card */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Daily Alert Cap */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-w-0 flex-1">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-600" /> Daily Alert Cap
                </span>
                <span className="font-bold text-slate-900">
                  {prioritySeniors.length} / {DAILY_ALERT_CAP}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    capPercentage > 90 ? 'bg-amber-600' : 'bg-teal-600'
                  }`}
                  style={{ width: `${Math.min(100, capPercentage)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-600" /> Maximum 15 alerts/day prevents fatigue
              </p>
            </div>

            {/* Live Model Precision Metric */}
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-teal-800">Alert Precision this week</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-teal-950">{precisionRate}%</span>
                <span className="text-[11px] text-teal-700 font-bold">High Trust</span>
              </div>
              <div className="text-[10px] text-teal-700 mt-0.5">Updated live from coordinator feedback</div>
            </div>

          </div>
        </div>

        {/* Quick Triage Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-3 bg-red-50 p-3 rounded-xl border border-red-200">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-800 flex items-center justify-center font-bold text-sm">
              {criticalCount}
            </div>
            <div>
              <div className="text-xs font-bold text-red-950">Critical Priority</div>
              <div className="text-[11px] text-red-700">Risk Score &gt; 70</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-amber-50 p-3 rounded-xl border border-amber-200">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              {prioritySeniors.filter(s => s.currentUrgency === 'moderate' && s.alertStatus === 'pending').length}
            </div>
            <div>
              <div className="text-xs font-bold text-amber-950">Moderate Watch</div>
              <div className="text-[11px] text-amber-700">Risk Score 45 - 70</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-sm">
              {seniors.length}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Total Caseload</div>
              <div className="text-[11px] text-slate-500">{coordinatorProfile?.name || 'Care Coordinator'}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              {prioritySeniors.filter(s => s.alertStatus === 'done').length}
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-950">Resolved Today</div>
              <div className="text-[11px] text-emerald-700">Triaged & Closed</div>
            </div>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100/20 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by senior name, city, or symptom cue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-teal-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs shrink-0 flex-wrap">
            <button
              onClick={() => setStatusTab('active')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusTab === 'active'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Needs Action ({prioritySeniors.filter(s => s.alertStatus === 'pending').length})
            </button>
            <button
              onClick={() => setStatusTab('resolved')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusTab === 'resolved'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({prioritySeniors.filter(s => s.alertStatus !== 'pending').length})
            </button>
            <button
              onClick={() => setStatusTab('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusTab === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Alerts ({prioritySeniors.length})
            </button>
          </div>

        </div>

        {/* Filter Chips Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          
          <span className="font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          {/* Urgency Filter */}
          <div className="flex items-center gap-1 flex-wrap bg-slate-50 p-0.5 rounded-md border border-slate-200 shrink-0">
            <button
              onClick={() => setUrgencyFilter('all')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium ${
                urgencyFilter === 'all' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Urgency
            </button>
            <button
              onClick={() => setUrgencyFilter('critical')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium ${
                urgencyFilter === 'critical' ? 'bg-red-700 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Critical (&gt;70)
            </button>
            <button
              onClick={() => setUrgencyFilter('moderate')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium ${
                urgencyFilter === 'moderate' ? 'bg-amber-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Moderate (45-70)
            </button>
          </div>

          {/* Signal Type Filter */}
          <div className="flex items-center gap-1 flex-wrap bg-slate-50 p-0.5 rounded-md border border-slate-200 shrink-0">
            <button
              onClick={() => setSignalFilter('all')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium ${
                signalFilter === 'all' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Signals
            </button>
            <button
              onClick={() => setSignalFilter('vitals')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 ${
                signalFilter === 'vitals' ? 'bg-teal-700 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3 h-3" /> Vitals
            </button>
            <button
              onClick={() => setSignalFilter('medication')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 ${
                signalFilter === 'medication' ? 'bg-teal-700 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pill className="w-3 h-3" /> Medication
            </button>
            <button
              onClick={() => setSignalFilter('call_notes')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 ${
                signalFilter === 'call_notes' ? 'bg-teal-700 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3 h-3" /> Call Notes
            </button>
            <button
              onClick={() => setSignalFilter('silence')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 ${
                signalFilter === 'silence' ? 'bg-teal-700 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <VolumeX className="w-3 h-3" /> Silence
            </button>
          </div>

          {/* City Filter */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="text-[11px] font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 focus:outline-hidden"
          >
            <option value="all">All Cities</option>
            {cities.filter(c => c !== 'all').map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

        </div>
      </div>

      {/* Alert Cards Ranked List */}
      <div className="space-y-4">
        {filteredSeniors.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No alerts match your filter</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              All filtered seniors are currently reviewed or parameters are steady within personal baselines.
            </p>
            <button
              onClick={() => {
                setUrgencyFilter('all');
                setSignalFilter('all');
                setCityFilter('all');
                setSearchQuery('');
                setStatusTab('active');
              }}
              className="mt-4 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredSeniors.map((senior, rankIdx) => {
            const isCritical = senior.currentUrgency === 'critical';
            const isDone = senior.alertStatus === 'done';
            const isSnoozed = senior.alertStatus === 'snoozed';

            return (
              <div
                key={senior.id}
                className={`rounded-3xl transition-all border backdrop-blur-md shadow-xl hover:shadow-2xl ${
                  isDone 
                    ? 'bg-white/80 border-slate-200/80 opacity-70' 
                    : isCritical
                      ? 'bg-white/95 border-red-200/80 hover:border-red-400'
                      : 'bg-white/95 border-amber-200/80 hover:border-amber-400'
                }`}
              >
                <div className="p-5 sm:p-6">
                  
                  {/* Top Row: Rank, Score Badge, Name & City, Days Shift, Sparkline */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    
                    <div className="flex items-start sm:items-center gap-3.5">
                      
                      {/* Priority Rank Indicator */}
                      <div className="flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Rank</span>
                        <span className="text-lg font-black text-slate-800">#{rankIdx + 1}</span>
                      </div>

                      {/* Urgency Risk Score Box (Crisp rectangle, NO gradient) */}
                      <div 
                        className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white shrink-0 ${
                          isCritical ? 'bg-red-700' : 'bg-amber-600'
                        }`}
                      >
                        <span className="text-xl font-black leading-none">{senior.currentRiskScore}</span>
                        <span className="text-[9px] uppercase font-bold tracking-wider opacity-90">Risk</span>
                      </div>

                      {/* Senior Name, Age, City */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-base sm:text-lg font-bold text-slate-900 hover:text-teal-700 transition-colors">
                            <Link 
                              to={`/coordinator/senior/${senior.id}`}
                              onClick={() => setCurrentSeniorId(senior.id)}
                            >
                              {senior.name}
                            </Link>
                          </h2>
                          <span className="text-xs font-semibold text-slate-500">
                            {senior.age} yrs : {senior.gender}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {senior.city} ({senior.area})
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span>{senior.livingSituation}</span>
                          <span>:</span>
                          <span className="text-teal-700 font-medium">{senior.assignedCoordinatorName}</span>
                          
                          {senior.familyConsentGranted ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-green-800 bg-green-50 px-1.5 py-0.2 rounded border border-green-200">
                              Consent Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              Consent Paused
                            </span>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Right: Drift badge & 14-day sparkline */}
                    <div className="flex items-center gap-4 sm:justify-end shrink-0 pl-14 sm:pl-0">
                      
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded-md">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {senior.daysSinceBaselineShift} days drifting
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">from personal baseline</div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-center">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">14d Trend</div>
                        <Sparkline 
                          data={senior.trend14Days || []} 
                          color={isCritical ? '#DC2626' : '#D97706'} 
                          width={95}
                          height={28}
                        />
                      </div>

                    </div>

                  </div>

                  {/* Middle Row: Top 3 Plain Language Reasons */}
                  <div className="py-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      Top 3 Risk Drivers (Plain Language Explanation)
                    </div>

                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      {(senior.topReasons || []).map((reason, rIdx) => (
                        <li 
                          key={rIdx}
                          className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-start gap-2 leading-relaxed"
                        >
                          <span className="w-4 h-4 rounded-md bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {rIdx + 1}
                          </span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Row: Action Chip & Interactive Action Buttons (NO pill buttons!) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-500">Recommended Action:</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${getActionChipStyle(senior.recommendedAction || 'Call today')}`}>
                        <PhoneCall className="w-3.5 h-3.5" />
                        {senior.recommendedAction || 'Call today'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      
                      {/* Thumbs Feedback */}
                      <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
                        <button
                          onClick={() => onFeedbackClick(senior.id, senior.name, 'useful')}
                          title="Mark alert as useful"
                          className={`flex items-center gap-1 px-2 py-2 min-h-[40px] rounded-md transition-colors ${
                            senior.feedback === 'useful'
                              ? 'bg-teal-700 text-white font-bold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span className="text-[11px]">Useful</span>
                        </button>

                        <button
                          onClick={() => onFeedbackClick(senior.id, senior.name, 'not_useful')}
                          title="Mark alert as false positive"
                          className={`flex items-center gap-1 px-2 py-2 min-h-[40px] rounded-md transition-colors ${
                            senior.feedback === 'not_useful'
                              ? 'bg-rose-700 text-white font-bold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <ThumbsDown className="w-3 h-3" />
                          <span className="text-[11px]">Not useful</span>
                        </button>
                      </div>

                      {/* Snooze 24h Button */}
                      <button
                        onClick={() => onSnoozeClick(senior.id, senior.name, isSnoozed)}
                        className={`text-xs font-semibold px-3 py-2 min-h-[40px] rounded-lg border transition-colors flex items-center gap-1 ${
                          isSnoozed 
                            ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{isSnoozed ? 'Snoozed 24h' : 'Snooze 24h'}</span>
                      </button>

                      {/* Mark Done Button */}
                      <button
                        onClick={() => onResolveClick(senior.id, senior.name, isDone)}
                        className={`text-xs font-bold px-3 py-2 min-h-[40px] rounded-lg border transition-colors flex items-center gap-1.5 ${
                          isDone
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-teal-700 hover:bg-teal-800 text-white border-teal-700 shadow-2xs'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isDone ? 'Resolved' : 'Mark as done'}</span>
                      </button>

                      {/* Open Details */}
                      <Link
                        to={`/coordinator/senior/${senior.id}`}
                        onClick={() => setCurrentSeniorId(senior.id)}
                        className="text-xs font-bold px-3 py-2 min-h-[40px] rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1 shadow-2xs ml-1"
                      >
                        <span>Details & Script</span>
                        <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
                      </Link>

                    </div>

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: EDIT COORDINATOR PROFILE */}
      {showCoordProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-700" />
                Edit Coordinator Profile
              </h3>
              <button
                onClick={() => setShowCoordProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoordProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={coordName}
                  onChange={(e) => setCoordName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-teal-600 focus:outline-hidden"
                  placeholder="e.g. Nimish Gupta"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={coordPhone}
                  onChange={(e) => setCoordPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-teal-600 focus:outline-hidden"
                  placeholder="e.g. 9820112345 (Leave empty if not provided)"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  When empty, resident and family buttons will show "Coordinator phone number not added yet".
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition-colors shadow-md shadow-teal-700/20"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowCoordProfileModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT SENIOR KAMLA'S PROFILE */}
      {showSeniorProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-600" />
                Edit Senior Kamla's Profile
              </h3>
              <button
                onClick={() => setShowSeniorProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSeniorProfile} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min="40"
                    max="120"
                    value={seniorAge}
                    onChange={(e) => setSeniorAge(e.target.value)}
                    placeholder="e.g. 74"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={seniorCity}
                    onChange={(e) => setSeniorCity(e.target.value)}
                    placeholder="e.g. Pune"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={seniorAddress}
                  onChange={(e) => setSeniorAddress(e.target.value)}
                  placeholder="e.g. Flat 402, Shanti Niketan, Kothrud"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Living Situation</label>
                  <input
                    type="text"
                    value={seniorLivingSituation}
                    onChange={(e) => setSeniorLivingSituation(e.target.value)}
                    placeholder="e.g. Lives alone, family visits weekends"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Language Preference</label>
                  <select
                    value={seniorLang}
                    onChange={(e) => setSeniorLang(e.target.value as 'hi' | 'en')}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={seniorEmergName}
                    onChange={(e) => setSeniorEmergName(e.target.value)}
                    placeholder="e.g. Karishma"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={seniorEmergPhone}
                    onChange={(e) => setSeniorEmergPhone(e.target.value)}
                    placeholder="e.g. 8765789433"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attending Doctor Name</label>
                <input
                  type="text"
                  value={seniorDoctor}
                  onChange={(e) => setSeniorDoctor(e.target.value)}
                  placeholder="e.g. Dr. V. K. Joshi (Physician)"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors shadow-md shadow-amber-600/20"
                >
                  Save Kamla's Details
                </button>
                <button
                  type="button"
                  onClick={() => setShowSeniorProfileModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: MEDICINE MANAGER FOR KAMLA */}
      {showMedicineModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-rose-600" />
                  Medicine Manager : Kamla
                </h3>
                <p className="text-xs text-slate-500">
                  Prescribe and schedule daily doses for resident Kamla.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowMedicineModal(false);
                  setIsAddingMed(false);
                  setEditingMedId(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of current medicines */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Active Prescriptions ({medicines.length})
                </span>
                {!isAddingMed && (
                  <button
                    onClick={() => {
                      setIsAddingMed(true);
                      setEditingMedId(null);
                      setMedNameInput('');
                      setMedInstructionsInput('');
                      setSelectedTimes(['08:30 AM']);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Medicine
                  </button>
                )}
              </div>

              {medicines.length === 0 && !isAddingMed && (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <p className="text-xs font-medium text-slate-600">
                    No medicines currently scheduled for Kamla.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Click "Add Medicine" above to prescribe one. Today's scheduled dose will appear immediately on Kamla's website.
                  </p>
                </div>
              )}

              {medicines.map((med) => (
                <div
                  key={med.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{med.name}</span>
                    <span className="text-slate-600 block mt-0.5">{med.instructions}</span>
                    <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                      {med.scheduledTimes.map((st) => (
                        <span
                          key={st}
                          className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold"
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleStartEditMed(med)}
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                      title="Edit medicine"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMed(med.id, med.name)}
                      className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-red-600 border border-red-200"
                      title="Remove medicine"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add / Edit Form */}
            {isAddingMed && (
              <form
                onSubmit={handleSaveMedicine}
                className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-teal-200/60">
                  <span className="font-bold text-slate-900">
                    {editingMedId ? 'Edit Medicine' : 'Add New Medicine'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingMed(false);
                      setEditingMedId(null);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Medicine Name</label>
                  <input
                    type="text"
                    value={medNameInput}
                    onChange={(e) => setMedNameInput(e.target.value)}
                    placeholder="e.g. Amlodipine 5mg"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Instructions & Timing Note
                  </label>
                  <input
                    type="text"
                    value={medInstructionsInput}
                    onChange={(e) => setMedInstructionsInput(e.target.value)}
                    placeholder="e.g. Take with warm water after breakfast"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Scheduled Daily Times
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: 'Morning', time: '08:30 AM' },
                      { label: 'Afternoon', time: '01:30 PM' },
                      { label: 'Evening', time: '05:30 PM' },
                      { label: 'Night', time: '09:00 PM' },
                    ].map(({ label, time }) => {
                      const isSelected = selectedTimes.includes(time);
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleToggleScheduleTime(time)}
                          className={`p-2 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'bg-teal-700 text-white border-teal-700 font-bold shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span className="block text-[10px] uppercase font-semibold opacity-80">{label}</span>
                          <span className="block text-xs font-bold">{time}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={customTimeInput}
                      onChange={(e) => setCustomTimeInput(e.target.value)}
                      placeholder="Custom time, e.g. 11:00 AM"
                      className="flex-1 p-2 rounded-xl border border-slate-300 bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomTime}
                      className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
                    >
                      Add Slot
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-colors shadow-md shadow-teal-700/20"
                  >
                    {editingMedId ? 'Update Medicine' : 'Save & Schedule Today Doses'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 4: RESET DEMO DATA CONFIRMATION */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl border border-slate-200 animate-fadeIn text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Reset Demo Data?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                This will clear all created medicines, vitals, alerts and appointment records, and restore the clean initial state: exactly 3 accounts (Coordinator, Senior Kamla, Family Karishma) and 1 senior record with empty fields.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleConfirmReset}
                className="flex-1 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs transition-colors shadow-md shadow-red-700/20"
              >
                Yes, Reset All Data
              </button>
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
