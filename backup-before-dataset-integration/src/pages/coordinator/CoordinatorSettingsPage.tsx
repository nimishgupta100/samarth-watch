import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { 
  User, 
  Phone, 
  Languages, 
  Bell, 
  LogOut, 
  RotateCcw, 
  AlertTriangle, 
  Check, 
  X,
  ShieldCheck
} from 'lucide-react';

export const CoordinatorSettingsPage: React.FC = () => {
  usePageTitle(
    'Settings - Care Coordinator',
    'Manage coordinator profile, language preference, notification alerts, and prototype data state.'
  );

  const { currentUser, logout } = useAuth();
  const { 
    t, 
    language, 
    setLanguage, 
    coordinatorProfile, 
    updateCoordinatorProfile, 
    resetDemoData 
  } = useApp();
  const { showToast } = useToast();

  const [name, setName] = useState(coordinatorProfile?.name || currentUser?.name || 'Nimish Gupta');
  const [phone, setPhone] = useState(coordinatorProfile?.phone || '9876543210');
  const [phoneError, setPhoneError] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  // Notifications toggle preferences state
  const [notifySos, setNotifySos] = useState(true);
  const [notifyMeds, setNotifyMeds] = useState(true);
  const [notifyVoice, setNotifyVoice] = useState(true);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setPhoneError('');
    updateCoordinatorProfile({
      name: name.trim(),
      phone: cleanPhone,
    });
    showToast('Coordinator profile updated successfully', 'success');
  };

  const handleResetConfirm = () => {
    resetDemoData();
    setShowResetModal(false);
    showToast('Demo data reset to initial prototype state', 'info');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-forest tracking-tight">
          {t.coordSettings}
        </h2>
        <p className="text-xs text-ink-muted mt-0.5">
          Care coordinator profile, language and prototype controls
        </p>
      </div>

      {/* 1. Profile Section */}
      <section className="bg-cream border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <User className="w-5 h-5 text-forest" strokeWidth={1.5} />
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
            Coordinator Information
          </h3>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-border bg-white text-base sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
              Phone Number (10 digits) *
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setPhoneError('');
              }}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-border bg-white text-base sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest"
              placeholder="e.g. 9876543210"
            />
            {phoneError && (
              <p className="text-xs text-alert-red font-semibold mt-1">{phoneError}</p>
            )}
          </div>

          <div className="pt-1">
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2.5 bg-forest hover:bg-forest-dark text-cream text-xs font-bold rounded-lg transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-forest"
            >
              Save Profile
            </button>
          </div>
        </form>
      </section>

      {/* 2. Language Preference */}
      <section className="bg-cream border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Languages className="w-5 h-5 text-forest" strokeWidth={1.5} />
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
            Display Language
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`min-h-[48px] p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
              language === 'en'
                ? 'bg-forest text-cream border-forest shadow-xs'
                : 'bg-white text-ink border-border hover:bg-mint-deep'
            }`}
          >
            {language === 'en' && <Check className="w-4 h-4" />}
            <span>English</span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage('hi')}
            className={`min-h-[48px] p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
              language === 'hi'
                ? 'bg-forest text-cream border-forest shadow-xs'
                : 'bg-white text-ink border-border hover:bg-mint-deep'
            }`}
          >
            {language === 'hi' && <Check className="w-4 h-4" />}
            <span>हिन्दी (Hindi)</span>
          </button>
        </div>
      </section>

      {/* 3. Notification Preferences */}
      <section className="bg-cream border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Bell className="w-5 h-5 text-forest" strokeWidth={1.5} />
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
            In-App Alert Subscriptions
          </h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-border cursor-pointer">
            <div>
              <div className="text-xs font-bold text-ink">Urgent SOS Alerts</div>
              <div className="text-[11px] text-ink-muted">Immediate visual and sound notification for active senior distress</div>
            </div>
            <input
              type="checkbox"
              checked={notifySos}
              onChange={(e) => setNotifySos(e.target.checked)}
              className="w-4 h-4 rounded text-forest focus:ring-forest"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-border cursor-pointer">
            <div>
              <div className="text-xs font-bold text-ink">Medicine Escalations (over 30 mins)</div>
              <div className="text-[11px] text-ink-muted">Alerts when critical morning or evening doses are not confirmed</div>
            </div>
            <input
              type="checkbox"
              checked={notifyMeds}
              onChange={(e) => setNotifyMeds(e.target.checked)}
              className="w-4 h-4 rounded text-forest focus:ring-forest"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-border cursor-pointer">
            <div>
              <div className="text-xs font-bold text-ink">Voice Check-in Transcripts</div>
              <div className="text-[11px] text-ink-muted">Notifications when senior records a new voice note or cue</div>
            </div>
            <input
              type="checkbox"
              checked={notifyVoice}
              onChange={(e) => setNotifyVoice(e.target.checked)}
              className="w-4 h-4 rounded text-forest focus:ring-forest"
            />
          </label>
        </div>
      </section>

      {/* 4. Prototype Controls: Reset Demo Data */}
      <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-amber-200">
          <RotateCcw className="w-5 h-5 text-alert-amber" strokeWidth={1.5} />
          <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider">
            Prototype Data Controls
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-950">{t.resetDemoData}</h4>
            <p className="text-xs text-amber-800 leading-relaxed max-w-md">
              Restores the prototype to the 3 clean accounts (Kamla, Karishma, Nimish) and clears any newly added demo doses or appointments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="min-h-[44px] px-4 py-2 bg-amber-600 hover:bg-amber-700 text-cream text-xs font-bold rounded-lg transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-600"
          >
            {t.resetDemoData}
          </button>
        </div>
      </section>

      {/* 5. Sign Out */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => logout()}
          className="w-full min-h-[48px] bg-cream hover:bg-red-50 text-alert-red border border-red-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-alert-red"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.signOut}</span>
        </button>
      </div>

      {/* RESET CONFIRMATION MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-cream border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-150">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div className="text-center space-y-1">
                <h4 className="text-base font-bold text-ink">Reset Demo Data?</h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {t.confirmReset}
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 min-h-[44px] border border-border rounded-lg text-xs font-bold text-ink hover:bg-mint-deep"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetConfirm}
                  className="flex-1 min-h-[44px] bg-alert-amber hover:bg-amber-700 text-cream text-xs font-bold rounded-lg"
                >
                  Yes, Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
