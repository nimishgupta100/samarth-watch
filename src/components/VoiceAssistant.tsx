import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// ─── Samarth Watch route + contact config ───────────────────────────────────
const SETTINGS = {
  home: '/senior-home',
  coordinator: '/coordinator',
  family: '/family',
  login: '/login',
  coordinatorPhone: '+919368059741',
  language: 'en-IN',
  hindiLanguage: 'hi-IN',
};

// Pages where the floating assistant should NOT appear
// (e.g. landing page, login, legal pages)
const HIDDEN_ON_PATHS = ['/', '/login', '/credits', '/privacy-policy', '/terms'];

// ─── Type shims for Web Speech API ──────────────────────────────────────────
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}
interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  abort(): void;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
}
declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────
export const VoiceAssistant: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [message, setMessage] = useState(
    'नमस्ते! Press 🎤 Speak and tell me what you need.\n(Hello! Press Speak and tell me what you need.)'
  );
  const [lastCommand, setLastCommand] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const mountedRef = useRef(false);

  // Detect language from page (senior portal may use Hindi)
  useEffect(() => {
    const storedLang = localStorage.getItem('samarth_lang') as 'en' | 'hi' | null;
    if (storedLang) setLang(storedLang);
  }, []);

  // ── Speech output ──────────────────────────────────────────────────────────
  function speak(text: string) {
    setMessage(text);
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang === 'hi' ? SETTINGS.hindiLanguage : SETTINGS.language;
    utt.rate = 0.88;
    utt.pitch = 1;
    utt.volume = 1;
    window.speechSynthesis.speak(utt);
  }

  function goToPage(path: string, msg: string) {
    speak(msg);
    setTimeout(() => {
      window.location.href = path;
    }, 600);
  }

  function callCoordinator() {
    speak(
      lang === 'hi'
        ? 'क्या आप अपने केयर कोऑर्डिनेटर को कॉल करना चाहते हैं?'
        : 'Do you want me to call your care coordinator?'
    );
    setTimeout(() => {
      const confirmed = window.confirm(
        lang === 'hi'
          ? 'केयर कोऑर्डिनेटर को अभी कॉल करें?'
          : 'Call your care coordinator now?'
      );
      if (confirmed) {
        window.location.href = 'tel:' + SETTINGS.coordinatorPhone;
      } else {
        speak(lang === 'hi' ? 'ठीक है, कॉल नहीं करूँगा।' : 'Okay, I will not place the call.');
      }
    }, 700);
  }

  function readPage() {
    const main = document.querySelector('main');
    if (!main) {
      speak(lang === 'hi' ? 'पेज की सामग्री नहीं मिली।' : 'Could not find the main content on this page.');
      return;
    }
    const text = (main as HTMLElement).innerText.replace(/\s+/g, ' ').trim().slice(0, 3000);
    if (!text) {
      speak(lang === 'hi' ? 'पढ़ने के लिए कोई टेक्स्ट नहीं है।' : 'There is no page text available to read.');
      return;
    }
    speak((lang === 'hi' ? 'मैं पेज पढ़ता हूँ। ' : 'Reading the page for you. ') + text);
  }

  // ── Command processor ───────────────────────────────────────────────────────
  function processCommand(raw: string) {
    const cmd = raw.toLowerCase().trim().replace(/[.,!?]/g, '');
    setLastCommand(raw);

    // Help
    if (cmd.includes('help') || cmd.includes('madad') || cmd.includes('kya bol sakta') || cmd.includes('what can i say')) {
      setShowHelp(true);
      speak(
        lang === 'hi'
          ? 'आप कह सकते हैं: घर जाओ, दवाई दिखाओ, कोऑर्डिनेटर को कॉल करो, परिवार पोर्टल खोलो, पेज पढ़ो, नीचे जाओ, ऊपर जाओ, वापस जाओ।'
          : 'You can say: open home, open senior home, open coordinator, open family, call my care coordinator, read this page, scroll down, scroll up, go back, or stop speaking.'
      );
      return;
    }

    // Stop speech
    if (cmd.includes('stop speaking') || cmd.includes('chup') || cmd.includes('be quiet') || cmd === 'silence') {
      window.speechSynthesis.cancel();
      setMessage(lang === 'hi' ? 'बोलना बंद किया।' : 'Spoken response stopped.');
      return;
    }

    // ── Navigation ─────────────────────────────────────────────────────────
    // Senior Home
    if (
      cmd.includes('senior home') ||
      cmd.includes('ghar') ||
      cmd.includes('go home') ||
      cmd.includes('open home') ||
      cmd === 'home'
    ) {
      goToPage(SETTINGS.home, lang === 'hi' ? 'सीनियर होम खुल रहा है।' : 'Opening the senior home page.');
      return;
    }

    // Coordinator portal
    if (
      cmd.includes('coordinator') ||
      cmd.includes('open coordinator') ||
      cmd.includes('care coordinator page')
    ) {
      // If it also mentions "call" → phone call, not navigation
      if (cmd.includes('call') || cmd.includes('phone') || cmd.includes('bulao')) {
        callCoordinator();
        return;
      }
      goToPage(SETTINGS.coordinator, lang === 'hi' ? 'कोऑर्डिनेटर पेज खुल रहा है।' : "Opening coordinator's page.");
      return;
    }

    // Family portal
    if (
      cmd.includes('family') ||
      cmd.includes('parivar') ||
      cmd.includes('open family')
    ) {
      goToPage(SETTINGS.family, lang === 'hi' ? 'परिवार पोर्टल खुल रहा है।' : 'Opening the family portal.');
      return;
    }

    // Call care coordinator
    if (
      (cmd.includes('call') || cmd.includes('phone') || cmd.includes('karo')) &&
      (cmd.includes('coordinator') || cmd.includes('care team') || cmd.includes('nimish'))
    ) {
      callCoordinator();
      return;
    }

    // Go back
    if (cmd === 'go back' || cmd === 'back' || cmd === 'wapas' || cmd === 'previous page') {
      speak(lang === 'hi' ? 'वापस जा रहे हैं।' : 'Going back.');
      window.history.back();
      return;
    }

    // Scroll down
    if (cmd.includes('scroll down') || cmd.includes('neeche') || cmd.includes('move down')) {
      window.scrollBy({ top: Math.round(window.innerHeight * 0.7), behavior: 'smooth' });
      speak(lang === 'hi' ? 'नीचे जा रहे हैं।' : 'Scrolling down.');
      return;
    }

    // Scroll up
    if (cmd.includes('scroll up') || cmd.includes('upar') || cmd.includes('move up')) {
      window.scrollBy({ top: -Math.round(window.innerHeight * 0.7), behavior: 'smooth' });
      speak(lang === 'hi' ? 'ऊपर जा रहे हैं।' : 'Scrolling up.');
      return;
    }

    // Read page
    if (
      cmd.includes('read this page') ||
      cmd.includes('read the page') ||
      cmd.includes('padho') ||
      cmd.includes('read it for me')
    ) {
      readPage();
      return;
    }

    // Stop listening
    if (cmd.includes('stop listening') || cmd.includes('microphone band') || cmd.includes('turn off microphone')) {
      stopListening();
      speak(lang === 'hi' ? 'माइक्रोफोन बंद हुआ।' : 'The microphone has been stopped.');
      return;
    }

    // Language switch
    if (cmd.includes('hindi') || cmd.includes('हिंदी')) {
      setLang('hi');
      localStorage.setItem('samarth_lang', 'hi');
      speak('ठीक है, अब मैं हिंदी में बात करूँगा।');
      return;
    }
    if (cmd.includes('english')) {
      setLang('en');
      localStorage.setItem('samarth_lang', 'en');
      speak('Okay, switching to English.');
      return;
    }

    // Unrecognised
    speak(
      lang === 'hi'
        ? 'माफ़ करें, मुझे यह नहीं समझ आया। "मदद" बोलें।'
        : 'Sorry, I did not understand. Say "help" to hear available commands.'
    );
  }

  // ── Speech recognition ─────────────────────────────────────────────────────
  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      speak('Voice recognition is not supported in this browser. Please try Chrome or Safari.');
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
    }

    const rec: ISpeechRecognition = new SR();
    rec.lang = lang === 'hi' ? SETTINGS.hindiLanguage : SETTINGS.language;
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 3;

    rec.onstart = () => { if (mountedRef.current) { setListening(true); setMessage(lang === 'hi' ? 'सुन रहा हूँ… बोलिए।' : 'Listening. Please speak now.'); } };
    rec.onresult = (e: SpeechRecognitionEvent) => { if (mountedRef.current) processCommand(e.results[e.resultIndex][0].transcript); };
    rec.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (!mountedRef.current) return;
      if (e.error === 'not-allowed') speak('Microphone permission was denied. Please allow it in browser settings.');
      else if (e.error === 'no-speech') setMessage(lang === 'hi' ? 'कुछ सुनाई नहीं दिया। फिर कोशिश करें।' : 'I did not hear anything. Please try again.');
      else setMessage('Voice recognition encountered a problem. Please try again.');
    };
    rec.onend = () => { if (mountedRef.current) setListening(false); };

    recognitionRef.current = rec;
    try { rec.start(); } catch { setListening(false); speak('Could not start the microphone. Please try again.'); }
  }

  function stopListening() {
    try { recognitionRef.current?.abort(); } catch { /* ignore */ }
    setListening(false);
  }

  useEffect(() => {
    mountedRef.current = true;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) setSupported(false);
    return () => {
      mountedRef.current = false;
      try { recognitionRef.current?.abort(); } catch { /* ignore */ }
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const isSeniorHome = location.pathname.startsWith('/senior-home');

  // Don't render on hidden paths (placed after all hooks to strictly satisfy React Rules of Hooks)
  if (HIDDEN_ON_PATHS.includes(location.pathname)) return null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open voice assistant"
          style={{
            position: 'fixed',
            left: isSeniorHome ? '20px' : 'auto',
            right: isSeniorHome ? 'auto' : '20px',
            bottom: isSeniorHome ? '96px' : '20px',
            zIndex: 9998,
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#166534',
            color: '#fff',
            border: 'none',
            fontSize: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 18px rgba(0,0,0,0.28)',
            cursor: 'pointer',
          }}
        >
          🎙️
        </button>
      )}

      {/* Panel */}
      {open && (
        <section
          aria-label="Voice assistant"
          style={{
            position: 'fixed',
            left: isSeniorHome ? '16px' : 'auto',
            right: isSeniorHome ? 'auto' : '16px',
            bottom: isSeniorHome ? '96px' : '16px',
            zIndex: 9999,
            width: 'min(370px, calc(100vw - 24px))',
            maxHeight: '82vh',
            overflowY: 'auto',
            boxSizing: 'border-box',
            padding: '18px',
            border: '2px solid #bbf7d0',
            borderRadius: '20px',
            background: '#ffffff',
            color: '#172033',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            fontFamily: 'Arial, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '48px', height: '48px', flexShrink: 0,
                borderRadius: '50%', background: '#dcfce7',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
              }}>
                🎙️
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#14532d' }}>
                  Samarth Voice Assistant
                </div>
                <div style={{ fontSize: '12px', color: '#475569' }}>
                  {lang === 'hi' ? 'आवाज़ से चलाएं' : 'Navigate with your voice'}
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={() => { stopListening(); setOpen(false); }}
              aria-label="Close voice assistant"
              style={{
                background: 'none', border: 'none', fontSize: '20px',
                cursor: 'pointer', color: '#64748b', lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {/* Language toggle */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['en', 'hi'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => { setLang(l); localStorage.setItem('samarth_lang', l); }}
                style={{
                  flex: 1, padding: '6px', border: '2px solid',
                  borderColor: lang === l ? '#166534' : '#cbd5e1',
                  borderRadius: '8px', fontSize: '13px', fontWeight: 'bold',
                  background: lang === l ? '#166534' : '#f8fafc',
                  color: lang === l ? '#fff' : '#475569',
                  cursor: 'pointer',
                }}
              >
                {l === 'en' ? '🇬🇧 English' : '🇮🇳 हिन्दी'}
              </button>
            ))}
          </div>

          {/* Status message */}
          <p
            role="status"
            aria-live="polite"
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '12px 14px',
              borderRadius: '12px',
              fontSize: '15px',
              lineHeight: 1.55,
              margin: 0,
              overflowWrap: 'anywhere',
              whiteSpace: 'pre-wrap',
            }}
          >
            {message}
          </p>

          {lastCommand && (
            <p style={{ fontSize: '13px', color: '#475569', margin: 0, overflowWrap: 'anywhere' }}>
              {lang === 'hi' ? 'आपने कहा:' : 'You said:'} &ldquo;{lastCommand}&rdquo;
            </p>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={listening ? stopListening : startListening}
              style={{
                minHeight: '52px', padding: '12px 16px',
                border: listening ? '2px solid #fca5a5' : '2px solid transparent',
                borderRadius: '12px', fontSize: '16px', fontWeight: 'bold',
                cursor: 'pointer',
                background: listening ? '#fee2e2' : '#166534',
                color: listening ? '#991b1b' : '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                animation: listening ? 'pulse 1.4s ease-in-out infinite' : 'none',
              }}
              aria-label={listening ? 'Stop listening' : 'Start voice command'}
            >
              {listening ? '🛑 Stop listening' : '🎤 ' + (lang === 'hi' ? 'बोलिए (Speak)' : 'Speak')}
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setShowHelp(!showHelp);
                  if (!showHelp) speak(
                    lang === 'hi'
                      ? 'आप कह सकते हैं: घर जाओ, कोऑर्डिनेटर को कॉल करो, पेज पढ़ो, नीचे जाओ।'
                      : 'Try: open home, call my care coordinator, read this page, scroll down.'
                  );
                }}
                style={{
                  flex: 1, minHeight: '44px', padding: '10px',
                  border: '2px solid #bfdbfe', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 'bold',
                  background: '#dbeafe', color: '#1e3a8a', cursor: 'pointer',
                }}
              >
                ❓ {lang === 'hi' ? 'मदद' : 'Help'}
              </button>

              <button
                type="button"
                onClick={callCoordinator}
                style={{
                  flex: 1, minHeight: '44px', padding: '10px',
                  border: '2px solid #bbf7d0', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 'bold',
                  background: '#dcfce7', color: '#14532d', cursor: 'pointer',
                }}
              >
                📞 {lang === 'hi' ? 'कोऑर्डिनेटर' : 'Call'}
              </button>
            </div>
          </div>

          {!supported && (
            <p style={{ color: '#991b1b', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
              ⚠️ This browser does not support voice recognition. Please try Chrome or Safari.
            </p>
          )}

          {/* Help commands list */}
          {showHelp && (
            <div style={{
              padding: '14px', background: '#f8fafc',
              borderRadius: '12px', border: '1px solid #e2e8f0',
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#14532d' }}>
                {lang === 'hi' ? '🗣️ ये बोलें:' : '🗣️ Try saying:'}
              </div>
              <ul style={{ paddingLeft: '18px', fontSize: '14px', lineHeight: 2, margin: 0, color: '#334155' }}>
                {lang === 'hi' ? (
                  <>
                    <li>घर जाओ / Open home</li>
                    <li>कोऑर्डिनेटर को कॉल करो</li>
                    <li>परिवार पोर्टल खोलो</li>
                    <li>पेज पढ़ो</li>
                    <li>नीचे जाओ / ऊपर जाओ</li>
                    <li>वापस जाओ</li>
                    <li>बोलना बंद करो</li>
                  </>
                ) : (
                  <>
                    <li>Open home / Senior home</li>
                    <li>Open coordinator</li>
                    <li>Open family</li>
                    <li>Call my care coordinator</li>
                    <li>Read this page</li>
                    <li>Scroll down / Scroll up</li>
                    <li>Go back</li>
                    <li>Switch to Hindi</li>
                    <li>Stop speaking / Stop listening</li>
                  </>
                )}
              </ul>
            </div>
          )}

          <p style={{ margin: 0, color: '#94a3b8', fontSize: '11px', lineHeight: 1.5 }}>
            {lang === 'hi'
              ? 'माइक्रोफोन हर बार Speak बटन दबाने पर ही चालू होता है।'
              : 'Press Speak before each command — the mic is not always-on.'}
          </p>
        </section>
      )}

      {/* Pulse animation for listening state */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </>
  );
};

export default VoiceAssistant;
