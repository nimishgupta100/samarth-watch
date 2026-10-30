import { SupportedLanguage } from '../i18n';
import { normalizeForSpeech } from '../lib/speech/normalizeForSpeech';

const LANG_CODE_MAP: Record<SupportedLanguage, string> = {
  hi: 'hi-IN',
  en: 'en-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  te: 'te-IN',
};

/**
 * Read speed options. 0.85 is the default for elderly comprehension.
 */
export type ReadSpeed = 'slow' | 'normal';
export const SPEED_RATE: Record<ReadSpeed, number> = { slow: 0.75, normal: 0.85 };

/** Pause between sentences in milliseconds */
const SENTENCE_PAUSE_MS = 350;

/**
 * Splits text into sentence-length chunks for sequential reading.
 * Fixes the Chrome bug where long utterances stop mid-sentence.
 */
export function splitIntoChunks(text: string): string[] {
  const raw = text
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?।\u0964])\s+/u);
  return raw.filter((s) => s.trim().length > 2);
}

/**
 * Waits for voices to be loaded (Chrome loads them asynchronously).
 * Returns a promise that resolves with the voice list.
 */
export function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    const handler = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve(window.speechSynthesis.getVoices());
    }, 2000);
  });
}

/**
 * Picks the best available voice for a language.
 * Prefers voices matching the full locale code (hi-IN, en-IN) over partial matches.
 */
export function pickBestVoice(voices: SpeechSynthesisVoice[], lang: SupportedLanguage): SpeechSynthesisVoice | null {
  const code = LANG_CODE_MAP[lang]?.toLowerCase() || 'en-in';
  const langPrefix = code.split('-')[0];

  // Exact match first
  const exact = voices.filter((v) => v.lang.toLowerCase() === code);
  if (exact.length > 0) {
    return exact.find((v) => !v.default) || exact[0];
  }

  // Prefix match
  const prefix = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));
  if (prefix.length > 0) return prefix[0];

  return null;
}

interface SpeakOptions {
  lang: SupportedLanguage;
  speed?: ReadSpeed;
  onChunkStart?: (index: number, chunk: string) => void;
  onDone?: () => void;
  onError?: () => void;
}

let activeSpeakAbortRef = { aborted: false };

/**
 * Speaks text in short sentence chunks, with a pause between each.
 * Normalizes clinical abbreviations ("Smt.", "BP", "SpO2") before speaking.
 * Prevents Devanagari from being spoken by an English voice.
 */
export async function speakChunked(text: string, options: SpeakOptions): Promise<() => void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options.onError?.();
    return () => {};
  }

  window.speechSynthesis.cancel();

  const abort = { aborted: false };
  activeSpeakAbortRef = abort;

  const voices = await waitForVoices();
  const voice = pickBestVoice(voices, options.lang);

  // If Hindi requested but no Hindi voice exists on device, do not read with English voice
  if (options.lang === 'hi' && !voice) {
    options.onError?.();
    return () => {};
  }

  const processedText = normalizeForSpeech(text, options.lang);
  const chunks = splitIntoChunks(processedText);
  const rate = SPEED_RATE[options.speed || 'normal'];

  let chunkIndex = 0;

  const speakNext = () => {
    if (abort.aborted || chunkIndex >= chunks.length) {
      if (!abort.aborted) options.onDone?.();
      return;
    }

    const chunk = chunks[chunkIndex];
    options.onChunkStart?.(chunkIndex, chunk);

    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.lang = LANG_CODE_MAP[options.lang] || 'en-IN';
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      if (abort.aborted) return;
      chunkIndex++;
      setTimeout(speakNext, SENTENCE_PAUSE_MS);
    };

    utterance.onerror = (ev) => {
      if (ev.error === 'interrupted' || abort.aborted) return;
      console.warn('Speech synthesis error:', ev.error);
      options.onError?.();
    };

    window.speechSynthesis.speak(utterance);
  };

  speakNext();

  return () => {
    abort.aborted = true;
    window.speechSynthesis.cancel();
  };
}

/**
 * Simple one-shot speak (for short texts that do not need chunking).
 */
export async function speakText(text: string, lang: SupportedLanguage, onEnd?: () => void): Promise<boolean> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;

  try {
    window.speechSynthesis.cancel();
    const voices = await waitForVoices();
    const voice = pickBestVoice(voices, lang);

    // If Hindi requested but no Hindi voice exists, do not speak with English voice
    if (lang === 'hi' && !voice) return false;

    const utterance = new SpeechSynthesisUtterance(normalizeForSpeech(text, lang));
    utterance.lang = LANG_CODE_MAP[lang] || 'en-IN';
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    if (voice) utterance.voice = voice;
    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = (ev) => {
        if (ev.error !== 'interrupted') onEnd();
      };
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    return false;
  }
}

export function stopSpeaking(): void {
  activeSpeakAbortRef.aborted = true;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function pauseSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
}

export function resumeSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}

export async function checkVoiceAvailable(lang: SupportedLanguage): Promise<string | null> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = await waitForVoices();
  const voice = pickBestVoice(voices, lang);
  return voice ? voice.name : null;
}
