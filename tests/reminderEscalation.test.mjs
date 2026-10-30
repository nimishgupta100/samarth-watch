import test from 'node:test';
import assert from 'node:assert/strict';

// Constants matching reminderEscalation logic
const FIVE_MINUTES_MS = 5 * 60 * 1000;
const THIRTY_MINUTES_MS = 30 * 60 * 1000;
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

function evaluateDoseState(dose, seniorId, seniorName, currentTime) {
  if (dose.status === 'taken' || dose.status === 'missed') {
    return { updatedDose: dose, notifications: [] };
  }

  const notifications = [];
  const elapsedSinceScheduled = currentTime - dose.scheduledTimestamp;

  if (elapsedSinceScheduled < 0) {
    return { updatedDose: dose, notifications: [] };
  }

  // 1. Two-hour cutoff rule
  if (elapsedSinceScheduled >= TWO_HOURS_MS) {
    const updatedDose = {
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

  const isSnoozed = dose.snoozedUntilTimestamp && currentTime < dose.snoozedUntilTimestamp;

  // 2. Thirty minute rule
  let currentStatus = dose.status;
  let familyNotifiedTimestamp = dose.familyNotifiedTimestamp;

  if (elapsedSinceScheduled >= THIRTY_MINUTES_MS && !dose.familyNotifiedTimestamp) {
    familyNotifiedTimestamp = currentTime;
    currentStatus = 'family_notified';

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

  // 3. 5-minute reminder logic
  let lastRemindedTimestamp = dose.lastRemindedTimestamp;
  let remindedCount = dose.remindedCount;
  const timeSinceLastReminder = lastRemindedTimestamp ? currentTime - lastRemindedTimestamp : Infinity;

  if (!isSnoozed && timeSinceLastReminder >= FIVE_MINUTES_MS) {
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

  const updatedDose = {
    ...dose,
    status: currentStatus,
    familyNotifiedTimestamp,
    lastRemindedTimestamp,
    remindedCount,
  };

  return { updatedDose, notifications };
}

function markDoseTakenBySenior(dose, seniorId, seniorName, currentTime) {
  const notifications = [];
  const wasFamilyNotifiedEarlier = Boolean(dose.familyNotifiedTimestamp);

  const updatedDose = {
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

function snoozeDose(dose, currentTime) {
  return {
    ...dose,
    status: dose.status === 'family_notified' ? 'family_notified' : 'snoozed',
    snoozedUntilTimestamp: currentTime + FIVE_MINUTES_MS,
  };
}

function confirmDoseByFamily(dose, seniorId, seniorName, currentTime) {
  const updatedDose = {
    ...dose,
    status: 'taken',
    takenTimestamp: currentTime,
    confirmedBy: 'family',
    snoozedUntilTimestamp: undefined,
  };

  const notifications = [
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

const BASE_TIME = 1761709200000;

function createBaseDose() {
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

test('1. Reminder fires at 5, 10, and 15 minutes', () => {
  let dose = createBaseDose();

  // At 0m (scheduled)
  let res = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME);
  assert.equal(res.updatedDose.status, 'due');
  assert.equal(res.updatedDose.remindedCount, 1);
  assert.equal(res.notifications.length, 1);
  assert.equal(res.notifications[0].targetRole, 'senior');
  dose = res.updatedDose;

  // At +4m (too early)
  res = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 4 * 60 * 1000);
  assert.equal(res.updatedDose.remindedCount, 1);
  assert.equal(res.notifications.length, 0);

  // At +5m
  res = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 5 * 60 * 1000);
  assert.equal(res.updatedDose.remindedCount, 2);
  assert.equal(res.updatedDose.status, 'reminded');
  assert.equal(res.notifications.length, 1);
  dose = res.updatedDose;

  // At +10m
  res = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 10 * 60 * 1000);
  assert.equal(res.updatedDose.remindedCount, 3);
  assert.equal(res.notifications.length, 1);
  dose = res.updatedDose;

  // At +15m
  res = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 15 * 60 * 1000);
  assert.equal(res.updatedDose.remindedCount, 4);
  assert.equal(res.notifications.length, 1);
});

test('2. Family and Coordinator notified at 30 minutes', () => {
  let dose = createBaseDose();
  const res = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 30 * 60 * 1000);

  assert.equal(res.updatedDose.status, 'family_notified');
  assert.ok(res.updatedDose.familyNotifiedTimestamp);

  const familyNotif = res.notifications.find(n => n.targetRole === 'family');
  const coordNotif = res.notifications.find(n => n.targetRole === 'coordinator');

  assert.ok(familyNotif, 'Family notification emitted');
  assert.ok(coordNotif, 'Coordinator notification emitted');
  assert.match(familyNotif.message, /Please call to check/);
  assert.match(coordNotif.message, /exceeded 30 minutes/);
});

test('3. Stop reminders on taken by senior, and send resolution notification to family if notified earlier', () => {
  let dose = createBaseDose();
  let res30 = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 30 * 60 * 1000);
  dose = res30.updatedDose;

  const takenRes = markDoseTakenBySenior(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 35 * 60 * 1000);
  assert.equal(takenRes.updatedDose.status, 'taken');
  assert.equal(takenRes.updatedDose.confirmedBy, 'senior');

  const familyResolved = takenRes.notifications.find(n => n.targetRole === 'family');
  assert.ok(familyResolved, 'Family notified of resolution');
  assert.match(familyResolved.message, /confirmed taking the 09:00 AM medicine/);

  const afterTaken = evaluateDoseState(takenRes.updatedDose, 'senior-1', 'Savitri Devi', BASE_TIME + 60 * 60 * 1000);
  assert.equal(afterTaken.updatedDose.status, 'taken');
  assert.equal(afterTaken.notifications.length, 0);
});

test('4. Snooze (+5 min) delays reminder but does NOT prevent 30-min escalation', () => {
  let dose = createBaseDose();
  dose = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME).updatedDose;

  const snoozeTime = BASE_TIME + 2 * 60 * 1000;
  dose = snoozeDose(dose, snoozeTime);
  assert.equal(dose.status, 'snoozed');

  let res5 = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 5 * 60 * 1000);
  assert.equal(res5.notifications.length, 0);

  let res30 = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 30 * 60 * 1000);
  assert.equal(res30.updatedDose.status, 'family_notified');
  assert.ok(res30.notifications.some(n => n.targetRole === 'family'));
});

