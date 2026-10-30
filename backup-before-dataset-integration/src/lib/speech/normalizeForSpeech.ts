import { SupportedLanguage } from '../../i18n';
import { DICTIONARIES } from './abbreviationDictionary';

/**
 * Natural time converter for speech synthesis in English and Hindi.
 */
function normalizeTimes(text: string, lang: SupportedLanguage): string {
  if (lang === 'hi') {
    return text.replace(/\b(\d{1,2}):(\d{2})\s?(AM|PM)\b/gi, (_, h, m, ampm) => {
      const hour = parseInt(h, 10);
      const min = parseInt(m, 10);
      const isAm = ampm.toUpperCase() === 'AM';
      let period = 'सुबह';
      if (!isAm) {
        period = hour >= 4 && hour < 8 ? 'शाम' : hour >= 8 ? 'रात' : 'दोपहर';
      } else if (hour >= 12 || hour < 4) {
        period = 'रात';
      }

      const h12 = hour % 12 === 0 ? 12 : hour % 12;
      const hindiHours: Record<number, string> = {
        1: 'एक', 2: 'दो', 3: 'तीन', 4: 'चार', 5: 'पाँच',
        6: 'छह', 7: 'सात', 8: 'आठ', 9: 'नौ', 10: 'दस',
        11: 'ग्यारह', 12: 'बारह',
      };
      const hWord = hindiHours[h12] || String(h12);

      if (min === 0) {
        return `${period} ${hWord} बजे`;
      }
      return `${period} ${hWord} बजकर ${min} मिनट`;
    });
  }

  // English natural time
  return text.replace(/\b(\d{1,2}):(\d{2})\s?(AM|PM)\b/gi, (_, h, m, ampm) => {
    const hour = parseInt(h, 10);
    const min = parseInt(m, 10);
    const isAm = ampm.toUpperCase() === 'AM';
    const period = isAm ? 'in the morning' : hour < 5 ? 'in the afternoon' : 'in the evening';
    const hourWords = [
      'twelve', 'one', 'two', 'three', 'four', 'five',
      'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
    ];
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    const hWord = hourWords[h12] || String(h12);

    if (min === 0) {
      return `${hWord} o'clock ${period}`;
    }
    const minWord = min < 10 ? `oh ${min}` : String(min);
    return `${hWord} ${minWord} ${period}`;
  });
}

/**
 * Strips HTML tags, aria-hidden elements, and decorative symbols.
 */
function stripDecorativeAndHidden(text: string): string {
  return text
    // Remove HTML tags
    .replace(/<[^>]*>/g, ' ')
    // Remove decorative symbols, bullets, asterisks
    .replace(/[•★\u2022\u25CF\u25AA*~`_]/g, ' ')
    // Normalize slashes in readings: "120/80" -> "120 over 80"
    .replace(/(\d+)\/(\d+)/g, '$1 over $2')
    // Collapse multiple whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Main text normalization pipeline used before every speech synthesis call.
 * Expands clinical and social abbreviations, formats times naturally,
 * and strips decorative noise.
 */
export function normalizeForSpeech(text: string, lang: SupportedLanguage): string {
  if (!text || typeof text !== 'string') return '';

  let normalized = stripDecorativeAndHidden(text);

  // Apply natural time format
  normalized = normalizeTimes(normalized, lang);

  // Apply dictionary replacements
  // Reset lastIndex on global regexes to ensure correct matching on every call.
  const dict = DICTIONARIES[lang] || DICTIONARIES.en;
  for (const rule of dict) {
    if (rule.pattern.global) rule.pattern.lastIndex = 0;
    normalized = normalized.replace(rule.pattern, rule.replacement);
  }

  return normalized;
}
