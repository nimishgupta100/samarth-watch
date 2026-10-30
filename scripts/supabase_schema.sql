-- Supabase Schema for Samarth Watch Dataset
-- Run this in Supabase Dashboard -> SQL Editor

CREATE TABLE IF NOT EXISTS public.senior_profiles (
    senior_id TEXT PRIMARY KEY,
    record_id TEXT,
    age INTEGER,
    gender TEXT,
    blood_type TEXT,
    medical_condition TEXT,
    medication_name TEXT,
    test_result TEXT,
    admission_type TEXT,
    admission_date TEXT,
    discharge_date TEXT,
    length_of_stay_days INTEGER,
    profile_origin TEXT,
    unique_person_verified BOOLEAN
);

CREATE TABLE IF NOT EXISTS public.planted_decline_scenarios (
    senior_id TEXT PRIMARY KEY,
    scenario_type TEXT,
    onset_day INTEGER,
    onset_date TEXT,
    label_source TEXT
);

CREATE TABLE IF NOT EXISTS public.daily_observations (
    id BIGSERIAL PRIMARY KEY,
    senior_id TEXT,
    date TEXT,
    day_index INTEGER,
    steps INTEGER,
    resting_heart_rate_bpm INTEGER,
    systolic_bp_mmhg INTEGER,
    diastolic_bp_mmhg INTEGER,
    data_origin TEXT,
    scenario_decline_active BOOLEAN
);

CREATE TABLE IF NOT EXISTS public.medication_events (
    id BIGSERIAL PRIMARY KEY,
    senior_id TEXT,
    date TEXT,
    scheduled_time_local TEXT,
    medication_name TEXT,
    confirmation_status TEXT,
    data_origin TEXT,
    note TEXT
);

CREATE TABLE IF NOT EXISTS public.checkin_notes (
    id BIGSERIAL PRIMARY KEY,
    senior_id TEXT,
    date TEXT,
    language TEXT,
    note_text TEXT,
    input_mode TEXT,
    data_origin TEXT
);

-- Enable RLS and remove the old public policies. Access is configured by
-- supabase_backend.sql once Supabase Auth profiles have been provisioned.
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'senior_profiles', 'planted_decline_scenarios', 'daily_observations',
    'medication_events', 'checkin_notes'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'Allow public read ' || t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'Allow service insert ' || t, t);
  END LOOP;
END $$;
