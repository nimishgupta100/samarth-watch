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
  source: 'DEMO_SIMULATED';
}

export interface VoiceNoteSummarizer {
  process(
    audioBlobUrl: string | null,
    durationSec: number,
    seniorName: string,
    lang: SupportedLanguage
  ): Promise<VoiceNoteProcessResult>;
}

// DEMO: rule-based cue extraction. PRODUCTION: Whisper + summarizer with PII masking before any external call.
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

const HIGH_PRIORITY_TAGS = ['fall', 'confusion'];

export class DemoVoiceNoteSummarizer implements VoiceNoteSummarizer {
  async process(
    _audioBlobUrl: string | null,
    _durationSec: number,
    _seniorName: string,
    lang: SupportedLanguage
  ): Promise<VoiceNoteProcessResult> {
    // Simulate async processing delay (demo only)
    await new Promise((r) => setTimeout(r, 600));

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
