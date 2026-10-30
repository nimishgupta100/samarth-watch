/**
 * BLESmartWatchScanner
 *
 * A full Web Bluetooth scanner component that mirrors the Android BLE app logic.
 * Scans for any BLE device, connects to GATT, discovers all services/characteristics,
 * reads HR, SpO2, Battery live, and feeds data into the wearableIngestEngine.
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  Bluetooth,
  BluetoothOff,
  Heart,
  Battery,
  Activity,
  WifiOff,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Zap,
  X,
} from 'lucide-react';
import { wearableIngestEngine } from '../../wearables/ingest';
import { RawSample } from '../../wearables/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BLESmartWatchScannerProps {
  seniorId: string;
  compact?: boolean;
  lang?: string;
}

type ConnectionState = 'idle' | 'scanning' | 'connecting' | 'connected' | 'disconnected';

interface CharInfo {
  uuid: string;
  properties: string[];
  hexValue: string;
}

interface ServiceInfo {
  uuid: string;
  chars: CharInfo[];
}

// ---------------------------------------------------------------------------
// i18n labels
// ---------------------------------------------------------------------------

const LABELS: Record<string, Record<string, string>> = {
  en: {
    scanBtn: 'Scan for Device',
    connecting: 'Connecting...',
    connected: 'Connected',
    disconnect: 'Disconnect',
    notSupported:
      'Web Bluetooth is not supported in this browser. Please use Chrome or Edge on Android or Desktop. iOS is not supported.',
    statusLogLabel: 'Status Log',
    gattExplorer: 'GATT Services Explorer',
    heartRate: 'Heart Rate',
    spo2: 'SpO2',
    battery: 'Battery',
    bpm: 'bpm',
    noDevice: 'No device connected yet.',
    scanHint: 'Tap the button below to open the browser device picker.',
    deviceName: 'Device',
    properties: 'Properties',
    uuid: 'UUID',
    value: 'Hex Value',
    disconnected: 'Disconnected',
  },
  hi: {
    scanBtn: 'डिवाइस खोजें',
    connecting: 'जुड़ रहे हैं...',
    connected: 'जुड़ गए',
    disconnect: 'अलग करें',
    notSupported:
      'यह ब्राउज़र Web Bluetooth को सपोर्ट नहीं करता। Chrome/Edge पर खोलें। iOS सपोर्टेड नहीं है।',
    statusLogLabel: 'स्थिति लॉग',
    gattExplorer: 'GATT सर्विस एक्सप्लोरर',
    heartRate: 'हृदय गति',
    spo2: 'SpO2',
    battery: 'बैटरी',
    bpm: 'bpm',
    noDevice: 'अभी कोई डिवाइस नहीं जुड़ा।',
    scanHint: 'नीचे बटन दबाएँ और डिवाइस चुनें।',
    deviceName: 'डिवाइस',
    properties: 'गुण',
    uuid: 'UUID',
    value: 'Hex मान',
    disconnected: 'डिस्कनेक्ट',
  },
};

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

function toHex(dataView: DataView): string {
  return Array.from(new Uint8Array(dataView.buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ');
}

function parseHeartRate(val: DataView): number {
  const flags = val.getUint8(0);
  const is16bit = flags & 0x01;
  return is16bit ? val.getUint16(1, true) : val.getUint8(1);
}

function parseBattery(val: DataView): number {
  return val.getUint8(0);
}

function parseSpO2(val: DataView): number {
  // Pulse Oximeter Continuous Measurement (0x2A5F) format:
  // Byte 0: flags; bytes 1-2: SpO2 (SFLOAT); skip SFLOAT decode → use byte 1 directly for most watches
  // Many consumer watches encode SpO2 as a plain uint8 at offset 1
  if (val.byteLength >= 2) {
    const raw = val.getUint8(1);
    if (raw > 0 && raw <= 100) return raw;
  }
  // Fallback: first byte
  const first = val.getUint8(0);
  if (first > 0 && first <= 100) return first;
  return 0;
}

// Known UUIDs for service identification (short-form substring check)
const HR_UUID_FRAG = '180d';
const BATTERY_UUID_FRAG = '180f';
const SPO2_UUID_FRAG = '1822';

// All standard optional service UUIDs to request (broad list for acceptAllDevices)
const OPTIONAL_SERVICES: string[] = [
  '0000180d-0000-1000-8000-00805f9b34fb', // Heart Rate
  '0000180f-0000-1000-8000-00805f9b34fb', // Battery
  '00001822-0000-1000-8000-00805f9b34fb', // Pulse Oximeter
  '0000180a-0000-1000-8000-00805f9b34fb', // Device Information
  '00001800-0000-1000-8000-00805f9b34fb', // Generic Access
  '00001801-0000-1000-8000-00805f9b34fb', // Generic Attribute
  '0000181c-0000-1000-8000-00805f9b34fb', // User Data
  '0000180e-0000-1000-8000-00805f9b34fb', // Bond Management
  '00001810-0000-1000-8000-00805f9b34fb', // Blood Pressure
  '0000181e-0000-1000-8000-00805f9b34fb', // Weight Scale
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const BLESmartWatchScanner: React.FC<BLESmartWatchScannerProps> = ({
  seniorId,
  compact = false,
  lang = 'en',
}) => {
  const L = LABELS[lang] ?? LABELS['en'];

  const [connState, setConnState] = useState<ConnectionState>('idle');
  const [deviceName, setDeviceName] = useState<string>('');
  const [deviceId, setDeviceId] = useState<string>('');
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [spo2, setSpo2] = useState<number | null>(null);
  const [battery, setBattery] = useState<number | null>(null);
  const [services, setServices] = useState<ServiceInfo[]>([]);
  const [statusLog, setStatusLog] = useState<string[]>([]);
  const [gattOpen, setGattOpen] = useState(false);

  const deviceRef = useRef<any>(null);
  const serverRef = useRef<any>(null);
  const notifCleanups = useRef<Array<() => void>>([]);

  const isSupported = 'bluetooth' in navigator;

  // -------------------------------------------------------------------------
  // Log helper
  // -------------------------------------------------------------------------

  const log = useCallback((msg: string) => {
    const ts = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setStatusLog((prev) => [`[${ts}] ${msg}`, ...prev].slice(0, 200));
  }, []);

  // -------------------------------------------------------------------------
  // Ingest helper
  // -------------------------------------------------------------------------

  const ingestMetric = useCallback(
    (metric: 'heart_rate' | 'spo2', value: number, unit: string, dId: string, dName: string) => {
      const sample: RawSample = {
        deviceId: dId || 'ble-device',
        seniorId,
        metric,
        rawValue: value,
        unit,
        measuredAt: Date.now(),
        receivedAt: Date.now(),
        sourceLabel: dName || 'BLE Smartwatch',
      };
      wearableIngestEngine.ingestSample(sample, false, true);
    },
    [seniorId]
  );

  // -------------------------------------------------------------------------
  // Scan & Connect
  // -------------------------------------------------------------------------

  const handleScan = useCallback(async () => {
    if (!isSupported) return;

    setConnState('scanning');
    log('Opening Bluetooth device picker...');

    try {
      const bluetooth = (navigator as any).bluetooth;
      const device = await bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: OPTIONAL_SERVICES,
      });

      setConnState('connecting');
      log(`Device selected: ${device.name || '(unnamed)'} [${device.id}]`);
      deviceRef.current = device;
      setDeviceName(device.name || '(unnamed)');
      setDeviceId(device.id || 'ble-device');

      // Handle device disconnect events
      device.addEventListener('gattserverdisconnected', () => {
        log('Device disconnected (GATT server closed).');
        setConnState('disconnected');
        setHeartRate(null);
        setSpo2(null);
      });

      // Connect to GATT
      log('Connecting to GATT server...');
      const server = await device.gatt.connect();
      serverRef.current = server;
      log('GATT connected. Discovering primary services...');

      const primaryServices = await server.getPrimaryServices();
      log(`Found ${primaryServices.length} primary service(s).`);

      const discoveredServices: ServiceInfo[] = [];

      for (const service of primaryServices) {
        const serviceUUID: string = service.uuid;
        log(`Service: ${serviceUUID}`);

        let chars: any[] = [];
        try {
          chars = await service.getCharacteristics();
        } catch {
          log(`  ⚠ Could not enumerate characteristics for ${serviceUUID}`);
        }

        log(`  → ${chars.length} characteristic(s)`);
        const charInfos: CharInfo[] = [];

        for (const char of chars) {
          const charUUID: string = char.uuid;
          const props = char.properties;
          const propList: string[] = [];
          if (props.read) propList.push('read');
          if (props.write) propList.push('write');
          if (props.notify) propList.push('notify');
          if (props.indicate) propList.push('indicate');
          if (props.writeWithoutResponse) propList.push('writeNoResp');

          let hexVal = '';

          // ── Read raw value ──────────────────────────────────────────────
          if (props.read) {
            try {
              const val: DataView = await char.readValue();
              hexVal = toHex(val);

              // Battery service
              if (serviceUUID.includes(BATTERY_UUID_FRAG)) {
                const pct = parseBattery(val);
                setBattery(pct);
                log(`  Battery: ${pct}%`);
              }
            } catch {
              hexVal = '(read error)';
            }
          }

          // ── HR notifications ────────────────────────────────────────────
          if (serviceUUID.includes(HR_UUID_FRAG) && props.notify) {
            try {
              await char.startNotifications();
              const hrHandler = (event: any) => {
                try {
                  const val: DataView = event.target.value;
                  const bpm = parseHeartRate(val);
                  setHeartRate(bpm);
                  hexVal = toHex(val);
                  log(`  ❤ Heart Rate: ${bpm} bpm`);
                  ingestMetric('heart_rate', bpm, 'bpm', device.id || 'ble-device', device.name || 'BLE Smartwatch');
                } catch {
                  /* ignore parse error */
                }
              };
              char.addEventListener('characteristicvaluechanged', hrHandler);
              notifCleanups.current.push(() => {
                try {
                  char.removeEventListener('characteristicvaluechanged', hrHandler);
                  char.stopNotifications().catch(() => {});
                } catch { /* ignore */ }
              });
              log(`  Heart Rate notifications started`);
            } catch (e: any) {
              log(`  ⚠ HR notify error: ${e?.message}`);
            }
          }

          // ── SpO2 notifications ──────────────────────────────────────────
          if (serviceUUID.includes(SPO2_UUID_FRAG) && props.notify) {
            try {
              await char.startNotifications();
              const spo2Handler = (event: any) => {
                try {
                  const val: DataView = event.target.value;
                  const pct = parseSpO2(val);
                  if (pct > 0) {
                    setSpo2(pct);
                    log(`  🩸 SpO2: ${pct}%`);
                    ingestMetric('spo2', pct, '%', device.id || 'ble-device', device.name || 'BLE Smartwatch');
                  }
                } catch {
                  /* ignore */
                }
              };
              char.addEventListener('characteristicvaluechanged', spo2Handler);
              notifCleanups.current.push(() => {
                try {
                  char.removeEventListener('characteristicvaluechanged', spo2Handler);
                  char.stopNotifications().catch(() => {});
                } catch { /* ignore */ }
              });
              log(`  SpO2 notifications started`);
            } catch (e: any) {
              log(`  ⚠ SpO2 notify error: ${e?.message}`);
            }
          }

          charInfos.push({ uuid: charUUID, properties: propList, hexValue: hexVal });
        }

        discoveredServices.push({ uuid: serviceUUID, chars: charInfos });
      }

      setServices(discoveredServices);
      setConnState('connected');
      log(`✅ Connected to ${device.name || '(unnamed)'}`);
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes('cancelled') || msg.includes('chosen')) {
        log('Device picker cancelled by user.');
      } else {
        log(`❌ Error: ${msg}`);
      }
      setConnState('idle');
    }
  }, [isSupported, log, ingestMetric]);

  // -------------------------------------------------------------------------
  // Disconnect
  // -------------------------------------------------------------------------

  const handleDisconnect = useCallback(() => {
    notifCleanups.current.forEach((fn) => fn());
    notifCleanups.current = [];
    try {
      if (serverRef.current?.connected) {
        serverRef.current.disconnect();
      }
    } catch { /* ignore */ }
    serverRef.current = null;
    deviceRef.current = null;
    setConnState('idle');
    setHeartRate(null);
    setSpo2(null);
    setBattery(null);
    setServices([]);
    setDeviceName('');
    setDeviceId('');
    log('Disconnected by user.');
  }, [log]);

  // -------------------------------------------------------------------------
  // Render: Not Supported
  // -------------------------------------------------------------------------

  if (!isSupported) {
    return (
      <div className="rounded-2xl bg-[#EBF3EE] border border-[#CBDCD2] p-6 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-white border-2 border-[#CBDCD2] flex items-center justify-center">
          <BluetoothOff className="w-8 h-8 text-[#4A6B5D]" />
        </div>
        <div>
          <p className="font-bold text-[#132A22] text-lg mb-1">Web Bluetooth Not Supported</p>
          <p className="text-[#4A6B5D] text-sm leading-relaxed max-w-sm">{L.notSupported}</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center text-xs">
          <span className="px-3 py-1 rounded-full bg-white border border-[#CBDCD2] text-[#1C3F32] font-semibold">
            ✅ Chrome on Android
          </span>
          <span className="px-3 py-1 rounded-full bg-white border border-[#CBDCD2] text-[#1C3F32] font-semibold">
            ✅ Chrome on Desktop
          </span>
          <span className="px-3 py-1 rounded-full bg-white border border-[#CBDCD2] text-[#1C3F32] font-semibold">
            ✅ Edge on Desktop
          </span>
          <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 font-semibold">
            ❌ iOS Safari
          </span>
          <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 font-semibold">
            ❌ Firefox
          </span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render: Connected state — header card
  // -------------------------------------------------------------------------

  const connectedHeader = connState === 'connected' && (
    <div className="rounded-2xl bg-[#1C3F32] text-white p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <Bluetooth className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm truncate">{deviceName || L.deviceName}</p>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            {L.connected}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={handleDisconnect}
        className="shrink-0 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
      >
        <WifiOff className="w-4 h-4" />
        <span>{L.disconnect}</span>
      </button>
    </div>
  );

  // -------------------------------------------------------------------------
  // Render: Vitals row
  // -------------------------------------------------------------------------

  const vitalsRow = connState === 'connected' && (
    <div className={`grid gap-3 ${compact ? 'grid-cols-3' : 'grid-cols-1 sm:grid-cols-3'}`}>
      {/* Heart Rate */}
      <div className="rounded-2xl bg-white border border-[#CBDCD2] p-4 flex flex-col items-center gap-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-50/40 pointer-events-none" />
        <Heart className="w-5 h-5 text-red-500 relative z-10" />
        <p className="text-[10px] font-semibold text-[#4A6B5D] uppercase tracking-wider relative z-10">
          {L.heartRate}
        </p>
        {heartRate !== null ? (
          <p className="text-4xl font-black text-red-600 leading-none relative z-10 animate-pulse">
            {heartRate}
          </p>
        ) : (
          <p className="text-2xl font-bold text-[#CBDCD2] relative z-10">--</p>
        )}
        <p className="text-[10px] text-[#4A6B5D] relative z-10">{L.bpm}</p>
      </div>

      {/* SpO2 */}
      <div className="rounded-2xl bg-white border border-[#CBDCD2] p-4 flex flex-col items-center gap-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-50/40 pointer-events-none" />
        <Activity className="w-5 h-5 text-blue-500 relative z-10" />
        <p className="text-[10px] font-semibold text-[#4A6B5D] uppercase tracking-wider relative z-10">
          {L.spo2}
        </p>
        {spo2 !== null ? (
          <p className="text-4xl font-black text-blue-600 leading-none relative z-10">{spo2}</p>
        ) : (
          <p className="text-2xl font-bold text-[#CBDCD2] relative z-10">--</p>
        )}
        <p className="text-[10px] text-[#4A6B5D] relative z-10">%</p>
      </div>

      {/* Battery */}
      <div className="rounded-2xl bg-white border border-[#CBDCD2] p-4 flex flex-col items-center gap-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-green-50/40 pointer-events-none" />
        <Battery className="w-5 h-5 text-[#1C3F32] relative z-10" />
        <p className="text-[10px] font-semibold text-[#4A6B5D] uppercase tracking-wider relative z-10">
          {L.battery}
        </p>
        {battery !== null ? (
          <p className="text-4xl font-black text-[#1C3F32] leading-none relative z-10">{battery}</p>
        ) : (
          <p className="text-2xl font-bold text-[#CBDCD2] relative z-10">--</p>
        )}
        <p className="text-[10px] text-[#4A6B5D] relative z-10">%</p>
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // Render: GATT Explorer
  // -------------------------------------------------------------------------

  const gattExplorer = connState === 'connected' && services.length > 0 && (
    <div className="rounded-2xl border border-[#CBDCD2] overflow-hidden">
      <button
        type="button"
        onClick={() => setGattOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#EBF3EE] hover:bg-[#dceae3] transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#1C3F32]" />
          <span className="font-bold text-sm text-[#132A22]">{L.gattExplorer}</span>
          <span className="px-1.5 py-0.5 rounded-full bg-[#1C3F32] text-white text-[10px] font-bold">
            {services.length}
          </span>
        </div>
        {gattOpen ? (
          <ChevronUp className="w-4 h-4 text-[#4A6B5D]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#4A6B5D]" />
        )}
      </button>

      {gattOpen && (
        <div className="overflow-x-auto max-h-72 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#132A22] text-white sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">{L.uuid}</th>
                <th className="px-3 py-2 text-left font-semibold">{L.properties}</th>
                <th className="px-3 py-2 text-left font-semibold">{L.value}</th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc) => (
                <React.Fragment key={svc.uuid}>
                  <tr className="bg-[#EBF3EE]">
                    <td
                      colSpan={3}
                      className="px-3 py-1.5 font-bold text-[#132A22] text-[10px] uppercase tracking-wider"
                    >
                      Service: {svc.uuid}
                    </td>
                  </tr>
                  {svc.chars.map((ch) => (
                    <tr key={ch.uuid} className="border-b border-[#CBDCD2] hover:bg-[#f5faf7]">
                      <td className="px-3 py-1.5 font-mono text-[#4A6B5D] break-all">
                        {ch.uuid}
                      </td>
                      <td className="px-3 py-1.5 text-[#1C3F32]">
                        {ch.properties.join(', ')}
                      </td>
                      <td className="px-3 py-1.5 font-mono text-[#132A22] break-all">
                        {ch.hexValue || '—'}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // -------------------------------------------------------------------------
  // Render: Status Log
  // -------------------------------------------------------------------------

  const statusLogSection = (connState === 'connected' || statusLog.length > 0) && (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-[#4A6B5D] uppercase tracking-wider">
        {L.statusLogLabel}
      </p>
      <textarea
        readOnly
        value={statusLog.join('\n')}
        rows={compact ? 4 : 6}
        className="w-full rounded-xl border border-[#CBDCD2] bg-[#132A22] text-green-300 font-mono text-[11px] px-3 py-2 resize-none focus:outline-none"
        placeholder="(log empty)"
      />
    </div>
  );

  // -------------------------------------------------------------------------
  // Render: Idle / Scanning / Connecting states
  // -------------------------------------------------------------------------

  const idlePanel = (connState === 'idle' || connState === 'disconnected') && (
    <div className="rounded-2xl bg-[#EBF3EE] border border-[#CBDCD2] p-6 flex flex-col items-center gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-white border-2 border-[#CBDCD2] flex items-center justify-center">
        <Bluetooth className="w-8 h-8 text-[#1C3F32]" />
      </div>
      {connState === 'disconnected' && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
          <AlertTriangle className="w-4 h-4" />
          <span>{L.disconnected}</span>
        </div>
      )}
      <div>
        <p className="font-bold text-[#132A22] text-base">{L.noDevice}</p>
        <p className="text-[#4A6B5D] text-sm mt-1">{L.scanHint}</p>
      </div>
      <button
        type="button"
        onClick={handleScan}
        className="w-full min-h-[52px] px-6 py-3 rounded-2xl bg-[#1C3F32] hover:bg-[#132A22] text-white font-bold text-[18px] flex items-center justify-center gap-3 transition-colors"
      >
        <Bluetooth className="w-5 h-5" />
        <span>{L.scanBtn}</span>
      </button>
    </div>
  );

  const scanningPanel = (connState === 'scanning' || connState === 'connecting') && (
    <div className="rounded-2xl bg-[#EBF3EE] border border-[#CBDCD2] p-8 flex flex-col items-center gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-white border-2 border-[#1C3F32] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-[#1C3F32] animate-spin" />
      </div>
      <p className="font-bold text-[#132A22] text-lg">
        {connState === 'scanning' ? 'Opening device picker…' : L.connecting}
      </p>
      <p className="text-[#4A6B5D] text-sm">
        {connState === 'scanning'
          ? 'Select your watch from the browser popup.'
          : `Connecting to ${deviceName || 'device'}…`}
      </p>
    </div>
  );

  // -------------------------------------------------------------------------
  // Final render
  // -------------------------------------------------------------------------

  return (
    <div className={`space-y-4 ${compact ? 'text-sm' : ''}`}>
      {idlePanel}
      {scanningPanel}
      {connState === 'connected' && (
        <>
          {connectedHeader}
          {vitalsRow}
          {gattExplorer}
          {statusLogSection}
        </>
      )}
      {connState !== 'connected' && statusLog.length > 0 && statusLogSection}
    </div>
  );
};

export default BLESmartWatchScanner;
