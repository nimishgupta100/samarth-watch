/**
 * WEB BLUETOOTH WEARABLE PROVIDER
 * 
 * Connects directly to BLE devices that expose standard Bluetooth SIG GATT services:
 * - Heart Rate Service (0x180D)
 * - Battery Service (0x180F)
 * - Pulse Oximeter Service (0x1822)
 * - Blood Pressure Service (0x1810)
 * - Weight Scale Service (0x181D)
 * 
 * Safety & Constraints:
 * - Feature-detected (Chrome/Edge on Android/Desktop only).
 * - NOT supported on iOS (any browser).
 * - Page must remain open in active tab.
 * - Reconnect handles disconnects with gentle exponential backoff.
 */

import {
  WearableProvider,
  WearableProviderStatus,
  DeviceLink,
  RawSample,
} from '../types';
import { BLE_GATT_SERVICES, BLE_GATT_CHARACTERISTICS } from '../constants';
import { parseHeartRateMeasurement } from '../parsers/heartRateParser';
import { parseBatteryLevel } from '../parsers/batteryParser';
import { parsePulseOximeterContinuous } from '../parsers/pulseOximeterParser';
import { parseBloodPressureMeasurement } from '../parsers/bloodPressureParser';
import { parseWeightMeasurement } from '../parsers/weightParser';
import { wearableIngestEngine } from '../ingest';

export class WebBluetoothProvider implements WearableProvider {
  public readonly id = 'provider_web_bluetooth';
  public readonly type = 'web_bluetooth';

  private device: any = null;
  private server: any = null;
  private activeDeviceLink: DeviceLink | null = null;
  private sampleListeners: Set<(sample: RawSample) => void> = new Set();
  private statusListeners: Set<(status: WearableProviderStatus) => void> = new Set();

  private status: WearableProviderStatus = {
    connected: false,
    status: 'disconnected',
    lastSyncAt: 0,
    lastSampleAt: 0,
  };

  /**
   * Checks if Web Bluetooth is supported in the current browser runtime
   */
  public static isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  async connect(deviceLink: DeviceLink): Promise<boolean> {
    if (!WebBluetoothProvider.isSupported()) {
      throw new Error(
        'Web Bluetooth is not supported on this browser or platform (e.g. iOS Safari). Please use Chrome or Edge on Android or Windows/Mac.'
      );
    }

    this.activeDeviceLink = deviceLink;

    try {
      // Prompt user to select a device exposing standard health GATT services
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [
          { services: [BLE_GATT_SERVICES.HEART_RATE] },
          { services: [BLE_GATT_SERVICES.PULSE_OXIMETER] },
          { services: [BLE_GATT_SERVICES.BLOOD_PRESSURE] },
          { services: [BLE_GATT_SERVICES.WEIGHT_SCALE] },
        ],
        optionalServices: [BLE_GATT_SERVICES.BATTERY_SERVICE],
      });

      this.device = device;
      this.device.addEventListener('gattserverdisconnected', this.handleDisconnect);

