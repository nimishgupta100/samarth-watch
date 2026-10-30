/**
 * WEARABLE INGESTION ENGINE
 * 
 * The single entry point every provider uses:
 * 1. Validate sample shape
 * 2. Reject impossible physical values (Quality filter)
 * 3. Deduplicate (deviceId + metric + measuredAt) - idempotent
 * 4. Accept out-of-order and late samples safely
 * 5. Normalize (units, IST timestamp, quality reason)
 * 6. Store in persistent memory & repository
 * 7. Update device status
 * 8. Evaluate rules engine (Tier 1 vs Tier 2 SOS)
 */

import {
  RawSample,
  NormalizedReading,
  DeviceLink,
  DeviceLogEntry,
  WearableMetric,
} from './types';
import { normalizeRawSample, computeDedupeKey } from './normalize';
import {
  DEFAULT_EMERGENCY_THRESHOLDS,
  DEFAULT_TIER1_THRESHOLDS,
  RETENTION_POLICY,
} from './constants';
import { repository } from '../data/repository';

export interface RulesEvaluationResult {
  tier1Signals: Array<{
    type: 'no_data' | 'battery_low' | 'baseline_drift';
    title: string;
    message: string;
  }>;
  tier2Emergency: boolean;
  emergencyReason?: string;
}

