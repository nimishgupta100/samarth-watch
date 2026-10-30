import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { User, UserRole } from '../data/schema';
import { supabase, SUPABASE_SETUP_ERROR } from '../lib/supabase';
import { repository } from '../data/repository';

type AuthResult = { success: boolean; error?: string; role?: UserRole };
type OtpRequestResult = { success: boolean; error?: string; maskedPhone?: string };

export interface AuthContextType {
  currentUser: User | null;
  loginCoordinator: (username: string, password: string) => Promise<AuthResult>;
  loginManager: (username: string, password: string) => Promise<AuthResult>;
  requestOtp: (phone: string, expectedRole?: UserRole) => Promise<OtpRequestResult>;
  verifyOtp: (phone: string, otp: string) => Promise<AuthResult>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  failedAttempts: number;
  lockoutRemainingSeconds: number;
}

const LOCKOUT_KEY = 'samarth_auth_lockout';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 1000;
const GENERIC_AUTH_ERROR = 'Details did not match. Please check and try again.';

type ProfileRow = {
  id: string;
  legacy_user_id: string | null;
  role: UserRole;
  name: string;
  username: string | null;
  phone: string | null;
  relationship: string | null;
  linked_senior_id: string | null;
  created_at: number | string | null;
};

function isUserRole(role: unknown): role is UserRole {
  return role === 'coordinator' || role === 'senior' || role === 'family' || role === 'manager';
}

function mapProfile(row: ProfileRow): User {
  if (!isUserRole(row.role)) throw new Error('The account has an invalid role configuration.');
  return {
    id: row.legacy_user_id || row.id,
    role: row.role,
    name: row.name,
    username: row.username || undefined,
    phone: row.phone || undefined,
    relationship: row.relationship || undefined,
    linkedSeniorId: row.linked_senior_id || undefined,
    createdAt: Number(row.created_at || Date.now()),
  };
}

async function loadProfile(authUserId: string): Promise<User> {
  if (!supabase) throw new Error(SUPABASE_SETUP_ERROR);
  const { data, error } = await supabase
    .from('profiles')
    .select('id, legacy_user_id, role, name, username, phone, relationship, linked_senior_id, created_at')
    .eq('id', authUserId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('This account is not assigned a Samarth Watch role.');
  return mapProfile(data as ProfileRow);
}

async function signOutRejectedSession(): Promise<void> {
  if (!supabase) return;
  try {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Unable to clear rejected Supabase session:', error);
  } catch (error) {
    console.error('Network failure while clearing rejected Supabase session:', error);
  }
}

export function normalizeIndianPhoneNumber(input: string): { valid: boolean; normalized: string } {
  let phone = input.trim().replace(/[^\d+]/g, '');
  if (phone.startsWith('+91')) {
    phone = phone.slice(3);
  } else if (phone.startsWith('91') && phone.length === 12) {
    phone = phone.slice(2);
  } else if (phone.startsWith('0') && phone.length === 11) {
    phone = phone.slice(1);
  }

  return { valid: /^[6-9]\d{9}$/.test(phone), normalized: phone };
}

export function usernameToAuthEmail(username: string): string | null {
  const cleanUsername = username.trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,64}$/.test(cleanUsername)) return null;
  return `${cleanUsername}@login.samarthwatch.app`;
}

