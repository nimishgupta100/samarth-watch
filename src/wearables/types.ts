/**
 * SAMARTH WEARABLE CORE TYPES
 */

export type WearableKind =
  | 'band'
  | 'watch'
  | 'ring'
  | 'strap'
  | 'oximeter'
  | 'bp_cuff'
  | 'scale'
  | 'simulated';

export type ProviderType = 'simulated' | 'web_bluetooth' | 'cloud' | 'companion';

export type DeviceSyncStatus = 'connected' | 'reconnecting' | 'disconnected' | 'no_data' | 'paused';

export interface DeviceLink {
  id: string;
  seniorId: string;
  vendorModelName: string;
  kind: WearableKind;
  providerType: ProviderType;
  pairedBy: {
    userId: string;
    role: 'senior' | 'coordinator' | 'family';
  };
  pairedAt: number;
  consentGivenAt: number;
  status: DeviceSyncStatus;
  lastSyncAt: number;
  lastSampleAt: number;
  batteryPercent?: number;
  firmware?: string;
  bleDeviceId?: string;
}

export type WearableMetric =
  | 'heart_rate'
  | 'spo2'
  | 'steps'
  | 'sleep_minutes'
  | 'skin_temp'
  | 'blood_pressure_sys'
  | 'blood_pressure_dia'
  | 'weight'
  | 'fall_event'
  | 'device_sos';

export type ReadingQuality = 'ok' | 'suspect' | 'rejected';

export interface RawSample {
  deviceId: string;
  seniorId: string;
  metric: WearableMetric;
  rawValue: number | string | Record<string, any>;
  unit: string;
  measuredAt: number; // Unix timestamp ms
  receivedAt: number; // Unix timestamp ms
  sourceLabel: string;
  rawPayloadRef?: string;
}

export interface NormalizedReading {
  id: string;
  seniorId: string;
  deviceId: string;
  metric: WearableMetric;
  value: number;
  valueSecondary?: number;
  unit: string;
  measuredAt: number;
  receivedAt: number;
  isoTimestampIST: string;
  sourceLabel: string; // e.g. "Simulated Samarth Band", "BLE Heart Rate Strap", "Manual"
  quality: ReadingQuality;
  rejectionReason?: string;
  rawPayloadRef?: string;
  isSimulated: boolean;
}

export interface FiveMinuteAggregate {
  seniorId: string;
  deviceId: string;
  metric: WearableMetric;
  windowStart: number;
  windowEnd: number;
  count: number;
  avgValue: number;
  minValue: number;
  maxValue: number;
}

export interface DailyWearableFeatures {
  seniorId: string;
  dateKey: string; // YYYY-MM-DD
  restingHeartRate?: {
    value: number;
    sampleCount: number;
    method: 'night_percentile_10';
  };
  minSpo2?: {
    value: number;
    sampleCount: number;
  };
  totalSteps: number;
  sleepMinutes?: number;
  wearTimeMinutes: number;
  gapCount: number;
  isComplete: boolean;
}

export type WearableSimulationScenario =
  | 'normal'
  | 'rising_resting_hr'
  | 'sustained_low_spo2'
  | 'device_silent'
  | 'battery_low'
  | 'fall_detected'
  | 'device_sos';

export interface WearableProviderStatus {
  connected: boolean;
  status: DeviceSyncStatus;
  batteryPercent?: number;
  lastSyncAt: number;
  lastSampleAt: number;
  error?: string;
}

export interface WearableProvider {
  readonly id: string;
  readonly type: ProviderType;
  connect(deviceLink: DeviceLink): Promise<boolean>;
  disconnect(): Promise<void>;
  getStatus(): WearableProviderStatus;
  onSample(callback: (sample: RawSample) => void): () => void;
  onStatusChange(callback: (status: WearableProviderStatus) => void): () => void;
}

export interface DeviceLogEntry {
  id: string;
  seniorId: string;
  deviceId: string;
  timestamp: number;
  level: 'info' | 'warning' | 'error';
  eventType: 'connected' | 'reconnected' | 'disconnected' | 'gap_detected' | 'sample_rejected' | 'battery_low';
  message: string;
  details?: Record<string, any>;
}

export type {
  LocationSource,
  LocationMode,
  LocationSharingChoice,
  LocationReading,
} from '../data/schema';
