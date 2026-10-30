/**
 * SAMARTH BAND CONNECTION MANAGER
 * 
 * Central manager for wearable lifecycle, auto-reconnection with capped exponential backoff,
 * visibility change listeners, watchdog sample monitoring, Screen Wake Lock,
 * disconnect escalation rules, and uptime percentage computation.
 */

import { DeviceLink, DeviceLogEntry, DeviceSyncStatus } from './types';
import { wearableIngestEngine } from './ingest';
import { simulatedWearableProvider } from './providers/simulator';
import { webBluetoothProvider, WebBluetoothProvider } from './providers/webBluetooth';
import { TIMING_CONFIG, BAND_DISCONNECT_ESCALATION, DEFAULT_TIER1_THRESHOLDS } from './constants';

export interface EscalationStatus {
  minutesDisconnected: number;
  showSeniorBanner: boolean;
  alertCoordinator: boolean;
  notifyFamily: boolean;
}

export class BandConnectionManager {
  private static instance: BandConnectionManager;
  private seniorId: string;
  private retryAttempt = 0;
  private retryTimer: any = null;
  private watchdogTimer: any = null;
  private wakeLockSentinel: any = null;
  private keepScreenOnRequested = false;
  private lastSeniorBannerShownAt = 0;
  private coordinatorAlertTriggered = false;
  private familyAlertTriggered = false;
  private disconnectStartTime: number | null = null;

  private constructor(seniorId = 'senior-kamla-001') {
    this.seniorId = seniorId;
    this.initListeners();
    this.startWatchdog();
  }

  public static getInstance(seniorId = 'senior-kamla-001'): BandConnectionManager {
    if (!BandConnectionManager.instance) {
      BandConnectionManager.instance = new BandConnectionManager(seniorId);
    }
    return BandConnectionManager.instance;
  }

  public setSeniorId(seniorId: string) {
    this.seniorId = seniorId;
  }

  /**
   * Auto-reconnect on app start to previously permitted devices (Chromium Web Bluetooth)
   */
  public async autoReconnectOnStart(): Promise<boolean> {
    const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
    if (!nav || !nav.bluetooth || typeof nav.bluetooth.getDevices !== 'function') {
      return false;
    }

    try {
      const devices = await nav.bluetooth.getDevices();
      if (devices && devices.length > 0) {
        const permitted = devices[0];
        const link = wearableIngestEngine.getDeviceLinksForSenior(this.seniorId)[0];
        if (link && link.providerType === 'web_bluetooth') {
          return await webBluetoothProvider.connect(link);
        }
      }
    } catch {
      // Graceful fallback if getDevices is not permitted or rejected
    }
    return false;
  }

  /**
   * Reconnect with capped exponential backoff
   */
  public scheduleReconnection(device: DeviceLink) {
    if (this.retryTimer) clearTimeout(this.retryTimer);

    if (this.retryAttempt >= TIMING_CONFIG.bluetoothMaxRetries) {
      this.updateDeviceStatus(device, 'disconnected');
      return;
    }

    const backoffMs = Math.min(
      TIMING_CONFIG.bluetoothBackoffInitialMs * Math.pow(TIMING_CONFIG.bluetoothBackoffFactor, this.retryAttempt),
      TIMING_CONFIG.bluetoothBackoffMaxMs
    );

    this.updateDeviceStatus(device, 'reconnecting');

    this.retryTimer = setTimeout(async () => {
      this.retryAttempt++;
      try {
        let connected = false;
        if (device.providerType === 'simulated') {
          connected = await simulatedWearableProvider.connect(device);
        } else if (device.providerType === 'web_bluetooth') {
          connected = await webBluetoothProvider.connect(device);
        }

        if (connected) {
          this.retryAttempt = 0;
          this.disconnectStartTime = null;
          this.coordinatorAlertTriggered = false;
          this.familyAlertTriggered = false;
          this.updateDeviceStatus(device, 'connected');
        } else {
          this.scheduleReconnection(device);
        }
      } catch {
        this.scheduleReconnection(device);
      }
    }, backoffMs);
  }

