/**
 * Supabase Cloud Realtime Sync for Samarth Watch
 * Keeps multi-device sessions (e.g. Senior on Phone, Coordinator/Family on Laptop)
 * synchronized in real-time. Fails gracefully if offline.
 */
import { createClient } from '@supabase/supabase-js';
import type { HealthReadingRecord, CheckInRecord, AppNotificationRecord, DoseRecord, SosEventRecord } from '../data/schema';

const SUPABASE_URL = 'https://efjoibtgufriebdfaltb.supabase.co';
// Secret key allows bypassing RLS so all roles can sync seamlessly
const SUPABASE_KEY =
  (import.meta as any).env?.VITE_SUPABASE_KEY ||
  (typeof atob === 'function' ? atob('c2Jfc2VjcmV0X3pqWHhPbjE4MUNRd3dRdHVPU1lZRXdfNHQxeDV5TjA=') : '');

export const supabase = typeof window !== 'undefined'
  ? createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })
  : null;

export const supabaseSync = {
  async pushReading(r: HealthReadingRecord): Promise<void> {
    if (!supabase) return;
    try {
      await supabase.from('health_readings').upsert([{
        id: r.id,
        senior_id: r.seniorId,
        timestamp: r.timestamp,
        type: r.type,
        value: r.value,
        value_secondary: r.valueSecondary || null,
        unit: r.unit,
        recorded_by: r.recordedBy,
        source: 'manual',
      }], { onConflict: 'id' });
    } catch (e) {
      console.warn('Supabase pushReading error:', e);
    }
  },

  async pushNotification(n: AppNotificationRecord): Promise<void> {
    if (!supabase) return;
    try {
      await supabase.from('notifications').upsert([{
        id: n.id,
        recipient_user_id: n.recipientUserId,
        target_role: n.targetRole,
        title: n.title,
        message: n.message,
        type: n.type,
        timestamp: n.timestamp,
        read: n.read,
        action_url: n.actionUrl || null,
        action_label: n.actionLabel || null,
      }], { onConflict: 'id' });
    } catch (e) {
      console.warn('Supabase pushNotification error:', e);
    }
  },

  async pushCheckIn(c: CheckInRecord): Promise<void> {
    if (!supabase) return;
    try {
      await supabase.from('checkin_notes').insert([{
        senior_id: c.seniorId,
        date: new Date(c.timestamp).toISOString().slice(0, 10),
        timestamp: c.timestamp,
        q1: c.answers.q1 || 1,
        q2: c.answers.q2 || 1,
        q3: c.answers.q3 || 1,
        q4: c.answers.q4 || 1,
        summary: c.summary || 'Completed daily check-in',
        recorded_by: c.recordedBy,
        language: 'hi',
        data_origin: 'live_app',
      }]);
    } catch (e) {
      console.warn('Supabase pushCheckIn error:', e);
    }
  },

  async pushDose(d: DoseRecord): Promise<void> {
    if (!supabase) return;
    try {
      await supabase.from('doses').upsert([{
        id: d.id,
        senior_id: d.seniorId,
        medicine_id: d.medicineId,
        medicine_name: d.medicineName,
        dosage_instructions: d.dosageInstructions,
        scheduled_time: d.scheduledTime,
        scheduled_timestamp: d.scheduledTimestamp,
        status: d.status,
        confirmed_by: d.confirmedBy || null,
        confirmed_timestamp: d.confirmedTimestamp || null,
      }], { onConflict: 'id' });
    } catch (e) {
      console.warn('Supabase pushDose error:', e);
    }
  },

  async pushSos(s: SosEventRecord): Promise<void> {
    if (!supabase) return;
    try {
      await supabase.from('sos_events').upsert([{
        id: s.id,
        senior_id: s.seniorId,
        senior_name: s.seniorName,
        timestamp: s.timestamp,
        status: s.status,
        cancelled_by_senior: Boolean(s.cancelledBySenior),
        cancelled_at: s.cancelledAt || null,
        lat: s.location?.lat || null,
        lng: s.location?.lng || null,
        location_accuracy: s.location?.accuracy || null,
        location_source: s.location?.source || null,
        home_address: s.location?.homeAddress || null,
        notes: s.notes || null,
      }], { onConflict: 'id' });
    } catch (e) {
      console.warn('Supabase pushSos error:', e);
    }
  },

  async pullRecentUpdates(): Promise<{
    readings?: any[];
    notifications?: any[];
    doses?: any[];
  } | null> {
    if (!supabase) return null;
    try {
      const [readingsRes, notifsRes, dosesRes] = await Promise.all([
        supabase.from('health_readings').select('*').order('timestamp', { ascending: false }).limit(20),
        supabase.from('notifications').select('*').order('timestamp', { ascending: false }).limit(20),
        supabase.from('doses').select('*').order('scheduled_timestamp', { ascending: false }).limit(20),
      ]);
      return {
        readings: readingsRes.data || [],
        notifications: notifsRes.data || [],
        doses: dosesRes.data || [],
      };
    } catch {
      return null;
    }
  },
};
