-- Secure Supabase backend for Samarth Watch.
-- Run after supabase_full_schema.sql in the Supabase SQL Editor.

ALTER TABLE public.senior_profiles
  ALTER COLUMN family_consent_granted SET DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  legacy_user_id TEXT UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('coordinator', 'senior', 'family', 'manager')),
  name TEXT NOT NULL,
  username TEXT UNIQUE,
  phone TEXT UNIQUE,
  relationship TEXT,
  linked_senior_id TEXT,
  created_at BIGINT NOT NULL DEFAULT (extract(epoch FROM now()) * 1000)::BIGINT
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.profiles FROM anon, authenticated;
REVOKE ALL ON public.profiles FROM PUBLIC;
GRANT SELECT ON public.profiles TO authenticated;
DROP POLICY IF EXISTS profiles_read_own ON public.profiles;
CREATE POLICY profiles_read_own ON public.profiles
  FOR SELECT TO authenticated USING (id = auth.uid());

CREATE OR REPLACE FUNCTION public.app_current_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;
REVOKE EXECUTE ON FUNCTION public.app_current_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.app_current_role() TO authenticated;

CREATE OR REPLACE FUNCTION public.app_legacy_user_id()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT legacy_user_id FROM public.profiles WHERE id = auth.uid()
$$;
REVOKE EXECUTE ON FUNCTION public.app_legacy_user_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.app_legacy_user_id() TO authenticated;

