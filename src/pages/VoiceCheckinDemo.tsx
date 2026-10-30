import React, { useState } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useToast } from '../context/ToastContext';
import { 
  PhoneCall, 
  Mic, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  Languages, 
  Eye, 
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { CueTag } from '../types';

export const VoiceCheckinDemo: React.FC = () => {
  useDocumentTitle('Voice & IVR Simulator');
  const { showToast } = useToast();

  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isProcessingNlp, setIsProcessingNlp] = useState(false);

  const questions = [
    {
      id: 1,
      hi: 'आज आप कैसा महसूस कर रहे हैं?',
      en: 'How are you feeling today overall?',
      audioPromptHi: 'नमस्ते! समर्थ केयर में आपका स्वागत है। आज आप कैसा महसूस कर रहे हैं? 1 दबाएँ ठीक के लिए, 2 थोड़ा खराब, 3 बहुत खराब।',
      audioPromptEn: 'Namaste! Welcome to Samarth Care. How are you feeling today? Press 1 for Good, 2 for Unwell, 3 for Very unwell.',
    },
    {
      id: 2,
      hi: 'क्या आपने समय पर अपनी दवाई ली?',
      en: 'Did you take your prescribed medicines on time?',
      audioPromptHi: 'क्या आपने अपनी सुबह की दवाई ली? 1 दबाएँ हाँ के लिए, 2 भूल गए, 3 दवा खत्म हो गई।',
      audioPromptEn: 'Did you take your morning medicines? Press 1 for Yes, 2 for Forgot, 3 for Medicines finished.',
    },
    {
      id: 3,
      hi: 'खाना ठीक से खाया? भूख कैसी है?',
      en: 'Did you have your meals properly? How is your appetite?',
      audioPromptHi: 'खाना ठीक से खाया? 1 दबाएँ अच्छी भूख, 2 कम खाया, 3 बिल्कुल मन नहीं।',
      audioPromptEn: 'Did you eat properly? Press 1 for Normal appetite, 2 for Ate less, 3 for No appetite at all.',
    },
    {
      id: 4,
      hi: 'क्या शरीर में कहीं दर्द या चक्कर आ रहे हैं?',
      en: 'Any dizziness, chest tightness, or joint pain today?',
      audioPromptHi: 'क्या कहीं चक्कर या दर्द महसूस हुआ? 1 दबाएँ कोई दर्द नहीं, 2 हल्का दर्द या चक्कर, 3 तेज़ तकलीफ।',
      audioPromptEn: 'Did you experience dizziness or pain? Press 1 for No pain, 2 for Mild pain or dizziness, 3 for Severe distress.',
    }
  ];

  const sampleVoiceNote = {
    audioLength: '0:18',
    detectedLang: 'Hindi-English Code-Mixed (Hinglish)',
    hindiTranscript: 'आज सुबह से सर बहुत भारी लग रहा था और चक्कर आ रहे थे। रात को 2 बजे नींद खुल गई और फिर सो नहीं पाए। दवाई तो ली थी पर भूख बिल्कुल नहीं है।',
    englishTranslation: 'Since this morning my head feels very heavy and I am experiencing dizziness. Woke up at 2 AM last night and could not sleep. I took medicines but have zero appetite.',
    extractedCues: [
      { tag: 'dizziness' as CueTag, confidence: '96%', quote: 'चक्कर आ रहे थे (was feeling dizzy)' },
      { tag: 'poor sleep' as CueTag, confidence: '94%', quote: 'रात को 2 बजे नींद खुल गई (woke up at 2 AM, could not sleep)' },
      { tag: 'low appetite' as CueTag, confidence: '91%', quote: 'भूख बिल्कुल नहीं है (have zero appetite)' },
    ],
    riskImpact: '+26 Risk Score Points generated for Coordinator Triage'
  };

  const handleKeypadPress = (choice: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: choice }));
    showToast(`Recorded response [${choice}] for Question ${currentQuestion + 1}`, 'info');
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      showToast('All 4 IVR triage questions answered. You may now record an optional voice note.', 'success');
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setHasRecorded(false);
    showToast('Simulating audio intake over 2G telephone call...', 'info');
    
    setTimeout(() => {
      setIsRecording(false);
      setIsProcessingNlp(true);
      setTimeout(() => {
        setIsProcessingNlp(false);
        setHasRecorded(true);
        showToast('Speech processed via Whisper. 3 clinical cues extracted and added to risk score.', 'success');
      }, 1200);
    }, 3500);
  };

  const resetIvr = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsRecording(false);
    setHasRecorded(false);
    setIsProcessingNlp(false);
    showToast('IVR simulation session reset.', 'info');
  };

  const q = questions[currentQuestion];

  return (
    <div className={`max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 ${highContrast ? 'bg-black text-white' : ''}`}>
      
      {/* Header & Accessibility Controls */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-2xl backdrop-blur-md ${
        highContrast 
          ? 'bg-slate-900 border-yellow-400 text-white' 
          : 'bg-white/95 border-slate-100/20 text-slate-900'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Low-Tech Accessibility Demo : For Indian Seniors Living at Home</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interactive IVR & Voice Check-in Simulator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Many seniors in India use simple keypad feature phones. This demo shows how an automated morning phone call captures wellbeing signals in Hindi without requiring smartphone apps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const nextLang = lang === 'hi' ? 'en' : 'hi';
                setLang(nextLang);
                showToast(`Switched interface language to ${nextLang === 'hi' ? 'Hindi' : 'English'}`, 'info');
              }}
              className="min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Language: {lang === 'hi' ? 'हिंदी (Hindi)' : 'English'}</span>
            </button>

            <button
              onClick={() => {
                setHighContrast(!highContrast);
                showToast(`High contrast mode ${!highContrast ? 'enabled' : 'disabled'}`, 'info');
              }}
              className="min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{highContrast ? 'Standard Contrast' : 'High Contrast Mode'}</span>
            </button>

            <button
              onClick={resetIvr}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Call
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Phone Simulator on Left, Live NLP Extraction Pipeline on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Phone Handset Device Simulator */}
        <div className="lg:col-span-5 flex justify-center">
          <div className={`w-full max-w-sm rounded-3xl p-4 shadow-xl border-4 ${
            highContrast 
              ? 'bg-slate-950 border-yellow-400' 
              : 'bg-slate-900 border-slate-700 shadow-slate-900/30'
          }`}>
            
            <div className={`rounded-2xl overflow-hidden p-5 flex flex-col justify-between min-h-[560px] ${
              highContrast ? 'bg-black text-yellow-300' : 'bg-slate-800 text-white'
            }`}>
              
              {/* Call Header */}
              <div className="text-center pt-1 pb-4 border-b border-slate-700/60">
                <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 text-xs px-2.5 py-1 rounded-md mb-2 border border-teal-500/30">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping inline-block" />
                  <span>Call Active : Samarth Daily Check-in</span>
                </div>
                <div className="text-lg font-bold">Samarth Life Line</div>
                <div className="text-xs text-slate-400 mt-0.5">Automated Wellbeing Check-in</div>
              </div>

              {/* Central Screen: Current Question */}
              <div className="py-6 text-center space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  Question {currentQuestion + 1} of {questions.length}
                </div>

                <div className={`font-hindi font-bold leading-snug px-2 ${
                  largeText ? 'text-lg' : 'text-base'
                }`}>
                  {lang === 'hi' ? q.hi : q.en}
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700 text-xs text-slate-300 italic flex items-center justify-center gap-2">
                  <Volume2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{lang === 'hi' ? q.audioPromptHi : q.audioPromptEn}</span>
                </div>
              </div>

              {/* Large Tactile Keypad (1, 2, 3 - Crisp rounded-xl buttons, NO pills) */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
                  Press 1, 2, or 3 on Phone Keypad
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => handleKeypadPress(1)}
                    className={`py-3.5 px-2 rounded-xl flex flex-col items-center justify-center font-bold transition-all transform active:scale-95 shadow-md ${
                      answers[currentQuestion] === 1
                        ? 'bg-teal-500 text-slate-950 ring-2 ring-teal-300'
                        : highContrast
                          ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                          : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    <span className="text-2xl font-black">1</span>
                    <span className="text-[11px] mt-0.5 font-semibold">
                      {lang === 'hi' ? 'ठीक' : 'Good'}
                    </span>
                  </button>

                  <button
                    onClick={() => handleKeypadPress(2)}
                    className={`py-3.5 px-2 rounded-xl flex flex-col items-center justify-center font-bold transition-all transform active:scale-95 shadow-md ${
                      answers[currentQuestion] === 2
                        ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                        : highContrast
                          ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                          : 'bg-amber-600 hover:bg-amber-500 text-white'
                    }`}
                  >
                    <span className="text-2xl font-black">2</span>
                    <span className="text-[11px] mt-0.5 font-semibold">
                      {lang === 'hi' ? 'थोड़ा खराब' : 'A bit unwell'}
                    </span>
                  </button>

                  <button
                    onClick={() => handleKeypadPress(3)}
                    className={`py-3.5 px-2 rounded-xl flex flex-col items-center justify-center font-bold transition-all transform active:scale-95 shadow-md ${
                      answers[currentQuestion] === 3
                        ? 'bg-red-500 text-white ring-2 ring-red-300'
                        : highContrast
                          ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                          : 'bg-red-700 hover:bg-red-600 text-white'
                    }`}
                  >
                    <span className="text-2xl font-black">3</span>
                    <span className="text-[11px] mt-0.5 font-semibold">
                      {lang === 'hi' ? 'बहुत खराब' : 'Very unwell'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Call Navigation */}
              <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <button
                  disabled={currentQuestion === 0}
                  onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                  className="hover:text-white disabled:opacity-40"
                >
                  Previous
                </button>
                <span>Q {currentQuestion + 1} / {questions.length}</span>
                <button
                  disabled={currentQuestion === questions.length - 1}
                  onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                  className="hover:text-white disabled:opacity-40"
                >
                  Next
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Right Column: Voice Note Audio Equalizer & Live Speech-to-Text NLP Extraction */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-100/20 shadow-2xl">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Mic className="w-5 h-5 text-red-600" />
                  "Aap Kuch Aur Batana Chahenge?" (Voice Note Recording)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  At the end of the IVR call, seniors can leave a free-form voice note in Hindi or Hinglish.
                </p>
              </div>

              <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 shrink-0">
                Whisper Indic STT
              </span>
            </div>

            {/* Audio Recording Controls (NO pill buttons!) */}
            <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-4 my-4">
              
              {isRecording ? (
                <>
                  <div className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    Recording Simulated Hindi Audio...
                  </div>

                  <div className="flex items-center gap-1.5 h-12">
                    <span className="w-1.5 bg-teal-400 rounded-sm animate-wave-1" />
                    <span className="w-1.5 bg-teal-300 rounded-sm animate-wave-2" />
                    <span className="w-1.5 bg-teal-400 rounded-sm animate-wave-3" />
                    <span className="w-1.5 bg-teal-500 rounded-sm animate-wave-4" />
                    <span className="w-1.5 bg-teal-300 rounded-sm animate-wave-5" />
                    <span className="w-1.5 bg-teal-400 rounded-sm animate-wave-1" />
                    <span className="w-1.5 bg-teal-500 rounded-sm animate-wave-2" />
                    <span className="w-1.5 bg-teal-300 rounded-sm animate-wave-3" />
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono">Simulating 00:04 / 00:18...</div>
                </>
              ) : isProcessingNlp ? (
                <div className="py-4 text-center space-y-2">
                  <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="text-xs font-bold text-teal-300">Processing Hindi Audio via Whisper & Extracting Clinical Cues...</div>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="text-xs text-slate-300">
                    Click the microphone below to simulate a senior's spontaneous audio response.
                  </div>

                  <button
                    onClick={startVoiceRecording}
                    className="px-5 py-2.5 rounded-lg bg-red-700 hover:bg-red-600 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 mx-auto"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Simulate Voice Note ("Sar ghoom raha hai...")</span>
                  </button>
                </div>
              )}

            </div>

            {/* Transcription & Extracted Cues Output */}
            {(hasRecorded || isProcessingNlp) && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-bold text-slate-700">Audio Transcription (Hindi)</span>
                    <span className="font-mono text-[10px] bg-slate-200 px-2 py-0.5 rounded">Duration: 0:18</span>
                  </div>
                  <p className="text-sm font-hindi text-slate-900 leading-relaxed">
                    "{sampleVoiceNote.hindiTranscript}"
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-700 mb-1">English Translation for Coordinator</div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{sampleVoiceNote.englishTranslation}"
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Live Extracted Wellbeing Cues (NLP Entity Recognition)
                    </span>
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                      Zero Human Lag
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {sampleVoiceNote.extractedCues.map((cue, idx) => (
                      <div key={idx} className="bg-white p-2.5 rounded-lg border border-amber-200 text-xs shadow-2xs">
                        <div className="flex items-center justify-between font-bold text-amber-950 uppercase text-[10px]">
                          <span>{cue.tag}</span>
                          <span className="text-green-700">{cue.confidence} match</span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1 italic">
                          "{cue.quote}"
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] font-bold text-red-700 pt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {sampleVoiceNote.riskImpact}
                  </div>
                </div>

              </div>
            )}

          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-700" />
              Inclusive Voice Architecture for Indian Demographics
            </h4>
            <p>
              • <strong>Zero App Barrier:</strong> Works over 2G GSM cellular networks and landlines. Seniors need not touch a smartphone screen.
            </p>
            <p>
              • <strong>Code-Mixed Handling:</strong> Trained on Indian colloquial patterns where Hindi verbs combine with English medical terms (e.g. "BP machine kharab lagti hai", "tablet miss ho gayi").
            </p>
            <p>
              • <strong>Missed-Call Callback:</strong> If a senior disconnects or gives a missed call, the Samarth platform auto-retries 15 minutes later.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
