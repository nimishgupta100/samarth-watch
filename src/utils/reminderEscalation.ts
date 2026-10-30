import { MedicineDose, DoseStatus, AppNotification } from '../types/shared';
import { REMINDER_INTERVAL_MS, FAMILY_ESCALATION_MS, DOSE_MISSED_CUTOFF_MS, SNOOZE_DURATION_MS } from './reminderConstants';

export interface EscalationCheckResult {
  updatedDoses: MedicineDose[];
  newNotifications: AppNotification[];
  alertTriggeredForFamily: boolean;
  alertTriggeredForCoordinator: boolean;
}

/**
 * Pure evaluation function for a single medicine dose at a given timestamp.
 * Returns the new status, updated dose object, and any notifications to emit.
 */
export function evaluateDoseState(
  dose: MedicineDose,
  seniorId: string,
  seniorName: string,
  currentTime: number
): {
  updatedDose: MedicineDose;
  notifications: AppNotification[];
} {
  // If already taken or missed, no further transitions
  if (dose.status === 'taken' || dose.status === 'missed') {
    return { updatedDose: dose, notifications: [] };
  }

  const notifications: AppNotification[] = [];
  const elapsedSinceScheduled = currentTime - dose.scheduledTimestamp;

  // Not due yet
  if (elapsedSinceScheduled < 0) {
    return { updatedDose: dose, notifications: [] };
  }

  // 1. Two-hour cutoff rule: marked missed and logged for coordinator
  if (elapsedSinceScheduled >= DOSE_MISSED_CUTOFF_MS) {
    const updatedDose: MedicineDose = {
      ...dose,
      status: 'missed',
    };

    notifications.push({
      id: `notif-missed-${dose.id}-${currentTime}`,
      timestamp: currentTime,
      targetRole: 'coordinator',
      seniorId,
      type: 'medicine_escalation',
      title: 'Medicine Dose Missed',
      message: `${seniorName} has not taken the ${dose.scheduledTime} dose (${dose.medicineName}) within 2 hours. Marked as missed.`,
      read: false,
      actionUrl: `/senior/${seniorId}`,
      actionLabel: 'Review Caseload',
    });

    return { updatedDose, notifications };
  }

  // Check snooze window
  const isSnoozed = dose.snoozedUntilTimestamp && currentTime < dose.snoozedUntilTimestamp;

  // 2. Thirty minute rule: notify linked family and coordinator if not confirmed
  let currentStatus: DoseStatus = dose.status;
  let familyNotifiedTimestamp = dose.familyNotifiedTimestamp;

  if (elapsedSinceScheduled >= FAMILY_ESCALATION_MS && !dose.familyNotifiedTimestamp) {
    familyNotifiedTimestamp = currentTime;
    currentStatus = 'family_notified';

    // Factual calm notification to family
    notifications.push({
      id: `notif-family-30m-${dose.id}-${currentTime}`,
      timestamp: currentTime,
      targetRole: 'family',
      seniorId,
      type: 'medicine_escalation',
      title: 'Medicine Check Needed',
      message: `${seniorName} has not confirmed the ${dose.scheduledTime} medicine (${dose.medicineName}) yet. Please call to check.`,
      read: false,
      actionUrl: '/family',
      actionLabel: 'Open Family Portal',
    });

    // Notify coordinator at the exact same moment
    notifications.push({
      id: `notif-coord-30m-${dose.id}-${currentTime}`,
      timestamp: currentTime,
      targetRole: 'coordinator',
      seniorId,
      type: 'medicine_escalation',
      title: 'Dose Confirmation Delayed',
      message: `${seniorName} unconfirmed dose (${dose.medicineName}, ${dose.scheduledTime}) exceeded 30 minutes. Family notified.`,
      read: false,
      actionUrl: `/senior/${seniorId}`,
      actionLabel: 'Review Patient',
    });
  }

  // 3. 5-minute reminder logic to the senior
  let lastRemindedTimestamp = dose.lastRemindedTimestamp;
  let remindedCount = dose.remindedCount;

  const timeSinceLastReminder = lastRemindedTimestamp ? currentTime - lastRemindedTimestamp : Infinity;

  if (!isSnoozed && timeSinceLastReminder >= REMINDER_INTERVAL_MS) {
    lastRemindedTimestamp = currentTime;
    remindedCount += 1;
    if (currentStatus === 'upcoming') {
      currentStatus = 'due';
    } else if (currentStatus !== 'family_notified') {
      currentStatus = 'reminded';
    }

    notifications.push({
      id: `notif-senior-remind-${dose.id}-${currentTime}`,
      timestamp: currentTime,
      targetRole: 'senior',
      seniorId,
      type: 'medicine_reminder',
      title: 'Medicine Reminder',
      message: `It is time to take your ${dose.medicineName} (${dose.dosageInstructions}).`,
      read: false,
      actionUrl: '/senior-home',
      actionLabel: 'Open Medicine Screen',
    });
  }

  const updatedDose: MedicineDose = {
    ...dose,
    status: currentStatus,
    familyNotifiedTimestamp,
    lastRemindedTimestamp,
    remindedCount,
  };

  return { updatedDose, notifications };
}

