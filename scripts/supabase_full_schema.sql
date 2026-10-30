-- ============================================================
-- SAMARTH WATCH — COMPLETE SUPABASE SCHEMA
-- Run this ENTIRE script in Supabase Dashboard → SQL Editor
-- Project: https://efjoibtgufriebdfaltb.supabase.co
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- DROP & RECREATE (idempotent — safe to run multiple times)
-- ────────────────────────────────────────────────────────────

-- Users (login accounts)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('coordinator','senior','family','manager')),
    name TEXT NOT NULL,
    username TEXT,
    phone TEXT,
    relationship TEXT,
    linked_senior_id TEXT,
    created_at BIGINT
);

-- Senior profiles
CREATE TABLE IF NOT EXISTS public.senior_profiles (
    id TEXT PRIMARY KEY,
    senior_id TEXT,           -- cohort alias e.g. SW001
    name TEXT NOT NULL,
    phone TEXT,
    age INTEGER,
    city TEXT,
    address TEXT,
    living_situation TEXT,
    language_preference TEXT DEFAULT 'hi',
    assigned_coordinator_id TEXT,
    assigned_coordinator_name TEXT,
    linked_family_ids TEXT[],
    linked_family_name TEXT,
    linked_family_phone TEXT,
    family_consent_granted BOOLEAN DEFAULT false,
    detailed_vitals_consent BOOLEAN DEFAULT false,
    location_sharing TEXT DEFAULT 'emergency_only',
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    doctor TEXT,
    blood_type TEXT,
    medical_condition TEXT,
    medication_name TEXT,
    current_urgency TEXT DEFAULT 'low',
    current_risk_score INTEGER DEFAULT 0,
    alert_status TEXT DEFAULT 'done',
    active_signals TEXT[],
    top_reasons TEXT[],
    primary_context TEXT,
    adherence_rate INTEGER,
    created_at BIGINT,
    -- cohort extras
    record_id TEXT,
    test_result TEXT,
    admission_type TEXT,
    admission_date TEXT,
    discharge_date TEXT,
    length_of_stay_days INTEGER,
    profile_origin TEXT,
    unique_person_verified BOOLEAN
);

-- Planted decline scenarios (eval only)
CREATE TABLE IF NOT EXISTS public.planted_decline_scenarios (
    senior_id TEXT PRIMARY KEY,
    scenario_type TEXT,
    onset_day INTEGER,
    onset_date TEXT,
    label_source TEXT
);

-- Daily health observations (90 days per senior)
CREATE TABLE IF NOT EXISTS public.daily_observations (
    id BIGSERIAL PRIMARY KEY,
    senior_id TEXT NOT NULL,
    date TEXT NOT NULL,
    day_index INTEGER,
    steps INTEGER,
    resting_heart_rate_bpm INTEGER,
    systolic_bp_mmhg INTEGER,
    diastolic_bp_mmhg INTEGER,
    spo2_pct INTEGER,
    skin_temp_c NUMERIC(4,1),
    sleep_minutes INTEGER,
    risk_score INTEGER DEFAULT 0,
    signals TEXT[],
    med_status TEXT,
    data_origin TEXT DEFAULT 'cohort_synthetic',
    scenario_decline_active BOOLEAN DEFAULT false
);

-- Weekly summaries (aggregated per senior, per week)
CREATE TABLE IF NOT EXISTS public.weekly_summaries (
    id BIGSERIAL PRIMARY KEY,
    senior_id TEXT NOT NULL,
    week_start TEXT NOT NULL,        -- ISO date of Monday of that week
    week_end TEXT NOT NULL,          -- ISO date of Sunday
    week_number INTEGER,             -- 1-based week within observation window
    avg_steps NUMERIC(7,1),
    avg_heart_rate_bpm NUMERIC(5,1),
    avg_systolic_bp NUMERIC(5,1),
    avg_diastolic_bp NUMERIC(5,1),
    avg_spo2_pct NUMERIC(4,1),
    avg_sleep_minutes NUMERIC(6,1),
    avg_risk_score NUMERIC(5,1),
    missed_meds_count INTEGER,
    confirmed_meds_count INTEGER,
    adherence_pct NUMERIC(5,1),
    peak_risk_score INTEGER,
    notes TEXT,
    UNIQUE (senior_id, week_start)
);

