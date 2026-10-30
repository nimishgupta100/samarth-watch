import { SupportedLanguage } from '../i18n';

type TimeOfDay = 'morning' | 'afternoon' | 'evening';

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

const GREETINGS: Record<SupportedLanguage, Record<TimeOfDay, string>> = {
  en: {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
  },
  hi: {
    morning: 'सुप्रभात',
    afternoon: 'नमस्ते',
    evening: 'शुभ संध्या',
  },
  bn: {
    morning: 'সুপ্রভাত',
    afternoon: 'নমস্কার',
    evening: 'শুভ সন্ধ্যা',
  },
  mr: {
    morning: 'शुभ सकाळ',
    afternoon: 'शुभ दुपार',
    evening: 'शुभ संध्याकाळ',
  },
  ta: {
    morning: 'காலை வணக்கம்',
    afternoon: 'மதிய வணக்கம்',
    evening: 'மாலை வணக்கம்',
  },
  te: {
    morning: 'శుభోదయం',
    afternoon: 'శుభ మధ్యాహ్నం',
    evening: 'శుభ సాయంత్రం',
  },
};

/**
 * Extracts and cleans the real human name from potential role labels,
 * parentheses, or honorifics. Defaults to 'Kamla'.
 */
export function cleanSeniorName(name?: string | null): string {
  if (!name || !name.trim()) return 'Kamla';
  // Remove brackets, quotes, and punctuation
  const cleaned = name.replace(/[()[\]{}"',.]/g, ' ').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  // Filter out 'senior', 'role', 'user'
  const filtered = parts.filter(p => !['senior', 'role', 'user'].includes(p.toLowerCase()));
  if (filtered.length > 0) {
    return filtered[0];
  }
  return 'Kamla';
}

/**
 * Returns a time-of-day greeting for a given language.
 * When seniorName is provided, appends the name respectfully.
 * Uses the device's local hour.
 * Example:
 *   en -> "Good afternoon, Kamla"
 *   hi -> "नमस्ते, Kamla ji" (or "नमस्ते, कमला जी")
 */
export function getGreeting(lang: SupportedLanguage, seniorName?: string): string {
  const hour = new Date().getHours();
  const tod = getTimeOfDay(hour);
  const base = GREETINGS[lang]?.[tod] || GREETINGS.en[tod];

  const actualName = cleanSeniorName(seniorName);

  switch (lang) {
    case 'hi':
      return `${base}, ${actualName} ji`;
    case 'en':
    default:
      return `${base}, ${actualName}`;
  }
}

/**
 * Returns just the time of day string without greeting word,
 * useful for display subtitles.
 */
export function getTimeOfDayLabel(lang: SupportedLanguage): string {
  const hour = new Date().getHours();
  const tod = getTimeOfDay(hour);
  const labels: Record<SupportedLanguage, Record<TimeOfDay, string>> = {
    en: {
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening',
    },
    hi: {
      morning: 'सुबह',
      afternoon: 'दोपहर',
      evening: 'शाम',
    },
    bn: {
      morning: 'সকাল',
      afternoon: 'দুপুর',
      evening: 'সন্ধ্যা',
    },
    mr: {
      morning: 'सकाळ',
      afternoon: 'दुपार',
      evening: 'संध्याकाळ',
    },
    ta: {
      morning: 'காலை',
      afternoon: 'மதியம்',
      evening: 'மாலை',
    },
    te: {
      morning: 'ఉదయం',
      afternoon: 'మధ్యాహ్నం',
      evening: 'సాయంత్రం',
    },
  };
  return labels[lang]?.[tod] || labels.en[tod];
}
