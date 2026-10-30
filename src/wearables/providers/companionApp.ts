/**
 * COMPANION APP WEARABLE PROVIDER (Production Interface & Typed Stub)
 * 
 * Production Path:
 * - Native Android Companion App integrating Android Health Connect (Health Platform).
 * - Native iOS Companion App integrating Apple HealthKit.
 * - Collects background continuous sensor data and uploads encrypted batches
 *   to POST /v1/ingest/readings with device token authentication.
 * 
 * Status in Prototype:
 * - Typed stub: Throws a clear explanatory error if invoked.
 * - Web browsers (including Safari and Chrome Mobile) cannot access HealthKit or Health Connect directly.
 */

import { WearableProvider, WearableProviderStatus, DeviceLink, RawSample } from '../types';

export class CompanionAppProvider implements WearableProvider {
  public readonly id = 'provider_companion_app_stub';
  public readonly type = 'companion';

  async connect(deviceLink: DeviceLink): Promise<boolean> {
    throw new Error(
      `Companion mobile app sync (Health Connect / HealthKit for ${deviceLink.vendorModelName}) is not available in a pure web browser. Production requires a native Android/iOS companion application installed on the user's phone.`
    );
  }

  async disconnect(): Promise<void> {
    // No-op for stub
  }

  getStatus(): WearableProviderStatus {
    return {
      connected: false,
      status: 'disconnected',
      lastSyncAt: 0,
      lastSampleAt: 0,
      error: 'Companion app requires native Android/iOS installation.',
    };
  }

  onSample(_callback: (sample: RawSample) => void): () => void {
    return () => {};
  }

  onStatusChange(_callback: (status: WearableProviderStatus) => void): () => void {
    return () => {};
  }
}

export const companionAppProvider = new CompanionAppProvider();
