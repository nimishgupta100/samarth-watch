import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Pill, 
  Calendar, 
  Phone, 
  Users, 
  ArrowRight, 
  Check, 
  AlertCircle,
  Video,
  Clock,
  Plus,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { DateStrip } from './DateStrip';
import { SlotPicker } from './SlotPicker';

interface QuickActionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAction?: 'menu' | 'add_medicine' | 'schedule_appointment' | 'call_senior' | 'call_family';
}

type SheetView = 'menu' | 'add_medicine' | 'schedule_appointment' | 'call_senior' | 'call_family';

export const QuickActionsSheet: React.FC<QuickActionsSheetProps> = ({
  isOpen,
  onClose,
  defaultAction = 'menu',
}) => {
  const { t, seniors, addMedicine, requestAppointment } = useApp();
  const { showToast } = useToast();

  const [currentView, setCurrentView] = useState<SheetView>(defaultAction);
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Form states for Add Medicine
  const [medSeniorId, setMedSeniorId] = useState<string>(seniors[0]?.id || '');
  const [medName, setMedName] = useState('');
  const [medInstructions, setMedInstructions] = useState('');
  const [medTimes, setMedTimes] = useState<string[]>(['08:30 AM']);
  const [customTime, setCustomTime] = useState('');

  // Form states for Schedule Appointment
  const [apptSeniorId, setApptSeniorId] = useState<string>(seniors[0]?.id || '');
  const [apptType, setApptType] = useState<'In person' | 'Google Meet'>('Google Meet');
  const [apptDate, setApptDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [apptSlot, setApptSlot] = useState<string>('10:00 AM');
  const [apptNotes, setApptNotes] = useState<string>('');
  const [apptMeetLink, setApptMeetLink] = useState<string>('');

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      setCurrentView(defaultAction);
      if (seniors.length > 0) {
        setMedSeniorId(seniors[0].id);
        setApptSeniorId(seniors[0].id);
      }
    } else {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen, defaultAction, seniors]);

  // Trap focus and close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeSenior = seniors.find((s) => s.id === (currentView === 'add_medicine' ? medSeniorId : apptSeniorId)) || seniors[0];

  const handleAddMedicineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) {
      showToast('Please enter a medicine name', 'error');
      return;
    }
    if (medTimes.length === 0) {
      showToast('Please specify at least one dose timing', 'error');
      return;
    }

    addMedicine(
      medName.trim(),
      medInstructions.trim() || 'Take after meals with water',
      medTimes
    );

    showToast(`Added ${medName} to medication schedule`, 'success');
    setMedName('');
    setMedInstructions('');
    setMedTimes(['08:30 AM']);
    onClose();
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptSlot) {
      showToast('Please select a time slot', 'error');
      return;
    }

    requestAppointment(
      apptType,
      apptDate,
      apptSlot,
      activeSenior?.address,
      apptNotes.trim()
    );

    showToast(`Appointment scheduled for ${activeSenior?.name || 'Senior'}`, 'success');
    setApptNotes('');
    setApptMeetLink('');
    onClose();
  };

  const addTimeSlot = (time: string) => {
    if (!medTimes.includes(time)) {
      setMedTimes([...medTimes, time]);
    }
  };

  const removeTimeSlot = (time: string) => {
    setMedTimes(medTimes.filter((t) => t !== time));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-actions-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/50 backdrop-blur-xs transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={sheetRef}
        className="w-full sm:max-w-xl max-h-[92dvh] bg-cream border border-border sm:rounded-2xl rounded-t-2xl shadow-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom duration-200"
      >
        {/* Sheet Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-mint-deep shrink-0">
          <div className="flex items-center gap-2">
            {currentView !== 'menu' && (
              <button
                type="button"
                onClick={() => setCurrentView('menu')}
                className="text-xs font-semibold text-forest hover:underline mr-1 focus:outline-none focus:ring-2 focus:ring-forest rounded"
              >
                Back
              </button>
            )}
            <h2 id="quick-actions-title" className="text-base sm:text-lg font-bold text-ink">
              {currentView === 'menu' && t.quickActions}
              {currentView === 'add_medicine' && t.addMedicine}
              {currentView === 'schedule_appointment' && t.scheduleAppointment}
              {currentView === 'call_senior' && t.callSenior}
              {currentView === 'call_family' && t.callFamily}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-lg bg-cream border border-border flex items-center justify-center text-ink hover:bg-mint transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Sheet Content Area (scrollable) */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* MENU VIEW */}
          {currentView === 'menu' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCurrentView('add_medicine')}
                className="min-h-[56px] p-4 rounded-xl bg-white border border-border hover:border-forest/40 hover:bg-mint/40 text-left flex items-center gap-3.5 transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
              >
                <div className="w-10 h-10 rounded-lg bg-mint-deep text-forest flex items-center justify-center shrink-0">
                  <Pill className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-sm font-bold text-ink">{t.addMedicine}</div>
                  <div className="text-xs text-ink-muted">Set dose, timing & notes</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('schedule_appointment')}
                className="min-h-[56px] p-4 rounded-xl bg-white border border-border hover:border-forest/40 hover:bg-mint/40 text-left flex items-center gap-3.5 transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
              >
                <div className="w-10 h-10 rounded-lg bg-mint-deep text-forest flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-sm font-bold text-ink">{t.scheduleAppointment}</div>
                  <div className="text-xs text-ink-muted">Google Meet or home visit</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('call_senior')}
                className="min-h-[56px] p-4 rounded-xl bg-white border border-border hover:border-forest/40 hover:bg-mint/40 text-left flex items-center gap-3.5 transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
              >
                <div className="w-10 h-10 rounded-lg bg-mint-deep text-forest flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-sm font-bold text-ink">{t.callSenior}</div>
                  <div className="text-xs text-ink-muted">Direct phone connection</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('call_family')}
                className="min-h-[56px] p-4 rounded-xl bg-white border border-border hover:border-forest/40 hover:bg-mint/40 text-left flex items-center gap-3.5 transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
              >
                <div className="w-10 h-10 rounded-lg bg-mint-deep text-forest flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-sm font-bold text-ink">{t.callFamily}</div>
                  <div className="text-xs text-ink-muted">Linked family member</div>
                </div>
              </button>
            </div>
          )}

          {/* ADD MEDICINE FORM */}
          {currentView === 'add_medicine' && (
            <form onSubmit={handleAddMedicineSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
                  Select Senior
                </label>
                <select
                  value={medSeniorId}
                  onChange={(e) => setMedSeniorId(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-border bg-white text-ink text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                >
                  {seniors.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.city || 'Delhi'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amlodipine 5mg"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-border bg-white text-ink text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                  enterKeyHint="next"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
                  Dosage Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1 tablet after breakfast with warm water"
                  value={medInstructions}
                  onChange={(e) => setMedInstructions(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-border bg-white text-ink text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                  enterKeyHint="next"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
                  Dose Timing Schedule *
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['08:30 AM', '01:00 PM', '02:00 PM', '08:30 PM'].map((time) => {
                    const active = medTimes.includes(time);
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => (active ? removeTimeSlot(time) : addTimeSlot(time))}
                        className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                          active
                            ? 'bg-forest text-cream border-forest'
                            : 'bg-white text-ink border-border hover:bg-mint-deep'
                        }`}
                      >
                        {active && <Check className="w-3.5 h-3.5" />}
                        <span>{time}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom timing addition */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Custom time e.g. 09:00 PM"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="flex-1 min-h-[44px] px-3.5 py-2 rounded-lg border border-border bg-white text-ink text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customTime.trim()) {
                        addTimeSlot(customTime.trim());
                        setCustomTime('');
                      }
                    }}
                    className="min-h-[44px] px-4 py-2 bg-mint-deep border border-border text-forest text-xs font-bold rounded-lg hover:bg-border transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
                  >
                    Add Slot
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full min-h-[48px] bg-forest hover:bg-forest-dark text-cream font-bold text-sm rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2"
                >
                  <Pill className="w-4 h-4" />
                  <span>Save Medicine Schedule</span>
                </button>
              </div>
            </form>
          )}

          {/* SCHEDULE APPOINTMENT FORM */}
          {currentView === 'schedule_appointment' && (
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
                  Select Senior
                </label>
                <select
                  value={apptSeniorId}
                  onChange={(e) => setApptSeniorId(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-border bg-white text-ink text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                >
                  {seniors.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.city || 'Delhi'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
                  Appointment Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setApptType('Google Meet')}
                    className={`min-h-[44px] p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                      apptType === 'Google Meet'
                        ? 'bg-forest text-cream border-forest shadow-xs'
                        : 'bg-white text-ink border-border hover:bg-mint-deep'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Google Meet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setApptType('In person')}
                    className={`min-h-[44px] p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                      apptType === 'In person'
                        ? 'bg-forest text-cream border-forest shadow-xs'
                        : 'bg-white text-ink border-border hover:bg-mint-deep'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Home Visit</span>
                  </button>
                </div>
              </div>

              {/* Date strip */}
              <DateStrip selectedDate={apptDate} onSelectDate={setApptDate} />

              {/* Slot picker */}
              <SlotPicker selectedSlot={apptSlot} onSelectSlot={setApptSlot} />

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
                  Notes / Agenda (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Review blood pressure baseline and morning fatigue"
                  value={apptNotes}
                  onChange={(e) => setApptNotes(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-border bg-white text-ink text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full min-h-[48px] bg-forest hover:bg-forest-dark text-cream font-bold text-sm rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t.confirmSchedule}</span>
                </button>
              </div>
            </form>
          )}

          {/* CALL SENIOR VIEW */}
          {currentView === 'call_senior' && (
            <div className="space-y-4">
              <p className="text-xs text-ink-muted">
                Connect directly with seniors under your care. Phone links open your phone's dialer or desktop calling application.
              </p>
              <div className="space-y-2">
                {seniors.map((senior) => {
                  const hasPhone = Boolean(senior.phone && senior.phone.trim().length >= 10);
                  return (
                    <div
                      key={senior.id}
                      className="p-3.5 rounded-xl bg-white border border-border flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-sm font-bold text-ink">{senior.name}</div>
                        <div className="text-xs text-ink-muted">
                          {hasPhone ? senior.phone : t.notAddedYet} : {senior.city || 'Delhi'}
                        </div>
                      </div>
                      {hasPhone ? (
                        <a
                          href={`tel:${senior.phone}`}
                          className="min-h-[44px] px-4 py-2 bg-forest hover:bg-forest-dark text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      ) : (
                        <span className="text-xs font-semibold text-ink-muted bg-mint-deep px-3 py-1.5 rounded-lg">
                          {t.notAddedYet}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CALL FAMILY VIEW */}
          {currentView === 'call_family' && (
            <div className="space-y-4">
              <p className="text-xs text-ink-muted">
                Connect with family members linked to seniors under your care.
              </p>
              <div className="space-y-2">
                {seniors.map((senior) => {
                  const familyName = senior.linkedFamilyName || 'Family Member';
                  const familyPhone = senior.linkedFamilyPhone || '8765789433';
                  const hasPhone = Boolean(familyPhone && familyPhone.trim().length >= 10);
                  return (
                    <div
                      key={senior.id}
                      className="p-3.5 rounded-xl bg-white border border-border flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-sm font-bold text-ink">{familyName}</div>
                        <div className="text-xs text-ink-muted">
                          Family of {senior.name} : {hasPhone ? familyPhone : t.notAddedYet}
                        </div>
                      </div>
                      {hasPhone ? (
                        <a
                          href={`tel:${familyPhone}`}
                          className="min-h-[44px] px-4 py-2 bg-forest hover:bg-forest-dark text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      ) : (
                        <span className="text-xs font-semibold text-ink-muted bg-mint-deep px-3 py-1.5 rounded-lg">
                          {t.notAddedYet}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