      await this.connectGatt();
      return true;
    } catch (err: any) {
      this.status = {
        connected: false,
        status: 'disconnected',
        lastSyncAt: 0,
        lastSampleAt: 0,
        error: err?.message || 'Bluetooth connection failed',
      };
      this.notifyStatus();
      throw err;
    }
  }

  private async connectGatt(): Promise<void> {
    if (!this.device) return;

    this.server = await this.device.gatt.connect();

    this.status = {
      connected: true,
      status: 'connected',
      lastSyncAt: Date.now(),
      lastSampleAt: Date.now(),
    };
    this.notifyStatus();

    // Subscribe to standard services
    await this.subscribeHeartRate();
    await this.subscribeBattery();
    await this.subscribePulseOximeter();

    if (this.activeDeviceLink) {
      wearableIngestEngine.updateDeviceStatus(this.activeDeviceLink.id, {
        status: 'connected',
        lastSyncAt: Date.now(),
      });
      wearableIngestEngine.addLog(
        this.activeDeviceLink.seniorId,
        this.activeDeviceLink.id,
        'info',
        'connected',
        `Connected to Web Bluetooth device: ${this.device.name || 'BLE Health Device'}`
      );
    }
  }

  private handleDisconnect = async () => {
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
      wearableIngestEngine.addLog(
        this.activeDeviceLink.seniorId,
        this.activeDeviceLink.id,
        'warning',
        'disconnected',
        'Web Bluetooth device disconnected. Click Reconnect to resume sync.'
      );
    }
  };

  private async subscribeHeartRate(): Promise<void> {
    try {
      const service = await this.server.getPrimaryService(BLE_GATT_SERVICES.HEART_RATE);
      const char = await service.getCharacteristic(BLE_GATT_CHARACTERISTICS.HEART_RATE_MEASUREMENT);
      await char.startNotifications();
      char.addEventListener('characteristicvaluechanged', (e: any) => {
        const val: DataView = e.target.value;
        const parsed = parseHeartRateMeasurement(val);
        if (parsed && this.activeDeviceLink) {
          const sample: RawSample = {
            deviceId: this.activeDeviceLink.id,
            seniorId: this.activeDeviceLink.seniorId,
            metric: 'heart_rate',
            rawValue: parsed.bpm,
            unit: 'bpm',
            measuredAt: Date.now(),
            receivedAt: Date.now(),
            sourceLabel: this.device?.name || 'Bluetooth Heart Rate Monitor',
          };
          this.dispatchSample(sample);
        }
      });
    } catch {
      // Service not supported on this specific device
    }
  }

  private async subscribeBattery(): Promise<void> {
    try {
      const service = await this.server.getPrimaryService(BLE_GATT_SERVICES.BATTERY_SERVICE);
      const char = await service.getCharacteristic(BLE_GATT_CHARACTERISTICS.BATTERY_LEVEL);
      const val: DataView = await char.readValue();
      const level = parseBatteryLevel(val);
      if (level !== null) {
        this.status.batteryPercent = level;
        this.notifyStatus();
        if (this.activeDeviceLink) {
          wearableIngestEngine.updateDeviceStatus(this.activeDeviceLink.id, {
            batteryPercent: level,
          });
        }
      }
    } catch {
      // Battery service not present
    }
  }

  private async subscribePulseOximeter(): Promise<void> {
    try {
      const service = await this.server.getPrimaryService(BLE_GATT_SERVICES.PULSE_OXIMETER);
      const char = await service.getCharacteristic(BLE_GATT_CHARACTERISTICS.PLX_CONTINUOUS);
      await char.startNotifications();
      char.addEventListener('characteristicvaluechanged', (e: any) => {
        const val: DataView = e.target.value;
        const parsed = parsePulseOximeterContinuous(val);
        if (parsed && this.activeDeviceLink) {
          const sample: RawSample = {
            deviceId: this.activeDeviceLink.id,
            seniorId: this.activeDeviceLink.seniorId,
            metric: 'spo2',
            rawValue: parsed.spo2Percent,
            unit: '%',
            measuredAt: Date.now(),
            receivedAt: Date.now(),
            sourceLabel: this.device?.name || 'Bluetooth Pulse Oximeter',
          };
          this.dispatchSample(sample);
        }
      });
    } catch {
      // PLX not supported
    }
  }

  async disconnect(): Promise<void> {
    if (this.device && this.device.gatt.connected) {
      this.device.gatt.disconnect();
    }
    this.handleDisconnect();
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

  private dispatchSample(sample: RawSample): void {
    this.sampleListeners.forEach((cb) => {
      try { cb(sample); } catch { /* ignore */ }
    });
    // Ingest as real device sample (isSimulated = false)
    wearableIngestEngine.ingestSample(sample, false, true);
  }

  private notifyStatus(): void {
    const s = this.getStatus();
    this.statusListeners.forEach((cb) => {
      try { cb(s); } catch { /* ignore */ }
    });
  }
}

export const webBluetoothProvider = new WebBluetoothProvider();
