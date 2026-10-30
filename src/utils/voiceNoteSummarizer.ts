import { SupportedLanguage } from '../i18n';

export interface CueSummary {
  tag: string;
  severity: 'mild' | 'moderate' | 'severe';
  quote: string;
}

export interface VoiceNoteProcessResult {
  transcript: string;
  plainSummary: string;
  extractedCues: CueSummary[];
  isHighPriority: boolean;
  source: 'DEMO_SIMULATED' | 'SPEECH_RECOGNITION';
}

export interface VoiceNoteSummarizer {
  process(
    audioBlobUrl: string | null,
    durationSec: number,
    seniorName: string,
    lang: SupportedLanguage,
    rawTranscript?: string
  ): Promise<VoiceNoteProcessResult>;
}

// Indic & English clinical cue patterns
const CLINICAL_CUE_PATTERNS = [
  {
    tag: 'fall',
    severity: 'severe' as const,
    regex: /(?:fall|fell|falling|slip|tripped|gir\s*gay|gir\s*padi|gir\s*gaya|gir\s*gayi|giri|gira)/i,
    summaryEn: 'Resident reported a fall incident.',
    summaryHi: 'निवासी ने गिरने (fall) की सूचना दी।',
  },
  {
    tag: 'chest pain',
    severity: 'severe' as const,
    regex: /(?:chest\s*pain|heart\s*pain|seene\s*mein\s*dard|chhati|breathless|saas\s*phool|saans)/i,
    summaryEn: 'Resident reported chest discomfort or breathing difficulty.',
    summaryHi: 'निवासी ने सीने में दर्द या सांस लेने में परेशानी की सूचना दी।',
  },
  {
    tag: 'dizziness',
    severity: 'mild' as const,
    regex: /(?:dizzy|dizziness|faint|lightheaded|chakkar|sar\s*ghoom|sir\s*ghoom)/i,
    summaryEn: 'Resident reported dizziness or feeling lightheaded.',
    summaryHi: 'निवासी ने चक्कर आने या सिर घूमने की बात कही।',
  },
  {
    tag: 'pain',
    severity: 'moderate' as const,
    regex: /(?:pain|hurts|aching|sore|dard|ghutna|kamar|peeth|sir\s*dard|sar\s*dard|headache)/i,
    summaryEn: 'Resident reported physical pain or body ache.',
    summaryHi: 'निवासी ने शरीर में दर्द या असहजता बताई।',
  },
  {
    tag: 'fever',
    severity: 'moderate' as const,
    regex: /(?:fever|temperature|chills|bukhar|tap|garam|thandi)/i,
    summaryEn: 'Resident reported feverish symptoms.',
    summaryHi: 'निवासी ने बुखार या तापमान बढ़ने के लक्षण बताए।',
  },
  {
    tag: 'low appetite',
    severity: 'mild' as const,
    regex: /(?:appetite|eating|eat\s*much|food|nausea|vomit|bhookh|khana\s*nahi|ulti)/i,
    summaryEn: 'Resident reported low appetite or stomach discomfort.',
    summaryHi: 'निवासी ने कम भूख या खाना न खाने की जानकारी दी।',
  },
  {
    tag: 'poor sleep',
    severity: 'mild' as const,
    regex: /(?:sleep|slept|woke\s*up|tired|exhausted|neend|so\s*nahi|thakan)/i,
    summaryEn: 'Resident reported disrupted or inadequate sleep.',
    summaryHi: 'निवासी ने नींद न आने या थकान की बात कही।',
  },
  {
    tag: 'loneliness',
    severity: 'moderate' as const,
    regex: /(?:lonely|loneliness|alone|call\s*me|children|akela|akeli|baat\s*nahi|phone\s*nahi)/i,
    summaryEn: 'Resident expressed feeling lonely or low social contact.',
    summaryHi: 'निवासी ने अकेलापन महसूस करने की बात कही।',
  },
  {
    tag: 'medicine',
    severity: 'mild' as const,
    regex: /(?:medicine|tablet|dose|pill|dawa|goli|aushadhi)/i,
    summaryEn: 'Resident mentioned medication routine.',
    summaryHi: 'निवासी ने दवाई या खुराक का उल्लेख किया।',
  },
];

const HIGH_PRIORITY_TAGS = ['fall', 'confusion', 'chest pain'];

