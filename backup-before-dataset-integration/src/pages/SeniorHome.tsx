import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../i18n';
import {
  speakChunked,
  stopSpeaking,
  pauseSpeaking,
  resumeSpeaking,
  ReadSpeed,
} from '../utils/speech';
import { getGreeting } from '../utils/greeting';
import { InitialsAvatar } from '../components/coordinator/InitialsAvatar';
import {
  Volume2,
  VolumeX,
  Phone,
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Mic,
  Square,
  ArrowLeft,
  Calendar,
  Languages,
  Plus,
  Minus,
  Heart,
  Activity,
  Pill,
  Play,
  Pause,
  RotateCcw,
  Bell,
  X,
  Video,
  LogOut,
  ShieldAlert
} from 'lucide-react';

type SeniorScreen =
  | 'language_picker'
  | 'home'
  | 'notifications'
  | 'medicine_today'
  | 'checkin_q1'
  | 'checkin_q2'
  | 'checkin_q3'
  | 'checkin_q4'
  | 'voice_note'
  | 'thank_you'
  | 'sos_informed'
  | 'reading_entry'
  | 'appointment_request'
  | 'consent_settings';

export const SeniorHome: React.FC = () => {
  const {
    selectedSenior,
    language,
    setLanguage,
    t,
    largerText,
    setLargerText,
    highContrast,
    setHighContrast,
    seniorLanguageChosen,
    setSeniorLanguageChosen,
    medicines,
    doses,
    dueDoseNow,
    takeDoseSenior,
    snoozeDoseSenior,
    triggerSeniorSOS,
    cancelSOS,
    activeSosEvent,
    addHealthReading,
    addSeniorVoiceNote,
    saveCheckinAnswers,
    requestAppointment,
    toggleConsent,
    toggleDetailedVitalsConsent,
    detailedVitalsConsent,
    coordinatorProfile,
    roleNotifications,
    appointments,
  } = useApp();

  const { logout } = useAuth();
  const { showToast } = useToast();

  usePageTitle(
    'Senior Care Portal - Samarth Watch',
    'High contrast, large buttons elder interface for daily check-in, medicine confirmations, and emergency support.'
  );

  const [screen, setScreen] = useState<SeniorScreen>(
    seniorLanguageChosen ? 'home' : 'language_picker'
  );

  // Read aloud audio state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSentence, setActiveSentence] = useState('');
  const [currentTextToSpeak, setCurrentTextToSpeak] = useState('');
  const [readSpeed, setReadSpeed] = useState<ReadSpeed>('normal');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [hasRecordedVoice, setHasRecordedVoice] = useState(false);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordIntervalRef = useRef<any>(null);

  // Check-in answers
  const [answers, setAnswers] = useState<{
    q1: number | null;
    q2: number | null;
    q3: number | null;
    q4: number | null;
  }>({ q1: null, q2: null, q3: null, q4: null });

  // Health reading inputs
  const [readingType, setReadingType] = useState<'bp' | 'sugar' | 'spo2'>('bp');
  const [readingSys, setReadingSys] = useState('130');
  const [readingDia, setReadingDia] = useState('82');
  const [readingVal, setReadingVal] = useState('110');

  // Appointment selection
  const [selectedApptType, setSelectedApptType] = useState<'In person' | 'Google Meet'>('Google Meet');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM');

  // SOS Countdown for 60s accidental cancellation
  const [sosCountdown, setSosCountdown] = useState<number>(60);
  useEffect(() => {
    let timer: any = null;
    if (screen === 'sos_informed') {
      setSosCountdown(60);
      timer = setInterval(() => {
        setSosCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [screen]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
      if (audioBlobUrl) URL.revokeObjectURL(audioBlobUrl);
    };
  }, [audioBlobUrl]);

  // Speech Handler
  const handleReadAloud = (text: string) => {
    if (isSpeaking && !isPaused) {
      stopSpeaking();
      setIsSpeaking(false);
      setIsPaused(false);
      setActiveSentence('');
      return;
    }
    setCurrentTextToSpeak(text);
    setIsSpeaking(true);
    setIsPaused(false);
    speakChunked(text, {
      lang: language,
      speed: readSpeed,
      onChunkStart: (_idx: number, sentence: string) => setActiveSentence(sentence),
      onDone: () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setActiveSentence('');
      },
      onError: () => {
        setIsSpeaking(false);
        setIsPaused(false);
      },
    });
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setIsPaused(false);
    setActiveSentence('');
  };

  const handleReadAgain = () => {
    stopSpeaking();
    setIsPaused(false);
    if (currentTextToSpeak) {
      handleReadAloud(currentTextToSpeak);
    }
  };

  const handleSetSpeed = (speed: ReadSpeed) => {
    setReadSpeed(speed);
    if (isSpeaking && currentTextToSpeak) {
      stopSpeaking();
      speakChunked(currentTextToSpeak, {
        lang: language,
        speed,
        onChunkStart: (_idx: number, sentence: string) => setActiveSentence(sentence),
        onDone: () => {
          setIsSpeaking(false);
          setIsPaused(false);
          setActiveSentence('');
        },
        onError: () => {
          setIsSpeaking(false);
          setIsPaused(false);
        },
      });
    }
  };

  // SOS Trigger
  const handleEmergencySOS = () => {
    stopSpeaking();
    triggerSeniorSOS();
    setScreen('sos_informed');
  };

  // Voice recording handlers
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);
        setHasRecordedVoice(true);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);

      recordIntervalRef.current = setInterval(() => {
        setRecordSeconds((s) => {
          if (s >= 59) {
            stopVoiceRecording();
            return 60;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      showToast('Microphone access is needed to record a voice note.', 'error');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    }
  };

  const playRecordedAudio = () => {
    if (audioBlobUrl) {
      const audio = new Audio(audioBlobUrl);
      setIsPlayingRecorded(true);
      audio.onended = () => setIsPlayingRecorded(false);
      audio.onerror = () => setIsPlayingRecorded(false);
      audio.play().catch(() => setIsPlayingRecorded(false));
    }
  };

  const handleSendVoiceNote = () => {
    addSeniorVoiceNote(
      recordSeconds || 15,
      audioBlobUrl
    );
    showToast(t.voiceNoteSentSuccess || 'Voice note sent to coordinator', 'success');
    setScreen('thank_you');
  };

  // Calculation for today's medicines
  const todayDoses = doses;
  const takenDosesCount = todayDoses.filter((d) => d.status === 'taken').length;
  const totalDosesCount = todayDoses.length;

  // Next due dose
  const nextDueDose = dueDoseNow || todayDoses.find((d) => d.status === 'pending' || d.status === 'upcoming') || null;

  // Grouped doses: Morning, Afternoon, Evening
  const groupedDoses = React.useMemo(() => {
    const morning: typeof doses = [];
    const afternoon: typeof doses = [];
    const evening: typeof doses = [];

    todayDoses.forEach((d) => {
      const tStr = d.scheduledTime.toUpperCase();
      if (tStr.includes('AM')) {
        morning.push(d);
      } else {
        const hour = parseInt(tStr.split(':')[0], 10);
        if (hour === 12 || hour < 4) {
          afternoon.push(d);
        } else {
          evening.push(d);
        }
      }
    });

    return { morning, afternoon, evening };
  }, [todayDoses]);

  // Dual text helper for bilinguality
  const renderDualText = (primaryText: string, englishFallback: string) => {
    if (language === 'en') return primaryText;
    return (
      <span className="flex flex-col">
        <span>{primaryText}</span>
        <span className="text-sm sm:text-base font-normal opacity-85 font-sans mt-0.5">
          {englishFallback}
        </span>
      </span>
    );
  };

  // Senior styling classes
  const headingClass = highContrast
    ? 'text-3xl sm:text-4xl font-black text-yellow-300'
    : largerText
    ? 'text-3xl sm:text-4xl font-extrabold text-forest'
    : 'text-2xl sm:text-3xl font-extrabold text-forest';

  const bodyClass = highContrast
    ? 'text-xl sm:text-2xl font-bold text-yellow-200'
    : largerText
    ? 'text-2xl font-medium text-ink'
    : 'text-xl font-medium text-ink';

  const cardContainer = highContrast
    ? 'bg-black text-yellow-300 border-2 border-yellow-400'
    : 'bg-cream text-ink border border-border shadow-xs';

  return (
    <div className={`min-h-dvh flex flex-col justify-between ${highContrast ? 'bg-black' : 'bg-mint'}`}>
      {/* Centred Single Column (640px to 720px max on laptop, full width on phone) */}
      <div className="w-full max-w-2xl mx-auto px-4 py-6 pb-36 space-y-6">
        
        {/* Top Header: Contrast Toggle and Larger Text Toggle */}
        <header className="flex items-center justify-between pb-3 border-b border-border text-sm">
          <div className="flex items-center gap-2">
            <InitialsAvatar name={selectedSenior.name} size="sm" />
            <span className="font-bold text-xs sm:text-sm text-forest uppercase tracking-wider">
              {selectedSenior.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLargerText(!largerText)}
              className={`min-h-[44px] px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                largerText
                  ? 'bg-forest text-cream border-forest'
                  : 'bg-cream text-ink border-border hover:bg-mint-deep'
              }`}
            >
              {largerText ? t.normalText : t.largerText}
            </button>

            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`min-h-[44px] px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                highContrast
                  ? 'bg-yellow-400 text-black border-yellow-400'
                  : 'bg-cream text-ink border-border hover:bg-mint-deep'
              }`}
            >
              {highContrast ? t.normalContrast : t.highContrast}
            </button>
          </div>
        </header>

        {/* Read-Aloud Sentence Highlighting and Controls Player */}
        {isSpeaking && (
          <div
            role="region"
            aria-live="polite"
            className={`p-4 rounded-xl border-2 space-y-3 ${
              highContrast
                ? 'bg-black text-yellow-300 border-yellow-400'
                : 'bg-mint-deep text-forest border-border shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-forest animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-forest">
                  {isPaused ? t.readAloudPause : t.readAloudSpeaking}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-cream p-1 rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => handleSetSpeed('slow')}
                  className={`min-h-[40px] px-3 py-1 text-xs font-bold rounded ${
                    readSpeed === 'slow' ? 'bg-forest text-cream' : 'text-ink'
                  }`}
                >
                  {t.readAloudSlow}
                </button>
                <button
                  type="button"
                  onClick={() => handleSetSpeed('normal')}
                  className={`min-h-[40px] px-3 py-1 text-xs font-bold rounded ${
                    readSpeed === 'normal' ? 'bg-forest text-cream' : 'text-ink'
                  }`}
                >
                  {t.readAloudNormal}
                </button>
              </div>
            </div>

            {activeSentence && (
              <div className="p-3 rounded-lg text-lg sm:text-xl font-bold bg-white text-ink border border-border">
                "{activeSentence}"
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleReadAloud(currentTextToSpeak)}
                className="min-h-[48px] px-3 py-2 rounded-lg bg-forest text-cream font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span>{isPaused ? t.readAloudResume : t.readAloudPause}</span>
              </button>
              <button
                type="button"
                onClick={handleStopSpeaking}
                className="min-h-[48px] px-3 py-2 rounded-lg bg-cream border border-border text-ink font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5"
              >
                <VolumeX className="w-4 h-4" />
                <span>{t.readAloudStop}</span>
              </button>
              <button
                type="button"
                onClick={handleReadAgain}
                className="min-h-[48px] px-3 py-2 rounded-lg bg-white border border-border text-ink font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.readAloudAgain}</span>
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 1: Language Picker */}
        {screen === 'language_picker' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardContainer} space-y-6 text-center`}>
            <div className="space-y-2">
              <h1 className={headingClass}>अपनी भाषा चुनें</h1>
              <p className={bodyClass}>Choose your language</p>
            </div>

            <div className="space-y-3 pt-2">
              {SUPPORTED_LANGUAGES.map((opt) => (
                <button
                  key={opt.code}
                  onClick={() => {
                    setLanguage(opt.code);
                    setSeniorLanguageChosen(true);
                    setScreen('home');
                  }}
                  className={`w-full min-h-[64px] px-6 py-4 rounded-xl text-left flex items-center justify-between border-2 transition-colors ${
                    language === opt.code
                      ? 'bg-forest text-cream border-forest font-bold'
                      : 'bg-white text-ink border-border hover:bg-mint-deep'
                  }`}
                >
                  <div>
                    <div className="text-2xl font-bold">{opt.nameInScript}</div>
                    <div className="text-sm opacity-80">{opt.englishName}</div>
                  </div>
                  {language === opt.code && <Check className="w-6 h-6 text-cream" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SCREEN 2: Senior Home Screen (Section 4.1) */}
        {screen === 'home' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardContainer} space-y-6`}>
            {/* Header Greeting with Initials Avatar, Bell, and Listen button */}
            <div className="flex items-start justify-between gap-4 border-b pb-4 border-border">
              <div className="flex items-center gap-3.5">
                <InitialsAvatar name={selectedSenior.name} size="lg" />
                <div>
                  <h1 className={headingClass}>
                    {getGreeting(language, selectedSenior.name)}
                  </h1>
                  {language !== 'en' && (
                    <div className="text-xs sm:text-sm font-normal opacity-75">
                      {getGreeting('en', selectedSenior.name)}
                    </div>
                  )}
                  <p className={`${bodyClass} text-ink-muted mt-0.5`}>{t.seniorSubtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <button
                  type="button"
                  onClick={() => setScreen('notifications')}
                  aria-label="View notifications"
                  className="w-12 h-12 rounded-xl bg-mint-deep border border-border flex items-center justify-center text-forest hover:bg-mint transition-colors relative focus:outline-none focus:ring-2 focus:ring-forest"
                >
                  <Bell className="w-6 h-6" strokeWidth={1.5} />
                  {roleNotifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-alert-red ring-2 ring-cream" />
                  )}
                </button>

                {/* Read Aloud button */}
                <button
                  onClick={() =>
                    handleReadAloud(
                      `${getGreeting(language, selectedSenior.name)}. ${t.seniorSubtitle}`
                    )
                  }
                  className="min-h-[48px] px-3.5 py-2 rounded-xl bg-forest text-cream font-bold flex items-center gap-2 hover:bg-forest-dark transition-colors"
                  aria-label={t.listenButton}
                >
                  {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  <span className="text-xs sm:text-sm">{isSpeaking ? t.listenStop : t.listenButton}</span>
                </button>
              </div>
            </div>

            {/* One "Next" Card: Next medicine due today, or friendly empty status */}
            <div className="p-5 rounded-xl bg-white border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-forest uppercase tracking-wider">
                  Next Medicine
                </span>
                {dueDoseNow && (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-xs font-bold uppercase">
                    Due now
                  </span>
                )}
              </div>

              {nextDueDose ? (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-ink">{nextDueDose.medicineName}</h3>
                    <p className="text-sm text-ink-muted">
                      {nextDueDose.scheduledTime} : {nextDueDose.dosageInstructions}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setScreen('medicine_today')}
                    className="min-h-[44px] px-4 py-2 bg-forest text-cream text-xs font-bold rounded-lg hover:bg-forest-dark"
                  >
                    Open
                  </button>
                </div>
              ) : (
                <p className="text-sm text-ink-muted">
                  {medicines.length === 0
                    ? 'No medicine has been added yet. Your coordinator will add it.'
                    : 'No medicine is due right now. You are all caught up.'}
                </p>
              )}
            </div>

            {/* Exactly THREE Primary Large Action Buttons (at least 64px tall, full width) */}
            <div className="space-y-3.5 pt-2">
              {/* Button 1: Today's Medicine */}
              <button
                type="button"
                onClick={() => setScreen('medicine_today')}
                className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-forest hover:bg-forest-dark text-cream border border-forest font-bold text-xl sm:text-2xl flex items-center justify-between transition-colors shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <Pill className="w-7 h-7 text-sage-light" />
                  <span>{renderDualText(t.actionMedicineToday, "Today's Medicine")}</span>
                </div>
                {dueDoseNow ? (
                  <span className="bg-amber-400 text-ink text-xs font-black uppercase px-2.5 py-1 rounded">
                    Due Now
                  </span>
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-sage-light" />
                )}
              </button>

              {/* Button 2: Daily Check-in */}
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setScreen('checkin_q1');
                }}
                className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-white hover:bg-mint-deep text-ink border border-border font-bold text-xl sm:text-2xl flex items-center justify-between transition-colors shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <Activity className="w-7 h-7 text-forest" />
                  <span>{renderDualText(t.actionDailyCheckin, 'Daily Morning Check-in')}</span>
                </div>
                <span className="text-2xl font-bold text-forest">→</span>
              </button>

              {/* Button 3: Talk to My Coordinator */}
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setScreen('appointment_request');
                }}
                className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-white hover:bg-mint-deep text-ink border border-border font-bold text-xl sm:text-2xl flex items-center justify-between transition-colors shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <Phone className="w-7 h-7 text-forest" />
                  <span>{renderDualText(t.actionTalkCoordinator, 'Talk to My Coordinator')}</span>
                </div>
                <span className="text-2xl font-bold text-forest">→</span>
              </button>
            </div>

            {/* Small "Settings" Text Link at the Very Bottom of Home */}
            <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-ink-muted flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setScreen('language_picker')}
                  className="font-bold text-forest hover:underline flex items-center gap-1"
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setScreen('consent_settings')}
                  className="font-bold text-forest hover:underline flex items-center gap-1"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>{t.consentTitle}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setScreen('reading_entry')}
                  className="font-bold text-forest hover:underline flex items-center gap-1"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{t.healthReadingTitle}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => logout()}
                className="font-bold text-alert-red hover:underline flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.signOut}</span>
              </button>
            </div>
          </div>
        )}

        {/* SCREEN: Today's Medicine Tracker (Section 4.2) */}
        {screen === 'medicine_today' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardContainer} space-y-6`}>
            {/* Header with Date and Progress Count */}
            <div className="border-b pb-4 border-border space-y-2">
              <div className="flex items-center justify-between">
                <h2 className={headingClass}>
                  Today's Medicine : {new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </h2>
                <button
                  onClick={() =>
                    handleReadAloud(
                      `Today's Medicine. ${takenDosesCount} of ${totalDosesCount} done today.`
                    )
                  }
                  className="min-h-[44px] px-3 py-1.5 rounded-lg bg-forest text-cream font-bold text-xs flex items-center gap-1"
                >
                  <Volume2 className="w-4 h-4" /> {t.listenButton}
                </button>
              </div>

              {/* Progress Count and simple horizontal bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-sm sm:text-base font-bold text-forest">
                  <span>{takenDosesCount} of {totalDosesCount} done today</span>
                  <span>{totalDosesCount > 0 ? Math.round((takenDosesCount / totalDosesCount) * 100) : 0}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-mint-deep overflow-hidden">
                  <div
                    className="h-full bg-forest transition-all duration-300"
                    style={{ width: `${totalDosesCount > 0 ? (takenDosesCount / totalDosesCount) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Doses in time order grouped Morning, Afternoon, Evening */}
            <div className="space-y-5">
              {totalDosesCount === 0 ? (
                <div className="p-6 text-center text-ink-muted text-base">
                  No medicine scheduled for today. Your coordinator will add your prescriptions.
                </div>
              ) : (
                <>
                  {/* MORNING */}
                  {groupedDoses.morning.length > 0 && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-forest uppercase tracking-wider block">
                        Morning
                      </span>
                      {groupedDoses.morning.map((dose) => (
                        <div key={dose.id} className="p-4 sm:p-5 rounded-xl bg-white border border-border space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-xl font-bold text-ink">{dose.medicineName}</h3>
                              <p className="text-sm sm:text-base text-ink-muted mt-0.5">
                                {dose.dosageInstructions}
                              </p>
                            </div>
                            <span className="text-xs font-bold px-2.5 py-1 rounded-lg border bg-cream text-ink">
                              {dose.scheduledTime}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-semibold">
                            {dose.status === 'taken' ? (
                              <span className="text-alert-green flex items-center gap-1 font-bold">
                                <CheckCircle2 className="w-4 h-4" /> Taken at {dose.scheduledTime}
                              </span>
                            ) : dose.status === 'pending' ? (
                              <span className="text-alert-amber flex items-center gap-1 font-bold">
                                <Clock className="w-4 h-4" /> Due now
                              </span>
                            ) : (
                              <span className="text-ink-muted flex items-center gap-1">
                                <Clock className="w-4 h-4" /> Later today
                              </span>
                            )}
                          </div>

                          {/* Expanded buttons if due */}
                          {dose.status === 'pending' && (
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                              <button
                                type="button"
                                onClick={() => {
                                  takeDoseSenior(dose.id);
                                  showToast('Thank you. Dose recorded.', 'success');
                                }}
                                className="min-h-[56px] px-4 py-2 bg-forest text-cream font-bold text-base rounded-xl hover:bg-forest-dark flex items-center justify-center gap-2"
                              >
                                <Check className="w-5 h-5" />
                                <span>Yes, I took it</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  snoozeDoseSenior(dose.id);
                                  showToast('Reminding again in 5 minutes.', 'info');
                                }}
                                className="min-h-[56px] px-4 py-2 bg-cream text-ink border border-border font-bold text-base rounded-xl hover:bg-mint-deep flex items-center justify-center gap-2"
                              >
                                <span>Not yet</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* AFTERNOON */}
                  {groupedDoses.afternoon.length > 0 && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-forest uppercase tracking-wider block">
                        Afternoon
                      </span>
                      {groupedDoses.afternoon.map((dose) => (
                        <div key={dose.id} className="p-4 sm:p-5 rounded-xl bg-white border border-border space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-xl font-bold text-ink">{dose.medicineName}</h3>
                              <p className="text-sm sm:text-base text-ink-muted mt-0.5">
                                {dose.dosageInstructions}
                              </p>
                            </div>
                            <span className="text-xs font-bold px-2.5 py-1 rounded-lg border bg-cream text-ink">
                              {dose.scheduledTime}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-semibold">
                            {dose.status === 'taken' ? (
                              <span className="text-alert-green flex items-center gap-1 font-bold">
                                <CheckCircle2 className="w-4 h-4" /> Taken at {dose.scheduledTime}
                              </span>
                            ) : (
                              <span className="text-ink-muted flex items-center gap-1">
                                <Clock className="w-4 h-4" /> Later today
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* EVENING */}
                  {groupedDoses.evening.length > 0 && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-forest uppercase tracking-wider block">
                        Evening
                      </span>
                      {groupedDoses.evening.map((dose) => (
                        <div key={dose.id} className="p-4 sm:p-5 rounded-xl bg-white border border-border space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-xl font-bold text-ink">{dose.medicineName}</h3>
                              <p className="text-sm sm:text-base text-ink-muted mt-0.5">
                                {dose.dosageInstructions}
                              </p>
                            </div>
                            <span className="text-xs font-bold px-2.5 py-1 rounded-lg border bg-cream text-ink">
                              {dose.scheduledTime}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-semibold">
                            {dose.status === 'taken' ? (
                              <span className="text-alert-green flex items-center gap-1 font-bold">
                                <CheckCircle2 className="w-4 h-4" /> Taken at {dose.scheduledTime}
                              </span>
                            ) : (
                              <span className="text-ink-muted flex items-center gap-1">
                                <Clock className="w-4 h-4" /> Later today
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => setScreen('home')}
              className="w-full min-h-[56px] py-3 rounded-xl border border-border font-bold text-base text-ink hover:bg-mint-deep transition-colors"
            >
              ← {t.back}
            </button>
          </div>
        )}

        {/* SCREEN: Full-Screen Notifications */}
        {screen === 'notifications' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardContainer} space-y-6`}>
            <div className="flex items-center justify-between border-b pb-4 border-border">
              <h2 className={headingClass}>Notifications</h2>
              <button
                type="button"
                onClick={() => setScreen('home')}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-ink hover:bg-mint-deep"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              {roleNotifications.length === 0 ? (
                <div className="py-8 text-center text-base text-ink-muted">
                  No new messages or reminders.
                </div>
              ) : (
                roleNotifications.map((n) => (
                  <div key={n.id} className="p-4 rounded-xl bg-white border border-border space-y-1">
                    <div className="text-sm font-bold text-forest">{n.title}</div>
                    <div className="text-base text-ink">{n.message}</div>
                    <div className="text-xs text-ink-muted pt-1">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={() => setScreen('home')}
              className="w-full min-h-[56px] py-3 rounded-xl border border-border font-bold text-base text-ink hover:bg-mint-deep transition-colors"
            >
              ← {t.back}
            </button>
          </div>
        )}

        {/* SCREEN: Check-in Questions (1 to 4) */}
        {screen === 'checkin_q1' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardContainer} space-y-6`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-ink-muted uppercase">
                {t.questionProgress.replace('{current}', '1').replace('{total}', '4')}
              </span>
              <button
                onClick={() => handleReadAloud(`${t.question1Title}. ${t.question1Sub}`)}
                className="min-h-[44px] px-3 py-2 rounded-lg bg-forest text-cream font-bold text-xs flex items-center gap-1"
              >
                <Volume2 className="w-4 h-4" /> {t.listenButton}
              </button>
            </div>

            <div className="space-y-2">
              <h2 className={headingClass}>{t.question1Title}</h2>
              <p className={bodyClass}>{t.question1Sub}</p>
            </div>

            <div className="space-y-3.5 pt-2">
              <button
                onClick={() => {
                  setAnswers((a) => ({ ...a, q1: 1 }));
                  setScreen('checkin_q2');
                }}
                className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-emerald-700 text-cream font-bold text-xl sm:text-2xl flex items-center justify-between hover:bg-emerald-800"
              >
                <span>{renderDualText(t.answerGood, '1 : Good / Comfortable')}</span>
                <Check className="w-7 h-7" />
              </button>

              <button
                onClick={() => {
                  setAnswers((a) => ({ ...a, q1: 2 }));
                  setScreen('checkin_q2');
                }}
                className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-amber-600 text-cream font-bold text-xl sm:text-2xl flex items-center justify-between hover:bg-amber-700"
              >
                <span>{renderDualText(t.answerUnwell, '2 : A Little Unwell')}</span>
                <span>~</span>
              </button>

              <button
                onClick={() => {
                  setAnswers((a) => ({ ...a, q1: 3 }));
                  setScreen('checkin_q2');
                }}
                className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-red-700 text-cream font-bold text-xl sm:text-2xl flex items-center justify-between hover:bg-red-800"
              >
                <span>{renderDualText(t.answerVeryUnwell, '3 : Very Unwell / Need Care')}</span>
                <AlertTriangle className="w-7 h-7" />
              </button>
            </div>

            <button
              onClick={() => setScreen('home')}
              className="w-full min-h-[56px] py-3 rounded-xl border border-border font-bold text-base text-ink hover:bg-mint-deep"
            >
              ← {t.back}
            </button>
          </div>
        )}

        {screen === 'checkin_q2' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardContainer} space-y-6`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-ink-muted uppercase">
                {t.questionProgress.replace('{current}', '2').replace('{total}', '4')}
              </span>
              <button
                onClick={() => handleReadAloud(`${t.question2Title}. ${t.question2Sub}`)}
                className="min-h-[44px] px-3 py-2 rounded-lg bg-forest text-cream font-bold text-xs flex items-center gap-1"
              >
                <Volume2 className="w-4 h-4" /> {t.listenButton}
              </button>
            </div>

            <div className="space-y-2">
              <h2 className={headingClass}>{t.question2Title}</h2>
              <p className={bodyClass}>{t.question2Sub}</p>
            </div>

            <div className="space-y-3.5 pt-2">
              <button
                onClick={() => {
                  setAnswers((a) => ({ ...a, q2: 1 }));
                  setScreen('checkin_q3');
                }}
                className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-emerald-700 text-cream font-bold text-xl sm:text-2xl flex items-center justify-between hover:bg-emerald-800"
              >
                <span>{renderDualText(t.answerGood, '1 : Yes, taken on time')}</span>
                <Check className="w-7 h-7" />
              </button>

              <button
                onClick={() => {
                  setAnswers((a) => ({ ...a, q2: 2 }));
                  setScreen('checkin_q3');
                }}
                className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-amber-600 text-cream font-bold text-xl sm:text-2xl flex items-center justify-between hover:bg-amber-700"
              >
                <span>{renderDualText(t.answerUnwell, '2 : Forgot / Took late')}</span>
                <Clock className="w-7 h-7" />
              </button>

              <button
                onClick={() => {
                  setAnswers((a) => ({ ...a, q2: 3 }));
                  setScreen('checkin_q3');
                }}
                className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-red-700 text-cream font-bold text-xl sm:text-2xl flex items-center justify-between hover:bg-red-800"
              >
                <span>{renderDualText(t.answerVeryUnwell, '3 : Missed dose')}</span>
                <AlertTriangle className="w-7 h-7" />
              </button>
            </div>

            <button
              onClick={() => setScreen('checkin_q1')}
              className="w-full min-h-[56px] py-3 rounded-xl border border-border font-bold text-base text-ink hover:bg-mint-deep"
            >
              ← {t.back}
            </button>
          </div>
        )}

        {screen === 'checkin_q3' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardContainer} space-y-6`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-ink-muted uppercase">
                {t.questionProgress.replace('{current}', '3').replace('{total}', '4')}
              </span>
              <button
                onClick={() => handleReadAloud(`${t.question3Title}. ${t.question3Sub}`)}
                className="min-h-[44px] px-3 py-2 rounded-lg bg-forest text-cream font-bold text-xs flex items-center gap-1"
              >
                <Volume2 className="w-4 h-4" /> {t.listenButton}
              </button>
            </div>

            <div className="space-y-2">
              <h2 className={headingClass}>{t.question3Title}</h2>
              <p className={bodyClass}>{t.question3Sub}</p>
            </div>

            <div className="space-y-3.5 pt-2">
              <button
                onClick={() => {
                  setAnswers((a) => ({ ...a, q3: 1 }));
                  setScreen('checkin_q4');
                }}
                className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-emerald-700 text-cream font-bold text-xl sm:text-2xl flex items-center justify-between hover:bg-emerald-800"
              >
                <span>{renderDualText(t.answerGood, '1 : Slept comfortably')}</span>
                <Check className="w-7 h-7" />
              </button>

              <button
                onClick={() => {
                  setAnswers((a) => ({ ...a, q3: 2 }));
                  setScreen('checkin_q4');
                }}
                className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-amber-600 text-cream font-bold text-xl sm:text-2xl flex items-center justify-between hover:bg-amber-700"
              >
                <span>{renderDualText(t.answerUnwell, '2 : Woke up multiple times')}</span>
                <Clock className="w-7 h-7" />
              </button>

              <button
                onClick={() => {
                  setAnswers((a) => ({ ...a, q3: 3 }));
                  setScreen('checkin_q4');
                }}
                className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-red-700 text-cream font-bold text-xl sm:text-2xl flex items-center justify-between hover:bg-red-800"
              >
                <span>{renderDualText(t.answerVeryUnwell, '3 : Barely slept / restless')}</span>
                <AlertTriangle className="w-7 h-7" />
              </button>
            </div>

            <button
              onClick={() => setScreen('checkin_q2')}
              className="w-full min-h-[56px] py-3 rounded-xl border border-border font-bold text-base text-ink hover:bg-mint-deep"
            >
              ← {t.back}
            </button>
          </div>
        )}

        {screen === 'checkin_q4' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardContainer} space-y-6`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-ink-muted uppercase">
                {t.questionProgress.replace('{current}', '4').replace('{total}', '4')}
              </span>
              <button
                onClick={() => handleReadAloud(`${t.question4Title}. ${t.question4Sub}`)}
                className="min-h-[44px] px-3 py-2 rounded-lg bg-forest text-cream font-bold text-xs flex items-center gap-1"
              >
                <Volume2 className="w-4 h-4" /> {t.listenButton}
              </button>
            </div>

            <div className="space-y-2">
              <h2 className={headingClass}>{t.question4Title}</h2>
              <p className={bodyClass}>{t.question4Sub}</p>
            </div>

            <div className="space-y-3.5 pt-2">
              <button
                onClick={() => {
                  setAnswers((a) => ({ ...a, q4: 1 }));
                  saveCheckinAnswers({
                    q1: answers.q1 ?? 1,
                    q2: answers.q2 ?? 1,
                    q3: answers.q3 ?? 1,
                    q4: 1,
                  });
                  setScreen('voice_note');
                }}
                className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-emerald-700 text-cream font-bold text-xl sm:text-2xl flex items-center justify-between hover:bg-emerald-800"
              >
                <span>{renderDualText(t.answerGood, '1 : Normal meal, feel full')}</span>
                <Check className="w-7 h-7" />
              </button>

              <button
                onClick={() => {
                  setAnswers((a) => ({ ...a, q4: 2 }));
                  saveCheckinAnswers({
                    q1: answers.q1 ?? 1,
                    q2: answers.q2 ?? 1,
                    q3: answers.q3 ?? 1,
                    q4: 2,
                  });
                  setScreen('voice_note');
                }}
                className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-amber-600 text-cream font-bold text-xl sm:text-2xl flex items-center justify-between hover:bg-amber-700"
              >
                <span>{renderDualText(t.answerUnwell, '2 : Ate less than usual')}</span>
                <span>~</span>
              </button>

              <button
                onClick={() => {
                  setAnswers((a) => ({ ...a, q4: 3 }));
                  saveCheckinAnswers({
                    q1: answers.q1 ?? 1,
                    q2: answers.q2 ?? 1,
                    q3: answers.q3 ?? 1,
                    q4: 3,
                  });
                  setScreen('voice_note');
                }}
                className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-red-700 text-cream font-bold text-xl sm:text-2xl flex items-center justify-between hover:bg-red-800"
              >
                <span>{renderDualText(t.answerVeryUnwell, '3 : Did not feel like eating')}</span>
                <AlertTriangle className="w-7 h-7" />
              </button>
            </div>

            <button
              onClick={() => setScreen('checkin_q3')}
              className="w-full min-h-[56px] py-3 rounded-xl border border-border font-bold text-base text-ink hover:bg-mint-deep"
            >
              ← {t.back}
            </button>
          </div>
        )}

        {/* SCREEN: Voice Note */}
        {screen === 'voice_note' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardContainer} space-y-6 text-center`}>
            <div className="flex items-center justify-between text-left">
              <div>
                <h2 className={headingClass}>{t.voiceNoteTitle}</h2>
                <p className={`${bodyClass} text-ink-muted mt-0.5`}>{t.voiceNoteInstruction}</p>
              </div>

              <button
                onClick={() => handleReadAloud(`${t.voiceNoteTitle}. ${t.voiceNoteInstruction}`)}
                className="min-h-[44px] px-3 py-2 rounded-lg bg-forest text-cream font-bold text-xs flex items-center gap-1 shrink-0"
              >
                <Volume2 className="w-4 h-4" /> {t.listenButton}
              </button>
            </div>

            {/* Giant Record Button */}
            <div className="py-4">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startVoiceRecording}
                  className="w-full min-h-[120px] rounded-2xl bg-forest hover:bg-forest-dark text-cream border-2 border-forest flex flex-col items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <Mic className="w-12 h-12" />
                  <span className="text-2xl font-bold">{t.voiceNoteStart}</span>
                  <span className="text-sm opacity-80">Press once to speak</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopVoiceRecording}
                  className="w-full min-h-[120px] rounded-2xl bg-alert-red text-cream border-2 border-red-800 flex flex-col items-center justify-center gap-2 shadow-md animate-pulse"
                >
                  <Square className="w-12 h-12" />
                  <span className="text-2xl font-bold">{t.voiceNoteStop}</span>
                  <span className="text-lg font-mono font-bold">{recordSeconds}s / 60s</span>
                </button>
              )}
            </div>

            {hasRecordedVoice && !isRecording && (
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={playRecordedAudio}
                  disabled={isPlayingRecorded}
                  className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-forest text-cream font-bold text-xl flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-6 h-6" />
                  <span>{isPlayingRecorded ? 'Playing...' : t.voiceNoteListenAgain}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendVoiceNote}
                  className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-emerald-700 text-cream font-bold text-xl flex items-center justify-center gap-2"
                >
                  <Check className="w-6 h-6" />
                  <span>{t.voiceNoteSend}</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setScreen('thank_you')}
              className="w-full min-h-[56px] py-3 rounded-xl border border-border font-bold text-base text-ink hover:bg-mint-deep"
            >
              {t.skip}
            </button>
          </div>
        )}

        {/* SCREEN: Thank You */}
        {screen === 'thank_you' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardContainer} space-y-6 text-center`}>
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-300">
              <Check className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className={headingClass}>{t.thankYouTitle}</h2>
              <p className={bodyClass}>{t.thankYouMessage}</p>
            </div>

            <button
              type="button"
              onClick={() => setScreen('home')}
              className="w-full min-h-[64px] py-4 rounded-xl bg-forest text-cream font-bold text-xl"
            >
              {t.back}
            </button>
          </div>
        )}

        {/* SCREEN: Appointment Request / Talk to Coordinator */}
        {screen === 'appointment_request' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardContainer} space-y-6`}>
            <div className="flex items-center justify-between border-b pb-4 border-border">
              <h2 className={headingClass}>{t.actionTalkCoordinator}</h2>
              <button
                onClick={() => handleReadAloud(`Talk to my coordinator. Select meeting format and time.`)}
                className="min-h-[44px] px-3 py-2 rounded-lg bg-forest text-cream font-bold text-xs flex items-center gap-1"
              >
                <Volume2 className="w-4 h-4" /> {t.listenButton}
              </button>
            </div>

            {/* Check for existing confirmed Google Meet link */}
            {appointments.some((a) => a.type === 'Google Meet' && a.meetLink && a.status === 'confirmed') ? (
              <div className="p-5 rounded-xl bg-mint-deep border border-border space-y-3">
                <span className="text-xs font-bold text-forest uppercase tracking-wider block">
                  Scheduled Consultation Ready
                </span>
                <p className="text-sm font-semibold text-ink">
                  Your coordinator has provided the Google Meet link.
                </p>
                {appointments
                  .filter((a) => a.type === 'Google Meet' && a.meetLink && a.status === 'confirmed')
                  .map((a) => (
                    <a
                      key={a.id}
                      href={a.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-forest hover:bg-forest-dark text-cream font-bold text-xl flex items-center justify-center gap-2"
                    >
                      <Video className="w-6 h-6" />
                      <span>Join Google Meet</span>
                    </a>
                  ))}
              </div>
            ) : null}

            {/* Request appointment options */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-forest uppercase tracking-wider block">
                Choose Format
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedApptType('Google Meet')}
                  className={`min-h-[64px] p-4 rounded-xl border text-base font-bold flex items-center justify-center gap-2 ${
                    selectedApptType === 'Google Meet'
                      ? 'bg-forest text-cream border-forest'
                      : 'bg-white text-ink border-border hover:bg-mint-deep'
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <span>Google Meet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedApptType('In person')}
                  className={`min-h-[64px] p-4 rounded-xl border text-base font-bold flex items-center justify-center gap-2 ${
                    selectedApptType === 'In person'
                      ? 'bg-forest text-cream border-forest'
                      : 'bg-white text-ink border-border hover:bg-mint-deep'
                  }`}
                >
                  <Phone className="w-5 h-5" />
                  <span>Home Visit</span>
                </button>
              </div>

              {/* At most 3 slots */}
              <span className="text-xs font-bold text-forest uppercase tracking-wider block pt-2">
                Select Time Slot
              </span>
              <div className="grid grid-cols-3 gap-2">
                {['10:00 AM', '02:00 PM', '05:30 PM'].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`min-h-[56px] p-3 rounded-xl border text-sm font-bold flex items-center justify-center ${
                      selectedSlot === slot
                        ? 'bg-forest text-cream border-forest'
                        : 'bg-white text-ink border-border hover:bg-mint-deep'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  requestAppointment(
                    selectedApptType,
                    new Date().toISOString().split('T')[0],
                    selectedSlot,
                    selectedSenior.address,
                    'Requested by senior from portal'
                  );
                  showToast('Appointment requested. Your coordinator will confirm shortly.', 'success');
                  setScreen('home');
                }}
                className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-forest text-cream font-bold text-xl flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Request Session</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setScreen('home')}
              className="w-full min-h-[56px] py-3 rounded-xl border border-border font-bold text-base text-ink hover:bg-mint-deep"
            >
              ← {t.back}
            </button>
          </div>
        )}

        {/* SCREEN: Simple Health Reading Entry */}
        {screen === 'reading_entry' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardContainer} space-y-6`}>
            <div className="flex items-center justify-between border-b pb-4 border-border">
              <h2 className={headingClass}>{t.healthReadingTitle}</h2>
              <button
                onClick={() => handleReadAloud(`Health reading entry. Record blood pressure or sugar.`)}
                className="min-h-[44px] px-3 py-2 rounded-lg bg-forest text-cream font-bold text-xs flex items-center gap-1"
              >
                <Volume2 className="w-4 h-4" /> {t.listenButton}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setReadingType('bp')}
                className={`min-h-[52px] p-3 rounded-xl border text-sm font-bold ${
                  readingType === 'bp' ? 'bg-forest text-cream border-forest' : 'bg-white text-ink border-border'
                }`}
              >
                BP
              </button>
              <button
                type="button"
                onClick={() => setReadingType('sugar')}
                className={`min-h-[52px] p-3 rounded-xl border text-sm font-bold ${
                  readingType === 'sugar' ? 'bg-forest text-cream border-forest' : 'bg-white text-ink border-border'
                }`}
              >
                Sugar
              </button>
              <button
                type="button"
                onClick={() => setReadingType('spo2')}
                className={`min-h-[52px] p-3 rounded-xl border text-sm font-bold ${
                  readingType === 'spo2' ? 'bg-forest text-cream border-forest' : 'bg-white text-ink border-border'
                }`}
              >
                SpO2
              </button>
            </div>

            {readingType === 'bp' ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink uppercase mb-1">Systolic</label>
                  <input
                    type="number"
                    value={readingSys}
                    onChange={(e) => setReadingSys(e.target.value)}
                    className="w-full min-h-[56px] text-2xl font-bold px-4 rounded-xl border border-border bg-white text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink uppercase mb-1">Diastolic</label>
                  <input
                    type="number"
                    value={readingDia}
                    onChange={(e) => setReadingDia(e.target.value)}
                    className="w-full min-h-[56px] text-2xl font-bold px-4 rounded-xl border border-border bg-white text-ink"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-ink uppercase mb-1">
                  {readingType === 'sugar' ? 'Blood Sugar (mg/dL)' : 'SpO2 (%)'}
                </label>
                <input
                  type="number"
                  value={readingVal}
                  onChange={(e) => setReadingVal(e.target.value)}
                  className="w-full min-h-[56px] text-2xl font-bold px-4 rounded-xl border border-border bg-white text-ink"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                if (readingType === 'bp') {
                  addHealthReading('bp', parseInt(readingSys, 10) || 120, parseInt(readingDia, 10) || 80, 'senior');
                } else {
                  addHealthReading(readingType, parseInt(readingVal, 10) || 100, undefined, 'senior');
                }
                showToast('Reading saved successfully', 'success');
                setScreen('home');
              }}
              className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-forest text-cream font-bold text-xl"
            >
              Save Reading
            </button>

            <button
              type="button"
              onClick={() => setScreen('home')}
              className="w-full min-h-[56px] py-3 rounded-xl border border-border font-bold text-base text-ink hover:bg-mint-deep"
            >
              ← {t.back}
            </button>
          </div>
        )}

        {/* SCREEN: Consent Settings */}
        {screen === 'consent_settings' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardContainer} space-y-6`}>
            <div className="flex items-center justify-between border-b pb-4 border-border">
              <h2 className={headingClass}>{t.consentTitle}</h2>
              <button
                onClick={() => handleReadAloud(`Family sharing consent settings. You control what your family sees.`)}
                className="min-h-[44px] px-3 py-2 rounded-lg bg-forest text-cream font-bold text-xs flex items-center gap-1"
              >
                <Volume2 className="w-4 h-4" /> {t.listenButton}
              </button>
            </div>

            <p className="text-base text-ink leading-relaxed">
              You have complete autonomy. You can pause or allow health sharing with your linked family member (
              {selectedSenior.linkedFamilyName || 'Karishma'}) at any time.
            </p>

            <button
              type="button"
              onClick={() => {
                toggleConsent(selectedSenior.id, !selectedSenior.familyConsentGranted);
                showToast(
                  !selectedSenior.familyConsentGranted
                    ? 'Family sharing enabled.'
                    : 'Family sharing paused. Your privacy is protected.',
                  'info'
                );
              }}
              className={`w-full min-h-[64px] px-6 py-4 rounded-xl font-bold text-xl flex items-center justify-between border-2 ${
                selectedSenior.familyConsentGranted
                  ? 'bg-forest text-cream border-forest'
                  : 'bg-white text-ink border-border hover:bg-mint-deep'
              }`}
            >
              <span>{selectedSenior.familyConsentGranted ? 'Family Sharing: Active' : 'Family Sharing: Paused'}</span>
              <Check className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={() => setScreen('home')}
              className="w-full min-h-[56px] py-3 rounded-xl border border-border font-bold text-base text-ink hover:bg-mint-deep"
            >
              ← {t.back}
            </button>
          </div>
        )}

        {/* SCREEN: SOS Informed Screen */}
        {screen === 'sos_informed' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardContainer} space-y-6 text-center`}>
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border-2 border-emerald-300">
              <Check className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className={headingClass}>{t.sosInformedTitle}</h2>
              <p className={bodyClass}>{t.sosStayCalm}</p>
            </div>

            {sosCountdown > 0 ? (
              <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 space-y-2">
                <p className="text-sm font-semibold text-amber-900">
                  {renderDualText(
                    `यदि यह गलती से दबा है, तो ${sosCountdown} सेकंड में रद्द करें`,
                    `If pressed by mistake, cancel within ${sosCountdown} seconds`
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (activeSosEvent?.id) {
                      cancelSOS(activeSosEvent.id);
                    }
                    showToast('SOS alert cancelled', 'info');
                    setScreen('home');
                  }}
                  className="w-full min-h-[64px] px-6 py-4 rounded-xl bg-amber-200 border-2 border-amber-500 text-amber-950 font-bold text-xl hover:bg-amber-300"
                >
                  I pressed this by mistake (Cancel) ({sosCountdown}s)
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-lg">
                Help is on the way. Keep your phone near you.
              </div>
            )}

            <button
              type="button"
              onClick={() => setScreen('home')}
              className="w-full min-h-[56px] py-3 rounded-xl border border-border font-bold text-base text-ink hover:bg-mint-deep"
            >
              ← {t.back}
            </button>
          </div>
        )}
      </div>

      {/* Fixed Emergency SOS Button at the Very Bottom (>= 72px tall, full width of column, always visible) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-mint/90 backdrop-blur-xs p-4 pb-[env(safe-area-inset-bottom,16px)]">
        <div className="max-w-2xl mx-auto">
          <button
            type="button"
            onClick={handleEmergencySOS}
            className="w-full min-h-[72px] bg-alert-red hover:bg-red-700 active:bg-red-800 text-cream font-black text-2xl sm:text-3xl rounded-xl shadow-lg border-2 border-red-900 flex items-center justify-center gap-3 transition-transform active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-alert-red focus:ring-offset-2"
            aria-label="EMERGENCY HELP SOS"
          >
            <ShieldAlert className="w-8 h-8 text-cream shrink-0" strokeWidth={2} />
            <span>{t.sosButtonLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
