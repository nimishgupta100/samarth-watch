import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, roleHomePath } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { LanguageSelector } from '../components/common/LanguageSelector';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Languages,
  Eye,
  CheckCircle2,
  Pill,
  AlertTriangle,
  Mic,
  Watch,
  FileText,
  UserCheck,
  Menu,
  X,
  Volume2,
  Heart,
  Users,
  Compass,
} from 'lucide-react';

const COPY = {
  en: {
    pageTitle: 'Samarth Watch - Elder Care Coordination and Early Warning',
    metaDesc: 'Know who needs a call today. Samarth Watch brings medicine, check-ins, voice notes and wearable readings into one daily list.',
    brand: 'Samarth Watch',
    navFeatures: 'Features',
    navHowItWorks: 'How it works',
    navAbout: 'About',
    navCredits: 'Credits',
    navTerms: 'Terms',
    navPrivacy: 'Privacy Policy',
    btnLogin: 'Log in',
    btnDashboard: 'Open my dashboard',
    heroTag: 'For Care Coordinators and families',
    heroHeadline: 'Know who needs a call today.',
    heroSub:
      'Samarth Watch brings medicine, check-ins, voice notes and wearable readings into one daily list, so a Care Coordinator can reach a senior before a small problem grows.',
    btnSeeHow: 'See how it works',
    fact1: 'The senior decides what family can see',
    fact2: 'Hindi and English',
    fact3: 'Large text and simple steps for seniors',
    featuresTitle: 'Thoughtful features for peaceful living',
    featuresSub: 'Clear, gentle assistance designed for real Indian households.',
    feature1Title: 'Medicine reminders',
    feature1Text:
      'If a dose is not confirmed within 30 minutes, the family and coordinator are told. If it is taken, nobody is bothered.',
    feature2Title: 'One-tap SOS',
    feature2Text:
      'One tap sends an alert with location to the coordinator and the family together.',
    feature3Title: 'Voice notes',
    feature3Text:
      'A senior speaks. Only their own coordinator receives it, with a short summary.',
    feature3Tag: 'Summary is simulated in this prototype',
    feature4Title: 'Health readings',
    feature4Text:
      "Readings from a band or watch are compared with the senior's own usual, not a general average.",
    feature4Tag: 'Device data is simulated in this prototype',
    feature5Title: 'Family reports',
    feature5Text:
      'A daily or weekly report in plain language, with a button to get it whenever needed.',
    feature6Title: 'Privacy and consent',
    feature6Text:
      'The senior controls what the family sees. Emergency alerts are the only exception, and they share only the essentials.',
    howTitle: 'How it works for everyone',
    howSeniorTitle: 'Senior',
    howSeniorText:
      'One question or one action per screen, big buttons, a Listen button, an SOS button always visible. Works in the phone browser.',
    howFamilyTitle: 'Family',
    howFamilyText:
      "Today's medicine status, alerts, reports and the coordinator's details.",
    howCoordTitle: 'Care Coordinator',
    howCoordText:
      'A ranked list of who needs attention, the reason for each, and a suggested next step.',
    splitHeading: 'Made for people who do not use apps',
    splitLine1: 'Large text and calm contrast built for elderly eyes without confusion.',
    splitLine2: 'Voice support with natural Indian language read-aloud at any moment.',
    splitLine3: 'Clear everyday language with zero clinical jargon or complex menus.',
    splitBrowserNote: 'Works in the phone browser without installing anything.',
    honestNote:
      'This is a prototype running on synthetic data. It is not a medical device. It flags risk to a human and never diagnoses.',
    ctaHeading: 'Log in to continue',
    ctaSub: 'Access your tailored dashboard for Care Coordinators, seniors or families.',
    footerLegal: 'Prototype on synthetic data. Not a medical device.',
    footerCopyright: 'Samarth Life Management Pvt Ltd',
  },
  hi: {
    pageTitle: 'समर्थ वॉच - वरिष्ठ नागरिक देखभाल एवं पूर्व-चेतावनी प्रणाली',
    metaDesc: 'जानिए आज किसे कॉल की आवश्यकता है। समर्थ वॉच दवाइयों, चेक-इन, वॉइस नोट्स और वियरेबल रीडिंग्स को एक दैनिक सूची में लाता है।',
    brand: 'समर्थ वॉच',
    navFeatures: 'विशेषताएं',
    navHowItWorks: 'यह कैसे कार्य करता है',
    navAbout: 'हमारे बारे में',
    navCredits: 'चित्र श्रेय',
    navTerms: 'नियम व शर्तें',
    navPrivacy: 'गोपनीयता नीति',
    btnLogin: 'साइन इन करें',
    btnDashboard: 'डैशबोर्ड खोलें',
    heroTag: 'केयर कोऑर्डिनेटर और परिवारों के लिए',
    heroHeadline: 'जानिए आज किसे कॉल की आवश्यकता है।',
    heroSub:
      'समर्थ वॉच दवाइयों, चेक-इन, वॉइस नोट्स और वियरेबल रीडिंग्स को एक दैनिक सूची में लाता है, ताकि किसी छोटी समस्या के बढ़ने से पहले केयर कोऑर्डिनेटर वरिष्ठ नागरिक तक पहुँच सके।',
    btnSeeHow: 'देखें यह कैसे कार्य करता है',
    fact1: 'वरिष्ठ तय करते हैं कि परिवार क्या देख सकता है',
    fact2: 'हिंदी और अंग्रेजी में उपलब्ध',
    fact3: 'वरिष्ठों के लिए बड़े अक्षर और सरल चरण',
    featuresTitle: 'शांत और सुरक्षित जीवन के लिए संवेदनशील सुविधाएं',
    featuresSub: 'भारतीय परिवारों के लिए विशेष रूप से तैयार की गई सरल देखभाल।',
    feature1Title: 'दवाइयों की याद दिलाना',
    feature1Text:
      'यदि 30 मिनट के भीतर खुराक की पुष्टि नहीं होती, तो परिवार और कोऑर्डिनेटर को सूचित किया जाता है। यदि दवा ले ली गई है, तो किसी को परेशान नहीं किया जाता।',
    feature2Title: 'एक-टैप एसओएस',
    feature2Text:
      'केवल एक टैप से स्थान की जानकारी सहित तुरंत अलर्ट कोऑर्डिनेटर और परिवार दोनों को भेजा जाता है।',
    feature3Title: 'वॉइस नोट्स',
    feature3Text:
      'वरिष्ठ नागरिक बोलकर संदेश भेजते हैं। केवल उनके अपने कोऑर्डिनेटर को संक्षिप्त सारांश के साथ संदेश मिलता है।',
    feature3Tag: 'इस प्रोटोटाइप में सारांश सिम्युलेटेड है',
    feature4Title: 'स्वास्थ्य रीडिंग्स',
    feature4Text:
      'स्मार्ट बैंड या घड़ी की रीडिंग्स की तुलना किसी सामान्य औसत से नहीं, बल्कि वरिष्ठ नागरिक के अपने सामान्य स्तर से की जाती है।',
    feature4Tag: 'इस प्रोटोटाइप में डिवाइस डेटा सिम्युलेटेड है',
    feature5Title: 'पारिवारिक रिपोर्ट',
    feature5Text:
      'सरल भाषा में दैनिक या साप्ताहिक रिपोर्ट, जिसे आवश्यकता पड़ने पर एक बटन दबाकर कभी भी प्राप्त किया जा सकता है।',
    feature6Title: 'गोपनीयता और सहमति',
    feature6Text:
      'वरिष्ठ नागरिक स्वयं नियंत्रित करते हैं कि परिवार क्या देख सकता है। आपातकालीन अलर्ट ही एकमात्र अपवाद हैं, और वे भी केवल आवश्यक जानकारी साझा करते हैं।',
    howTitle: 'यह प्रत्येक व्यक्ति के लिए कैसे कार्य करता है',
    howSeniorTitle: 'वरिष्ठ नागरिक',
    howSeniorText:
      'प्रत्येक स्क्रीन पर केवल एक प्रश्न या क्रिया, बड़े बटन, सुनने का विकल्प और हमेशा दिखाई देने वाला एसओएस बटन। फोन के ब्राउज़र में कार्य करता है।',
    howFamilyTitle: 'परिवार',
    howFamilyText:
      'आज की दवाइयों की स्थिति, जरूरी अलर्ट, स्वास्थ्य रिपोर्ट और केयर कोऑर्डिनेटर का विवरण।',
    howCoordTitle: 'केयर कोऑर्डिनेटर',
    howCoordText:
      'ध्यान चाहने वाले वरिष्ठों की प्राथमिकता सूची, प्रत्येक का कारण, और अगला सुझाई गई कार्यवाही।',
    splitHeading: 'उन लोगों के लिए निर्मित जो ऐप्स का उपयोग नहीं करते',
    splitLine1: 'बुजुर्गों की आंखों के अनुकूल बड़े अक्षर और आरामदायक कंट्रास्ट।',
    splitLine2: 'किसी भी क्षण प्राकृतिक भारतीय भाषा में बोलकर सुनाने की सुविधा।',
    splitLine3: 'कठिन चिकित्सकीय शब्दावली या जटिल मेनू के बिना सरल भाषा।',
    splitBrowserNote: 'बिना कुछ डाउनलोड किए सीधे फोन के ब्राउज़र में कार्य करता है।',
    honestNote:
      'यह सिंथेटिक डेटा पर चलने वाला प्रोटोटाइप है। यह कोई मेडिकल डिवाइस नहीं है। यह मानव सहायक को जोखिम का संकेत देता है और कभी निदान नहीं करता।',
    ctaHeading: 'जारी रखने के लिए साइन इन करें',
    ctaSub: 'केयर कोऑर्डिनेटर, वरिष्ठ नागरिक या परिवार के रूप में अपने डैशबोर्ड में प्रवेश करें।',
    footerLegal: 'सिंथेटिक डेटा पर प्रोटोटाइप। कोई मेडिकल डिवाइस नहीं।',
    footerCopyright: 'समर्थ लाइफ मैनेजमेंट प्रा. लि.',
  },
};

