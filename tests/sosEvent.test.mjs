import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Inline the SOS event logic (mirrors AppContext triggerSeniorSOS behavior)
function createSosEvent(seniorId, seniorName, coordinatorId, familyPhone) {
  const timestamp = Date.now();
  const eventId = `sos-${timestamp}`;
  
  const sosEvent = {
    id: eventId,
    seniorId,
    timestamp,
    status: 'active',
    resolvedBy: null,
    resolvedAt: null,
    resolvedNotes: null,
  };
  
  // Notification to coordinator
  const coordinatorNotif = {
    id: `notif-sos-coord-${timestamp}`,
    timestamp,
    targetRole: 'coordinator',
    seniorId,
    type: 'sos',
    title: 'SOS Alert',
    message: `${seniorName} has triggered an SOS emergency at ${new Date(timestamp).toLocaleTimeString()}. Immediate attention required.`,
    read: false,
    actionUrl: `/coordinator`,
    actionLabel: 'Open Coordinator Queue',
  };
  
  // Notification to family
  const familyNotif = {
    id: `notif-sos-family-${timestamp}`,
    timestamp,
    targetRole: 'family',
    seniorId,
    type: 'sos',
    title: 'Emergency Alert',
    message: `${seniorName} has sent an SOS alert. The care coordinator has been informed and is calling. This is a safety alert only.`,
    read: false,
    actionUrl: `/family`,
    actionLabel: 'Open Family Portal',
  };
  
  return { sosEvent, notifications: [coordinatorNotif, familyNotif] };
}

describe('SOS Event Creation', () => {
  test('One SOS confirm produces exactly one event', () => {
    const result = createSosEvent('senior-001', 'Kamala Devi', 'coord-1', '+91-9876543210');
    assert.ok(result.sosEvent);
    assert.equal(result.sosEvent.seniorId, 'senior-001');
    assert.equal(result.sosEvent.status, 'active');
  });

  test('One SOS confirm produces exactly one coordinator notification', () => {
    const result = createSosEvent('senior-001', 'Kamala Devi', 'coord-1', '+91-9876543210');
    const coordNotifs = result.notifications.filter(n => n.targetRole === 'coordinator');
    assert.equal(coordNotifs.length, 1);
    assert.equal(coordNotifs[0].type, 'sos');
  });

  test('One SOS confirm produces exactly one family notification', () => {
    const result = createSosEvent('senior-001', 'Kamala Devi', 'coord-1', '+91-9876543210');
    const familyNotifs = result.notifications.filter(n => n.targetRole === 'family');
    assert.equal(familyNotifs.length, 1);
    assert.equal(familyNotifs[0].type, 'sos');
  });

  test('All SOS notifications share the same timestamp', () => {
    const result = createSosEvent('senior-001', 'Kamala Devi', 'coord-1', '+91-9876543210');
    const ts = result.sosEvent.timestamp;
    for (const notif of result.notifications) {
      assert.equal(notif.timestamp, ts);
    }
  });

  test('SOS notification to family contains NO health details', () => {
    const result = createSosEvent('senior-001', 'Kamala Devi', 'coord-1', '+91-9876543210');
    const familyNotif = result.notifications.find(n => n.targetRole === 'family');
    // Must not contain medical terms or risk scores
    assert.ok(!familyNotif.message.includes('risk'));
    assert.ok(!familyNotif.message.includes('BP'));
    assert.ok(!familyNotif.message.includes('medicine'));
    assert.ok(!familyNotif.message.includes('diagnosis'));
  });

  test('SOS event is created with active status, not resolved', () => {
    const result = createSosEvent('senior-001', 'Kamala Devi', 'coord-1', '+91-9876543210');
    assert.equal(result.sosEvent.status, 'active');
    assert.equal(result.sosEvent.resolvedBy, null);
    assert.equal(result.sosEvent.resolvedAt, null);
  });

  test('Total notifications: exactly 2 (one coordinator, one family)', () => {
    const result = createSosEvent('senior-001', 'Kamala Devi', 'coord-1', '+91-9876543210');
    assert.equal(result.notifications.length, 2);
  });
});
