import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Senior, UserRole } from '../types';
import {
  MedicineDose,
  MedicineScheduleChangeRequest,
  SOSEvent,
  Appointment,
  AppNotification,
  HealthReadingEntry,
  SeniorVoiceNote,
} from '../types/shared';
import { SupportedLanguage, getTranslation, TranslationDictionary } from '../i18n';
import { repository } from '../data/repository';
import { SeniorRecord, Medicine, User } from '../data/schema';
import { callService, CallResult } from '../utils/callService';
import { voiceNoteSummarizer } from '../utils/voiceNoteSummarizer';
import { demoWearableSimulator, WearableReading, WearableScenario } from '../utils/wearableProvider';
import { getCurrentLocation, getLastKnownOrHome } from '../utils/locationService';

/** Reads the current user's role from the auth session (sessionStorage). */
function getRoleFromSession(): UserRole | 'senior' {
  try {
    const raw = sessionStorage.getItem('samarth_auth_session');
    if (raw) {
      const u = JSON.parse(raw);
      if (u && u.role) return u.role as UserRole | 'senior';
    }
  } catch {
    // ignore
  }
  // Fallback: read from localStorage (legacy key)
  const saved = localStorage.getItem('samarth_user_role');
  return (saved as UserRole | 'senior') || 'coordinator';
}

export interface CoordinatorProfileData {
  name: string;
  phone: string;
}

export interface SeniorProfileData {
  age?: number;
  city: string;
  address: string;
  livingSituation: string;
  languagePreference: 'hi' | 'en';
  emergencyContactName: string;
  emergencyContactPhone: string;
  doctor: string;
}

interface AppContextType {
  // Role & Senior Selection
  role: UserRole | 'senior';
  setRole: (role: UserRole | 'senior') => void;
  currentSeniorId: string;
  setCurrentSeniorId: (id: string) => void;
  seniors: Senior[];
  selectedSenior: Senior;

  // Language & Translations
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationDictionary;

