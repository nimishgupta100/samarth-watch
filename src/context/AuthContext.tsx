import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, UserRole, DEMO_OTP, PASSWORD_SALT, COORDINATOR_PASSWORD_HASH } from '../data/schema';
import { repository } from '../data/repository';

export interface AuthContextType {
  currentUser: User | null;
  loginCoordinator: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginManager: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  requestOtp: (phone: string, expectedRole?: UserRole) => { success: boolean; error?: string; maskedPhone?: string };
  verifyOtp: (phone: string, otp: string) => { success: boolean; error?: string; role?: UserRole };
  logout: () => void;
  isAuthenticated: boolean;
  failedAttempts: number;
  lockoutRemainingSeconds: number;
}
const SESSION_KEY = 'samarth_auth_session';
const LOCKOUT_KEY = 'samarth_auth_lockout';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 1000;

/**
 * Normalizes phone number: strips spaces, dashes, parentheses and +91 prefix.
 * Validates 10-digit Indian mobile format (starting with 6, 7, 8, or 9).
 */
export function normalizeIndianPhoneNumber(input: string): { valid: boolean; normalized: string } {
  const digitsOnly = input.trim().replace(/[^\d+]/g, '');
  let phone = digitsOnly;
  if (phone.startsWith('+91')) {
    phone = phone.slice(3);
  } else if (phone.startsWith('91') && phone.length === 12) {
    phone = phone.slice(2);
  } else if (phone.startsWith('0') && phone.length === 11) {
    phone = phone.slice(1);
  }

  const isValid = /^[6-9]\d{9}$/.test(phone);
  return { valid: isValid, normalized: phone };
}

/**
 * Compute SHA-256 hash using Web Crypto API.
 * Falls back to a pure-JS implementation when crypto.subtle is unavailable
 * (e.g. HTTP over LAN, insecure context on some browsers).
 */
export async function computeSaltedHash(salt: string, plainText: string): Promise<string> {
  const input = `${salt}:${plainText}`;

  // Primary path: Web Crypto API (HTTPS / localhost)
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback: pure-JS SHA-256 (RFC 6234 reference impl, no external deps)
  return pureJsSha256(input);
}

/** Pure-JS SHA-256 fallback for insecure HTTP contexts (LAN / Wi-Fi dev) */
function pureJsSha256(message: string): string {
  function rightRotate(value: number, amount: number): number {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  let maxWord: number;
  let i: number;
  let j: number;
  let result = '';

  const words: number[] = [];
  const isComposite: { [k: number]: boolean } = {};
  for (let candidate = 2; words.length < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = true;
      }
      words.push((mathPow(candidate, 0.5) % 1) * mathPow(2, 32) | 0);
    }
  }

  const hash = words.slice(0, 8);
  const k = words;

  // Convert string to UTF-8 bytes
  const msgBytes: number[] = [];
  for (let ci = 0; ci < message.length; ci++) {
    let c = message.charCodeAt(ci);
    if (c < 128) {
      msgBytes.push(c);
    } else if (c < 2048) {
      msgBytes.push((c >> 6) | 192, (c & 63) | 128);
    } else {
      msgBytes.push((c >> 12) | 224, ((c >> 6) & 63) | 128, (c & 63) | 128);
    }
  }

  const bitLen = msgBytes.length * 8;
  msgBytes.push(128);
  while (msgBytes.length % 64 !== 56) msgBytes.push(0);
  // Append length as 64-bit big-endian (we only handle messages < 2^32 bits)
  msgBytes.push(0, 0, 0, 0, (bitLen >>> 24) & 0xff, (bitLen >>> 16) & 0xff, (bitLen >>> 8) & 0xff, bitLen & 0xff);

  for (i = 0; i < msgBytes.length; i += 64) {
    const w: number[] = [];
    for (j = 0; j < 16; j++) {
      w[j] =
        (msgBytes[i + j * 4] << 24) |
        (msgBytes[i + j * 4 + 1] << 16) |
        (msgBytes[i + j * 4 + 2] << 8) |
        msgBytes[i + j * 4 + 3];
    }
    for (j = 16; j < 64; j++) {
      const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
      const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, h] = hash;
    for (j = 0; j < 64; j++) {
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + k[j] + w[j]) | 0;
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;
      h = g; g = f; f = e; e = (d + temp1) | 0;
      d = c; c = b; b = a; a = (temp1 + temp2) | 0;
    }
    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }

  for (i = 0; i < 8; i++) {
    maxWord = hash[i];
    for (j = 3; j >= 0; j--) {
      result += ((maxWord >> (j * 8)) & 0xff).toString(16).padStart(2, '0');
    }
  }
  return result;
}

