import { SupportedLanguage, TranslationDictionary } from './types';
import { en } from './en';
import { hi } from './hi';

export * from './types';

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en,
  hi,
};

export function getTranslation(lang: SupportedLanguage): TranslationDictionary {
  return translations[lang] || translations.en;
}
