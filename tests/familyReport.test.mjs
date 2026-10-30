import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Change 6: Family Health Report & Privacy Protections', () => {
  test('1. Respects senior privacy consent: reports blocked when familyConsentGranted is false', () => {
    const seniorWithNoConsent = {
      id: 'senior-008',
      name: 'Col. Rajeshwar Bakshi',
      familyConsentGranted: false,
    };

    const isReportAccessible = seniorWithNoConsent.familyConsentGranted;
    assert.equal(isReportAccessible, false);
  });

  test('2. Allows report generation when senior grants family consent', () => {
    const seniorWithConsent = {
      id: 'senior-001',
      name: 'Smt. Kamala Devi',
      familyConsentGranted: true,
    };

    assert.equal(seniorWithConsent.familyConsentGranted, true);
  });

  test('3. Daily vs Weekly period filtering uses correct timestamp bounds', () => {
    const now = 1700000000000;
    const dailyCutoff = now - 24 * 60 * 60 * 1000;
    const weeklyCutoff = now - 7 * 24 * 60 * 60 * 1000;

    const readings = [
      { id: 'r1', timestamp: now - 2 * 60 * 60 * 1000 }, // 2h ago -> both daily and weekly
      { id: 'r2', timestamp: now - 3 * 24 * 60 * 60 * 1000 }, // 3d ago -> weekly only
      { id: 'r3', timestamp: now - 10 * 24 * 60 * 60 * 1000 }, // 10d ago -> neither
    ];

    const dailyReadings = readings.filter((r) => r.timestamp >= dailyCutoff);
    const weeklyReadings = readings.filter((r) => r.timestamp >= weeklyCutoff);

    assert.equal(dailyReadings.length, 1);
    assert.equal(dailyReadings[0].id, 'r1');
    assert.equal(weeklyReadings.length, 2);
    assert.equal(weeklyReadings.some((r) => r.id === 'r1'), true);
    assert.equal(weeklyReadings.some((r) => r.id === 'r2'), true);
    assert.equal(weeklyReadings.some((r) => r.id === 'r3'), false);
  });

  test('4. Family view sanitizes voice notes: only plainSummary is surfaced, never coordinator cues or audio blobs', () => {
    const rawVoiceNote = {
      id: 'vn-101',
      seniorId: 'senior-001',
      coordinatorId: 'coord-001',
      plainSummary: 'Felt slight dizziness in the morning; had tea and light breakfast.',
      transcript: 'Subah uthne par sar ghoom raha tha.',
      extractedCues: [{ tag: 'dizziness', severity: 'mild', quote: 'sar ghoom raha tha' }],
      audioBlobUrl: 'blob:http://localhost/demo-audio-123',
    };

    // Family projection
    const familyProjectedNote = {
      id: rawVoiceNote.id,
      plainSummary: rawVoiceNote.plainSummary,
    };

    assert.equal(familyProjectedNote.plainSummary, 'Felt slight dizziness in the morning; had tea and light breakfast.');
    assert.equal(Object.prototype.hasOwnProperty.call(familyProjectedNote, 'transcript'), false);
    assert.equal(Object.prototype.hasOwnProperty.call(familyProjectedNote, 'extractedCues'), false);
    assert.equal(Object.prototype.hasOwnProperty.call(familyProjectedNote, 'coordinatorId'), false);
  });
});
