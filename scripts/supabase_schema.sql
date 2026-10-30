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

-- Enable RLS & policies for public read/service write
ALTER TABLE public.senior_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planted_decline_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkin_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read senior_profiles" ON public.senior_profiles FOR SELECT USING (true);
CREATE POLICY "Allow service insert senior_profiles" ON public.senior_profiles FOR ALL USING (true);

CREATE POLICY "Allow public read planted_decline_scenarios" ON public.planted_decline_scenarios FOR SELECT USING (true);
CREATE POLICY "Allow service insert planted_decline_scenarios" ON public.planted_decline_scenarios FOR ALL USING (true);

CREATE POLICY "Allow public read daily_observations" ON public.daily_observations FOR SELECT USING (true);
CREATE POLICY "Allow service insert daily_observations" ON public.daily_observations FOR ALL USING (true);

CREATE POLICY "Allow public read medication_events" ON public.medication_events FOR SELECT USING (true);
CREATE POLICY "Allow service insert medication_events" ON public.medication_events FOR ALL USING (true);

CREATE POLICY "Allow public read checkin_notes" ON public.checkin_notes FOR SELECT USING (true);
CREATE POLICY "Allow service insert checkin_notes" ON public.checkin_notes FOR ALL USING (true);
