import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Parsers (GATT characteristics)
function parseHeartRateMeasurement(dataView) {
  if (!dataView || dataView.byteLength < 2) return null;
  const flags = dataView.getUint8(0);
  const is16Bit = (flags & 0x01) !== 0;
  const contactSupported = (flags & 0x04) !== 0;
  const contactDetected = contactSupported ? (flags & 0x02) !== 0 : undefined;
  const hasEnergy = (flags & 0x08) !== 0;
  const hasRR = (flags & 0x10) !== 0;

  let offset = 1;
  let bpm;
  if (is16Bit) {
    if (dataView.byteLength < offset + 2) return null;
    bpm = dataView.getUint16(offset, true);
    offset += 2;
  } else {
    bpm = dataView.getUint8(offset);
    offset += 1;
  }

  let rrIntervalsMs;
  if (hasRR) {
    rrIntervalsMs = [];
    while (offset + 1 < dataView.byteLength) {
      const rawRR = dataView.getUint16(offset, true);
      rrIntervalsMs.push(Math.round((rawRR / 1024) * 1000));
      offset += 2;
    }
  }

  return { bpm, contactDetected, contactSupported, rrIntervalsMs };
}

function parseBatteryLevel(dataView) {
  if (!dataView || dataView.byteLength < 1) return null;
  const level = dataView.getUint8(0);
  return level > 100 ? null : level;
}

function parseSFloat(val) {
  let mantissa = val & 0x0fff;
  if ((mantissa & 0x0800) !== 0) mantissa = -((0x0fff + 1) - mantissa);
  let exponent = (val >> 12) & 0x000f;
  if ((exponent & 0x0008) !== 0) exponent = -((0x000f + 1) - exponent);
  return mantissa * Math.pow(10, exponent);
}

function parsePulseOximeterContinuous(dataView) {
  if (!dataView || dataView.byteLength < 4) return null;
  const rawSpo2 = dataView.getUint16(0, true);
  const rawPr = dataView.getUint16(2, true);
  return {
    spo2Percent: Math.round(parseSFloat(rawSpo2)),
    pulseBpm: Math.round(parseSFloat(rawPr)),
  };
}

function parseBloodPressureMeasurement(dataView) {
  if (!dataView || dataView.byteLength < 7) return null;
  const flags = dataView.getUint8(0);
  const isKpa = (flags & 0x01) !== 0;
  let sys = parseSFloat(dataView.getUint16(1, true));
  let dia = parseSFloat(dataView.getUint16(3, true));
  let map = parseSFloat(dataView.getUint16(5, true));
  if (isKpa) {
    sys *= 7.50062;
    dia *= 7.50062;
    map *= 7.50062;
  }
  return {
    systolic: Math.round(sys),
    diastolic: Math.round(dia),
    meanArterialPressure: Math.round(map),
    unit: 'mmHg',
  };
}

function parseWeightMeasurement(dataView) {
  if (!dataView || dataView.byteLength < 3) return null;
  const raw = dataView.getUint16(1, true);
  return { weightKg: Number((raw * 0.005).toFixed(1)), unit: 'kg' };
}

// Ingest logic mirror
const PLAUSIBILITY_LIMITS = {
  heart_rate: { min: 20, max: 250, unit: 'bpm' },
  spo2: { min: 50, max: 100, unit: '%' },
};

function evaluateQuality(metric, val) {
  const limits = PLAUSIBILITY_LIMITS[metric];
  if (!limits) return { quality: 'ok', val };
  if (val < limits.min) return { quality: 'rejected', reason: `Below plausibility limit ${limits.min}` };
  if (val > limits.max) return { quality: 'rejected', reason: `Exceeds plausibility limit ${limits.max}` };
  return { quality: 'ok', val };
}

describe('Wearable GATT Characteristic Parsers', () => {
  test('Heart Rate Parser: 8-bit format with contact bits', () => {
    const buffer = new Uint8Array([0x06, 76]).buffer;
    const result = parseHeartRateMeasurement(new DataView(buffer));
    assert.ok(result);
    assert.equal(result.bpm, 76);
    assert.equal(result.contactSupported, true);
    assert.equal(result.contactDetected, true);
  });

  test('Heart Rate Parser: 16-bit format with RR intervals', () => {
    const buffer = new Uint8Array([0x11, 0x18, 0x01, 0x00, 0x04]).buffer;
    const result = parseHeartRateMeasurement(new DataView(buffer));
    assert.ok(result);
    assert.equal(result.bpm, 280);
    assert.equal(result.rrIntervalsMs.length, 1);
    assert.equal(result.rrIntervalsMs[0], 1000);
  });

  test('Battery Level Parser: valid and invalid bounds', () => {
    assert.equal(parseBatteryLevel(new DataView(new Uint8Array([85]).buffer)), 85);
    assert.equal(parseBatteryLevel(new DataView(new Uint8Array([120]).buffer)), null);
  });

  test('Pulse Oximeter SFLOAT Parser: SpO2 and PR', () => {
    const buffer = new Uint8Array([0x62, 0x00, 0x48, 0x00]).buffer;
    const result = parsePulseOximeterContinuous(new DataView(buffer));
    assert.ok(result);
    assert.equal(result.spo2Percent, 98);
    assert.equal(result.pulseBpm, 72);
  });

  test('Blood Pressure Parser: SFLOAT systolic, diastolic, MAP', () => {
    const buffer = new Uint8Array([0x00, 0x78, 0x00, 0x50, 0x00, 0x5d, 0x00]).buffer;
    const result = parseBloodPressureMeasurement(new DataView(buffer));
    assert.ok(result);
    assert.equal(result.systolic, 120);
    assert.equal(result.diastolic, 80);
    assert.equal(result.meanArterialPressure, 93);
    assert.equal(result.unit, 'mmHg');
  });

  test('Weight Measurement Parser: SI kilograms', () => {
    const buffer = new Uint8Array([0x00, 0xb0, 0x36]).buffer;
    const result = parseWeightMeasurement(new DataView(buffer));
    assert.ok(result);
    assert.equal(result.weightKg, 70.0);
    assert.equal(result.unit, 'kg');
  });
});

