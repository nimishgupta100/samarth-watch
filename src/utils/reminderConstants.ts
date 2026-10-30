/**
 * Configurable thresholds for the medicine reminder escalation system.
 * Change these values for testing or to adjust escalation timing.
 * In production, these would come from a backend configuration API.
 */
export const REMINDER_INTERVAL_MS = 5 * 60 * 1000;      // 5 minutes: interval between senior reminders
export const FAMILY_ESCALATION_MS = 30 * 60 * 1000;     // 30 minutes: when to notify family
export const DOSE_MISSED_CUTOFF_MS = 2 * 60 * 60 * 1000; // 2 hours: mark as missed for coordinator
export const SNOOZE_DURATION_MS = 5 * 60 * 1000;         // 5 minutes: snooze duration when senior presses "Not yet"