function loadSession(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    // 1. Check tab-isolated sessionStorage first (allows Senior and Coordinator in separate tabs)
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const user = JSON.parse(raw) as User;
      if (user && user.role) return user;
    }
    // 2. If at /senior-home or general device visit, restore persistent senior login
    const seniorRaw = localStorage.getItem('samarth_senior_persistent');
    if (seniorRaw && (window.location.pathname.startsWith('/senior-home') || window.location.pathname === '/' || window.location.pathname === '/login')) {
      const user = JSON.parse(seniorRaw) as User;
      if (user && user.role) {
        sessionStorage.setItem(SESSION_KEY, seniorRaw);
        return user;
      }
    }
    // 3. Fallback to general localStorage session
    const localRaw = localStorage.getItem(SESSION_KEY);
    if (localRaw) {
      const user = JSON.parse(localRaw) as User;
      if (user && user.role) return user;
    }
    return null;
  } catch {
    return null;
  }
}

function saveSession(user: User): void {
  if (typeof window === 'undefined') return;
  const str = JSON.stringify(user);
  try {
    // Tab-level session
    sessionStorage.setItem(SESSION_KEY, str);
    // If senior, remember permanently across device restarts
    if (user.role === 'senior') {
      localStorage.setItem('samarth_senior_persistent', str);
    }
    localStorage.setItem(SESSION_KEY, str);
    localStorage.setItem('samarth_user_role', user.role);
  } catch (e) {
    console.warn('Failed to save session:', e);
  }
}

