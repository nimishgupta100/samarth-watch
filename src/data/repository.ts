/**
 * SAMARTH REPOSITORY
 * Typed repository abstraction with local storage persistence and multi-tab live sync.
 */

import {
  DATA_VERSION,
  AppStateData,
  INITIAL_SEED_DATA,
  User,
  SeniorRecord,
  Medicine,
  DoseRecord,
  CheckInRecord,
  VoiceNoteRecord,
  HealthReadingRecord,
  AppointmentRecord,
  SosEventRecord,
  AppNotificationRecord,
  MedicineChangeRequestRecord,
  ChatMessageRecord,
  LocationReading,
} from './schema';
import { supabaseSync, type SyncUpdates } from '../lib/supabaseSync';

const STORAGE_KEY = 'samarth_v2_state';
const VERSION_KEY = 'samarth_data_version';

export interface ISamarthRepository {
  getState(): AppStateData;
  saveState(state: AppStateData): void;
  resetToSeed(): AppStateData;
  getUsers(): User[];
  getUserById(id: string): User | undefined;
  getUserByLogin(query: string): User | undefined;
  updateUser(id: string, updates: Partial<User>): User;
  getSenior(id: string): SeniorRecord | undefined;
  getSeniorsForCoordinator(coordId: string): SeniorRecord[];
  updateSenior(id: string, updates: Partial<SeniorRecord>): SeniorRecord;
  getMedicines(seniorId: string): Medicine[];
  addMedicine(seniorId: string, name: string, instructions: string, scheduledTimes: string[]): Medicine;
  updateMedicine(id: string, updates: Partial<Medicine>): Medicine;
  removeMedicine(id: string): void;
  getDoses(seniorId?: string): DoseRecord[];
  addDose(dose: Omit<DoseRecord, 'id'>): DoseRecord;
  markDoseTaken(doseId: string, confirmedBy: 'senior' | 'family' | 'coordinator'): DoseRecord | undefined;
  snoozeDose(doseId: string): DoseRecord | undefined;
  getCheckIns(seniorId: string): CheckInRecord[];
  addCheckIn(checkin: Omit<CheckInRecord, 'id' | 'timestamp'>): CheckInRecord;
  getVoiceNotes(seniorId?: string, coordinatorId?: string): VoiceNoteRecord[];
  addVoiceNote(note: Omit<VoiceNoteRecord, 'id' | 'timestamp'>): VoiceNoteRecord;
  getReadings(seniorId: string): HealthReadingRecord[];
  addReading(reading: Omit<HealthReadingRecord, 'id' | 'timestamp'>): HealthReadingRecord;
  getAppointments(seniorId?: string): AppointmentRecord[];
  addAppointment(appt: Omit<AppointmentRecord, 'id' | 'createdAt' | 'status'>): AppointmentRecord;
  updateAppointmentStatus(id: string, status: 'confirmed' | 'cancelled' | 'pending', meetLink?: string): AppointmentRecord;
  getSosEvents(seniorId?: string): SosEventRecord[];
  addSosEvent(event: Omit<SosEventRecord, 'id' | 'timestamp' | 'status'>): SosEventRecord;
  cancelSosEvent(id: string): SosEventRecord;
  resolveSosEvent(id: string, notes?: string): SosEventRecord;
  getNotifications(recipientUserId: string): AppNotificationRecord[];
  addNotification(notif: Omit<AppNotificationRecord, 'id' | 'timestamp' | 'read'>): AppNotificationRecord;
  markNotificationRead(id: string): void;
  clearNotifications(recipientUserId: string): void;
  getChangeRequests(seniorId?: string): MedicineChangeRequestRecord[];
  addChangeRequest(req: Omit<MedicineChangeRequestRecord, 'id' | 'createdAt' | 'status'>): MedicineChangeRequestRecord;
  reviewChangeRequest(id: string, status: 'approved' | 'rejected', reviewer: string): MedicineChangeRequestRecord;
  getChatMessages(seniorId?: string): ChatMessageRecord[];
  addChatMessage(msg: Omit<ChatMessageRecord, 'id' | 'timestamp'>): ChatMessageRecord;
  getLocationReadings(seniorId: string): LocationReading[];
  addLocationReading(reading: LocationReading): void;
  subscribe(listener: () => void): () => void;
  setAuthenticatedUser(user: User | null): void;
}

class LocalStorageRepository implements ISamarthRepository {
  private listeners: Set<() => void> = new Set();
  private stateCache: AppStateData | null = null;
  private channel: BroadcastChannel | null = null;
  private syncInterval: any = null;
  private activeUser: User | null = null;
  private cloudCursor = 0;
  private cloudPollRunning = false;
  private cloudHydratingUserId: string | null = null;

  private getStorageKey(): string {
    return this.activeUser ? `${STORAGE_KEY}_user_${this.activeUser.id}` : STORAGE_KEY;
  }

