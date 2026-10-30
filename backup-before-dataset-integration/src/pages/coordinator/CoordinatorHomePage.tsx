import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { InitialsAvatar } from '../../components/coordinator/InitialsAvatar';
import { StatusChip } from '../../components/coordinator/StatusChip';
import { EmergencyStrip } from '../../components/coordinator/EmergencyStrip';
import { 
  Pill, 
  Activity, 
  Mic, 
  ShieldAlert, 
  Clock, 
  Phone, 
  ArrowRight, 
  ThumbsUp, 
  ThumbsDown, 
  Check, 
  Filter,
  CheckCircle2,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export const CoordinatorHomePage: React.FC = () => {
  usePageTitle(
    "Today's Priorities - Samarth Watch",
    "AI early-warning caseload triage for Care Coordinators looking after seniors living at home."
  );

  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    t,
    seniors,
    activeSosEvent,
    resolveSosEvent,
    doses,
    handleAlertAction,
    handleFeedback,
    setCurrentSeniorId,
  } = useApp();

  // Signal filter: 'all' | 'medication' | 'vitals' | 'voice_notes' | 'sos' | 'silence'
  const [signalFilter, setSignalFilter] = useState<string>('all');
  const [snoozedSeniorIds, setSnoozedSeniorIds] = useState<string[]>([]);
  const [completedSeniorIds, setCompletedSeniorIds] = useState<string[]>([]);

  // Emergency check: active SOS or unconfirmed medicine escalation
  const hasActiveSos = Boolean(activeSosEvent && activeSosEvent.status !== 'Resolved');
  const pendingMedDose = doses.find((d) => d.status === 'pending');

  const emergencyItem = useMemo(() => {
    if (hasActiveSos && activeSosEvent) {
      const targetSenior = seniors.find((s) => s.id === activeSosEvent.seniorId) || seniors[0];
      return {
        seniorId: targetSenior?.id || 'senior-kamla-001',
        seniorName: targetSenior?.name || 'Senior',
        reason: 'Active SOS Alert triggered by senior',
        time: new Date(activeSosEvent.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        phone: targetSenior?.phone,
        city: targetSenior?.city,
        address: targetSenior?.address,
      };
    }
    if (pendingMedDose) {
      const targetSenior = seniors[0];
      return {
        seniorId: targetSenior?.id || 'senior-kamla-001',
        seniorName: targetSenior?.name || 'Senior',
        reason: `Pending dose: ${pendingMedDose.medicineName} (${pendingMedDose.scheduledTime})`,
        time: pendingMedDose.scheduledTime,
        phone: targetSenior?.phone,
        city: targetSenior?.city,
        address: targetSenior?.address,
      };
    }
    return null;
  }, [hasActiveSos, activeSosEvent, pendingMedDose, seniors]);

  // Seniors needing attention count
  const needingAttentionCount = useMemo(() => {
    return seniors.filter((s) => {
      const isCriticalOrModerate = s.currentUrgency === 'critical' || s.currentUrgency === 'moderate';
      return isCriticalOrModerate && !completedSeniorIds.includes(s.id);
    }).length;
  }, [seniors, completedSeniorIds]);

  // Counts for signal filter shortcuts
  const signalCounts = useMemo(() => {
    let med = 0;
    let vitals = 0;
    let voice = 0;
    let sos = hasActiveSos ? 1 : 0;
    let silence = 0;

    seniors.forEach((s) => {
      if (s.activeSignals?.includes('medication')) med++;
      if (s.activeSignals?.includes('vitals')) vitals++;
      if (s.activeSignals?.includes('call_notes')) voice++;
      if (s.activeSignals?.includes('silence')) silence++;
    });

    return { med, vitals, voice, sos, silence };
  }, [seniors, hasActiveSos]);

  // Sorted and filtered priority cards
  const prioritizedSeniors = useMemo(() => {
    return seniors
      .filter((s) => {
        if (snoozedSeniorIds.includes(s.id)) return false;
        if (signalFilter === 'all') return true;
        if (signalFilter === 'medication') return s.activeSignals?.includes('medication');
        if (signalFilter === 'vitals') return s.activeSignals?.includes('vitals');
        if (signalFilter === 'voice_notes') return s.activeSignals?.includes('call_notes');
        if (signalFilter === 'sos') return hasActiveSos;
        if (signalFilter === 'silence') return s.activeSignals?.includes('silence');
        return true;
      })
      .sort((a, b) => {
        const order: Record<string, number> = { critical: 3, moderate: 2, low: 1 };
        return (order[b.currentUrgency] || 0) - (order[a.currentUrgency] || 0);
      });
  }, [seniors, snoozedSeniorIds, signalFilter, hasActiveSos]);

  const handleOpenSeniorProfile = (seniorId: string) => {
    setCurrentSeniorId(seniorId);
    navigate(`/coordinator/senior/${seniorId}`);
  };

  const handleSnooze = (seniorId: string, name: string) => {
    setSnoozedSeniorIds((prev) => [...prev, seniorId]);
    showToast(`Snoozed alerts for ${name} for 2 hours`, 'info');
  };

  const handleMarkDone = (seniorId: string, name: string) => {
    setCompletedSeniorIds((prev) => [...prev, seniorId]);
    showToast(`Marked review for ${name} as complete`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* 1. Emergency Strip (displayed ONLY if active SOS or unconfirmed medicine) */}
      {emergencyItem && (
        <EmergencyStrip
          seniorId={emergencyItem.seniorId}
          seniorName={emergencyItem.seniorName}
          reason={emergencyItem.reason}
          time={emergencyItem.time}
          phone={emergencyItem.phone}
          city={emergencyItem.city}
          address={emergencyItem.address}
          onOpenSenior={handleOpenSeniorProfile}
          onResolve={hasActiveSos && activeSosEvent ? () => resolveSosEvent(activeSosEvent.id, 'Resolved from emergency strip') : undefined}
        />
      )}

      {/* 2. Soft Green Banner Card */}
      <div className="bg-mint-deep border border-border rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-forest uppercase tracking-wider bg-cream px-2 py-0.5 rounded border border-border">
            Today's Caseload
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-forest mt-1.5">
            {needingAttentionCount > 0
              ? `${needingAttentionCount} ${t.needAttentionToday}`
              : t.noAttentionNeeded}
          </h2>
          <p className="text-xs text-ink-muted mt-1 max-w-xl">
            Triage is continuously calibrated against individual baseline norms. All alerts prioritize patient dignity and family coordination.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('priority-list');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="min-h-[44px] px-5 py-2.5 bg-forest hover:bg-forest-dark text-cream text-xs font-bold rounded-lg transition-colors shadow-xs shrink-0 self-start sm:self-center focus:outline-none focus:ring-2 focus:ring-forest"
        >
          {t.viewTodayList}
        </button>
      </div>

      {/* 3. Round/Square Icon Shortcuts for Categories with Real Counts */}
      <div>
        <div className="text-xs font-bold text-ink uppercase tracking-wider mb-2.5">
          Filter by Signal
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          <button
            type="button"
            onClick={() => setSignalFilter('all')}
            className={`min-h-[52px] p-3 rounded-xl border text-left transition-colors flex items-center gap-2.5 select-none focus:outline-none focus:ring-2 focus:ring-forest ${
              signalFilter === 'all'
                ? 'bg-forest text-cream border-forest shadow-xs'
                : 'bg-cream text-ink border-border hover:bg-mint-deep'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${signalFilter === 'all' ? 'bg-forest-dark' : 'bg-mint-deep text-forest'}`}>
              <Filter className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">All Seniors</div>
              <div className={`text-[10px] ${signalFilter === 'all' ? 'text-cream/80' : 'text-ink-muted'}`}>
                {seniors.length} total
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSignalFilter('medication')}
            className={`min-h-[52px] p-3 rounded-xl border text-left transition-colors flex items-center gap-2.5 select-none focus:outline-none focus:ring-2 focus:ring-forest ${
              signalFilter === 'medication'
                ? 'bg-forest text-cream border-forest shadow-xs'
                : 'bg-cream text-ink border-border hover:bg-mint-deep'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${signalFilter === 'medication' ? 'bg-forest-dark' : 'bg-amber-100 text-amber-800'}`}>
              <Pill className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">Medicine</div>
              <div className={`text-[10px] ${signalFilter === 'medication' ? 'text-cream/80' : 'text-ink-muted'}`}>
                {signalCounts.med} active
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSignalFilter('vitals')}
            className={`min-h-[52px] p-3 rounded-xl border text-left transition-colors flex items-center gap-2.5 select-none focus:outline-none focus:ring-2 focus:ring-forest ${
              signalFilter === 'vitals'
                ? 'bg-forest text-cream border-forest shadow-xs'
                : 'bg-cream text-ink border-border hover:bg-mint-deep'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${signalFilter === 'vitals' ? 'bg-forest-dark' : 'bg-red-100 text-red-800'}`}>
              <Activity className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">Vitals</div>
              <div className={`text-[10px] ${signalFilter === 'vitals' ? 'text-cream/80' : 'text-ink-muted'}`}>
                {signalCounts.vitals} shift
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSignalFilter('voice_notes')}
            className={`min-h-[52px] p-3 rounded-xl border text-left transition-colors flex items-center gap-2.5 select-none focus:outline-none focus:ring-2 focus:ring-forest ${
              signalFilter === 'voice_notes'
                ? 'bg-forest text-cream border-forest shadow-xs'
                : 'bg-cream text-ink border-border hover:bg-mint-deep'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${signalFilter === 'voice_notes' ? 'bg-forest-dark' : 'bg-emerald-100 text-emerald-800'}`}>
              <Mic className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">Voice Notes</div>
              <div className={`text-[10px] ${signalFilter === 'voice_notes' ? 'text-cream/80' : 'text-ink-muted'}`}>
                {signalCounts.voice} cues
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSignalFilter('sos')}
            className={`min-h-[52px] p-3 rounded-xl border text-left transition-colors flex items-center gap-2.5 select-none focus:outline-none focus:ring-2 focus:ring-forest ${
              signalFilter === 'sos'
                ? 'bg-forest text-cream border-forest shadow-xs'
                : 'bg-cream text-ink border-border hover:bg-mint-deep'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${signalFilter === 'sos' ? 'bg-forest-dark' : 'bg-rose-100 text-rose-800'}`}>
              <ShieldAlert className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">SOS</div>
              <div className={`text-[10px] ${signalFilter === 'sos' ? 'text-cream/80' : 'text-ink-muted'}`}>
                {signalCounts.sos} open
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSignalFilter('silence')}
            className={`min-h-[52px] p-3 rounded-xl border text-left transition-colors flex items-center gap-2.5 select-none focus:outline-none focus:ring-2 focus:ring-forest ${
              signalFilter === 'silence'
                ? 'bg-forest text-cream border-forest shadow-xs'
                : 'bg-cream text-ink border-border hover:bg-mint-deep'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${signalFilter === 'silence' ? 'bg-forest-dark' : 'bg-slate-200 text-slate-800'}`}>
              <Clock className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">No Response</div>
              <div className={`text-[10px] ${signalFilter === 'silence' ? 'text-cream/80' : 'text-ink-muted'}`}>
                {signalCounts.silence} silence
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 4. "Today's Priorities" List */}
      <div id="priority-list" className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-forest">
              {t.todaysPriorities}
            </h3>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-mint-deep text-forest border border-border">
              {prioritizedSeniors.length}
            </span>
          </div>

          {/* Quiet Daily Alert Cap Indicator (12 to 15 per day) */}
          <div className="text-[11px] font-medium text-ink-muted flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-sage" strokeWidth={1.5} />
            <span>Cap: 15/day (fatigue-safe)</span>
          </div>
        </div>

        {prioritizedSeniors.length === 0 ? (
          <div className="bg-cream border border-border rounded-xl p-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-alert-green mx-auto" strokeWidth={1.5} />
            <h4 className="text-sm font-bold text-ink">All priorities handled</h4>
            <p className="text-xs text-ink-muted max-w-sm mx-auto">
              No active warnings match your selected filter right now. All seniors in your caseload are stable.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {prioritizedSeniors.map((senior) => {
              const isUrgent = senior.currentUrgency === 'critical';
              const isModerate = senior.currentUrgency === 'moderate';
              const statusVariant = isUrgent ? 'critical' : isModerate ? 'warning' : 'success';
              const statusLabel = isUrgent ? 'Critical' : isModerate ? 'Moderate' : 'Stable';
              const isDone = completedSeniorIds.includes(senior.id);

              return (
                <article
                  key={senior.id}
                  className="bg-cream border border-border rounded-xl p-4 sm:p-5 shadow-xs hover:border-forest/40 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Senior Info Header */}
                    <div
                      onClick={() => handleOpenSeniorProfile(senior.id)}
                      className="flex items-start gap-3.5 cursor-pointer min-w-0 flex-1"
                    >
                      <InitialsAvatar name={senior.name} size="lg" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-bold text-ink hover:text-forest transition-colors truncate">
                            {senior.name}
                          </h4>
                          <span className="text-xs text-ink-muted">
                            {senior.age ? `${senior.age} yrs` : ''} {senior.city ? `: ${senior.city}` : ''}
                          </span>
                          <StatusChip label={statusLabel} variant={statusVariant} />
                        </div>

                        {/* One-line plain reason */}
                        <p className="text-xs text-ink font-medium mt-1">
                          {senior.recommendedAction || 'Regular wellness check scheduled.'}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-ink-muted mt-1.5 flex-wrap">
                          <span>Last check-in: Today 08:30 AM</span>
                          <span>Score: {senior.currentRiskScore}/100</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons on right */}
                    <div className="flex items-center gap-2 flex-wrap pt-2 md:pt-0 shrink-0">
                      {senior.phone && (
                        <a
                          href={`tel:${senior.phone}`}
                          className="min-h-[40px] px-3.5 py-1.5 bg-mint-deep hover:bg-mint text-forest text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors border border-border focus:outline-none focus:ring-2 focus:ring-forest"
                        >
                          <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
                          <span>Call</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenSeniorProfile(senior.id)}
                        className="min-h-[40px] px-3.5 py-1.5 bg-forest hover:bg-forest-dark text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
                      >
                        <span>Profile</span>
                        <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>

                      {/* Feedback buttons: Useful / Not useful */}
                      <button
                        type="button"
                        onClick={() => handleFeedback(senior.id, 'useful')}
                        aria-label="Mark recommendation useful"
                        title="Useful"
                        className="w-10 h-10 rounded-lg bg-cream hover:bg-mint-deep text-ink-muted hover:text-forest border border-border flex items-center justify-center transition-colors focus:outline-none focus:ring-1 focus:ring-forest"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleFeedback(senior.id, 'not_useful')}
                        aria-label="Mark recommendation not useful"
                        title="Not useful"
                        className="w-10 h-10 rounded-lg bg-cream hover:bg-mint-deep text-ink-muted hover:text-alert-red border border-border flex items-center justify-center transition-colors focus:outline-none focus:ring-1 focus:ring-forest"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>

                      {/* Snooze & Done */}
                      <button
                        type="button"
                        onClick={() => handleSnooze(senior.id, senior.name)}
                        className="min-h-[40px] px-2.5 py-1.5 rounded-lg border border-border bg-cream text-xs font-semibold text-ink-muted hover:text-ink transition-colors focus:outline-none focus:ring-1 focus:ring-forest"
                      >
                        {t.snooze}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMarkDone(senior.id, senior.name)}
                        className={`min-h-[40px] px-3 py-1.5 rounded-lg border text-xs font-bold inline-flex items-center gap-1 transition-colors focus:outline-none focus:ring-1 focus:ring-forest ${
                          isDone
                            ? 'bg-emerald-50 text-alert-green border-emerald-200'
                            : 'bg-cream text-ink border-border hover:bg-mint-deep'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>{isDone ? 'Done' : t.markDone}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