/**
 * Marks dose as taken by the senior.
 * Stops reminders, and if family was notified earlier, notifies family of resolution.
 */
export function markDoseTakenBySenior(
  dose: MedicineDose,
  seniorId: string,
  seniorName: string,
  currentTime: number
): {
  updatedDose: MedicineDose;
  notifications: AppNotification[];
} {
  const notifications: AppNotification[] = [];

  const wasFamilyNotifiedEarlier = Boolean(dose.familyNotifiedTimestamp);

  const updatedDose: MedicineDose = {
    ...dose,
    status: 'taken',
    takenTimestamp: currentTime,
    confirmedBy: 'senior',
    snoozedUntilTimestamp: undefined,
  };

  if (wasFamilyNotifiedEarlier) {
    notifications.push({
      id: `notif-family-resolved-${dose.id}-${currentTime}`,
      timestamp: currentTime,
      targetRole: 'family',
      seniorId,
      type: 'medicine_reminder',
      title: 'Medicine Taken',
      message: `${seniorName} has confirmed taking the ${dose.scheduledTime} medicine (${dose.medicineName}). Everything is on track.`,
      read: false,
      actionUrl: '/family',
      actionLabel: 'View Status',
    });
  }

  return { updatedDose, notifications };
}

/**
 * Snoozes next reminder for 5 minutes.
 * Does NOT stop the 30-minute family escalation rule.
 */
export function snoozeDose(
  dose: MedicineDose,
  currentTime: number
): MedicineDose {
  return {
    ...dose,
    status: dose.status === 'family_notified' ? 'family_notified' : 'snoozed',
    snoozedUntilTimestamp: currentTime + SNOOZE_DURATION_MS,
  };
}

/**
 * Confirmed by family ("I spoke to them, they took it").
 * Clears the family escalation banner without silently masquerading as a direct senior self-tick.
 */
export function confirmDoseByFamily(
  dose: MedicineDose,
  seniorId: string,
  seniorName: string,
  currentTime: number
): {
  updatedDose: MedicineDose;
  notifications: AppNotification[];
} {
  const updatedDose: MedicineDose = {
    ...dose,
    status: 'taken',
    takenTimestamp: currentTime,
    confirmedBy: 'family',
    snoozedUntilTimestamp: undefined,
  };

  const notifications: AppNotification[] = [
    {
      id: `notif-family-confirmed-${dose.id}-${currentTime}`,
      timestamp: currentTime,
      targetRole: 'coordinator',
      seniorId,
      type: 'medicine_reminder',
      title: 'Dose Confirmed by Family',
      message: `Family confirmed speaking with ${seniorName}; ${dose.medicineName} reported taken.`,
      read: false,
      actionUrl: `/senior/${seniorId}`,
      actionLabel: 'View Patient',
    },
  ];

  return { updatedDose, notifications };
}