  constructor() {
    this.ensureVersionAndSeed();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === this.getStorageKey() || e.key === null) {
          this.stateCache = null;
          this.notifyListeners();
        }
      });

      // Instant 1ms multi-tab synchronization channel
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          this.channel = new BroadcastChannel('samarth_data_channel');
          this.channel.onmessage = (msg) => {
            if (msg.data?.type === 'STATE_CHANGED' && msg.data.storageKey === this.getStorageKey()) {
              this.stateCache = null;
              this.notifyListeners();
            }
          };
        }
      } catch (e) {
        console.warn('BroadcastChannel init error:', e);
      }

      // Background cloud sync polling (every 2.5 seconds) to pull updates from other devices
      this.syncInterval = setInterval(() => {
        if (this.activeUser) void this.pollCloudUpdates();
      }, 2500);
    }
  }

  public setAuthenticatedUser(user: User | null): void {
    if (this.activeUser?.id === user?.id) {
      this.activeUser = user;
      return;
    }

    this.activeUser = user;
    this.cloudCursor = 0;
    this.cloudHydratingUserId = user?.id || null;
    this.stateCache = null;
    if (!user) {
      this.notifyListeners();
      return;
    }

    const emptyState: AppStateData = {
      version: DATA_VERSION,
      users: [user],
      seniors: [],
      medicines: [],
      doses: [],
      checkins: [],
      voiceNotes: [],
      readings: [],
      appointments: [],
      sosEvents: [],
      notifications: [],
      changeRequests: [],
      chatMessages: [],
      locationReadings: [],
    };
    try {
      const raw = typeof window === 'undefined' ? null : localStorage.getItem(this.getStorageKey());
      this.stateCache = raw ? JSON.parse(raw) as AppStateData : emptyState;
      this.stateCache.users = [user];
    } catch (error) {
      console.error(`Unable to load cached records for account ${user.id}:`, error);
      this.stateCache = emptyState;
    }
    this.saveState(this.stateCache);
    void this.hydrateCloudState(user.id, user.role);
  }

  private async hydrateCloudState(userId: string, role: User['role']): Promise<void> {
    const initial = await supabaseSync.pullInitialRecords(role);
    if (this.activeUser?.id !== userId) return;
    if (initial) {
      const state = this.getState();
      state.seniors = initial.seniorProfiles.map((row) => ({
      id: String(row.id || row.seniorId || ''),
      name: String(row.name || ''),
      phone: String(row.phone || ''),
      assignedCoordinatorId: String(row.assignedCoordinatorId || ''),
      assignedCoordinatorName: String(row.assignedCoordinatorName || ''),
      assignedCoordinatorPhone: row.assignedCoordinatorPhone || undefined,
      linkedFamilyIds: Array.isArray(row.linkedFamilyIds) ? row.linkedFamilyIds : [],
      linkedFamilyName: String(row.linkedFamilyName || ''),
      linkedFamilyPhone: String(row.linkedFamilyPhone || ''),
      familyConsentGranted: Boolean(row.familyConsentGranted),
      detailedVitalsConsent: Boolean(row.detailedVitalsConsent),
      locationSharing: row.locationSharing || 'emergency_only',
      age: row.age == null ? undefined : Number(row.age),
      city: String(row.city || ''),
      address: String(row.address || ''),
      livingSituation: String(row.livingSituation || ''),
      languagePreference: row.languagePreference === 'en' ? 'en' : 'hi',
      emergencyContactName: String(row.emergencyContactName || ''),
      emergencyContactPhone: String(row.emergencyContactPhone || ''),
      doctor: String(row.doctor || ''),
      currentUrgency: row.currentUrgency === 'critical' || row.currentUrgency === 'moderate' ? row.currentUrgency : 'low',
      currentRiskScore: Number(row.currentRiskScore || 0),
      alertStatus: row.alertStatus === 'pending' || row.alertStatus === 'snoozed' ? row.alertStatus : 'done',
      feedback: row.feedback || undefined,
      activeSignals: Array.isArray(row.activeSignals) ? row.activeSignals : [],
      topReasons: Array.isArray(row.topReasons) ? row.topReasons : [],
      primaryContext: String(row.primaryContext || ''),
      recommendedAction: row.recommendedAction || undefined,
      createdAt: Number(row.createdAt || Date.now()),
      }));
      this.mergeInitialRecords(state, initial);
      if (this.activeUser?.id !== userId) return;
      this.saveState(state);
    }
    this.cloudHydratingUserId = null;
    await this.pollCloudUpdates();
  }

  private mergeInitialRecords(state: AppStateData, initial: SyncUpdates): void {
    state.medicines = initial.medicines.map((row) => ({
      id: String(row.id),
      seniorId: String(row.seniorId || ''),
      name: String(row.name || ''),
      instructions: String(row.instructions || ''),
      scheduledTimes: Array.isArray(row.scheduledTimes) ? row.scheduledTimes : [],
      createdAt: Number(row.createdAt || Date.now()),
      updatedAt: row.updatedAt ? Number(row.updatedAt) : undefined,
    }));
    state.doses = initial.doses.map((row) => ({
      id: String(row.id),
      seniorId: String(row.seniorId || ''),
      medicineId: String(row.medicineId || ''),
      medicineName: String(row.medicineName || ''),
      dosageInstructions: String(row.dosageInstructions || ''),
      scheduledTime: String(row.scheduledTime || ''),
      scheduledTimestamp: Number(row.scheduledTimestamp || Date.now()),
      status: row.status || 'pending',
      confirmedBy: row.confirmedBy || undefined,
      confirmedTimestamp: row.confirmedTimestamp ? Number(row.confirmedTimestamp) : undefined,
    }));
    state.checkins = initial.checkins.map((row) => ({
      id: String(row.id),
      seniorId: String(row.seniorId || ''),
      timestamp: Number(row.timestamp || Date.now()),
      answers: { q1: row.q1, q2: row.q2, q3: row.q3, q4: row.q4 },
      summary: row.summary || undefined,
      recordedBy: row.recordedBy === 'coordinator' ? 'coordinator' : 'senior',
    }));
    state.readings = initial.readings.map((row) => ({
      id: String(row.id),
      seniorId: String(row.seniorId || ''),
      timestamp: Number(row.timestamp || Date.now()),
      type: row.type,
      value: Number(row.value || 0),
      valueSecondary: row.valueSecondary == null ? undefined : Number(row.valueSecondary),
      unit: String(row.unit || ''),
      recordedBy: row.recordedBy || 'senior',
    }));
    state.appointments = initial.appointments.map((row) => ({
      id: String(row.id),
      seniorId: String(row.seniorId || ''),
      requestedBy: row.requestedBy || 'senior',
      type: row.type || 'In person',
      date: String(row.date || ''),
      slot: String(row.slot || ''),
      address: row.address || undefined,
      notes: row.notes || undefined,
      status: row.status || 'pending',
      confirmedBy: row.confirmedBy || undefined,
      meetLink: row.meetLink || undefined,
      createdAt: Number(row.createdAt || Date.now()),
    }));
    state.sosEvents = initial.sosEvents.map((row) => ({
      id: String(row.id),
      seniorId: String(row.seniorId || ''),
      seniorName: String(row.seniorName || ''),
      timestamp: Number(row.timestamp || Date.now()),
      status: row.status || 'Informed',
      cancelledBySenior: Boolean(row.cancelledBySenior),
      cancelledAt: row.cancelledAt ? Number(row.cancelledAt) : undefined,
      location: row.lat == null || row.lng == null ? undefined : {
        lat: Number(row.lat),
        lng: Number(row.lng),
        accuracy: Number(row.locationAccuracy || 0),
        source: row.locationSource || 'last_known',
        homeAddress: row.homeAddress || undefined,
      },
      notes: row.notes || undefined,
    }));
    state.notifications = initial.notifications.map((row) => ({
      id: String(row.id),
      recipientUserId: String(row.recipientUserId || ''),
      targetRole: row.targetRole || 'senior',
      title: String(row.title || ''),
      message: String(row.message || ''),
      type: row.type || 'info',
      timestamp: Number(row.timestamp || Date.now()),
      read: Boolean(row.read),
      actionUrl: row.actionUrl || undefined,
      actionLabel: row.actionLabel || undefined,
    }));
    state.locationReadings = initial.locationReadings.map((row) => ({
      id: String(row.id),
      seniorId: String(row.seniorId || ''),
      lat: Number(row.lat || 0),
      lng: Number(row.lng || 0),
      accuracy: Number(row.accuracy || 0),
      measuredAt: String(row.measuredAt || ''),
      source: row.source || 'phone',
      mode: row.mode || 'live',
    }));
  }

  private async pollCloudUpdates(): Promise<void> {
    if (!this.activeUser || this.cloudPollRunning || this.cloudHydratingUserId === this.activeUser.id) return;
    const activeUserId = this.activeUser.id;
    this.cloudPollRunning = true;
    try {
      const updates = await supabaseSync.pullRecentUpdates(this.cloudCursor);
      if (!updates || this.activeUser?.id !== activeUserId) return;

      const state = this.getState();
      let changed = false;

      // Merge remote readings
      if (updates.readings && updates.readings.length > 0) {
        for (const rem of updates.readings) {
          const remId = rem.id;
          if (!state.readings.some((r) => r.id === remId)) {
            state.readings.unshift({
              id: remId,
              seniorId: rem.seniorId || rem.senior_id,
              timestamp: rem.timestamp || Date.now(),
              type: rem.type,
              value: Number(rem.value),
              valueSecondary: rem.valueSecondary || rem.value_secondary ? Number(rem.valueSecondary || rem.value_secondary) : undefined,
              unit: rem.unit || '',
              recordedBy: rem.recordedBy || rem.recorded_by || 'senior',
            });
            changed = true;
          }
        }
      }

      // Merge remote check-ins
      if (updates.checkins && updates.checkins.length > 0) {
        for (const rem of updates.checkins) {
          if (!state.checkins.some((checkin) => checkin.id === rem.id)) {
            state.checkins.unshift({
              id: rem.id,
              seniorId: rem.seniorId || rem.senior_id,
              timestamp: rem.timestamp || Date.now(),
              answers: rem.answers || {},
              summary: rem.summary,
              recordedBy: rem.recordedBy || 'senior',
            });
            changed = true;
          }
        }
      }

      // Merge remote medicine changes
      if (updates.medicines && updates.medicines.length > 0) {
        for (const rem of updates.medicines) {
          if (rem.deleted) {
            const previousLength = state.medicines.length;
            const previousDoseCount = state.doses.length;
            state.medicines = state.medicines.filter((medicine) => medicine.id !== rem.id);
            state.doses = state.doses.filter((dose) => dose.medicineId !== rem.id);
            changed = changed || previousLength !== state.medicines.length || previousDoseCount !== state.doses.length;
            continue;
          }
          const index = state.medicines.findIndex((medicine) => medicine.id === rem.id);
          const medicine = {
            id: rem.id,
            seniorId: rem.seniorId || rem.senior_id,
            name: rem.name || '',
            instructions: rem.instructions || '',
            scheduledTimes: rem.scheduledTimes || rem.scheduled_times || [],
            createdAt: rem.createdAt || rem.created_at || Date.now(),
            updatedAt: rem.updatedAt || rem.updated_at,
          };
          if (index === -1) state.medicines.push(medicine);
          else {
            const current = state.medicines[index];
            const hasChanged = current.name !== medicine.name
              || current.instructions !== medicine.instructions
              || JSON.stringify(current.scheduledTimes) !== JSON.stringify(medicine.scheduledTimes)
              || current.updatedAt !== medicine.updatedAt;
            if (hasChanged) state.medicines[index] = medicine;
            changed = changed || hasChanged;
          }
          if (index === -1) changed = true;
        }
      }

      // Merge remote notifications
      if (updates.notifications && updates.notifications.length > 0) {
        for (const rem of updates.notifications) {
          if (rem.clear) {
            const previousCount = state.notifications.length;
            state.notifications = state.notifications.filter(
              (notification) => notification.recipientUserId !== rem.recipientUserId,
            );
            changed = changed || previousCount !== state.notifications.length;
            continue;
          }
          const remId = rem.id;
          const existing = state.notifications.find((notification) => notification.id === remId);
          if (existing) {
            const read = Boolean(rem.read);
            const title = rem.title || existing.title;
            const message = rem.message || existing.message;
            if (existing.read !== read || existing.title !== title || existing.message !== message) {
              existing.read = read;
              existing.title = title;
              existing.message = message;
              changed = true;
            }
          } else {
            state.notifications.unshift({
              id: remId,
              recipientUserId: rem.recipientUserId || rem.recipient_user_id,
              targetRole: rem.targetRole || rem.target_role,
              title: rem.title,
              message: rem.message,
              type: rem.type,
              timestamp: rem.timestamp || Date.now(),
              read: Boolean(rem.read),
              actionUrl: rem.actionUrl || rem.action_url || undefined,
              actionLabel: rem.actionLabel || rem.action_label || undefined,
            });
            changed = true;
          }
        }
      }

      if (updates.appointments && updates.appointments.length > 0) {
        for (const rem of updates.appointments) {
          const appointment = {
            id: rem.id,
            seniorId: rem.seniorId || rem.senior_id,
            requestedBy: rem.requestedBy || rem.requested_by || 'senior',
            type: rem.type || 'In person',
            date: rem.date || '',
            slot: rem.slot || '',
            address: rem.address || undefined,
            notes: rem.notes || undefined,
            status: rem.status || 'pending',
            confirmedBy: rem.confirmedBy || rem.confirmed_by || undefined,
            meetLink: rem.meetLink || rem.meet_link || undefined,
            createdAt: rem.createdAt || rem.created_at || Date.now(),
          };
          const index = state.appointments.findIndex((item) => item.id === appointment.id);
          if (index === -1) state.appointments.unshift(appointment);
          else {
            const current = state.appointments[index];
            const hasChanged = Object.keys(appointment).some(
              (key) => current[key as keyof typeof current] !== appointment[key as keyof typeof appointment],
            );
            if (hasChanged) state.appointments[index] = appointment;
            changed = changed || hasChanged;
          }
          if (index === -1) changed = true;
        }
      }

      if (updates.changeRequests && updates.changeRequests.length > 0) {
        for (const rem of updates.changeRequests) {
          const request = {
            id: rem.id,
            seniorId: rem.seniorId || rem.senior_id,
            requestedBy: rem.requestedBy || rem.requested_by || '',
            medicineName: rem.medicineName || rem.medicine_name || '',
            proposedTiming: rem.proposedTiming || rem.proposed_timing || '',
            notes: rem.notes || '',
            status: rem.status || 'pending',
            createdAt: rem.createdAt || rem.created_at || Date.now(),
            reviewedAt: rem.reviewedAt || rem.reviewed_at || undefined,
            reviewedBy: rem.reviewedBy || rem.reviewed_by || undefined,
          };
          const index = state.changeRequests.findIndex((item) => item.id === request.id);
          if (index === -1) state.changeRequests.unshift(request);
          else {
            const current = state.changeRequests[index];
            const hasChanged = Object.keys(request).some(
              (key) => current[key as keyof typeof current] !== request[key as keyof typeof request],
            );
            if (hasChanged) state.changeRequests[index] = request;
            changed = changed || hasChanged;
          }
          if (index === -1) changed = true;
        }
      }

      if (updates.seniorProfiles && updates.seniorProfiles.length > 0) {
        for (const remoteSenior of updates.seniorProfiles) {
          const senior = state.seniors.find((item) => item.id === remoteSenior.id);
          if (senior && JSON.stringify(senior) !== JSON.stringify(remoteSenior)) {
            Object.assign(senior, remoteSenior);
            changed = true;
          }
        }
      }

      // Merge remote dose updates
      if (updates.doses && updates.doses.length > 0) {
        for (const rem of updates.doses) {
          const remId = rem.id;
          const remSeniorId = rem.seniorId || rem.senior_id;
          const remMedName = rem.medicineName || rem.medicine_name;
          const remStatus = rem.status;
          const remConfirmedBy = rem.confirmedBy || rem.confirmed_by;
          const remConfirmedTs = rem.confirmedTimestamp || rem.confirmed_timestamp;
          const remScheduledTimestamp = Number(rem.scheduledTimestamp || rem.scheduled_timestamp || 0);

          // 1. Try to find by exact ID
          let localDose = state.doses.find((d) => d.id === remId);

          // 2. If not found by ID, match by seniorId + medicine name or today's baseline dose
          if (!localDose && remSeniorId) {
            localDose = state.doses.find(
              (d) => d.seniorId === remSeniorId && (d.medicineName === remMedName || d.id === 'dose-kamla-today-001')
            );
          }

          if (localDose) {
            if (
              localDose.status !== remStatus
              || localDose.confirmedBy !== remConfirmedBy
              || (remScheduledTimestamp > 0 && localDose.scheduledTimestamp !== remScheduledTimestamp)
            ) {
              localDose.status = remStatus;
              localDose.confirmedBy = remConfirmedBy || localDose.confirmedBy;
              localDose.confirmedTimestamp = remConfirmedTs || localDose.confirmedTimestamp;
              if (remScheduledTimestamp > 0) localDose.scheduledTimestamp = remScheduledTimestamp;
              changed = true;
            }
          } else if (remId && remSeniorId) {
            // New dose created on another device
            state.doses.push({
              id: remId,
              seniorId: remSeniorId,
              medicineId: rem.medicineId || rem.medicine_id || 'med-001',
              medicineName: remMedName || 'Medicine',
              dosageInstructions: rem.dosageInstructions || rem.dosage_instructions || '',
              scheduledTime: rem.scheduledTime || rem.scheduled_time || '08:30 AM',
              scheduledTimestamp: rem.scheduledTimestamp || rem.scheduled_timestamp || Date.now(),
              status: remStatus || 'pending',
              confirmedBy: remConfirmedBy,
              confirmedTimestamp: remConfirmedTs,
            });
            changed = true;
          }
        }
      }

      // Merge remote voice notes
      if (updates.voiceNotes && updates.voiceNotes.length > 0) {
        for (const rem of updates.voiceNotes) {
          if (!state.voiceNotes.some((v) => v.id === rem.id)) {
            state.voiceNotes.unshift({
              id: rem.id,
              seniorId: rem.seniorId,
              coordinatorId: rem.coordinatorId || 'user-coordinator-nimish',
              timestamp: rem.timestamp || Date.now(),
              durationSeconds: rem.durationSeconds || 15,
              transcript: rem.transcript || '',
              plainSummary: rem.plainSummary || '',
              cueTags: rem.cueTags || [],
              isHighPriority: Boolean(rem.isHighPriority),
              audioBlobUrl: rem.audioBlobUrl || undefined,
            });
            changed = true;
          }
        }
      }

      // Merge remote chat messages
      if (updates.chatMessages && updates.chatMessages.length > 0) {
        if (!state.chatMessages) state.chatMessages = [];
        for (const rem of updates.chatMessages) {
          if (!state.chatMessages.some((m) => m.id === rem.id)) {
            state.chatMessages.push({
              id: rem.id,
              seniorId: rem.seniorId,
              senderRole: rem.senderRole,
              senderName: rem.senderName,
              text: rem.text,
              timestamp: rem.timestamp || Date.now(),
            });
            changed = true;
          }
        }
      }

      // Merge remote SOS events
      if (updates.sosEvents && updates.sosEvents.length > 0) {
        for (const rem of updates.sosEvents) {
          const localSos = state.sosEvents.find((s) => s.id === rem.id);
          if (!localSos) {
            state.sosEvents.unshift({
              id: rem.id,
              seniorId: rem.seniorId,
              seniorName: rem.seniorName || 'Kamla Devi',
              timestamp: rem.timestamp || Date.now(),
              status: rem.status || 'Active',
              cancelledBySenior: Boolean(rem.cancelledBySenior),
              cancelledAt: rem.cancelledAt,
              location: rem.location,
              notes: rem.notes,
            });
            changed = true;
          } else if (localSos.status !== rem.status) {
            localSos.status = rem.status;
            localSos.cancelledBySenior = Boolean(rem.cancelledBySenior);
            localSos.cancelledAt = rem.cancelledAt;
            changed = true;
          }
        }
      }

      if (updates.locationReadings.length > 0) {
        if (!state.locationReadings) state.locationReadings = [];
        for (const reading of updates.locationReadings) {
          if (!state.locationReadings.some((item) => item.id === reading.id)) {
            state.locationReadings.push(reading as LocationReading);
            changed = true;
          }
        }
      }

      if (changed) {
        this.saveState(state);
      }
      this.cloudCursor = updates.cursor;
    } catch (error) {
      console.error('Unable to merge Supabase updates into local repository:', error);
    } finally {
      this.cloudPollRunning = false;
    }
  }

  /**
   * Version check: Clears legacy keys from previous runs if version is missing or outdated.
   */
  private ensureVersionAndSeed(): void {
    if (typeof window === 'undefined') return;

    try {
      const storedVersion = localStorage.getItem(VERSION_KEY);
      if (storedVersion !== String(DATA_VERSION)) {
        // Clear all legacy keys from old data
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith('samarth_') || k.startsWith('samarthWatch_'))) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));

        localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_DATA));
        this.stateCache = INITIAL_SEED_DATA;
      }
    } catch (e) {
      console.warn('LocalStorage version check error:', e);
    }
  }

  public getState(): AppStateData {
    if (this.stateCache) return this.stateCache;
    if (typeof window === 'undefined') return INITIAL_SEED_DATA;

    try {
      const raw = localStorage.getItem(this.getStorageKey());
      if (!raw) {
        if (this.activeUser) {
          const emptyState: AppStateData = {
            version: DATA_VERSION,
            users: [this.activeUser],
            seniors: [],
            medicines: [],
            doses: [],
            checkins: [],
            voiceNotes: [],
            readings: [],
            appointments: [],
            sosEvents: [],
            notifications: [],
            changeRequests: [],
            chatMessages: [],
            locationReadings: [],
          };
          this.saveState(emptyState);
          return emptyState;
        }
        this.saveState(INITIAL_SEED_DATA);
        return INITIAL_SEED_DATA;
      }
      this.stateCache = JSON.parse(raw) as AppStateData;

      // Ensure Kamla has her baseline medications active if empty
      if (!this.activeUser && this.stateCache.medicines.length === 0) {
        const med1: Medicine = {
          id: 'med-kamla-001',
          seniorId: 'senior-kamla-001',
          name: 'Amlodipine 5mg',
          instructions: 'Subah nashte ke baad 1 goli (BP ke liye)',
          scheduledTimes: ['08:30 AM'],
          createdAt: 1730000000000,
        };
        const med2: Medicine = {
          id: 'med-kamla-002',
          seniorId: 'senior-kamla-001',
          name: 'Metformin 500mg',
          instructions: 'Dopahar ke khaane ke baad 1 goli (sugar ke liye)',
          scheduledTimes: ['01:00 PM'],
          createdAt: 1730000001000,
        };
        const med3: Medicine = {
          id: 'med-kamla-003',
          seniorId: 'senior-kamla-001',
          name: 'Atorvastatin 10mg',
          instructions: 'Raat ko sone se pehle 1 goli (cholesterol ke liye)',
          scheduledTimes: ['09:00 PM'],
          createdAt: 1730000002000,
        };
        const dose1: DoseRecord = {
          id: 'dose-kamla-today-001',
          seniorId: 'senior-kamla-001',
          medicineId: med1.id,
          medicineName: med1.name,
          dosageInstructions: med1.instructions,
          scheduledTime: '08:30 AM',
          scheduledTimestamp: Date.now(),
          status: 'pending',
        };
        const dose2: DoseRecord = {
          id: 'dose-kamla-today-002',
          seniorId: 'senior-kamla-001',
          medicineId: med2.id,
          medicineName: med2.name,
          dosageInstructions: med2.instructions,
          scheduledTime: '01:00 PM',
          scheduledTimestamp: Date.now() + 4.5 * 3600000,
          status: 'pending',
        };
        const dose3: DoseRecord = {
          id: 'dose-kamla-today-003',
          seniorId: 'senior-kamla-001',
          medicineId: med3.id,
          medicineName: med3.name,
          dosageInstructions: med3.instructions,
          scheduledTime: '09:00 PM',
          scheduledTimestamp: Date.now() + 12.5 * 3600000,
          status: 'pending',
        };
        this.stateCache.medicines.push(med1, med2, med3);
        this.stateCache.doses.push(dose1, dose2, dose3);
        this.saveState(this.stateCache);
      }

      // Ensure configured phone numbers are maintained
      let phoneUpdated = false;
      const coordUser = !this.activeUser && this.stateCache.users?.find((u) => u.id === 'user-coordinator-nimish');
      if (coordUser && coordUser.phone !== '9368059741') {
        coordUser.phone = '9368059741';
        phoneUpdated = true;
      }
      const familyUser = !this.activeUser && this.stateCache.users?.find((u) => u.id === 'user-family-karishma');
      if (familyUser && familyUser.phone !== '8765789433') {
        familyUser.phone = '8765789433';
        phoneUpdated = true;
      }
      const seniorUser = !this.activeUser && this.stateCache.users?.find((u) => u.id === 'user-senior-kamla');
      if (seniorUser && seniorUser.phone !== '7452009877') {
        seniorUser.phone = '7452009877';
        phoneUpdated = true;
      }
      const kamlaSenior = !this.activeUser && this.stateCache.seniors?.find((s) => s.id === 'senior-kamla-001');
      if (kamlaSenior && (kamlaSenior.assignedCoordinatorPhone !== '9368059741' || kamlaSenior.linkedFamilyPhone !== '8765789433' || kamlaSenior.phone !== '7452009877')) {
        kamlaSenior.assignedCoordinatorPhone = '9368059741';
        kamlaSenior.linkedFamilyPhone = '8765789433';
        kamlaSenior.phone = '7452009877';
        phoneUpdated = true;
      }
      if (phoneUpdated) {
        this.saveState(this.stateCache);
      }

      return this.stateCache;
    } catch (error) {
      if (this.activeUser) {
        console.error('Unable to read authenticated account data from local storage:', error);
        throw error;
      }
      return INITIAL_SEED_DATA;
    }
  }

  public saveState(state: AppStateData): void {
    this.stateCache = state;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.getStorageKey(), JSON.stringify(state));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
      try {
        this.channel?.postMessage({ type: 'STATE_CHANGED', storageKey: this.getStorageKey(), timestamp: Date.now() });
      } catch {
        // ignore
      }
    }
    this.notifyListeners();
  }

  public resetToSeed(): AppStateData {
    const fresh: AppStateData = this.activeUser
      ? {
          version: DATA_VERSION,
          users: [this.activeUser],
          seniors: [],
          medicines: [],
          doses: [],
          checkins: [],
          voiceNotes: [],
          readings: [],
          appointments: [],
          sosEvents: [],
          notifications: [],
          changeRequests: [],
          chatMessages: [],
          locationReadings: [],
        }
      : JSON.parse(JSON.stringify(INITIAL_SEED_DATA)) as AppStateData;
    this.saveState(fresh);
    return fresh;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error('Repository listener error:', e);
      }
    });
  }

  // --- Users ---
  public getUsers(): User[] {
    return this.getState().users;
  }

  public getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  public getUserByLogin(query: string): User | undefined {
    const clean = query.trim().replace(/[\s\-]/g, '');
    const clean10 = clean.startsWith('+91') ? clean.slice(3) : clean.startsWith('91') && clean.length === 12 ? clean.slice(2) : clean;
    return this.getUsers().find((u) => {
      if (u.username && u.username.toLowerCase() === query.trim().toLowerCase()) return true;
      if (u.phone && (u.phone === clean10 || u.phone === clean)) return true;
      return false;
    });
  }

  public updateUser(id: string, updates: Partial<User>): User {
    const state = this.getState();
    const idx = state.users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error(`User not found: ${id}`);
    const updated = { ...state.users[idx], ...updates };
    state.users[idx] = updated;

    // If coordinator name or phone updated, sync with senior's assigned coordinator fields
    if (updated.role === 'coordinator') {
      state.seniors = state.seniors.map((s) => {
        if (s.assignedCoordinatorId === id) {
          return {
            ...s,
            assignedCoordinatorName: updated.name,
          };
        }
        return s;
      });
    }

    this.saveState(state);
    if (this.activeUser?.id === id && (updates.name !== undefined || updates.phone !== undefined)) {
      void supabaseSync.updateMyProfile(updated);
    }
    return updated;
  }

  // --- Senior ---
  public getSenior(id: string): SeniorRecord | undefined {
    return this.getState().seniors.find((s) => s.id === id);
  }

  public getSeniorsForCoordinator(coordId: string): SeniorRecord[] {
    return this.getState().seniors.filter((s) => s.assignedCoordinatorId === coordId);
  }

  public updateSenior(id: string, updates: Partial<SeniorRecord>): SeniorRecord {
    const state = this.getState();
    const idx = state.seniors.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error(`Senior record not found: ${id}`);
    const changesConsent = updates.familyConsentGranted !== undefined
      || updates.detailedVitalsConsent !== undefined
      || updates.locationSharing !== undefined;
    if (changesConsent && this.activeUser && this.activeUser.role !== 'senior') {
      throw new Error('Only the senior account can change sharing consent.');
    }
    const updated = { ...state.seniors[idx], ...updates };
    state.seniors[idx] = updated;
    this.saveState(state);
    if (changesConsent && this.activeUser?.role === 'senior') {
      void supabaseSync.updateSeniorConsent(updated);
    } else if (this.activeUser?.role !== 'senior') {
      void supabaseSync.pushSeniorProfile(updated);
    }
    return updated;
  }

  // --- Medicines ---
  public getMedicines(seniorId: string): Medicine[] {
    return this.getState().medicines.filter((m) => m.seniorId === seniorId);
  }

  public addMedicine(seniorId: string, name: string, instructions: string, scheduledTimes: string[]): Medicine {
    const state = this.getState();
    const newMed: Medicine = {
      id: `med-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      seniorId,
      name,
      instructions,
      scheduledTimes,
      createdAt: Date.now(),
    };
    state.medicines.push(newMed);

    // Automatically create today's scheduled dose records for this medicine
    scheduledTimes.forEach((st) => {
      const dose: DoseRecord = {
        id: `dose-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        seniorId,
        medicineId: newMed.id,
        medicineName: newMed.name,
        dosageInstructions: newMed.instructions,
        scheduledTime: st,
        scheduledTimestamp: Date.now(),
        status: 'pending',
      };
      state.doses.push(dose);
    });

    this.saveState(state);
    supabaseSync.pushMedicine(newMed);
    state.doses
      .filter((dose) => dose.medicineId === newMed.id)
      .forEach((dose) => supabaseSync.pushDose(dose));
    return newMed;
  }

  public updateMedicine(id: string, updates: Partial<Medicine>): Medicine {
    const state = this.getState();
    const idx = state.medicines.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error(`Medicine not found: ${id}`);
    const updated = { ...state.medicines[idx], ...updates, updatedAt: Date.now() };
    state.medicines[idx] = updated;
    this.saveState(state);
    supabaseSync.pushMedicine(updated);
    return updated;
  }

  public removeMedicine(id: string): void {
    const state = this.getState();
    const medicine = state.medicines.find((item) => item.id === id);
    state.medicines = state.medicines.filter((m) => m.id !== id);
    state.doses = state.doses.filter((d) => d.medicineId !== id);
    this.saveState(state);
    if (medicine) supabaseSync.pushMedicine({ id, seniorId: medicine.seniorId }, true);
  }

  // --- Doses ---
  public getDoses(seniorId?: string): DoseRecord[] {
    const doses = this.getState().doses;
    if (seniorId) {
      return doses.filter(
        (d) =>
          d.seniorId === seniorId ||
          (seniorId.includes('kamla') && d.seniorId.includes('kamla')) ||
          (seniorId === 'senior-001' && d.seniorId === 'senior-kamla-001') ||
          (seniorId === 'senior-kamla-001' && d.seniorId === 'senior-001')
      );
    }
    return doses;
  }

  public addDose(dose: Omit<DoseRecord, 'id'>): DoseRecord {
    const state = this.getState();
    const newDose: DoseRecord = {
      ...dose,
      id: `dose-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    state.doses.push(newDose);
    this.saveState(state);
    supabaseSync.pushDose(newDose);
    return newDose;
  }

  public markDoseTaken(doseId: string, confirmedBy: 'senior' | 'family' | 'coordinator'): DoseRecord | undefined {
    const state = this.getState();
    const dose = state.doses.find((d) => d.id === doseId);
    if (!dose) return undefined;
    dose.status = 'taken';
    dose.confirmedBy = confirmedBy;
    dose.confirmedTimestamp = Date.now();
    this.saveState(state);
    supabaseSync.pushDose(dose);
    return dose;
  }

  public snoozeDose(doseId: string): DoseRecord | undefined {
    const state = this.getState();
    const dose = state.doses.find((d) => d.id === doseId);
    if (!dose) return undefined;
    dose.status = 'snoozed';
    dose.scheduledTimestamp += 5 * 60 * 1000; // Snooze 5 minutes
    this.saveState(state);
    supabaseSync.pushDose(dose);
    return dose;
  }

  // --- Check-Ins ---
  public getCheckIns(seniorId: string): CheckInRecord[] {
    return this.getState().checkins.filter((c) => c.seniorId === seniorId);
  }

  public addCheckIn(checkin: Omit<CheckInRecord, 'id' | 'timestamp'>): CheckInRecord {
    const state = this.getState();
    const newCheckIn: CheckInRecord = {
      ...checkin,
      id: `ci-${Date.now()}`,
      timestamp: Date.now(),
    };
    state.checkins.unshift(newCheckIn);
    this.saveState(state);
    supabaseSync.pushCheckIn(newCheckIn);
    return newCheckIn;
  }

  // --- Voice Notes ---
  public getVoiceNotes(seniorId?: string, coordinatorId?: string): VoiceNoteRecord[] {
    let list = this.getState().voiceNotes;
    if (seniorId) {
      list = list.filter(
        (v) =>
          v.seniorId === seniorId ||
          (seniorId.includes('kamla') && v.seniorId.includes('kamla')) ||
          (seniorId === 'senior-001' && v.seniorId === 'senior-kamla-001') ||
          (seniorId === 'senior-kamla-001' && v.seniorId === 'senior-001')
      );
    }
    if (coordinatorId) list = list.filter((v) => v.coordinatorId === coordinatorId);
    return list;
  }

  public addVoiceNote(note: Omit<VoiceNoteRecord, 'id' | 'timestamp'>): VoiceNoteRecord {
    const state = this.getState();
    const newNote: VoiceNoteRecord = {
      ...note,
      id: `vn-${Date.now()}`,
      timestamp: Date.now(),
    };
    state.voiceNotes.unshift(newNote);
    this.saveState(state);
    supabaseSync.pushVoiceNote(newNote);
    return newNote;
  }

  // --- Health Readings ---
  public getReadings(seniorId: string): HealthReadingRecord[] {
    return this.getState().readings.filter((r) => r.seniorId === seniorId);
  }

  public addReading(reading: Omit<HealthReadingRecord, 'id' | 'timestamp'>): HealthReadingRecord {
    const state = this.getState();
    const newReading: HealthReadingRecord = {
      ...reading,
      id: `rd-${Date.now()}`,
      timestamp: Date.now(),
    };
    state.readings.unshift(newReading);
    this.saveState(state);
    supabaseSync.pushReading(newReading);
    return newReading;
  }

  // --- Appointments ---
  public getAppointments(seniorId?: string): AppointmentRecord[] {
    const list = this.getState().appointments;
    if (seniorId) return list.filter((a) => a.seniorId === seniorId);
    return list;
  }

  public addAppointment(appt: Omit<AppointmentRecord, 'id' | 'createdAt' | 'status'>): AppointmentRecord {
    const state = this.getState();
    const newAppt: AppointmentRecord = {
      ...appt,
      id: `appt-${Date.now()}`,
      status: 'pending',
      createdAt: Date.now(),
    };
    state.appointments.unshift(newAppt);
    this.saveState(state);
    supabaseSync.pushAppointment(newAppt);
    return newAppt;
  }

  public updateAppointmentStatus(id: string, status: 'confirmed' | 'cancelled' | 'pending', meetLink?: string): AppointmentRecord {
    const state = this.getState();
    const appt = state.appointments.find((a) => a.id === id);
    if (!appt) throw new Error(`Appointment not found: ${id}`);
    appt.status = status;
    if (meetLink) appt.meetLink = meetLink;
    this.saveState(state);
    supabaseSync.pushAppointment(appt);
    return appt;
  }

  // --- SOS Events ---
  public getSosEvents(seniorId?: string): SosEventRecord[] {
    const list = this.getState().sosEvents;
    if (seniorId) return list.filter((s) => s.seniorId === seniorId);
    return list;
  }

  public addSosEvent(event: Omit<SosEventRecord, 'id' | 'timestamp' | 'status'>): SosEventRecord {
    const state = this.getState();
    const newSos: SosEventRecord = {
      ...event,
      id: `sos-${Date.now()}`,
      timestamp: Date.now(),
      status: 'Informed',
    };
    state.sosEvents.unshift(newSos);
    this.saveState(state);
    supabaseSync.pushSos(newSos);
    return newSos;
  }

  public cancelSosEvent(id: string): SosEventRecord {
    const state = this.getState();
    const sos = state.sosEvents.find((s) => s.id === id);
    if (!sos) throw new Error(`SOS event not found: ${id}`);
    sos.cancelledBySenior = true;
    sos.cancelledAt = Date.now();
    this.saveState(state);
    supabaseSync.pushSos(sos);
    return sos;
  }

  public resolveSosEvent(id: string, notes?: string): SosEventRecord {
    const state = this.getState();
    const sos = state.sosEvents.find((s) => s.id === id);
    if (!sos) throw new Error(`SOS event not found: ${id}`);
    sos.status = 'Resolved';
    if (notes) sos.notes = notes;
    this.saveState(state);
    supabaseSync.pushSos(sos);
    return sos;
  }

  // --- Notifications ---
  public getNotifications(recipientUserId: string): AppNotificationRecord[] {
    return this.getState().notifications.filter((n) => n.recipientUserId === recipientUserId);
  }

  public addNotification(notif: Omit<AppNotificationRecord, 'id' | 'timestamp' | 'read'>): AppNotificationRecord {
    const state = this.getState();
    const newNotif: AppNotificationRecord = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      read: false,
    };
    state.notifications.unshift(newNotif);
    this.saveState(state);
    supabaseSync.pushNotification(newNotif);
    return newNotif;
  }

  public markNotificationRead(id: string): void {
    const state = this.getState();
    const n = state.notifications.find((notif) => notif.id === id);
    if (n) {
      n.read = true;
      this.saveState(state);
      supabaseSync.pushNotificationUpdate(n);
    }
  }

  public clearNotifications(recipientUserId: string): void {
    const state = this.getState();
    state.notifications = state.notifications.filter((n) => n.recipientUserId !== recipientUserId);
    this.saveState(state);
    if (recipientUserId) void supabaseSync.pushNotificationClear(recipientUserId);
  }

  // --- Change Requests ---
  public getChangeRequests(seniorId?: string): MedicineChangeRequestRecord[] {
    const list = this.getState().changeRequests;
    if (seniorId) return list.filter((r) => r.seniorId === seniorId);
    return list;
  }

  public addChangeRequest(req: Omit<MedicineChangeRequestRecord, 'id' | 'createdAt' | 'status'>): MedicineChangeRequestRecord {
    const state = this.getState();
    const newReq: MedicineChangeRequestRecord = {
      ...req,
      id: `mcr-${Date.now()}`,
      status: 'pending',
      createdAt: Date.now(),
    };
    state.changeRequests.unshift(newReq);
    this.saveState(state);
    supabaseSync.pushChangeRequest(newReq);
    return newReq;
  }

  public reviewChangeRequest(id: string, status: 'approved' | 'rejected', reviewer: string): MedicineChangeRequestRecord {
    const state = this.getState();
    const req = state.changeRequests.find((r) => r.id === id);
    if (!req) throw new Error(`Change request not found: ${id}`);
    req.status = status;
    req.reviewedAt = Date.now();
    req.reviewedBy = reviewer;
    this.saveState(state);
    supabaseSync.pushChangeRequest(req);
    return req;
  }

  // --- Two-Way Direct In-App Chat Messages ---
  public getChatMessages(seniorId?: string): ChatMessageRecord[] {
    const list = this.getState().chatMessages || [];
    if (seniorId) return list.filter((m) => m.seniorId === seniorId);
    return list;
  }

  public addChatMessage(msg: Omit<ChatMessageRecord, 'id' | 'timestamp'>): ChatMessageRecord {
    const state = this.getState();
    if (!state.chatMessages) state.chatMessages = [];
    const newMsg: ChatMessageRecord = {
      ...msg,
      id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
    };
    state.chatMessages.push(newMsg);
    this.saveState(state);
    supabaseSync.pushChatMessage(newMsg);
    return newMsg;
  }

  public getLocationReadings(seniorId: string): LocationReading[] {
    return (this.getState().locationReadings || []).filter((reading) => reading.seniorId === seniorId);
  }

  public addLocationReading(reading: LocationReading): void {
    const state = this.getState();
    if (!state.locationReadings) state.locationReadings = [];
    if (state.locationReadings.some((item) => item.id === reading.id)) return;
    state.locationReadings.push(reading);
    this.saveState(state);
    void supabaseSync.pushLocationReading(reading);
  }
}

// Global Singleton Instance
export const repository: ISamarthRepository = new LocalStorageRepository();
