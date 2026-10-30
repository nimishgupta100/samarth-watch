import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateDoseState,
  markDoseTakenBySenior,
  snoozeDose,
  confirmDoseByFamily
} from '../src/utils/reminderEscalation.ts';
import { MedicineDose } from '../src/types/shared.ts';

const BASE_TIME = 1761709200000; // scheduled time: e.g. 09:00:00 AM

function createBaseDose(): MedicineDose {
  return {
    id: 'dose-test-1',
    medicineName: 'Amlodipine 5mg',
    dosageInstructions: '1 tablet, with breakfast',
    scheduledTime: '09:00 AM',
    scheduledTimestamp: BASE_TIME,
    status: 'upcoming',
    remindedCount: 0,
  };
}

test('1. Reminder at 5, 10, and 15 minutes', () => {
  let dose = createBaseDose();

  // At scheduled time (0 minutes)
  let result = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME);
  assert.equal(result.updatedDose.status, 'due');
  assert.equal(result.updatedDose.remindedCount, 1);
  assert.equal(result.notifications.length, 1);
  assert.equal(result.notifications[0].targetRole, 'senior');
  dose = result.updatedDose;

  // At +4 minutes (should not trigger new reminder yet)
  result = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 4 * 60 * 1000);
  assert.equal(result.updatedDose.remindedCount, 1);
  assert.equal(result.notifications.length, 0);

  // At +5 minutes (reminder #2)
  result = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 5 * 60 * 1000);
  assert.equal(result.updatedDose.remindedCount, 2);
  assert.equal(result.updatedDose.status, 'reminded');
  assert.equal(result.notifications.length, 1);
  dose = result.updatedDose;

  // At +10 minutes (reminder #3)
  result = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 10 * 60 * 1000);
  assert.equal(result.updatedDose.remindedCount, 3);
  assert.equal(result.notifications.length, 1);
  dose = result.updatedDose;

  // At +15 minutes (reminder #4)
  result = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 15 * 60 * 1000);
  assert.equal(result.updatedDose.remindedCount, 4);
  assert.equal(result.notifications.length, 1);
});

test('2. Family and Coordinator notified at 30 minutes', () => {
  let dose = createBaseDose();
  // Simulate dose evaluated at +30 minutes
  const result = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 30 * 60 * 1000);

  assert.equal(result.updatedDose.status, 'family_notified');
  assert.ok(result.updatedDose.familyNotifiedTimestamp);

  // Both family and coordinator must receive notification
  const familyNotif = result.notifications.find(n => n.targetRole === 'family');
  const coordNotif = result.notifications.find(n => n.targetRole === 'coordinator');

  assert.ok(familyNotif, 'Family must receive notification at 30 minutes');
  assert.ok(coordNotif, 'Coordinator must receive notification at 30 minutes');
  assert.match(familyNotif.message, /Please call to check/);
  assert.match(coordNotif.message, /exceeded 30 minutes/);
});

test('3. Stop reminders when senior marks dose as taken, and resolve family if notified earlier', () => {
  let dose = createBaseDose();

  // Escalate to family notified at +30 minutes
  let res30 = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 30 * 60 * 1000);
  dose = res30.updatedDose;

  // Senior takes medicine at +35 minutes
  const takenRes = markDoseTakenBySenior(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 35 * 60 * 1000);
  assert.equal(takenRes.updatedDose.status, 'taken');
  assert.equal(takenRes.updatedDose.confirmedBy, 'senior');
  assert.equal(takenRes.updatedDose.takenTimestamp, BASE_TIME + 35 * 60 * 1000);

  // Resolution notification sent to family
  const familyResolvedNotif = takenRes.notifications.find(n => n.targetRole === 'family');
  assert.ok(familyResolvedNotif, 'Family must receive resolution notification');
  assert.match(familyResolvedNotif.message, /confirmed taking the 09:00 AM medicine/);

  // Subsequent evaluations must not fire any reminders
  const afterTaken = evaluateDoseState(takenRes.updatedDose, 'senior-1', 'Savitri Devi', BASE_TIME + 60 * 60 * 1000);
  assert.equal(afterTaken.updatedDose.status, 'taken');
  assert.equal(afterTaken.notifications.length, 0);
});

test('4. Snooze behavior (+5 minutes snooze) does not block 30m escalation', () => {
  let dose = createBaseDose();
  // Trigger initial reminder at 0m
  dose = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME).updatedDose;

  // Senior taps Snooze at +2 minutes
  const snoozeTime = BASE_TIME + 2 * 60 * 1000;
  dose = snoozeDose(dose, snoozeTime);
  assert.equal(dose.status, 'snoozed');
  assert.equal(dose.snoozedUntilTimestamp, snoozeTime + 5 * 60 * 1000);

  // At +5 minutes (still within snooze window until +7m), no reminder
  let res5 = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 5 * 60 * 1000);
  assert.equal(res5.notifications.length, 0);

  // At +30 minutes, 30m escalation STILL triggers regardless of snooze
  let res30 = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 30 * 60 * 1000);
  assert.equal(res30.updatedDose.status, 'family_notified');
  assert.ok(res30.notifications.some(n => n.targetRole === 'family'));
});

test('5. 2-hour cutoff rule marks dose as missed', () => {
  let dose = createBaseDose();

  // Evaluate at +2 hours (120 minutes)
  const result = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 120 * 60 * 1000);

  assert.equal(result.updatedDose.status, 'missed');
  const coordMissedNotif = result.notifications.find(n => n.targetRole === 'coordinator');
  assert.ok(coordMissedNotif, 'Coordinator must receive missed notification');
  assert.match(coordMissedNotif.message, /Marked as missed/);
});

test('6. Behavior after page reload (pure timestamp comparison)', () => {
  // Simulate saving to localStorage and re-reading state on a new page load
  const originalDose = createBaseDose();
  const serialized = JSON.stringify(originalDose);
  const reloadedDose: MedicineDose = JSON.parse(serialized);

  // If reloaded at +45 minutes after scheduled time
  const reloadTime = BASE_TIME + 45 * 60 * 1000;
  const result = evaluateDoseState(reloadedDose, 'senior-1', 'Savitri Devi', reloadTime);

  // Pure mathematical timestamp comparison correctly flags 30m escalation without needing runtime timers
  assert.equal(result.updatedDose.status, 'family_notified');
  assert.ok(result.notifications.some(n => n.targetRole === 'family'));
});

test('7. Confirmation by family ("I spoke to them, they took it")', () => {
  let dose = createBaseDose();
  dose.status = 'family_notified';
  dose.familyNotifiedTimestamp = BASE_TIME + 30 * 60 * 1000;

  const confirmed = confirmDoseByFamily(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 32 * 60 * 1000);
  assert.equal(confirmed.updatedDose.status, 'taken');
  assert.equal(confirmed.updatedDose.confirmedBy, 'family');
  assert.ok(confirmed.notifications.some(n => n.targetRole === 'coordinator'));
});