export const LandingPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { language, setLanguage } = useApp();
  const navigate = useNavigate();

  const isHi = language === 'hi';
  const t = COPY[isHi ? 'hi' : 'en'];

  usePageTitle(t.pageTitle, t.metaDesc);

  // Auto-redirect senior citizen to their dedicated home if already logged in
  useEffect(() => {
    if (currentUser?.role === 'senior') {
      navigate('/senior-home', { replace: true });
    }
  }, [currentUser, navigate]);

  // Mobile drawer state
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close drawer on Escape or outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleDashboardClick = () => {
    if (currentUser) {
      navigate(roleHomePath(currentUser.role));
    } else {
      navigate('/login');
    }
  };

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-mint text-ink font-sans selection:bg-mint-deep selection:text-forest">
      {/* Skip to Content Accessibility Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-forest focus:text-cream focus:rounded-md focus:shadow-md"
      >
        {isHi ? 'मुख्य सामग्री पर जाएं' : 'Skip to content'}
      </a>

      {/* ── Top Bar ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-xs border-b border-mint-border pt-safe">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo Mark and Brand */}
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

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-ink-muted" aria-label="Main navigation">
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="hover:text-forest transition-colors cursor-pointer"
            >
              {t.navFeatures}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-forest transition-colors cursor-pointer"
            >
              {t.navHowItWorks}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="hover:text-forest transition-colors cursor-pointer"
            >
              {t.navAbout}
            </button>
          </nav>

          {/* Right Action: Language Selector & Auth Button */}
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSelector />

            {/* Primary Action Button */}
            {currentUser ? (
              <button
                type="button"
                onClick={handleDashboardClick}
                className="px-4 py-2 min-h-[44px] text-xs font-bold rounded-lg bg-forest text-cream hover:bg-forest-dark transition-colors shadow-xs inline-flex items-center gap-1.5"
              >
                <span>{t.btnDashboard}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 min-h-[44px] text-xs font-bold rounded-lg bg-forest text-cream hover:bg-forest-dark transition-colors shadow-xs inline-flex items-center gap-1.5"
              >
                <span>{t.btnLogin}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-forest hover:bg-mint transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center border border-mint-border"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer (trap focus, closes on escape, outside tap, route change) */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex justify-end bg-ink/40 backdrop-blur-xs">
          <div
            ref={drawerRef}
            className="w-full max-w-xs bg-cream h-full p-6 shadow-xl flex flex-col justify-between border-l border-mint-border pt-safe pb-safe"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-mint-border">
                <span className="font-extrabold text-forest text-base">Samarth Watch</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="p-1 rounded-md text-ink-muted hover:text-forest"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col space-y-4 text-base font-bold text-ink">
                <button
                  type="button"
                  onClick={() => scrollToSection('features')}
                  className="text-left py-2 hover:text-forest transition-colors"
                >
                  {t.navFeatures}
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-left py-2 hover:text-forest transition-colors"
                >
                  {t.navHowItWorks}
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('about')}
                  className="text-left py-2 hover:text-forest transition-colors"
                >
                  {t.navAbout}
                </button>
                <Link
                  to="/credits"
                  onClick={() => setMenuOpen(false)}
                  className="py-2 hover:text-forest transition-colors"
                >
                  {t.navCredits}
                </Link>
              </nav>

              <div className="pt-4 border-t border-mint-border space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
                  Language
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${
                      !isHi
                        ? 'bg-forest text-cream border-forest'
                        : 'bg-mint text-ink border-mint-border'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('hi')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border font-hindi transition-colors ${
                      isHi
                        ? 'bg-forest text-cream border-forest'
                        : 'bg-mint text-ink border-mint-border'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6">
              {currentUser ? (
                <button
                  type="button"
                  onClick={handleDashboardClick}
                  className="w-full py-3 min-h-[48px] font-bold text-sm rounded-lg bg-forest text-cream hover:bg-forest-dark transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>{t.btnDashboard}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full py-3 min-h-[48px] font-bold text-sm rounded-lg bg-forest text-cream hover:bg-forest-dark transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>{t.btnLogin}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <main id="main-content" className="flex-1 w-full">
        {/* ── Section 1: Hero ───────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-mint pt-6 pb-12 sm:pt-14 sm:pb-24 border-b border-mint-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Headlines and Actions */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-mint-deep text-forest border border-mint-border">
                  <Activity className="w-3.5 h-3.5 text-forest" aria-hidden="true" strokeWidth={1.75} />
                  <span>{t.heroTag}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest tracking-tight leading-[1.2]">
                  {t.heroHeadline}
                </h1>

                <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl">
                  {t.heroSub}
                </p>

                {/* Primary and Secondary CTA */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {currentUser ? (
                    <button
                      type="button"
                      onClick={handleDashboardClick}
                      className="px-6 py-3 min-h-[48px] text-sm font-bold rounded-lg bg-forest text-cream hover:bg-forest-dark transition-colors shadow-xs inline-flex items-center gap-2"
                    >
                      <span>{t.btnDashboard}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="px-6 py-3 min-h-[48px] text-sm font-bold rounded-lg bg-forest text-cream hover:bg-forest-dark transition-colors shadow-xs inline-flex items-center gap-2"
                    >
                      <span>{t.btnLogin}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => scrollToSection('how-it-works')}
                    className="px-5 py-3 min-h-[48px] text-sm font-bold rounded-lg bg-cream text-forest border border-mint-border hover:bg-mint-deep transition-colors shadow-xs inline-flex items-center gap-1.5"
                  >
                    <span>{t.btnSeeHow}</span>
                  </button>
                </div>

                {/* 3 Small Facts with Outline Icons */}
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-mint-border/80">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-mint-deep flex items-center justify-center text-forest shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    <span className="text-xs font-semibold text-ink leading-snug">{t.fact1}</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-mint-deep flex items-center justify-center text-forest shrink-0 mt-0.5">
                      <Languages className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    <span className="text-xs font-semibold text-ink leading-snug">{t.fact2}</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-mint-deep flex items-center justify-center text-forest shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    <span className="text-xs font-semibold text-ink leading-snug">{t.fact3}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Photograph — hidden on mobile to save space */}
              <div className="hidden lg:block lg:col-span-5 relative">
                <div className="relative rounded-xl overflow-hidden border border-mint-border bg-cream shadow-xs">
                  {/* Photo with flat scrim */}
                  <picture>
                    <img
                      src="/images/senior-indian.jpg"
                      alt={isHi ? 'घर पर वरिष्ठ नागरिक की देखभाल का परिवेश' : 'Senior citizen peaceful home setting with warm natural lighting'}
                      width={600}
                      height={420}
                      loading="eager"
                      className="w-full h-auto object-cover aspect-4/3"
                    />
                  </picture>
                  {/* Flat semi-transparent scrim for guaranteed contrast */}
                  <div className="absolute inset-0 bg-forest/5 pointer-events-none" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Features (6 Cards) ─────────────────────────────────── */}
        <section id="features" className="py-16 sm:py-20 bg-cream border-b border-mint-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-forest tracking-tight">
                {t.featuresTitle}
              </h2>
              <p className="text-sm text-ink-muted leading-relaxed">
                {t.featuresSub}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1: Medicine Reminders */}
              <div className="bg-cream rounded-xl border border-mint-border p-6 shadow-xs hover:border-sage transition-colors flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-full bg-mint-deep flex items-center justify-center text-forest border border-mint-border">
                    <Pill className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold text-base text-forest">{t.feature1Title}</h3>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">{t.feature1Text}</p>
                </div>
              </div>

              {/* Feature 2: One-tap SOS */}
              <div className="bg-cream rounded-xl border border-mint-border p-6 shadow-xs hover:border-sage transition-colors flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-full bg-mint-deep flex items-center justify-center text-forest border border-mint-border">
                    <AlertTriangle className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold text-base text-forest">{t.feature2Title}</h3>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">{t.feature2Text}</p>
                </div>
              </div>

              {/* Feature 3: Voice Notes */}
              <div className="bg-cream rounded-xl border border-mint-border p-6 shadow-xs hover:border-sage transition-colors flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-full bg-mint-deep flex items-center justify-center text-forest border border-mint-border">
                    <Mic className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold text-base text-forest">{t.feature3Title}</h3>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">{t.feature3Text}</p>
                </div>
                <div className="pt-4 mt-2 border-t border-mint-border/60">
                  <span className="inline-block text-[11px] font-medium text-ink-muted bg-mint px-2 py-0.5 rounded border border-mint-border">
                    {t.feature3Tag}
                  </span>
                </div>
              </div>

              {/* Feature 4: Health Readings */}
              <div className="bg-cream rounded-xl border border-mint-border p-6 shadow-xs hover:border-sage transition-colors flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-full bg-mint-deep flex items-center justify-center text-forest border border-mint-border">
                    <Watch className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold text-base text-forest">{t.feature4Title}</h3>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">{t.feature4Text}</p>
                </div>
                <div className="pt-4 mt-2 border-t border-mint-border/60">
                  <span className="inline-block text-[11px] font-medium text-ink-muted bg-mint px-2 py-0.5 rounded border border-mint-border">
                    {t.feature4Tag}
                  </span>
                </div>
              </div>

              {/* Feature 5: Family Reports */}
              <div className="bg-cream rounded-xl border border-mint-border p-6 shadow-xs hover:border-sage transition-colors flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-full bg-mint-deep flex items-center justify-center text-forest border border-mint-border">
                    <FileText className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold text-base text-forest">{t.feature5Title}</h3>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">{t.feature5Text}</p>
                </div>
              </div>

              {/* Feature 6: Privacy and Consent */}
              <div className="bg-cream rounded-xl border border-mint-border p-6 shadow-xs hover:border-sage transition-colors flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-full bg-mint-deep flex items-center justify-center text-forest border border-mint-border">
                    <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold text-base text-forest">{t.feature6Title}</h3>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">{t.feature6Text}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: How it Works (3 Columns) ───────────────────────────── */}
        <section id="how-it-works" className="py-16 sm:py-20 bg-mint-deep border-b border-mint-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-forest tracking-tight">
                {t.howTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Senior */}
              <div className="bg-cream rounded-xl border border-mint-border p-6 sm:p-7 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-lg bg-mint flex items-center justify-center text-forest border border-mint-border">
                  <Heart className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-base text-forest">{t.howSeniorTitle}</h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">{t.howSeniorText}</p>
              </div>

              {/* Family */}
              <div className="bg-cream rounded-xl border border-mint-border p-6 sm:p-7 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-lg bg-mint flex items-center justify-center text-forest border border-mint-border">
                  <Users className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-base text-forest">{t.howFamilyTitle}</h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">{t.howFamilyText}</p>
              </div>

              {/* Care Coordinator */}
              <div className="bg-cream rounded-xl border border-mint-border p-6 sm:p-7 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-lg bg-mint flex items-center justify-center text-forest border border-mint-border">
                  <Compass className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-base text-forest">{t.howCoordTitle}</h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">{t.howCoordText}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 4: Split Section with Photo ───────────────────────────── */}
        <section id="about" className="py-16 sm:py-20 bg-cream border-b border-mint-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Photo / Vector Slot */}
              <div className="lg:col-span-5">
                <div className="relative rounded-xl overflow-hidden border border-mint-border bg-mint shadow-xs">
                  <picture>
                    <img
                      src="/images/doctor-male.jpg"
                      alt={isHi ? 'केयर समन्वय और पारिवारिक बातचीत' : 'Care Coordinator speaking gently with elder at home'}
                      width={500}
                      height={380}
                      loading="lazy"
                      className="w-full h-auto object-cover aspect-4/3"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-forest/5 pointer-events-none" aria-hidden="true" />
                </div>
              </div>

              {/* Right Text */}
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-forest tracking-tight">
                  {t.splitHeading}
                </h2>

                <div className="space-y-4 text-xs sm:text-sm text-ink-muted leading-relaxed">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-md bg-mint-deep flex items-center justify-center text-forest shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                    </div>
                    <p className="text-ink">{t.splitLine1}</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-md bg-mint-deep flex items-center justify-center text-forest shrink-0 mt-0.5">
                      <Volume2 className="w-3.5 h-3.5" strokeWidth={2} />
                    </div>
                    <p className="text-ink">{t.splitLine2}</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-md bg-mint-deep flex items-center justify-center text-forest shrink-0 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2} />
                    </div>
                    <p className="text-ink">{t.splitLine3}</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-mint text-forest border border-mint-border text-xs font-semibold">
                  <span>{t.splitBrowserNote}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 5: Short Honest Note ──────────────────────────────────── */}
        <section className="py-8 bg-mint border-b border-mint-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              {t.honestNote}
            </p>
          </div>
        </section>

        {/* ── Section 6: Final Call to Action ───────────────────────────────── */}
        <section className="py-16 bg-cream border-b border-mint-border text-center">
          <div className="max-w-xl mx-auto px-4 sm:px-6 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest tracking-tight">
              {t.ctaHeading}
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted">
              {t.ctaSub}
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="px-6 py-3 min-h-[48px] text-sm font-bold rounded-lg bg-forest text-cream hover:bg-forest-dark transition-colors shadow-xs inline-flex items-center gap-2"
              >
                <span>{t.btnLogin}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Section 7: Quiet Footer ─────────────────────────────────────────── */}
      <footer className="bg-cream border-t border-mint-border py-10 pb-safe text-xs text-ink-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo and Brand */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-forest text-cream flex items-center justify-center shrink-0">
                <Activity className="w-3.5 h-3.5 text-cream" strokeWidth={2} />
              </div>
              <span className="font-extrabold text-sm text-forest">Samarth Watch</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center gap-5 font-semibold text-ink-muted">
              <Link to="/privacy-policy" className="hover:text-forest transition-colors">
                {t.navPrivacy}
              </Link>
              <Link to="/terms" className="hover:text-forest transition-colors">
                {t.navTerms}
              </Link>
              <Link to="/credits" className="hover:text-forest transition-colors">
                {t.navCredits}
              </Link>
            </div>

            {/* Language Toggle in Footer */}
            <div className="flex items-center gap-1 bg-mint p-1 rounded-md border border-mint-border font-bold text-[11px]">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  !isHi ? 'bg-forest text-cream' : 'text-ink-muted hover:text-forest'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded font-hindi transition-colors ${
                  isHi ? 'bg-forest text-cream' : 'text-ink-muted hover:text-forest'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-mint-border/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px]">
            <p>
              {t.footerLegal}
            </p>
            <p>
              {t.footerCopyright} : {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
