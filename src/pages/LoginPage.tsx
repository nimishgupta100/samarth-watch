import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, roleHomePath, normalizeIndianPhoneNumber } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { LanguageSelector } from '../components/common/LanguageSelector';
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
  Users,
  Heart,
  BarChart3,
  Sparkles,
} from 'lucide-react';

export type SelectedRole = 'family' | 'senior' | 'ops' | 'coordinator' | null;

const LABELS = {
  en: {
    pageTitle: 'Log in - Samarth Watch',
    metaDesc: 'Select your role to access Samarth Watch elder care coordination system.',
    introBadge: 'Role-Based Access',
    introHeading: 'Select your portal to continue',
    introSub: 'Samarth Watch provides dedicated, privacy-first interfaces tailored for each role in the care circle.',
    trust1: 'Senior controls family data sharing & visibility',
    trust2: 'Bilingual support in Hindi and English',
    trust3: 'High contrast & accessible navigation',

    // Role Selection Cards
    chooseRoleHeading: 'Choose your role to log in',
    chooseRoleSub: 'Select who you are signing in as to open your dedicated portal',
    
    roleFamilyTitle: 'Family Member',
    roleFamilyBadge: 'OTP Login',
    roleFamilyDesc: 'Track daily medicines, view care check-ins, and receive health summary reports for your loved one.',
    roleFamilyAction: 'Sign in as Family Member',

    roleSeniorTitle: 'Senior Citizen',
    roleSeniorBadge: 'Simple OTP',
    roleSeniorDesc: 'Large buttons, easy one-tap check-ins, medicine schedule, and instant emergency SOS access.',
    roleSeniorAction: 'Sign in as Senior Citizen',

    roleOpsTitle: 'Operations Manager',
    roleOpsBadge: 'Staff Access',
    roleOpsDesc: 'Real-time caseload monitoring, triage queue oversight, response SLAs, and model evaluation.',
    roleOpsAction: 'Sign in as Operations Manager',

    roleCoordTitle: 'Care Coordinator',
    roleCoordBadge: 'Staff Access',
    roleCoordDesc: 'Caseload triage queue, automated vitals analysis, escalation alerts, and follow-up tasks.',
    roleCoordAction: 'Sign in as Care Coordinator',

    // Dedicated Login Pages
    loginDedicatedHeading: '{role} Login',
    loginFamilySub: 'Enter your registered mobile number to receive a secure 6-digit code.',
    loginSeniorSub: 'Enter your 10-digit mobile number. We will send you a 6-digit code to sign in.',
    loginCoordSub: 'Enter your coordinator staff username and password to access your caseload.',
    loginOpsSub: 'Enter your operations manager username and password to access system analytics.',

    changeRole: 'Choose another role',
    identifierPhoneLabel: 'Mobile number',
    identifierPhonePlaceholder: 'e.g. 10-digit Indian number',
    identifierSeniorPlaceholder: '10-digit mobile number',
    identifierUserLabel: 'Username',
    identifierUserPlaceholder: 'Enter your username',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    otpStepLabel: 'OTP Verification',
    otpStepSub: 'Enter the 6-digit code sent to your mobile number',
    otpFieldLabel: '6-digit OTP Code',
    otpFieldPlaceholder: '• • • • • •',

    btnContinue: 'Send OTP',
    btnLogin: 'Log in',
    btnVerify: 'Verify and Sign In',
    btnBack: 'Change number',
    backToHome: 'Back to home',
    genericError: 'Details did not match. Please check and try again.',
    lockoutNotice: 'Too many failed attempts. Further attempts locked for {seconds} seconds.',
    dataStaysNotice: 'Demo data is cached locally; selected updates sync through Supabase.',
    secureSessionNotice: 'Secure sign-in powered by Supabase',
    showPass: 'Show password',
    hidePass: 'Hide password',
    clearData: 'Having trouble? Clear browser data and reload',
    footerText: 'Samarth Life Management Pvt Ltd : Assistive Early Warning Care System',
  },
  hi: {
    pageTitle: 'लॉग इन - समर्थ वॉच',
    metaDesc: 'समर्थ वॉच वरिष्ठ नागरिक देखभाल प्रणाली में प्रवेश हेतु अपनी भूमिका चुनें।',
    introBadge: 'भूमिका आधारित प्रवेश',
    introHeading: 'जारी रखने के लिए अपना पोर्टल चुनें',
    introSub: 'समर्थ वॉच देखभाल घेरे में प्रत्येक भूमिका के लिए समर्पित एवं सुरक्षित इंटरफ़ेस प्रदान करता है।',
    trust1: 'वरिष्ठ नागरिक तय करते हैं कि परिवार क्या देख सकता है',
    trust2: 'हिंदी और अंग्रेजी दोनों भाषाओं में उपलब्ध',
    trust3: 'वरिष्ठों हेतु बड़े अक्षर और सरल नेविगेशन',

    // Role Selection Cards
    chooseRoleHeading: 'लॉग इन हेतु अपनी भूमिका चुनें',
    chooseRoleSub: 'अपने समर्पित पोर्टल पर जाने के लिए अपनी भूमिका का चयन करें',

    roleFamilyTitle: 'परिवार सदस्य',
    roleFamilyBadge: 'ओटीपी लॉगिन',
    roleFamilyDesc: 'दैनिक दवाओं की स्थिति, चेक-इन अपडेट और स्वास्थ्य रिपोर्ट प्राप्त करें।',
    roleFamilyAction: 'परिवार सदस्य के रूप में साइन इन करें',

    roleSeniorTitle: 'वरिष्ठ नागरिक',
    roleSeniorBadge: 'सरल ओटीपी',
    roleSeniorDesc: 'बड़े बटन, सरल एक-टैप चेक-इन, दवाइयों का समय और आपातकालीन एसओएस।',
    roleSeniorAction: 'वरिष्ठ नागरिक के रूप में साइन इन करें',

    roleOpsTitle: 'संचालन प्रबंधक (OPT)',
    roleOpsBadge: 'स्टाफ लॉगिन',
    roleOpsDesc: 'रीयल-टाइम केसलोड निगरानी, क्यू प्रबंधन, रिस्पॉन्स एसएलए और मॉडल मूल्यांकन।',
    roleOpsAction: 'संचालन प्रबंधक के रूप में साइन इन करें',

    roleCoordTitle: 'केयर समन्वयक',
    roleCoordBadge: 'स्टाफ लॉगिन',
    roleCoordDesc: 'दैनिक प्राथमिकता सूची, स्वास्थ्य संकेतों का विश्लेषण और अनुवर्ती देखभाल कार्य।',
    roleCoordAction: 'केयर समन्वयक के रूप में साइन इन करें',

    // Dedicated Login Pages
    loginDedicatedHeading: '{role} लॉग इन',
    loginFamilySub: 'सुरक्षित 6-अंकीय कोड प्राप्त करने के लिए अपना पंजीकृत मोबाइल नंबर दर्ज करें।',
    loginSeniorSub: 'साइन इन करने के लिए अपना 10 अंकों का मोबाइल नंबर दर्ज करें।',
    loginCoordSub: 'केसलोड देखने के लिए अपना केयर समन्वयक यूज़रनेम और पासवर्ड दर्ज करें।',
    loginOpsSub: 'सिस्टम एनालिटिक्स देखने के लिए संचालन प्रबंधक यूज़रनेम और पासवर्ड दर्ज करें।',

    changeRole: 'अन्य भूमिका चुनें',
    identifierPhoneLabel: 'मोबाइल नंबर',
    identifierPhonePlaceholder: 'उदा. 10 अंकों का मोबाइल नंबर',
    identifierSeniorPlaceholder: '10 अंकों का मोबाइल नंबर',
    identifierUserLabel: 'यूज़रनेम',
    identifierUserPlaceholder: 'अपना यूज़रनेम दर्ज करें',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    otpStepLabel: 'ओटीपी सत्यापन',
    otpStepSub: 'अपने मोबाइल नंबर पर भेजा गया 6 अंकों का कोड दर्ज करें',
    otpFieldLabel: '6 अंकों का कोड',
    otpFieldPlaceholder: '• • • • • •',

    btnContinue: 'ओटीपी प्राप्त करें',
    btnLogin: 'लॉग इन करें',
    btnVerify: 'सत्यापित करें और साइन इन करें',
    btnBack: 'नंबर बदलें',
    backToHome: 'मुख्य पृष्ठ पर वापस',
    genericError: 'विवरण मेल नहीं खाते। कृपया जांचें और पुनः प्रयास करें।',
    lockoutNotice: 'बहुत अधिक असफल प्रयास। आगे के प्रयास {seconds} सेकंड के लिए रोक दिए गए हैं।',
    dataStaysNotice: 'डेमो डेटा डिवाइस पर कैश होता है; चुने हुए अपडेट Supabase से सिंक होते हैं।',
    secureSessionNotice: 'Supabase द्वारा सुरक्षित साइन-इन',
    showPass: 'पासवर्ड दिखाएं',
    hidePass: 'पासवर्ड छुपाएं',
    clearData: 'समस्या आ रही है? ब्राउज़र डेटा साफ़ करें और पुनः लोड करें',
    footerText: 'समर्थ लाइफ मैनेजमेंट प्रा. लि. : सहायक पूर्व-चेतावनी देखभाल प्रणाली',
  },
};

