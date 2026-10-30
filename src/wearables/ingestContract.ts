/**
 * WEARABLE INGESTION API CONTRACT (Production Specification)
 * 
 * Production endpoint:
 * POST /v1/ingest/readings
 * 
 * Authenticated via device bearer token.
 * Provides idempotent ingestion: re-transmitting batches changes nothing.
 */

import { NormalizedReading, RawSample, WearableMetric } from './types';

export interface IngestBatchRequest {
  deviceId: string;
  seniorId: string;
  idempotencyKey: string;
  sentAt: number; // ms
  samples: Array<{
    metric: WearableMetric;
    value: number | string | Record<string, any>;
    unit: string;
    measuredAt: number; // ms
    sourceLabel: string;
  }>;
}

export interface IngestBatchResponse {
  success: boolean;
  acceptedCount: number;
  duplicateCount: number;
  rejectedCount: number;
  acceptedReadings: NormalizedReading[];
  rejectedItems: Array<{
    metric: string;
    measuredAt: number;
    reason: string;
  }>;
  serverTimestamp: number;
}
