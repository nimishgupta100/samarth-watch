import { SupportedLanguage, TranslationDictionary } from './types';
import { en } from './en';
import { hi } from './hi';

export * from './types';

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en,
  hi,
  bn: {
    ...hi,
    appName: 'সমর্থ ওয়াচ (Samarth Watch)',
    tagline: 'বয়স্কদের যত্ন এবং প্রাথমিক সতর্কতা সমন্বয়',
    chooseRoleTitle: 'আপনার পোর্টাল নির্বাচন করুন',
    roleSenior: 'প্রবীণ নাগরিক (Senior Citizen)',
    roleFamily: 'পরিবারের সদস্য (Family Member)',
    roleCoordinator: 'কেয়ার কোঅর্ডিনেটর (Care Coordinator)',
    greetingMorning: 'সুপ্রভাত',
    greetingAfternoon: 'নমস্কার',
    greetingEvening: 'শুভ সন্ধ্যা',
    sosButtonLabel: 'জরুরি সাহায্য (SOS)',
    sosInformedTitle: 'সাহায্য পাঠানো হয়েছে',
  },
  mr: {
    ...hi,
    appName: 'समर्थ वॉच (Samarth Watch)',
    tagline: 'ज्येष्ठ नागरिक काळजी व पूर्वसूचना प्रणाली',
    chooseRoleTitle: 'आपला पोर्टल निवडा',
    roleSenior: 'ज्येष्ठ नागरिक (Senior Citizen)',
    roleFamily: 'कुटुंब सदस्य (Family Member)',
    roleCoordinator: 'केअर समन्वयक (Care Coordinator)',
    greetingMorning: 'शुभ सकाळ',
    greetingAfternoon: 'शुभ दुपार',
    greetingEvening: 'शुभ संध्याकाळ',
    sosButtonLabel: 'तातडीची मदत (SOS)',
    sosInformedTitle: 'मदत पाठवली गेली आहे',
  },
  ta: {
    ...hi,
    appName: 'சமர்த் வாட்ச் (Samarth Watch)',
    tagline: 'முதியோர் பராமரிப்பு மற்றும் முன்னெச்சரிக்கை அமைப்பு',
    chooseRoleTitle: 'உங்கள் தளத்தைத் தேர்ந்தெடுக்கவும்',
    roleSenior: 'முதியவர் (Senior Citizen)',
    roleFamily: 'குடும்ப உறுப்பினர் (Family Member)',
    roleCoordinator: 'பராமரிப்பு ஒருங்கிணைப்பாளர் (Care Coordinator)',
    greetingMorning: 'காலை வணக்கம்',
    greetingAfternoon: 'மதிய வணக்கம்',
    greetingEvening: 'மாலை வணக்கம்',
    sosButtonLabel: 'அவசர உதவி (SOS)',
    sosInformedTitle: 'உதவி அனுப்பப்பட்டது',
  },
  te: {
    ...hi,
    appName: 'సమర్థ్ వాచ్ (Samarth Watch)',
    tagline: 'వృద్ధుల సంరక్షణ మరియు ముందస్తు హెచ్చరిక సమన్వయం',
    chooseRoleTitle: 'మీ పోర్టల్‌ను ఎంచుకోండి',
    roleSenior: 'సీనియర్ సిటిజన్ (Senior Citizen)',
    roleFamily: 'కుటుంబ సభ్యుడు (Family Member)',
    roleCoordinator: 'కేర్ కోఆర్డినేటర్ (Care Coordinator)',
    greetingMorning: 'శుభోదయం',
    greetingAfternoon: 'నమస్కారం',
    greetingEvening: 'శుభ సాయంత్రం',
    sosButtonLabel: 'అత్యవసర సహాయం (SOS)',
    sosInformedTitle: 'సహాయం పంపబడింది',
  },
};

export function getTranslation(lang: SupportedLanguage): TranslationDictionary {
  return translations[lang] || translations.en;
}
