/**
 * SAMARTH WATCH — COMPLETE DATABASE SEEDER
 * Seeds ALL tables with:
 *   - Users (Kamla, Nimish/coordinator, Karishma/family)
 *   - Kamla's full senior profile (taken from SW001 cohort baseline)
 *   - 90 days of daily observations for Kamla (from SW001 cohort)
 *   - Weekly summaries computed from those 90 days
 *   - Medicines + 90 days of dose records
 *   - Check-in notes (weekly, 13 weeks)
 *   - Health readings (manual BP / SpO2 / weight entries)
 *   - Appointments (2 sample appointments)
 *   - SOS events (1 resolved test event)
 *   - Location reading (home address based)
 *   - Band connection log (simulated history)
 *   - Planted decline scenario for SW001
 *
 * Run:  node scripts/seedAllTables.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://efjoibtgufriebdfaltb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 11);
}

function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function tsFor(dateStr, hour = 8, minute = 0) {
  return new Date(`${dateStr}T${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:00+05:30`).getTime();
}

async function upsert(table, rows, onConflict) {
  if (!rows.length) return;
  const opts = onConflict ? { onConflict } : {};
  const { error } = await supabase.from(table).upsert(rows, opts);
  if (error) {
    console.error(`  ✗ ${table}:`, error.message);
  } else {
    console.log(`  ✓ ${table}: ${rows.length} rows`);
  }
}

// ─── Kamla's 90-day daily data (derived from SW001 cohort baseline) ──────────
// SW001 baseline: steps ~5503±339, HR ~73±2.5, systolic ~114±6.2, diastolic ~78±3.7
// Decline scenario starts day 66 (simulated gradual activity decline)

const START_DATE = '2026-07-01';
const SENIOR_ID = 'senior-kamla-001';

function gaussian(mean, sd) {
  // Box-Muller
  const u1 = Math.random(), u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return Math.round(mean + sd * z);
}

function buildDailyObs() {
  const rows = [];
  for (let d = 0; d < 90; d++) {
    const date = addDays(START_DATE, d);
    const dayIndex = d + 1;
    const isDecline = d >= 65; // decline starts day 66

    // During decline: steps drop, HR rises slightly
    const stepMean = isDecline ? 5503 - (d - 65) * 40 : 5503;
    const hrMean   = isDecline ? 73 + (d - 65) * 0.3  : 73;

    const steps     = Math.max(500, gaussian(stepMean, 339));
    const hrBpm     = Math.max(50, Math.min(110, gaussian(hrMean, 2.5)));
    const systolic  = Math.max(90, Math.min(160, gaussian(114, 6.2)));
    const diastolic = Math.max(60, Math.min(100, gaussian(78, 3.7)));
    const spo2      = Math.min(100, Math.max(88, gaussian(97, 1)));
    const sleep     = gaussian(360, 45);   // ~6 h
    const tempRaw   = 36.5 + (Math.random() * 0.6 - 0.3);
    const skinTemp  = Math.round(tempRaw * 10) / 10;

    // Risk score: 0 baseline, rises during decline
    const riskScore = isDecline ? Math.min(80, Math.round((d - 65) * 1.2)) : 0;
    const signals   = isDecline && d > 70 ? ['activity_low'] : [];

    // Med status: ~80% confirmed, rest unconfirmed or missed
    const r = Math.random();
    const medStatus = r < 0.78 ? 'confirmed' : r < 0.90 ? 'unconfirmed' : 'missed';

    rows.push({
      senior_id: SENIOR_ID,
      date,
      day_index: dayIndex,
      steps,
      resting_heart_rate_bpm: hrBpm,
      systolic_bp_mmhg: systolic,
      diastolic_bp_mmhg: diastolic,
      spo2_pct: spo2,
      skin_temp_c: skinTemp,
      sleep_minutes: Math.max(120, sleep),
      risk_score: riskScore,
      signals,
      med_status: medStatus,
      data_origin: 'cohort_sw001_synthetic',
      scenario_decline_active: isDecline,
    });
  }
  return rows;
}

function buildWeeklySummaries(dailyRows) {
  const weeks = [];
  for (let w = 0; w < 13; w++) {
    const weekDays = dailyRows.slice(w * 7, w * 7 + 7);
    if (!weekDays.length) continue;

    const avg = (key) => {
      const vals = weekDays.map(r => r[key]).filter(v => v != null);
      return vals.length ? Math.round((vals.reduce((a,b)=>a+b,0)/vals.length)*10)/10 : null;
    };
    const missed  = weekDays.filter(r => r.med_status === 'missed').length;
    const confirmed = weekDays.filter(r => r.med_status === 'confirmed').length;
    const adherence = Math.round((confirmed / weekDays.length) * 100);

    weeks.push({
      senior_id: SENIOR_ID,
      week_start: weekDays[0].date,
      week_end: weekDays[weekDays.length - 1].date,
      week_number: w + 1,
      avg_steps: avg('steps'),
      avg_heart_rate_bpm: avg('resting_heart_rate_bpm'),
      avg_systolic_bp: avg('systolic_bp_mmhg'),
      avg_diastolic_bp: avg('diastolic_bp_mmhg'),
      avg_spo2_pct: avg('spo2_pct'),
      avg_sleep_minutes: avg('sleep_minutes'),
      avg_risk_score: avg('risk_score'),
      missed_meds_count: missed,
      confirmed_meds_count: confirmed,
      adherence_pct: adherence,
      peak_risk_score: Math.max(...weekDays.map(r => r.risk_score)),
      notes: w >= 9 ? 'Gradual activity decline observed' : null,
    });
  }
  return weeks;
}

function buildDoses(dailyRows) {
  const medicineId = 'med-kamla-001';
  const rows = [];
  for (const day of dailyRows) {
    // Morning dose (8:30 AM)
    const scheduledTs = tsFor(day.date, 8, 30);
    const status = day.med_status === 'confirmed' ? 'taken'
                 : day.med_status === 'missed'    ? 'missed'
                 : 'pending';
    rows.push({
      id: uid('dose-'),
      senior_id: SENIOR_ID,
      medicine_id: medicineId,
      medicine_name: 'Amlodipine 5mg',
      dosage_instructions: 'Subah khaana khaane ke baad',
      scheduled_time: `${day.date}T08:30:00`,
      scheduled_timestamp: scheduledTs,
      status,
      confirmed_by: status === 'taken' ? 'senior' : null,
      confirmed_timestamp: status === 'taken' ? scheduledTs + 3600000 : null,
    });
  }
  return rows;
}

function buildCheckins() {
  const rows = [];
  // One check-in per week (every Monday)
  for (let w = 0; w < 13; w++) {
    const date = addDays(START_DATE, w * 7);
    const wellbeing = w < 9 ? 4 : 3;
    const pain = w < 9 ? 1 : 2;
    rows.push({
      senior_id: SENIOR_ID,
      date,
      timestamp: tsFor(date, 10, 0),
      q1: wellbeing,
      q2: Math.random() < 0.8 ? 4 : 3,
      q3: 3 + Math.round(Math.random()),
      q4: pain,
      summary: w < 9 ? 'Theek hoon, khaana kha rahi hoon' : 'Thodi kamzori lag rahi hai',
      recorded_by: 'senior',
      language: 'hi',
      note_text: w < 9 ? 'Sab theek hai' : 'Chalna thoda mushkil ho raha hai',
      input_mode: 'voice',
      data_origin: 'app',
    });
  }
  return rows;
}

function buildHealthReadings() {
  const types = ['bp','spo2','weight','pulse'];
  const rows = [];
  // One reading per type per fortnight
  for (let i = 0; i < 6; i++) {
    const date = addDays(START_DATE, i * 14 + 3);
    rows.push({
      id: uid('hr-'),
      senior_id: SENIOR_ID,
      timestamp: tsFor(date, 9, 0),
      type: 'bp',
      value: gaussian(114, 6),
      value_secondary: gaussian(78, 4),
      unit: 'mmHg',
      recorded_by: 'senior',
      source: 'manual',
    });
    rows.push({
      id: uid('hr-'),
      senior_id: SENIOR_ID,
      timestamp: tsFor(date, 9, 5),
      type: 'spo2',
      value: gaussian(97, 1),
      unit: '%',
      recorded_by: 'senior',
      source: 'band',
    });
    rows.push({
      id: uid('hr-'),
      senior_id: SENIOR_ID,
      timestamp: tsFor(date, 9, 10),
      type: 'weight',
      value: 52 + Math.round(Math.random() * 3 - 1),
      unit: 'kg',
      recorded_by: 'senior',
      source: 'manual',
    });
    rows.push({
      id: uid('hr-'),
      senior_id: SENIOR_ID,
      timestamp: tsFor(date, 9, 15),
      type: 'pulse',
      value: gaussian(73, 3),
      unit: 'bpm',
      recorded_by: 'senior',
      source: 'band',
    });
  }
  return rows;
}

function buildBandLog() {
  const rows = [];
  // Simulated 90 days of band events
  for (let d = 0; d < 90; d++) {
    const date = addDays(START_DATE, d);
    // Connected in morning
    rows.push({
      senior_id: SENIOR_ID,
      event_type: 'connected',
      timestamp: tsFor(date, 7, 30),
      device_name: 'Mi Smart Band 7',
      battery_pct: Math.max(10, 100 - (d % 7) * 12),
      data_origin: 'simulated',
    });
    // Disconnected at night
    rows.push({
      senior_id: SENIOR_ID,
      event_type: 'disconnected',
      timestamp: tsFor(date, 22, 0),
      device_name: 'Mi Smart Band 7',
      data_origin: 'simulated',
    });
    // Some gaps mid-day
    if (d % 5 === 0) {
      rows.push({
        senior_id: SENIOR_ID,
        event_type: 'gap',
        timestamp: tsFor(date, 14, 0),
        reason: 'Band removed for bathing',
        data_origin: 'simulated',
      });
    }
  }
  return rows;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Samarth Watch — Full Database Seeder\n');

  // 1. Users
  await upsert('users', [
    {
      id: 'user-coordinator-nimish',
      role: 'coordinator',
      name: 'Nimish Gupta',
      username: 'nimishgupta100',
      phone: '',
      created_at: 1730000000000,
    },
    {
      id: 'user-senior-kamla',
      role: 'senior',
      name: 'Kamla',
      phone: '7452009877',
      created_at: 1730000000000,
    },
    {
      id: 'user-family-karishma',
      role: 'family',
      name: 'Karishma',
      phone: '8765789433',
      relationship: 'Family member',
      linked_senior_id: 'senior-kamla-001',
      created_at: 1730000000000,
    },
  ], 'id');

  // 2. Senior profile (Kamla — data from SW001 cohort)
  await upsert('senior_profiles', [{
    id: 'senior-kamla-001',
    senior_id: 'SW001',
    name: 'Kamla',
    phone: '7452009877',
    age: 68,
    city: 'Lucknow',
    address: 'Gomti Nagar, Lucknow, UP 226010',
    living_situation: 'Lives alone',
    language_preference: 'hi',
    assigned_coordinator_id: 'user-coordinator-nimish',
    assigned_coordinator_name: 'Nimish Gupta',
    linked_family_ids: ['user-family-karishma'],
    linked_family_name: 'Karishma',
    linked_family_phone: '8765789433',
    family_consent_granted: true,
    detailed_vitals_consent: false,
    location_sharing: 'emergency_only',
    emergency_contact_name: 'Karishma',
    emergency_contact_phone: '8765789433',
    doctor: 'Dr. Sharma',
    blood_type: 'AB+',
    medical_condition: 'Hypertension',
    medication_name: 'Amlodipine 5mg',
    current_urgency: 'moderate',
    current_risk_score: 36,
    alert_status: 'done',
    active_signals: ['activity_low'],
    top_reasons: ['Steps dropped 20% vs usual', 'Mild fatigue noted in check-ins'],
    primary_context: 'Gradual activity decline since September',
    adherence_rate: 76,
    created_at: 1730000000000,
    record_id: 'SR18251',
    test_result: 'Normal',
    admission_type: 'Elective',
    admission_date: '2022-11-23',
    discharge_date: '2022-12-09',
    length_of_stay_days: 16,
    profile_origin: 'source_record_pseudonymized',
    unique_person_verified: false,
  }], 'id');

  // 3. Planted decline scenario
  await upsert('planted_decline_scenarios', [{
    senior_id: 'SW001',
    scenario_type: 'SIMULATED_GRADUAL_ACTIVITY_DECLINE_WITH_CHECKIN_CHANGES',
    onset_day: 66,
    onset_date: '2026-09-04',
    label_source: 'synthetic_scenario_not_clinical_ground_truth',
  }], 'senior_id');

  // 4. Daily observations
  const dailyObs = buildDailyObs();
  // Insert in batches of 200
  for (let i = 0; i < dailyObs.length; i += 200) {
    await upsert('daily_observations', dailyObs.slice(i, i + 200));
  }

  // 5. Weekly summaries
  const weeklySums = buildWeeklySummaries(dailyObs);
  await upsert('weekly_summaries', weeklySums, 'senior_id,week_start');

  // 6. Medicines
  await upsert('medicines', [{
    id: 'med-kamla-001',
    senior_id: SENIOR_ID,
    name: 'Amlodipine 5mg',
    instructions: 'Subah khaana khaane ke baad ek goli',
    scheduled_times: ['08:30 AM'],
    created_at: 1730000000000,
  }, {
    id: 'med-kamla-002',
    senior_id: SENIOR_ID,
    name: 'Ecosprin 75mg',
    instructions: 'Raat ko so jaane se pehle',
    scheduled_times: ['09:00 PM'],
    created_at: 1730000000000,
  }], 'id');

  // 7. Dose records (90 days × 1 medicine)
  const doses = buildDoses(dailyObs);
  for (let i = 0; i < doses.length; i += 200) {
    await upsert('doses', doses.slice(i, i + 200), 'id');
  }

  // 8. Check-in notes (weekly)
  await upsert('checkin_notes', buildCheckins());

  // 9. Health readings
  await upsert('health_readings', buildHealthReadings(), 'id');

  // 10. Appointments
  await upsert('appointments', [
    {
      id: 'appt-kamla-001',
      senior_id: SENIOR_ID,
      requested_by: 'coordinator',
      type: 'In person',
      date: '2026-10-15',
      slot: '10:00 AM',
      address: 'Gomti Nagar Clinic, Lucknow',
      notes: 'BP checkup and routine review',
      status: 'confirmed',
      confirmed_by: 'Nimish Gupta',
      created_at: 1728000000000,
    },
    {
      id: 'appt-kamla-002',
      senior_id: SENIOR_ID,
      requested_by: 'family',
      type: 'Google Meet',
      date: '2026-11-05',
      slot: '11:00 AM',
      notes: 'Monthly family review call',
      status: 'pending',
      created_at: 1730000000000,
    },
  ], 'id');

  // 11. SOS events
  await upsert('sos_events', [{
    id: 'sos-kamla-test-001',
    senior_id: SENIOR_ID,
    senior_name: 'Kamla',
    timestamp: tsFor('2026-09-10', 14, 22),
    status: 'Resolved',
    cancelled_by_senior: false,
    lat: 26.8467,
    lng: 80.9462,
    location_accuracy: 15,
    location_source: 'phone',
    home_address: 'Gomti Nagar, Lucknow, UP 226010',
    notes: 'False alarm — Kamla accidentally pressed SOS. Resolved after call.',
  }], 'id');

  // 12. Location reading (home address default)
  await upsert('location_readings', [{
    id: 'loc-kamla-home-001',
    senior_id: SENIOR_ID,
    lat: 26.8467,
    lng: 80.9462,
    accuracy: 50,
    measured_at: new Date().toISOString(),
    source: 'home_address',
    mode: 'emergency',
  }], 'id');

  // 13. Band connection log
  const bandLog = buildBandLog();
  for (let i = 0; i < bandLog.length; i += 200) {
    await upsert('band_connection_log', bandLog.slice(i, i + 200));
  }

  console.log('\n✅ All tables seeded successfully!');
  console.log('\nKamla\'s data in Supabase:');
  console.log('  • senior_profiles:      1 row');
  console.log('  • daily_observations:   90 rows (SW001 cohort baseline)');
  console.log('  • weekly_summaries:     13 rows (13 weeks)');
  console.log('  • medicines:            2 medicines');
  console.log('  • doses:                90 dose records');
  console.log('  • checkin_notes:        13 weekly check-ins');
  console.log('  • health_readings:      24 manual readings');
  console.log('  • appointments:         2 appointments');
  console.log('  • sos_events:           1 (resolved false alarm)');
  console.log('  • location_readings:    1 (home address)');
  console.log('  • band_connection_log:  ~200 events');
}

main().catch(console.error);