test('5. 2-hour cutoff rule marks dose as missed', () => {
  let dose = createBaseDose();
  const res = evaluateDoseState(dose, 'senior-1', 'Savitri Devi', BASE_TIME + 120 * 60 * 1000);

  assert.equal(res.updatedDose.status, 'missed');
  const coordNotif = res.notifications.find(n => n.targetRole === 'coordinator');
  assert.ok(coordNotif, 'Coordinator notified of missed dose');
  assert.match(coordNotif.message, /Marked as missed/);
});

test('6. Behavior after page reload (pure timestamp comparison)', () => {
  const original = createBaseDose();
  const reloaded = JSON.parse(JSON.stringify(original));

  const reloadTime = BASE_TIME + 45 * 60 * 1000;
  const res = evaluateDoseState(reloaded, 'senior-1', 'Savitri Devi', reloadTime);

  assert.equal(res.updatedDose.status, 'family_notified');
  assert.ok(res.notifications.some(n => n.targetRole === 'family'));
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


// ---------------------------------------------------------------------------
// Additional tests for Change 2 requirements
// Aliases for the helper functions used above
// ---------------------------------------------------------------------------
const makeDose = createBaseDose;
const evalDose = evaluateDoseState;
const markDoseTaken = markDoseTakenBySenior;
const confirmByFamily = confirmDoseByFamily;

import { describe } from 'node:test';

describe('NO family notification when taken before 30 minutes', () => {
  test('Senior takes dose at 10 minutes - family gets NO notification', () => {
    const now = BASE_TIME;
    const dose = makeDose(now);
    
    // Mark as taken at 10 minutes (before 30-min escalation)
    const takenAt = now + 10 * 60 * 1000;
    const { updatedDose, notifications } = markDoseTaken(dose, 'senior-001', 'Test User', takenAt);
    
    assert.equal(updatedDose.status, 'taken');
    // No family notification should be sent (family was NOT notified before this)
    const familyNotifs = notifications.filter(n => n.targetRole === 'family');
    assert.equal(familyNotifs.length, 0, 'Family must not be notified when senior takes before 30 min');
  });

  test('Senior takes dose at 25 minutes - family gets NO notification', () => {
    const now = BASE_TIME;
    const dose = makeDose(now);
    
    const takenAt = now + 25 * 60 * 1000;
    const { updatedDose, notifications } = markDoseTaken(dose, 'senior-001', 'Test User', takenAt);
    
    assert.equal(updatedDose.status, 'taken');
    const familyNotifs = notifications.filter(n => n.targetRole === 'family');
    assert.equal(familyNotifs.length, 0, 'Family must not be notified when senior takes at 25 min');
  });

  test('Family IS notified at exactly 30 minutes when dose not taken', () => {
    const now = BASE_TIME;
    const dose = makeDose(now);
    
    // Evaluate at 30 minutes
    const checkAt = now + 30 * 60 * 1000;
    const { notifications } = evalDose(dose, 'senior-001', 'Test User', checkAt);
    
    const familyNotifs = notifications.filter(n => n.targetRole === 'family');
    assert.equal(familyNotifs.length, 1, 'Family must be notified at 30 min');
  });
});

describe('Family banner cleared after family confirmed', () => {
  test('Family confirms dose - coordinator gets confirmation notification', () => {
    const now = BASE_TIME;
    const dose = makeDose(now);
    
    // First: advance to 30 min so family was notified
    const thirtyMin = now + 30 * 60 * 1000;
    const { updatedDose: doseFamilyNotified } = evalDose(dose, 'senior-001', 'Test User', thirtyMin);
    
    // Then: family confirms
    const { updatedDose: doseConfirmed, notifications } = confirmByFamily(doseFamilyNotified, 'senior-001', 'Test User', thirtyMin + 5 * 60 * 1000);
    
    assert.equal(doseConfirmed.status, 'taken');
    assert.equal(doseConfirmed.confirmedBy, 'family');
    
    // Coordinator should be notified of family confirmation
    const coordNotifs = notifications.filter(n => n.targetRole === 'coordinator');
    assert.equal(coordNotifs.length, 1);
  });
});
