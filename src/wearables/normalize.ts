/**
 * WEARABLE NORMALIZATION UTILITIES
 * 
 * Formats timestamps to ISO 8601 with Indian Standard Time (IST, UTC+05:30) display.
 * Generates unique deterministic sample IDs for deduplication.
 */

import { RawSample, NormalizedReading } from './types';
import { evaluateSampleQuality } from './quality';

/**
 * Converts a Unix timestamp in milliseconds to an ISO 8601 string formatted for IST (+05:30)
 */
export function formatISTIsoString(timestampMs: number): string {
  const date = new Date(timestampMs);
  // IST is UTC + 5 hours 30 minutes
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(date.getTime() + istOffsetMs);
  const iso = istDate.toISOString(); // e.g. "2026-10-30T10:30:00.000Z"
  return iso.replace('Z', '+05:30');
}

/**
 * Returns human-readable IST time display, e.g. "10:30 AM" or "30 Oct, 10:30 AM"
 */
export function formatISTDisplay(timestampMs: number, includeDate = false): string {
  const date = new Date(timestampMs);
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...(includeDate ? { day: 'numeric', month: 'short' } : {}),
  });
}

/**
 * Computes deterministic deduplication key for a reading:
 * deviceId + metric + measuredAt
 */
export function computeDedupeKey(deviceId: string, metric: string, measuredAt: number): string {
  // Quantize timestamp to nearest second to absorb slight jitter in re-transmitted packets
  const quantizedSec = Math.round(measuredAt / 1000);
  return `${deviceId}_${metric}_${quantizedSec}`;
}

/**
 * Normalizes a raw sample into a fully typed NormalizedReading
 */
export function normalizeRawSample(
  sample: RawSample,
  isSimulated = false
): NormalizedReading {
  const qualityResult = evaluateSampleQuality(sample.metric, sample.rawValue);
  const dedupeKey = computeDedupeKey(sample.deviceId, sample.metric, sample.measuredAt);

  return {
    id: `nr_${dedupeKey}_${Math.random().toString(36).substring(2, 6)}`,
    seniorId: sample.seniorId,
    deviceId: sample.deviceId,
    metric: sample.metric,
    value: qualityResult.numericValue,
    unit: sample.unit,
    measuredAt: sample.measuredAt,
    receivedAt: sample.receivedAt,
    isoTimestampIST: formatISTIsoString(sample.measuredAt),
    sourceLabel: sample.sourceLabel,
    quality: qualityResult.quality,
    rejectionReason: qualityResult.rejectionReason,
    rawPayloadRef: sample.rawPayloadRef,
    isSimulated,
  };
}
