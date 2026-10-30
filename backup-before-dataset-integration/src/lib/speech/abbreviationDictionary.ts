import { SupportedLanguage } from '../../i18n';

export interface AbbreviationRule {
  pattern: RegExp;
  replacement: string;
}

/**
 * Extensible abbreviation and acronym dictionaries for speech normalization.
 * Matches with or without full stop, case-insensitive.
 */
export const ABBREVIATIONS_EN: AbbreviationRule[] = [
  // Titles & Honorifics
  { pattern: /\bSmt\.?(?=\s|$)/gi, replacement: 'Shrimati' },
  { pattern: /\bShri\.?(?=\s|$)/gi, replacement: 'Shri' },
  { pattern: /\bDr\.?(?=\s|$)/gi, replacement: 'Doctor' },
  { pattern: /\bCol\.?(?=\s|$)/gi, replacement: 'Colonel' },
  { pattern: /\(Retd\.?\)/gi, replacement: '(Retired)' },
  { pattern: /\bRetd\.?(?=\s|[),.]|$)/gi, replacement: 'Retired' },
  { pattern: /\bProf\.?(?=\s|$)/gi, replacement: 'Professor' },
  { pattern: /\bMr\.?(?=\s|$)/gi, replacement: 'Mister' },
  { pattern: /\bMrs\.?(?=\s|$)/gi, replacement: 'Missus' },
  { pattern: /\bMs\.?(?=\s|$)/gi, replacement: 'Ms' },

  // Clinical Units & Measurements
  { pattern: /\bBP\b/g, replacement: 'blood pressure' },
  { pattern: /\bb\.p\.\b/gi, replacement: 'blood pressure' },
  { pattern: /\bSpO2\b/gi, replacement: 'oxygen level' },
  { pattern: /\b(\d+)\s?mmHg\b/gi, replacement: '$1 millimetres of mercury' },
  { pattern: /\b(\d+)\s?bpm\b/gi, replacement: '$1 beats per minute' },
  { pattern: /\b(\d+)\s?mg\b/gi, replacement: '$1 milligrams' },
  { pattern: /\b(\d+)\s?ml\b/gi, replacement: '$1 millilitres' },
  { pattern: /\b(\d+)\s?kg\b/gi, replacement: '$1 kilograms' },
  { pattern: /(\d+)\s?%/g, replacement: '$1 percent' },

  // General & Currency
  { pattern: /\bNo\.?\s?(\d+)/gi, replacement: 'number $1' },
  { pattern: /₹\s?(\d+)/g, replacement: '$1 rupees' },
  { pattern: /\bRs\.?\s?(\d+)/gi, replacement: '$1 rupees' },
];

export const ABBREVIATIONS_HI: AbbreviationRule[] = [
  // Titles & Honorifics
  { pattern: /\bSmt\.?(?=\s|$)/gi, replacement: 'श्रीमती' },
  { pattern: /श्रीमती\.?(?=\s|$)/g, replacement: 'श्रीमती' },
  { pattern: /\bShri\.?(?=\s|$)/gi, replacement: 'श्री' },
  { pattern: /श्री\.?(?=\s|$)/g, replacement: 'श्री' },
  { pattern: /\bDr\.?(?=\s|$)/gi, replacement: 'डॉक्टर' },
  { pattern: /डॉ\.?(?=\s|$)/g, replacement: 'डॉक्टर' },
  { pattern: /\bCol\.?(?=\s|$)/gi, replacement: 'कर्नल' },
  { pattern: /कर्नल\.?(?=\s|$)/g, replacement: 'कर्नल' },
  { pattern: /\b\(Retd\.?\)/gi, replacement: '(सेवानिवृत्त)' },
  { pattern: /\bRetd\.?(?=\s|$)/gi, replacement: 'सेवानिवृत्त' },
  { pattern: /सेवानिवृत्त\.?(?=\s|$)/g, replacement: 'सेवानिवृत्त' },
  { pattern: /\bProf\.?(?=\s|$)/gi, replacement: 'प्रोफेसर' },
  { pattern: /प्रो\.?(?=\s|$)/g, replacement: 'प्रोफेसर' },

  // Clinical Units & Measurements
  { pattern: /\bBP\b/gi, replacement: 'ब्लड प्रेशर' },
  { pattern: /\bSpO2\b/gi, replacement: 'ऑक्सीजन स्तर' },
  { pattern: /\b(\d+)\s?mmHg\b/gi, replacement: '$1 मिलीमीटर मरकरी' },
  { pattern: /\b(\d+)\s?bpm\b/gi, replacement: '$1 धड़कन प्रति मिनट' },
  { pattern: /\b(\d+)\s?mg\b/gi, replacement: '$1 मिलीग्राम' },
  { pattern: /\b(\d+)\s?ml\b/gi, replacement: '$1 मिलीलीटर' },
  { pattern: /\b(\d+)\s?kg\b/gi, replacement: '$1 किलो' },
  { pattern: /\b(\d+)\s?%\b/g, replacement: '$1 प्रतिशत' },

  // General & Currency
  { pattern: /\bNo\.?\s?(\d+)/gi, replacement: 'नंबर $1' },
  { pattern: /₹\s?(\d+)/g, replacement: '$1 रुपये' },
  { pattern: /\bRs\.?\s?(\d+)/gi, replacement: '$1 रुपये' },
];

export const DICTIONARIES: Record<SupportedLanguage, AbbreviationRule[]> = {
  en: ABBREVIATIONS_EN,
  hi: ABBREVIATIONS_HI,
};
