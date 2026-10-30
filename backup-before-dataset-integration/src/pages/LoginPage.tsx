import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, roleHomePath, normalizeIndianPhoneNumber } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  Activity,
  Lock,
  Phone,
  User,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  Languages,
  Clock,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

const LABELS = {
  en: {
    pageTitle: 'Log in - Samarth Watch',
    metaDesc: 'Log in to Samarth Watch elder care coordination system.',
    introLabel: 'Care Coordination and Family Portal',
    introHeading: 'Log in to Samarth Watch',
    introLine1: 'Access daily medicine tracking, check-ins, and health oversight.',
    introLine2: 'Sign in with your registered username or mobile number.',
    fact1: 'The senior decides what family can see',
    fact2: 'Hindi and English',
    fact3: 'Large text and simple steps for seniors',
    cardTitle: 'Log in',
    cardSubtitle: 'Enter your credentials to access your dashboard',
    identifierLabel: 'Username or mobile number',
    identifierPlaceholder: 'e.g. nimishgupta100 or 7452009877',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    otpStepLabel: 'OTP Verification',
    otpStepSub: 'Enter the 4-digit code sent to your number',
    otpFieldLabel: 'OTP Code',
    otpFieldPlaceholder: '4-digit code',
    btnContinue: 'Continue',
    btnLogin: 'Log in',
    btnVerify: 'Verify and Sign In',
    btnBack: 'Use a different username or number',
    backToHome: 'Back to home',
    genericError: 'Details did not match. Please check and try again.',
    lockoutNotice: 'Too many failed attempts. Further attempts locked for {seconds} seconds.',
    dataStaysNotice: 'Your information stays on this device in this demo',
    secureSessionNotice: 'Secure local session on this device',
    showPass: 'Show password',
    hidePass: 'Hide password',
    clearData: 'Having trouble? Clear browser data and reload',
    footerText: 'Samarth Life Management Pvt Ltd : Assistive Early Warning Care System',
  },
  hi: {
    pageTitle: 'लॉग इन - समर्थ वॉच',
    metaDesc: 'समर्थ वॉच वरिष्ठ नागरिक देखभाल प्रणाली में लॉग इन करें।',
    introLabel: 'केयर समन्वय एवं परिवार पोर्टल',
    introHeading: 'समर्थ वॉच में लॉग इन करें',
    introLine1: 'दैनिक दवाइयों की स्थिति, चेक-इन और स्वास्थ्य निगरानी प्राप्त करें।',
    introLine2: 'अपने पंजीकृत यूज़रनेम या मोबाइल नंबर से साइन इन करें।',
    fact1: 'वरिष्ठ तय करते हैं कि परिवार क्या देख सकता है',
    fact2: 'हिंदी और अंग्रेजी में उपलब्ध',
    fact3: 'वरिष्ठों के लिए बड़े अक्षर और सरल चरण',
    cardTitle: 'लॉग इन',
    cardSubtitle: 'अपने डैशबोर्ड में प्रवेश के लिए विवरण दर्ज करें',
    identifierLabel: 'यूज़रनेम या मोबाइल नंबर',
    identifierPlaceholder: 'उदा. nimishgupta100 या 7452009877',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    otpStepLabel: 'ओटीपी सत्यापन',
    otpStepSub: 'अपने नंबर पर भेजा गया 4 अंकों का कोड दर्ज करें',
    otpFieldLabel: 'ओटीपी कोड',
    otpFieldPlaceholder: '4 अंकों का कोड',
    btnContinue: 'आगे बढ़ें',
    btnLogin: 'लॉग इन करें',
    btnVerify: 'सत्यापित करें और साइन इन करें',
    btnBack: 'अन्य यूज़रनेम या नंबर का उपयोग करें',
    backToHome: 'मुख्य पृष्ठ पर वापस',
    genericError: 'विवरण मेल नहीं खाते। कृपया जांचें और पुनः प्रयास करें।',
    lockoutNotice: 'बहुत अधिक असफल प्रयास। आगे के प्रयास {seconds} सेकंड के लिए रोक दिए गए हैं।',
    dataStaysNotice: 'इस डेमो में आपकी जानकारी इसी डिवाइस पर सुरक्षित रहती है',
    secureSessionNotice: 'इस डिवाइस पर सुरक्षित स्थानीय सत्र',
    showPass: 'पासवर्ड दिखाएं',
    hidePass: 'पासवर्ड छुपाएं',
    clearData: 'समस्या आ रही है? ब्राउज़र डेटा साफ़ करें और पुनः लोड करें',
    footerText: 'समर्थ लाइफ मैनेजमेंट प्रा. लि. : सहायक पूर्व-चेतावनी देखभाल प्रणाली',
  },
};