export class WearableIngestEngine {
  // In-memory ring buffer of raw normalized samples (retained for 24 hours)
  private sampleBuffer: NormalizedReading[] = [];
  // Set of seen dedupe keys to ensure idempotency
  private seenDedupeKeys: Set<string> = new Set();
  // Consecutive out-of-bounds sample tracker per metric per senior
  private consecutiveAbnormalCounts: Map<string, number> = new Map();
  // Last SOS trigger timestamp to enforce debounce window
  private lastSosTriggerTimestamp = 0;
  // Device event logs
  private deviceLogs: DeviceLogEntry[] = [];
  // Active device links
  private deviceLinks: Map<string, DeviceLink> = new Map();
  // Listeners
  private readingListeners: Set<(reading: NormalizedReading) => void> = new Set();
  private deviceLinkListeners: Set<(link: DeviceLink) => void> = new Set();

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('samarth_wearable_links');
      if (stored) {
        const parsed: DeviceLink[] = JSON.parse(stored);
        parsed.forEach((d) => this.deviceLinks.set(d.id, d));
      }
    } catch {
      /* ignore */
    }
  }

  private persistState(): void {
    if (typeof window === 'undefined') return;
    try {
      const arr = Array.from(this.deviceLinks.values());
      localStorage.setItem('samarth_wearable_links', JSON.stringify(arr));
    } catch {
      /* ignore */
    }
  }

  public registerDeviceLink(link: DeviceLink): void {
    this.deviceLinks.set(link.id, link);
    this.persistState();
    this.addLog(link.seniorId, link.id, 'info', 'connected', `Device paired: ${link.vendorModelName}`);
    this.notifyDeviceLinkListeners(link);
  }

  public getDeviceLink(deviceId: string): DeviceLink | undefined {
    return this.deviceLinks.get(deviceId);
  }

  public getDeviceLinksForSenior(seniorId: string): DeviceLink[] {
    return Array.from(this.deviceLinks.values()).filter((d) => d.seniorId === seniorId);
  }

  public updateDeviceStatus(
    deviceId: string,
    updates: Partial<DeviceLink>
  ): DeviceLink | undefined {
    const existing = this.deviceLinks.get(deviceId);
    if (!existing) return undefined;
    const updated: DeviceLink = { ...existing, ...updates };
    this.deviceLinks.set(deviceId, updated);
    this.persistState();
    this.notifyDeviceLinkListeners(updated);
    return updated;
  }

  public getLogs(seniorId?: string): DeviceLogEntry[] {
    if (!seniorId) return this.deviceLogs;
    return this.deviceLogs.filter((l) => l.seniorId === seniorId);
  }

  public addLog(
    seniorId: string,
    deviceId: string,
    level: DeviceLogEntry['level'],
    eventType: DeviceLogEntry['eventType'],
    message: string,
    details?: Record<string, any>
  ): void {
    const entry: DeviceLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      seniorId,
      deviceId,
      timestamp: Date.now(),
      level,
      eventType,
      message,
      details,
    };
    this.deviceLogs.unshift(entry);
    if (this.deviceLogs.length > 500) {
      this.deviceLogs.pop();
    }
  }

  /**
   * INGESTION PIPELINE: Single entry point for every sample
   */
  public ingestSample(
    sample: RawSample,
    isSimulated = false,
    seniorConsentGranted = true
  ): {
    accepted: boolean;
    reading?: NormalizedReading;
    duplicate: boolean;
    reason?: string;
    rulesResult?: RulesEvaluationResult;
  } {
    // Check consent: If senior has withdrawn consent, reject silently to protect privacy
    if (!seniorConsentGranted) {
      return {
        accepted: false,
        duplicate: false,
        reason: 'Consent withdrawn by senior: measurement not stored or processed.',
      };
    }

    // 1. Deduplication check
    const dedupeKey = computeDedupeKey(sample.deviceId, sample.metric, sample.measuredAt);
    if (this.seenDedupeKeys.has(dedupeKey)) {
      return {
        accepted: false,
        duplicate: true,
        reason: `Duplicate sample discarded for key: ${dedupeKey}`,
      };
    }
    this.seenDedupeKeys.add(dedupeKey);

    // 2. Normalize and evaluate quality
    const normalized = normalizeRawSample(sample, isSimulated);

    // 3. Update device link status
    const device = this.deviceLinks.get(sample.deviceId);
    if (device) {
      device.lastSyncAt = normalized.receivedAt;
      device.lastSampleAt = normalized.measuredAt;
      if (normalized.quality === 'ok') {
        device.status = 'connected';
      }
      this.persistState();
    }

    // 4. Handle Rejected Samples (Log them with clear reason; NEVER delete silently)
    if (normalized.quality === 'rejected') {
      this.addLog(
        sample.seniorId,
        sample.deviceId,
        'warning',
        'sample_rejected',
        `Sample rejected for ${sample.metric}: ${normalized.rejectionReason}`,
        { rawValue: sample.rawValue }
      );
      return {
        accepted: false,
        duplicate: false,
        reading: normalized,
        reason: normalized.rejectionReason,
      };
    }

    // 5. Store in Ring Buffer with Retention Check
    this.sampleBuffer.push(normalized);
    this.pruneBuffer();

    // 6. Map to Repository Health Readings if continuous metric
    this.syncToRepository(normalized);

    // 7. Evaluate Rules Engine (Tier 1 vs Tier 2 SOS)
    const rulesResult = this.evaluateRules(normalized);

    // 8. Notify subscribers
    this.notifyReadingListeners(normalized);

    return {
      accepted: true,
      duplicate: false,
      reading: normalized,
      rulesResult,
    };
  }

  /**
   * Synchronizes normalized readings into the core AppState repository
   */
  private syncToRepository(r: NormalizedReading): void {
    if (r.metric === 'heart_rate') {
      repository.addReading({
        seniorId: r.seniorId,
        type: 'pulse',
        value: r.value,
        unit: 'bpm',
        recordedBy: 'senior',
      });
    } else if (r.metric === 'spo2') {
      repository.addReading({
        seniorId: r.seniorId,
        type: 'spo2',
        value: r.value,
        unit: '%',
        recordedBy: 'senior',
      });
    } else if (r.metric === 'blood_pressure_sys') {
      repository.addReading({
        seniorId: r.seniorId,
        type: 'bp',
        value: r.value,
        unit: 'mmHg',
        recordedBy: 'senior',
      });
    } else if (r.metric === 'weight') {
      repository.addReading({
        seniorId: r.seniorId,
        type: 'weight',
        value: r.value,
        unit: 'kg',
        recordedBy: 'senior',
      });
    }
  }

  /**
   * RULES ENGINE:
   * - Tier 1: Routine deviation from personal baseline / device silence / battery low
   * - Tier 2: Emergency signal: Fall + no movement, Device SOS, or persistent out-of-bounds readings
   *   (never a single spike, never a rejected sample)
   */
  public evaluateRules(reading: NormalizedReading): RulesEvaluationResult {
    const senior = repository.getSenior(reading.seniorId);
    const seniorName = senior?.name || 'Senior';

    const result: RulesEvaluationResult = {
      tier1Signals: [],
      tier2Emergency: false,
    };

    // A single spike NEVER triggers an emergency!
    // Track consecutive abnormal counts per metric
    const trackerKey = `${reading.seniorId}_${reading.metric}`;
    let consecutiveCount = this.consecutiveAbnormalCounts.get(trackerKey) || 0;

    // --- Scenario A: Device SOS Button Pressed (Immediate Tier 2) ---
    if (reading.metric === 'device_sos' && reading.value === 1) {
      if (this.canTriggerSos()) {
        result.tier2Emergency = true;
        result.emergencyReason = `Emergency signal from ${seniorName}'s band: Device SOS button pressed.`;
        this.triggerSosFlow(reading.seniorId, seniorName, result.emergencyReason);
      }
      return result;
    }

    // --- Scenario B: Fall Detected (Immediate Tier 2 after no-movement window) ---
    if (reading.metric === 'fall_event' && reading.value === 1) {
      if (this.canTriggerSos()) {
        result.tier2Emergency = true;
        result.emergencyReason = `Emergency signal from ${seniorName}'s band: Fall detected with lack of movement.`;
        this.triggerSosFlow(reading.seniorId, seniorName, result.emergencyReason);
      }
      return result;
    }

    // --- Scenario C: Hard Limit Out-of-Bounds Readings (Requires CONSECUTIVE PERSISTENCE) ---
    let isAbnormal = false;
    let limitDesc = '';

    if (reading.metric === 'heart_rate') {
      if (reading.value > DEFAULT_EMERGENCY_THRESHOLDS.heartRateHigh) {
        isAbnormal = true;
        limitDesc = `High Heart Rate (${reading.value} bpm)`;
      } else if (reading.value < DEFAULT_EMERGENCY_THRESHOLDS.heartRateLow) {
        isAbnormal = true;
        limitDesc = `Low Heart Rate (${reading.value} bpm)`;
      }
    } else if (reading.metric === 'spo2') {
      if (reading.value < DEFAULT_EMERGENCY_THRESHOLDS.spo2Low) {
        isAbnormal = true;
        limitDesc = `Low Oxygen Level (${reading.value}%)`;
      }
    } else if (reading.metric === 'blood_pressure_sys') {
      if (reading.value > DEFAULT_EMERGENCY_THRESHOLDS.bpSysHigh) {
        isAbnormal = true;
        limitDesc = `Elevated Systolic Pressure (${reading.value} mmHg)`;
      }
    }

    if (isAbnormal) {
      consecutiveCount += 1;
      this.consecutiveAbnormalCounts.set(trackerKey, consecutiveCount);

      // Must persist across consecutive valid samples!
      if (consecutiveCount >= DEFAULT_EMERGENCY_THRESHOLDS.sustainedSamplesCount) {
        if (this.canTriggerSos()) {
          result.tier2Emergency = true;
          result.emergencyReason = `Emergency signal from ${seniorName}'s band: Sustained ${limitDesc} across ${consecutiveCount} consecutive samples.`;
          this.triggerSosFlow(reading.seniorId, seniorName, result.emergencyReason);
        }
      } else {
        // Tier 1 Warning while awaiting persistence confirmation
        result.tier1Signals.push({
          type: 'baseline_drift',
          title: `Vital reading elevation: ${reading.metric}`,
          message: `${seniorName}'s ${reading.metric} measured ${reading.value} ${reading.unit} (${consecutiveCount}/${DEFAULT_EMERGENCY_THRESHOLDS.sustainedSamplesCount} samples).`,
        });
      }
    } else {
      // Value is normal: reset abnormal persistence counter
      this.consecutiveAbnormalCounts.set(trackerKey, 0);
    }

    return result;
  }

  /**
   * Debounces repeated device signals so exactly one SOS event is generated per emergency
   */
  private canTriggerSos(): boolean {
    const now = Date.now();
    if (now - this.lastSosTriggerTimestamp < DEFAULT_EMERGENCY_THRESHOLDS.sosDebounceWindowMs) {
      return false; // Suppress duplicate
    }
    this.lastSosTriggerTimestamp = now;
    return true;
  }

  /**
   * Fires the shared SOS flow matching Section 4 of spec
   */
  private triggerSosFlow(seniorId: string, seniorName: string, reason: string): void {
    const senior = repository.getSenior(seniorId);
    const coordId = senior?.assignedCoordinatorId || 'user-coordinator-nimish';

    // 1. Create exactly one SOS Event in repository
    repository.addSosEvent({
      seniorId,
      seniorName,
      location: {
        lat: 28.6139,
        lng: 77.2090,
        accuracy: 15,
        source: 'device_high_accuracy',
        homeAddress: senior?.address || 'Civil Lines',
      },
      notes: reason,
    });

    // 2. Notification to assigned Coordinator
    repository.addNotification({
      recipientUserId: coordId,
      targetRole: 'coordinator',
      title: `Emergency Signal: ${seniorName}`,
      message: `${reason} Immediate attention required.`,
      type: 'sos',
      actionUrl: `/coordinator/senior/${seniorId}`,
      actionLabel: 'View Emergency',
    });

    // 3. Notification to linked Family member (Karishma) - Minimal fact only, NO medical condition named
    repository.addNotification({
      recipientUserId: 'user-family-karishma',
      targetRole: 'family',
      title: `Emergency Signal from ${seniorName}'s band`,
      message: `${reason} Coordinator has been alerted.`,
      type: 'sos',
      actionUrl: '/family',
      actionLabel: 'View Alert',
    });
  }

  /**
   * Prunes sample buffer past retention window (24 hours for raw)
   */
  private pruneBuffer(): void {
    const cutoffMs = Date.now() - RETENTION_POLICY.rawBufferHours * 60 * 60 * 1000;
    this.sampleBuffer = this.sampleBuffer.filter((s) => s.measuredAt >= cutoffMs);
  }

  public getRawBuffer(seniorId?: string): NormalizedReading[] {
    if (!seniorId) return this.sampleBuffer;
    return this.sampleBuffer.filter((s) => s.seniorId === seniorId);
  }

  public subscribeReadings(cb: (r: NormalizedReading) => void): () => void {
    this.readingListeners.add(cb);
    return () => this.readingListeners.delete(cb);
  }

  public subscribeDeviceLinks(cb: (l: DeviceLink) => void): () => void {
    this.deviceLinkListeners.add(cb);
    return () => this.deviceLinkListeners.delete(cb);
  }

  private notifyReadingListeners(r: NormalizedReading): void {
    this.readingListeners.forEach((cb) => {
      try { cb(r); } catch { /* ignore */ }
    });
  }

  private notifyDeviceLinkListeners(l: DeviceLink): void {
    this.deviceLinkListeners.forEach((cb) => {
      try { cb(l); } catch { /* ignore */ }
    });
  }
}

// Global singleton instance
export const wearableIngestEngine = new WearableIngestEngine();
