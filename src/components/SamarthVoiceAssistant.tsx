import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Mic, MicOff, Volume2, X, Send } from "lucide-react";

type SpeechResult = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRecognizer = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechResult) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
};

export interface SamarthVoiceAssistantProps {
  language?: string;
}

export default function SamarthVoiceAssistant({ language = "hi" }: SamarthVoiceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<string>("Ready");
  const [userMessage, setUserMessage] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [reply, setReply] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  const isHindi = language === "hi";

  async function sendMessage(recognizedText: string) {
    if (!recognizedText.trim()) return;
    setUserMessage(recognizedText);
    setStatus(isHindi ? "समर्थ सोच रहा है..." : "Samarth is thinking...");

    try {
      if (!supabase) {
        throw new Error("Supabase client is not initialized");
      }

      const { data, error } = await supabase.functions.invoke(
        "samarth-voice",
        {
          body: {
            message: recognizedText,
          },
        }
      );

      if (error) {
        throw error;
      }

      const aiReply = String(data?.reply ?? data?.message ?? "");

      if (!aiReply) {
        throw new Error("Empty AI response");
      }

      setReply(aiReply);
      setStatus(isHindi ? "बोल रहा हूँ..." : "Speaking...");
      speakText(aiReply);
    } catch (error: any) {
      console.error("Samarth Voice error:", error);
      const fallbackMsg = isHindi
        ? "नमस्ते! मैं समर्थ AI हूँ। आपकी क्या सहायता करूँ?"
        : "Hello! I am Samarth AI. How may I assist you today?";
      setReply(fallbackMsg);
      setStatus(isHindi ? "उत्तर तैयार है" : "Ready");
      speakText(fallbackMsg);
    }
  }

  function speakText(text: string) {
    if (!("speechSynthesis" in window)) {
      setStatus(isHindi ? "तैयार" : "Ready");
      return;
    }

    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = isHindi ? "hi-IN" : "en-IN";
    speech.rate = 0.88;
    speech.pitch = 1;

    speech.onstart = () => setIsSpeaking(true);
    speech.onend = () => {
      setIsSpeaking(false);
      setStatus(isHindi ? "तैयार" : "Ready");
    };
    speech.onerror = () => {
      setIsSpeaking(false);
      setStatus(isHindi ? "तैयार" : "Ready");
    };

    window.speechSynthesis.speak(speech);
  }

  function startListening() {
    const browser = window as typeof window & {
      SpeechRecognition?: new () => SpeechRecognizer;
      webkitSpeechRecognition?: new () => SpeechRecognizer;
    };

    const Recognition = browser.SpeechRecognition ?? browser.webkitSpeechRecognition;

    if (!Recognition) {
      setStatus(isHindi ? "माइक्रोफ़ोन समर्थित नहीं है" : "Speech recognition not supported");
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);

    const recognition: any = new Recognition();
    recognition.lang = isHindi ? "hi-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      void sendMessage(transcript);
    };

    recognition.onerror = (e: any) => {
      console.warn("Recognition error:", e);
      setIsListening(false);
      setStatus(isHindi ? "आवाज सुनाई नहीं दी, पुनः प्रयास करें" : "Could not hear audio, try again");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    setStatus(isHindi ? "सुन रहा हूँ... बोलिए" : "Listening... Speak now");

    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setStatus(isHindi ? "माइक्रोफ़ोन प्रारंभ नहीं हुआ" : "Could not start microphone");
    }
  }

  function stopListening() {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    setStatus(isHindi ? "तैयार" : "Ready");
  }

  function stopSpeaking() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setStatus(isHindi ? "तैयार" : "Ready");
  }

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <>
      {/* Floating Widget Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => startListening(), 400);
          }}
          aria-label="Open Samarth Voice Assistant"
          className="fixed bottom-[96px] right-5 z-40 w-16 h-16 rounded-full bg-[#1C3F32] hover:bg-[#132A22] text-white shadow-xl flex items-center justify-center text-2xl border-2 border-white transition-transform active:scale-95"
          style={{ boxShadow: "0 6px 24px rgba(28, 63, 50, 0.45)" }}
        >
          <span className="relative flex items-center justify-center">
            <Mic className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#1C3F32] animate-pulse" />
          </span>
        </button>
      )}

      {/* Floating Dialog / Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Samarth AI Voice Assistant"
          className="fixed bottom-[96px] right-4 sm:right-6 z-50 w-[min(380px,calc(100vw-32px))] bg-white rounded-3xl border-2 border-[#1C3F32] shadow-2xl p-5 flex flex-col gap-4 text-[#132A22] animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#CBDCD2]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#EBF3EE] text-[#1C3F32] flex items-center justify-center font-bold text-xl">
                🎙️
              </div>
              <div>
                <h3 className="font-extrabold text-[18px] leading-tight text-[#1C3F32]">
                  {isHindi ? "समर्थ AI सहायक" : "Samarth Voice AI"}
                </h3>
                <p className="text-xs text-[#4A6B5D] font-medium flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${isListening ? "bg-red-500 animate-ping" : isSpeaking ? "bg-amber-500" : "bg-emerald-500"}`} />
                  {status}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                stopListening();
                stopSpeaking();
                setIsOpen(false);
              }}
              className="w-9 h-9 rounded-full bg-[#EBF3EE] hover:bg-[#CBDCD2] text-[#132A22] flex items-center justify-center font-bold text-sm transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User message display */}
          {userMessage && (
            <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#CBDCD2] text-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A6B5D] block mb-1">
                {isHindi ? "आपने कहा:" : "You said:"}
              </span>
              <p className="text-[#132A22] font-semibold text-base leading-snug">&ldquo;{userMessage}&rdquo;</p>
            </div>
          )}

          {/* AI Reply display */}
          {reply && (
            <div className="bg-[#EBF3EE] p-4 rounded-2xl border border-[#2E6B56]/30 text-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1C3F32] flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" />
                  {isHindi ? "समर्थ का उत्तर:" : "Samarth AI:"}
                </span>
                {isSpeaking && (
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="text-xs text-red-700 font-bold hover:underline"
                  >
                    {isHindi ? "रोकें" : "Stop"}
                  </button>
                )}
              </div>
              <p className="text-[#132A22] font-medium text-[17px] leading-relaxed">{reply}</p>
            </div>
          )}

          {/* Main Action: Big accessible Speak / Stop button */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`min-h-[58px] rounded-2xl font-bold text-[18px] flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 ${
                isListening
                  ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                  : "bg-[#1C3F32] hover:bg-[#132A22] text-white"
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-6 h-6" />
                  <span>{isHindi ? "सुनना रोकें" : "Stop Listening"}</span>
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6" />
                  <span>{isHindi ? "बोलिए (Start Talking)" : "Start Talking"}</span>
                </>
              )}
            </button>
          </div>

          {/* Alternative: Type text */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputText.trim()) {
                const text = inputText.trim();
                setInputText("");
                void sendMessage(text);
              }
            }}
            className="flex items-center gap-2 pt-1 border-t border-[#CBDCD2]"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isHindi ? "या यहाँ लिखें..." : "Or type here..."}
              className="flex-1 min-h-[44px] px-3.5 rounded-xl border border-[#CBDCD2] text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3F32]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="min-h-[44px] px-4 rounded-xl bg-[#1C3F32] text-white font-bold text-sm disabled:opacity-40 flex items-center justify-center"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
