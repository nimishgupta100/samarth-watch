/**
 * SAMARTH WATCH DATA SCHEMA (VERSION 2)
 * Clean, production-ready typed definitions with zero fake/fabricated data.
 */

export const DATA_VERSION = 2;
export const DEMO_OTP = '4321';
export const PASSWORD_SALT = 'samarth_salt_2026';
export const COORDINATOR_PASSWORD_HASH = '89aa3efa250e2f3dfbadabff6b81590f5b9a925841796053bd4786452163204c';

export type UserRole = 'coordinator' | 'senior' | 'family' | 'manager';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  username?: string;
  phone?: string;
  passwordHash?: string;
  passwordSalt?: string;
  relationship?: string;
  linkedSeniorId?: string;
  createdAt: number;
}

export interface SeniorRecord {
  id: string;
  name: string;
  phone: string;
  assignedCoordinatorId: string;
  assignedCoordinatorName: string;
  linkedFamilyIds: string[];
  linkedFamilyName: string;
  linkedFamilyPhone: string;
  familyConsentGranted: boolean;
  detailedVitalsConsent: boolean;
  locationSharing?: LocationSharingChoice; // default: 'emergency_only'
  age?: number;
  city: string;
  address: string;
  livingSituation: string;
  languagePreference: 'hi' | 'en';
  emergencyContactName: string;
  emergencyContactPhone: string;
  doctor: string;
  currentUrgency: 'low' | 'moderate' | 'critical';
  currentRiskScore: number;
  alertStatus: 'pending' | 'done' | 'snoozed';
  feedback?: 'useful' | 'not_useful' | null;
  activeSignals: string[];
  topReasons: string[];
  primaryContext: string;
  createdAt: number;
}

export interface Medicine {
  id: string;
  seniorId: string;
  name: string;
  instructions: string;
  scheduledTimes: string[]; // e.g. ["08:30 AM", "08:30 PM"]
  createdAt: number;
  updatedAt?: number;
}

export interface DoseRecord {
  id: string;
  seniorId: string;
  medicineId: string;
  medicineName: string;
  dosageInstructions: string;
  scheduledTime: string;
  scheduledTimestamp: number;
  status: 'upcoming' | 'pending' | 'taken' | 'snoozed' | 'family_notified' | 'missed';
  confirmedBy?: 'senior' | 'family' | 'coordinator';
  confirmedTimestamp?: number;
}

export interface CheckInRecord {
  id: string;
  seniorId: string;
  timestamp: number;
  answers: {
    q1?: number; // overall wellbeing
    q2?: number; // meds on time
    q3?: number; // appetite
    q4?: number; // pain/dizziness
  };
  summary?: string;
  recordedBy: 'senior' | 'coordinator';
}

export interface VoiceNoteRecord {
  id: string;
  seniorId: string;
  coordinatorId: string;
  timestamp: number;
  durationSeconds: number;
  transcript: string;
  plainSummary: string;
  cueTags: string[];
  isHighPriority: boolean;
  audioBlobUrl?: string;
}

export interface HealthReadingRecord {
  id: string;
  seniorId: string;
  timestamp: number;
  type: 'bp' | 'sugar' | 'spo2' | 'weight' | 'pulse';
  value: number;
  valueSecondary?: number;
  unit: string;
  recordedBy: 'senior' | 'coordinator' | 'family';
}

export interface AppointmentRecord {
  id: string;
  seniorId: string;
  requestedBy: 'senior' | 'family' | 'coordinator';
  type: 'In person' | 'Google Meet';
  date: string;
  slot: string;
  address?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  confirmedBy?: string;
  meetLink?: string;
  createdAt: number;
}

export interface SosEventRecord {
  id: string;
  seniorId: string;
  seniorName: string;
  timestamp: number;
  status: 'Informed' | 'Assisting' | 'Resolved';
  cancelledBySenior?: boolean;
  cancelledAt?: number;
  location?: {
    lat: number;
    lng: number;
    accuracy: number;
    source: 'device_high_accuracy' | 'last_known' | 'home_address';
    homeAddress?: string;
  };
  notes?: string;
}