function clearSession(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('samarth_senior_persistent');
    localStorage.removeItem('samarth_user_role');
  } catch (e) {
    console.warn('Failed to clear session:', e);
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadSession());
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState<number>(0);

  // Check lockout on mount and handle countdown
  useEffect(() => {
    const checkLockout = () => {
      try {
        const raw = sessionStorage.getItem(LOCKOUT_KEY);
        if (!raw) return;
        const lockExpiry = parseInt(raw, 10);
        const remaining = Math.ceil((lockExpiry - Date.now()) / 1000);
        if (remaining > 0) {
          setLockoutRemainingSeconds(remaining);
        } else {
          sessionStorage.removeItem(LOCKOUT_KEY);
          setLockoutRemainingSeconds(0);
          setFailedAttempts(0);
        }
      } catch {
        sessionStorage.removeItem(LOCKOUT_KEY);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  const registerFailedAttempt = useCallback(() => {
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);

    if (nextAttempts >= MAX_ATTEMPTS) {
      const lockExpiry = Date.now() + LOCKOUT_DURATION_MS;
      sessionStorage.setItem(LOCKOUT_KEY, String(lockExpiry));
      setLockoutRemainingSeconds(30);
    }
  }, [failedAttempts]);

  const loginCoordinator = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
      if (lockoutRemainingSeconds > 0) {
        return {
          success: false,
          error: `Too many failed attempts. Please wait ${lockoutRemainingSeconds} seconds.`,
        };
      }

      const cleanUser = username.trim();
      const cleanPass = password.trim();

      if (!cleanUser || !cleanPass) {
        return { success: false, error: 'Details did not match. Please check and try again.' };
      }

      const user = repository.getUserByLogin(cleanUser);
      if (!user || user.role !== 'coordinator' || !user.passwordHash) {
        registerFailedAttempt();
        return { success: false, error: 'Details did not match. Please check and try again.' };
      }

      const hash = await computeSaltedHash(user.passwordSalt || PASSWORD_SALT, cleanPass);
      if (hash !== user.passwordHash) {
        registerFailedAttempt();
        return { success: false, error: 'Details did not match. Please check and try again.' };
      }

      // Success
      setFailedAttempts(0);
      sessionStorage.removeItem(LOCKOUT_KEY);
      setCurrentUser(user);
      saveSession(user);
      return { success: true };
    },
    [lockoutRemainingSeconds, registerFailedAttempt]
  );

  const loginManager = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
      if (lockoutRemainingSeconds > 0) {
        return {
          success: false,
          error: `Too many failed attempts. Please wait ${lockoutRemainingSeconds} seconds.`,
        };
      }

      const cleanUser = username.trim().toLowerCase();
      const cleanPass = password.trim();

      if (!cleanUser || !cleanPass) {
        return { success: false, error: 'Details did not match. Please check and try again.' };
      }

      // Check if there is an existing manager record in repository
      const repoUser = repository.getUserByLogin(cleanUser);
      if (repoUser && repoUser.role === 'manager' && repoUser.passwordHash) {
        const hash = await computeSaltedHash(repoUser.passwordSalt || PASSWORD_SALT, cleanPass);
        if (hash === repoUser.passwordHash) {
          setFailedAttempts(0);
          sessionStorage.removeItem(LOCKOUT_KEY);
          setCurrentUser(repoUser);
          saveSession(repoUser);
          return { success: true };
        }
      }

      // Check against authorized operations manager accounts
      const validManagerUsernames = ['opsmanager', 'operations', 'manager', 'ops', 'nimishgupta100'];
      if (validManagerUsernames.includes(cleanUser)) {
        const hash = await computeSaltedHash(PASSWORD_SALT, cleanPass);
        if (hash === COORDINATOR_PASSWORD_HASH) {
          const managerUser: User = {
            id: 'user-ops-manager',
            role: 'manager',
            name: 'Operations Manager',
            username: cleanUser,
            createdAt: 1730000000000,
          };
          setFailedAttempts(0);
          sessionStorage.removeItem(LOCKOUT_KEY);
          setCurrentUser(managerUser);
          saveSession(managerUser);
          return { success: true };
        }
      }

      registerFailedAttempt();
      return { success: false, error: 'Details did not match. Please check and try again.' };
    },
    [lockoutRemainingSeconds, registerFailedAttempt]
  );

  const requestOtp = useCallback(
    (phoneInput: string, expectedRole?: UserRole): { success: boolean; error?: string; maskedPhone?: string } => {
      if (lockoutRemainingSeconds > 0) {
        return {
          success: false,
          error: `Too many failed attempts. Please wait ${lockoutRemainingSeconds} seconds.`,
        };
      }

      const { valid, normalized } = normalizeIndianPhoneNumber(phoneInput);
      if (!valid) {
        return { success: false, error: 'Details did not match. Please check and try again.' };
      }

      const user = repository.getUserByLogin(normalized);
      if (!user || (user.role !== 'senior' && user.role !== 'family')) {
        registerFailedAttempt();
        return { success: false, error: 'Details did not match. Please check and try again.' };
      }

      if (expectedRole && user.role !== expectedRole) {
        registerFailedAttempt();
        return { success: false, error: 'Details did not match. Please check and try again.' };
      }

      return {
        success: true,
        maskedPhone: `+91 ${normalized.slice(0, 2)}•••• ••${normalized.slice(-2)}`,
      };
    },
    [lockoutRemainingSeconds, registerFailedAttempt]
  );

  const verifyOtp = useCallback(
    (phoneInput: string, otpInput: string): { success: boolean; error?: string; role?: UserRole } => {
      if (lockoutRemainingSeconds > 0) {
        return {
          success: false,
          error: `Too many failed attempts. Please wait ${lockoutRemainingSeconds} seconds.`,
        };
      }

      const { valid, normalized } = normalizeIndianPhoneNumber(phoneInput);
      if (!valid) {
        return { success: false, error: 'Details did not match. Please check and try again.' };
      }

      const user = repository.getUserByLogin(normalized);
      if (!user) {
        registerFailedAttempt();
        return { success: false, error: 'Details did not match. Please check and try again.' };
      }

      if (otpInput.trim() !== DEMO_OTP) {
        registerFailedAttempt();
        return { success: false, error: 'Details did not match. Please check and try again.' };
      }

      // Success
      setFailedAttempts(0);
      sessionStorage.removeItem(LOCKOUT_KEY);
      setCurrentUser(user);
      saveSession(user);
      return { success: true, role: user.role };
    },
    [lockoutRemainingSeconds, registerFailedAttempt]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    clearSession();
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

/** Returns the home route for a given user role */
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
