/**
 * WEARABLE DATA QUALITY & PLAUSIBILITY FILTER
 * 
 * Rules:
 * - Data quality filters check if the measurement is physically plausible.
 * - These are NOT clinical diagnosis thresholds.
 * - Rejected samples are NEVER silently deleted: they are preserved with a clear rejectionReason.
 */

import { PLAUSIBILITY_LIMITS } from './constants';
import { RawSample, ReadingQuality, WearableMetric } from './types';

export interface QualityCheckResult {
  quality: ReadingQuality;
  numericValue: number;
  rejectionReason?: string;
}

export function evaluateSampleQuality(
  metric: WearableMetric,
  rawValue: any
): QualityCheckResult {
  // Discrete / non-continuous signal handling
  if (metric === 'fall_event') {
    const val = Number(rawValue);
    if (val === 1 || val === 0) {
      return { quality: 'ok', numericValue: val };
    }
    return {
      quality: 'rejected',
      numericValue: 0,
      rejectionReason: `Invalid fall_event value: ${rawValue}. Expected 0 or 1.`,
    };
  }

  if (metric === 'device_sos') {
    const val = Number(rawValue);
    if (val === 1) {
      return { quality: 'ok', numericValue: 1 };
    }
    return {
      quality: 'rejected',
      numericValue: 0,
      rejectionReason: `Invalid device_sos value: ${rawValue}. Expected 1.`,
    };
  }

  const num = typeof rawValue === 'number' ? rawValue : parseFloat(String(rawValue));
  if (isNaN(num)) {
    return {
      quality: 'rejected',
      numericValue: 0,
      rejectionReason: `Non-numeric value received for metric ${metric}: ${JSON.stringify(rawValue)}`,
    };
  }

  const limits = (PLAUSIBILITY_LIMITS as Record<string, { min: number; max: number; unit: string }>)[metric];
  if (!limits) {
    // Unconstrained metric
    return { quality: 'ok', numericValue: num };
  }

  if (num < limits.min) {
    return {
      quality: 'rejected',
      numericValue: num,
      rejectionReason: `Value ${num} is below physical plausibility limit of ${limits.min} ${limits.unit}`,
    };
  }

  if (num > limits.max) {
    return {
      quality: 'rejected',
      numericValue: num,
      rejectionReason: `Value ${num} exceeds physical plausibility limit of ${limits.max} ${limits.unit}`,
    };
  }

  return {
    quality: 'ok',
    numericValue: num,
  };
}
