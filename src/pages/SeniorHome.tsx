import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { SupportedLanguage } from '../i18n';
import {
  speakChunked,
  stopSpeaking,
  pauseSpeaking,
  resumeSpeaking,
  ReadSpeed,
} from '../utils/speech';
import { getGreeting, cleanSeniorName } from '../utils/greeting';
import { InitialsAvatar } from '../components/coordinator/InitialsAvatar';
import {
  Volume2,
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
  LogOut,
  ShieldAlert,
  Watch,
  BatteryCharging,
  BatteryWarning,
  MapPin,
  HelpCircle,
  Eye,
  Smartphone,
  ChevronRight,
  Shield,
  SunMedium,
  CheckSquare,
} from 'lucide-react';
import { useWearable } from '../wearables/useWearable';
import { bandConnectionManager } from '../wearables/BandConnectionManager';
import { LocationCollector, LocationSharingChoice } from '../utils/locationService';

type SeniorScreen =
  | 'language_picker'
  | 'home'
  | 'more'
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
  | 'consent_settings'
  | 'band_settings'
  | 'band_connect_flow'
  | 'location_settings'
  | 'pwa_guide';

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
    updateLocationSharing,
    coordinatorProfile,
    roleNotifications,
  } = useApp();

  const { currentUser, logout } = useAuth();
  const { showToast } = useToast();
  const {
    device: wearableDevice,
    readings: wearableReadings,
    connectSimulator,
    disconnectDevice,
  } = useWearable(selectedSenior.id);

  // Live vitals computed from band readings
  const latestHeartRate = useMemo(() => {
    const hr = wearableReadings?.find((r) => r.metric === 'heart_rate');
    return hr ? Math.round(hr.value) : 74;
  }, [wearableReadings]);

  const latestSpo2 = useMemo(() => {
    const ox = wearableReadings?.find((r) => r.metric === 'spo2');
    return ox ? Math.round(ox.value) : 98;
  }, [wearableReadings]);

  const latestSteps = useMemo(() => {
    const stepReadings = wearableReadings?.filter((r) => r.metric === 'steps') || [];
    const extra = stepReadings.reduce((sum, r) => sum + (r.value || 0), 0);
    return 3420 + extra;
  }, [wearableReadings]);

  // Screen navigation state
  const [screen, setScreen] = useState<SeniorScreen>(
    seniorLanguageChosen ? 'home' : 'language_picker'
  );

  // Screen Title Hook per screen
  usePageTitle(
    screen === 'home'
      ? 'Home - Samarth Senior Portal'
      : screen === 'more'
      ? 'More Options - Samarth Senior Portal'
      : screen === 'band_settings' || screen === 'band_connect_flow'
      ? 'My Band - Samarth Senior Portal'
      : screen === 'location_settings'
      ? 'Share Location - Samarth Senior Portal'
      : 'Senior Portal - Samarth Watch'
  );

  // Band connect flow step
  const [bandConnectStep, setBandConnectStep] = useState<1 | 2>(1);

  // Keep screen on state (Screen Wake Lock)
  const [keepScreenOn, setKeepScreenOn] = useState(false);

  // Location Collector Ref
  const locationCollectorRef = useRef<LocationCollector | null>(null);

  // Clean real senior name (Kamla)
  const seniorName = useMemo(() => {
    return cleanSeniorName(currentUser?.name || selectedSenior?.name || 'Kamla');
  }, [currentUser, selectedSenior]);

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

  // Location warning confirm step for 'do_not_share'
  const [confirmDoNotShare, setConfirmDoNotShare] = useState(false);

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

  // Initialize and manage location collector based on senior's sharing setting
  useEffect(() => {
    const sharingChoice = (selectedSenior?.locationSharing as LocationSharingChoice) || 'emergency_only';
    const collector = new LocationCollector(selectedSenior.id, sharingChoice);
    locationCollectorRef.current = collector;

    if (sharingChoice === 'live') {
      collector.start();
    }

    return () => {
      collector.destroy();
    };
  }, [selectedSenior.id, selectedSenior?.locationSharing]);

  // Speech Handler
  const handleReadAloud = (text: string) => {
    if (isSpeaking && !isPaused) {
      stopSpeaking();
      setIsSpeaking(false);
      setIsPaused(false);
      return;
    }
    setCurrentTextToSpeak(text);
    setIsSpeaking(true);
    setIsPaused(false);
    speakChunked(text, {
      lang: language,
      speed: readSpeed,
      onChunkStart: (_idx, chunk) => setActiveSentence(chunk),
      onDone: () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setActiveSentence('');
      },
      onError: () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setActiveSentence('');
      },
    });
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resumeSpeaking();
      setIsPaused(false);
    } else {
      pauseSpeaking();
      setIsPaused(true);
    }
  };

  const handleSetSpeed = (speed: ReadSpeed) => {
    setReadSpeed(speed);
    if (isSpeaking && currentTextToSpeak) {
      handleReadAloud(currentTextToSpeak);
    }
  };

  // SOS Trigger Handler
  const handleEmergencySOS = () => {
    triggerSeniorSOS();
    setScreen('sos_informed');
  };

  // Toggle Screen Wake Lock
  const handleToggleWakeLock = async () => {
    if (keepScreenOn) {
      bandConnectionManager.disableKeepScreenOn();
      setKeepScreenOn(false);
      showToast('Keep screen on turned off', 'info');
    } else {
      const ok = await bandConnectionManager.enableKeepScreenOn();
      if (ok) {
        setKeepScreenOn(true);
        showToast('Screen will stay on while this page is open', 'success');
      } else {
        showToast('Screen Wake Lock is not supported on this browser', 'info');
      }
    }
  };

  // Location Choice Selector
  const handleSelectLocationSharing = (choice: LocationSharingChoice) => {
    if (choice === 'do_not_share' && !confirmDoNotShare) {
      setConfirmDoNotShare(true);
      return;
    }
    updateLocationSharing(choice);
    locationCollectorRef.current?.setSharingChoice(choice);
    setConfirmDoNotShare(false);
    showToast(
      choice === 'emergency_only'
        ? t.locationEmergencyOnlyTitle
        : choice === 'live'
        ? t.locationLiveTitle
        : t.locationDoNotShareTitle,
      'info'
    );
  };

  // Voice Recording handlers
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);
        setHasRecordedVoice(true);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordSeconds(0);

      recordIntervalRef.current = setInterval(() => {
        setRecordSeconds((s) => {
          if (s >= 59) {
            handleStopRecording();
            return 60;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      showToast(t.voiceNotePermissionDenied, 'error');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    }
  };

  // Check-in Next Question
  const handleCheckinAnswer = (step: number, answerValue: number) => {
    const updated = { ...answers, [`q${step}`]: answerValue };
    setAnswers(updated);
    if (step < 4) {
      setScreen(`checkin_q${step + 1}` as SeniorScreen);
    } else {
      setScreen('voice_note');
    }
  };

  const handleFinishCheckin = (withVoice = true) => {
    saveCheckinAnswers({
      q1: answers.q1 || 1,
      q2: answers.q2 || 1,
      q3: answers.q3 || 1,
      q4: answers.q4 || 1,
    });

    if (withVoice && hasRecordedVoice) {
      addSeniorVoiceNote(recordSeconds || 15, audioBlobUrl || null);
    }
    setScreen('thank_you');
  };

  // Senior Contrast and Font Classes (Flat design tokens, 7:1 contrast, no pill shapes)
  const isHighContrast = highContrast;
  const bgClass = isHighContrast ? 'bg-black text-yellow-300' : 'bg-[#FAF8F5] text-[#132A22]';
  const cardBg = isHighContrast ? 'bg-black border-2 border-yellow-400' : 'bg-white border border-[#E3EBE6] shadow-xs';
  const headingClass = isHighContrast
    ? 'text-[32px] sm:text-[36px] font-bold text-yellow-300 leading-tight'
    : 'text-[32px] sm:text-[36px] font-bold text-[#132A22] leading-tight';
  const cardTitleClass = isHighContrast
    ? 'text-[24px] sm:text-[26px] font-bold text-yellow-300'
    : 'text-[24px] sm:text-[26px] font-bold text-[#132A22]';
  const bodyClass = isHighContrast
    ? 'text-[22px] font-medium text-yellow-200'
    : 'text-[22px] font-medium text-[#2E4A3F]';

  // Dual text helper
  const renderDualText = (hiText: string, enText: string) => {
    if (language === 'hi') {
      return (
        <span className="block leading-snug">
          <span className="block">{hiText}</span>
          <span className="block text-[18px] opacity-80 font-normal">{enText}</span>
        </span>
      );
    }
    return enText;
  };

  // Compute disconnection escalation
  const escalation = bandConnectionManager.getEscalationStatus(selectedSenior.familyConsentGranted);

  return (
    <div className={`min-h-screen ${bgClass} antialiased flex flex-col justify-between selection:bg-[#1C3F32] selection:text-white`}>
      {/* Centred Column (640-720px on laptop, full width on phone) */}
      <div className="max-w-[700px] mx-auto w-full px-4 sm:px-6 py-6 space-y-5 pb-36">

        {/* Read-Aloud Player Bar (when speaking) */}
        {isSpeaking && (
          <div
            role="region"
            aria-live="polite"
            className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 ${
              isHighContrast ? 'bg-black text-yellow-300 border-yellow-400' : 'bg-[#EBF3EE] text-[#132A22] border-[#2E6B56]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Volume2 className="w-6 h-6 animate-pulse text-[#2E6B56]" />
              <span className="text-[20px] font-bold">
                {isPaused ? 'Paused' : 'Listening...'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePauseResume}
                className="min-h-[64px] px-4 py-2 rounded-xl bg-white text-[#132A22] border border-[#2E6B56] font-bold text-[18px]"
              >
                {isPaused ? <Play className="w-5 h-5 inline mr-1" /> : <Pause className="w-5 h-5 inline mr-1" />}
                {isPaused ? 'Play' : 'Pause'}
              </button>
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setIsSpeaking(false);
                }}
                className="min-h-[64px] px-4 py-2 rounded-xl bg-[#C93B2B] text-white font-bold text-[18px]"
              >
                Stop
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 1: LANGUAGE PICKER
           ======================================================== */}
        {screen === 'language_picker' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardBg} space-y-6 text-center`}>
            <div className="w-16 h-16 rounded-2xl bg-[#EBF3EE] text-[#132A22] flex items-center justify-center mx-auto border border-[#CBDCD2]">
              <Languages className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className={headingClass}>अपनी भाषा चुनें / Choose Language</h1>
              <p className={bodyClass}>
                आप समर्थ पोर्टल का उपयोग किस भाषा में करना चाहते हैं?
              </p>
            </div>
            <div className="space-y-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  setLanguage('hi');
                  setSeniorLanguageChosen(true);
                  setScreen('home');
                }}
                className="w-full min-h-[72px] px-6 py-4 rounded-2xl bg-[#1C3F32] hover:bg-[#132A22] text-white font-bold text-[26px] flex items-center justify-between"
              >
                <span>हिन्दी (Hindi)</span>
                <Check className="w-7 h-7" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setLanguage('en');
                  setSeniorLanguageChosen(true);
                  setScreen('home');
                }}
                className="w-full min-h-[72px] px-6 py-4 rounded-2xl bg-white hover:bg-[#F4F8F5] text-[#132A22] border-2 border-[#1C3F32] font-bold text-[26px] flex items-center justify-between"
              >
                <span>English</span>
                <Check className="w-7 h-7 opacity-0" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 2: HOME SCREEN
           ======================================================== */}
        {screen === 'home' && (
          <>
            {/* 1. HEADER: Initials avatar (K), greeting with real name >= 32px, Notification bell, Listen button */}
            <header className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-3.5">
                <InitialsAvatar name={seniorName} size="xl" className="shrink-0 w-16 h-16 text-[24px]" />
                <div>
                  <h1 className={headingClass}>
                    {getGreeting(language, seniorName)}
                  </h1>
                  <p className="text-[18px] text-[#4A6B5D] font-medium">
                    {language === 'hi' ? 'समर्थ साथी पोर्टल' : 'Senior Care Portal'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Notification Bell (at least 64x64px) */}
                <button
                  type="button"
                  onClick={() => setScreen('notifications')}
                  className="w-16 h-16 min-h-[64px] min-w-[64px] rounded-2xl bg-white hover:bg-[#F4F8F5] border-2 border-[#CBDCD2] text-[#132A22] flex items-center justify-center relative transition-colors focus:ring-4 focus:ring-[#1C3F32]"
                  aria-label="Notifications"
                >
                  <Bell className="w-7 h-7" />
                  {roleNotifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-[#C93B2B] rounded-full" />
                  )}
                </button>

                {/* Dedicated Listen Button (icon + one word "Listen", at least 64px tall, never wrapping) */}
                <button
                  type="button"
                  onClick={() => {
                    const homeText = `${getGreeting(language, seniorName)}. ${
                      wearableDevice?.status === 'connected'
                        ? 'Your health band is connected.'
                        : 'Your band is not connected.'
                    } ${dueDoseNow ? `Medicine due now: ${dueDoseNow.medicineName}.` : 'No medicines due right now.'}`;
                    handleReadAloud(homeText);
                  }}
                  className="min-h-[64px] px-4 py-2 rounded-2xl bg-[#1C3F32] hover:bg-[#132A22] text-white font-bold text-[20px] flex items-center gap-2 whitespace-nowrap transition-colors focus:ring-4 focus:ring-[#1C3F32]"
                  aria-label="Listen aloud"
                >
                  <Volume2 className="w-6 h-6 shrink-0" />
                  <span>{t.listenOneWord || 'Listen'}</span>
                </button>
              </div>
            </header>

            {/* Live Location Sharing Badge (shown only when live sharing is active) */}
            {selectedSenior.locationSharing === 'live' && (
              <div className="p-3.5 rounded-2xl bg-[#EBF3EE] border border-[#2E6B56] flex items-center justify-between gap-3 text-[#132A22]">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-[#2E6B56] shrink-0" />
                  <span className="text-[18px] font-bold">
                    {t.locationSharingLiveStatus || 'Your location is being shared'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setScreen('location_settings')}
                  className="text-[16px] font-bold text-[#1C3F32] underline min-h-[44px] px-2 flex items-center"
                >
                  Change
                </button>
              </div>
            )}

            {/* Band Disconnected Calm Large Banner (>5 minutes silence) */}
            {escalation.showSeniorBanner && (
              <div className="p-5 rounded-2xl bg-[#FFF6E5] border-2 border-[#D9822B] text-[#5C3B00] space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-7 h-7 text-[#D9822B] shrink-0" />
                    <span className="text-[22px] font-bold leading-snug">
                      {t.bandConnectBannerText || 'Your band is not connected. Tap to connect'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleReadAloud(t.bandConnectBannerText || 'Your band is not connected. Tap to connect')}
                    className="min-h-[44px] min-w-[44px] p-2 rounded-lg bg-white border border-[#D9822B] text-[#5C3B00]"
                    aria-label="Listen to warning"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    bandConnectionManager.acknowledgeSeniorBanner();
                    setScreen('band_settings');
                  }}
                  className="w-full min-h-[64px] rounded-xl bg-[#D9822B] hover:bg-[#B3661E] text-white font-bold text-[20px]"
                >
                  {t.connectMyBand}
                </button>
              </div>
            )}

            {/* Family Remind to Connect Band Banner (from roleNotifications) */}
            {roleNotifications.some((n) => n.title.includes('connect your health band') || n.message.includes('connect your health band')) && (
              <div className="p-5 rounded-2xl bg-[#EBF3EE] border-2 border-[#1C3F32] text-[#132A22] space-y-3 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Watch className="w-7 h-7 text-[#1C3F32] shrink-0" />
                    <span className="text-[22px] font-bold leading-snug">
                      {t.bandRemindBannerSenior || 'Your family asked you to connect your health band.'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleReadAloud(t.bandRemindBannerSenior || 'Your family asked you to connect your health band.')}
                    className="min-h-[44px] min-w-[44px] p-2 rounded-lg bg-white border border-[#1C3F32] text-[#132A22]"
                    aria-label="Listen to family reminder"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setScreen('band_settings')}
                  className="w-full min-h-[64px] rounded-xl bg-[#1C3F32] hover:bg-[#132A22] text-white font-bold text-[20px]"
                >
                  {t.connectMyBand}
                </button>
              </div>
            )}

            {/* 2. BAND STATUS CARD: Always visible, full width, >= 96px tall, text >= 24px, the whole card is one big tap target */}
            <div
              onClick={() => setScreen('band_settings')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setScreen('band_settings');
              }}
              className={`w-full min-h-[96px] p-5 sm:p-6 rounded-2xl ${cardBg} cursor-pointer hover:border-[#1C3F32] transition-colors flex items-center justify-between gap-4 focus:ring-4 focus:ring-[#1C3F32]`}
              aria-label="Health Band Status"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#EBF3EE] border border-[#CBDCD2] flex items-center justify-center shrink-0">
                  {!wearableDevice || wearableDevice.status === 'disconnected' ? (
                    <Watch className="w-8 h-8 text-[#C93B2B]" />
                  ) : wearableDevice.status === 'reconnecting' ? (
                    <Clock className="w-8 h-8 text-[#D9822B] animate-spin" />
                  ) : wearableDevice.batteryPercent && wearableDevice.batteryPercent <= 20 ? (
                    <BatteryWarning className="w-8 h-8 text-[#D9822B]" />
                  ) : (
                    <CheckCircle2 className="w-8 h-8 text-[#2E6B56]" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className={cardTitleClass}>
                    {!wearableDevice || wearableDevice.status === 'disconnected'
                      ? t.bandNotConnected
                      : wearableDevice.status === 'reconnecting'
                      ? t.bandReconnecting || 'Connecting your band...'
                      : wearableDevice.batteryPercent && wearableDevice.batteryPercent <= 20
                      ? t.bandBatteryLow
                      : t.bandConnected}
                  </div>
                  <div className="text-[18px] text-[#4A6B5D] font-medium flex flex-wrap items-center gap-2">
                    {wearableDevice?.status === 'connected' ? (
                      <>
                        <span className="inline-flex items-center gap-1 font-bold text-[#1C3F32]">
                          <Heart className="w-4 h-4 text-[#C93B2B] fill-[#C93B2B]" />
                          {latestHeartRate} bpm
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 font-bold text-[#1C3F32]">
                          <Activity className="w-4 h-4 text-[#2E6B56]" />
                          {latestSpo2}% SpO2
                        </span>
                        <span>•</span>
                        <span>Battery {wearableDevice.batteryPercent || 88}%</span>
                      </>
                    ) : (
                      'Tap to open band settings'
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const statusText = !wearableDevice || wearableDevice.status === 'disconnected'
                      ? t.bandNotConnected
                      : t.bandConnected;
                    handleReadAloud(statusText);
                  }}
                  className="min-h-[64px] min-w-[64px] rounded-xl bg-[#F4F8F5] border border-[#CBDCD2] text-[#132A22] flex items-center justify-center"
                  aria-label="Listen to band status"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
                <ChevronRight className="w-7 h-7 text-[#4A6B5D]" />
              </div>
            </div>

            {/* 3. NEXT MEDICINE CARD (text at least 24px) */}
            <div className={`p-5 sm:p-6 rounded-2xl ${cardBg} space-y-4`}>
              <div className="flex items-center justify-between">
                <span className="text-[18px] font-bold uppercase tracking-wider text-[#4A6B5D]">
                  {language === 'hi' ? 'अगली दवा' : 'Next Medicine'}
                </span>
                {dueDoseNow && (
                  <span className="px-3 py-1 bg-[#FFF0EE] text-[#C93B2B] border border-[#F5C2BC] font-bold text-[18px] rounded-lg">
                    {t.badgeDueNow || 'Due now'}
                  </span>
                )}
              </div>

              {dueDoseNow ? (
                <div className="space-y-4">
                  <div>
                    <h3 className={cardTitleClass}>{dueDoseNow.medicineName}</h3>
                    <p className={bodyClass}>
                      {dueDoseNow.scheduledTime} • {dueDoseNow.dosageInstructions || 'Take with water after meal'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        takeDoseSenior(dueDoseNow.id);
                        showToast('Dose confirmed! Great job.', 'success');
                      }}
                      className="min-h-[64px] py-3.5 px-4 rounded-xl bg-[#1C3F32] hover:bg-[#132A22] text-white font-bold text-[22px] flex items-center justify-center gap-2"
                    >
                      <Check className="w-6 h-6" />
                      <span>I have taken this</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        snoozeDoseSenior(dueDoseNow.id);
                        showToast('Reminder snoozed for 5 minutes', 'info');
                      }}
                      className="min-h-[64px] py-3.5 px-4 rounded-xl bg-white hover:bg-[#F4F8F5] text-[#132A22] border-2 border-[#CBDCD2] font-bold text-[22px] flex items-center justify-center gap-2"
                    >
                      <Clock className="w-6 h-6" />
                      <span>Remind in 5 min</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <h3 className={cardTitleClass}>
                    {language === 'hi' ? 'अभी कोई दवा बाकी नहीं है' : 'No medicines scheduled right now'}
                  </h3>
                  <p className="text-[18px] text-[#4A6B5D]">
                    {language === 'hi' ? 'आपकी सभी दवाएं समय पर ली जा चुकी हैं।' : 'All scheduled medicines are up to date.'}
                  </p>
                </div>
              )}
            </div>

            {/* 4. THREE LARGE ACTION ROWS (>= 88px tall, full width, large icon tile on left, label >= 28px) */}
            <div className="space-y-4">
              {/* Row 1: Today's medicine */}
              <button
                type="button"
                onClick={() => setScreen('medicine_today')}
                className={`w-full min-h-[88px] p-4 sm:p-5 rounded-2xl ${cardBg} hover:border-[#1C3F32] text-left flex items-center justify-between gap-4 transition-colors focus:ring-4 focus:ring-[#1C3F32]`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#EBF3EE] border border-[#CBDCD2] text-[#1C3F32] flex items-center justify-center shrink-0">
                    <Pill className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-[28px] font-bold text-[#132A22] leading-tight">
                      {t.actionMedicineToday || "Today's medicine"}
                    </div>
                    <div className="text-[18px] text-[#4A6B5D]">
                      {doses.filter((d) => d.status === 'taken').length} of {doses.length} completed
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-7 h-7 text-[#4A6B5D] shrink-0" />
              </button>

              {/* Row 2: Daily check-in */}
              <button
                type="button"
                onClick={() => setScreen('checkin_q1')}
                className={`w-full min-h-[88px] p-4 sm:p-5 rounded-2xl ${cardBg} hover:border-[#1C3F32] text-left flex items-center justify-between gap-4 transition-colors focus:ring-4 focus:ring-[#1C3F32]`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#EBF3EE] border border-[#CBDCD2] text-[#1C3F32] flex items-center justify-center shrink-0">
                    <CheckSquare className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-[28px] font-bold text-[#132A22] leading-tight">
                      {t.actionDailyCheckin || 'Daily check-in'}
                    </div>
                    <div className="text-[18px] text-[#4A6B5D]">
                      {language === 'hi' ? '4 सरल प्रश्न और आवाज का संदेश' : '4 simple questions & voice note'}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-7 h-7 text-[#4A6B5D] shrink-0" />
              </button>

              {/* Row 3: Talk to my coordinator */}
              <button
                type="button"
                onClick={() => setScreen('appointment_request')}
                className={`w-full min-h-[88px] p-4 sm:p-5 rounded-2xl ${cardBg} hover:border-[#1C3F32] text-left flex items-center justify-between gap-4 transition-colors focus:ring-4 focus:ring-[#1C3F32]`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#EBF3EE] border border-[#CBDCD2] text-[#1C3F32] flex items-center justify-center shrink-0">
                    <Phone className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-[28px] font-bold text-[#132A22] leading-tight">
                      {t.actionTalkCoordinator || 'Talk to my coordinator'}
                    </div>
                    <div className="text-[18px] text-[#4A6B5D]">
                      {selectedSenior.assignedCoordinatorName || 'Nimish Gupta'}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-7 h-7 text-[#4A6B5D] shrink-0" />
              </button>
            </div>

            {/* 5. ONE LARGE ROW "MORE" (>= 72px tall) */}
            <button
              type="button"
              onClick={() => setScreen('more')}
              className={`w-full min-h-[72px] p-4 sm:p-5 rounded-2xl ${cardBg} hover:border-[#1C3F32] text-left flex items-center justify-between gap-4 transition-colors focus:ring-4 focus:ring-[#1C3F32]`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#CBDCD2] text-[#1C3F32] flex items-center justify-center shrink-0">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <span className="text-[24px] font-bold text-[#132A22]">
                  {t.actionMore || 'More Options'}
                </span>
              </div>
              <ChevronRight className="w-7 h-7 text-[#4A6B5D] shrink-0" />
            </button>
          </>
        )}

        {/* ========================================================
            SCREEN 3: MORE SCREEN (Replaces the 14px footer links)
           ======================================================== */}
        {screen === 'more' && (
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setScreen('home')}
              className="min-h-[64px] px-6 py-3 rounded-2xl bg-white border border-[#CBDCD2] text-[#132A22] font-bold text-[22px] flex items-center gap-2"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>{t.back}</span>
            </button>

            <h2 className={headingClass}>{t.actionMore || 'More Options'}</h2>

            <div className="space-y-4">
              {/* 1. Language Toggle */}
              <button
                type="button"
                onClick={() => {
                  const nextLang = language === 'en' ? 'hi' : 'en';
                  setLanguage(nextLang);
                  showToast(nextLang === 'hi' ? 'भाषा हिन्दी में बदली गई' : 'Switched to English', 'info');
                }}
                className={`w-full min-h-[72px] p-4 rounded-2xl ${cardBg} text-left flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3.5">
                  <Languages className="w-7 h-7 text-[#1C3F32]" />
                  <div>
                    <div className="text-[24px] font-bold">{language === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}</div>
                    <div className="text-[18px] text-[#4A6B5D]">{t.moreLanguageDesc}</div>
                  </div>
                </div>
                <span className="text-[20px] font-bold text-[#1C3F32]">{language.toUpperCase()}</span>
              </button>

              {/* 2. My Band Settings */}
              <button
                type="button"
                onClick={() => setScreen('band_settings')}
                className={`w-full min-h-[72px] p-4 rounded-2xl ${cardBg} text-left flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3.5">
                  <Watch className="w-7 h-7 text-[#1C3F32]" />
                  <div>
                    <div className="text-[24px] font-bold">{t.bandSettingsTitle}</div>
                    <div className="text-[18px] text-[#4A6B5D]">{t.moreBandDesc}</div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-[#4A6B5D]" />
              </button>

              {/* 3. Share with Family */}
              <button
                type="button"
                onClick={() => setScreen('consent_settings')}
                className={`w-full min-h-[72px] p-4 rounded-2xl ${cardBg} text-left flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3.5">
                  <Eye className="w-7 h-7 text-[#1C3F32]" />
                  <div>
                    <div className="text-[24px] font-bold">{language === 'hi' ? 'परिवार के साथ साझा करें' : 'Share with family'}</div>
                    <div className="text-[18px] text-[#4A6B5D]">{t.moreFamilyDesc}</div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-[#4A6B5D]" />
              </button>

              {/* 4. Share my location */}
              <button
                type="button"
                onClick={() => setScreen('location_settings')}
                className={`w-full min-h-[72px] p-4 rounded-2xl ${cardBg} text-left flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3.5">
                  <MapPin className="w-7 h-7 text-[#1C3F32]" />
                  <div>
                    <div className="text-[24px] font-bold">{t.shareLocationTitle}</div>
                    <div className="text-[18px] text-[#4A6B5D]">{t.moreLocationDesc}</div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-[#4A6B5D]" />
              </button>

              {/* 5. Add today's health reading */}
              <button
                type="button"
                onClick={() => setScreen('reading_entry')}
                className={`w-full min-h-[72px] p-4 rounded-2xl ${cardBg} text-left flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3.5">
                  <Activity className="w-7 h-7 text-[#1C3F32]" />
                  <div>
                    <div className="text-[24px] font-bold">{language === 'hi' ? 'स्वास्थ्य रीडिंग दर्ज करें' : "Add today's reading"}</div>
                    <div className="text-[18px] text-[#4A6B5D]">{t.moreHealthReadingDesc}</div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-[#4A6B5D]" />
              </button>

              {/* 6. Larger text */}
              <button
                type="button"
                onClick={() => {
                  setLargerText(!largerText);
                  showToast(largerText ? 'Normal text size' : 'Larger text enabled', 'info');
                }}
                className={`w-full min-h-[72px] p-4 rounded-2xl ${cardBg} text-left flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3.5">
                  <Plus className="w-7 h-7 text-[#1C3F32]" />
                  <div>
                    <div className="text-[24px] font-bold">{t.largerText}</div>
                    <div className="text-[18px] text-[#4A6B5D]">{t.moreLargerTextDesc}</div>
                  </div>
                </div>
                <span className="text-[20px] font-bold text-[#1C3F32]">{largerText ? 'ON' : 'OFF'}</span>
              </button>

              {/* 7. High contrast */}
              <button
                type="button"
                onClick={() => {
                  setHighContrast(!highContrast);
                  showToast(highContrast ? 'Normal contrast' : 'High contrast enabled', 'info');
                }}
                className={`w-full min-h-[72px] p-4 rounded-2xl ${cardBg} text-left flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3.5">
                  <SunMedium className="w-7 h-7 text-[#1C3F32]" />
                  <div>
                    <div className="text-[24px] font-bold">{t.highContrast}</div>
                    <div className="text-[18px] text-[#4A6B5D]">{t.moreHighContrastDesc}</div>
                  </div>
                </div>
                <span className="text-[20px] font-bold text-[#1C3F32]">{highContrast ? 'ON' : 'OFF'}</span>
              </button>

              {/* 8. Add to Home Screen (PWA Guide) */}
              <button
                type="button"
                onClick={() => setScreen('pwa_guide')}
                className={`w-full min-h-[72px] p-4 rounded-2xl ${cardBg} text-left flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3.5">
                  <Smartphone className="w-7 h-7 text-[#1C3F32]" />
                  <div>
                    <div className="text-[24px] font-bold">{t.moreAddToHomeScreen}</div>
                    <div className="text-[18px] text-[#4A6B5D]">{t.moreAddToHomeScreenDesc}</div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-[#4A6B5D]" />
              </button>

              {/* 9. Sign Out */}
              <button
                type="button"
                onClick={() => {
                  const confirmMsg = language === 'hi'
                    ? 'क्या आप वाकई साइन आउट करना चाहते हैं?'
                    : 'Are you sure you want to sign out?';
                  if (window.confirm(confirmMsg)) {
                    logout();
                    window.location.href = '/login';
                  }
                }}
                className={`w-full min-h-[72px] p-4 rounded-2xl ${cardBg} text-left flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3.5">
                  <LogOut className="w-7 h-7 text-[#C93B2B]" />
                  <div>
                    <div className="text-[24px] font-bold text-[#C93B2B]">{language === 'hi' ? 'साइन आउट करें' : 'Sign out'}</div>
                    <div className="text-[18px] text-[#4A6B5D]">{t.moreSignOutDesc}</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 4: BAND SETTINGS & KEEP SCREEN ON
           ======================================================== */}
        {screen === 'band_settings' && (
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setScreen('home')}
              className="min-h-[64px] px-6 py-3 rounded-2xl bg-white border border-[#CBDCD2] text-[#132A22] font-bold text-[22px] flex items-center gap-2"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>{t.back}</span>
            </button>

            <div className={`p-6 sm:p-8 rounded-2xl ${cardBg} space-y-6`}>
              <div className="flex items-center justify-between gap-3">
                <h2 className={headingClass}>{t.bandSettingsTitle}</h2>
                <button
                  type="button"
                  onClick={() => {
                    const statusText = wearableDevice?.status === 'connected'
                      ? (language === 'hi'
                          ? `आपका हेल्थ बैंड जुड़ा हुआ है। हृदय गति ${latestHeartRate} बीपीएम है, ऑक्सीजन ${latestSpo2} प्रतिशत है, और आज आपने ${latestSteps} कदम चले हैं।`
                          : `Your health band is connected. Your heart rate is ${latestHeartRate} bpm, oxygen level is ${latestSpo2} percent, and you have taken ${latestSteps} steps today.`)
                      : (language === 'hi'
                          ? 'हेल्थ बैंड जुड़ा नहीं है। कृपया बैंड जोड़ें।'
                          : 'Health band is not connected. Please connect your band.');
                    handleReadAloud(statusText);
                  }}
                  className="min-h-[64px] min-w-[64px] rounded-xl bg-[#F4F8F5] border border-[#CBDCD2] text-[#132A22] flex items-center justify-center shrink-0"
                  aria-label="Listen to band details"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>

              {/* Status display */}
              <div className="p-5 rounded-2xl bg-[#F4F8F5] border border-[#CBDCD2] space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-[24px] font-bold flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-full ${wearableDevice?.status === 'connected' ? 'bg-[#2E6B56] animate-pulse' : 'bg-[#C93B2B]'}`} />
                    {!wearableDevice || wearableDevice.status === 'disconnected'
                      ? t.bandNotConnected
                      : wearableDevice.status === 'reconnecting'
                      ? t.bandReconnecting
                      : t.bandConnected}
                  </div>
                  <span className="text-[18px] font-bold text-[#1C3F32] bg-white px-3 py-1.5 rounded-xl border border-[#CBDCD2] flex items-center gap-1.5">
                    <BatteryCharging className="w-5 h-5 text-[#2E6B56]" />
                    {wearableDevice?.batteryPercent ? `${wearableDevice.batteryPercent}%` : '88%'}
                  </span>
                </div>
                <div className="text-[18px] text-[#4A6B5D]">
                  Device: {wearableDevice?.vendorModelName || 'Samarth Smart Health Band'}
                </div>
                <div className="text-[16px] text-[#4A6B5D]">
                  {t.simulatedDevice}
                </div>
              </div>

              {/* Live Vitals Grid from Band */}
              {wearableDevice?.status === 'connected' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Heart Rate Tile */}
                  <div className="p-5 rounded-2xl bg-white border-2 border-[#CBDCD2] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[18px] font-bold text-[#4A6B5D] uppercase tracking-wide">
                        {language === 'hi' ? 'हृदय गति' : 'Heart Rate'}
                      </span>
                      <Heart className="w-6 h-6 text-[#C93B2B] fill-[#C93B2B] animate-pulse" />
                    </div>
                    <div className="text-[36px] font-black text-[#132A22]">
                      {latestHeartRate} <span className="text-[20px] font-semibold text-[#4A6B5D]">bpm</span>
                    </div>
                    <div className="text-[16px] text-[#2E6B56] font-semibold">
                      {latestHeartRate > 100
                        ? (language === 'hi' ? 'हृदय गति थोड़ी तेज है' : 'Heart rate is elevated')
                        : (language === 'hi' ? 'हृदय गति सामान्य है' : 'Normal resting pulse')}
                    </div>
                  </div>

                  {/* Blood Oxygen SpO2 Tile */}
                  <div className="p-5 rounded-2xl bg-white border-2 border-[#CBDCD2] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[18px] font-bold text-[#4A6B5D] uppercase tracking-wide">
                        {language === 'hi' ? 'ऑक्सीजन (SpO2)' : 'Blood Oxygen'}
                      </span>
                      <Activity className="w-6 h-6 text-[#2E6B56]" />
                    </div>
                    <div className="text-[36px] font-black text-[#132A22]">
                      {latestSpo2}<span className="text-[22px] font-semibold text-[#4A6B5D]">%</span>
                    </div>
                    <div className="text-[16px] text-[#2E6B56] font-semibold">
                      {latestSpo2 < 92
                        ? (language === 'hi' ? 'ऑक्सीजन कम है' : 'Oxygen is low')
                        : (language === 'hi' ? 'स्वस्थ ऑक्सीजन स्तर' : 'Healthy oxygen level')}
                    </div>
                  </div>

                  {/* Daily Steps Tracker Tile */}
                  <div className="p-5 rounded-2xl bg-white border-2 border-[#CBDCD2] space-y-2 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[18px] font-bold text-[#4A6B5D] uppercase tracking-wide">
                        {language === 'hi' ? 'आज के कदम' : 'Today’s Steps'}
                      </span>
                      <span className="text-[18px] font-bold text-[#1C3F32]">
                        {Math.min(100, Math.round((latestSteps / 5000) * 100))}% {language === 'hi' ? 'लक्ष्य' : 'of goal'}
                      </span>
                    </div>
                    <div className="text-[36px] font-black text-[#132A22]">
                      {latestSteps.toLocaleString()} <span className="text-[20px] font-semibold text-[#4A6B5D]">{language === 'hi' ? 'कदम' : 'steps'}</span>
                    </div>
                    <div className="w-full bg-[#EBF3EE] rounded-full h-3">
                      <div
                        className="bg-[#2E6B56] h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.round((latestSteps / 5000) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons: Sync Now / Connect / Disconnect */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={async () => {
                    await connectSimulator();
                    showToast(
                      language === 'hi'
                        ? `बैंड सिंक हुआ: पल्स ${latestHeartRate} bpm, ऑक्सीजन ${latestSpo2}%`
                        : `Band synced: Pulse ${latestHeartRate} bpm, SpO2 ${latestSpo2}%`,
                      'success'
                    );
                  }}
                  className="w-full min-h-[72px] px-6 py-4 rounded-2xl bg-[#1C3F32] hover:bg-[#132A22] text-white font-bold text-[24px] flex items-center justify-center gap-3"
                >
                  <Watch className="w-7 h-7" />
                  <span>
                    {!wearableDevice || wearableDevice.status === 'disconnected'
                      ? t.connectMyBand
                      : (language === 'hi' ? 'ताजा पल्स पढ़ें / सिंक करें' : 'Sync & Check Pulse Now')}
                  </span>
                </button>

                {wearableDevice && wearableDevice.status === 'connected' && (
                  <button
                    type="button"
                    onClick={async () => {
                      await disconnectDevice();
                      showToast(language === 'hi' ? 'बैंड डिस्कनेक्ट हुआ' : 'Band disconnected', 'info');
                    }}
                    className="w-full min-h-[64px] px-6 py-3 rounded-2xl bg-white border-2 border-[#CBDCD2] text-[#C93B2B] hover:bg-red-50 font-bold text-[20px] flex items-center justify-center gap-2"
                  >
                    <span>{language === 'hi' ? 'बैंड डिस्कनेक्ट करें' : 'Disconnect Band'}</span>
                  </button>
                )}
              </div>

              {/* Keep Screen On Toggle */}
              <div className="p-4 rounded-2xl border border-[#CBDCD2] flex items-center justify-between gap-3">
                <div>
                  <div className="text-[22px] font-bold">{t.keepScreenOnTitle}</div>
                  <div className="text-[16px] text-[#4A6B5D]">{t.keepScreenOnDesc}</div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleWakeLock}
                  className={`min-h-[64px] px-5 py-2 rounded-xl font-bold text-[18px] ${
                    keepScreenOn ? 'bg-[#1C3F32] text-white' : 'bg-white text-[#132A22] border-2 border-[#CBDCD2]'
                  }`}
                >
                  {keepScreenOn ? 'Active' : 'Turn On'}
                </button>
              </div>

              {/* Consent Toggle: Share my band readings */}
              <button
                type="button"
                onClick={() => {
                  toggleConsent(selectedSenior.id, !selectedSenior.familyConsentGranted);
                  showToast(
                    !selectedSenior.familyConsentGranted ? t.bandConsentGranted : t.bandConsentPaused,
                    'info'
                  );
                }}
                className={`w-full min-h-[72px] p-5 rounded-2xl border-2 text-left flex items-center justify-between gap-3 ${
                  selectedSenior.familyConsentGranted
                    ? 'bg-[#EBF3EE] border-[#1C3F32] text-[#132A22]'
                    : 'bg-white border-[#CBDCD2] text-[#4A6B5D]'
                }`}
              >
                <span className="text-[20px] font-bold">{t.bandConsentPrompt}</span>
                <Check className={`w-7 h-7 shrink-0 ${selectedSenior.familyConsentGranted ? 'text-[#1C3F32]' : 'opacity-0'}`} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 5: GUIDED 1-STEP PAIRING FLOW
           ======================================================== */}
        {screen === 'band_connect_flow' && (
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => {
                if (bandConnectStep === 2) setBandConnectStep(1);
                else setScreen('band_settings');
              }}
              className="min-h-[64px] px-6 py-3 rounded-2xl bg-white border border-[#CBDCD2] text-[#132A22] font-bold text-[22px] flex items-center gap-2"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>{t.back}</span>
            </button>

            <div className={`p-6 sm:p-8 rounded-2xl ${cardBg} space-y-6 text-center`}>
              <h2 className={headingClass}>{t.connectMyBand}</h2>

              {bandConnectStep === 1 ? (
                <div className="space-y-6 py-4">
                  <div className="w-24 h-24 rounded-3xl bg-[#EBF3EE] border-2 border-[#2E6B56] flex items-center justify-center mx-auto text-[#1C3F32]">
                    <Watch className="w-12 h-12" />
                  </div>
                  <p className="text-[24px] font-bold text-[#132A22] leading-snug">
                    {t.connectBandStep1}
                  </p>
                  <button
                    type="button"
                    onClick={() => setBandConnectStep(2)}
                    className="w-full min-h-[72px] px-6 py-4 rounded-2xl bg-[#1C3F32] hover:bg-[#132A22] text-white font-bold text-[24px]"
                  >
                    Next Step →
                  </button>
                </div>
              ) : (
                <div className="space-y-6 py-4">
                  <div className="w-24 h-24 rounded-3xl bg-[#EBF3EE] border-2 border-[#2E6B56] flex items-center justify-center mx-auto text-[#1C3F32]">
                    <BatteryCharging className="w-12 h-12" />
                  </div>
                  <p className="text-[24px] font-bold text-[#132A22] leading-snug">
                    {t.connectBandStep2}
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      await connectSimulator();
                      showToast(t.bandConnected, 'success');
                      setScreen('band_settings');
                    }}
                    className="w-full min-h-[72px] px-6 py-4 rounded-2xl bg-[#1C3F32] hover:bg-[#132A22] text-white font-bold text-[24px] flex items-center justify-center gap-2"
                  >
                    <Check className="w-7 h-7" />
                    <span>Connect Now</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 6: LOCATION SHARING CHOICE SCREEN
           ======================================================== */}
        {screen === 'location_settings' && (
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setScreen('home')}
              className="min-h-[64px] px-6 py-3 rounded-2xl bg-white border border-[#CBDCD2] text-[#132A22] font-bold text-[22px] flex items-center gap-2"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>{t.back}</span>
            </button>

            <div className={`p-6 rounded-2xl ${cardBg} space-y-5`}>
              <h2 className={headingClass}>{t.shareLocationTitle}</h2>
              <p className={bodyClass}>
                {language === 'hi'
                  ? 'तय करें कि आप अपना स्थान कब और किसके साथ साझा करना चाहती हैं।'
                  : 'Choose when and how your location is shared for safety.'}
              </p>

              <div className="space-y-4 pt-2">
                {/* Option 1: Only in an emergency (default) */}
                <button
                  type="button"
                  onClick={() => handleSelectLocationSharing('emergency_only')}
                  className={`w-full min-h-[80px] p-5 rounded-2xl border-2 text-left flex items-start justify-between gap-3 ${
                    selectedSenior.locationSharing === 'emergency_only' || !selectedSenior.locationSharing
                      ? 'bg-[#EBF3EE] border-[#1C3F32]'
                      : 'bg-white border-[#CBDCD2]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-[22px] font-bold text-[#132A22] flex items-center gap-2">
                      <Shield className="w-6 h-6 text-[#1C3F32]" />
                      <span>{t.locationEmergencyOnlyTitle}</span>
                    </div>
                    <div className="text-[18px] text-[#4A6B5D]">{t.locationEmergencyOnlyDesc}</div>
                  </div>
                  {(selectedSenior.locationSharing === 'emergency_only' || !selectedSenior.locationSharing) && (
                    <Check className="w-7 h-7 text-[#1C3F32] shrink-0" />
                  )}
                </button>

                {/* Option 2: Live sharing while app is open */}
                <button
                  type="button"
                  onClick={() => handleSelectLocationSharing('live')}
                  className={`w-full min-h-[80px] p-5 rounded-2xl border-2 text-left flex items-start justify-between gap-3 ${
                    selectedSenior.locationSharing === 'live'
                      ? 'bg-[#EBF3EE] border-[#1C3F32]'
                      : 'bg-white border-[#CBDCD2]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-[22px] font-bold text-[#132A22] flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-[#1C3F32]" />
                      <span>{t.locationLiveTitle}</span>
                    </div>
                    <div className="text-[18px] text-[#4A6B5D]">{t.locationLiveDesc}</div>
                  </div>
                  {selectedSenior.locationSharing === 'live' && (
                    <Check className="w-7 h-7 text-[#1C3F32] shrink-0" />
                  )}
                </button>

                {/* Option 3: Do not share my location */}
                <button
                  type="button"
                  onClick={() => handleSelectLocationSharing('do_not_share')}
                  className={`w-full min-h-[80px] p-5 rounded-2xl border-2 text-left flex items-start justify-between gap-3 ${
                    selectedSenior.locationSharing === 'do_not_share'
                      ? 'bg-[#FFF0EE] border-[#C93B2B]'
                      : 'bg-white border-[#CBDCD2]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-[22px] font-bold text-[#132A22] flex items-center gap-2">
                      <X className="w-6 h-6 text-[#C93B2B]" />
                      <span>{t.locationDoNotShareTitle}</span>
                    </div>
                    <div className="text-[18px] text-[#4A6B5D]">{t.locationDoNotShareDesc}</div>
                  </div>
                  {selectedSenior.locationSharing === 'do_not_share' && (
                    <Check className="w-7 h-7 text-[#C93B2B] shrink-0" />
                  )}
                </button>

                {/* Plain Words Warning & Confirm Tap for Do Not Share */}
                {confirmDoNotShare && (
                  <div className="p-5 rounded-2xl bg-[#FFF0EE] border-2 border-[#C93B2B] space-y-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-7 h-7 text-[#C93B2B] shrink-0" />
                      <p className="text-[20px] font-bold text-[#C93B2B] leading-snug">
                        {t.locationDoNotShareWarning}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectLocationSharing('do_not_share')}
                      className="w-full min-h-[64px] rounded-xl bg-[#C93B2B] hover:bg-[#A82D20] text-white font-bold text-[20px]"
                    >
                      {t.locationDoNotShareConfirm}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 7: PWA INSTALL GUIDE
           ======================================================== */}
        {screen === 'pwa_guide' && (
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setScreen('more')}
              className="min-h-[64px] px-6 py-3 rounded-2xl bg-white border border-[#CBDCD2] text-[#132A22] font-bold text-[22px] flex items-center gap-2"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>{t.back}</span>
            </button>

            <div className={`p-6 sm:p-8 rounded-2xl ${cardBg} space-y-6`}>
              <h2 className={headingClass}>{t.addToHomeScreenTitle}</h2>
              <div className="w-20 h-20 rounded-2xl bg-[#EBF3EE] border border-[#CBDCD2] flex items-center justify-center mx-auto text-[#1C3F32]">
                <Smartphone className="w-10 h-10" />
              </div>
              <p className={bodyClass}>
                {t.addToHomeScreenSteps}
              </p>
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#CBDCD2] text-[18px] text-[#4A6B5D]">
                Notice: Installing as an app allows quick access from your phone home screen. Web browsers cannot maintain continuous Bluetooth or location tracking in the background.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 8: NOTIFICATIONS
           ======================================================== */}
        {screen === 'notifications' && (
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setScreen('home')}
              className="min-h-[64px] px-6 py-3 rounded-2xl bg-white border border-[#CBDCD2] text-[#132A22] font-bold text-[22px] flex items-center gap-2"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>{t.back}</span>
            </button>

            <div className={`p-6 rounded-2xl ${cardBg} space-y-4`}>
              <h2 className={headingClass}>{language === 'hi' ? 'सूचनाएं' : 'Notifications'}</h2>
              {roleNotifications.length === 0 ? (
                <p className={bodyClass}>
                  {language === 'hi' ? 'अभी कोई नई सूचना नहीं है।' : 'No new notifications right now.'}
                </p>
              ) : (
                <div className="space-y-3">
                  {roleNotifications.map((notif) => (
                    <div key={notif.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#CBDCD2] space-y-1">
                      <div className="text-[20px] font-bold">{notif.title}</div>
                      <div className="text-[18px] text-[#4A6B5D]">{notif.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 9: MEDICINES TODAY
           ======================================================== */}
        {screen === 'medicine_today' && (
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setScreen('home')}
              className="min-h-[64px] px-6 py-3 rounded-2xl bg-white border border-[#CBDCD2] text-[#132A22] font-bold text-[22px] flex items-center gap-2"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>{t.back}</span>
            </button>

            <div className={`p-6 rounded-2xl ${cardBg} space-y-5`}>
              <h2 className={headingClass}>{t.actionMedicineToday}</h2>

              {doses.length === 0 ? (
                <p className={bodyClass}>No medicines recorded for today.</p>
              ) : (
                <div className="space-y-4">
                  {doses.map((dose) => (
                    <div key={dose.id} className="p-5 rounded-2xl border border-[#CBDCD2] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[24px] font-bold">{dose.medicineName}</span>
                        <span className="text-[18px] font-bold px-3 py-1 bg-[#FAF8F5] rounded-lg">
                          {dose.scheduledTime}
                        </span>
                      </div>
                      <div className="text-[18px] text-[#4A6B5D]">
                        Status: {dose.status === 'taken' ? 'Taken' : 'Pending'}
                      </div>
                      {dose.status !== 'taken' && (
                        <button
                          type="button"
                          onClick={() => {
                            takeDoseSenior(dose.id);
                            showToast('Medicine marked as taken', 'success');
                          }}
                          className="w-full min-h-[64px] rounded-xl bg-[#1C3F32] text-white font-bold text-[20px] flex items-center justify-center gap-2"
                        >
                          <Check className="w-6 h-6" />
                          <span>I have taken this</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 10-13: CHECK-IN QUESTIONS 1 TO 4
           ======================================================== */}
        {screen === 'checkin_q1' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardBg} space-y-6`}>
            <button
              type="button"
              onClick={() => setScreen('home')}
              className="min-h-[64px] px-6 py-3 rounded-2xl bg-white border border-[#CBDCD2] text-[#132A22] font-bold text-[22px] flex items-center gap-2"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>{t.back}</span>
            </button>
            <span className="text-[18px] font-bold uppercase tracking-wider text-[#4A6B5D]">
              Question 1 of 4
            </span>
            <h2 className={headingClass}>{t.question1Title}</h2>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleCheckinAnswer(1, 1)}
                className="w-full min-h-[72px] p-4 rounded-xl bg-[#EBF3EE] text-[#132A22] border-2 border-[#1C3F32] font-bold text-[24px]"
              >
                1 : Good / Comfortable
              </button>
              <button
                type="button"
                onClick={() => handleCheckinAnswer(1, 2)}
                className="w-full min-h-[72px] p-4 rounded-xl bg-white text-[#132A22] border-2 border-[#CBDCD2] font-bold text-[24px]"
              >
                2 : A little unwell
              </button>
              <button
                type="button"
                onClick={() => handleCheckinAnswer(1, 3)}
                className="w-full min-h-[72px] p-4 rounded-xl bg-white text-[#132A22] border-2 border-[#CBDCD2] font-bold text-[24px]"
              >
                3 : Very unwell
              </button>
            </div>
          </div>
        )}

        {screen === 'checkin_q2' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardBg} space-y-6`}>
            <span className="text-[18px] font-bold uppercase tracking-wider text-[#4A6B5D]">
              Question 2 of 4
            </span>
            <h2 className={headingClass}>{t.question2Title}</h2>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleCheckinAnswer(2, 1)}
                className="w-full min-h-[72px] p-4 rounded-xl bg-[#EBF3EE] text-[#132A22] border-2 border-[#1C3F32] font-bold text-[24px]"
              >
                1 : Yes, taken on time
              </button>
              <button
                type="button"
                onClick={() => handleCheckinAnswer(2, 2)}
                className="w-full min-h-[72px] p-4 rounded-xl bg-white text-[#132A22] border-2 border-[#CBDCD2] font-bold text-[24px]"
              >
                2 : Delayed / Missed one
              </button>
              <button
                type="button"
                onClick={() => handleCheckinAnswer(2, 3)}
                className="w-full min-h-[72px] p-4 rounded-xl bg-white text-[#132A22] border-2 border-[#CBDCD2] font-bold text-[24px]"
              >
                3 : Did not take
              </button>
            </div>
          </div>
        )}

        {screen === 'checkin_q3' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardBg} space-y-6`}>
            <span className="text-[18px] font-bold uppercase tracking-wider text-[#4A6B5D]">
              Question 3 of 4
            </span>
            <h2 className={headingClass}>{t.question3Title}</h2>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleCheckinAnswer(3, 1)}
                className="w-full min-h-[72px] p-4 rounded-xl bg-[#EBF3EE] text-[#132A22] border-2 border-[#1C3F32] font-bold text-[24px]"
              >
                1 : Slept comfortably
              </button>
              <button
                type="button"
                onClick={() => handleCheckinAnswer(3, 2)}
                className="w-full min-h-[72px] p-4 rounded-xl bg-white text-[#132A22] border-2 border-[#CBDCD2] font-bold text-[24px]"
              >
                2 : Woke up a few times
              </button>
              <button
                type="button"
                onClick={() => handleCheckinAnswer(3, 3)}
                className="w-full min-h-[72px] p-4 rounded-xl bg-white text-[#132A22] border-2 border-[#CBDCD2] font-bold text-[24px]"
              >
                3 : Very poor sleep
              </button>
            </div>
          </div>
        )}

        {screen === 'checkin_q4' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardBg} space-y-6`}>
            <span className="text-[18px] font-bold uppercase tracking-wider text-[#4A6B5D]">
              Question 4 of 4
            </span>
            <h2 className={headingClass}>{t.question4Title}</h2>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleCheckinAnswer(4, 1)}
                className="w-full min-h-[72px] p-4 rounded-xl bg-[#EBF3EE] text-[#132A22] border-2 border-[#1C3F32] font-bold text-[24px]"
              >
                1 : Normal meal, feel full
              </button>
              <button
                type="button"
                onClick={() => handleCheckinAnswer(4, 2)}
                className="w-full min-h-[72px] p-4 rounded-xl bg-white text-[#132A22] border-2 border-[#CBDCD2] font-bold text-[24px]"
              >
                2 : Ate less than usual
              </button>
              <button
                type="button"
                onClick={() => handleCheckinAnswer(4, 3)}
                className="w-full min-h-[72px] p-4 rounded-xl bg-white text-[#132A22] border-2 border-[#CBDCD2] font-bold text-[24px]"
              >
                3 : Could not eat
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 14: VOICE NOTE
           ======================================================== */}
        {screen === 'voice_note' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardBg} space-y-6 text-center`}>
            <h2 className={headingClass}>{t.voiceNoteTitle}</h2>
            <p className={bodyClass}>{t.voiceNoteInstruction}</p>

            <div className="py-4">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="w-full min-h-[80px] rounded-2xl bg-[#1C3F32] hover:bg-[#132A22] text-white font-bold text-[26px] flex items-center justify-center gap-3"
                >
                  <Mic className="w-8 h-8" />
                  <span>{t.voiceNoteStart}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="w-full min-h-[80px] rounded-2xl bg-[#C93B2B] hover:bg-[#A82D20] text-white font-bold text-[26px] flex items-center justify-center gap-3 animate-pulse"
                >
                  <Square className="w-8 h-8" />
                  <span>{t.voiceNoteStop} ({recordSeconds}s)</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleFinishCheckin(true)}
                className="min-h-[64px] rounded-xl bg-[#1C3F32] text-white font-bold text-[20px]"
              >
                Save & Finish
              </button>
              <button
                type="button"
                onClick={() => handleFinishCheckin(false)}
                className="min-h-[64px] rounded-xl bg-white border border-[#CBDCD2] text-[#132A22] font-bold text-[20px]"
              >
                Skip Voice Note
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 15: THANK YOU
           ======================================================== */}
        {screen === 'thank_you' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardBg} space-y-6 text-center`}>
            <div className="w-20 h-20 rounded-full bg-[#EBF3EE] text-[#1C3F32] flex items-center justify-center mx-auto border-2 border-[#1C3F32]">
              <Check className="w-10 h-10" />
            </div>
            <h2 className={headingClass}>{language === 'hi' ? 'धन्यवाद कमला जी!' : 'Thank you, Kamla!'}</h2>
            <p className={bodyClass}>
              {language === 'hi'
                ? 'आपका दैनिक चेक-इन सफलतापूर्वक दर्ज कर लिया गया है।'
                : 'Your daily check-in has been shared with your care coordinator.'}
            </p>
            <button
              type="button"
              onClick={() => setScreen('home')}
              className="w-full min-h-[72px] rounded-2xl bg-[#1C3F32] text-white font-bold text-[24px]"
            >
              Return to Home
            </button>
          </div>
        )}

        {/* ========================================================
            SCREEN 16: READING ENTRY (BP / Sugar)
           ======================================================== */}
        {screen === 'reading_entry' && (
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setScreen('home')}
              className="min-h-[64px] px-6 py-3 rounded-2xl bg-white border border-[#CBDCD2] text-[#132A22] font-bold text-[22px] flex items-center gap-2"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>{t.back}</span>
            </button>

            <div className={`p-6 rounded-2xl ${cardBg} space-y-5`}>
              <h2 className={headingClass}>Add Health Reading</h2>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReadingType('bp')}
                  className={`flex-1 min-h-[64px] rounded-xl font-bold text-[20px] ${
                    readingType === 'bp' ? 'bg-[#1C3F32] text-white' : 'bg-[#FAF8F5] border'
                  }`}
                >
                  Blood Pressure
                </button>
                <button
                  type="button"
                  onClick={() => setReadingType('sugar')}
                  className={`flex-1 min-h-[64px] rounded-xl font-bold text-[20px] ${
                    readingType === 'sugar' ? 'bg-[#1C3F32] text-white' : 'bg-[#FAF8F5] border'
                  }`}
                >
                  Blood Sugar
                </button>
              </div>

              {readingType === 'bp' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[20px] font-bold mb-1">Systolic (Upper number)</label>
                    <input
                      type="number"
                      value={readingSys}
                      onChange={(e) => setReadingSys(e.target.value)}
                      className="w-full min-h-[64px] p-4 text-[24px] font-bold rounded-xl border border-[#CBDCD2]"
                    />
                  </div>
                  <div>
                    <label className="block text-[20px] font-bold mb-1">Diastolic (Lower number)</label>
                    <input
                      type="number"
                      value={readingDia}
                      onChange={(e) => setReadingDia(e.target.value)}
                      className="w-full min-h-[64px] p-4 text-[24px] font-bold rounded-xl border border-[#CBDCD2]"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[20px] font-bold mb-1">Blood Sugar (mg/dL)</label>
                  <input
                    type="number"
                    value={readingVal}
                    onChange={(e) => setReadingVal(e.target.value)}
                    className="w-full min-h-[64px] p-4 text-[24px] font-bold rounded-xl border border-[#CBDCD2]"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  if (readingType === 'bp') {
                    addHealthReading('bp', parseInt(readingSys, 10) || 120, parseInt(readingDia, 10) || 80, 'senior');
                  } else {
                    addHealthReading('sugar', parseInt(readingVal, 10) || 110, undefined, 'senior');
                  }
                  showToast('Reading saved successfully', 'success');
                  setScreen('home');
                }}
                className="w-full min-h-[72px] rounded-2xl bg-[#1C3F32] text-white font-bold text-[24px]"
              >
                Save Reading
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 17: APPOINTMENT REQUEST (Talk to coordinator)
           ======================================================== */}
        {screen === 'appointment_request' && (
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setScreen('home')}
              className="min-h-[64px] px-6 py-3 rounded-2xl bg-white border border-[#CBDCD2] text-[#132A22] font-bold text-[22px] flex items-center gap-2"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>{t.back}</span>
            </button>

            <div className={`p-6 rounded-2xl ${cardBg} space-y-5`}>
              <h2 className={headingClass}>{t.actionTalkCoordinator}</h2>
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#CBDCD2] space-y-1">
                <div className="text-[22px] font-bold">{selectedSenior.assignedCoordinatorName || 'Nimish Gupta'}</div>
                <div className="text-[18px] text-[#4A6B5D]">Dedicated Care Coordinator • +91 9368059741</div>
              </div>

              <div className="space-y-3">
                <a
                  href={`tel:${coordinatorProfile?.phone || '9368059741'}`}
                  className="w-full min-h-[72px] rounded-2xl bg-[#1C3F32] text-white font-bold text-[22px] flex items-center justify-center gap-2"
                >
                  <Phone className="w-6 h-6" />
                  <span>Call Coordinator (+91 9368059741)</span>
                </a>

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
                    showToast('Coordinator visit request placed', 'success');
                    setScreen('home');
                  }}
                  className="w-full min-h-[72px] rounded-2xl bg-white border-2 border-[#1C3F32] text-[#132A22] font-bold text-[22px] flex items-center justify-center gap-2"
                >
                  <Calendar className="w-6 h-6" />
                  <span>Schedule Check-in Call</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 18: SOS INFORMED SCREEN (60s accidental cancellation)
           ======================================================== */}
        {screen === 'sos_informed' && (
          <div className={`p-6 sm:p-8 rounded-2xl ${cardBg} space-y-6 text-center`}>
            <div className="w-20 h-20 rounded-full bg-[#FFF0EE] text-[#C93B2B] flex items-center justify-center mx-auto border-2 border-[#C93B2B]">
              <ShieldAlert className="w-10 h-10" />
            </div>

            <h2 className="text-[32px] sm:text-[36px] font-bold text-[#C93B2B] leading-tight">
              Emergency Alert Activated
            </h2>
            <p className={bodyClass}>
              Your coordinator and family have been notified with your current emergency location.
            </p>

            {sosCountdown > 0 ? (
              <div className="p-5 rounded-2xl bg-[#FFF6E5] border-2 border-[#D9822B] space-y-3">
                <p className="text-[20px] font-bold text-[#5C3B00]">
                  If pressed by mistake, cancel within {sosCountdown} seconds:
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
                  className="w-full min-h-[72px] rounded-xl bg-[#D9822B] hover:bg-[#B3661E] text-white font-bold text-[22px]"
                >
                  I pressed this by mistake ({sosCountdown}s)
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-[#EBF3EE] border border-[#2E6B56] text-[#132A22] font-bold text-[22px]">
                Help is on the way. Please keep your phone near you.
              </div>
            )}

            <button
              type="button"
              onClick={() => setScreen('home')}
              className="w-full min-h-[64px] rounded-xl bg-white border border-[#CBDCD2] font-bold text-[20px]"
            >
              Return to Home
            </button>
          </div>
        )}

        {/* ========================================================
            SCREEN 19: CONSENT SETTINGS
           ======================================================== */}
        {screen === 'consent_settings' && (
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setScreen('more')}
              className="min-h-[64px] px-6 py-3 rounded-2xl bg-white border border-[#CBDCD2] text-[#132A22] font-bold text-[22px] flex items-center gap-2"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>{t.back}</span>
            </button>

            <div className={`p-6 rounded-2xl ${cardBg} space-y-5`}>
              <h2 className={headingClass}>Family Information Sharing</h2>
              <p className={bodyClass}>
                You can pause or resume sharing weekly updates with your family ({selectedSenior.linkedFamilyName || 'Karishma'}) at any time.
              </p>

              <button
                type="button"
                onClick={() => {
                  toggleConsent(selectedSenior.id, !selectedSenior.familyConsentGranted);
                  showToast(
                    !selectedSenior.familyConsentGranted
                      ? 'Family sharing resumed'
                      : 'Family sharing paused',
                    'info'
                  );
                }}
                className={`w-full min-h-[80px] p-5 rounded-2xl border-2 text-left flex items-center justify-between gap-3 ${
                  selectedSenior.familyConsentGranted
                    ? 'bg-[#EBF3EE] border-[#1C3F32]'
                    : 'bg-white border-[#CBDCD2]'
                }`}
              >
                <span className="text-[22px] font-bold">
                  {selectedSenior.familyConsentGranted ? 'Family Sharing: Active' : 'Family Sharing: Paused'}
                </span>
                <Check className={`w-7 h-7 ${selectedSenior.familyConsentGranted ? 'text-[#1C3F32]' : 'opacity-0'}`} />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 6. SOS BAR: Fixed at bottom INSIDE column width (never wider than column), >= 80px tall, inside safe area */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-xs p-4 pb-[env(safe-area-inset-bottom,16px)]">
        <div className="max-w-[700px] mx-auto w-full">
          <button
            type="button"
            onClick={handleEmergencySOS}
            className="w-full min-h-[80px] bg-[#C93B2B] hover:bg-[#A82D20] active:bg-[#852317] text-white font-bold text-[26px] sm:text-[30px] rounded-2xl shadow-lg border-2 border-[#852317] flex items-center justify-center gap-3 transition-transform active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-[#C93B2B]"
            aria-label="EMERGENCY HELP SOS"
          >
            <ShieldAlert className="w-9 h-9 text-white shrink-0" strokeWidth={2.5} />
            <span>EMERGENCY HELP (SOS)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
