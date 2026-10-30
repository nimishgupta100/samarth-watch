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
} from './schema';
import { supabaseSync } from '../lib/supabaseSync';

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
  subscribe(listener: () => void): () => void;
}

class LocalStorageRepository implements ISamarthRepository {
  private listeners: Set<() => void> = new Set();
  private stateCache: AppStateData | null = null;
  private channel: BroadcastChannel | null = null;
  private syncInterval: any = null;

  constructor() {
    this.ensureVersionAndSeed();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY || e.key === null) {
          this.stateCache = null;
          this.notifyListeners();
        }
      });

      // Instant 1ms multi-tab synchronization channel
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          this.channel = new BroadcastChannel('samarth_data_channel');
          this.channel.onmessage = (msg) => {
            if (msg.data?.type === 'STATE_CHANGED') {
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
        this.pollCloudUpdates();
      }, 2500);
    }
  }

  private async pollCloudUpdates(): Promise<void> {
    try {
      const updates = await supabaseSync.pullRecentUpdates();
      if (!updates) return;

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

      // Merge remote notifications
      if (updates.notifications && updates.notifications.length > 0) {
        for (const rem of updates.notifications) {
          const remId = rem.id;
          if (!state.notifications.some((n) => n.id === remId)) {
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

      // Merge remote dose updates
      if (updates.doses && updates.doses.length > 0) {
        for (const rem of updates.doses) {
          const remId = rem.id;
          const remSeniorId = rem.seniorId || rem.senior_id;
          const remMedName = rem.medicineName || rem.medicine_name;
          const remStatus = rem.status;
          const remConfirmedBy = rem.confirmedBy || rem.confirmed_by;
          const remConfirmedTs = rem.confirmedTimestamp || rem.confirmed_timestamp;

          // 1. Try to find by exact ID
          let localDose = state.doses.find((d) => d.id === remId);

          // 2. If not found by ID, match by seniorId + medicine name or today's baseline dose
          if (!localDose && remSeniorId) {
            localDose = state.doses.find(
              (d) => d.seniorId === remSeniorId && (d.medicineName === remMedName || d.id === 'dose-kamla-today-001')
            );
          }

          if (localDose) {
            if (localDose.status !== remStatus || localDose.confirmedBy !== remConfirmedBy) {
              localDose.status = remStatus;
              localDose.confirmedBy = remConfirmedBy || localDose.confirmedBy;
              localDose.confirmedTimestamp = remConfirmedTs || localDose.confirmedTimestamp;
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

      if (changed) {
        this.saveState(state);
      }
    } catch {
      // offline / quiet
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
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.saveState(INITIAL_SEED_DATA);
        return INITIAL_SEED_DATA;
      }
      this.stateCache = JSON.parse(raw) as AppStateData;

      // Ensure Kamla has her baseline hypertension medication active if empty
      if (this.stateCache.medicines.length === 0) {
        const defaultMed: Medicine = {
          id: 'med-kamla-001',
          seniorId: 'senior-kamla-001',
          name: 'Amlodipine 5mg',
          instructions: 'Subah nashte ke baad 1 goli',
          scheduledTimes: ['08:30 AM'],
          createdAt: 1730000000000,
        };
        const defaultDose: DoseRecord = {
          id: 'dose-kamla-today-001',
          seniorId: 'senior-kamla-001',
          medicineId: defaultMed.id,
          medicineName: defaultMed.name,
          dosageInstructions: defaultMed.instructions,
          scheduledTime: '08:30 AM',
          scheduledTimestamp: Date.now(),
          status: 'pending',
        };
        this.stateCache.medicines.push(defaultMed);
        this.stateCache.doses.push(defaultDose);
        this.saveState(this.stateCache);
      }

      // Ensure configured phone numbers are maintained
      let phoneUpdated = false;
      const coordUser = this.stateCache.users?.find((u) => u.id === 'user-coordinator-nimish');
      if (coordUser && coordUser.phone !== '9368059741') {
        coordUser.phone = '9368059741';
        phoneUpdated = true;
      }
      const familyUser = this.stateCache.users?.find((u) => u.id === 'user-family-karishma');
      if (familyUser && familyUser.phone !== '8765789433') {
        familyUser.phone = '8765789433';
        phoneUpdated = true;
      }
      const seniorUser = this.stateCache.users?.find((u) => u.id === 'user-senior-kamla');
      if (seniorUser && seniorUser.phone !== '7452009877') {
        seniorUser.phone = '7452009877';
        phoneUpdated = true;
      }
      const kamlaSenior = this.stateCache.seniors?.find((s) => s.id === 'senior-kamla-001');
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
    } catch {
      return INITIAL_SEED_DATA;
    }
  }

  public saveState(state: AppStateData): void {
    this.stateCache = state;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
      try {
        this.channel?.postMessage({ type: 'STATE_CHANGED', timestamp: Date.now() });
      } catch {
        // ignore
      }
    }
    this.notifyListeners();
  }

  public resetToSeed(): AppStateData {
    const fresh = JSON.parse(JSON.stringify(INITIAL_SEED_DATA)) as AppStateData;
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
    const updated = { ...state.seniors[idx], ...updates };
    state.seniors[idx] = updated;
    this.saveState(state);
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
    return newMed;
  }

  public updateMedicine(id: string, updates: Partial<Medicine>): Medicine {
    const state = this.getState();
    const idx = state.medicines.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error(`Medicine not found: ${id}`);
    const updated = { ...state.medicines[idx], ...updates, updatedAt: Date.now() };
    state.medicines[idx] = updated;
    this.saveState(state);
    return updated;
  }

  public removeMedicine(id: string): void {
    const state = this.getState();
    state.medicines = state.medicines.filter((m) => m.id !== id);
    state.doses = state.doses.filter((d) => d.medicineId !== id);
    this.saveState(state);
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
    return newAppt;
  }

  public updateAppointmentStatus(id: string, status: 'confirmed' | 'cancelled' | 'pending', meetLink?: string): AppointmentRecord {
    const state = this.getState();
    const appt = state.appointments.find((a) => a.id === id);
    if (!appt) throw new Error(`Appointment not found: ${id}`);
    appt.status = status;
    if (meetLink) appt.meetLink = meetLink;
    this.saveState(state);
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
    return sos;
  }

  public resolveSosEvent(id: string, notes?: string): SosEventRecord {
    const state = this.getState();
    const sos = state.sosEvents.find((s) => s.id === id);
    if (!sos) throw new Error(`SOS event not found: ${id}`);
    sos.status = 'Resolved';
    if (notes) sos.notes = notes;
    this.saveState(state);
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
    }
  }

  public clearNotifications(recipientUserId: string): void {
    const state = this.getState();
    state.notifications = state.notifications.filter((n) => n.recipientUserId !== recipientUserId);
    this.saveState(state);
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
}

// Global Singleton Instance
export const repository: ISamarthRepository = new LocalStorageRepository();