function getLockoutExpiry(): number {
  if (typeof window === 'undefined') return 0;
  const expiry = Number(sessionStorage.getItem(LOCKOUT_KEY));
  return Number.isFinite(expiry) ? expiry : 0;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState(0);
  const [pendingOtpRole, setPendingOtpRole] = useState<UserRole | undefined>();

  useEffect(() => {
    let active = true;
    let profileRequest = 0;

    const resolveSession = async (session: Session | null) => {
      const requestId = ++profileRequest;
      if (!session) {
        if (active) {
          repository.setAuthenticatedUser(null);
          setCurrentUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const user = await loadProfile(session.user.id);
        if (active && requestId === profileRequest) {
          repository.setAuthenticatedUser(user);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Unable to load authenticated user profile:', error);
        if (active && requestId === profileRequest) {
          repository.setAuthenticatedUser(null);
          setCurrentUser(null);
          await signOutRejectedSession();
        }
      } finally {
        if (active && requestId === profileRequest) setIsLoading(false);
      }
    };

    if (!supabase) {
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => {
        void resolveSession(session);
      }, 0);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Unable to restore Supabase session:', error);
        if (active) setIsLoading(false);
        return;
      }
      return resolveSession(data.session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const updateLockout = () => {
      const remaining = Math.ceil((getLockoutExpiry() - Date.now()) / 1000);
      setLockoutRemainingSeconds(Math.max(0, remaining));
      if (remaining <= 0 && typeof window !== 'undefined') {
        sessionStorage.removeItem(LOCKOUT_KEY);
        setFailedAttempts(0);
      }
    };
    updateLockout();
    const interval = window.setInterval(updateLockout, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const registerFailedAttempt = useCallback(() => {
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);
    if (nextAttempts >= MAX_ATTEMPTS) {
      sessionStorage.setItem(LOCKOUT_KEY, String(Date.now() + LOCKOUT_DURATION_MS));
      setLockoutRemainingSeconds(LOCKOUT_DURATION_MS / 1000);
    }
  }, [failedAttempts]);

  const finishSignIn = useCallback(async (authUserId: string, expectedRole?: UserRole): Promise<AuthResult> => {
    try {
      const user = await loadProfile(authUserId);
      if (expectedRole && user.role !== expectedRole) {
        await signOutRejectedSession();
        registerFailedAttempt();
        return { success: false, error: GENERIC_AUTH_ERROR };
      }
      setFailedAttempts(0);
      sessionStorage.removeItem(LOCKOUT_KEY);
      repository.setAuthenticatedUser(user);
      setCurrentUser(user);
      return { success: true, role: user.role };
    } catch (error) {
      console.error('Authenticated account has no usable application profile:', error);
      await signOutRejectedSession();
      registerFailedAttempt();
      return { success: false, error: GENERIC_AUTH_ERROR };
    }
  }, [registerFailedAttempt]);

  const loginStaff = useCallback(async (username: string, password: string, role: UserRole): Promise<AuthResult> => {
    if (lockoutRemainingSeconds > 0) {
      return { success: false, error: `Too many failed attempts. Please wait ${lockoutRemainingSeconds} seconds.` };
    }
    if (!supabase) return { success: false, error: SUPABASE_SETUP_ERROR };
    const email = usernameToAuthEmail(username);
    if (!email || !password.trim()) {
      registerFailedAttempt();
      return { success: false, error: GENERIC_AUTH_ERROR };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        registerFailedAttempt();
        return { success: false, error: GENERIC_AUTH_ERROR };
      }
      return await finishSignIn(data.user.id, role);
    } catch (error) {
      console.error('Unable to authenticate staff account:', error);
      registerFailedAttempt();
      return { success: false, error: GENERIC_AUTH_ERROR };
    }
  }, [finishSignIn, lockoutRemainingSeconds, registerFailedAttempt]);

  const loginCoordinator = useCallback(
    (username: string, password: string) => loginStaff(username, password, 'coordinator'),
    [loginStaff],
  );
  const loginManager = useCallback(
    (username: string, password: string) => loginStaff(username, password, 'manager'),
    [loginStaff],
  );

  const requestOtp = useCallback(async (
    phoneInput: string,
    expectedRole?: UserRole,
  ): Promise<OtpRequestResult> => {
    if (lockoutRemainingSeconds > 0) {
      return { success: false, error: `Too many failed attempts. Please wait ${lockoutRemainingSeconds} seconds.` };
    }
    if (!supabase) return { success: false, error: SUPABASE_SETUP_ERROR };
    const { valid, normalized } = normalizeIndianPhoneNumber(phoneInput);
    if (!valid || (expectedRole && expectedRole !== 'family' && expectedRole !== 'senior')) {
      registerFailedAttempt();
      return { success: false, error: GENERIC_AUTH_ERROR };
    }

    const phone = `+91${normalized}`;
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: { shouldCreateUser: false },
      });
      if (error) {
        console.error('Unable to send Supabase phone OTP:', error);
        registerFailedAttempt();
        return { success: false, error: GENERIC_AUTH_ERROR };
      }
    } catch (error) {
      console.error('Network failure while requesting Supabase phone OTP:', error);
      registerFailedAttempt();
      return { success: false, error: GENERIC_AUTH_ERROR };
    }

    setPendingOtpRole(expectedRole);
    return {
      success: true,
      maskedPhone: `+91 ${normalized.slice(0, 2)}•••• ••${normalized.slice(-2)}`,
    };
  }, [lockoutRemainingSeconds, registerFailedAttempt]);

  const verifyOtp = useCallback(async (phoneInput: string, otp: string): Promise<AuthResult> => {
    if (lockoutRemainingSeconds > 0) {
      return { success: false, error: `Too many failed attempts. Please wait ${lockoutRemainingSeconds} seconds.` };
    }
    if (!supabase) return { success: false, error: SUPABASE_SETUP_ERROR };
    const { valid, normalized } = normalizeIndianPhoneNumber(phoneInput);
    if (!valid || !otp.trim()) {
      registerFailedAttempt();
      return { success: false, error: GENERIC_AUTH_ERROR };
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: `+91${normalized}`,
        token: otp.trim(),
        type: 'sms',
      });
      if (error || !data.user) {
        registerFailedAttempt();
        return { success: false, error: GENERIC_AUTH_ERROR };
      }
      const result = await finishSignIn(data.user.id, pendingOtpRole);
      if (result.success) setPendingOtpRole(undefined);
      return result;
    } catch (error) {
      console.error('Unable to verify Supabase phone OTP:', error);
      registerFailedAttempt();
      return { success: false, error: GENERIC_AUTH_ERROR };
    }
  }, [finishSignIn, lockoutRemainingSeconds, pendingOtpRole, registerFailedAttempt]);

  const logout = useCallback(() => {
    repository.setAuthenticatedUser(null);
    setCurrentUser(null);
    if (!supabase) return;
    void supabase.auth.signOut().then(({ error }) => {
      if (error) console.error('Unable to sign out from Supabase:', error);
    }).catch((error: unknown) => {
      console.error('Network failure while signing out from Supabase:', error);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginCoordinator,
        loginManager,
        requestOtp,
        verifyOtp,
        logout,
        isAuthenticated: currentUser !== null,
        isLoading,
        failedAttempts,
        lockoutRemainingSeconds,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function roleHomePath(role: UserRole): string {
  switch (role) {
    case 'coordinator':
      return '/coordinator';
    case 'senior':
      return '/senior-home';
    case 'family':
      return '/family';
    case 'manager':
      return '/ops';
  }
}
