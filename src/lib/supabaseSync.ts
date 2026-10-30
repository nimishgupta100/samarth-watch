import type {
  HealthReadingRecord,
  CheckInRecord,
  AppNotificationRecord,
  DoseRecord,
  SosEventRecord,
  VoiceNoteRecord,
  ChatMessageRecord,
  Medicine,
  AppointmentRecord,
  MedicineChangeRequestRecord,
  SeniorRecord,
  LocationReading,
} from '../data/schema';
import { supabase } from './supabase';

export type SyncPayload = Record<string, any>;

export type SyncUpdates = {
  readings: SyncPayload[];
  notifications: SyncPayload[];
  doses: SyncPayload[];
  checkins: SyncPayload[];
  voiceNotes: SyncPayload[];
  chatMessages: SyncPayload[];
  sosEvents: SyncPayload[];
  medicines: SyncPayload[];
  appointments: SyncPayload[];
  changeRequests: SyncPayload[];
  seniorProfiles: SyncPayload[];
  locationReadings: SyncPayload[];
  cursor: number;
};

type SyncEvent = {
  id: number;
  event_type: string;
  record_id: string;
  senior_id: string | null;
  recipient_user_id: string | null;
  payload: SyncPayload;
};

type PendingEvent = {
  id: string;
  eventType: string;
  recordId: string;
  payload: object;
  seniorId?: string;
  recipientUserId?: string;
};

const activeOutboxFlushes = new Set<string>();

function outboxKey(userId: string): string {
  return `samarth_supabase_outbox_${userId}`;
}

function readOutbox(userId: string): PendingEvent[] | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(outboxKey(userId));
    if (!raw) return [];
    const entries: unknown = JSON.parse(raw);
    if (!Array.isArray(entries)) throw new Error('Pending Supabase event queue is not an array.');
    return entries as PendingEvent[];
  } catch (error) {
    console.error(`Unable to read the pending Supabase event queue for account ${userId}:`, error);
    return null;
  }
}

function writeOutbox(userId: string, entries: PendingEvent[]): boolean {
  if (typeof localStorage === 'undefined') return false;
  try {
    if (entries.length === 0) localStorage.removeItem(outboxKey(userId));
    else localStorage.setItem(outboxKey(userId), JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error(`Unable to save pending Supabase events for account ${userId}:`, error);
    return false;
  }
}

async function flushOutbox(userId: string): Promise<void> {
  if (!supabase || activeOutboxFlushes.has(userId)) return;
  activeOutboxFlushes.add(userId);
  try {
    while (true) {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Unable to check Supabase session while retrying pending events:', sessionError);
        return;
      }
      if (sessionData.session?.user.id !== userId) return;

      const queue = readOutbox(userId);
      if (!queue) return;
      const pending = queue[0];
      if (!pending) return;

      const { error } = await supabase.from('app_sync_events').insert({
        event_type: pending.eventType,
        record_id: pending.recordId,
        senior_id: pending.seniorId || null,
        recipient_user_id: pending.recipientUserId || null,
        payload: pending.payload,
      });
      if (error) {
        console.error(`Unable to sync queued ${pending.eventType} to Supabase:`, error);
        return;
      }
      if (!writeOutbox(userId, queue.slice(1))) return;
    }
  } catch (error) {
    console.error(`Network failure while retrying pending Supabase events for account ${userId}:`, error);
  } finally {
    activeOutboxFlushes.delete(userId);
  }
}

async function pushEvent(
  eventType: string,
  recordId: string,
  payload: object,
  seniorId?: string,
  recipientUserId?: string,
): Promise<void> {
  if (!supabase) return;
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Unable to check Supabase session before syncing:', sessionError);
      return;
    }
    const userId = sessionData.session?.user.id;
    if (!userId) return;
    const queue = readOutbox(userId);
    if (!queue) return;
    queue.push({
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      eventType,
      recordId,
      payload,
      seniorId,
      recipientUserId,
    });
    if (writeOutbox(userId, queue)) await flushOutbox(userId);
  } catch (error) {
    console.error(`Network failure while syncing ${eventType} to Supabase:`, error);
  }
}

