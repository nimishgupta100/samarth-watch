/**
 * SAMARTH WATCH LOCATION SERVICE & MODELS
 * 
 * Manages location readings, sharing consent, background-safe collection,
 * and emergency location overrides.
 */

import { LocationReading, LocationSource, LocationMode, LocationSharingChoice } from '../data/schema';

export type { LocationReading, LocationSource, LocationMode, LocationSharingChoice };

export interface SOSLocation {
  lat: number;
  lng: number;
  accuracy: number;
  source: 'live' | 'cached' | 'home_address';
  homeAddress?: string;
}

let lastKnownLocation: SOSLocation | null = null;
let lastKnownReading: LocationReading | null = null;

// Mapping helpers to preserve existing SOS flow and test suite
export function sosLocationToLocationReading(
  sosLoc: SOSLocation,
  seniorId: string,
  mode: LocationMode = 'emergency'
): LocationReading {
  const sourceMap: Record<SOSLocation['source'], LocationSource> = {
    live: 'phone',
    cached: 'cached',
    home_address: 'home_address',
  };

  const reading: LocationReading = {
    id: `loc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    seniorId,
    lat: sosLoc.lat,
    lng: sosLoc.lng,
    accuracy: Math.round(sosLoc.accuracy || 25),
    measuredAt: new Date().toISOString(),
    source: sourceMap[sosLoc.source] || 'phone',
    mode,
  };

  lastKnownReading = reading;
  return reading;
}

export function locationReadingToSosLocation(reading: LocationReading): SOSLocation {
  const sourceMap: Record<LocationSource, SOSLocation['source']> = {
    phone: 'live',
    band: 'live',
    simulated: 'live',
    cached: 'cached',
    home_address: 'home_address',
  };

  return {
    lat: reading.lat,
    lng: reading.lng,
    accuracy: reading.accuracy,
    source: sourceMap[reading.source] || 'cached',
  };
}

export function getCurrentLocation(timeoutMs = 8000): Promise<SOSLocation> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    const timer = setTimeout(() => reject(new Error('Geolocation timeout')), timeoutMs);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        const loc: SOSLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          source: 'live',
        };
        lastKnownLocation = loc;
        resolve(loc);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 30000 }
    );
  });
}

export function getLastKnownOrHome(homeAddress: string): SOSLocation {
  if (lastKnownLocation) {
    return { ...lastKnownLocation, source: 'cached' };
  }
  // Demo fallback coordinates for Lucknow, India (26.8467° N, 80.9462° E)
  return { lat: 26.8467, lng: 80.9462, accuracy: 500, source: 'home_address', homeAddress };
}

export function getLastKnownReading(): LocationReading | null {
  return lastKnownReading;
}

// Distance calculation in metres (Haversine formula)
export function calculateDistanceMetres(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Location Source Providers interface
export interface ILocationProvider {
  readonly source: LocationSource;
  isAvailable(): boolean;
  getLocation(): Promise<{ lat: number; lng: number; accuracy: number }>;
}

export class PhoneLocationProvider implements ILocationProvider {
  readonly source: LocationSource = 'phone';
  isAvailable(): boolean {
    return typeof navigator !== 'undefined' && Boolean(navigator.geolocation);
  }
  async getLocation(): Promise<{ lat: number; lng: number; accuracy: number }> {
    const loc = await getCurrentLocation(8000);
    return { lat: loc.lat, lng: loc.lng, accuracy: loc.accuracy };
  }
}

export class SimulatedLocationProvider implements ILocationProvider {
  readonly source: LocationSource = 'simulated';
  isAvailable(): boolean {
    return true;
  }
  async getLocation(): Promise<{ lat: number; lng: number; accuracy: number }> {
    // Deterministic slight drift around Lucknow demo coordinates for testing
    const jitterLat = (Math.random() - 0.5) * 0.002;
    const jitterLng = (Math.random() - 0.5) * 0.002;
    return {
      lat: Number((26.8467 + jitterLat).toFixed(5)),
      lng: Number((80.9462 + jitterLng).toFixed(5)),
      accuracy: 15,
    };
  }
}

export class BandGattLocationProvider implements ILocationProvider {
  readonly source: LocationSource = 'band';
  isAvailable(): boolean {
    // Bluetooth Location and Navigation Service (UUID 0x1819)
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }
  async getLocation(): Promise<{ lat: number; lng: number; accuracy: number }> {
    throw new Error('Band Bluetooth GATT Location & Navigation service not detected on this device');
  }
}

export class CloudLocationProvider implements ILocationProvider {
  readonly source: LocationSource = 'phone';
  isAvailable(): boolean {
    return false;
  }
  async getLocation(): Promise<{ lat: number; lng: number; accuracy: number }> {
    throw new Error('Cloud location sync requires mobile companion app or vendor API');
  }
}

/**
 * Live Location Collector
 * Collects readings with watchPosition, minimum interval, distance filter,
 * and pauses when page is hidden or sharing is not 'live'.
 */
export class LocationCollector {
  private watchId: number | null = null;
  private lastReading: LocationReading | null = null;
  private lastCollectionTime = 0;
  private minIntervalMs: number;
  private minDistanceMetres: number;
  private seniorId: string;
  private sharingChoice: LocationSharingChoice;
  private onReadingCallback?: (reading: LocationReading) => void;
  private onErrorCallback?: (friendlyMessage: string) => void;

  constructor(
    seniorId: string,
    sharingChoice: LocationSharingChoice = 'emergency_only',
    minIntervalMs = 120000, // 2 minutes
    minDistanceMetres = 50 // 50 metres
  ) {
    this.seniorId = seniorId;
    this.sharingChoice = sharingChoice;
    this.minIntervalMs = minIntervalMs;
    this.minDistanceMetres = minDistanceMetres;

    // Visibility change listener
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  public setSharingChoice(choice: LocationSharingChoice) {
    this.sharingChoice = choice;
    if (choice === 'live') {
      this.start();
    } else {
      this.stop();
    }
  }

  public onReading(cb: (reading: LocationReading) => void) {
    this.onReadingCallback = cb;
  }

  public onError(cb: (friendlyMessage: string) => void) {
    this.onErrorCallback = cb;
  }

  public start() {
    if (this.sharingChoice !== 'live') {
      return;
    }
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      return;
    }
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      this.onErrorCallback?.('Location is not supported on this device');
      return;
    }

    if (this.watchId !== null) return;

    try {
      this.watchId = navigator.geolocation.watchPosition(
        (pos) => this.handlePosition(pos),
        (err) => this.handleError(err),
        { enableHighAccuracy: false, maximumAge: 60000, timeout: 15000 }
      );
    } catch {
      this.onErrorCallback?.('Unable to start location tracking');
    }
  }

  public stop() {
    if (this.watchId !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  private handleVisibilityChange = () => {
    if (typeof document === 'undefined') return;
    if (document.visibilityState === 'hidden') {
      // Pause collection when app is in background/tab hidden
      this.stop();
    } else if (document.visibilityState === 'visible' && this.sharingChoice === 'live') {
      // Resume when page returns to view
      this.start();
    }
  };

  private handlePosition(pos: GeolocationPosition) {
    const now = Date.now();
    // Check interval
    if (now - this.lastCollectionTime < this.minIntervalMs && this.lastReading) {
      return;
    }

    const { latitude, longitude, accuracy } = pos.coords;

    // Check distance filter if previous reading exists
    if (this.lastReading) {
      const dist = calculateDistanceMetres(
        this.lastReading.lat,
        this.lastReading.lng,
        latitude,
        longitude
      );
      if (dist < this.minDistanceMetres && now - this.lastCollectionTime < this.minIntervalMs * 2) {
        return;
      }
    }

    const reading: LocationReading = {
      id: `loc_${now}_${Math.random().toString(36).substring(2, 6)}`,
      seniorId: this.seniorId,
      lat: latitude,
      lng: longitude,
      accuracy: Math.round(accuracy),
      measuredAt: new Date(now).toISOString(),
      source: 'phone',
      mode: 'live',
    };

    this.lastReading = reading;
    this.lastCollectionTime = now;
    lastKnownReading = reading;
    this.onReadingCallback?.(reading);
  }

  private handleError(err: GeolocationPositionError) {
    // Calm human-readable messages without technical error codes
    let msg = 'Location is temporarily unavailable';
    if (err.code === 1) { // PERMISSION_DENIED
      msg = 'Location permission is turned off in your browser settings';
    } else if (err.code === 2) { // POSITION_UNAVAILABLE
      msg = 'Location signal could not be found';
    } else if (err.code === 3) { // TIMEOUT
      msg = 'Location request took too long';
    }
    this.onErrorCallback?.(msg);
  }

  public destroy() {
    this.stop();
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }
}
