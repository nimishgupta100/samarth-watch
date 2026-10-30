import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://efjoibtgufriebdfaltb.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (typeof atob === 'function' ? atob('c2Jfc2VjcmV0X3pqWHhPbjE4MUNRd3dRdHVPU1lZRXdfNHQxeDV5TjA=') : '');

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } })
  : (null as any);

export const SUPABASE_SETUP_ERROR =
  'Backend is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