function emptyUpdates(cursor = 0): SyncUpdates {
  return {
    readings: [],
    notifications: [],
    doses: [],
    checkins: [],
    voiceNotes: [],
    chatMessages: [],
    sosEvents: [],
    medicines: [],
    appointments: [],
    changeRequests: [],
    seniorProfiles: [],
    locationReadings: [],
    cursor,
  };
}

function camelizeRow(row: SyncPayload): SyncPayload {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.replace(/_([a-z])/g, (_match, letter: string) => letter.toUpperCase()),
      value,
    ]),
  );
}

async function fetchAllRows(table: string): Promise<SyncPayload[]> {
  if (!supabase) return [];
  const pageSize = 1000;
  const rows: SyncPayload[] = [];
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('id', { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (error) throw new Error(`Unable to load ${table} from Supabase: ${error.message}`);
    const page = (data || []) as SyncPayload[];
    rows.push(...page.map(camelizeRow));
    if (page.length < pageSize) return rows;
  }
}

export const supabaseSync = {
  async updateMyProfile(profile: { name: string; phone?: string }): Promise<void> {
    if (!supabase) return;
    const { error } = await supabase.rpc('update_my_profile', {
      profile_name: profile.name,
      profile_phone: profile.phone || null,
    });
    if (error) console.error('Unable to update the authenticated Supabase profile:', error);
  },

  async updateSeniorConsent(record: SeniorRecord): Promise<void> {
    if (!supabase) return;
    const { error } = await supabase.rpc('update_my_senior_consent', {
      target_senior_id: record.id,
      family_consent_granted: record.familyConsentGranted,
      detailed_vitals_consent: record.detailedVitalsConsent,
      location_sharing: record.locationSharing || 'emergency_only',
    });
    if (error) console.error('Unable to save senior consent settings to Supabase:', error);
  },

  pushReading(record: HealthReadingRecord): Promise<void> {
    return pushEvent('HEALTH_READING', record.id, record, record.seniorId);
  },

  pushNotification(record: AppNotificationRecord): Promise<void> {
    return pushEvent('NOTIFICATION', record.id, record, undefined, record.recipientUserId);
  },

  pushCheckIn(record: CheckInRecord): Promise<void> {
    return pushEvent('CHECKIN_NOTE', record.id, record, record.seniorId);
  },

  pushDose(record: DoseRecord): Promise<void> {
    return pushEvent('DOSE_UPDATE', record.id, record, record.seniorId);
  },

  pushSos(record: SosEventRecord): Promise<void> {
    return pushEvent('SOS_EVENT', record.id, record, record.seniorId);
  },

  pushVoiceNote(record: VoiceNoteRecord): Promise<void> {
    const { audioBlobUrl: _audioBlobUrl, ...payload } = record;
    return pushEvent('VOICE_NOTE', record.id, payload, record.seniorId);
  },

  pushChatMessage(record: ChatMessageRecord): Promise<void> {
    return pushEvent('CHAT_MESSAGE', record.id, record, record.seniorId);
  },

  pushMedicine(record: Medicine | { id: string; seniorId: string }, deleted = false): Promise<void> {
    return pushEvent(
      deleted ? 'MEDICINE_DELETE' : 'MEDICINE_UPSERT',
      record.id,
      record,
      record.seniorId,
    );
  },

  pushAppointment(record: AppointmentRecord): Promise<void> {
    return pushEvent('APPOINTMENT_UPSERT', record.id, record, record.seniorId);
  },

  pushChangeRequest(record: MedicineChangeRequestRecord): Promise<void> {
    return pushEvent('MEDICINE_CHANGE_REQUEST', record.id, record, record.seniorId);
  },

  pushSeniorProfile(record: SeniorRecord): Promise<void> {
    return pushEvent('SENIOR_PROFILE_UPDATE', record.id, record, record.id);
  },

  pushNotificationUpdate(record: AppNotificationRecord): Promise<void> {
    return pushEvent('NOTIFICATION_UPDATE', record.id, record, undefined, record.recipientUserId);
  },

  pushNotificationClear(recipientUserId: string): Promise<void> {
    return pushEvent(
      'NOTIFICATION_CLEAR',
      recipientUserId,
      { clear: true },
      undefined,
      recipientUserId,
    );
  },

  pushLocationReading(record: LocationReading): Promise<void> {
    return pushEvent('LOCATION_READING', record.id, record, record.seniorId);
  },

  async pullInitialRecords(role: string): Promise<SyncUpdates | null> {
    if (!supabase) return null;
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (sessionData.session) await flushOutbox(sessionData.session.user.id);
      const profileTable = role === 'family' ? 'family_senior_profiles' : 'senior_profiles';
      const tables = [
        ['seniorProfiles', profileTable],
        ['medicines', 'medicines'],
        ['doses', 'doses'],
        ['checkins', 'checkin_notes'],
        ['readings', 'health_readings'],
        ['appointments', 'appointments'],
        ['sosEvents', 'sos_events'],
        ['notifications', 'notifications'],
        ['locationReadings', 'location_readings'],
      ] as const;
      const results = await Promise.all(
        tables.map(async ([key, table]) => [key, await fetchAllRows(table)] as const),
      );
      const updates = emptyUpdates();
      for (const [key, rows] of results) updates[key] = rows;
      return updates;
    } catch (error) {
      console.error('Unable to load initial Samarth Watch records from Supabase:', error);
      return null;
    }
  },

  async pullRecentUpdates(afterId = 0): Promise<SyncUpdates | null> {
    if (!supabase) return null;
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Unable to check Supabase session before pulling updates:', sessionError);
        return null;
      }
      if (!sessionData.session) return null;
      await flushOutbox(sessionData.session.user.id);

      const updates = emptyUpdates(afterId);
      let cursor = afterId;
      const pageSize = 500;
      while (true) {
        const { data, error } = await supabase
          .from('app_sync_events')
          .select('id, event_type, record_id, senior_id, recipient_user_id, payload')
          .gt('id', cursor)
          .order('id', { ascending: true })
          .limit(pageSize);
        if (error) {
          console.error('Unable to pull Supabase updates:', error);
          return null;
        }
        const page = (data || []) as SyncEvent[];
        if (page.length === 0) break;
        cursor = page[page.length - 1].id;
        for (const event of page) {
        const payload = {
          ...event.payload,
          id: event.record_id,
          seniorId: event.senior_id || undefined,
          recipientUserId: event.recipient_user_id || undefined,
        };
        switch (event.event_type) {
          case 'HEALTH_READING':
            updates.readings.push(payload);
            break;
          case 'NOTIFICATION':
            updates.notifications.push(payload);
            break;
          case 'DOSE_UPDATE':
            updates.doses.push(payload);
            break;
          case 'CHECKIN_NOTE':
            updates.checkins.push(payload);
            break;
          case 'VOICE_NOTE':
            updates.voiceNotes.push(payload);
            break;
          case 'CHAT_MESSAGE':
            updates.chatMessages.push(payload);
            break;
          case 'SOS_EVENT':
            updates.sosEvents.push(payload);
            break;
          case 'MEDICINE_UPSERT':
          case 'MEDICINE_DELETE':
            updates.medicines.push({ ...payload, deleted: event.event_type === 'MEDICINE_DELETE' });
            break;
          case 'APPOINTMENT_UPSERT':
            updates.appointments.push(payload);
            break;
          case 'MEDICINE_CHANGE_REQUEST':
            updates.changeRequests.push(payload);
            break;
          case 'SENIOR_PROFILE_UPDATE':
            updates.seniorProfiles.push(payload);
            break;
          case 'NOTIFICATION_UPDATE':
            updates.notifications.push(payload);
            break;
          case 'NOTIFICATION_CLEAR':
            updates.notifications.push({ ...payload, clear: true });
            break;
          case 'LOCATION_READING':
            updates.locationReadings.push(payload);
            break;
          default:
            console.warn('Ignoring unknown Supabase sync event:', event.event_type);
        }
        }
        if (page.length < pageSize) break;
      }
      updates.cursor = cursor;
      return updates;
    } catch (error) {
      console.error('Network failure while pulling Supabase updates:', error);
      return null;
    }
  },
};
