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
};

/**
 * Returns a time-of-day greeting for a given language.
 * When seniorName is provided, appends the name respectfully.
 * Uses the device's local hour.
 */
export function getGreeting(lang: SupportedLanguage, seniorName?: string): string {
  const hour = new Date().getHours();
  const tod = getTimeOfDay(hour);
  const base = GREETINGS[lang]?.[tod] || GREETINGS.en[tod];

  if (!seniorName) return base;

  // Name formatting per language
  switch (lang) {
    case 'hi':
      // Respectful suffix "ji" after first name
      return `${base}, ${seniorName.split(' ')[0]} ji`;
    case 'en':
    default:
      return `${base}, ${seniorName.split(' ')[0]}`;
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
    en: { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' },
    hi: { morning: 'सुबह', afternoon: 'दोपहर', evening: 'शाम' },
  };
  return labels[lang]?.[tod] || labels.en[tod];
}