export interface AppNotificationRecord {
  id: string;
  recipientUserId: string; // The user who receives this notification
  targetRole: UserRole;
  title: string;
  message: string;
  type: 'sos' | 'medicine_escalation' | 'appointment' | 'reading' | 'voice_note' | 'info';
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface MedicineChangeRequestRecord {
  id: string;
  seniorId: string;
  requestedBy: string;
  medicineName: string;
  proposedTiming: string;
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
}

export type LocationSource = 'phone' | 'band' | 'home_address' | 'simulated' | 'cached';
export type LocationMode = 'emergency' | 'live';
export type LocationSharingChoice = 'emergency_only' | 'live' | 'do_not_share';

export interface LocationReading {
  id: string;
  seniorId: string;
  lat: number;
  lng: number;
  accuracy: number; // in metres
  measuredAt: string; // ISO 8601
  source: LocationSource;
  mode: LocationMode;
}

export interface AppStateData {
  version: number;
  users: User[];
  seniors: SeniorRecord[];
  medicines: Medicine[];
  doses: DoseRecord[];
  checkins: CheckInRecord[];
  voiceNotes: VoiceNoteRecord[];
  readings: HealthReadingRecord[];
  appointments: AppointmentRecord[];
  sosEvents: SosEventRecord[];
  notifications: AppNotificationRecord[];
  changeRequests: MedicineChangeRequestRecord[];
  locationReadings?: LocationReading[];
}

/**
 * EXACT INITIAL SEED DATA
 * Exactly 3 users, exactly 1 senior record, all collections start empty.
 */
export const INITIAL_SEED_DATA: AppStateData = {
  version: DATA_VERSION,
  users: [
    {
      id: 'user-coordinator-nimish',
      role: 'coordinator',
      name: 'Nimish Gupta',
      username: 'nimishgupta100',
      phone: '', // Not added yet
      passwordHash: COORDINATOR_PASSWORD_HASH,
      passwordSalt: PASSWORD_SALT,
      createdAt: 1730000000000,
    },
    {
      id: 'user-senior-kamla',
      role: 'senior',
      name: 'Kamla',
      phone: '7452009877',
      createdAt: 1730000000000,
    },
    {
      id: 'user-family-karishma',
      role: 'family',
      name: 'Karishma',
      phone: '8765789433',
      relationship: 'Family member',
      linkedSeniorId: 'senior-kamla-001',
      createdAt: 1730000000000,
    },
  ],
  seniors: [
    {
      id: 'senior-kamla-001',
      name: 'Kamla',
      phone: '7452009877',
      assignedCoordinatorId: 'user-coordinator-nimish',
      assignedCoordinatorName: 'Nimish Gupta',
      linkedFamilyIds: ['user-family-karishma'],
      linkedFamilyName: 'Karishma',
      linkedFamilyPhone: '8765789433',
      familyConsentGranted: true, // Safe default: Family sharing ON
      detailedVitalsConsent: false, // Safe default: Detailed health sharing OFF
      locationSharing: 'emergency_only', // Safe default: only shared during emergency
      age: undefined,
      city: '',
      address: '',
      livingSituation: '',
      languagePreference: 'hi',
      emergencyContactName: '',
      emergencyContactPhone: '',
      doctor: '',
      currentUrgency: 'low',
      currentRiskScore: 12,
      alertStatus: 'done',
      activeSignals: [],
      topReasons: [],
      primaryContext: '',
      createdAt: 1730000000000,
    },
  ],
  medicines: [],
  doses: [],
  checkins: [],
  voiceNotes: [],
  readings: [],
  appointments: [],
  sosEvents: [],
  notifications: [],
  changeRequests: [],
};
