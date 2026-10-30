/**
 * CLOUD SYNC WEARABLE PROVIDER (Production Interface & Typed Stub)
 * 
 * Production Path:
 * - Vendor Cloud APIs (Fitbit Web API, Garmin Health API, Oura Cloud API, Withings Health Mate API).
 * - Requires server-side OAuth 2.0 PKCE exchange, client secrets, and webhook/polling ingestion workers.
 * - Device tokens must live securely on the backend server, NEVER in the browser bundle.
 * 
 * Status in Prototype:
 * - Typed stub: Throws a clear explanatory error if invoked.
 * - Never present as working without the backend infrastructure.
 */

import { WearableProvider, WearableProviderStatus, DeviceLink, RawSample } from '../types';

export class CloudSyncProvider implements WearableProvider {
  public readonly id = 'provider_cloud_sync_stub';
  public readonly type = 'cloud';

  async connect(deviceLink: DeviceLink): Promise<boolean> {
    throw new Error(
      `Cloud sync with vendor (${deviceLink.vendorModelName}) is not available in this browser prototype. Production requires backend OAuth 2.0 authorization with developer credentials and webhook ingestion via POST /v1/ingest/readings.`
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
      error: 'Vendor Cloud OAuth requires backend server infrastructure.',
    };
  }

  onSample(_callback: (sample: RawSample) => void): () => void {
    return () => {};
  }

  onStatusChange(_callback: (status: WearableProviderStatus) => void): () => void {
    return () => {};
  }
}

export const cloudSyncProvider = new CloudSyncProvider();