export const LoginPage: React.FC = () => {
  const { currentUser, loginCoordinator, requestOtp, verifyOtp, lockoutRemainingSeconds } = useAuth();
  const { language, setLanguage, setRole } = useApp();
  const navigate = useNavigate();

  const isHi = language === 'hi';
  const L = LABELS[isHi ? 'hi' : 'en'];

  usePageTitle(L.pageTitle, L.metaDesc);

  // If already logged in, redirect to user's assigned role home immediately
  useEffect(() => {
    if (currentUser) {
      navigate(roleHomePath(currentUser.role), { replace: true });
    }
  }, [currentUser, navigate]);

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if identifier has letters (coordinator username)
  const isCoordinatorUsername = (val: string): boolean => {
    return /[a-zA-Z]/.test(val.trim());
  };

  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (lockoutRemainingSeconds > 0) {
      setError(L.lockoutNotice.replace('{seconds}', String(lockoutRemainingSeconds)));
      return;
    }

    const trimmed = identifier.trim();
    if (!trimmed) {
      setError(L.genericError);
      return;
    }

    // Coordinator login with username and password
    if (isCoordinatorUsername(trimmed)) {
      if (!password) {
        setError(L.genericError);
        return;
      }
      setLoading(true);
      try {
        const res = await loginCoordinator(trimmed, password);
        if (res.success) {
          setRole('coordinator');
          navigate(roleHomePath('coordinator'), { replace: true });
        } else {
          setError(res.error || L.genericError);
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    // Senior or Family login via phone number
    const { valid, normalized } = normalizeIndianPhoneNumber(trimmed);
    if (!valid) {
      setError(L.genericError);
      return;
    }

    setLoading(true);
    const res = requestOtp(normalized);
    setLoading(false);

    if (res.success) {
      setOtpStep(true);
      setError('');
    } else {
      setError(res.error || L.genericError);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (lockoutRemainingSeconds > 0) {
      setError(L.lockoutNotice.replace('{seconds}', String(lockoutRemainingSeconds)));
      return;
    }

    if (!otp.trim()) {
      setError(L.genericError);
      return;
    }

    setLoading(true);
    const res = verifyOtp(identifier, otp);
    setLoading(false);

    if (res.success) {
      const role = (res as { success: boolean; role?: string }).role;
      if (role) {
        setRole(role as any);
        navigate(roleHomePath(role as import('../data/schema').UserRole), { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    } else {
      setError(res.error || L.genericError);
    }
  };

  const resetForm = () => {
    setOtpStep(false);
    setOtp('');
    setError('');
  };

  const isUsernameInput = isCoordinatorUsername(identifier);

  return (
    <div className="min-h-dvh flex flex-col justify-between bg-mint text-ink font-sans selection:bg-mint-deep selection:text-forest">
      {/* Top Header */}
      <header className="w-full border-b border-mint-border bg-cream/90 backdrop-blur-xs sticky top-0 z-20 pt-safe">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo link back to landing page */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold text-forest hover:opacity-90 transition-opacity"
            aria-label="Samarth Watch Home"
          >
            <div className="w-9 h-9 rounded-lg bg-forest text-cream flex items-center justify-center shrink-0 shadow-xs">
              <Activity className="w-5 h-5 text-cream" aria-hidden="true" strokeWidth={1.75} />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-forest">
              Samarth <span className="text-sage-dark font-medium">Watch</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs font-semibold text-ink-muted hover:text-forest transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{L.backToHome}</span>
            </Link>

            {/* Language Toggle */}
            <div className="flex items-center gap-1 bg-mint p-1 rounded-lg border border-mint-border text-xs font-bold">
              <Languages className="w-3.5 h-3.5 text-forest ml-1" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  !isHi ? 'bg-forest text-cream shadow-xs' : 'text-ink-muted hover:text-forest'
                }`}
                aria-pressed={!isHi}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded font-hindi transition-colors ${
                  isHi ? 'bg-forest text-cream shadow-xs' : 'text-ink-muted hover:text-forest'
                }`}
                aria-pressed={isHi}
              >
                हिं
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container: Desktop split with photo scrim, mobile card-first */}
      <main className="flex-1 relative flex items-center justify-center p-4 sm:p-6 lg:p-12 pb-safe">
        {/* Background photo with flat scrim */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <picture>
            <source srcSet="/images/login-bg.webp" type="image/webp" />
            <img
              src="/images/login-bg.svg"
              alt=""
              className="w-full h-full object-cover opacity-60"
            />
          </picture>
          <div className="absolute inset-0 bg-mint/80 backdrop-blur-2xs" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left Side Intro (on desktop) / Bottom on mobile */}
          <div className="w-full lg:w-1/2 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-cream text-forest border border-mint-border">
              <ShieldCheck className="w-3.5 h-3.5 text-forest" strokeWidth={1.75} />
              <span>{L.introLabel}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-forest tracking-tight leading-tight">
              {L.introHeading}
            </h1>

            <p className="text-sm sm:text-base text-ink-muted leading-relaxed max-w-md">
              {L.introLine1} {L.introLine2}
            </p>

            {/* 3 Facts */}
            <div className="pt-2 space-y-3 border-t border-mint-border/80 max-w-md">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-mint-deep flex items-center justify-center text-forest shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
                </div>
                <span className="text-xs font-semibold text-ink leading-snug">{L.fact1}</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-mint-deep flex items-center justify-center text-forest shrink-0 mt-0.5">
                  <Languages className="w-3.5 h-3.5" strokeWidth={1.75} />
                </div>
                <span className="text-xs font-semibold text-ink leading-snug">{L.fact2}</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-mint-deep flex items-center justify-center text-forest shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                </div>
                <span className="text-xs font-semibold text-ink leading-snug">{L.fact3}</span>
              </div>
            </div>
          </div>

          {/* Right Side Floating Login Card (Card-first on phone) */}
          <div className="w-full max-w-md lg:w-1/2">
            <div className="frosted-login-card rounded-xl border border-mint-border p-6 sm:p-8 shadow-md space-y-5 text-left">
              {/* Card Header */}
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-forest tracking-tight">
                  {otpStep ? L.otpStepLabel : L.cardTitle}
                </h2>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {otpStep ? L.otpStepSub : L.cardSubtitle}
                </p>
              </div>

              {/* Lockout Warning */}
              {lockoutRemainingSeconds > 0 && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="p-3.5 rounded-lg bg-amber-50 border border-amber-300 text-alert-amber text-xs flex items-center gap-2.5"
                >
                  <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{L.lockoutNotice.replace('{seconds}', String(lockoutRemainingSeconds))}</span>
                </div>
              )}

              {/* Error Message with aria-live */}
              {error && lockoutRemainingSeconds === 0 && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-alert-red text-xs"
                >
                  {error}
                </div>
              )}

              {!otpStep ? (
                /* Primary Login Form */
                <form onSubmit={handleIdentifierSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="login-identifier"
                      className="block text-xs font-bold text-ink-muted uppercase tracking-wider"
                    >
                      {L.identifierLabel}
                    </label>
                    <div className="relative">
                      {isCoordinatorUsername(identifier) ? (
                        <User className="w-4 h-4 text-forest absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                      ) : (
                        <Phone className="w-4 h-4 text-forest absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                      )}
                      <input
                        id="login-identifier"
                        type="text"
                        autoComplete="username"
                        enterKeyHint={isUsernameInput ? 'next' : 'done'}
                        value={identifier}
                        onChange={(e) => {
                          setIdentifier(e.target.value);
                          setError('');
                        }}
                        placeholder={L.identifierPlaceholder}
                        required
                        disabled={lockoutRemainingSeconds > 0 || loading}
                        className="w-full pl-10 pr-4 py-3 min-h-[44px] text-base sm:text-sm bg-cream border border-mint-border rounded-lg text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-colors"
                      />
                    </div>
                  </div>

                  {/* Show password field only when coordinator username is entered */}
                  {isUsernameInput && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="login-password"
                        className="block text-xs font-bold text-ink-muted uppercase tracking-wider"
                      >
                        {L.passwordLabel}
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-forest absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                        <input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          enterKeyHint="go"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                          }}
                          placeholder={L.passwordPlaceholder}
                          required
                          disabled={lockoutRemainingSeconds > 0 || loading}
                          className="w-full pl-10 pr-12 py-3 min-h-[44px] text-base sm:text-sm bg-cream border border-mint-border rounded-lg text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-ink-muted hover:text-forest transition-colors"
                          aria-label={showPassword ? L.hidePass : L.showPass}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={lockoutRemainingSeconds > 0 || loading}
                    className="w-full min-h-[48px] px-6 py-3 rounded-lg bg-forest hover:bg-forest-dark active:bg-forest-dark disabled:opacity-50 text-cream font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <span>{isUsernameInput ? L.btnLogin : L.btnContinue}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </form>
              ) : (
                /* Simulated OTP Verification Step */
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="login-otp"
                      className="block text-xs font-bold text-ink-muted uppercase tracking-wider"
                    >
                      {L.otpFieldLabel}
                    </label>
                    <input
                      id="login-otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      enterKeyHint="done"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        setError('');
                      }}
                      placeholder={L.otpFieldPlaceholder}
                      required
                      autoFocus
                      disabled={lockoutRemainingSeconds > 0 || loading}
                      className="w-full px-4 py-3 min-h-[48px] text-center tracking-widest font-mono text-xl bg-cream border border-mint-border rounded-lg text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-colors"
                    />
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      type="submit"
                      disabled={lockoutRemainingSeconds > 0 || loading}
                      className="w-full min-h-[48px] px-6 py-3 rounded-lg bg-forest hover:bg-forest-dark active:bg-forest-dark disabled:opacity-50 text-cream font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <span>{L.btnVerify}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full min-h-[44px] px-4 py-2 text-xs font-bold text-ink-muted hover:text-forest transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{L.btnBack}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Security & Device Storage Notice */}
              <div className="pt-3 border-t border-mint-border space-y-1.5 text-center text-xs text-ink-muted">
                <div className="flex items-center justify-center gap-1.5 text-forest font-semibold">
                  <Lock className="w-3.5 h-3.5 text-forest" aria-hidden="true" />
                  <span>{L.secureSessionNotice}</span>
                </div>
                <p className="text-[11px] text-ink-faint">
                  {L.dataStaysNotice}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-ink-muted border-t border-mint-border pb-safe px-4 bg-cream/90">
        <p>{L.footerText}</p>
        <div className="mt-2">
          <button
            type="button"
            onClick={() => {
              try {
                sessionStorage.clear();
                const keysToRemove: string[] = [];
                for (let i = 0; i < localStorage.length; i++) {
                  const k = localStorage.key(i);
                  if (k && (k.startsWith('samarth_') || k.startsWith('samarthWatch_'))) {
                    keysToRemove.push(k);
                  }
                }
                keysToRemove.forEach((k) => localStorage.removeItem(k));
              } catch {
                /* ignore */
              }
              window.location.reload();
            }}
            className="text-[11px] text-ink-muted hover:text-forest underline underline-offset-2 transition-colors cursor-pointer"
          >
            {L.clearData}
          </button>
        </div>
      </footer>
    </div>
  );
};
