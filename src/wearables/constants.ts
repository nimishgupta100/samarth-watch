/**
 * SAMARTH WATCH WEARABLE CONSTANTS & THRESHOLDS
 * 
 * Configurable thresholds, timing, plausibility ranges, and retention windows.
 * 
 * IMPORTANT CLINICAL NOTE:
 * All threshold values and bounds are PLACEHOLDERS for demonstration and testing.
 * They must be formally reviewed and calibrated by a licensed clinician before any
 * production or clinical deployment. None of these values constitute medical advice.
 */

// Data Quality Plausibility Ranges (Pure Data Quality Filters, NOT clinical thresholds)
export const PLAUSIBILITY_LIMITS = {
  heart_rate: { min: 20, max: 250, unit: 'bpm', metric: 'heart_rate' },
  spo2: { min: 50, max: 100, unit: '%', metric: 'spo2' },
  blood_pressure_sys: { min: 50, max: 280, unit: 'mmHg', metric: 'blood_pressure_sys' },
  blood_pressure_dia: { min: 30, max: 180, unit: 'mmHg', metric: 'blood_pressure_dia' },
  weight: { min: 20, max: 250, unit: 'kg', metric: 'weight' },
  steps: { min: 0, max: 80000, unit: 'steps', metric: 'steps' },
  sleep_minutes: { min: 0, max: 1440, unit: 'minutes', metric: 'sleep_minutes' },
  skin_temp: { min: 25, max: 45, unit: '°C', metric: 'skin_temp' },
} as const;

// Tier 2 Emergency Thresholds (Placeholder defaults - clinician must set per-senior)
export const DEFAULT_EMERGENCY_THRESHOLDS = {
  heartRateHigh: 130, // bpm
  heartRateLow: 45,   // bpm
  spo2Low: 90,        // %
  bpSysHigh: 180,     // mmHg
  bpDiaHigh: 110,     // mmHg
  // Persistence count: reading beyond limits must persist across consecutive valid samples
  sustainedSamplesCount: 3,
  // No movement duration required after fall before firing Tier 2 (seconds)
  fallNoMovementSec: 30,
  // Debounce window to prevent duplicate SOS events from repeated device signals (ms)
  sosDebounceWindowMs: 120 * 1000, // 2 minutes
} as const;

// Tier 1 Signal Thresholds (Coordinator queue alert, NOT emergency SOS)
export const DEFAULT_TIER1_THRESHOLDS = {
  // Device silence warning (minutes without any sample)
  noDataAlertMinutes: 120, // 2 hours
  // Battery warning threshold (percentage)
  batteryLowPercent: 20,
  // Battery critical warning
  batteryCriticalPercent: 10,
} as const;

// Band Disconnect Escalation Timings (Configurable thresholds)
export const BAND_DISCONNECT_ESCALATION = {
  // After 5 minutes, senior sees a calm large banner: "Your band is not connected. Tap to connect"
  seniorBannerMinutes: 5,
  // Banner repeated at most every 15 minutes
  seniorBannerRepeatMinutes: 15,
  // After 15 minutes, Tier 1 signal routes to care coordinator
  coordinatorAlertMinutes: 15,
  // After 60 minutes, family notified if senior consent allows
  familyNotifyMinutes: 60,
} as const;

// Sampling & Ingestion Timings
export const TIMING_CONFIG = {
  // Simulator normal tick interval
  simulatorTickMs: 5000,
  // Web Bluetooth reconnect backoff (initial, factor, max)
  bluetoothBackoffInitialMs: 1000,
  bluetoothBackoffFactor: 1.5,
  bluetoothBackoffMaxMs: 30000,
  // Max connection retry attempts before marking disconnected
  bluetoothMaxRetries: 5,
} as const;

// Data Retention Policy (Ring buffer & downsampling)
export const RETENTION_POLICY = {
  // Raw high-frequency samples buffer duration (hours)
  rawBufferHours: 24,
  // 5-minute rolling aggregate retention (days)
  fiveMinuteAggregateDays: 14,
  // Daily summary retention (days)
  dailySummaryDays: 90,
} as const;

// Bluetooth GATT Standard Service & Characteristic UUIDs (Bluetooth SIG Specifications)
export const BLE_GATT_SERVICES = {
  HEART_RATE: 0x180d,
  BATTERY_SERVICE: 0x180f,
  PULSE_OXIMETER: 0x1822,
  BLOOD_PRESSURE: 0x1810,
  WEIGHT_SCALE: 0x181d,
} as const;

export const BLE_GATT_CHARACTERISTICS = {
  HEART_RATE_MEASUREMENT: '00002a37-0000-1000-8000-00805f9b34fb',
  BATTERY_LEVEL: '00002a19-0000-1000-8000-00805f9b34fb',
  PLX_SPOT_CHECK: '00002a5e-0000-1000-8000-00805f9b34fb',
  PLX_CONTINUOUS: '00002a5f-0000-1000-8000-00805f9b34fb',
  BLOOD_PRESSURE_MEASUREMENT: '00002a35-0000-1000-8000-00805f9b34fb',
  WEIGHT_MEASUREMENT: '00002a9d-0000-1000-8000-00805f9b34fb',
} as const;
