import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { InitialsAvatar } from '../../components/coordinator/InitialsAvatar';
import { StatusChip } from '../../components/coordinator/StatusChip';
import { SegmentedTabs } from '../../components/coordinator/SegmentedTabs';
import { DateStrip } from '../../components/coordinator/DateStrip';
import { SlotPicker } from '../../components/coordinator/SlotPicker';
import { DoctorCareSection } from '../../components/telehealth/DoctorCareSection';
import { 
  Calendar, 
  Video, 
  Users, 
  Clock, 
  Check, 
  X, 
  ExternalLink, 
  Plus, 
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon
} from 'lucide-react';

export const CoordinatorAppointmentsPage: React.FC = () => {
  usePageTitle(
    'Appointments & Scheduling - Care Coordinator',
    'Manage senior visits, Google Meet consultations, and family check-in slots.'
  );

  const { showToast } = useToast();
  const {
    t,
    appointments,
    seniors,
    confirmAppointmentByCoordinator,
    rescheduleAppointment,
    cancelAppointment,
    requestAppointment,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [reschedulingApptId, setReschedulingApptId] = useState<string | null>(null);

  // Meet link inputs keyed by appointment ID
  const [meetLinks, setMeetLinks] = useState<Record<string, string>>({});

  // Schedule form state
  const [newSeniorId, setNewSeniorId] = useState<string>(seniors[0]?.id || '');
  const [newType, setNewType] = useState<'In person' | 'Google Meet'>('Google Meet');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newSlot, setNewSlot] = useState<string>('10:00 AM');
  const [newNotes, setNewNotes] = useState<string>('');

  // Reschedule form state
  const [rescheduleDate, setRescheduleDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [rescheduleSlot, setRescheduleSlot] = useState<string>('11:00 AM');

  // Filter appointments by tab
  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      if (activeTab === 'upcoming') {
        return a.status === 'confirmed' || a.status === 'requested';
      }
      if (activeTab === 'past') {
        return a.status === 'completed';
      }
      if (activeTab === 'cancelled') {
        return a.status === 'cancelled';
      }
      return true;
    });
  }, [appointments, activeTab]);

  // Group appointments under Today, Tomorrow, and subsequent dates
  const groupedAppointments = useMemo(() => {
    const todayIso = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowIso = tomorrow.toISOString().split('T')[0];

    const todayList: typeof appointments = [];
    const tomorrowList: typeof appointments = [];
    const otherList: typeof appointments = [];

    filteredAppointments.forEach((a) => {
      if (a.date === todayIso) todayList.push(a);
      else if (a.date === tomorrowIso) tomorrowList.push(a);
      else otherList.push(a);
    });

    return { todayList, tomorrowList, otherList };
  }, [filteredAppointments]);

  // 7-day week view for laptop
  const weekDays = useMemo(() => {
    const list = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      const dayAppts = appointments.filter((a) => a.date === iso && a.status !== 'cancelled');
      list.push({ iso, weekday, dayNum, month, count: dayAppts.length, isToday: i === 0 });
    }
    return list;
  }, [appointments]);

  const handleConfirm = (id: string) => {
    const meetLink = meetLinks[id];
    confirmAppointmentByCoordinator(id, meetLink);
    showToast('Appointment confirmed and family notified', 'success');
  };

  const handleCancel = (id: string) => {
    cancelAppointment(id);
    showToast('Appointment cancelled', 'info');
  };

  const handleOpenReschedule = (appt: any) => {
    setReschedulingApptId(appt.id);
    setRescheduleDate(appt.date);
    setRescheduleSlot(appt.slotTime);
  };

  const handleConfirmReschedule = () => {
    if (!reschedulingApptId) return;
    rescheduleAppointment(reschedulingApptId, rescheduleDate, rescheduleSlot);
    showToast(`Appointment rescheduled to ${rescheduleDate} at ${rescheduleSlot}`, 'success');
    setReschedulingApptId(null);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const senior = seniors.find((s) => s.id === newSeniorId) || seniors[0];
    requestAppointment(
      newType,
      newDate,
      newSlot,
      senior?.address,
      newNotes.trim()
    );
    showToast(`Appointment scheduled for ${senior?.name || 'Senior'}`, 'success');
    setShowScheduleModal(false);
    setNewNotes('');
  };

  const renderAppointmentCard = (appt: any) => {
    const isMeet = appt.type === 'Google Meet';
    const currentMeetLink = appt.googleMeetLink || meetLinks[appt.id] || '';
    const isConfirmed = appt.status === 'confirmed';
    const isRequested = appt.status === 'requested';

    return (
      <article
        key={appt.id}
        className="p-4 sm:p-5 rounded-xl bg-cream border border-border shadow-xs space-y-3"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Avatar + Senior Name + Type */}
          <div className="flex items-center gap-3">
            <InitialsAvatar name={appt.seniorName || 'Senior'} size="md" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-ink">{appt.seniorName}</h4>
                <StatusChip
                  label={appt.status.toUpperCase()}
                  variant={isConfirmed ? 'success' : isRequested ? 'warning' : 'neutral'}
                />
              </div>

              <div className="flex items-center gap-3 text-xs text-ink-muted mt-1">
                <span className="flex items-center gap-1 font-semibold text-forest">
                  {isMeet ? (
                    <Video className="w-3.5 h-3.5" strokeWidth={1.5} />
                  ) : (
                    <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
                  )}
                  <span>{appt.type}</span>
                </span>
                <span>:</span>
                <span className="flex items-center gap-1 font-bold text-ink">
                  <Clock className="w-3.5 h-3.5 text-sage" strokeWidth={1.5} />
                  <span>{appt.slotTime} IST</span>
                </span>
                <span>({appt.date})</span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {isRequested && (
              <button
                type="button"
                onClick={() => handleConfirm(appt.id)}
                className="min-h-[40px] px-3.5 py-1.5 bg-forest hover:bg-forest-dark text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm</span>
              </button>
            )}

            {appt.status !== 'cancelled' && (
              <>
                <button
                  type="button"
                  onClick={() => handleOpenReschedule(appt)}
                  className="min-h-[40px] px-3 py-1.5 bg-cream hover:bg-mint-deep border border-border text-ink text-xs font-semibold rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-forest"
                >
                  Reschedule
                </button>
                <button
                  type="button"
                  onClick={() => handleCancel(appt.id)}
                  className="min-h-[40px] px-3 py-1.5 bg-cream hover:bg-red-50 text-alert-red border border-border text-xs font-semibold rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-alert-red"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Google Meet Link Field (Real link, opens in new tab) */}
        {isMeet && appt.status !== 'cancelled' && (
          <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex-1 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-forest shrink-0" strokeWidth={1.5} />
              <input
                type="url"
                placeholder="Paste real Google Meet link (e.g. https://meet.google.com/...)"
                value={meetLinks[appt.id] !== undefined ? meetLinks[appt.id] : (appt.googleMeetLink || '')}
                onChange={(e) => setMeetLinks({ ...meetLinks, [appt.id]: e.target.value })}
                className="flex-1 min-h-[38px] px-3 py-1 text-xs rounded-lg border border-border bg-white text-ink focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>

            {currentMeetLink ? (
              <a
                href={currentMeetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[38px] px-3.5 py-1.5 bg-forest hover:bg-forest-dark text-cream text-xs font-bold rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors shrink-0"
              >
                <span>{t.joinMeet}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="text-xs text-ink-muted italic shrink-0">
                {t.addMeetLink}
              </span>
            )}
          </div>
        )}

        {appt.notes && (
          <p className="text-xs text-ink-muted bg-white p-2.5 rounded-lg border border-border/60">
            Agenda: {appt.notes}
          </p>
        )}
      </article>
    );
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-forest tracking-tight">
            {t.coordAppointments}
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Manage senior consultations, family check-in slots and home visits
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <SegmentedTabs
            tabs={[
              { id: 'upcoming', label: t.upcomingTab, count: appointments.filter((a) => a.status === 'confirmed' || a.status === 'requested').length },
              { id: 'past', label: t.pastTab, count: appointments.filter((a) => a.status === 'completed').length },
              { id: 'cancelled', label: t.cancelledTab, count: appointments.filter((a) => a.status === 'cancelled').length },
            ]}
            activeTab={activeTab}
            onChange={(tab) => setActiveTab(tab as any)}
          />

          <button
            type="button"
            onClick={() => setShowScheduleModal(true)}
            className="min-h-[44px] px-4 py-2 bg-forest hover:bg-forest-dark text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-forest"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Slot</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Master List on Left, Laptop Week View on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-8 space-y-5">
          {filteredAppointments.length === 0 ? (
            <div className="bg-cream border border-border rounded-xl p-8 text-center space-y-2">
              <Calendar className="w-8 h-8 text-sage mx-auto" strokeWidth={1.5} />
              <h4 className="text-sm font-bold text-ink">No appointments in this view</h4>
              <p className="text-xs text-ink-muted max-w-sm mx-auto">
                No appointments match the "{activeTab}" filter. Click "Schedule Slot" to book a consultation.
              </p>
            </div>
          ) : (
            <>
              {/* Group Today */}
              {groupedAppointments.todayList.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-forest uppercase tracking-wider">{t.today}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-mint-deep text-forest border border-border">
                      {groupedAppointments.todayList.length}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {groupedAppointments.todayList.map(renderAppointmentCard)}
                  </div>
                </div>
              )}

              {/* Group Tomorrow */}
              {groupedAppointments.tomorrowList.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-forest uppercase tracking-wider">{t.tomorrow}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-mint-deep text-forest border border-border">
                      {groupedAppointments.tomorrowList.length}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {groupedAppointments.tomorrowList.map(renderAppointmentCard)}
                  </div>
                </div>
              )}

              {/* Group Other dates */}
              {groupedAppointments.otherList.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-forest uppercase tracking-wider">Upcoming Dates</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-mint-deep text-forest border border-border">
                      {groupedAppointments.otherList.length}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {groupedAppointments.otherList.map(renderAppointmentCard)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Pane: Laptop 7-Day Calendar Summary */}
        <div className="hidden lg:block lg:col-span-4 space-y-4">
          <div className="bg-cream border border-border rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-forest uppercase tracking-wider">
                Week at a Glance
              </h3>
              <CalendarDays className="w-4 h-4 text-sage" strokeWidth={1.5} />
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center">
              {weekDays.map((d) => (
                <div
                  key={d.iso}
                  className={`p-2 rounded-lg border flex flex-col items-center justify-center ${
                    d.isToday
                      ? 'bg-forest text-cream border-forest font-bold'
                      : d.count > 0
                      ? 'bg-mint-deep text-forest border-border font-semibold'
                      : 'bg-white text-ink-muted border-border'
                  }`}
                >
                  <span className="text-[10px] uppercase opacity-80">{d.weekday}</span>
                  <span className="text-sm font-extrabold my-0.5">{d.dayNum}</span>
                  <span className="text-[9px]">
                    {d.count > 0 ? `${d.count} appt` : '-'}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-xs text-ink-muted pt-2 border-t border-border">
              All appointments sync with senior calendar reminders in both English and Hindi.
            </div>
          </div>
        </div>
      </div>

      {/* Telehealth Specialists & Doctor Consultation Section (matching modern design) */}
      <DoctorCareSection className="pt-6 border-t border-border" />

      {/* SCHEDULE MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-cream border border-border rounded-2xl shadow-xl overflow-hidden max-h-[92dvh] flex flex-col animate-in fade-in duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-mint-deep shrink-0">
              <h3 className="text-base font-bold text-ink">Schedule Consultation</h3>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-ink hover:bg-mint"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="p-5 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
                  Select Senior
                </label>
                <select
                  value={newSeniorId}
                  onChange={(e) => setNewSeniorId(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-border bg-white text-base sm:text-sm focus:ring-2 focus:ring-forest focus:outline-none"
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
                  Consultation Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('Google Meet')}
                    className={`min-h-[44px] p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 ${
                      newType === 'Google Meet' ? 'bg-forest text-cream border-forest' : 'bg-white text-ink border-border'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Google Meet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('In person')}
                    className={`min-h-[44px] p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 ${
                      newType === 'In person' ? 'bg-forest text-cream border-forest' : 'bg-white text-ink border-border'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Home Visit</span>
                  </button>
                </div>
              </div>

              {/* Date strip */}
              <DateStrip selectedDate={newDate} onSelectDate={setNewDate} />

              {/* Slot picker */}
              <SlotPicker selectedSlot={newSlot} onSelectSlot={setNewSlot} />

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
                  Agenda / Clinical Purpose
                </label>
                <input
                  type="text"
                  placeholder="e.g. Check on fatigue, review morning medication"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-border bg-white text-base sm:text-sm focus:ring-2 focus:ring-forest focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full min-h-[48px] bg-forest hover:bg-forest-dark text-cream font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t.confirmSchedule}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {reschedulingApptId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-cream border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-mint-deep">
              <h3 className="text-base font-bold text-ink">Reschedule Appointment</h3>
              <button
                type="button"
                onClick={() => setReschedulingApptId(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-ink hover:bg-mint"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <DateStrip selectedDate={rescheduleDate} onSelectDate={setRescheduleDate} />
              <SlotPicker selectedSlot={rescheduleSlot} onSelectSlot={setRescheduleSlot} />

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReschedulingApptId(null)}
                  className="min-h-[44px] px-4 py-2 border border-border rounded-lg text-xs font-bold text-ink hover:bg-mint-deep"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReschedule}
                  className="min-h-[44px] px-5 py-2 bg-forest text-cream text-xs font-bold rounded-lg hover:bg-forest-dark"
                >
                  Save New Time
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
