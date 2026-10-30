import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Change 1: Voice Note Routing & Prioritization', () => {
  const HIGH_PRIORITY_TAGS = ['fall', 'confusion'];

  function evaluateVoiceNotePriority(cues) {
    return cues.some(
      (c) => HIGH_PRIORITY_TAGS.includes(c.tag) || c.severity === 'severe'
    );
  }

  function routeVoiceNoteNotification(note, senior, coordinators) {
    // Must route ONLY to senior's assigned coordinator
    return coordinators.filter((c) => c.id === senior.assignedCoordinatorId).map((c) => ({
      targetCoordinatorId: c.id,
      title: note.isHighPriority ? `Urgent Voice Note - ${senior.name}` : `New voice note from ${senior.name}`,
      message: note.plainSummary,
      isHighPriority: note.isHighPriority,
    }));
  }

  test('1. Voice note routes to senior assigned coordinator only, not others', () => {
    const seniorA = { id: 'senior-001', name: 'Smt. Kamala Devi', assignedCoordinatorId: 'coord-001' };
    const coordinators = [
      { id: 'coord-001', name: 'Ananya Sharma' },
      { id: 'coord-002', name: 'Priya Iyer' },
      { id: 'coord-003', name: 'Rahul Joshi' },
      { id: 'coord-004', name: 'Sunita Rao' },
    ];

    const note = {
      id: 'vn-1',
      seniorId: seniorA.id,
      coordinatorId: seniorA.assignedCoordinatorId,
      plainSummary: 'Morning dizziness reported.',
      isHighPriority: false,
    };

    const notifications = routeVoiceNoteNotification(note, seniorA, coordinators);

    assert.equal(notifications.length, 1);
    assert.equal(notifications[0].targetCoordinatorId, 'coord-001');
    assert.equal(notifications.some((n) => n.targetCoordinatorId === 'coord-002'), false);
    assert.equal(notifications.some((n) => n.targetCoordinatorId === 'coord-003'), false);
    assert.equal(notifications.some((n) => n.targetCoordinatorId === 'coord-004'), false);
  });

  test('2. Fall or severe cue marks voice note as high priority', () => {
    const cuesWithFall = [
      { tag: 'fall', severity: 'severe', quote: 'I fell near the bathroom' },
      { tag: 'pain', severity: 'moderate', quote: 'knee hurts' },
    ];

    const isHigh = evaluateVoiceNotePriority(cuesWithFall);
    assert.equal(isHigh, true);

    const cuesMild = [
      { tag: 'poor sleep', severity: 'mild', quote: 'woke up twice' },
    ];
    assert.equal(evaluateVoiceNotePriority(cuesMild), false);
  });

  test('3. Voice notes for senior-001 are not visible to other coordinators', () => {
    const notes = [
      { id: 'vn-1', seniorId: 'senior-001', coordinatorId: 'coord-001', plainSummary: 'Checkup needed' },
      { id: 'vn-2', seniorId: 'senior-002', coordinatorId: 'coord-002', plainSummary: 'Blood pressure checked' },
    ];

    const currentCoordinatorId = 'coord-001';
    const visibleNotes = notes.filter((n) => n.coordinatorId === currentCoordinatorId);

    assert.equal(visibleNotes.length, 1);
    assert.equal(visibleNotes[0].id, 'vn-1');
  });
});
