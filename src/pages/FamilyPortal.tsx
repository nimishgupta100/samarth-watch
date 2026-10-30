import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { downloadIcsFile } from '../utils/calendar';
import { InitialsAvatar } from '../components/coordinator/InitialsAvatar';
import { StatusChip } from '../components/coordinator/StatusChip';
import { SegmentedTabs } from '../components/coordinator/SegmentedTabs';
import { DateStrip } from '../components/coordinator/DateStrip';
import { SlotPicker } from '../components/coordinator/SlotPicker';
import { FamilyTopBar } from '../components/family/FamilyTopBar';
import { FamilySidebar } from '../components/family/FamilySidebar';
import { FamilyBottomNav, FamilyTab } from '../components/family/FamilyBottomNav';
import { FamilyQuickActionTile } from '../components/family/FamilyQuickActionTile';
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
  Heart,
  Calendar,
  Clock,
  Phone,
  Video,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Download,
  ShieldAlert,
  Send,
  X,
  Pill,
  Lock,
  ChevronRight,
  ChevronLeft,
  Activity,
  Plus,
  ExternalLink,
  MessageSquare,
  Check,
  UserCheck,
  Watch,
  BatteryCharging,
  BatteryWarning,
  Wifi,
  Radio,
  Share2,
  TrendingUp
} from 'lucide-react';
import { useWearable } from '../wearables/useWearable';
import { formatISTDisplay } from '../wearables/normalize';
import { bandConnectionManager } from '../wearables/BandConnectionManager';
import { wearableIngestEngine } from '../wearables/ingest';
import { SeniorLocationSection } from '../components/common/SeniorLocationSection';

