import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { 
  Heart, 
  Moon, 
  Utensils, 
  Pill, 
  Smile, 
  Languages, 
  Lock, 
  PhoneCall, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const FamilySummary: React.FC = () => {
  useDocumentTitle('Family Weekly Summary');
  const { selectedSenior, seniors, setCurrentSeniorId } = useApp();
  const { showToast } = useToast();
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const familyAllowedSeniors = seniors.slice(0, 8);
  const isConsentGranted = selectedSenior.familyConsentGranted;
  const isCritical = selectedSenior.currentUrgency === 'critical';

  const summaryTextEn = isCritical
    ? `Your mother had a mostly steady week, with good appetite and regular evening tea. However, over the past three days, she mentioned feeling slight dizziness and disturbed night sleep during our morning chats. Our Care Coordinator Ananya is already following up with her today, and we wanted you to have a gentle update so you can check in on her evening routine.`
    : `Your parent had a wonderful, peaceful week! Routine check-in calls were completed on Tuesday, Thursday, and this morning. Sleep and appetite have been consistent, morning medications were taken with breakfast, and she sounded cheerful chatting about family.`;

  const summaryTextHi = isCritical
    ? `आपकी माताजी का यह सप्ताह अधिकांश समय सामान्य और शांत रहा। उन्होंने चाय और हल्का नाश्ता समय पर लिया। हालांकि, पिछले तीन दिनों में सुबह की बातचीत के दौरान उन्होंने थोड़ा सर घूमने और रात को नींद टूटने का ज़िक्र किया। हमारी केयर कोऑर्डिनेटर अनन्या आज उनसे बातचीत कर रही हैं। हमने आपको यह सहज जानकारी दी है ताकि आप भी शाम को फोन करके उनका हाल-चाल ले सकें।`
    : `आपकी माताजी का यह सप्ताह बहुत सुखद और स्थिर रहा! मंगलवार, गुरुवार और आज सुबह की बातचीत पूरी हुई। नींद और खान-पान बहुत अच्छा रहा, दवाइयाँ नियमित ली गईं, और वे बहुत प्रसन्नचित्त बात कर रही थीं।`;

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en';
    setLang(nextLang);
    showToast(`Weekly summary language set to ${nextLang === 'hi' ? 'Hindi' : 'English'}`, 'info');
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
              <Heart className="w-3.5 h-3.5 text-rose-600" />
              <span>Samarth Family Companion Portal</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Weekly Wellbeing Letter
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Care summary for <strong>{selectedSenior.name}</strong> : Linked to {selectedSenior.linkedFamilyName}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 min-h-[44px] rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5 border border-slate-200"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'हिंदी में पढ़ें' : 'Read in English'}</span>
            </button>
          </div>
        </div>

        {/* Demo Switcher */}
        <div className="pt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold">Switch Senior:</span>
          {familyAllowedSeniors.map(s => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentSeniorId(s.id);
                showToast(`Viewing family summary for ${s.name}`, 'info');
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
                s.id === selectedSenior.id
                  ? 'bg-rose-50 text-rose-900 border-rose-300 font-bold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {s.name} {!s.familyConsentGranted ? '(Consent Off)' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* CONSENT BLOCKED SCREEN IF CONSENT IS OFF */}
      {!isConsentGranted ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-2xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-200">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Family Portal Sharing is Currently Paused
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Under Samarth's <em>Senior Autonomy Privacy Charter</em>, <strong>{selectedSenior.name}</strong> retains full discretion over what gets shared with family members. Routine health logs and coordinator check-in details are currently private to their assigned Care Coordinator.
          </p>

          <p className="pt-3 text-xs text-slate-500">
            The senior can update sharing preferences from their own account.
          </p>
        </div>
      ) : (
        /* ACTIVE CONSENT */
        <div className="space-y-6">
          
          {/* Urgent Alert Banner (ONLY SHOWN FOR CRITICAL EVENTS) */}
          {isCritical && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                  <span>Coordinator Follow-up in Progress</span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md font-semibold uppercase">
                    Non-Emergency Care
                  </span>
                </h3>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Care Coordinator <strong>{selectedSenior.assignedCoordinatorName}</strong> noticed a slight change from your mother's usual routine this week and is conducting an unhurried check-in today. No emergency action is needed; this is early preventive support.
                </p>
              </div>
            </div>
          )}

          {/* Warm Weekly Summary Letter Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-rose-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Weekly Letter : Week of Oct 22 - Oct 29, 2026
              </span>
              <span>Delivered every Thursday</span>
            </div>

            <div className="text-base sm:text-lg text-slate-800 leading-relaxed font-hindi">
              {lang === 'hi' ? summaryTextHi : summaryTextEn}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Prepared with care by {selectedSenior.assignedCoordinatorName}</span>
              <span className="font-semibold text-teal-700">Samarth Life Management</span>
            </div>
          </div>

          {/* Week-at-a-Glance Plain Language Icons (Clean Lucide SVG icons, NO emojis, NO pill shapes) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Week-at-a-Glance Indicators (Non-Technical)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              {/* Sleep */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mx-auto">
                  <Moon className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Night Sleep</div>
                <div className={`text-xs font-semibold px-2 py-0.5 rounded-md inline-block ${
                  isCritical ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}>
                  {isCritical ? 'Slightly Disturbed' : 'Restful & Steady'}
                </div>
              </div>

              {/* Appetite */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
                <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center mx-auto">
                  <Utensils className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Daily Meals</div>
                <div className="text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-md inline-block">
                  Regular Appetite
                </div>
              </div>

              {/* Medicines */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
                <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center mx-auto">
                  <Pill className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Routine Tablets</div>
                <div className="text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-md inline-block">
                  Taken on Schedule
                </div>
              </div>

              {/* Mood */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <Smile className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Social & Mood</div>
                <div className={`text-xs font-semibold px-2 py-0.5 rounded-md inline-block ${
                  isCritical ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}>
                  {isCritical ? 'Slightly Tired' : 'Cheerful & Calm'}
                </div>
              </div>

            </div>
          </div>

          {/* Contact Coordinator Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold">Have a question about this week’s note?</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Care Coordinator {selectedSenior.assignedCoordinatorName} is available Monday to Saturday, 9 AM - 6 PM.
              </p>
            </div>

            <a
              href="tel:+919811044211"
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shrink-0 shadow-sm"
            >
              <PhoneCall className="w-4 h-4 text-slate-950" />
              <span>Contact Care Coordinator</span>
            </a>
          </div>

        </div>
      )}

      <div className="text-center text-xs text-slate-400 pt-2">
        <p>Samarth Family Companion : Designed for empathy, privacy, and non-alarmist elder care.</p>
      </div>

    </div>
  );
};