// DEMO fallback pools
const DEMO_TRANSCRIPTS_EN = [
  {
    transcript: 'I woke up feeling dizzy this morning. Did not eat much, just had tea.',
    plainSummary: 'Resident reported morning dizziness and low appetite at breakfast time.',
    cues: [
      { tag: 'dizziness', severity: 'mild' as const, quote: 'feeling dizzy this morning' },
      { tag: 'low appetite', severity: 'mild' as const, quote: 'did not eat much' },
    ],
  },
  {
    transcript: 'I fell near the bathroom this morning. I am okay but my knee hurts.',
    plainSummary: 'Resident reported a fall near the bathroom. Reported knee pain. No loss of consciousness mentioned.',
    cues: [
      { tag: 'fall', severity: 'severe' as const, quote: 'I fell near the bathroom this morning' },
      { tag: 'pain', severity: 'moderate' as const, quote: 'my knee hurts' },
    ],
  },
  {
    transcript: 'Feeling very lonely today. Children have not called in three days.',
    plainSummary: 'Resident expressed feelings of loneliness and noted reduced contact with family.',
    cues: [
      { tag: 'loneliness', severity: 'moderate' as const, quote: 'feeling very lonely today' },
    ],
  },
  {
    transcript: 'Slept poorly last night. Woke up four times.',
    plainSummary: 'Resident reported disrupted sleep with multiple awakenings through the night.',
    cues: [
      { tag: 'poor sleep', severity: 'mild' as const, quote: 'slept poorly last night, woke up four times' },
    ],
  },
];

const DEMO_TRANSCRIPTS_HI = [
  {
    transcript: 'Subah uthne par sir ghoom raha tha. Khana khaane ki ichha nahi thi.',
    plainSummary: 'Niwasi ne subah chakkar aane aur kam bhook ki baat kahi.',
    cues: [
      { tag: 'dizziness', severity: 'mild' as const, quote: 'sir ghoom raha tha' },
      { tag: 'low appetite', severity: 'mild' as const, quote: 'khana khaane ki ichha nahi thi' },
    ],
  },
  {
    transcript: 'Bathroom ke paas gir gaya/gayi. Ghutna dard kar raha hai.',
    plainSummary: 'Niwasi ne bathroom ke paas girne ki jaankari di. Ghutne mein dard bata raha/rahi hain.',
    cues: [
      { tag: 'fall', severity: 'severe' as const, quote: 'bathroom ke paas gir gaya' },
      { tag: 'pain', severity: 'moderate' as const, quote: 'ghutna dard kar raha hai' },
    ],
  },
  {
    transcript: 'Aaj bahut akela/akeli lag raha/rahi hai. Bacche teen din se phone nahi kar rahe.',
    plainSummary: 'Niwasi ne akela mahasoos karne ki baat kahi aur parivaar ka sampark kam hone ki jaankari di.',
    cues: [
      { tag: 'loneliness', severity: 'moderate' as const, quote: 'bahut akela lag raha hai' },
    ],
  },
];

export class DemoVoiceNoteSummarizer implements VoiceNoteSummarizer {
  async process(
    _audioBlobUrl: string | null,
    _durationSec: number,
    seniorName: string,
    lang: SupportedLanguage,
    rawTranscript?: string
  ): Promise<VoiceNoteProcessResult> {
    // If real speech was captured from Web Speech API
    if (rawTranscript && rawTranscript.trim().length > 0) {
      const cleaned = rawTranscript.trim();
      const extractedCues: CueSummary[] = [];

      for (const pattern of CLINICAL_CUE_PATTERNS) {
        const match = cleaned.match(pattern.regex);
        if (match) {
          extractedCues.push({
            tag: pattern.tag,
            severity: pattern.severity,
            quote: match[0],
          });
        }
      }

      const isHighPriority = extractedCues.some(
        (c) => HIGH_PRIORITY_TAGS.includes(c.tag) || c.severity === 'severe'
      );

      let plainSummary: string;
      if (extractedCues.length > 0) {
        const cuesList = extractedCues.map((c) => c.tag).join(', ');
        plainSummary =
          lang === 'hi'
            ? `${seniorName} जी का संदेश: "${cleaned}"। नैदानिक संकेत मिले: ${cuesList}।`
            : `${seniorName} reported: "${cleaned}". Clinical cues identified: ${cuesList}.`;
      } else {
        plainSummary =
          lang === 'hi'
            ? `${seniorName} जी का संदेश: "${cleaned}"। कोई गंभीर लक्षण नहीं मिला।`
            : `${seniorName} reported: "${cleaned}". Routine check-in recorded.`;
      }

      return {
        transcript: cleaned,
        plainSummary,
        extractedCues,
        isHighPriority,
        source: 'SPEECH_RECOGNITION',
      };
    }

    // Fallback simulated pool
    await new Promise((r) => setTimeout(r, 400));
    const pool = lang === 'hi' ? DEMO_TRANSCRIPTS_HI : DEMO_TRANSCRIPTS_EN;
    const sample = pool[Math.floor(Math.random() * pool.length)];

    const isHighPriority = sample.cues.some(
      (c) => HIGH_PRIORITY_TAGS.includes(c.tag) || c.severity === 'severe'
    );

    return {
      transcript: sample.transcript,
      plainSummary: sample.plainSummary,
      extractedCues: sample.cues,
      isHighPriority,
      source: 'DEMO_SIMULATED',
    };
  }
}

export const voiceNoteSummarizer: VoiceNoteSummarizer = new DemoVoiceNoteSummarizer();