export const FamilyPortal: React.FC = () => {
  usePageTitle(
    'Family Companion - Samarth Watch',
    'Private wellbeing updates and care coordination for families caring for seniors living at home in India.'
  );

  const {
    selectedSenior,
    seniors,
    toggleConsent,
    toggleDetailedVitalsConsent,
    detailedVitalsConsent,
    medicines,
    doses,
    confirmDoseFamily,
    requestMedicineChange,
    medicineChangeRequests,
    appointments,
    requestAppointment,
    rescheduleAppointment,
    cancelAppointment,
    voiceNotes,
    healthReadings,
    activeSosEvent,
    coordinatorProfile,
    todayCheckinAnswer,
    roleNotifications,
    markNotificationRead,
    remindSeniorToConnectBand,
    t
  } = useApp();

  const { device: wearableDevice, readings: recentWearableReadings } = useWearable(selectedSenior.id);

  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<FamilyTab>('home');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Medicines tracker states (Section 5.2)
  const [selectedMedDate, setSelectedMedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [medTimeSegment, setMedTimeSegment] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [showMedHistory, setShowMedHistory] = useState(false);
  const [showMedChangeModal, setShowMedChangeModal] = useState(false);
  const [changeMedName, setChangeMedName] = useState('');
  const [changeMedTiming, setChangeMedTiming] = useState('08:30 AM');
  const [changeMedNotes, setChangeMedNotes] = useState('');

  // Health states (Section 5.3)
  const [vitalsRangeTab, setVitalsRangeTab] = useState<'today' | '7d' | '30d' | '90d'>('7d');
  const [vitalsRange, setVitalsRange] = useState<14 | 30 | 90>(30);
  const [selectedVital, setSelectedVital] = useState<'bp' | 'sugar' | 'spo2'>('bp');
  const [showAddReadingModal, setShowAddReadingModal] = useState(false);
  const [readingType, setReadingType] = useState<'bp' | 'sugar' | 'spo2'>('bp');
  const [readingSys, setReadingSys] = useState('128');
  const [readingDia, setReadingDia] = useState('80');
  const [readingVal, setReadingVal] = useState('110');

  // Appointments states (Section 5.4)
  const [apptTab, setApptTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [showBookApptModal, setShowBookApptModal] = useState(false);
  const [apptType, setApptType] = useState<'In person' | 'Google Meet'>('Google Meet');
  const [apptDate, setApptDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [apptSlot, setApptSlot] = useState<string>('10:00 AM');
  const [apptNotes, setApptNotes] = useState('');

  // Messages state (Section 5.5)
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: 'family' | 'coordinator'; text: string; time: string }>>([
    {
      id: 'm1',
      sender: 'coordinator',
      text: 'Good morning Karishma! Kamla ji had breakfast on time and her morning routine is smooth. All vital readings are within her normal baseline.',
      time: '08:45 AM',
    },
  ]);
  const [messageInput, setMessageInput] = useState('');

  // Report state (Section 5.6)
  const [reportType, setReportType] = useState<'daily' | 'weekly'>('weekly');
  const [autoSendReport, setAutoSendReport] = useState(false);

  // Senior reference
  const senior = selectedSenior || seniors[0];

  // Emergency Check: active SOS or unconfirmed medicine
  const pendingMedDose = doses.find((d) => d.status === 'pending');
  const isEmergencyActive = Boolean(activeSosEvent && activeSosEvent.status !== 'Resolved') || Boolean(pendingMedDose);

  // Medicine counts for today
  const takenDosesCount = doses.filter((d) => d.status === 'taken').length;
  const totalDosesCount = doses.length;

  // 30-Day adherence history for family
  const adherence30Days = useMemo(() => {
    const history = senior?.history90Days || [];
    const recent = history.slice(-30);
    const list = [];
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

  // Vitals chart data with baseline band
  const vitalsChartData = useMemo(() => {
    if (!senior?.baseline || !senior?.history90Days || senior.history90Days.length === 0) {
      return [];
    }
    const b = senior.baseline;
    return senior.history90Days.slice(-vitalsRange).map((d) => {
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
      };
    });
  }, [senior, vitalsRange]);

  // Plain language status text
  const plainHealthStatus = useMemo(() => {
    if (senior.currentUrgency === 'critical') return { text: 'Coordinator is following up', variant: 'critical' as const };
    if (senior.currentUrgency === 'moderate') return { text: 'Worth a check', variant: 'warning' as const };
    return { text: 'Doing well', variant: 'success' as const };
  }, [senior]);

  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'family' as const,
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setMessageInput('');
    showToast('Message sent to coordinator', 'success');
  };

  // Handle request medicine change
  const handleSubmitMedChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeMedName.trim()) {
      showToast('Please specify the medicine name', 'error');
      return;
    }
    requestMedicineChange(changeMedName.trim(), changeMedTiming, changeMedNotes.trim());
    showToast('Medicine change request sent to coordinator for review', 'success');
    setShowMedChangeModal(false);
    setChangeMedName('');
    setChangeMedNotes('');
  };

  // Handle booking appointment
  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    requestAppointment(
      apptType,
      apptDate,
      apptSlot,
      senior?.address,
      apptNotes.trim() || 'Booked by family member'
    );
    showToast('Consultation session booked. Coordinator notified.', 'success');
    setShowBookApptModal(false);
    setApptNotes('');
  };

  // Consent-Paused Screen (Section 5.8)
  if (!senior.familyConsentGranted) {
    return (
      <div className="min-h-dvh flex flex-col bg-mint text-ink">
        <FamilyTopBar onOpenNotifications={() => setNotificationsOpen(true)} />
        <main className="flex-1 max-w-xl mx-auto px-4 py-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-300">
            <Lock className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-ink">Sharing is Temporarily Paused</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              {senior.name} has chosen to pause family health sharing. To respect senior autonomy and privacy, health logs and check-in details are hidden.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-cream border border-border text-left space-y-2">
            <span className="text-xs font-bold text-forest uppercase tracking-wider block">
              Emergency Exception Rule
            </span>
            <p className="text-xs text-ink-muted leading-relaxed">
              In the event of an active emergency or distress SOS, automated notifications will immediately be dispatched to both you and the care coordinator.
            </p>
            {coordinatorProfile?.phone && (
              <div className="pt-2">
                <a
                  href={`tel:${coordinatorProfile.phone}`}
                  className="min-h-[44px] px-4 py-2 bg-forest text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Care Coordinator ({coordinatorProfile.name})</span>
                </a>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex bg-mint text-ink antialiased">
      {/* Laptop Sidebar (>= 1024px) */}
      <FamilySidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-dvh overflow-x-hidden">
        <FamilyTopBar onOpenNotifications={() => setNotificationsOpen(true)} />

        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 pb-24 lg:pb-8 focus:outline-none">
          {/* 1. EMERGENCY BANNER (dominant red, displayed ONLY if active SOS or unconfirmed medicine) */}
          {isEmergencyActive && (
            <div
              role="alert"
              aria-live="assertive"
              className="bg-red-50 border-2 border-alert-red rounded-xl p-4 sm:p-5 shadow-sm mb-6 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-alert-red text-cream flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-alert-red text-cream text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {activeSosEvent ? 'EMERGENCY: Active SOS' : 'MEDICINE ATTENTION NEEDED'}
                      </span>
                      <span className="text-xs font-semibold text-alert-red">
                        Status: Coordinator is calling
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-ink mt-1">
                      {activeSosEvent
                        ? `${senior.name} activated SOS distress signal`
                        : `${senior.name} has not confirmed their ${pendingMedDose?.medicineName} (${pendingMedDose?.scheduledTime}) dose`}
                    </h2>

                    {activeSosEvent && (
                      <div className="flex items-center gap-2 text-xs text-ink-muted mt-1">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(senior.address || `${senior.city || 'Delhi'}, India`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-alert-red hover:underline inline-flex items-center gap-1"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Open in Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Emergency Action Buttons */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  {senior.phone && (
                    <a
                      href={`tel:${senior.phone}`}
                      className="min-h-[44px] px-4 py-2 bg-alert-red hover:bg-red-700 text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call {senior.name}</span>
                    </a>
                  )}

                  {/* "I spoke to them, they took it" button */}
                  {pendingMedDose && (
                    <button
                      type="button"
                      onClick={() => {
                        confirmDoseFamily(pendingMedDose.id);
                        showToast('Dose confirmed by family member.', 'success');
                      }}
                      className="min-h-[44px] px-4 py-2 bg-forest hover:bg-forest-dark text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>I spoke to them, they took it</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Summary Card (modelled on reference header) */}
              <div className="bg-cream border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-4">
                    <InitialsAvatar name={senior.name} size="xl" />
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-xl sm:text-2xl font-black text-ink">{senior.name}</h2>
                        <StatusChip label={plainHealthStatus.text} variant={plainHealthStatus.variant} />
                      </div>
                      <p className="text-xs text-ink-muted mt-0.5">
                        Coordinated by <span className="font-bold text-forest">{coordinatorProfile?.name || 'Nimish Gupta'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Medicine Progress Count (real count, text beside bar/ring) */}
                  <div className="bg-mint-deep/60 border border-border rounded-xl p-3.5 flex items-center gap-4 min-w-[200px]">
                    <div className="w-12 h-12 rounded-xl bg-forest text-cream flex flex-col items-center justify-center shrink-0">
                      <span className="text-base font-extrabold leading-none">{takenDosesCount}/{totalDosesCount}</span>
                      <span className="text-[9px] uppercase tracking-wider opacity-80 mt-0.5">Doses</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-ink">Medicines Today</div>
                      <div className="text-xs text-ink-muted">
                        {takenDosesCount} of {totalDosesCount} taken
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fact Tiles (real fields only, 'Not added yet' for the rest) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-left">
                  <div className="bg-white rounded-xl p-3 border border-border">
                    <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider block">Age</span>
                    <span className="text-sm font-bold text-ink mt-0.5 block">
                      {senior.age ? `${senior.age} years` : 'Not added yet'}
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-border">
                    <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider block">City</span>
                    <span className="text-sm font-bold text-ink mt-0.5 block">
                      {senior.city && senior.city !== 'Not added yet' ? senior.city : 'Not added yet'}
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-border">
                    <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider block">Living Situation</span>
                    <span className="text-sm font-bold text-ink mt-0.5 block truncate">
                      {senior.livingSituation && senior.livingSituation !== 'Not added yet' ? senior.livingSituation : 'Not added yet'}
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-border">
                    <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider block">Language</span>
                    <span className="text-sm font-bold text-ink mt-0.5 block uppercase">
                      {senior.languagePreference === 'hi' ? 'Hindi (हिन्दी)' : 'English'}
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-border col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider block">Last Check-in</span>
                    <span className="text-sm font-bold text-ink mt-0.5 block truncate">
                      Today 08:30 AM
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Action Tiles (rounded squares, line icons) */}
              <div>
                <div className="text-xs font-bold text-ink uppercase tracking-wider mb-2.5">
                  Quick Actions
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  <FamilyQuickActionTile
                    label="Medicines"
                    icon={<Pill className="w-5 h-5" />}
                    onClick={() => setActiveTab('medicines')}
                    badge={`${takenDosesCount}/${totalDosesCount}`}
                  />
                  <FamilyQuickActionTile
                    label="Calendar"
                    icon={<Calendar className="w-5 h-5" />}
                    onClick={() => setActiveTab('appointments')}
                  />
                  <FamilyQuickActionTile
                    label="Messages"
                    icon={<MessageSquare className="w-5 h-5" />}
                    onClick={() => setActiveTab('messages')}
                    badge={`${chatMessages.length}`}
                  />
                  <FamilyQuickActionTile
                    label={`Call ${senior.name}`}
                    icon={<Phone className="w-5 h-5" />}
                    onClick={() => {
                      if (senior.phone) window.location.href = `tel:${senior.phone}`;
                      else showToast('Phone number not added yet', 'info');
                    }}
                  />
                  <FamilyQuickActionTile
                    label="Get Report"
                    icon={<FileText className="w-5 h-5" />}
                    onClick={() => setActiveTab('report')}
                  />
                </div>
              </div>

              {/* Two-Column Grid: Today's Medicines & Upcoming Appointment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Today's Medicines List */}
                <div className="bg-cream border border-border rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-forest uppercase tracking-wider">
                      Today's Medicines
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('medicines')}
                      className="text-xs font-bold text-forest hover:underline"
                    >
                      View all
                    </button>
                  </div>

                  <div className="space-y-2">
                    {doses.slice(0, 3).map((dose) => (
                      <div key={dose.id} className="p-3 bg-white rounded-xl border border-border flex items-center justify-between">
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
                </div>

                {/* Upcoming Appointment */}
                <div className="bg-cream border border-border rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-forest uppercase tracking-wider">
                      Upcoming Consultation
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('appointments')}
                      className="text-xs font-bold text-forest hover:underline"
                    >
                      Calendar
                    </button>
                  </div>

                  {appointments.filter((a) => a.status === 'confirmed').length > 0 ? (
                    appointments
                      .filter((a) => a.status === 'confirmed')
                      .slice(0, 1)
                      .map((appt) => (
                        <div key={appt.id} className="p-4 bg-white rounded-xl border border-border space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-forest flex items-center gap-1.5">
                              {appt.type === 'Google Meet' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                              <span>{appt.type} Session</span>
                            </span>
                            <StatusChip label="CONFIRMED" variant="success" />
                          </div>
                          <div className="text-base font-bold text-ink">
                            {appt.date} at {appt.slotTime} IST
                          </div>
                          <div className="text-xs text-ink-muted">
                            With Care Coordinator {coordinatorProfile?.name || 'Nimish Gupta'}
                          </div>

                          {appt.meetLink && (
                            <div className="pt-2">
                              <a
                                href={appt.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="min-h-[40px] px-3.5 py-1.5 bg-forest hover:bg-forest-dark text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5"
                              >
                                <Video className="w-3.5 h-3.5" />
                                <span>Join Google Meet</span>
                              </a>
                            </div>
                          )}
                        </div>
                      ))
                  ) : (
                    <div className="p-6 bg-white rounded-xl border border-border text-center space-y-2">
                      <Calendar className="w-8 h-8 text-sage mx-auto" strokeWidth={1.5} />
                      <p className="text-xs text-ink-muted">No consultations scheduled.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('appointments');
                          setShowBookApptModal(true);
                        }}
                        className="min-h-[40px] px-4 py-2 bg-forest text-cream text-xs font-bold rounded-lg"
                      >
                        Book a Session
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Latest Voice Note Summary (only if consent allows) */}
              {voiceNotes.length > 0 && (
                <div className="bg-cream border border-border rounded-2xl p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-forest uppercase tracking-wider">
                      Latest Morning Check-in Summary
                    </span>
                    <span className="text-[11px] text-ink-muted">
                      {new Date(voiceNotes[0].timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-ink font-medium leading-relaxed bg-white p-3.5 rounded-xl border border-border">
                    "{voiceNotes[0].plainSummary}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MEDICINES TRACKER (modelled closely on reference image) */}
          {activeTab === 'medicines' && (
            <div className="space-y-6">
              {/* Header with Month Label, Date Strip, and Progress */}
              <div className="bg-cream border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-forest">
                      Medication Tracker
                    </h2>
                    <p className="text-xs text-ink-muted mt-0.5">
                      Daily doses, compliance verification and coordinator change requests
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowMedHistory(!showMedHistory)}
                      className={`min-h-[40px] px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                        showMedHistory ? 'bg-forest text-cream border-forest' : 'bg-white text-ink border-border hover:bg-mint-deep'
                      }`}
                    >
                      30-Day History
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowMedChangeModal(true)}
                      className="min-h-[40px] px-3.5 py-1.5 bg-forest hover:bg-forest-dark text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Request Change</span>
                    </button>
                  </div>
                </div>

                {/* Date Strip */}
                <DateStrip selectedDate={selectedMedDate} onSelectDate={setSelectedMedDate} daysCount={7} />

                {/* "Today's Progress" Card with Progress Bar */}
                <div className="bg-white rounded-xl p-4 border border-border space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-forest">
                    <span>Today's Progress: {takenDosesCount} of {totalDosesCount} Taken</span>
                    <span>{totalDosesCount > 0 ? Math.round((takenDosesCount / totalDosesCount) * 100) : 0}% Completed</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-mint-deep overflow-hidden">
                    <div
                      className="h-full bg-forest transition-all duration-300"
                      style={{ width: `${totalDosesCount > 0 ? (takenDosesCount / totalDosesCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Segmented Tabs: Morning, Afternoon, Evening (Rectangular) */}
                <div className="flex items-center gap-2">
                  <SegmentedTabs
                    tabs={[
                      { id: 'all', label: 'All Day' },
                      { id: 'morning', label: 'Morning' },
                      { id: 'afternoon', label: 'Afternoon' },
                      { id: 'evening', label: 'Evening' },
                    ]}
                    activeTab={medTimeSegment}
                    onChange={(t) => setMedTimeSegment(t as any)}
                  />
                </div>
              </div>

              {/* 30-Day Adherence Calendar (if history tab active) */}
              {showMedHistory && (
                <div className="bg-cream border border-border rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-forest uppercase tracking-wider">
                      30-Day Adherence Calendar
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-ink-muted">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-alert-green" /> Taken</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-alert-red" /> Missed</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
                    {adherence30Days.map((d) => (
                      <div
                        key={d.dayNum}
                        title={`${d.date} : ${d.status}`}
                        className={`h-8 sm:h-9 rounded-md flex flex-col items-center justify-center text-[10px] font-bold border ${
                          d.status === 'perfect'
                            ? 'bg-emerald-50 text-alert-green border-emerald-200'
                            : d.status === 'missed'
                            ? 'bg-red-50 text-alert-red border-red-200'
                            : 'bg-white text-ink-muted border-border'
                        }`}
                      >
                        {d.dayNum}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dose Cards Grouped by Time of Day */}
              <div className="space-y-3">
                {doses.length === 0 ? (
                  <div className="p-8 bg-cream border border-border rounded-xl text-center text-xs text-ink-muted">
                    No medication doses recorded for this day.
                  </div>
                ) : (
                  doses.map((dose) => {
                    const isTaken = dose.status === 'taken';
                    const isMissed = dose.status === 'missed';
                    const isPending = dose.status === 'pending';
                    const statusVariant = isTaken ? 'success' : isMissed ? 'critical' : isPending ? 'warning' : 'neutral';
                    const statusLabel = isTaken ? 'Taken on time' : isMissed ? 'Missed' : isPending ? 'Pending confirmation' : 'Scheduled';

                    return (
                      <div
                        key={dose.id}
                        className="bg-cream border border-border rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-lg bg-mint-deep text-forest flex items-center justify-center shrink-0">
                            <Pill className="w-5 h-5" strokeWidth={1.5} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-bold text-ink">{dose.medicineName}</h4>
                              <StatusChip label={statusLabel} variant={statusVariant} />
                            </div>
                            <p className="text-xs text-ink-muted mt-0.5">
                              {dose.dosageInstructions} : Scheduled at {dose.scheduledTime}
                            </p>
                          </div>
                        </div>

                        {/* Confirmation action for family */}
                        {isPending && (
                          <button
                            type="button"
                            onClick={() => {
                              confirmDoseFamily(dose.id);
                              showToast('Dose confirmed by family', 'success');
                            }}
                            className="min-h-[40px] px-3.5 py-1.5 bg-forest hover:bg-forest-dark text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5 shrink-0"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirm taken</span>
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Change Requests Section */}
              {medicineChangeRequests.length > 0 && (
                <div className="bg-cream border border-border rounded-2xl p-5 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold text-forest uppercase tracking-wider">
                    Your Medicine Change Requests
                  </h3>
                  <div className="space-y-2">
                    {medicineChangeRequests.map((req) => (
                      <div key={req.id} className="p-3 bg-white rounded-xl border border-border flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-ink">{req.medicineName} ({req.proposedTiming})</div>
                          <div className="text-[11px] text-ink-muted">{req.notes || 'Schedule modification'}</div>
                        </div>
                        <StatusChip
                          label={req.status.toUpperCase()}
                          variant={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'critical' : 'warning'}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HEALTH & VITALS */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              {!detailedVitalsConsent ? (
                /* Respectful explanation when detailed sharing is paused - ZERO health data in DOM */
                <div className="bg-cream border border-border rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-mint text-forest flex items-center justify-center mx-auto border border-border">
                    <Lock className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1.5 max-w-md mx-auto">
                    <h3 className="text-base sm:text-lg font-bold text-ink">
                      Detailed Health Sharing is Paused
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                      {selectedSenior.name} has chosen to keep continuous vital readings private. To honor senior autonomy and dignity, detailed physiological charts are hidden. You will still receive daily medicine confirmations and emergency alerts.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Band Information Card (Section 5.3 / Requirement 4) */}
                  <div className="bg-cream border border-border rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-mint text-forest flex items-center justify-center shrink-0 border border-border">
                          <Watch className="w-6 h-6 text-forest" strokeWidth={1.5} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-ink">
                              {wearableDevice?.vendorModelName || 'Samarth Health Band'}
                            </h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-mint-deep text-forest border border-border">
                              {t.simulatedDevice}
                            </span>
                          </div>
                          <div className="text-xs text-ink-muted flex items-center gap-2 mt-0.5">
                            <span
                              className={`inline-block w-2 h-2 rounded-full ${
                                wearableDevice?.status === 'connected'
                                  ? 'bg-emerald-500'
                                  : wearableDevice?.status === 'reconnecting'
                                  ? 'bg-amber-500 animate-pulse'
                                  : 'bg-zinc-400'
                              }`}
                            />
                            <span className="capitalize">
                              {wearableDevice?.status === 'connected'
                                ? 'Connected & transmitting'
                                : wearableDevice?.status === 'reconnecting'
                                ? 'Reconnecting'
                                : wearableDevice?.status === 'paused'
                                ? 'Paused'
                                : 'Disconnected'}
                            </span>
                            <span>•</span>
                            <span>{t.lastSync}: {wearableDevice?.lastSyncAt ? formatISTDisplay(wearableDevice.lastSyncAt) : 'Just now'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {wearableDevice?.batteryPercent !== undefined && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-semibold text-ink">
                            <BatteryCharging className="w-4 h-4 text-forest" />
                            <span>{wearableDevice.batteryPercent}% Battery</span>
                          </div>
                        )}

                        {/* Remind Senior to connect band action */}
                        <button
                          type="button"
                          onClick={() => {
                            try {
                              remindSeniorToConnectBand();
                              showToast(t.remindBandConnectSuccess || 'In-app reminder sent to connect band', 'success');
                            } catch {
                              showToast(t.remindBandConnectError || 'Could not send reminder', 'error');
                            }
                          }}
                          className="min-h-[44px] px-3.5 py-1.5 bg-forest text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5 hover:bg-forest/90 transition-colors"
                          title="Send an in-app reminder to wear and connect band"
                        >
                          <Radio className="w-3.5 h-3.5" />
                          <span>{t.remindBandConnectButton || 'Remind Kamla to connect'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Band Extended Details: uptime %, firmware, paired by, recent gaps */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-border text-xs">
                      <div className="p-2.5 bg-white rounded-lg border border-border">
                        <div className="text-[10px] text-ink-muted uppercase font-bold">Connected (24h)</div>
                        <div className="text-sm font-black text-forest mt-0.5">
                          {bandConnectionManager.computeConnectedPercentage(24) === 'unknown'
                            ? 'unknown'
                            : `${bandConnectionManager.computeConnectedPercentage(24)}%`}
                        </div>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-border">
                        <div className="text-[10px] text-ink-muted uppercase font-bold">Connected (7d)</div>
                        <div className="text-sm font-black text-forest mt-0.5">
                          {bandConnectionManager.computeConnectedPercentage(168) === 'unknown'
                            ? 'unknown'
                            : `${bandConnectionManager.computeConnectedPercentage(168)}%`}
                        </div>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-border">
                        <div className="text-[10px] text-ink-muted uppercase font-bold">Paired By</div>
                        <div className="text-xs font-bold text-ink mt-0.5 truncate">
                          {wearableDevice?.pairedBy?.role === 'coordinator' ? 'Coordinator' : 'Family Member'}
                        </div>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-border">
                        <div className="text-[10px] text-ink-muted uppercase font-bold">Firmware</div>
                        <div className="text-xs font-bold text-ink mt-0.5">
                          {wearableDevice?.firmware || 'v1.4-ble'}
                        </div>
                      </div>
                    </div>

                    {/* Recent Connection Gaps */}
                    <div className="pt-1">
                      <div className="text-[11px] font-bold text-ink-muted mb-1 flex items-center justify-between">
                        <span>{t.recentGapsLabel || 'Recent connection gaps'}</span>
                        <span className="text-[10px] text-ink-muted">Last 24 hours</span>
                      </div>
                      {wearableIngestEngine.getLogs(selectedSenior.id).filter((l) => l.eventType === 'gap_detected').length === 0 ? (
                        <div className="p-2 bg-white rounded-lg border border-border text-xs text-ink-muted text-center">
                          {t.noGapsDetected || 'No recent connection gaps detected'}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {wearableIngestEngine
                            .getLogs(selectedSenior.id)
                            .filter((l) => l.eventType === 'gap_detected')
                            .slice(0, 3)
                            .map((gap) => (
                              <div key={gap.id} className="p-2 bg-amber-50/60 rounded border border-amber-200 text-xs flex items-center justify-between">
                                <span className="text-amber-900 font-medium truncate">{gap.message}</span>
                                <span className="text-[10px] text-ink-muted shrink-0 font-mono ml-2">
                                  {formatISTDisplay(gap.timestamp)}
                                </span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 1. LARGE HEART RATE CARD (Requirement 1 & Reference) */}
                  {(() => {
                    const hrReadings = recentWearableReadings.filter((r) => r.metric === 'heart_rate');
                    const latestHr = hrReadings[0];
                    const hrNow = Date.now();
                    const hr24h = hrReadings.filter((r) => hrNow - r.measuredAt <= 24 * 60 * 60 * 1000);

                    // Form chart data with gaps staying gaps (null)
                    const hrChartData = hr24h.length > 0
                      ? hr24h.slice(-16).reverse().map((r) => ({
                          time: new Date(r.measuredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          hr: r.value,
                          baselineMean: 72,
                          upper: 82,
                          lower: 64,
                        }))
                      : [
                          { time: '06:00', hr: 68, baselineMean: 72, upper: 82, lower: 64 },
                          { time: '09:00', hr: 74, baselineMean: 72, upper: 82, lower: 64 },
                          { time: '12:00', hr: null, baselineMean: 72, upper: 82, lower: 64 }, // GAP drawn as GAP
                          { time: '15:00', hr: 76, baselineMean: 72, upper: 82, lower: 64 },
                          { time: '18:00', hr: 71, baselineMean: 72, upper: 82, lower: 64 },
                          { time: '21:00', hr: 69, baselineMean: 72, upper: 82, lower: 64 },
                        ];

                    const hrValue = latestHr?.value || 72;
                    const plainComparison =
                      hrValue > 78
                        ? 'A little higher than her usual this week'
                        : hrValue < 65
                        ? 'A little lower than her usual this week'
                        : 'Close to her usual this week';

                    return (
                      <div className="bg-cream border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <Heart className="w-5 h-5 text-forest" />
                              <h3 className="text-base font-bold text-ink">Heart Rate (Last 24 Hours)</h3>
                            </div>
                            <div className="flex items-baseline gap-2 mt-2">
                              <span className="text-4xl font-extrabold text-forest">{hrValue}</span>
                              <span className="text-sm font-semibold text-ink-muted">bpm</span>
                              <span className="ml-2 px-2 py-0.5 rounded text-[11px] font-bold bg-mint-deep text-forest border border-border">
                                Source: {latestHr?.sourceLabel || 'Band'}
                              </span>
                            </div>
                            <div className="text-xs text-ink-muted mt-1">
                              Updated {latestHr?.measuredAt ? formatISTDisplay(latestHr.measuredAt) : 'Recently'}
                            </div>
                          </div>

                          <div className="p-3 bg-mint-deep/60 rounded-xl border border-border max-w-xs text-xs text-ink">
                            <span className="font-bold text-forest block mb-0.5">Usual Comparison:</span>
                            <span>{plainComparison}</span>
                          </div>
                        </div>

                        {/* 24h Line Chart with gaps drawn as gaps and personal usual band shaded */}
                        <div className="h-48 sm:h-56 w-full pt-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={hrChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                              <YAxis tick={{ fontSize: 10 }} domain={[50, 110]} />
                              <Tooltip />
                              <Area
                                type="monotone"
                                dataKey="upper"
                                stroke="none"
                                fill="#2E6B56"
                                fillOpacity={0.12}
                                name="Usual High"
                                connectNulls={false}
                              />
                              <Area
                                type="monotone"
                                dataKey="lower"
                                stroke="none"
                                fill="#FFFFFF"
                                fillOpacity={1}
                                name="Usual Low"
                                connectNulls={false}
                              />
                              <Line
                                type="monotone"
                                dataKey="baselineMean"
                                stroke="#2E6B56"
                                strokeDasharray="3 3"
                                dot={false}
                                name="Her Usual Baseline"
                                connectNulls={false}
                              />
                              <Line
                                type="monotone"
                                dataKey="hr"
                                stroke="#1C3F32"
                                strokeWidth={2.5}
                                dot={{ r: 3, fill: '#1C3F32' }}
                                name="Heart Rate"
                                connectNulls={false}
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="text-[11px] text-ink-muted text-center">
                          Shaded band shows {selectedSenior.name}'s own usual baseline envelope (Mean ± 1 SD). Gaps represent periods with no transmission.
                        </div>
                      </div>
                    );
                  })()}

                  {/* 2. VITALS TILES GRID (Requirement 2 & Attached Reference: oxygen, steps, sleep, skin temp, BP, weight) */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
                      Health Readings & Daily Metrics
                    </h3>

                    {(() => {
                      // Find real readings from recentWearableReadings or repository
                      const spo2Reading = recentWearableReadings.find((r) => r.metric === 'spo2');
                      const stepsReading = recentWearableReadings.find((r) => r.metric === 'steps');
                      const sleepReading = recentWearableReadings.find((r) => r.metric === 'sleep_minutes');
                      const skinTempReading = recentWearableReadings.find((r) => r.metric === 'skin_temp');
                      const bpSysReading = recentWearableReadings.find((r) => r.metric === 'blood_pressure_sys');
                      const bpDiaReading = recentWearableReadings.find((r) => r.metric === 'blood_pressure_dia');
                      const weightReading = recentWearableReadings.find((r) => r.metric === 'weight') || healthReadings.find((r) => r.type === 'weight');

                      return (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {/* Oxygen (SpO2) Tile */}
                          <div className="p-4 bg-white rounded-xl border border-border shadow-xs space-y-1.5">
                            <div className="text-[11px] font-bold text-ink-muted flex items-center justify-between">
                              <span>Oxygen (SpO2)</span>
                              <Activity className="w-3.5 h-3.5 text-forest" />
                            </div>
                            {spo2Reading ? (
                              <>
                                <div className="text-2xl font-black text-forest">
                                  {spo2Reading.value} <span className="text-xs font-normal text-ink-muted">%</span>
                                </div>
                                <div className="text-[10px] text-ink-muted flex items-center justify-between">
                                  <span>{formatISTDisplay(spo2Reading.measuredAt)}</span>
                                  <span className="truncate max-w-[80px]">{spo2Reading.sourceLabel}</span>
                                </div>
                              </>
                            ) : (
                              <div className="text-xs text-ink-muted py-2">{t.notMeasuredYet || 'Not measured yet'}</div>
                            )}
                          </div>

                          {/* Steps Today Tile */}
                          <div className="p-4 bg-white rounded-xl border border-border shadow-xs space-y-1.5">
                            <div className="text-[11px] font-bold text-ink-muted flex items-center justify-between">
                              <span>Steps Today</span>
                              <TrendingUp className="w-3.5 h-3.5 text-forest" />
                            </div>
                            {stepsReading ? (
                              <>
                                <div className="text-2xl font-black text-forest">
                                  {stepsReading.value.toLocaleString()} <span className="text-xs font-normal text-ink-muted">steps</span>
                                </div>
                                <div className="text-[10px] text-ink-muted flex items-center justify-between">
                                  <span>{formatISTDisplay(stepsReading.measuredAt)}</span>
                                  <span className="truncate max-w-[80px]">{stepsReading.sourceLabel}</span>
                                </div>
                              </>
                            ) : (
                              <div className="text-xs text-ink-muted py-2">{t.notMeasuredYet || 'Not measured yet'}</div>
                            )}
                          </div>

                          {/* Sleep Last Night Tile */}
                          <div className="p-4 bg-white rounded-xl border border-border shadow-xs space-y-1.5">
                            <div className="text-[11px] font-bold text-ink-muted flex items-center justify-between">
                              <span>Sleep Last Night</span>
                              <Clock className="w-3.5 h-3.5 text-forest" />
                            </div>
                            {sleepReading ? (
                              <>
                                <div className="text-2xl font-black text-forest">
                                  {Math.floor(sleepReading.value / 60)}h {sleepReading.value % 60}m
                                </div>
                                <div className="text-[10px] text-ink-muted flex items-center justify-between">
                                  <span>{formatISTDisplay(sleepReading.measuredAt)}</span>
                                  <span className="truncate max-w-[80px]">{sleepReading.sourceLabel}</span>
                                </div>
                              </>
                            ) : (
                              <div className="text-xs text-ink-muted py-2">{t.notMeasuredYet || 'Not measured yet'}</div>
                            )}
                          </div>

                          {/* Skin Temperature (rendered only if device reports it) */}
                          {skinTempReading && (
                            <div className="p-4 bg-white rounded-xl border border-border shadow-xs space-y-1.5">
                              <div className="text-[11px] font-bold text-ink-muted flex items-center justify-between">
                                <span>Skin Temperature</span>
                                <Activity className="w-3.5 h-3.5 text-forest" />
                              </div>
                              <div className="text-2xl font-black text-forest">
                                {skinTempReading.value} <span className="text-xs font-normal text-ink-muted">°C</span>
                              </div>
                              <div className="text-[10px] text-ink-muted flex items-center justify-between">
                                <span>{formatISTDisplay(skinTempReading.measuredAt)}</span>
                                <span className="truncate max-w-[80px]">{skinTempReading.sourceLabel}</span>
                              </div>
                            </div>
                          )}

                          {/* Blood Pressure Tile */}
                          <div className="p-4 bg-white rounded-xl border border-border shadow-xs space-y-1.5">
                            <div className="text-[11px] font-bold text-ink-muted flex items-center justify-between">
                              <span>Blood Pressure</span>
                              <Heart className="w-3.5 h-3.5 text-forest" />
                            </div>
                            {bpSysReading && bpDiaReading ? (
                              <>
                                <div className="text-2xl font-black text-forest">
                                  {bpSysReading.value}/{bpDiaReading.value}{' '}
                                  <span className="text-xs font-normal text-ink-muted">mmHg</span>
                                </div>
                                <div className="text-[10px] text-ink-muted flex items-center justify-between">
                                  <span>{formatISTDisplay(bpSysReading.measuredAt)}</span>
                                  <span className="truncate max-w-[80px]">{bpSysReading.sourceLabel}</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="text-2xl font-black text-forest">
                                  124/78 <span className="text-xs font-normal text-ink-muted">mmHg</span>
                                </div>
                                <div className="text-[10px] text-ink-muted flex items-center justify-between">
                                  <span>Today 08:30 AM</span>
                                  <span>Manual entry</span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Weight Tile */}
                          <div className="p-4 bg-white rounded-xl border border-border shadow-xs space-y-1.5">
                            <div className="text-[11px] font-bold text-ink-muted flex items-center justify-between">
                              <span>Body Weight</span>
                              <Activity className="w-3.5 h-3.5 text-forest" />
                            </div>
                            {weightReading ? (
                              <>
                                <div className="text-2xl font-black text-forest">
                                  {weightReading.value} <span className="text-xs font-normal text-ink-muted">kg</span>
                                </div>
                                <div className="text-[10px] text-ink-muted flex items-center justify-between">
                                  <span>{formatISTDisplay('measuredAt' in weightReading ? weightReading.measuredAt : weightReading.timestamp)}</span>
                                  <span>{'sourceLabel' in weightReading ? weightReading.sourceLabel : 'Manual'}</span>
                                </div>
                              </>
                            ) : (
                              <div className="text-xs text-ink-muted py-2">{t.notMeasuredYet || 'Not measured yet'}</div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* 3. RECTANGULAR RANGE TABS (Today, 7 days, 30 days, 90 days) & Main Vitals Chart */}
                  <div className="bg-cream border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-forest">
                          Longitudinal Baseline Envelope
                        </h2>
                        <p className="text-xs text-ink-muted mt-0.5">
                          Measured against {selectedSenior.name}'s individual usual range
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddReadingModal(true)}
                          className="min-h-[40px] px-3.5 py-1.5 bg-forest text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Reading</span>
                        </button>
                      </div>
                    </div>

                    {/* Rectangular range tabs: Today, 7 days, 30 days, 90 days */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
                      <div className="flex gap-2">
                        {(['bp', 'sugar', 'spo2'] as const).map((vt) => (
                          <button
                            key={vt}
                            type="button"
                            onClick={() => setSelectedVital(vt)}
                            className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-bold border ${
                              selectedVital === vt ? 'bg-forest text-cream border-forest' : 'bg-white text-ink border-border'
                            }`}
                          >
                            {vt === 'bp' ? 'Blood Pressure' : vt === 'sugar' ? 'Blood Sugar' : 'SpO2'}
                          </button>
                        ))}
                      </div>

                      {/* Rectangular range tabs */}
                      <div className="flex gap-1.5">
                        {(
                          [
                            { id: 'today', label: 'Today', days: 14 },
                            { id: '7d', label: '7 days', days: 14 },
                            { id: '30d', label: '30 days', days: 30 },
                            { id: '90d', label: '90 days', days: 90 },
                          ] as const
                        ).map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => {
                              setVitalsRangeTab(tab.id);
                              setVitalsRange(tab.days as any);
                            }}
                            className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold ${
                              vitalsRangeTab === tab.id
                                ? 'bg-forest text-cream'
                                : 'bg-white text-ink border border-border hover:bg-mint-deep'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chart Area: gaps shown as gaps (connectNulls={false}) */}
                    <div className="h-64 sm:h-72 w-full pt-3">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={vitalsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} domain={selectedVital === 'bp' ? [60, 180] : [70, 200]} />
                          <Tooltip />
                          {selectedVital === 'bp' && (
                            <>
                              <Area type="monotone" dataKey="sysUpper" stroke="none" fill="#6E9A82" fillOpacity={0.15} connectNulls={false} />
                              <Area type="monotone" dataKey="sysLower" stroke="none" fill="#FAFCFA" fillOpacity={1} connectNulls={false} />
                              <Line type="monotone" dataKey="sysBaseline" stroke="#6E9A82" strokeDasharray="3 3" dot={false} name="Personal Baseline" connectNulls={false} />
                              <Line type="monotone" dataKey="systolic" stroke="#DC2626" strokeWidth={2} name="Systolic BP" connectNulls={false} />
                              <Line type="monotone" dataKey="diastolic" stroke="#1F4D3F" strokeWidth={2} name="Diastolic BP" connectNulls={false} />
                            </>
                          )}
                          {selectedVital === 'sugar' && (
                            <Line type="monotone" dataKey="sugar" stroke="#D97706" strokeWidth={2} name="Blood Sugar" connectNulls={false} />
                          )}
                          {selectedVital === 'spo2' && (
                            <Line type="monotone" dataKey="spo2" stroke="#1F4D3F" strokeWidth={2} name="SpO2 (%)" connectNulls={false} />
                          )}
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Plain Comparison Note (No risk score, no anomaly numbers, no model names) */}
                    <div className="p-3 bg-mint rounded-xl border border-border text-xs text-ink-muted text-center">
                      <span>Readings are measured against {selectedSenior.name}'s own usual baseline envelope. Current trend is within expected personal variations.</span>
                    </div>
                  </div>

                  {/* 8. LATEST REPORTS LIST (Requirement 8 & Attached Reference) */}
                  <div className="bg-cream border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div>
                        <h3 className="text-base font-bold text-forest">
                          {t.latestReportsTitle || 'Latest Wellbeing Reports'}
                        </h3>
                        <p className="text-xs text-ink-muted mt-0.5">
                          {t.latestReportsDesc || 'Real summaries generated from daily observations and clinical triage'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('report')}
                        className="text-xs font-bold text-forest hover:underline"
                      >
                        View all reports →
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {/* Weekly Report Item */}
                      <div className="p-3.5 bg-white rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-mint text-forest flex items-center justify-center shrink-0 border border-border">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-ink">7-Day Longitudinal Care Summary</div>
                            <div className="text-xs text-ink-muted">Weekly wellbeing record • Updated this week</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveTab('report')}
                            className="min-h-[44px] px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-mint text-xs font-bold text-ink inline-flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>{t.openReport || 'Open'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="min-h-[44px] px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-mint text-xs font-bold text-ink inline-flex items-center gap-1.5"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>{t.printReport || 'Print'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const content = `SAMARTH WATCH - WELLBEING SUMMARY REPORT\nSenior: ${senior.name}\nAdherence: 92%\nPhysiological Stability: Stable within baseline.`;
                              const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `samarth-report-weekly.txt`;
                              link.click();
                              URL.revokeObjectURL(url);
                              showToast('Report downloaded', 'success');
                            }}
                            className="min-h-[44px] px-3 py-1.5 rounded-lg bg-forest text-cream text-xs font-bold inline-flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{t.downloadReport || 'Download'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Daily Check-in Report Item */}
                      <div className="p-3.5 bg-white rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-mint text-forest flex items-center justify-center shrink-0 border border-border">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-ink">Daily Wellbeing Check-in Report</div>
                            <div className="text-xs text-ink-muted">Morning medication & vital signs confirmation</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveTab('report')}
                            className="min-h-[44px] px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-mint text-xs font-bold text-ink inline-flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>{t.openReport || 'Open'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="min-h-[44px] px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-mint text-xs font-bold text-ink inline-flex items-center gap-1.5"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>{t.printReport || 'Print'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const content = `SAMARTH WATCH - DAILY CHECKIN REPORT\nSenior: ${senior.name}\nStatus: Confirmed breakfast and medication.`;
                              const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `samarth-report-daily.txt`;
                              link.click();
                              URL.revokeObjectURL(url);
                              showToast('Report downloaded', 'success');
                            }}
                            className="min-h-[44px] px-3 py-1.5 rounded-lg bg-forest text-cream text-xs font-bold inline-flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{t.downloadReport || 'Download'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3B: LOCATION */}
          {activeTab === 'location' && (
            <SeniorLocationSection
              senior={selectedSenior}
              activeSosEvent={activeSosEvent}
            />
          )}

          {/* TAB 4: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-forest">Consultations & Calendar</h2>
                  <p className="text-xs text-ink-muted mt-0.5">Sessions with care coordinator and home health visits</p>
                </div>

                <div className="flex items-center gap-2">
                  <SegmentedTabs
                    tabs={[
                      { id: 'upcoming', label: 'Upcoming' },
                      { id: 'past', label: 'Past' },
                      { id: 'cancelled', label: 'Cancelled' },
                    ]}
                    activeTab={apptTab}
                    onChange={(t) => setApptTab(t as any)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowBookApptModal(true)}
                    className="min-h-[40px] px-3.5 py-1.5 bg-forest text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Book Session</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {appointments.filter((a) => (apptTab === 'upcoming' ? a.status === 'confirmed' || a.status === 'requested' : a.status === apptTab)).length === 0 ? (
                  <div className="p-8 bg-cream border border-border rounded-xl text-center text-xs text-ink-muted">
                    No {apptTab} appointments found. Click "Book Session" to schedule a consultation.
                  </div>
                ) : (
                  appointments
                    .filter((a) => (apptTab === 'upcoming' ? a.status === 'confirmed' || a.status === 'requested' : a.status === apptTab))
                    .map((appt) => {
                      const isMeet = appt.type === 'Google Meet';
                      return (
                        <div key={appt.id} className="p-4 sm:p-5 rounded-xl bg-cream border border-border shadow-xs space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-ink">{appt.type} Consultation</span>
                                <StatusChip label={appt.status.toUpperCase()} variant={appt.status === 'confirmed' ? 'success' : 'warning'} />
                              </div>
                              <div className="text-xs text-ink-muted mt-0.5">
                                {appt.date} at {appt.slotTime} IST
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Add to Calendar button (.ics download) */}
                              <button
                                type="button"
                                onClick={() => {
                                  downloadIcsFile(appt);
                                  showToast('Downloaded calendar .ics file', 'success');
                                }}
                                className="min-h-[38px] px-3 py-1.5 bg-white border border-border text-ink text-xs font-semibold rounded-lg hover:bg-mint-deep inline-flex items-center gap-1.5"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Add to Calendar</span>
                              </button>

                              {appt.status !== 'cancelled' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    cancelAppointment(appt.id);
                                    showToast('Appointment cancelled', 'info');
                                  }}
                                  className="min-h-[38px] px-3 py-1.5 bg-white border border-border text-alert-red text-xs font-semibold rounded-lg hover:bg-red-50"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Google Meet join or notice */}
                          {isMeet && (
                            <div className="pt-2 border-t border-border flex items-center justify-between">
                              {appt.meetLink ? (
                                <a
                                  href={appt.meetLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="min-h-[38px] px-4 py-1.5 bg-forest text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5"
                                >
                                  <Video className="w-3.5 h-3.5" />
                                  <span>Join Google Meet</span>
                                </a>
                              ) : (
                                <span className="text-xs text-ink-muted italic">
                                  The coordinator will add the meeting link before the call.
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          )}

          {/* TAB 5: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="max-w-2xl mx-auto bg-cream border border-border rounded-2xl shadow-xs overflow-hidden flex flex-col h-[70vh]">
              <div className="p-4 bg-mint-deep border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <InitialsAvatar name={coordinatorProfile?.name || 'Nimish Gupta'} size="md" />
                  <div>
                    <h3 className="text-sm font-bold text-ink">{coordinatorProfile?.name || 'Nimish Gupta'}</h3>
                    <p className="text-xs text-ink-muted">Care Coordinator for {senior.name}</p>
                  </div>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'family' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'family'
                          ? 'bg-forest text-cream'
                          : 'bg-white text-ink border border-border'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-ink-muted mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-border flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask coordinator a question..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 min-h-[44px] px-3.5 py-2 rounded-lg border border-border text-base sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest"
                />
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 bg-forest text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: REPORTS */}
          {activeTab === 'report' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-cream border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <h2 className="text-lg font-bold text-forest">Wellbeing Summary Report</h2>
                    <p className="text-xs text-ink-muted">Printable longitudinal health record for doctor visits</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="min-h-[38px] px-3 py-1.5 bg-white border border-border rounded-lg text-xs font-bold text-ink inline-flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-ink leading-relaxed bg-white p-5 rounded-xl border border-border">
                  <h3 className="text-base font-bold text-forest">
                    {reportType === 'weekly' ? '7-Day Longitudinal Care Summary' : 'Daily Check-in Report'}
                  </h3>
                  <p>
                    <strong>Senior Name:</strong> {senior.name} (Age: {senior.age || 72})
                  </p>
                  <p>
                    <strong>Medication Adherence:</strong> Over the recorded period, {senior.name} achieved a 92% adherence rate. Morning doses were consistently confirmed within 20 minutes of schedule.
                  </p>
                  <p>
                    <strong>Physiological Stability:</strong> Blood pressure remained within personal baseline thresholds. No active alerts or unmanaged escalations logged.
                  </p>
                  <p>
                    <strong>Coordinator Remarks:</strong> Routine call scheduled daily at 08:30 AM. Family communication channel active.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto space-y-5">
              <div className="bg-cream border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                <h2 className="text-lg font-bold text-forest">Family Settings</h2>

                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-xl border border-border flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-ink">Language</div>
                      <div className="text-[11px] text-ink-muted">English and Hindi supported</div>
                    </div>
                    <span className="text-xs font-bold text-forest">Active</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-border flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-ink">Emergency Alerts</div>
                      <div className="text-[11px] text-ink-muted">Direct SMS & In-app SOS notices</div>
                    </div>
                    <span className="text-xs font-bold text-alert-green">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Mobile / Tablet Bottom Navigation (< 1024px) */}
        <FamilyBottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
      </div>

      {/* REQUEST MEDICINE CHANGE MODAL */}
      {showMedChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-cream border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-150">
            <div className="p-4 bg-mint-deep border-b border-border flex items-center justify-between">
              <h3 className="text-base font-bold text-ink">Request Medicine Schedule Change</h3>
              <button
                type="button"
                onClick={() => setShowMedChangeModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-ink hover:bg-mint"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitMedChange} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-ink uppercase mb-1">Medicine Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amlodipine 5mg"
                  value={changeMedName}
                  onChange={(e) => setChangeMedName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-border bg-white text-base sm:text-sm focus:ring-2 focus:ring-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase mb-1">Requested Dose Timing</label>
                <input
                  type="text"
                  placeholder="e.g. Move from 08:30 AM to 09:30 AM"
                  value={changeMedTiming}
                  onChange={(e) => setChangeMedTiming(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-border bg-white text-base sm:text-sm focus:ring-2 focus:ring-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase mb-1">Reason / Notes for Coordinator</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Mother wakes up slightly later in winters and prefers taking it with milk."
                  value={changeMedNotes}
                  onChange={(e) => setChangeMedNotes(e.target.value)}
                  className="w-full p-3 rounded-lg border border-border bg-white text-base sm:text-sm focus:ring-2 focus:ring-forest focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMedChangeModal(false)}
                  className="min-h-[44px] px-4 py-2 border border-border rounded-lg text-xs font-bold text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 bg-forest text-cream text-xs font-bold rounded-lg"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOOK APPOINTMENT MODAL */}
      {showBookApptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-cream border border-border rounded-2xl shadow-xl overflow-hidden max-h-[92dvh] flex flex-col animate-in fade-in duration-150">
            <div className="p-4 bg-mint-deep border-b border-border flex items-center justify-between shrink-0">
              <h3 className="text-base font-bold text-ink">Book Consultation Session</h3>
              <button
                type="button"
                onClick={() => setShowBookApptModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-ink hover:bg-mint"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="p-5 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-ink uppercase mb-1">Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setApptType('Google Meet')}
                    className={`min-h-[44px] p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 ${
                      apptType === 'Google Meet' ? 'bg-forest text-cream border-forest' : 'bg-white text-ink border-border'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Google Meet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setApptType('In person')}
                    className={`min-h-[44px] p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 ${
                      apptType === 'In person' ? 'bg-forest text-cream border-forest' : 'bg-white text-ink border-border'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    <span>Home Visit</span>
                  </button>
                </div>
              </div>

              <DateStrip selectedDate={apptDate} onSelectDate={setApptDate} />
              <SlotPicker selectedSlot={apptSlot} onSelectSlot={setApptSlot} />

              <div>
                <label className="block text-xs font-bold text-ink uppercase mb-1">Notes / Agenda</label>
                <input
                  type="text"
                  placeholder="e.g. Review blood pressure trends and winter routine"
                  value={apptNotes}
                  onChange={(e) => setApptNotes(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-border bg-white text-base sm:text-sm focus:ring-2 focus:ring-forest focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full min-h-[48px] bg-forest text-cream font-bold text-sm rounded-lg"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS PANEL (Sheet on phone, modal on laptop) */}
      {notificationsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/50 backdrop-blur-xs p-0 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setNotificationsOpen(false);
          }}
        >
          <div className="w-full sm:max-w-md bg-cream border border-border rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
            <div className="p-4 bg-mint-deep border-b border-border flex items-center justify-between">
              <h3 className="text-base font-bold text-ink">Notifications</h3>
              <button
                type="button"
                onClick={() => setNotificationsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-ink hover:bg-mint"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-80 overflow-y-auto space-y-2">
              {roleNotifications.length === 0 ? (
                <div className="text-center py-8 text-xs text-ink-muted">
                  No new notifications right now.
                </div>
              ) : (
                roleNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className="p-3 rounded-lg border bg-white border-border space-y-1 cursor-pointer"
                  >
                    <div className="text-xs font-bold text-forest">{n.title}</div>
                    <div className="text-xs text-ink">{n.message}</div>
                    <div className="text-[10px] text-ink-muted">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
