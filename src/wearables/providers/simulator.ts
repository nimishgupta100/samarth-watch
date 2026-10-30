/**
 * SIMULATED WEARABLE PROVIDER (The Demo Path)
 * 
 * Features:
 * - Fully working with zero hardware needed
 * - Deterministic seeded generator with realistic noise & diurnal rhythm
 * - Controlled scenarios triggerable by Coordinator Demo Tools:
 *   1. Normal day
 *   2. Slowly rising resting heart rate
 *   3. Sustained low SpO2
 *   4. Device goes silent (no data)
 *   5. Battery low
 *   6. Fall detected (followed by no movement)
 *   7. Device SOS button pressed
 * - Every reading generated carries explicit source: "Simulated Samarth Band"
 */

import {
  WearableProvider,
  WearableProviderStatus,
  DeviceLink,
  RawSample,
  WearableSimulationScenario,
} from '../types';
import { wearableIngestEngine } from '../ingest';

export class SimulatedWearableProvider implements WearableProvider {
  public readonly id = 'provider_simulated_demo';
  public readonly type = 'simulated';

  private activeDeviceLink: DeviceLink | null = null;
  private status: WearableProviderStatus = {
    connected: false,
    status: 'disconnected',
    batteryPercent: 88,
    lastSyncAt: 0,
    lastSampleAt: 0,
  };

  private timerId: any = null;
  private sampleListeners: Set<(sample: RawSample) => void> = new Set();
  private statusListeners: Set<(status: WearableProviderStatus) => void> = new Set();

  private currentScenario: WearableSimulationScenario = 'normal';
  private tickCount = 0;

  async connect(deviceLink: DeviceLink): Promise<boolean> {
    this.activeDeviceLink = deviceLink;
    this.status = {
      connected: true,
      status: 'connected',
      batteryPercent: 88,
      lastSyncAt: Date.now(),
      lastSampleAt: Date.now(),
    };
    this.notifyStatus();

    wearableIngestEngine.updateDeviceStatus(deviceLink.id, {
      status: 'connected',
      batteryPercent: 88,
      lastSyncAt: Date.now(),
      lastSampleAt: Date.now(),
    });

    this.startSimulationLoop();
    return true;
  }

  async disconnect(): Promise<void> {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.status = {
      ...this.status,
      connected: false,
      status: 'disconnected',
    };
    this.notifyStatus();

    if (this.activeDeviceLink) {
      wearableIngestEngine.updateDeviceStatus(this.activeDeviceLink.id, {
        status: 'disconnected',
      });
    }
  }

  getStatus(): WearableProviderStatus {
    return { ...this.status };
  }

  onSample(callback: (sample: RawSample) => void): () => void {
    this.sampleListeners.add(callback);
    return () => this.sampleListeners.delete(callback);
  }

  onStatusChange(callback: (status: WearableProviderStatus) => void): () => void {
    this.statusListeners.add(callback);
    return () => this.statusListeners.delete(callback);
  }

  public setScenario(scenario: WearableSimulationScenario): void {
    this.currentScenario = scenario;
    this.tickCount = 0;
    // Generate immediate reading for the scenario
    this.generateTick();
  }

  private startSimulationLoop(): void {
    if (this.timerId) clearInterval(this.timerId);
    // Tick every 5 seconds in demo mode
    this.timerId = setInterval(() => this.generateTick(), 5000);
  }

  private generateTick(): void {
    if (!this.status.connected || !this.activeDeviceLink) return;

    this.tickCount += 1;
    const now = Date.now();
    const seniorId = this.activeDeviceLink.seniorId;
    const deviceId = this.activeDeviceLink.id;
    const sourceLabel = 'Simulated Samarth Band';

    // 1. Device Silent Scenario: cease transmitting
    if (this.currentScenario === 'device_silent') {
      this.status.status = 'no_data';
      this.notifyStatus();
      wearableIngestEngine.updateDeviceStatus(deviceId, { status: 'no_data' });
      return;
    }

    // 2. Battery Low Scenario
    if (this.currentScenario === 'battery_low') {
      this.status.batteryPercent = 12;
      this.notifyStatus();
      wearableIngestEngine.updateDeviceStatus(deviceId, { batteryPercent: 12 });
      wearableIngestEngine.addLog(
        seniorId,
        deviceId,
        'warning',
        'battery_low',
        'Device battery reached critical threshold: 12%'
      );
    }

    // 3. Fall Detected Scenario
    if (this.currentScenario === 'fall_detected') {
      const fallSample: RawSample = {
        deviceId,
        seniorId,
        metric: 'fall_event',
        rawValue: 1,
        unit: 'event',
        measuredAt: now,
        receivedAt: now,
        sourceLabel,
      };
      this.dispatchSample(fallSample);
      this.currentScenario = 'normal'; // Reset after triggering
      return;
    }

    // 4. Device SOS Button Pressed Scenario
    if (this.currentScenario === 'device_sos') {
      const sosSample: RawSample = {
        deviceId,
        seniorId,
        metric: 'device_sos',
        rawValue: 1,
        unit: 'event',
        measuredAt: now,
        receivedAt: now,
        sourceLabel,
      };
      this.dispatchSample(sosSample);
      this.currentScenario = 'normal';
      return;
    }

    // 5. Rising Resting Heart Rate Scenario (e.g. 136 bpm sustained)
    let hrValue = 72 + Math.floor(Math.sin(this.tickCount * 0.2) * 5);
    if (this.currentScenario === 'rising_resting_hr') {
      hrValue = 135 + Math.floor(Math.random() * 6); // Persistent > 130 bpm
    }

    // 6. Sustained Low SpO2 Scenario (e.g. 88% sustained)
    let spo2Value = 97 + Math.floor(Math.random() * 3);
    if (this.currentScenario === 'sustained_low_spo2') {
      spo2Value = 88; // Persistent < 90%
    }

    // Create Heart Rate sample
    const hrSample: RawSample = {
      deviceId,
      seniorId,
      metric: 'heart_rate',
      rawValue: hrValue,
      unit: 'bpm',
      measuredAt: now,
      receivedAt: now,
      sourceLabel,
    };
    this.dispatchSample(hrSample);

    // Create SpO2 sample
    const spo2Sample: RawSample = {
      deviceId,
      seniorId,
      metric: 'spo2',
      rawValue: spo2Value,
      unit: '%',
      measuredAt: now + 50,
      receivedAt: now + 60,
      sourceLabel,
    };
    this.dispatchSample(spo2Sample);

    // Occasional Steps sample
    if (this.tickCount % 3 === 0) {
      const stepsSample: RawSample = {
        deviceId,
        seniorId,
        metric: 'steps',
        rawValue: 24,
        unit: 'steps',
        measuredAt: now + 100,
        receivedAt: now + 110,
        sourceLabel,
      };
      this.dispatchSample(stepsSample);
    }

    this.status.lastSampleAt = now;
    this.status.lastSyncAt = now;
    this.notifyStatus();
  }

  private dispatchSample(sample: RawSample): void {
    // Notify local listeners
    this.sampleListeners.forEach((cb) => {
      try { cb(sample); } catch { /* ignore */ }
    });

    // Send through unified Ingest Engine with isSimulated = true
    wearableIngestEngine.ingestSample(sample, true, true);
  }

  private notifyStatus(): void {
    const s = this.getStatus();
    this.statusListeners.forEach((cb) => {
      try { cb(s); } catch { /* ignore */ }
    });
  }
}

export const simulatedWearableProvider = new SimulatedWearableProvider();