export const LoginPage: React.FC = () => {
  const { currentUser, loginCoordinator, loginManager, requestOtp, verifyOtp, lockoutRemainingSeconds } = useAuth();
  const { language, setLanguage, setRole } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const isHi = language === 'hi';
  const L = LABELS[isHi ? 'hi' : 'en'];

  // Parse role from URL query param (?role=family | senior | ops | coordinator)
  const roleParam = searchParams.get('role');
  const validRoles: SelectedRole[] = ['family', 'senior', 'ops', 'coordinator'];
  const activeRole: SelectedRole = validRoles.includes(roleParam as any) ? (roleParam as SelectedRole) : null;

  usePageTitle(
    activeRole
      ? `${activeRole === 'family' ? L.roleFamilyTitle : activeRole === 'senior' ? L.roleSeniorTitle : activeRole === 'ops' ? L.roleOpsTitle : L.roleCoordTitle} - ${L.pageTitle}`
      : L.pageTitle,
    L.metaDesc
  );

  // If already logged in, redirect to user's assigned role home immediately
  useEffect(() => {
    if (currentUser) {
      navigate(roleHomePath(currentUser.role), { replace: true });
    }
  }, [currentUser, navigate]);

  // Form states for dedicated login views
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Select a role and update URL param
  const handleSelectRole = (role: SelectedRole) => {
    setError('');
    setIdentifier('');
    setPassword('');
    setOtp('');
    setOtpStep(false);
    if (role) {
      setSearchParams({ role });
    } else {
      setSearchParams({});
    }
  };

  // Submission handler for dedicated login
  const handleDedicatedSubmit = async (e: React.FormEvent) => {
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

    // 1. Care Coordinator Login
    if (activeRole === 'coordinator') {
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

    // 2. Operations Manager Login
    if (activeRole === 'ops') {
      if (!password) {
        setError(L.genericError);
        return;
      }
      setLoading(true);
      try {
        const res = await loginManager(trimmed, password);
        if (res.success) {
          setRole('manager');
          navigate(roleHomePath('manager'), { replace: true });
        } else {
          setError(res.error || L.genericError);
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    // 3. Family Member or Senior Citizen (Phone OTP flow)
    const { valid, normalized } = normalizeIndianPhoneNumber(trimmed);
    if (!valid) {
      setError(L.genericError);
      return;
    }

    setLoading(true);
    try {
      const expectedRole = activeRole === 'family' ? 'family' : 'senior';
      const res = await requestOtp(normalized, expectedRole);
      if (res.success) {
        setOtpStep(true);
        setError('');
      } else {
        setError(res.error || L.genericError);
      }
    } finally {
      setLoading(false);
    }
  };

  // OTP verification handler
  const handleOtpSubmit = async (e: React.FormEvent) => {
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
    try {
      const res = await verifyOtp(identifier, otp);
      if (res.success && res.role) {
        setRole(res.role);
        navigate(roleHomePath(res.role), { replace: true });
      } else if (res.success) {
        navigate('/login', { replace: true });
      } else {
        setError(res.error || L.genericError);
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (r: SelectedRole): string => {
    switch (r) {
      case 'family':
        return L.roleFamilyTitle;
      case 'senior':
        return L.roleSeniorTitle;
      case 'ops':
        return L.roleOpsTitle;
      case 'coordinator':
        return L.roleCoordTitle;
      default:
        return '';
    }
  };

  const getRoleSubtitle = (r: SelectedRole): string => {
    switch (r) {
      case 'family':
        return L.loginFamilySub;
      case 'senior':
        return L.loginSeniorSub;
      case 'ops':
        return L.loginOpsSub;
      case 'coordinator':
        return L.loginCoordSub;
      default:
        return '';
    }
  };

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

            {/* Language Selector */}
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 relative flex items-center justify-center p-4 sm:p-6 lg:p-12 pb-safe">
        {/* Background photo with flat scrim */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <picture>
            <source srcSet="/images/login-bg.webp" type="image/webp" />
            <img
              src="/images/senior-indian.jpg"
              alt="Elderly Care"
              className="w-full h-full object-cover opacity-30"
            />
          </picture>
          <div className="absolute inset-0 bg-mint/80 backdrop-blur-2xs" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto">
          {/* =========================================================================
              VIEW 1: 4 SEPARATE ROLE SELECTION BUTTONS (Initial View)
             ========================================================================= */}
          {!activeRole ? (
            <div className="space-y-8 py-2">
              {/* Heading Banner */}
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cream text-forest border border-mint-border shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-forest" strokeWidth={1.75} />
                  <span>{L.introBadge}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-forest tracking-tight">
                  {L.chooseRoleHeading}
                </h1>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  {L.chooseRoleSub}
                </p>
              </div>

              {/* 4 Distinct Role Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 max-w-4xl mx-auto">
                {/* 1. Family Member */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('family')}
                  className="group text-left bg-cream hover:bg-cream-warm border border-mint-border hover:border-forest/40 rounded-2xl p-4 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2 active:scale-[0.98]"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-mint text-forest flex items-center justify-center shrink-0 border border-mint-border group-hover:scale-105 transition-transform">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-forest" strokeWidth={1.75} />
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-mint-deep text-forest border border-mint-border">
                        {L.roleFamilyBadge}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-forest group-hover:text-forest-dark transition-colors">
                        {L.roleFamilyTitle}
                      </h2>
                      <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mt-1">
                        {L.roleFamilyDesc}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-mint-border flex items-center justify-between text-xs font-bold text-forest group-hover:text-forest-dark">
                    <span>{L.roleFamilyAction}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 2. Senior Citizen */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('senior')}
                  className="group text-left bg-cream hover:bg-cream-warm border border-mint-border hover:border-forest/40 rounded-2xl p-4 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2 active:scale-[0.98]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-mint text-forest flex items-center justify-center shrink-0 border border-mint-border group-hover:scale-105 transition-transform">
                        <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-forest" strokeWidth={1.75} />
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-mint-deep text-forest border border-mint-border">
                        {L.roleSeniorBadge}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-forest group-hover:text-forest-dark transition-colors">
                        {L.roleSeniorTitle}
                      </h2>
                      <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mt-1.5">
                        {L.roleSeniorDesc}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-3 border-t border-mint-border flex items-center justify-between text-xs font-bold text-forest group-hover:text-forest-dark">
                    <span>{L.roleSeniorAction}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 3. Care Coordinator */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('coordinator')}
                  className="group text-left bg-cream hover:bg-cream-warm border border-mint-border hover:border-forest/40 rounded-2xl p-4 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2 active:scale-[0.98]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-mint text-forest flex items-center justify-center shrink-0 border border-mint-border group-hover:scale-105 transition-transform">
                        <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-forest" strokeWidth={1.75} />
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-mint-deep text-forest border border-mint-border">
                        {L.roleCoordBadge}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-forest group-hover:text-forest-dark transition-colors">
                        {L.roleCoordTitle}
                      </h2>
                      <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mt-1.5">
                        {L.roleCoordDesc}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-3 border-t border-mint-border flex items-center justify-between text-xs font-bold text-forest group-hover:text-forest-dark">
                    <span>{L.roleCoordAction}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 4. Operations Manager */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('ops')}
                  className="group text-left bg-cream hover:bg-cream-warm border border-mint-border hover:border-forest/40 rounded-2xl p-4 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2 active:scale-[0.98]"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-mint text-forest flex items-center justify-center shrink-0 border border-mint-border group-hover:scale-105 transition-transform">
                        <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-forest" strokeWidth={1.75} />
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-mint-deep text-forest border border-mint-border">
                        {L.roleOpsBadge}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-forest group-hover:text-forest-dark transition-colors">
                        {L.roleOpsTitle}
                      </h2>
                      <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mt-1">
                        {L.roleOpsDesc}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-mint-border flex items-center justify-between text-xs font-bold text-forest group-hover:text-forest-dark">
                    <span>{L.roleOpsAction}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>

              {/* Trust points */}
              <div className="pt-4 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-muted text-center">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
                  {L.trust1}
                </span>
                <span className="flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-forest" />
                  {L.trust2}
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-forest" />
                  {L.trust3}
                </span>
              </div>
            </div>
          ) : (
            /* =========================================================================
               VIEW 2: DEDICATED LOGIN PAGE FOR THE SELECTED ROLE
               ========================================================================= */
            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12">
              {/* Left Side: Context about this specific role */}
              <div className="w-full lg:w-1/2 space-y-5 text-left">
                <button
                  type="button"
                  onClick={() => handleSelectRole(null)}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold text-forest hover:text-forest-dark bg-cream border border-mint-border hover:bg-cream-warm transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{L.changeRole}</span>
                </button>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-mint-deep text-forest border border-mint-border">
                    {activeRole === 'family' && <Users className="w-3.5 h-3.5" />}
                    {activeRole === 'senior' && <Heart className="w-3.5 h-3.5" />}
                    {activeRole === 'coordinator' && <ShieldCheck className="w-3.5 h-3.5" />}
                    {activeRole === 'ops' && <BarChart3 className="w-3.5 h-3.5" />}
                    <span>{getRoleDisplayName(activeRole)}</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-extrabold text-forest tracking-tight leading-tight">
                    {L.loginDedicatedHeading.replace('{role}', getRoleDisplayName(activeRole))}
                  </h1>

                  <p className="text-sm sm:text-base text-ink-muted leading-relaxed max-w-md">
                    {getRoleSubtitle(activeRole)}
                  </p>
                </div>

                {/* Role-specific helper facts */}
                <div className="pt-2 space-y-3 border-t border-mint-border/80 max-w-md">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-md bg-mint-deep flex items-center justify-center text-forest shrink-0 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </div>
                    <span className="text-xs font-semibold text-ink leading-snug">{L.trust1}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-md bg-mint-deep flex items-center justify-center text-forest shrink-0 mt-0.5">
                      <Languages className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </div>
                    <span className="text-xs font-semibold text-ink leading-snug">{L.trust2}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-md bg-mint-deep flex items-center justify-center text-forest shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </div>
                    <span className="text-xs font-semibold text-ink leading-snug">{L.trust3}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Dedicated Form Card */}
              <div className="w-full max-w-md lg:w-1/2">
                <div className="frosted-login-card rounded-2xl border border-mint-border p-6 sm:p-8 shadow-md space-y-5 text-left bg-cream/95 backdrop-blur-md">
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3 border-b border-mint-border pb-4">
                    <div className="space-y-0.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-sage-dark">
                        {otpStep ? L.otpStepLabel : getRoleDisplayName(activeRole)}
                      </div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-forest tracking-tight">
                        {otpStep ? L.otpStepLabel : L.loginDedicatedHeading.replace('{role}', getRoleDisplayName(activeRole))}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectRole(null)}
                      className="text-xs font-bold text-ink-muted hover:text-forest transition-colors p-1.5 rounded-lg border border-mint-border bg-mint hover:bg-mint-deep"
                      title={L.changeRole}
                      aria-label={L.changeRole}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
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

                  {/* Form Body */}
                  {!otpStep ? (
                    <form onSubmit={handleDedicatedSubmit} className="space-y-4">
                      {/* Coordinator & Ops: Username & Password */}
                      {activeRole === 'coordinator' || activeRole === 'ops' ? (
                        <>
                          <div className="space-y-1.5">
                            <label
                              htmlFor="dedicated-username"
                              className="block text-xs font-bold text-ink-muted uppercase tracking-wider"
                            >
                              {L.identifierUserLabel}
                            </label>
                            <div className="relative">
                              <User className="w-4 h-4 text-forest absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                              <input
                                id="dedicated-username"
                                type="text"
                                autoComplete="username"
                                enterKeyHint="next"
                                value={identifier}
                                onChange={(e) => {
                                  setIdentifier(e.target.value);
                                  setError('');
                                }}
                                placeholder={L.identifierUserPlaceholder}
                                required
                                disabled={lockoutRemainingSeconds > 0 || loading}
                                className="w-full pl-10 pr-4 py-3 min-h-[44px] text-base sm:text-sm bg-cream border border-mint-border rounded-lg text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-colors"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label
                              htmlFor="dedicated-password"
                              className="block text-xs font-bold text-ink-muted uppercase tracking-wider"
                            >
                              {L.passwordLabel}
                            </label>
                            <div className="relative">
                              <Lock className="w-4 h-4 text-forest absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                              <input
                                id="dedicated-password"
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
                        </>
                      ) : (
                        /* Family & Senior: Phone Number */
                        <div className="space-y-1.5">
                          <label
                            htmlFor="dedicated-phone"
                            className="block text-xs font-bold text-ink-muted uppercase tracking-wider"
                          >
                            {L.identifierPhoneLabel}
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-forest absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                            <input
                              id="dedicated-phone"
                              type="tel"
                              inputMode="tel"
                              autoComplete="tel"
                              enterKeyHint="go"
                              value={identifier}
                              onChange={(e) => {
                                setIdentifier(e.target.value);
                                setError('');
                              }}
                              placeholder={activeRole === 'senior' ? L.identifierSeniorPlaceholder : L.identifierPhonePlaceholder}
                              required
                              disabled={lockoutRemainingSeconds > 0 || loading}
                              className={`w-full pl-10 pr-4 py-3 min-h-[44px] ${
                                activeRole === 'senior' ? 'text-lg font-bold py-3.5 min-h-[50px]' : 'text-base sm:text-sm'
                              } bg-cream border border-mint-border rounded-lg text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-colors`}
                            />
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={lockoutRemainingSeconds > 0 || loading}
                        className={`w-full min-h-[48px] ${
                          activeRole === 'senior' ? 'min-h-[52px] text-base' : 'text-sm'
                        } px-6 py-3 rounded-xl bg-forest hover:bg-forest-dark active:bg-forest-dark disabled:opacity-50 text-cream font-bold flex items-center justify-center gap-2 shadow-xs transition-colors`}
                      >
                        <span>
                          {activeRole === 'coordinator' || activeRole === 'ops' ? L.btnLogin : L.btnContinue}
                        </span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </form>
                  ) : (
                    /* OTP Verification Step for Family & Senior */
                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="dedicated-otp"
                          className="block text-xs font-bold text-ink-muted uppercase tracking-wider"
                        >
                          {L.otpFieldLabel}
                        </label>
                        <input
                          id="dedicated-otp"
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
                          className="w-full px-4 py-3 min-h-[48px] text-center tracking-widest font-mono text-2xl bg-cream border border-mint-border rounded-lg text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-colors font-bold"
                        />
                      </div>

                      <div className="space-y-2 pt-1">
                        <button
                          type="submit"
                          disabled={lockoutRemainingSeconds > 0 || loading}
                          className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-forest hover:bg-forest-dark active:bg-forest-dark disabled:opacity-50 text-cream font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                        >
                          <span>{L.btnVerify}</span>
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setOtpStep(false);
                            setOtp('');
                            setError('');
                          }}
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
          )}
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
