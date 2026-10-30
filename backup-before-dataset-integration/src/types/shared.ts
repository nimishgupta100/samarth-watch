import { Senior } from '../types';

export type DoseStatus =
  | 'upcoming'
  | 'pending'
  | 'due'
  | 'reminded'
  | 'taken'
  | 'family_notified'
  | 'snoozed'
  | 'missed';

export interface MedicineDose {
  id: string;
  medicineName: string;
  dosageInstructions: string; // e.g. "1 tablet, after breakfast"
  scheduledTime: string; // "09:00 AM"
  scheduledTimestamp: number; // epoch ms
  status: DoseStatus;
  takenTimestamp?: number;
  confirmedBy?: 'senior' | 'family' | 'coordinator';
  remindedCount: number;
  lastRemindedTimestamp?: number;
  snoozedUntilTimestamp?: number;
  familyNotifiedTimestamp?: number;
}

export interface MedicineScheduleChangeRequest {
  id: string;
  seniorId: string;
  requestedBy: string; // "Sourav Sen (Son)"
  requestedTimestamp: number;
  medicineName: string;
  proposedTiming: string;
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SOSEvent {
  id: string;
  seniorId: string;
  seniorName: string;
  timestamp: number;
  status: 'Informed' | 'Coordinator is calling' | 'Resolved';
  resolvedTimestamp?: number;
  resolvedBy?: string;
  notes?: string;
  cancelledBySenior?: boolean;
  cancelledAt?: number;
  location?: {
    lat: number;
    lng: number;
    accuracy: number;
    source: 'live' | 'cached' | 'home_address';
    homeAddress?: string;
  };
}

export interface Appointment {
  id: string;
  seniorId: string;
  seniorName: string;
  requestedBy: 'senior' | 'family';
  type: 'In person' | 'Google Meet';
  date: string; // "2026-10-31"
  slotTime: string; // "11:00 AM IST"
  homeAddress?: string;
  meetLink?: string; // real meet link added by coordinator
  notes?: string;
  status: 'requested' | 'confirmed' | 'completed' | 'cancelled';
  createdTimestamp: number;
}

export interface AppNotification {
  id: string;
  timestamp: number;
  recipientUserId?: string;
  targetRole: 'senior' | 'family' | 'coordinator' | 'all';
  seniorId: string;
  type: 'sos' | 'medicine_reminder' | 'medicine_escalation' | 'appointment' | 'reading' | 'general';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  targetCoordinatorId?: string;
}

export interface HealthReadingEntry {
  id: string;
  seniorId: string;
  timestamp: number;
  addedBy: 'senior' | 'family' | 'coordinator';
  type: 'bp' | 'sugar' | 'spo2' | 'weight' | 'pulse';
  value: number;
  valueSecondary?: number; // for diastolic
  unit: string;
}

export interface CueSummary {
  tag: string;
  severity: 'mild' | 'moderate' | 'severe';
  quote: string;
}

export interface SeniorVoiceNote {
  id: string;
  seniorId: string;
  timestamp: number;
  durationSeconds: number;
  transcript: string; // simulated for demo
  plainSummary: string; // shown to family if consent allows
  extractedCues: CueSummary[]; // for coordinator only
  audioBlobUrl?: string;
  coordinatorId: string; // ID of the coordinator this note is routed to
  isHighPriority: boolean; // true if cues include 'fall' or severity 'severe'
}