describe('Data Quality & Ingestion Rules', () => {
  test('Plausibility Filter: Rejects out-of-bounds with explicit reason', () => {
    const high = evaluateQuality('heart_rate', 300);
    assert.equal(high.quality, 'rejected');
    assert.ok(high.reason.includes('Exceeds plausibility'));

    const low = evaluateQuality('heart_rate', 10);
    assert.equal(low.quality, 'rejected');

    const ok = evaluateQuality('heart_rate', 75);
    assert.equal(ok.quality, 'ok');
  });

  test('Idempotency & Deduplication: Re-transmitting same timestamp is ignored', () => {
    const seen = new Set();
    function ingest(id, metric, ts) {
      const key = `${id}_${metric}_${Math.round(ts / 1000)}`;
      if (seen.has(key)) return { accepted: false, duplicate: true };
      seen.add(key);
      return { accepted: true, duplicate: false };
    }

    const first = ingest('dev1', 'hr', 100000);
    assert.equal(first.accepted, true);
    assert.equal(first.duplicate, false);

    const second = ingest('dev1', 'hr', 100000);
    assert.equal(second.accepted, false);
    assert.equal(second.duplicate, true);
  });

  test('Rules Engine: Single spike does NOT trigger emergency, 3 consecutive do', () => {
    let consecutiveCount = 0;
    function evaluateSample(bpm) {
      if (bpm > 130) {
        consecutiveCount++;
        if (consecutiveCount >= 3) {
          return { tier2: true, message: 'Emergency signal from band: Sustained High HR' };
        }
        return { tier1: true, tier2: false };
      }
      consecutiveCount = 0;
      return { tier1: false, tier2: false };
    }

    // 1st spike
    const r1 = evaluateSample(142);
    assert.equal(r1.tier2, false, '1st sample must NOT trigger emergency');

    // 2nd spike
    const r2 = evaluateSample(140);
    assert.equal(r2.tier2, false, '2nd sample must NOT trigger emergency');

    // 3rd sustained spike
    const r3 = evaluateSample(145);
    assert.equal(r3.tier2, true, '3rd sample MUST trigger Tier 2 emergency');
  });

  test('Rules Engine: Fall event and Device SOS button trigger immediate Tier 2', () => {
    function evaluateEvent(event) {
      if (event === 'fall_event' || event === 'device_sos') {
        return { tier2: true };
      }
      return { tier2: false };
    }

    assert.equal(evaluateEvent('fall_event').tier2, true);
    assert.equal(evaluateEvent('device_sos').tier2, true);
  });

  test('Rules Engine: Hardware SOS debounce window suppresses duplicate triggers within 60s', () => {
    let lastSosTime = -Infinity;
    const DEBOUNCE_MS = 60000;
    let sosEventCount = 0;

    function handleDeviceSos(timestamp) {
      if (timestamp - lastSosTime < DEBOUNCE_MS) {
        return { debounced: true, triggered: false };
      }
      lastSosTime = timestamp;
      sosEventCount++;
      return { debounced: false, triggered: true };
    }

    // First press at t = 1000ms
    const r1 = handleDeviceSos(1000);
    assert.equal(r1.triggered, true);
    assert.equal(r1.debounced, false);

    // Second press at t = 15000ms (14s later)
    const r2 = handleDeviceSos(15000);
    assert.equal(r2.triggered, false);
    assert.equal(r2.debounced, true);

    // Third press at t = 50000ms (49s later)
    const r3 = handleDeviceSos(50000);
    assert.equal(r3.triggered, false);
    assert.equal(r3.debounced, true);

    // Total events created must be exactly 1
    assert.equal(sosEventCount, 1);

    // Fourth press at t = 70000ms (69s later - after debounce window)
    const r4 = handleDeviceSos(70000);
    assert.equal(r4.triggered, true);
    assert.equal(r4.debounced, false);
    assert.equal(sosEventCount, 2);
  });

  test('Out-of-order and Late Samples: Ingest engine processes regardless of arrival order', () => {
    const readings = [];
    const seenKeys = new Set();

    function ingestSample(sample) {
      const key = `${sample.seniorId}_${sample.type}_${sample.timestamp}`;
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      readings.push(sample);
      readings.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      return true;
    }

    const s1 = { seniorId: 's1', type: 'heart_rate', timestamp: '2026-10-30T10:15:00Z', value: 72 };
    const s2 = { seniorId: 's1', type: 'heart_rate', timestamp: '2026-10-30T10:05:00Z', value: 70 }; // earlier!
    const s3 = { seniorId: 's1', type: 'heart_rate', timestamp: '2026-10-30T10:10:00Z', value: 71 }; // middle!

    assert.equal(ingestSample(s1), true);
    assert.equal(ingestSample(s2), true);
    assert.equal(ingestSample(s3), true);

    // Verified correctly ordered chronologically
    assert.equal(readings[0].value, 70);
    assert.equal(readings[1].value, 71);
    assert.equal(readings[2].value, 72);
  });
});
