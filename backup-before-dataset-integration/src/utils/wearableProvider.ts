import {
  HEART_RATE_HIGH_LIMIT,
  HEART_RATE_LOW_LIMIT,
  SPO2_LOW_LIMIT,
  READING_INTERVAL_MS,
} from './wearableConstants';

export type WearableSource = 'demo_simulator' | 'web_bluetooth' | 'manual';
export type WearableScenario = 'normal' | 'rising_hr' | 'low_spo2' | 'fall' | 'device_sos';

export interface WearableReading {
  id: string;
  type: 'heart_rate' | 'spo2' | 'steps' | 'fall_detected';
  value: number;
  valueSecondary?: number;
  unit: string;
  source: WearableSource;
  timestamp: number;
  deviceName: string;
  isSimulated: true; // always true in demo
}

export type WearableEvent =
  | 'fall_detected'
  | 'sos_button'
  | 'hr_high'
  | 'hr_low'
  | 'spo2_low'
  | 'normal';

export interface IWearableProvider {
  connect(): Promise<void>;
  disconnect(): void;
  getLatestReadings(): WearableReading[];
  onEvent(cb: (event: WearableEvent, reading: WearableReading) => void): void;
  injectScenario(scenario: WearableScenario): void;
}

function makeId() {
  return 'wr-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
}

function makeReading(
  type: WearableReading['type'],
  value: number,
  unit: string,
  source: WearableSource = 'demo_simulator'
): WearableReading {
  return {
    id: makeId(),
    type,
    value,
    unit,
    source,
    timestamp: Date.now(),
    deviceName: 'Samarth Demo Band (simulated)',
    isSimulated: true,
  };
}

/**
 * DEMO: Simulates a wearable device with realistic readings.
 * PRODUCTION: Replace with Web Bluetooth (navigator.bluetooth.requestDevice)
 * or a backend-polled device API. All reads here are browser-local.
 */
export class DemoWearableSimulator implements IWearableProvider {
  private readings: WearableReading[] = [];
  private eventCallbacks: Array<(e: WearableEvent, r: WearableReading) => void> = [];
  private scenario: WearableScenario = 'normal';
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private connected = false;

  async connect(): Promise<void> {
    if (this.connected) return;
    this.connected = true;
    this._generateReading();
    this.intervalId = setInterval(() => this._generateReading(), READING_INTERVAL_MS);
  }

  disconnect(): void {
    this.connected = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getLatestReadings(): WearableReading[] {
    return this.readings.slice(0, 10);
  }

  onEvent(cb: (event: WearableEvent, reading: WearableReading) => void): void {
    this.eventCallbacks.push(cb);
  }

  injectScenario(scenario: WearableScenario): void {
    this.scenario = scenario;
    this._generateReading();
    // Reset to normal after one injected reading
    if (scenario !== 'normal') {
      setTimeout(() => { this.scenario = 'normal'; }, READING_INTERVAL_MS + 1000);
    }
  }

  private _generateReading(): void {
    let hr = 72 + Math.round((Math.random() - 0.5) * 10);
    let spo2 = 97 + Math.round((Math.random() - 0.5) * 2);
    let event: WearableEvent = 'normal';

    switch (this.scenario) {
      case 'rising_hr':
        hr = 118 + Math.round(Math.random() * 15);
        event = hr > HEART_RATE_HIGH_LIMIT ? 'hr_high' : 'normal';
        break;
      case 'low_spo2':
        spo2 = 85 + Math.round(Math.random() * 4);
        event = spo2 < SPO2_LOW_LIMIT ? 'spo2_low' : 'normal';
        break;
      case 'fall':
        event = 'fall_detected';
        break;
      case 'device_sos':
        event = 'sos_button';
        break;
      default:
        if (hr > HEART_RATE_HIGH_LIMIT) event = 'hr_high';
        else if (hr < HEART_RATE_LOW_LIMIT) event = 'hr_low';
        else if (spo2 < SPO2_LOW_LIMIT) event = 'spo2_low';
        break;
    }

    const hrReading = makeReading('heart_rate', hr, 'bpm');
    const spo2Reading = makeReading('spo2', spo2, '%');

    this.readings = [hrReading, spo2Reading, ...this.readings];

    if (event !== 'normal') {
      const triggerReading = event === 'spo2_low' ? spo2Reading : hrReading;
      this.eventCallbacks.forEach((cb) => cb(event, triggerReading));
    }
  }
}

export const demoWearableSimulator = new DemoWearableSimulator();
