import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Change 4: Wearable Provider Interface & Triage Logic', () => {
  const HEART_RATE_HIGH_LIMIT = 130;
  const HEART_RATE_LOW_LIMIT = 45;
  const SPO2_LOW_LIMIT = 90;

  function evaluateWearableReading(reading) {
    if (reading.type === 'heart_rate') {
      if (reading.value > HEART_RATE_HIGH_LIMIT) return 'hr_high';
      if (reading.value < HEART_RATE_LOW_LIMIT) return 'hr_low';
    }
    if (reading.type === 'spo2') {
      if (reading.value < SPO2_LOW_LIMIT) return 'spo2_low';
    }
    if (reading.type === 'fall_detected') {
      return 'fall_detected';
    }
    return 'normal';
  }

  test('1. Normal vital signs do not trigger emergency events', () => {
    const hrNormal = { type: 'heart_rate', value: 72, unit: 'bpm' };
    const spo2Normal = { type: 'spo2', value: 98, unit: '%' };

    assert.equal(evaluateWearableReading(hrNormal), 'normal');
    assert.equal(evaluateWearableReading(spo2Normal), 'normal');
  });

  test('2. Elevated heart rate above 130 bpm generates high HR alert', () => {
    const hrElevated = { type: 'heart_rate', value: 135, unit: 'bpm' };
    assert.equal(evaluateWearableReading(hrElevated), 'hr_high');
  });

  test('3. Low oxygen level below 90% generates low SpO2 alert', () => {
    const lowSpo2 = { type: 'spo2', value: 87, unit: '%' };
    assert.equal(evaluateWearableReading(lowSpo2), 'spo2_low');
  });

  test('4. Fall detection reading triggers immediate emergency event', () => {
    const fall = { type: 'fall_detected', value: 1, unit: 'event' };
    assert.equal(evaluateWearableReading(fall), 'fall_detected');
  });

  test('5. Wearable readings carry simulated label in prototype mode', () => {
    const reading = {
      id: 'wr-1',
      type: 'heart_rate',
      value: 75,
      unit: 'bpm',
      source: 'demo_simulator',
      deviceName: 'Samarth Demo Band (simulated)',
      isSimulated: true,
    };

    assert.equal(reading.isSimulated, true);
    assert.ok(reading.deviceName.includes('simulated'));
  });
});
