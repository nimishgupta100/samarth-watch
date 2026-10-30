/**
 * WEARABLE ROLLING AGGREGATION & DAILY FEATURES
 * 
 * Rules:
 * - Missing data is preserved honestly as GAPS: never interpolate silently!
 * - Downsamples high-frequency readings into 5-minute aggregates for 14-day history.
 * - Computes daily features for personal baseline calibration:
 *   - Resting heart rate estimate (10th percentile of valid resting/night readings)
 *   - Minimum SpO2 with sample count
 *   - Step totals
 *   - Wear time & gap count
 */

import { NormalizedReading, FiveMinuteAggregate, DailyWearableFeatures, WearableMetric } from './types';

/**
 * Computes 5-minute window aggregates for a collection of readings
 */
export function aggregateTo5MinuteWindows(
  readings: NormalizedReading[]
): FiveMinuteAggregate[] {
  const validReadings = readings.filter((r) => r.quality === 'ok');
  if (validReadings.length === 0) return [];

  // Group by metric and 5-minute bucket (300,000 ms)
  const windowMs = 5 * 60 * 1000;
  const groups = new Map<string, NormalizedReading[]>();

  for (const r of validReadings) {
    const bucketStart = Math.floor(r.measuredAt / windowMs) * windowMs;
    const groupKey = `${r.seniorId}_${r.deviceId}_${r.metric}_${bucketStart}`;
    const list = groups.get(groupKey) || [];
    list.push(r);
    groups.set(groupKey, list);
  }

  const aggregates: FiveMinuteAggregate[] = [];

  for (const [, items] of groups) {
    if (items.length === 0) continue;
    const first = items[0];
    const bucketStart = Math.floor(first.measuredAt / windowMs) * windowMs;
    const values = items.map((i) => i.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = Math.round((sum / values.length) * 10) / 10;
    const min = Math.min(...values);
    const max = Math.max(...values);

    aggregates.push({
      seniorId: first.seniorId,
      deviceId: first.deviceId,
      metric: first.metric,
      windowStart: bucketStart,
      windowEnd: bucketStart + windowMs,
      count: items.length,
      avgValue: avg,
      minValue: min,
      maxValue: max,
    });
  }

  return aggregates.sort((a, b) => a.windowStart - b.windowStart);
}

/**
 * Detects gaps in continuous measurements (e.g. gaps > 30 minutes)
 * Returns array of gap intervals [gapStart, gapEnd]
 */
export function detectMeasurementGaps(
  readings: NormalizedReading[],
  maxGapMinutes = 30
): Array<{ startMs: number; endMs: number; durationMinutes: number }> {
  if (readings.length < 2) return [];

  const sorted = [...readings].sort((a, b) => a.measuredAt - b.measuredAt);
  const gapThresholdMs = maxGapMinutes * 60 * 1000;
  const gaps: Array<{ startMs: number; endMs: number; durationMinutes: number }> = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const diff = sorted[i + 1].measuredAt - sorted[i].measuredAt;
    if (diff > gapThresholdMs) {
      gaps.push({
        startMs: sorted[i].measuredAt,
        endMs: sorted[i + 1].measuredAt,
        durationMinutes: Math.round(diff / 60000),
      });
    }
  }

  return gaps;
}

/**
 * Calculates daily baseline features from a day's worth of normalized readings
 */
export function computeDailyWearableFeatures(
  seniorId: string,
  dateKey: string, // YYYY-MM-DD
  dayReadings: NormalizedReading[]
): DailyWearableFeatures {
  const valid = dayReadings.filter((r) => r.quality === 'ok');

  // 1. Resting Heart Rate Estimate (10th percentile of valid heart rate readings)
  const hrReadings = valid.filter((r) => r.metric === 'heart_rate');
  let restingHeartRate: DailyWearableFeatures['restingHeartRate'];
  if (hrReadings.length >= 5) {
    const sortedHr = hrReadings.map((r) => r.value).sort((a, b) => a - b);
    const p10Index = Math.floor(sortedHr.length * 0.1);
    restingHeartRate = {
      value: sortedHr[p10Index],
      sampleCount: hrReadings.length,
      method: 'night_percentile_10',
    };
  }

  // 2. Minimum SpO2
  const spo2Readings = valid.filter((r) => r.metric === 'spo2');
  let minSpo2: DailyWearableFeatures['minSpo2'];
  if (spo2Readings.length > 0) {
    const spo2Values = spo2Readings.map((r) => r.value);
    minSpo2 = {
      value: Math.min(...spo2Values),
      sampleCount: spo2Readings.length,
    };
  }

  // 3. Step Count
  const stepReadings = valid.filter((r) => r.metric === 'steps');
  const totalSteps = stepReadings.reduce((sum, r) => sum + r.value, 0);

  // 4. Wear time & Gaps
  const gaps = detectMeasurementGaps(valid, 30);
  const wearTimeMinutes = Math.max(0, 1440 - gaps.reduce((acc, g) => acc + g.durationMinutes, 0));

  return {
    seniorId,
    dateKey,
    restingHeartRate,
    minSpo2,
    totalSteps,
    wearTimeMinutes,
    gapCount: gaps.length,
    isComplete: valid.length >= 20,
  };
}