  // Accessibility (Elderly settings)
  largerText: boolean;
  setLargerText: (val: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  seniorLanguageChosen: boolean;
  setSeniorLanguageChosen: (val: boolean) => void;

  // Demo Controls
  demoSpeedFast: boolean;
  setDemoSpeedFast: (val: boolean) => void;
  virtualTime: number; // epoch ms

  // Actions & Alerts
  handleAlertAction: (id: string, action: 'done' | 'snoozed' | 'pending') => void;
  handleFeedback: (id: string, feedback: 'useful' | 'not_useful') => void;
  toggleConsent: (id: string, consent: boolean) => void;
  toggleDetailedVitalsConsent: (id: string, allow: boolean) => void;
  detailedVitalsConsent: boolean;
  feedbackStats: { useful: number; notUseful: number };
  precisionRate: number;
  resetDemoData: () => void;

  // Medicine & Dose Escalations
  medicines: Medicine[];
  doses: MedicineDose[];
  dueDoseNow: MedicineDose | null;
  takeDoseSenior: (doseId: string) => void;
  snoozeDoseSenior: (doseId: string) => void;
  confirmDoseFamily: (doseId: string) => void;
  medicineChangeRequests: MedicineScheduleChangeRequest[];
  requestMedicineChange: (medicineName: string, timing: string, notes: string) => void;
  approveMedicineChange: (requestId: string) => void;
  rejectMedicineChange: (requestId: string) => void;

  // SOS & Emergency
  sosEvents: SOSEvent[];
  activeSosEvent: SOSEvent | null;
  triggerSeniorSOS: () => void;
  resolveSosEvent: (eventId: string, notes?: string) => void;
  sosCallResults: CallResult[];

  // Appointments
  appointments: Appointment[];
  requestAppointment: (
    type: 'In person' | 'Google Meet',
    date: string,
    slotTime: string,
    homeAddress?: string,
    notes?: string,
    requestedBy?: 'senior' | 'family'
  ) => Appointment;
  confirmAppointmentByCoordinator: (appointmentId: string, meetLink?: string) => void;
  rescheduleAppointment: (appointmentId: string, newDate: string, newSlot: string) => void;
  cancelAppointment: (appointmentId: string) => void;

  // Health Readings
  healthReadings: HealthReadingEntry[];
  addHealthReading: (
    type: 'bp' | 'sugar' | 'spo2' | 'weight' | 'pulse',
    value: number,
    valueSecondary?: number,
    addedBy?: 'senior' | 'family' | 'coordinator'
  ) => void;

  // Voice Notes & Checkins
  voiceNotes: SeniorVoiceNote[];
  addSeniorVoiceNote: (durationSec: number, audioBlobUrl: string | null) => Promise<void>;
  todayCheckinAnswer: { q1?: number; q2?: number; q3?: number; q4?: number } | null;
  saveCheckinAnswers: (answers: { q1: number; q2: number; q3: number; q4: number }) => void;

  // Notification Center
  notifications: AppNotification[];
  roleNotifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  clearNotificationsForRole: () => void;

  // SOS Cancel
  cancelSOS: (eventId: string) => void;

  // Wearable
  wearableConnected: boolean;
  wearableReadings: WearableReading[];
  connectWearable: () => Promise<void>;
  disconnectWearable: () => void;
  injectWearableScenario: (scenario: WearableScenario) => void;

  // Coordinator Tools (Step 2)
  coordinatorProfile: User | undefined;
  updateCoordinatorProfile: (data: CoordinatorProfileData) => void;
  updateSeniorProfile: (data: Partial<SeniorProfileData>) => void;
  addMedicine: (name: string, instructions: string, scheduledTimes: string[]) => Medicine;
  updateMedicine: (id: string, updates: Partial<Medicine>) => Medicine;
  removeMedicine: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sync version tracking
  const [repoRevision, setRepoRevision] = useState(0);

  useEffect(() => {
    return repository.subscribe(() => {
      setRepoRevision((v) => v + 1);
    });
  }, []);

  // 1. Roles & Active Senior
  // Always derive role from the auth session first so coordinator/senior/family land correctly.
  const [role, setRoleState] = useState<UserRole | 'senior'>(() => getRoleFromSession());

  const [currentSeniorId, setCurrentSeniorIdState] = useState<string>(() => {
    const saved = localStorage.getItem('samarth_focus_senior_id');
    return saved || 'senior-kamla-001';
  });

  // Pull seniors from clean repository
  const rawSeniors = useMemo(() => {
    return repository.getState().seniors;
  }, [repoRevision]);

  // Map to Senior type
  const seniors: Senior[] = useMemo(() => {
    return rawSeniors.map((s) => ({
      id: s.id,
      name: s.name,
      phone: s.phone,
      age: s.age,
      city: s.city || 'Not added yet',
      address: s.address || 'Not added yet',
      doctor: s.doctor || 'Not added yet',
      languagePreference: s.languagePreference || 'hi',
      area: s.city || 'Not added yet',
      livingSituation: (s.livingSituation as any) || 'Not added yet',
      emergencyContactName: s.emergencyContactName || 'Not added yet',
      emergencyContactPhone: s.emergencyContactPhone || 'Not added yet',
      emergencyContactRelation: 'Guardian',
      assignedCoordinatorId: s.assignedCoordinatorId,
      assignedCoordinatorName: s.assignedCoordinatorName,
      familyConsentGranted: s.familyConsentGranted,
      detailedVitalsConsent: s.detailedVitalsConsent,
      linkedFamilyIds: s.linkedFamilyIds,
      linkedFamilyName: s.linkedFamilyName,
      linkedFamilyPhone: s.linkedFamilyPhone,
      linkedFamilyRelation: 'Family member',
      currentUrgency: s.currentUrgency,
      currentRiskScore: s.currentRiskScore,
      alertStatus: s.alertStatus,
      activeSignals: s.activeSignals as any,
      topReasons: s.topReasons,
      primaryContext: s.primaryContext,
      history90Days: [],
      trend14Days: [],
      scoreBreakdown: {
        vitalsDeviation: 0,
        medicationAdherence: 0,
        nlpCallCues: 0,
        silencePattern: 0,
        trendAcceleration: 0,
      },
      recommendedAction: 'Call today',
      recommendedScript: {
        hindi: `नमस्ते ${s.name} जी! आशा है आप कुशल हैं। बस यह जानने के लिए फोन किया कि आपकी तबीयत कैसी है और क्या आपने समय पर नाश्ता और दवाइयाँ लीं?`,
        english: `Good day ${s.name}! Calling to check in on how you are feeling and confirm if your morning routine and medicines are going smoothly.`,
      },
    }));
  }, [rawSeniors]);

  const selectedSenior = useMemo(() => {
    // Defensive: seniors list should never be empty (seed data always has Kamla),
    // but guard against corrupted localStorage by falling back to a safe stub.
    const found = seniors.find((s) => s.id === currentSeniorId) || seniors[0];
    if (!found) {
      // Return a safe stub so downstream code never throws on .id/.name
      return {
        id: 'senior-kamla-001',
        name: 'Kamla',
        phone: '',
        age: undefined,
        city: 'Not added yet',
        address: 'Not added yet',
        doctor: 'Not added yet',
        languagePreference: 'hi' as const,
        area: 'Not added yet',
        livingSituation: 'Not added yet',
        emergencyContactName: 'Not added yet',
        emergencyContactPhone: 'Not added yet',
        emergencyContactRelation: 'Guardian',
        assignedCoordinatorId: 'user-coordinator-nimish',
        assignedCoordinatorName: 'Nimish Gupta',
        familyConsentGranted: true,
        detailedVitalsConsent: false,
        linkedFamilyIds: ['user-family-karishma'],
        linkedFamilyName: 'Karishma',
        linkedFamilyPhone: '8765789433',
        linkedFamilyRelation: 'Family member',
        currentUrgency: 'low' as const,
        currentRiskScore: 0,
        alertStatus: 'done' as const,
        activeSignals: [] as any,
        topReasons: [],
        primaryContext: '',
        history90Days: [],
        trend14Days: [],
        scoreBreakdown: { vitalsDeviation: 0, medicationAdherence: 0, nlpCallCues: 0, silencePattern: 0, trendAcceleration: 0 },
        recommendedAction: 'Call today',
        recommendedScript: { hindi: '', english: '' },
      } as any;
    }
    return found;
  }, [seniors, currentSeniorId]);

  // 2. Language & Accessibility
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('samarth_preferred_language');
    return (saved as SupportedLanguage) || 'en';
  });

  const [seniorLanguageChosen, setSeniorLanguageChosenState] = useState<boolean>(() => {
    return localStorage.getItem('samarth_senior_lang_chosen') === 'true';
  });

  const [largerText, setLargerTextState] = useState<boolean>(() => {
    return localStorage.getItem('samarth_larger_text') === 'true';
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem('samarth_high_contrast') === 'true';
  });

  // 3. Demo Speed & Virtual Time
  const [demoSpeedFast, setDemoSpeedFast] = useState<boolean>(false);
  const [virtualTime, setVirtualTime] = useState<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setVirtualTime((prev) => (demoSpeedFast ? prev + 60000 : Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [demoSpeedFast]);

  // 4. Feedback stats & detailed vitals consent
  const [feedbackStats, setFeedbackStats] = useState<{ useful: number; notUseful: number }>({ useful: 0, notUseful: 0 });

  const detailedVitalsConsent = Boolean(selectedSenior?.detailedVitalsConsent);

  // 5. Medicines & Doses (starts EMPTY, backed by repository)
  const medicines = useMemo(() => {
    return repository.getMedicines(selectedSenior.id);
  }, [selectedSenior.id, repoRevision]);

  const doses: MedicineDose[] = useMemo(() => {
    return repository.getDoses(selectedSenior.id).map((d) => ({
      id: d.id,
      medicineName: d.medicineName,
      dosageInstructions: d.dosageInstructions,
      scheduledTime: d.scheduledTime,
      scheduledTimestamp: d.scheduledTimestamp,
      status: d.status as any,
      confirmedBy: d.confirmedBy,
      remindedCount: 0,
    }));
  }, [selectedSenior.id, repoRevision]);

  const dueDoseNow = useMemo(() => {
    return doses.find((d) => d.status === 'pending' || d.status === 'upcoming') || null;
  }, [doses]);

  // 6. SOS Events (starts EMPTY)
  const sosEvents: SOSEvent[] = useMemo(() => {
    return repository.getSosEvents(selectedSenior.id).map((e) => ({
      id: e.id,
      seniorId: e.seniorId,
      seniorName: e.seniorName,
      timestamp: e.timestamp,
      status: e.status as any,
      cancelledBySenior: e.cancelledBySenior,
      cancelledAt: e.cancelledAt,
      location: e.location as any,
      notes: e.notes,
    }));
  }, [selectedSenior.id, repoRevision]);

  const activeSosEvent = useMemo(() => {
    return sosEvents.find((e) => e.status !== 'Resolved') || null;
  }, [sosEvents]);

  const [sosCallResults, setSosCallResults] = useState<CallResult[]>([]);

  // 7. Appointments (starts EMPTY)
  const appointments: Appointment[] = useMemo(() => {
    return repository.getAppointments(selectedSenior.id).map((a) => ({
      id: a.id,
      seniorId: a.seniorId,
      seniorName: selectedSenior.name,
      requestedBy: a.requestedBy as any,
      type: a.type,
      date: a.date,
      slotTime: a.slot,
      homeAddress: a.address,
      meetLink: a.meetLink,
      notes: a.notes,
      status: a.status as any,
      createdTimestamp: a.createdAt,
    }));
  }, [selectedSenior, repoRevision]);

  // 8. Health Readings (starts EMPTY)
  const healthReadings: HealthReadingEntry[] = useMemo(() => {
    return repository.getReadings(selectedSenior.id).map((r) => ({
      id: r.id,
      seniorId: r.seniorId,
      timestamp: r.timestamp,
      addedBy: r.recordedBy,
      type: r.type,
      value: r.value,
      valueSecondary: r.valueSecondary,
      unit: r.unit,
    }));
  }, [selectedSenior.id, repoRevision]);

  // 9. Voice Notes (starts EMPTY)
  const voiceNotes: SeniorVoiceNote[] = useMemo(() => {
    return repository.getVoiceNotes(selectedSenior.id).map((v) => ({
      id: v.id,
      seniorId: v.seniorId,
      timestamp: v.timestamp,
      durationSeconds: v.durationSeconds,
      transcript: v.transcript,
      plainSummary: v.plainSummary,
      extractedCues: v.cueTags.map((tag) => ({ tag, severity: 'mild', quote: '' })),
      audioBlobUrl: v.audioBlobUrl,
      coordinatorId: v.coordinatorId,
      isHighPriority: v.isHighPriority,
    }));
  }, [selectedSenior.id, repoRevision]);

  // 10. Check-ins
  const todayCheckinAnswer = useMemo(() => {
    const list = repository.getCheckIns(selectedSenior.id);
    return list.length > 0 ? list[0].answers : null;
  }, [selectedSenior.id, repoRevision]);

  // 11. Medicine Change Requests (starts EMPTY)
  const medicineChangeRequests: MedicineScheduleChangeRequest[] = useMemo(() => {
    return repository.getChangeRequests(selectedSenior.id).map((r) => ({
      id: r.id,
      seniorId: r.seniorId,
      requestedBy: r.requestedBy,
      requestedTimestamp: r.createdAt,
      medicineName: r.medicineName,
      proposedTiming: r.proposedTiming,
      notes: r.notes,
      status: r.status,
    }));
  }, [selectedSenior.id, repoRevision]);

  // 12. Notifications (starts EMPTY)
  const notifications: AppNotification[] = useMemo(() => {
    return repository.getState().notifications.map((n) => ({
      id: n.id,
      timestamp: n.timestamp,
      recipientUserId: n.recipientUserId,
      targetRole: n.targetRole as any,
      seniorId: selectedSenior.id,
      type: n.type as any,
      title: n.title,
      message: n.message,
      read: n.read,
      actionUrl: n.actionUrl,
      actionLabel: n.actionLabel,
    }));
  }, [selectedSenior.id, repoRevision]);

  // Filter role notifications for active role/session
  const roleNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (role === 'senior') return n.targetRole === 'senior' || n.targetRole === 'all';
      if (role === 'family') return n.targetRole === 'family' || n.targetRole === 'all';
      if (role === 'coordinator') return n.targetRole === 'coordinator' || n.targetRole === 'all';
      return false;
    });
  }, [notifications, role]);

  const unreadNotificationCount = useMemo(() => {
    return roleNotifications.filter((n) => !n.read).length;
  }, [roleNotifications]);

  // 13. Coordinator Profile
  const coordinatorProfile = useMemo(() => {
    return repository.getUserById('user-coordinator-nimish');
  }, [repoRevision]);

  // 14. Wearable simulator
  const [wearableConnected, setWearableConnected] = useState(false);
  const [wearableReadings, setWearableReadings] = useState<WearableReading[]>([]);

  const connectWearable = useCallback(async () => {
    setWearableConnected(true);
  }, []);

  const disconnectWearable = useCallback(() => {
    setWearableConnected(false);
  }, []);

  const injectWearableScenario = useCallback((scenario: WearableScenario) => {
    demoWearableSimulator.injectScenario(scenario);
    const latest = demoWearableSimulator.getLatestReadings();
    setWearableReadings(latest);
  }, []);

  // Translation bundle
  const t = useMemo(() => {
    return getTranslation(language);
  }, [language]);

  // Persistent Setters
  const setRole = (newRole: UserRole | 'senior') => {
    setRoleState(newRole);
    localStorage.setItem('samarth_user_role', newRole);
  };

  const setCurrentSeniorId = (newId: string) => {
    setCurrentSeniorIdState(newId);
    localStorage.setItem('samarth_focus_senior_id', newId);
  };

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    localStorage.setItem('samarth_preferred_language', newLang);
  };

  const setSeniorLanguageChosen = (val: boolean) => {
    setSeniorLanguageChosenState(val);
    localStorage.setItem('samarth_senior_lang_chosen', val ? 'true' : 'false');
  };

  const setLargerText = (val: boolean) => {
    setLargerTextState(val);
    localStorage.setItem('samarth_larger_text', val ? 'true' : 'false');
  };

  const setHighContrast = (val: boolean) => {
    setHighContrastState(val);
    localStorage.setItem('samarth_high_contrast', val ? 'true' : 'false');
  };

  // Actions
  const handleAlertAction = (id: string, action: 'done' | 'snoozed' | 'pending') => {
    repository.updateSenior(id, { alertStatus: action });
  };

  const handleFeedback = (id: string, feedback: 'useful' | 'not_useful') => {
    repository.updateSenior(id, { feedback });
    setFeedbackStats((prev) => ({
      useful: feedback === 'useful' ? prev.useful + 1 : prev.useful,
      notUseful: feedback === 'not_useful' ? prev.notUseful + 1 : prev.notUseful,
    }));
  };

  const toggleConsent = (id: string, consent: boolean) => {
    repository.updateSenior(id, { familyConsentGranted: consent });
  };

  const toggleDetailedVitalsConsent = (id: string, allow: boolean) => {
    repository.updateSenior(id, { detailedVitalsConsent: allow });
  };

  const precisionRate = useMemo(() => {
    const total = feedbackStats.useful + feedbackStats.notUseful;
    if (total === 0) return 92;
    return Math.round((feedbackStats.useful / total) * 100);
  }, [feedbackStats]);

  const resetDemoData = () => {
    repository.resetToSeed();
    setFeedbackStats({ useful: 0, notUseful: 0 });
  };

  // Medicine Actions
  const takeDoseSenior = (doseId: string) => {
    repository.markDoseTaken(doseId, 'senior');
  };

  const snoozeDoseSenior = (doseId: string) => {
    repository.snoozeDose(doseId);
  };

  const confirmDoseFamily = (doseId: string) => {
    repository.markDoseTaken(doseId, 'family');
    // Notify coordinator that family verified dose
    repository.addNotification({
      recipientUserId: selectedSenior.assignedCoordinatorId,
      targetRole: 'coordinator',
      title: 'Medicine Dose Confirmed by Family',
      message: `${selectedSenior.linkedFamilyName} confirmed that ${selectedSenior.name} has taken their scheduled dose.`,
      type: 'medicine_escalation',
      actionUrl: `/coordinator/senior/${selectedSenior.id}`,
      actionLabel: 'View record',
    });
  };

  const requestMedicineChange = (medicineName: string, proposedTiming: string, notes: string) => {
    repository.addChangeRequest({
      seniorId: selectedSenior.id,
      requestedBy: selectedSenior.linkedFamilyName || 'Karishma',
      medicineName,
      proposedTiming,
      notes,
    });
    // Send notification to coordinator
    repository.addNotification({
      recipientUserId: selectedSenior.assignedCoordinatorId,
      targetRole: 'coordinator',
      title: 'Medicine Timing Adjustment Request',
      message: `${selectedSenior.linkedFamilyName} requested a schedule change for ${medicineName}.`,
      type: 'medicine_escalation',
      actionUrl: '/coordinator',
      actionLabel: 'Review request',
    });
  };

  const approveMedicineChange = (requestId: string) => {
    repository.reviewChangeRequest(requestId, 'approved', selectedSenior.assignedCoordinatorName);
    // Notify family
    repository.addNotification({
      recipientUserId: 'user-family-karishma',
      targetRole: 'family',
      title: 'Medicine Timing Change Approved',
      message: `Care Coordinator ${selectedSenior.assignedCoordinatorName} approved the timing update.`,
      type: 'info',
      actionUrl: '/family',
      actionLabel: 'View calendar',
    });
  };

  const rejectMedicineChange = (requestId: string) => {
    repository.reviewChangeRequest(requestId, 'rejected', selectedSenior.assignedCoordinatorName);
    // Notify family
    repository.addNotification({
      recipientUserId: 'user-family-karishma',
      targetRole: 'family',
      title: 'Medicine Timing Request Note',
      message: `Care Coordinator ${selectedSenior.assignedCoordinatorName} reviewed the timing request and will consult the prescribing doctor.`,
      type: 'info',
      actionUrl: '/family',
      actionLabel: 'View details',
    });
  };

  // SOS Actions
  const triggerSeniorSOS = async () => {
    let loc = await getCurrentLocation(8000);
    if (!loc) {
      loc = getLastKnownOrHome(selectedSenior.address || 'Civil Lines');
    }

    const sos = repository.addSosEvent({
      seniorId: selectedSenior.id,
      seniorName: selectedSenior.name,
      location: loc as any,
    });

    // Notify assigned Coordinator ONLY
    repository.addNotification({
      recipientUserId: selectedSenior.assignedCoordinatorId,
      targetRole: 'coordinator',
      title: `Emergency SOS: ${selectedSenior.name}`,
      message: `Help requested by ${selectedSenior.name}. Location: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}. Immediate contact advised.`,
      type: 'sos',
      actionUrl: `/coordinator/senior/${selectedSenior.id}`,
      actionLabel: 'Open triage',
    });

    // Notify linked Family member (Karishma)
    repository.addNotification({
      recipientUserId: 'user-family-karishma',
      targetRole: 'family',
      title: `Emergency SOS Help Alert`,
      message: `${selectedSenior.name} pressed the SOS assistance button. Location shared. Care Coordinator is placing a priority call.`,
      type: 'sos',
      actionUrl: '/family',
      actionLabel: 'View SOS status',
    });

    // Simulate simultaneous call
    const results = await callService.callBoth(
      {
        name: coordinatorProfile?.name || 'Care Coordinator',
        phone: coordinatorProfile?.phone || '',
        role: 'coordinator',
      },
      {
        name: selectedSenior.linkedFamilyName || 'Karishma',
        phone: selectedSenior.linkedFamilyPhone || '8765789433',
        role: 'family',
      }
    );
    setSosCallResults(results);
  };

  const cancelSOS = (eventId: string) => {
    repository.cancelSosEvent(eventId);

    // Notify coordinator of false alarm
    repository.addNotification({
      recipientUserId: selectedSenior.assignedCoordinatorId,
      targetRole: 'coordinator',
      title: `SOS Cancelled by ${selectedSenior.name}`,
      message: `${selectedSenior.name} pressed 'I pressed this by mistake' within 60 seconds. False alarm confirmed.`,
      type: 'sos',
      actionUrl: `/coordinator/senior/${selectedSenior.id}`,
      actionLabel: 'Review log',
    });

    // Notify family of false alarm
    repository.addNotification({
      recipientUserId: 'user-family-karishma',
      targetRole: 'family',
      title: `SOS Alert Cancelled (False Alarm)`,
      message: `${selectedSenior.name} indicated the SOS button was pressed by mistake within 60s.`,
      type: 'sos',
      actionUrl: '/family',
      actionLabel: 'View status',
    });
  };

  const resolveSosEvent = (eventId: string, notes?: string) => {
    repository.resolveSosEvent(eventId, notes);
  };

  // Appointment Actions
  const requestAppointment = (
    type: 'In person' | 'Google Meet',
    date: string,
    slot: string,
    address?: string,
    notes?: string,
    requestedBy: 'senior' | 'family' = 'senior'
  ): Appointment => {
    const record = repository.addAppointment({
      seniorId: selectedSenior.id,
      requestedBy,
      type,
      date,
      slot,
      address,
      notes,
    });

    // Notify coordinator
    repository.addNotification({
      recipientUserId: selectedSenior.assignedCoordinatorId,
      targetRole: 'coordinator',
      title: `New Visit Request from ${requestedBy === 'senior' ? selectedSenior.name : selectedSenior.linkedFamilyName}`,
      message: `${type} visit requested for ${date} (${slot}).`,
      type: 'appointment',
      actionUrl: '/coordinator',
      actionLabel: 'Confirm visit',
    });

    return {
      id: record.id,
      seniorId: record.seniorId,
      seniorName: selectedSenior.name,
      requestedBy: record.requestedBy as any,
      type: record.type,
      date: record.date,
      slotTime: record.slot,
      homeAddress: record.address,
      notes: record.notes,
      status: record.status as any,
      createdTimestamp: record.createdAt,
    };
  };

  const confirmAppointmentByCoordinator = (appointmentId: string, meetLink?: string) => {
    repository.updateAppointmentStatus(appointmentId, 'confirmed', meetLink);

    // Notify family
    repository.addNotification({
      recipientUserId: 'user-family-karishma',
      targetRole: 'family',
      title: 'Care Visit Confirmed',
      message: `Coordinator ${selectedSenior.assignedCoordinatorName} confirmed the appointment. Check the calendar in your portal.`,
      type: 'appointment',
      actionUrl: '/family',
      actionLabel: 'Open portal',
    });
  };

  const rescheduleAppointment = (appointmentId: string, newDate: string, newSlot: string) => {
    repository.updateAppointmentStatus(appointmentId, 'pending');
  };

  const cancelAppointment = (appointmentId: string) => {
    repository.updateAppointmentStatus(appointmentId, 'cancelled');
  };

  // Health Readings
  const addHealthReading = (
    type: 'bp' | 'sugar' | 'spo2' | 'weight' | 'pulse',
    value: number,
    valueSecondary?: number,
    addedBy: 'senior' | 'family' | 'coordinator' = 'senior'
  ) => {
    const units: Record<string, string> = {
      bp: 'mmHg',
      sugar: 'mg/dL',
      spo2: '%',
      weight: 'kg',
      pulse: 'bpm',
    };
    repository.addReading({
      seniorId: selectedSenior.id,
      type,
      value,
      valueSecondary,
      unit: units[type] || '',
      recordedBy: addedBy,
    });
  };

  // Voice Notes
  const addSeniorVoiceNote = async (durationSec: number, audioBlobUrl: string | null) => {
    const result = await voiceNoteSummarizer.process(
      audioBlobUrl,
      durationSec,
      selectedSenior.name,
      language
    );

    repository.addVoiceNote({
      seniorId: selectedSenior.id,
      coordinatorId: selectedSenior.assignedCoordinatorId,
      durationSeconds: durationSec,
      transcript: result.transcript,
      plainSummary: result.plainSummary,
      cueTags: result.extractedCues.map((c) => c.tag),
      isHighPriority: result.isHighPriority,
      audioBlobUrl: audioBlobUrl || undefined,
    });

    // Notify assigned Coordinator ONLY
    repository.addNotification({
      recipientUserId: selectedSenior.assignedCoordinatorId,
      targetRole: 'coordinator',
      title: result.isHighPriority ? `Urgent Voice Note from ${selectedSenior.name}` : `New Voice Note from ${selectedSenior.name}`,
      message: result.plainSummary,
      type: 'voice_note',
      actionUrl: `/coordinator/senior/${selectedSenior.id}`,
      actionLabel: 'Listen to note',
    });

    // Notify family ONLY IF consent allows
    if (selectedSenior.familyConsentGranted) {
      repository.addNotification({
        recipientUserId: 'user-family-karishma',
        targetRole: 'family',
        title: `Morning Check-in Update: ${selectedSenior.name}`,
        message: result.plainSummary,
        type: 'voice_note',
        actionUrl: '/family',
        actionLabel: 'View update',
      });
    }
  };

  const saveCheckinAnswers = (answers: { q1: number; q2: number; q3: number; q4: number }) => {
    repository.addCheckIn({
      seniorId: selectedSenior.id,
      answers,
      recordedBy: 'senior',
    });
  };

  // Notification Management
  const markNotificationRead = (id: string) => {
    repository.markNotificationRead(id);
  };

  const clearNotificationsForRole = () => {
    const recipientId =
      role === 'coordinator'
        ? selectedSenior.assignedCoordinatorId
        : role === 'family'
        ? 'user-family-karishma'
        : 'user-senior-kamla';
    repository.clearNotifications(recipientId);
  };

  // Coordinator Tools (Step 2)
  const updateCoordinatorProfile = (data: CoordinatorProfileData) => {
    repository.updateUser('user-coordinator-nimish', {
      name: data.name,
      phone: data.phone,
    });
  };

  const updateSeniorProfile = (data: Partial<SeniorProfileData>) => {
    repository.updateSenior('senior-kamla-001', data);
  };

  const addMedicine = (name: string, instructions: string, scheduledTimes: string[]) => {
    return repository.addMedicine('senior-kamla-001', name, instructions, scheduledTimes);
  };

  const updateMedicine = (id: string, updates: Partial<Medicine>) => {
    return repository.updateMedicine(id, updates);
  };

  const removeMedicine = (id: string) => {
    repository.removeMedicine(id);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentSeniorId,
        setCurrentSeniorId,
        seniors,
        selectedSenior,
        language,
        setLanguage,
        t,
        largerText,
        setLargerText,
        highContrast,
        setHighContrast,
        seniorLanguageChosen,
        setSeniorLanguageChosen,
        demoSpeedFast,
        setDemoSpeedFast,
        virtualTime,
        handleAlertAction,
        handleFeedback,
        toggleConsent,
        toggleDetailedVitalsConsent,
        detailedVitalsConsent,
        feedbackStats,
        precisionRate,
        resetDemoData,
        medicines,
        doses,
        dueDoseNow,
        takeDoseSenior,
        snoozeDoseSenior,
        confirmDoseFamily,
        medicineChangeRequests,
        requestMedicineChange,
        approveMedicineChange,
        rejectMedicineChange,
        sosEvents,
        activeSosEvent,
        triggerSeniorSOS,
        resolveSosEvent,
        sosCallResults,
        appointments,
        requestAppointment,
        confirmAppointmentByCoordinator,
        rescheduleAppointment,
        cancelAppointment,
        healthReadings,
        addHealthReading,
        voiceNotes,
        addSeniorVoiceNote,
        todayCheckinAnswer,
        saveCheckinAnswers,
        notifications,
        roleNotifications,
        unreadNotificationCount,
        markNotificationRead,
        clearNotificationsForRole,
        cancelSOS,
        wearableConnected,
        wearableReadings,
        connectWearable,
        disconnectWearable,
        injectWearableScenario,
        coordinatorProfile,
        updateCoordinatorProfile,
        updateSeniorProfile,
        addMedicine,
        updateMedicine,
        removeMedicine,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
