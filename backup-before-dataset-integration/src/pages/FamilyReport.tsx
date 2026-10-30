import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import {
  ArrowLeft,
  Printer,
  Download,
  Bell,
  Lock,
  Pill,
  Heart,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Clock,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export const FamilyReport: React.FC = () => {
  usePageTitle(
    'Family Health Report - Samarth Watch',
    'Comprehensive daily and weekly wellbeing reports for family members.'
  );

  const {
    selectedSenior,
    doses,
    appointments,
    healthReadings,
    voiceNotes,
    sosEvents,
    todayCheckinAnswer,
    virtualTime,
  } = useApp();

  const { showToast } = useToast();

  const [period, setPeriod] = useState<'daily' | 'weekly'>('weekly');
  const [autoSend, setAutoSend] = useState<boolean>(() => {
    return localStorage.getItem('samarth_auto_report_enabled') === 'true';
  });

  const toggleAutoSend = () => {
    const nextVal = !autoSend;
    setAutoSend(nextVal);
    localStorage.setItem('samarth_auto_report_enabled', nextVal ? 'true' : 'false');
    if (nextVal) {
      showToast(
        'Automatic report updates enabled. You will receive recurring summaries in the portal.',
        'success'
      );
    } else {
      showToast('Automatic report updates paused.', 'info');
    }
  };

  // 7-day cutoff for weekly, 24h cutoff for daily
  const periodCutoff = useMemo(() => {
    const ms = period === 'daily' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    return virtualTime - ms;
  }, [period, virtualTime]);

  // Filtered data by period
  const periodDoses = useMemo(() => {
    return doses.filter(
      (d) => d.scheduledTimestamp >= periodCutoff && d.scheduledTimestamp <= virtualTime + 86400000
    );
  }, [doses, periodCutoff, virtualTime]);

  const periodReadings = useMemo(() => {
    return healthReadings.filter((r) => r.timestamp >= periodCutoff);
  }, [healthReadings, periodCutoff]);

  const periodVoiceNotes = useMemo(() => {
    return voiceNotes.filter(
      (vn) => vn.seniorId === selectedSenior.id && vn.timestamp >= periodCutoff
    );
  }, [voiceNotes, selectedSenior.id, periodCutoff]);

  const periodSosEvents = useMemo(() => {
    return sosEvents.filter(
      (e) => e.seniorId === selectedSenior.id && e.timestamp >= periodCutoff
    );
  }, [sosEvents, selectedSenior.id, periodCutoff]);

  const periodAppointments = useMemo(() => {
    return appointments.filter((a) => a.seniorId === selectedSenior.id);
  }, [appointments, selectedSenior.id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const reportDate = new Date(virtualTime).toISOString().slice(0, 10);
    const content = `SAMARTH WATCH : FAMILY HEALTH & WELLBEING REPORT
Generated: ${new Date(virtualTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
Period: ${period === 'daily' ? 'Daily (Past 24 Hours)' : 'Weekly (Past 7 Days)'}
Senior: ${selectedSenior.name} (Age: ${selectedSenior.age ? `${selectedSenior.age} years` : 'Not added yet'}, City: ${selectedSenior.city || 'Not added yet'})
Living Situation: ${selectedSenior.livingSituation || 'Not added yet'}
Care Coordinator: ${selectedSenior.assignedCoordinatorName || 'Not added yet'}
Emergency Contact: ${selectedSenior.emergencyContactName || 'Not added yet'} (${selectedSenior.emergencyContactPhone || 'Not added yet'})

-----------------------------------------------------------------
1. MEDICINE SCHEDULE & ADHERENCE
-----------------------------------------------------------------
${
  periodDoses.length === 0
    ? 'No medicine records logged in this period.'
    : periodDoses
        .map(
          (d) =>
            `- ${d.medicineName} (${d.scheduledTime}): Status: ${d.status.toUpperCase()} ${
              d.confirmedBy ? `[Confirmed by ${d.confirmedBy}]` : ''
            }`
        )
        .join('\n')
}

-----------------------------------------------------------------
2. HEALTH READINGS VS PERSONAL BASELINE
-----------------------------------------------------------------
${
  selectedSenior.baseline
    ? `Personal Baseline Reference:
- Systolic BP: ${selectedSenior.baseline.systolicBp} mmHg (SD: +/-${selectedSenior.baseline.systolicBpSd})
- Diastolic BP: ${selectedSenior.baseline.diastolicBp} mmHg (SD: +/-${selectedSenior.baseline.diastolicBpSd})
- Fasting Blood Sugar: ${selectedSenior.baseline.fastingSugar} mg/dL
- Blood Oxygen (SpO2): ${selectedSenior.baseline.spo2}%
- Pulse: ${selectedSenior.baseline.pulse} bpm`
    : `Personal Baseline Reference:
- Baseline not established yet. Historical vitals will be logged during routine check-ins.`
}

Logged Readings:
${
  periodReadings.length === 0
    ? 'No manual readings logged in this period. Wearable baseline tracking remains within normal limits.'
    : periodReadings
        .map(
          (r) =>
            `- ${r.type.toUpperCase()}: ${r.value}${r.valueSecondary ? '/' + r.valueSecondary : ''} ${r.unit} (${new Date(
              r.timestamp
            ).toLocaleDateString()})`
        )
        .join('\n')
}

-----------------------------------------------------------------
3. DAILY CHECK-IN SUMMARY
-----------------------------------------------------------------
${
  todayCheckinAnswer
    ? `Sleep Quality: ${todayCheckinAnswer.q1 ? todayCheckinAnswer.q1 + '/5' : 'Reported Restful'}
Appetite: ${todayCheckinAnswer.q2 ? todayCheckinAnswer.q2 + '/5' : 'Normal Meals'}
Mobility / Energy: ${todayCheckinAnswer.q3 ? todayCheckinAnswer.q3 + '/5' : 'Active'}
Pain / Discomfort: ${todayCheckinAnswer.q4 ? todayCheckinAnswer.q4 + '/5' : 'None Reported'}`
    : 'Routine check-in call completed. No acute discomfort reported.'
}

-----------------------------------------------------------------
4. VOICE CHECK-IN SUMMARIES
-----------------------------------------------------------------
${
  periodVoiceNotes.length === 0
    ? 'No voice check-in recordings during this period.'
    : periodVoiceNotes
        .map(
          (vn) =>
            `- [${new Date(vn.timestamp).toLocaleDateString()}]: ${vn.plainSummary}`
        )
        .join('\n')
}

-----------------------------------------------------------------
5. ASSISTANCE & SOS LOG
-----------------------------------------------------------------
${
  periodSosEvents.length === 0
    ? 'No SOS or emergency assistance requests in this period.'
    : periodSosEvents
        .map(
          (e) =>
            `- [${new Date(e.timestamp).toLocaleTimeString()}]: Status: ${e.status}${
              e.cancelledBySenior ? ' (Cancelled by senior - false alarm)' : ''
            }`
        )
        .join('\n')
}

-----------------------------------------------------------------
6. UPCOMING APPOINTMENTS
-----------------------------------------------------------------
${
  periodAppointments.length === 0
    ? 'No appointments currently scheduled.'
    : periodAppointments
        .map(
          (a) =>
            `- ${a.type} on ${a.date} at ${a.slotTime} (Status: ${a.status})`
        )
        .join('\n')
}

=================================================================
IMPORTANT NOTICE:
This summary is for care coordination and family awareness only.
It is NOT a medical diagnosis and does NOT replace doctor consultation.
Samarth Care Coordinator Helpline: +91-9911001100
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `samarth-report-${selectedSenior.name.replace(/\s+/g, '-').toLowerCase()}-${reportDate}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Report text file downloaded.', 'success');
  };

  // Consent Gate
  if (!selectedSenior.familyConsentGranted) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <Link
          to="/family"
          className="inline-flex items-center gap-2 text-sm font-bold text-teal-400 hover:text-teal-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Family Overview
        </Link>

        <Card className="p-8 text-center space-y-4 max-w-xl mx-auto border-amber-200">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-300">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sharing Preferences are Set to Private</h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            {selectedSenior.name} has chosen to keep health reports and daily activity details private at this time.
            Samarth Watch strictly honors senior autonomy and privacy choices.
          </p>
          <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs text-amber-900 font-semibold text-left space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              Safety Safeguard Active:
            </div>
            <div>
              Emergency SOS alerts and urgent caregiver escalations are always delivered to you regardless of sharing preferences.
            </div>
          </div>
          <div className="pt-2">
            <Link to="/family">
              <Button variant="secondary">Return to Family Portal</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Back button & top bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link
          to="/family"
          className="inline-flex items-center gap-2 text-sm font-bold text-teal-400 hover:text-teal-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Family Overview
        </Link>

        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="inline-flex rounded-xl border border-slate-700/80 bg-slate-900/60 backdrop-blur-md p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setPeriod('daily')}
              className={`min-h-[40px] px-3 py-1.5 rounded-lg transition-colors ${
                period === 'daily'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Daily Report
            </button>
            <button
              type="button"
              onClick={() => setPeriod('weekly')}
              className={`min-h-[40px] px-3 py-1.5 rounded-lg transition-colors ${
                period === 'weekly'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Weekly Report
            </button>
          </div>

          {/* Print button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            aria-label="Print this report"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>

          {/* Download button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            aria-label="Download text report"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      </div>

      {/* Main Report Card */}
      <Card className="p-6 sm:p-8 space-y-6 border-slate-300">
        {/* Header Banner */}
        <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="teal">Caregiver Summary</Badge>
              <span className="text-xs text-slate-500 font-medium">
                {period === 'daily' ? 'Past 24 Hours' : 'Past 7 Days'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {selectedSenior.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Age: {selectedSenior.age ? `${selectedSenior.age} years` : 'Not added yet'} : City: {selectedSenior.city || 'Not added yet'} : Living Situation: {selectedSenior.livingSituation || 'Not added yet'}
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 space-y-1">
            <div>
              Coordinator: <strong className="text-slate-800">{selectedSenior.assignedCoordinatorName}</strong>
            </div>
            <div>
              Date: <strong className="text-slate-800">{new Date(virtualTime).toLocaleDateString('en-IN')}</strong>
            </div>
          </div>
        </div>

        {/* Auto-send toggle banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-teal-700 shrink-0" />
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                Send me this report automatically
              </span>
              <span className="text-xs text-slate-500 block">
                Receive recurring weekly digests in the family portal
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleAutoSend}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${
              autoSend
                ? 'bg-teal-700 text-white border-teal-700'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {autoSend ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>

        {/* Section 1: Medicine Adherence */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b pb-2 border-slate-100">
            <Pill className="w-5 h-5 text-teal-700" />
            <h2>Medicine Adherence</h2>
          </div>

          {periodDoses.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
              No medicine schedules recorded for this period.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {periodDoses.map((dose) => (
                <div
                  key={dose.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{dose.medicineName}</span>
                    <span className="text-slate-500 text-[11px] block">{dose.scheduledTime}</span>
                  </div>
                  <div>
                    {dose.status === 'taken' ? (
                      <Badge variant="green">Taken</Badge>
                    ) : dose.status === 'missed' ? (
                      <Badge variant="red">Missed</Badge>
                    ) : dose.status === 'snoozed' ? (
                      <Badge variant="amber">Snoozed</Badge>
                    ) : (
                      <Badge variant="default">Scheduled</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Vitals vs Baseline */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b pb-2 border-slate-100">
            <Heart className="w-5 h-5 text-rose-600" />
            <h2>Health Readings & Personal Baseline</h2>
          </div>

          {selectedSenior.baseline ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Systolic BP Baseline</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {selectedSenior.baseline.systolicBp} mmHg
                </span>
                <span className="text-[10px] text-slate-400">Normal Band: +/-10 mmHg</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Diastolic BP Baseline</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {selectedSenior.baseline.diastolicBp} mmHg
                </span>
                <span className="text-[10px] text-slate-400">Normal Band: +/-8 mmHg</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Fasting Sugar Baseline</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {selectedSenior.baseline.fastingSugar} mg/dL
                </span>
                <span className="text-[10px] text-slate-400">Normal: 90 - 130 mg/dL</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">SpO2 & Pulse Baseline</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {selectedSenior.baseline.spo2}% / {selectedSenior.baseline.pulse} bpm
                </span>
                <span className="text-[10px] text-slate-400">Stable range</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
              Baseline not established yet. Historical vitals will appear here once health readings are recorded.
            </p>
          )}

          {periodReadings.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-bold text-slate-700 block">Recent Logged Readings:</span>
              <div className="space-y-1">
                {periodReadings.map((r) => (
                  <div
                    key={r.id}
                    className="p-2 rounded bg-white border border-slate-200 text-xs flex items-center justify-between"
                  >
                    <span className="font-semibold text-slate-800 uppercase text-[11px]">
                      {r.type}
                    </span>
                    <span className="font-bold text-slate-900">
                      {r.value}
                      {r.valueSecondary ? '/' + r.valueSecondary : ''} {r.unit}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Daily Wellbeing Self-Reports */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b pb-2 border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2>Check-in & Wellbeing Observations</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200">
              <span className="text-emerald-800 font-semibold block text-[11px]">Sleep Pattern</span>
              <span className="text-slate-900 font-bold text-xs mt-1 block">
                {todayCheckinAnswer?.q1 ? `Rated ${todayCheckinAnswer.q1}/5` : 'Restful night'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200">
              <span className="text-emerald-800 font-semibold block text-[11px]">Appetite</span>
              <span className="text-slate-900 font-bold text-xs mt-1 block">
                {todayCheckinAnswer?.q2 ? `Rated ${todayCheckinAnswer.q2}/5` : 'Meals taken on time'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200">
              <span className="text-emerald-800 font-semibold block text-[11px]">Daily Energy</span>
              <span className="text-slate-900 font-bold text-xs mt-1 block">
                {todayCheckinAnswer?.q3 ? `Rated ${todayCheckinAnswer.q3}/5` : 'Active morning routine'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200">
              <span className="text-emerald-800 font-semibold block text-[11px]">Comfort & Joints</span>
              <span className="text-slate-900 font-bold text-xs mt-1 block">
                {todayCheckinAnswer?.q4 ? `Rated ${todayCheckinAnswer.q4}/5` : 'No acute joint pain'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Voice Note Summaries (Plain summary only, NO cues/transcripts/coordinatorId) */}
        {periodVoiceNotes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b pb-2 border-slate-100">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2>Voice Check-in Summaries</h2>
            </div>

            <div className="space-y-2">
              {periodVoiceNotes.map((vn) => (
                <div
                  key={vn.id}
                  className="p-3.5 rounded-lg bg-blue-50/40 border border-blue-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="font-bold text-slate-800">
                      Check-in recording ({vn.durationSeconds}s)
                    </span>
                    <span>
                      {new Date(vn.timestamp).toLocaleDateString()} at{' '}
                      {new Date(vn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {vn.plainSummary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Upcoming Appointments */}
        {periodAppointments.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b pb-2 border-slate-100">
              <Calendar className="w-5 h-5 text-teal-700" />
              <h2>Upcoming Appointments</h2>
            </div>

            <div className="space-y-2">
              {periodAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{appt.type} Visit</span>
                    <span className="text-slate-500 text-[11px] block">
                      {appt.date} : {appt.slotTime}
                    </span>
                  </div>
                  <Badge variant={appt.status === 'confirmed' ? 'green' : 'amber'}>
                    {appt.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clinical Disclaimer Footer */}
        <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            Care Coordination Disclosure
          </div>
          <p className="leading-relaxed">
            This report is prepared for elder care coordination and family awareness by Care Coordinator{' '}
            {selectedSenior.assignedCoordinatorName}. Samarth Watch never provides automated medical diagnoses,
            prescriptions, or dosage adjustments. In case of medical emergencies, dial 112 immediately.
          </p>
        </div>
      </Card>
    </div>
  );
};