CREATE OR REPLACE FUNCTION public.update_my_profile(profile_name TEXT, profile_phone TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF profile_name IS NULL OR length(trim(profile_name)) = 0 THEN
    RAISE EXCEPTION 'A profile name is required.';
  END IF;

  UPDATE public.profiles
  SET name = trim(profile_name),
      phone = COALESCE(profile_phone, phone)
  WHERE id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Authenticated profile was not found.';
  END IF;
END
$$;
REVOKE EXECUTE ON FUNCTION public.update_my_profile(TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_my_profile(TEXT, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.update_my_senior_consent(
  target_senior_id TEXT,
  family_consent_granted BOOLEAN,
  detailed_vitals_consent BOOLEAN,
  location_sharing TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF public.app_current_role() <> 'senior' THEN
    RAISE EXCEPTION 'Only the senior account can change sharing consent.';
  END IF;
  IF location_sharing IS NOT NULL
     AND location_sharing NOT IN ('emergency_only', 'live', 'do_not_share') THEN
    RAISE EXCEPTION 'Invalid location-sharing preference.';
  END IF;

  UPDATE public.senior_profiles s
  SET family_consent_granted = COALESCE($2, s.family_consent_granted),
      detailed_vitals_consent = COALESCE($3, s.detailed_vitals_consent),
      location_sharing = COALESCE($4, s.location_sharing)
  WHERE (s.id = target_senior_id OR s.senior_id = target_senior_id)
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.linked_senior_id IN (s.id, s.senior_id)
    );

  IF NOT FOUND THEN
    RAISE EXCEPTION 'The senior profile is not linked to this account.';
  END IF;
END
$$;
REVOKE EXECUTE ON FUNCTION public.update_my_senior_consent(TEXT, BOOLEAN, BOOLEAN, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_my_senior_consent(TEXT, BOOLEAN, BOOLEAN, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.app_can_access_senior(target_senior_id TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT CASE public.app_current_role()
    WHEN 'manager' THEN TRUE
    WHEN 'senior' THEN EXISTS (
      SELECT 1
      FROM public.profiles p
      JOIN public.senior_profiles s
        ON s.id = target_senior_id OR s.senior_id = target_senior_id
      WHERE p.id = auth.uid()
        AND p.linked_senior_id IN (target_senior_id, s.id, s.senior_id)
    )
    WHEN 'family' THEN EXISTS (
      SELECT 1
      FROM public.profiles p
      JOIN public.senior_profiles s
        ON s.id = target_senior_id OR s.senior_id = target_senior_id
      WHERE p.id = auth.uid()
        AND p.linked_senior_id IN (target_senior_id, s.id, s.senior_id)
        AND s.family_consent_granted IS TRUE
    )
    WHEN 'coordinator' THEN EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.senior_profiles s
        ON s.id = target_senior_id OR s.senior_id = target_senior_id
      WHERE p.id = auth.uid()
        AND (
          s.assigned_coordinator_id = auth.uid()::TEXT
          OR s.assigned_coordinator_id = p.legacy_user_id
        )
    )
    ELSE FALSE
  END
$$;
REVOKE EXECUTE ON FUNCTION public.app_can_access_senior(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.app_can_access_senior(TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.app_can_access_detailed_vitals(target_senior_id TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT public.app_can_access_senior(target_senior_id)
    AND (
      public.app_current_role() <> 'family'
      OR EXISTS (
        SELECT 1 FROM public.senior_profiles s
        WHERE (s.id = target_senior_id OR s.senior_id = target_senior_id)
          AND s.detailed_vitals_consent IS TRUE
      )
    )
$$;
REVOKE EXECUTE ON FUNCTION public.app_can_access_detailed_vitals(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.app_can_access_detailed_vitals(TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.app_can_access_location(target_senior_id TEXT, location_mode TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT public.app_can_access_senior(target_senior_id)
    AND (
      public.app_current_role() <> 'family'
      OR EXISTS (
        SELECT 1 FROM public.senior_profiles s
        WHERE (s.id = target_senior_id OR s.senior_id = target_senior_id)
          AND (
            s.location_sharing = 'live'
            OR (s.location_sharing = 'emergency_only' AND location_mode = 'emergency')
          )
      )
    )
$$;
REVOKE EXECUTE ON FUNCTION public.app_can_access_location(TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.app_can_access_location(TEXT, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.app_can_notify_user(target_user_id TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT CASE
    WHEN public.app_current_role() = 'manager' THEN TRUE
    WHEN target_user_id IN (auth.uid()::TEXT, public.app_legacy_user_id()) THEN TRUE
    WHEN public.app_current_role() IN ('senior', 'family') THEN EXISTS (
      SELECT 1
      FROM public.profiles sender
      JOIN public.senior_profiles s
        ON sender.linked_senior_id IN (s.id, s.senior_id)
      JOIN public.profiles recipient
        ON recipient.role = 'coordinator'
       AND (
         recipient.id::TEXT = target_user_id
         OR recipient.legacy_user_id = target_user_id
       )
       AND (
         s.assigned_coordinator_id = recipient.id::TEXT
         OR s.assigned_coordinator_id = recipient.legacy_user_id
       )
      WHERE sender.id = auth.uid()
        AND sender.linked_senior_id IS NOT NULL
        AND public.app_can_access_senior(s.id)
    )
    WHEN public.app_current_role() <> 'coordinator' THEN FALSE
    ELSE EXISTS (
      SELECT 1
      FROM public.profiles recipient
      WHERE (
        recipient.id::TEXT = target_user_id
        OR recipient.legacy_user_id = target_user_id
      )
        AND recipient.linked_senior_id IS NOT NULL
        AND public.app_can_access_senior(recipient.linked_senior_id)
    )
  END
$$;
REVOKE EXECUTE ON FUNCTION public.app_can_notify_user(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.app_can_notify_user(TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.app_can_read_notification(target_user_id TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT CASE
    WHEN public.app_current_role() = 'manager' THEN TRUE
    WHEN target_user_id = auth.uid()::TEXT
      OR (
        public.app_legacy_user_id() IS NOT NULL
        AND target_user_id = public.app_legacy_user_id()
      )
    THEN CASE
      WHEN public.app_current_role() <> 'family' THEN TRUE
      ELSE EXISTS (
        SELECT 1
        FROM public.profiles p
        JOIN public.senior_profiles s
          ON p.linked_senior_id IN (s.id, s.senior_id)
        WHERE p.id = auth.uid()
          AND s.family_consent_granted IS TRUE
      )
    END
    ELSE FALSE
  END
$$;
REVOKE EXECUTE ON FUNCTION public.app_can_read_notification(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.app_can_read_notification(TEXT) TO authenticated;

CREATE TABLE IF NOT EXISTS public.app_sync_events (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (
    event_type IN (
      'HEALTH_READING', 'NOTIFICATION', 'CHECKIN_NOTE', 'DOSE_UPDATE',
      'SOS_EVENT', 'VOICE_NOTE', 'CHAT_MESSAGE', 'MEDICINE_UPSERT',
      'MEDICINE_DELETE', 'APPOINTMENT_UPSERT', 'MEDICINE_CHANGE_REQUEST',
      'SENIOR_PROFILE_UPDATE', 'NOTIFICATION_UPDATE', 'NOTIFICATION_CLEAR',
      'LOCATION_READING'
    )
  ),
  record_id TEXT NOT NULL,
  senior_id TEXT,
  recipient_user_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.app_sync_events
  DROP CONSTRAINT IF EXISTS app_sync_events_event_type_check;
ALTER TABLE public.app_sync_events
  ADD CONSTRAINT app_sync_events_event_type_check CHECK (
    event_type IN (
      'HEALTH_READING', 'NOTIFICATION', 'CHECKIN_NOTE', 'DOSE_UPDATE',
      'SOS_EVENT', 'VOICE_NOTE', 'CHAT_MESSAGE', 'MEDICINE_UPSERT',
      'MEDICINE_DELETE', 'APPOINTMENT_UPSERT', 'MEDICINE_CHANGE_REQUEST',
      'SENIOR_PROFILE_UPDATE', 'NOTIFICATION_UPDATE', 'NOTIFICATION_CLEAR',
      'LOCATION_READING'
    )
  );

CREATE INDEX IF NOT EXISTS app_sync_events_senior_id_id_idx
  ON public.app_sync_events (senior_id, id DESC);
CREATE INDEX IF NOT EXISTS app_sync_events_recipient_id_idx
  ON public.app_sync_events (recipient_user_id, id DESC);

ALTER TABLE public.app_sync_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.app_sync_events FROM anon;
GRANT SELECT, INSERT ON public.app_sync_events TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.app_sync_events_id_seq TO authenticated;
REVOKE ALL ON public.app_sync_events FROM PUBLIC;
DROP POLICY IF EXISTS app_sync_events_read_accessible ON public.app_sync_events;
DROP POLICY IF EXISTS app_sync_events_insert_accessible ON public.app_sync_events;
CREATE POLICY app_sync_events_read_accessible ON public.app_sync_events
  FOR SELECT TO authenticated
  USING (
    (
      senior_id IS NOT NULL
      AND public.app_can_access_senior(senior_id)
      AND (
        event_type NOT IN ('NOTIFICATION', 'NOTIFICATION_UPDATE', 'NOTIFICATION_CLEAR')
        OR public.app_can_read_notification(recipient_user_id)
      )
      AND (
        public.app_current_role() <> 'family'
        OR (
          event_type IN (
            'NOTIFICATION', 'NOTIFICATION_UPDATE', 'NOTIFICATION_CLEAR', 'DOSE_UPDATE', 'CHAT_MESSAGE',
            'MEDICINE_UPSERT', 'MEDICINE_DELETE', 'APPOINTMENT_UPSERT',
            'MEDICINE_CHANGE_REQUEST'
          )
          OR (
            event_type = 'HEALTH_READING'
            AND public.app_can_access_detailed_vitals(senior_id)
          )
          OR (
            event_type = 'SOS_EVENT'
            AND public.app_can_access_location(senior_id, 'emergency')
          )
          OR (
            event_type = 'LOCATION_READING'
            AND public.app_can_access_location(senior_id, payload ->> 'mode')
          )
        )
      )
    )
    OR (
      event_type IN ('NOTIFICATION', 'NOTIFICATION_UPDATE', 'NOTIFICATION_CLEAR')
      AND public.app_can_read_notification(recipient_user_id)
    )
  );
CREATE POLICY app_sync_events_insert_accessible ON public.app_sync_events
  FOR INSERT TO authenticated
  WITH CHECK (
    (
      senior_id IS NOT NULL
      AND public.app_can_access_senior(senior_id)
      AND CASE public.app_current_role()
        WHEN 'manager' THEN TRUE
        WHEN 'coordinator' THEN TRUE
        WHEN 'senior' THEN (
          (
            event_type IN ('HEALTH_READING', 'CHECKIN_NOTE')
            AND payload ->> 'recordedBy' = 'senior'
          )
          OR (
            event_type = 'DOSE_UPDATE'
            AND payload ->> 'status' IN ('taken', 'snoozed')
          )
          OR event_type = 'SOS_EVENT'
          OR event_type = 'VOICE_NOTE'
          OR (
            event_type = 'LOCATION_READING'
            AND payload ->> 'mode' = 'live'
            AND public.app_can_access_location(senior_id, 'live')
          )
          OR (
            event_type = 'CHAT_MESSAGE'
            AND payload ->> 'senderRole' = 'senior'
          )
          OR (
            event_type = 'APPOINTMENT_UPSERT'
            AND payload ->> 'status' = 'pending'
            AND payload ->> 'requestedBy' = 'senior'
          )
          OR (
            event_type = 'MEDICINE_CHANGE_REQUEST'
            AND payload ->> 'status' = 'pending'
          )
        )
        WHEN 'family' THEN (
          (
            event_type = 'DOSE_UPDATE'
            AND payload ->> 'status' = 'taken'
            AND payload ->> 'confirmedBy' = 'family'
          )
          OR (
            event_type = 'CHAT_MESSAGE'
            AND payload ->> 'senderRole' = 'family'
          )
          OR (
            event_type = 'APPOINTMENT_UPSERT'
            AND payload ->> 'status' = 'pending'
            AND payload ->> 'requestedBy' = 'family'
          )
          OR (
            event_type = 'MEDICINE_CHANGE_REQUEST'
            AND payload ->> 'status' = 'pending'
          )
        )
          OR (
            event_type = 'HEALTH_READING'
            AND public.app_can_access_detailed_vitals(senior_id)
          )
        ELSE FALSE
      END
    )
    OR (
      event_type IN ('NOTIFICATION', 'NOTIFICATION_UPDATE', 'NOTIFICATION_CLEAR')
      AND public.app_can_notify_user(recipient_user_id)
    )
  );

-- Remove the permissive prototype policies. Unauthenticated access is denied;
-- authenticated reads are scoped to a profile's assigned senior(s).
DO $$
DECLARE
  v_table TEXT;
  v_policy TEXT;
BEGIN
  FOREACH v_table IN ARRAY ARRAY[
    'users', 'senior_profiles', 'planted_decline_scenarios',
    'daily_observations', 'weekly_summaries', 'medicines', 'doses',
    'checkin_notes', 'health_readings', 'medication_events', 'appointments', 'sos_events',
    'location_readings', 'notifications', 'band_connection_log'
  ] LOOP
    IF to_regclass(format('public.%I', v_table)) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', v_table);
      FOR v_policy IN
        SELECT policyname FROM pg_policies
        WHERE schemaname = 'public' AND tablename = v_table
      LOOP
        EXECUTE format('DROP POLICY %I ON public.%I', v_policy, v_table);
      END LOOP;
    END IF;
  END LOOP;
END $$;

DO $$
DECLARE
  v_table TEXT;
BEGIN
  FOREACH v_table IN ARRAY ARRAY[
    'senior_profiles', 'daily_observations', 'weekly_summaries',
    'medicines', 'doses', 'checkin_notes', 'health_readings', 'medication_events',
    'appointments', 'sos_events', 'location_readings',
    'band_connection_log'
  ] LOOP
    IF to_regclass(format('public.%I', v_table)) IS NOT NULL THEN
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (public.app_can_access_senior(senior_id))',
        v_table || '_read_accessible', v_table
      );
    END IF;
  END LOOP;

  IF to_regclass('public.senior_profiles') IS NOT NULL THEN
    DROP POLICY IF EXISTS senior_profiles_read_accessible ON public.senior_profiles;
    CREATE POLICY senior_profiles_read_accessible ON public.senior_profiles
      FOR SELECT TO authenticated
      USING (
        public.app_current_role() <> 'family'
        AND public.app_can_access_senior(COALESCE(senior_id, id))
      );

    EXECUTE '
      CREATE OR REPLACE VIEW public.family_senior_profiles AS
      SELECT
        s.id,
        s.senior_id,
        s.name,
        s.age,
        s.city,
        s.living_situation,
        s.language_preference,
        s.family_consent_granted,
        CASE WHEN s.detailed_vitals_consent THEN s.current_urgency ELSE NULL END AS current_urgency,
        CASE WHEN s.detailed_vitals_consent THEN s.current_risk_score ELSE NULL END AS current_risk_score,
        s.alert_status
      FROM public.senior_profiles s
      WHERE public.app_current_role() = ''family''
        AND s.family_consent_granted IS TRUE
        AND EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid()
            AND p.linked_senior_id IN (s.id, s.senior_id)
        )';
    GRANT SELECT ON public.family_senior_profiles TO authenticated;
  END IF;
  IF to_regclass('public.health_readings') IS NOT NULL THEN
    DROP POLICY IF EXISTS health_readings_read_accessible ON public.health_readings;
    CREATE POLICY health_readings_read_accessible ON public.health_readings
      FOR SELECT TO authenticated
      USING (public.app_can_access_detailed_vitals(senior_id));
  END IF;
  IF to_regclass('public.checkin_notes') IS NOT NULL THEN
    DROP POLICY IF EXISTS checkin_notes_read_accessible ON public.checkin_notes;
    CREATE POLICY checkin_notes_read_accessible ON public.checkin_notes
      FOR SELECT TO authenticated
      USING (public.app_can_access_detailed_vitals(senior_id));
  END IF;
  IF to_regclass('public.location_readings') IS NOT NULL THEN
    DROP POLICY IF EXISTS location_readings_read_accessible ON public.location_readings;
    CREATE POLICY location_readings_read_accessible ON public.location_readings
      FOR SELECT TO authenticated
      USING (public.app_can_access_location(senior_id, mode));
  END IF;
  IF to_regclass('public.daily_observations') IS NOT NULL THEN
    DROP POLICY IF EXISTS daily_observations_read_accessible ON public.daily_observations;
    CREATE POLICY daily_observations_read_accessible ON public.daily_observations
      FOR SELECT TO authenticated
      USING (
        public.app_current_role() <> 'family'
        AND public.app_can_access_senior(senior_id)
      );
  END IF;
  IF to_regclass('public.weekly_summaries') IS NOT NULL THEN
    DROP POLICY IF EXISTS weekly_summaries_read_accessible ON public.weekly_summaries;
    CREATE POLICY weekly_summaries_read_accessible ON public.weekly_summaries
      FOR SELECT TO authenticated
      USING (
        public.app_current_role() <> 'family'
        AND public.app_can_access_senior(senior_id)
      );
  END IF;
  IF to_regclass('public.planted_decline_scenarios') IS NOT NULL THEN
    DROP POLICY IF EXISTS planted_decline_scenarios_read_accessible ON public.planted_decline_scenarios;
    CREATE POLICY planted_decline_scenarios_read_accessible ON public.planted_decline_scenarios
      FOR SELECT TO authenticated
      USING (
        public.app_current_role() IN ('manager', 'coordinator')
        AND public.app_can_access_senior(senior_id)
      );
  END IF;
  IF to_regclass('public.notifications') IS NOT NULL THEN
    CREATE POLICY notifications_read_accessible ON public.notifications
      FOR SELECT TO authenticated
      USING (public.app_can_read_notification(recipient_user_id));
  END IF;
END $$;

-- Profiles are created only by a trusted administrator after creating the
-- matching Supabase Auth user. Never expose a service-role key in the browser.
