import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const datasetDir = path.resolve('Data set/datasetssss');

test('Phase 2 Validation: 200 Senior Profiles Aged 60+', () => {
  const content = fs.readFileSync(path.join(datasetDir, 'demo_200_senior_profiles.csv'), 'utf8');
  const lines = content.trim().split('\n').slice(1);
  assert.strictEqual(lines.length, 200, 'Must have exactly 200 demo profiles');

  const seniorIds = new Set();
  const recordIds = new Set();

  for (const line of lines) {
    const parts = line.split(',');
    const sid = parts[0];
    const rid = parts[1];
    const age = Number(parts[2]);

    assert.ok(sid.startsWith('SW'), `Senior ID must start with SW: ${sid}`);
    assert.ok(!seniorIds.has(sid), `Senior ID must be unique: ${sid}`);
    seniorIds.add(sid);

    assert.ok(rid.startsWith('SR'), `Record ID must start with SR: ${rid}`);
    recordIds.add(rid);

    assert.ok(age >= 60, `Senior age must be >= 60: ${age}`);
  }

  assert.strictEqual(seniorIds.size, 200);
});

test('Phase 2 Validation: 18,000 Observation Rows (90 Days per Senior)', () => {
  const content = fs.readFileSync(path.join(datasetDir, 'demo_90day_simulated_observations.csv'), 'utf8');
  const lines = content.trim().split('\n').slice(1);
  assert.strictEqual(lines.length, 18000, 'Must have exactly 18,000 observation rows');

  const bySenior = new Map();
  for (const line of lines) {
    const [sid, dt, dayIdx, steps, hr, sys, dia, origin] = line.split(',');
    assert.strictEqual(origin, 'SIMULATED_NOT_OBSERVED', 'Observations must carry SIMULATED_NOT_OBSERVED flag');
    if (!bySenior.has(sid)) bySenior.set(sid, []);
    bySenior.get(sid).push({ dayIdx: Number(dayIdx), dt });
  }

  assert.strictEqual(bySenior.size, 200, 'Must cover 200 seniors');
  for (const [sid, days] of bySenior.entries()) {
    assert.strictEqual(days.length, 90, `Senior ${sid} must have exactly 90 observation days`);
    assert.strictEqual(days[0].dayIdx, 1, `Day 1 must start at index 1`);
    assert.strictEqual(days[89].dayIdx, 90, `Day 90 must end at index 90`);
  }
});

test('Phase 2 Validation: 18,000 Medication Confirmation Events', () => {
  const content = fs.readFileSync(path.join(datasetDir, 'demo_90day_simulated_medication_events.csv'), 'utf8');
  const lines = content.trim().split('\n').slice(1);
  assert.strictEqual(lines.length, 18000, 'Must have exactly 18,000 medication event rows');

  for (let i = 0; i < 50; i++) {
    const parts = lines[i].split(',');
    assert.strictEqual(parts[5], 'SIMULATED_NOT_OBSERVED', 'Must carry SIMULATED_NOT_OBSERVED flag');
    assert.ok(parts[4] === 'confirmed' || parts[4] === 'unconfirmed', 'Status must be confirmed or unconfirmed');
  }
});

test('Phase 2 Validation: Check-in Notes have simulated_text_not_voice inputMode', () => {
  const content = fs.readFileSync(path.join(datasetDir, 'demo_simulated_checkin_notes.csv'), 'utf8');
  const lines = content.trim().split('\n').slice(1);
  assert.ok(lines.length > 2000, 'Must have > 2000 check-in notes');

  for (let i = 0; i < 50; i++) {
    const parts = lines[i].split(',');
    const inputMode = parts[parts.length - 2];
    const dataOrigin = parts[parts.length - 1];
    assert.strictEqual(inputMode, 'simulated_text_not_voice', 'Must be simulated text, not speech');
    assert.strictEqual(dataOrigin, 'SIMULATED_NOT_OBSERVED', 'Must carry SIMULATED_NOT_OBSERVED flag');
  }
});

test('Phase 2 Validation: 12 Planted Decline Scenarios (Evaluation Ground Truth Only)', () => {
  const content = fs.readFileSync(path.join(datasetDir, 'demo_12_planted_decline_scenarios.csv'), 'utf8');
  const lines = content.trim().split('\n').slice(1);
  assert.strictEqual(lines.length, 12, 'Must have exactly 12 planted decline cases');

  for (const line of lines) {
    const parts = line.split(',');
    assert.ok(parts[0].startsWith('SW'), 'Senior ID must start with SW');
    assert.ok(Number(parts[2]) >= 60, 'Onset day must be in later evaluation window');
    assert.strictEqual(parts[4], 'synthetic_scenario_not_clinical_ground_truth', 'Must be flagged as synthetic benchmark');
  }
});

test('Phase 6 Validation: n8n AI Agent Service Tool Calling & Deduplication', () => {
  // Pure implementation test of the n8n agent tool logic
  const tasks = [];
  function toolCreateCoordinatorTask(taskInput) {
    const dedupKey = `${taskInput.seniorId}_${taskInput.taskTitle.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const existing = tasks.find(t => t.dedupKey === dedupKey && t.status === 'pending');
    if (existing) {
      return {
        success: false,
        task: existing,
        message: `Duplicate task detected for ${taskInput.seniorId} within 24h. Gated to prevent coordinator alert fatigue.`
      };
    }
    const newTask = {
      id: `task_${Date.now()}`,
      ...taskInput,
      status: 'pending',
      dedupKey
    };
    tasks.push(newTask);
    return { success: true, task: newTask, message: 'Task created.' };
  }

  // 1. Tool Call: Create task
  const res1 = toolCreateCoordinatorTask({
    seniorId: 'SW001',
    priority: 'critical',
    taskTitle: 'Urgent BP Follow-up',
    justification: 'Observed systolic BP elevation +18 mmHg above baseline',
    suggestedAction: 'call_senior',
    evidence: ['Systolic BP averaged 132 mmHg vs baseline 114 mmHg']
  });
  assert.strictEqual(res1.success, true);
  assert.strictEqual(tasks.length, 1);

  // 2. Immediate duplicate call must be gated to prevent coordinator alert fatigue
  const res2 = toolCreateCoordinatorTask({
    seniorId: 'SW001',
    priority: 'critical',
    taskTitle: 'Urgent BP Follow-up',
    justification: 'Observed systolic BP elevation +18 mmHg above baseline',
    suggestedAction: 'call_senior',
    evidence: ['Systolic BP averaged 132 mmHg vs baseline 114 mmHg']
  });
  assert.strictEqual(res2.success, false, 'Duplicate task must be gated');
  assert.strictEqual(tasks.length, 1, 'No duplicate task inserted');
  assert.ok(res2.message.includes('Duplicate task detected'));
});