-- Medicines
CREATE TABLE IF NOT EXISTS public.medicines (
    id TEXT PRIMARY KEY,
    senior_id TEXT NOT NULL,
    name TEXT NOT NULL,
    instructions TEXT,
    scheduled_times TEXT[],
    created_at BIGINT,
    updated_at BIGINT
);

-- Dose records
CREATE TABLE IF NOT EXISTS public.doses (
    id TEXT PRIMARY KEY,
    senior_id TEXT NOT NULL,
    medicine_id TEXT,
    medicine_name TEXT,
    dosage_instructions TEXT,
    scheduled_time TEXT,
    scheduled_timestamp BIGINT,
    status TEXT DEFAULT 'pending',
    confirmed_by TEXT,
    confirmed_timestamp BIGINT
);

-- Check-in records (daily wellbeing questionnaire)
CREATE TABLE IF NOT EXISTS public.checkin_notes (
    id BIGSERIAL PRIMARY KEY,
    senior_id TEXT NOT NULL,
    date TEXT,
    timestamp BIGINT,
    q1 INTEGER,   -- overall wellbeing 1-5
    q2 INTEGER,   -- meds on time 1-5
    q3 INTEGER,   -- appetite 1-5
    q4 INTEGER,   -- pain/dizziness 1-5
    summary TEXT,
    recorded_by TEXT DEFAULT 'senior',
    language TEXT DEFAULT 'hi',
    note_text TEXT,
    input_mode TEXT,
    data_origin TEXT DEFAULT 'app'
);

-- Health readings (manual / band)
CREATE TABLE IF NOT EXISTS public.health_readings (
    id TEXT PRIMARY KEY,
    senior_id TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    type TEXT NOT NULL,       -- bp | sugar | spo2 | weight | pulse
    value NUMERIC(7,2),
    value_secondary NUMERIC(7,2),
    unit TEXT,
    recorded_by TEXT,
    source TEXT DEFAULT 'manual'
);

-- Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
    id TEXT PRIMARY KEY,
    senior_id TEXT NOT NULL,
    requested_by TEXT,
    type TEXT,
    date TEXT,
    slot TEXT,
    address TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    confirmed_by TEXT,
    meet_link TEXT,
    created_at BIGINT
);

-- SOS events
CREATE TABLE IF NOT EXISTS public.sos_events (
    id TEXT PRIMARY KEY,
    senior_id TEXT NOT NULL,
    senior_name TEXT,
    timestamp BIGINT NOT NULL,
    status TEXT DEFAULT 'Informed',
    cancelled_by_senior BOOLEAN DEFAULT false,
    cancelled_at BIGINT,
    lat NUMERIC(10,6),
    lng NUMERIC(10,6),
    location_accuracy NUMERIC(8,2),
    location_source TEXT,
    home_address TEXT,
    notes TEXT
);

-- Location readings
CREATE TABLE IF NOT EXISTS public.location_readings (
    id TEXT PRIMARY KEY,
    senior_id TEXT NOT NULL,
    lat NUMERIC(10,6) NOT NULL,
    lng NUMERIC(10,6) NOT NULL,
    accuracy NUMERIC(8,2),
    measured_at TEXT NOT NULL,   -- ISO 8601
    source TEXT,                 -- phone | band | home_address | simulated | cached
    mode TEXT                    -- emergency | live
);

-- App notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    recipient_user_id TEXT NOT NULL,
    target_role TEXT,
    title TEXT,
    message TEXT,
    type TEXT,
    timestamp BIGINT,
    read BOOLEAN DEFAULT false,
    action_url TEXT,
    action_label TEXT
);

-- Band / wearable connection log
CREATE TABLE IF NOT EXISTS public.band_connection_log (
    id BIGSERIAL PRIMARY KEY,
    senior_id TEXT NOT NULL,
    event_type TEXT NOT NULL,   -- connected | disconnected | reconnecting | gap | rejected_sample
    timestamp BIGINT NOT NULL,
    device_name TEXT,
    battery_pct INTEGER,
    reason TEXT,                -- for rejected_sample
    data_origin TEXT DEFAULT 'app'
);

-- ────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (deny access until the secure backend migration is applied)
-- ────────────────────────────────────────────────────────────
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'users','senior_profiles','planted_decline_scenarios',
    'daily_observations','weekly_summaries','medicines','doses',
    'checkin_notes','health_readings','appointments','sos_events',
    'location_readings','notifications','band_connection_log'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'public_read_' || t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'service_write_' || t, t);
  END LOOP;
END $$;