  /**
   * Page Visibility & Focus Handling
   */
  private initListeners() {
    if (typeof document === 'undefined') return;

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // 1. Re-acquire wake lock if senior enabled it
        if (this.keepScreenOnRequested) {
          this.enableKeepScreenOn().catch(() => {});
        }

        // 2. Reconnect immediately if disconnected or reconnecting
        const device = this.getPrimaryDevice();
        if (device && (device.status === 'disconnected' || device.status === 'reconnecting')) {
          this.retryAttempt = 0;
          this.scheduleReconnection(device);
        }
      } else {
        // Page hidden - release wake lock
        this.releaseWakeLock();
      }
    });
  }

  /**
   * Watchdog noticing "connected but no samples for N minutes"
   */
  private startWatchdog() {
    if (this.watchdogTimer) clearInterval(this.watchdogTimer);

    this.watchdogTimer = setInterval(() => {
      const device = this.getPrimaryDevice();
      if (!device) return;

      const now = Date.now();

      // If connected but silence past threshold
      if (device.status === 'connected') {
        const silenceMinutes = (now - device.lastSampleAt) / 60000;
        if (silenceMinutes >= DEFAULT_TIER1_THRESHOLDS.noDataAlertMinutes / 4) { // 30 min check
          this.updateDeviceStatus(device, 'no_data');
        }
      }

      // Check disconnect escalation
      if (device.status === 'disconnected' || device.status === 'no_data') {
        if (!this.disconnectStartTime) {
          this.disconnectStartTime = now;
        }
      } else {
        this.disconnectStartTime = null;
      }
    }, 30000); // Check every 30s
  }

  /**
   * Disconnect Escalation Evaluation
   */
  public getEscalationStatus(familyConsentGranted = true): EscalationStatus {
    if (!this.disconnectStartTime) {
      return {
        minutesDisconnected: 0,
        showSeniorBanner: false,
        alertCoordinator: false,
        notifyFamily: false,
      };
    }

    const now = Date.now();
    const minutesDisconnected = Math.round((now - this.disconnectStartTime) / 60000);

    // After 5 minutes: show banner, repeated at most every 15 minutes
    const showSeniorBanner =
      minutesDisconnected >= BAND_DISCONNECT_ESCALATION.seniorBannerMinutes &&
      now - this.lastSeniorBannerShownAt >= BAND_DISCONNECT_ESCALATION.seniorBannerRepeatMinutes * 60000;

    // After 15 minutes: alert coordinator Tier 1 signal
    const alertCoordinator =
      minutesDisconnected >= BAND_DISCONNECT_ESCALATION.coordinatorAlertMinutes &&
      !this.coordinatorAlertTriggered;

    // After 60 minutes: notify family if consent granted
    const notifyFamily =
      minutesDisconnected >= BAND_DISCONNECT_ESCALATION.familyNotifyMinutes &&
      !this.familyAlertTriggered &&
      familyConsentGranted;

    return {
      minutesDisconnected,
      showSeniorBanner,
      alertCoordinator,
      notifyFamily,
    };
  }

  public acknowledgeSeniorBanner() {
    this.lastSeniorBannerShownAt = Date.now();
  }

  public markCoordinatorAlertSent() {
    this.coordinatorAlertTriggered = true;
  }

  public markFamilyAlertSent() {
    this.familyAlertTriggered = true;
  }

  /**
   * Screen Wake Lock API
   */
  public isWakeLockSupported(): boolean {
    return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  }

  public async enableKeepScreenOn(): Promise<boolean> {
    this.keepScreenOnRequested = true;
    if (!this.isWakeLockSupported()) return false;

    try {
      this.wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
      this.wakeLockSentinel.addEventListener('release', () => {
        this.wakeLockSentinel = null;
      });
      return true;
    } catch {
      return false;
    }
  }

  public releaseWakeLock() {
    if (this.wakeLockSentinel) {
      try {
        this.wakeLockSentinel.release();
      } catch {}
      this.wakeLockSentinel = null;
    }
  }

  public disableKeepScreenOn() {
    this.keepScreenOnRequested = false;
    this.releaseWakeLock();
  }

  public isKeepScreenOnActive(): boolean {
    return this.keepScreenOnRequested && Boolean(this.wakeLockSentinel);
  }

  /**
   * Compute connected percentage for 24h and 7d from real logs
   */
  public computeConnectedPercentage(windowHours: 24 | 168): string {
    const logs = wearableIngestEngine.getLogs(this.seniorId);
    const now = Date.now();
    const windowMs = windowHours * 60 * 60 * 1000;
    const windowStart = now - windowMs;

    const windowLogs = logs.filter((l) => l.timestamp >= windowStart);

    // Require at least 2 distinct log points or 1 hour of history before showing %
    if (windowLogs.length < 2 && logs.length < 3) {
      return 'unknown';
    }

    let connectedMs = 0;
    let lastTimestamp = windowStart;
    let wasConnected = true;

    for (const log of windowLogs.sort((a, b) => a.timestamp - b.timestamp)) {
      if (wasConnected) {
        connectedMs += log.timestamp - lastTimestamp;
      }
      if (log.eventType === 'connected' || log.eventType === 'reconnected') {
        wasConnected = true;
      } else if (log.eventType === 'disconnected') {
        wasConnected = false;
      }
      lastTimestamp = log.timestamp;
    }

    if (wasConnected) {
      connectedMs += now - lastTimestamp;
    }

    const pct = Math.min(100, Math.max(0, Math.round((connectedMs / windowMs) * 100)));
    return `${pct}%`;
  }

  public getPrimaryDevice(): DeviceLink | null {
    const links = wearableIngestEngine.getDeviceLinksForSenior(this.seniorId);
    return links[0] || null;
  }

  private updateDeviceStatus(device: DeviceLink, status: DeviceSyncStatus) {
    const updated = { ...device, status, lastSyncAt: Date.now() };
    wearableIngestEngine.registerDeviceLink(updated);
  }

  public destroy() {
    if (this.retryTimer) clearTimeout(this.retryTimer);
    if (this.watchdogTimer) clearInterval(this.watchdogTimer);
    this.releaseWakeLock();
  }
}

export const bandConnectionManager = BandConnectionManager.getInstance();

/**
 * Production Path Interfaces (Documented and typed; do not pretend native collection works in web browser)
 */
export interface ICompanionAppBridge {
  isCompanionInstalled(): Promise<boolean>;
  getHealthConnectToken(): Promise<string | null>;
  requestForegroundBleService(): Promise<void>;
}

export interface IVendorCloudSync {
  provider: 'withings' | 'garmin' | 'fitbit';
  authorizeOAuth(): Promise<string>;
  fetchOAuthVitals(cursor: string): Promise<any>;
}
