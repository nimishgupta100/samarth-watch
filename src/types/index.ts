export type UrgencyLevel = 'critical' | 'moderate' | 'low';

export type SignalType = 'vitals' | 'medication' | 'call_notes' | 'silence';

export type CueTag = 
  | 'pain' 
  | 'dizziness' 
  | 'low appetite' 
  | 'loneliness' 
  | 'fall' 
  | 'confusion' 
  | 'poor sleep' 
  | 'fatigue'
  | 'missed meds';

export interface ExtractedCue {
  tag: CueTag;
  severity: 'mild' | 'moderate' | 'severe';
  quote: string;
}

export interface CallNote {
  id: string;
  date: string;
  time: string;
  language: 'hindi' | 'hinglish' | 'english';
  originalText: string;
  englishTranslation: string;
  cues: ExtractedCue[];
  sentiment: 'positive' | 'neutral' | 'concerning' | 'critical';
  durationMinutes: number;
  callType: 'routine_ivr' | 'coordinator_voice' | 'family_inbound' | 'missed_call_callback';
  coordinatorNotes?: string;
}

export interface DailyVitals {
  systolicBp: number;
  diastolicBp: number;
  fastingSugar?: number;
  postPrandialSugar?: number;
  spo2: number;
  weight: number;
  pulse: number;
}

export interface DailyMedication {
  scheduled: number;
  taken: number;
  missedDoses: string[];
  adherenceRate: number; // 0.0 - 1.0
}

export interface DailyScoreBreakdown {
  vitalsDeviation: number; // e.g. +28
  medicationAdherence: number; // e.g. +24
  nlpCallCues: number; // e.g. +22
  silencePattern: number; // e.g. +14
  trendAcceleration: number; // e.g. +10
}

export interface DayRecord {
  date: string;
  vitals: DailyVitals;
  medication: DailyMedication;
  callNote?: CallNote;
  riskScore: number; // 0-100
  urgency: UrgencyLevel;
  breakdown: DailyScoreBreakdown;
  activeSignals: SignalType[];
}

export interface SeniorBaseline {
  systolicBp: number;
  systolicBpSd: number;
  diastolicBp: number;
  diastolicBpSd: number;
  fastingSugar: number;
  fastingSugarSd: number;
  postPrandialSugar: number;
  spo2: number;
  weight: number;
  weightSd: number;
  pulse: number;
  establishedDays: number;
}

export type RecommendedAction = 
  | 'Call today' 
  | 'Schedule doctor visit' 
  | 'Medicine review' 
  | 'Contact family'
  | 'Send local care associate'
  | 'Monitor next 24h';

export interface Senior {
  id: string;
  name: string;
  age?: number;
  gender?: 'Female' | 'Male';
  city?: string;
  address?: string;
  doctor?: string;
  languagePreference?: 'hi' | 'en';
  area?: string;
  avatarSeed?: string;
  phone: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  assignedCoordinatorId: string;
  assignedCoordinatorName: string;
  livingSituation?: string;
  primaryContext?: string; // Non-diagnostic context
  familyConsentGranted: boolean;
  detailedVitalsConsent?: boolean;
  locationSharing?: 'emergency_only' | 'live' | 'do_not_share';
  linkedFamilyIds?: string[];
  linkedFamilyName?: string;
  linkedFamilyRelation?: string;
  linkedFamilyPhone?: string;
  baseline?: SeniorBaseline;
  history90Days?: DayRecord[];
  
  // Current active status (Today)
  currentRiskScore?: number;
  currentUrgency: UrgencyLevel;
  daysSinceBaselineShift?: number;
  topReasons?: string[];
  recommendedAction?: RecommendedAction;
  recommendedScript?: {
    hindi: string;
    english: string;
  };
  scoreBreakdown?: DailyScoreBreakdown;
  activeSignals?: SignalType[];
  alertStatus?: 'pending' | 'done' | 'snoozed';
  feedback?: 'useful' | 'not_useful' | null;
  trend14Days?: number[]; // 14 daily scores
}

export type UserRole = 'coordinator' | 'manager' | 'family';

export interface CoordinatorInfo {
  id: string;
  name: string;
  phone: string;
  city: string;
  totalCaseload: number;
  alertsToday: number;
  avgResponseMins: number;
  precisionRate: number;
}
